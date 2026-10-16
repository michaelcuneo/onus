import { createHash, createHmac, randomBytes, randomInt, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { dev } from '$app/env';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import {
  DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand,
  TransactWriteCommand, UpdateCommand
} from '@aws-sdk/lib-dynamodb';
import type { Cookies } from '@sveltejs/kit';
import { Resource } from 'sst';

const scrypt = promisify(scryptCallback);
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true }
});
const ses = new SESv2Client({});
const table = Resource.OnusAuthData.name;
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const CODE_LIFETIME = 60 * 15;
const CODE_RESEND = 60;
const CODE_ATTEMPTS = 8;
const LOGIN_ATTEMPTS = 10;
const LOGIN_WINDOW = 60 * 15;
const COOKIE = dev ? 'onus_dev_session' : '__Host-onus_session';

type ChallengePurpose = 'VERIFY' | 'RESET';

type UserRecord = {
  pk: string;
  sk: string;
  id: string;
  email: string;
  name: string;
  enabled: boolean;
  emailVerified: boolean;
  status: 'PENDING' | 'ACTIVE' | 'DISABLED';
  passwordSalt: string;
  passwordHash: string;
  authEpoch: number;
  createdAt: string;
  updatedAt: string;
};

export type OnusUser = Pick<
  UserRecord,
  'id' | 'email' | 'name' | 'emailVerified' | 'createdAt'
>;

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}
function emailKey(email: string): string {
  return 'AUTH#EMAIL#' + email;
}
function userKey(id: string) {
  return { pk: 'USER#' + id, sk: 'PROFILE' };
}
function codeKey(purpose: ChallengePurpose, email: string) {
  return { pk: 'AUTH#CODE#' + purpose + '#' + email, sk: 'META' };
}
function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
function codeHash(purpose: ChallengePurpose, email: string, code: string): string {
  const pepper = String(Resource.OnusAuthPepper.value ?? '');
  if (pepper.length < 32) throw new Error('ONUS authentication secret is not configured.');
  return createHmac('sha256', pepper).update(purpose + ':' + email + ':' + code).digest('hex');
}
function publicUser(record: UserRecord): OnusUser {
  return {
    id: record.id,
    email: record.email,
    name: record.name,
    emailVerified: record.emailVerified,
    createdAt: record.createdAt
  };
}
function cookieOptions(maxAge?: number) {
  return {
    path: '/',
    secure: !dev,
    sameSite: 'lax' as const,
    httpOnly: true,
    ...(maxAge === undefined ? {} : { maxAge })
  };
}
function assertValidPassword(password: string) {
  if (password.length < 12 || password.length > 256) {
    throw new Error('Password must be between 12 and 256 characters.');
  }
}
export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}
function assertEmail(value: string) {
  if (value.length > 254 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
    throw new Error('Enter a valid email address.');
  }
}
async function passwordDigest(password: string, salt?: string) {
  const actualSalt = salt ? Buffer.from(salt, 'base64') : randomBytes(16);
  const derived = (await scrypt(password, actualSalt, 64)) as Buffer;
  return { salt: actualSalt.toString('base64'), digest: derived.toString('base64') };
}
async function matchesPassword(password: string, record: UserRecord): Promise<boolean> {
  const actual = await passwordDigest(password, record.passwordSalt);
  const supplied = Buffer.from(actual.digest, 'base64');
  const expected = Buffer.from(record.passwordHash, 'base64');
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
async function getUserRecord(id: string): Promise<UserRecord | null> {
  const result = await db.send(new GetCommand({
    TableName: table, Key: userKey(id), ConsistentRead: true
  }));
  return (result.Item as UserRecord | undefined) ?? null;
}
async function lookupUser(email: string): Promise<UserRecord | null> {
  const lookup = await db.send(new GetCommand({
    TableName: table, Key: { pk: emailKey(email), sk: 'USER' },
    ConsistentRead: true
  }));
  const id = lookup.Item?.userId;
  return id ? getUserRecord(String(id)) : null;
}
function usable(record: UserRecord | null): record is UserRecord {
  return Boolean(record?.enabled && record?.emailVerified && record?.status === 'ACTIVE');
}
async function sendCode(email: string, code: string, purpose: ChallengePurpose) {
  const sender = String(Resource.OnusMailFrom.value ?? '').trim();
  const subject = purpose === 'VERIFY' ? 'Verify your ONUS account' : 'Reset your ONUS password';
  const body = purpose === 'VERIFY'
    ? 'Your ONUS email verification code is: ' + code
    : 'Your ONUS password reset code is: ' + code;
  if (dev && process.env.ONUS_AUTH_DEV_EMAIL === 'stdout') {
    console.info('[ONUS development email] ' + subject + ' to ' + email + ': ' + code);
    return;
  }
  if (!sender || !sender.includes('@')) {
    throw new Error('ONUS email sender is not configured.');
  }
  await ses.send(new SendEmailCommand({
    FromEmailAddress: sender,
    Destination: { ToAddresses: [email] },
    Content: { Simple: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: { Text: { Data: body + '\n\nThis code expires in 15 minutes.', Charset: 'UTF-8' } }
    } }
  }));
}
async function issueCode(purpose: ChallengePurpose, userId: string, email: string) {
  const code = String(randomInt(0, 100_000_000)).padStart(8, '0');
  const now = nowSeconds();
  const key = codeKey(purpose, email);
  const digest = codeHash(purpose, email, code);
  try {
    await db.send(new UpdateCommand({
      TableName: table, Key: key,
      UpdateExpression: 'SET codeHash = :hash, userId = :id, issuedAt = :now, expiresAt = :expires, ttl = :expires, attempts = :zero',
      ConditionExpression: 'attribute_not_exists(pk) OR issuedAt <= :cutoff',
      ExpressionAttributeValues: {
        ':hash': digest, ':id': userId, ':now': now,
        ':cutoff': now - CODE_RESEND, ':expires': now + CODE_LIFETIME, ':zero': 0
      }
    }));
  } catch (error) {
    if (isConditional(error)) throw new Error('Please wait a minute before requesting another code.');
    throw error;
  }
  try {
    await sendCode(email, code, purpose);
  } catch (error) {
    // Permit an immediate retry when delivery failed; do not expose the secret code.
    await db.send(new DeleteCommand({
      TableName: table, Key: key,
      ConditionExpression: 'codeHash = :hash',
      ExpressionAttributeValues: { ':hash': digest }
    })).catch(() => {});
    throw error;
  }
}
function isConditional(error: unknown) {
  return error instanceof Error &&
    (error.name === 'ConditionalCheckFailedException' || error.name === 'TransactionCanceledException');
}
async function consumeCode(purpose: ChallengePurpose, email: string, code: string): Promise<string> {
  if (!/^\d{8}$/.test(code)) throw new Error('Invalid or expired code.');
  const key = codeKey(purpose, email);
  const record = await db.send(new GetCommand({
    TableName: table, Key: key, ConsistentRead: true
  }));
  const item = record.Item;
  const now = nowSeconds();
  if (!item || Number(item.expiresAt) <= now || Number(item.attempts) >= CODE_ATTEMPTS) {
    throw new Error('Invalid or expired code.');
  }
  const actual = Buffer.from(codeHash(purpose, email, code), 'hex');
  const expected = Buffer.from(String(item.codeHash), 'hex');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    await db.send(new UpdateCommand({
      TableName: table, Key: key,
      UpdateExpression: 'SET attempts = attempts + :one',
      ConditionExpression: 'attribute_exists(pk) AND expiresAt > :now AND attempts < :max',
      ExpressionAttributeValues: { ':one': 1, ':now': now, ':max': CODE_ATTEMPTS }
    })).catch(() => {});
    throw new Error('Invalid or expired code.');
  }
  try {
    const consumed = await db.send(new DeleteCommand({
      TableName: table, Key: key,
      ConditionExpression: 'codeHash = :hash AND expiresAt > :now AND attempts < :max',
      ExpressionAttributeValues: { ':hash': String(item.codeHash), ':now': now, ':max': CODE_ATTEMPTS },
      ReturnValues: 'ALL_OLD'
    }));
    return String(consumed.Attributes?.userId);
  } catch (error) {
    if (isConditional(error)) throw new Error('Invalid or expired code.');
    throw error;
  }
}
async function sessionFor(user: UserRecord, cookies: Cookies) {
  const token = randomBytes(32).toString('base64url');
  const now = nowSeconds();
  await db.send(new PutCommand({
    TableName: table, Item: {
      pk: 'SESSION#' + hash(token), sk: 'META',
      userId: user.id, authEpoch: user.authEpoch,
      createdAt: now, expiresAt: now + SESSION_MAX_AGE, ttl: now + SESSION_MAX_AGE
    }
  }));
  cookies.set(COOKIE, token, cookieOptions(SESSION_MAX_AGE));
}
export async function getCurrentUser(cookies: Cookies): Promise<OnusUser | null> {
  const token = cookies.get(COOKIE);
  if (!token) return null;
  const result = await db.send(new GetCommand({
    TableName: table, Key: { pk: 'SESSION#' + hash(token), sk: 'META' },
    ConsistentRead: true
  }));
  const session = result.Item;
  if (!session || Number(session.expiresAt) <= nowSeconds()) return null;
  const user = await getUserRecord(String(session.userId));
  if (!usable(user) || Number(user.authEpoch) !== Number(session.authEpoch)) return null;
  return publicUser(user);
}
export async function registerUser(input: { name: string; email: string; password: string }) {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  assertEmail(email);
  assertValidPassword(input.password);
  if (name.length < 2 || name.length > 120) throw new Error('Name must be between 2 and 120 characters.');
  const id = randomUUID();
  const now = new Date().toISOString();
  const password = await passwordDigest(input.password);
  try {
    await db.send(new TransactWriteCommand({ TransactItems: [
      { Put: {
        TableName: table, Item: { pk: emailKey(email), sk: 'USER', userId: id },
        ConditionExpression: 'attribute_not_exists(pk)'
      } },
      { Put: {
        TableName: table, Item: {
          ...userKey(id), id, name, email, enabled: true, emailVerified: false,
          status: 'PENDING', authEpoch: 0, passwordSalt: password.salt,
          passwordHash: password.digest, createdAt: now, updatedAt: now
        }, ConditionExpression: 'attribute_not_exists(pk)'
      } }
    ] }));
  } catch (error) {
    if (isConditional(error)) throw new Error('Unable to register this email. Sign in or reset your password.');
    throw error;
  }
  await issueCode('VERIFY', id, email);
}
export async function resendVerification(emailInput: string) {
  const email = normalizeEmail(emailInput);
  assertEmail(email);
  const user = await lookupUser(email);
  if (user && user.status === 'PENDING') await issueCode('VERIFY', user.id, email);
}
export async function verifyEmail(emailInput: string, code: string, cookies: Cookies) {
  const email = normalizeEmail(emailInput);
  assertEmail(email);
  const id = await consumeCode('VERIFY', email, code.trim());
  const now = new Date().toISOString();
  await db.send(new UpdateCommand({
    TableName: table, Key: userKey(id),
    UpdateExpression: 'SET emailVerified = :yes, #status = :active, updatedAt = :now',
    ConditionExpression: '#status = :pending AND email = :email',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':yes': true, ':active': 'ACTIVE', ':pending': 'PENDING',
      ':email': email, ':now': now
    }
  }));
  const user = await getUserRecord(id);
  if (!usable(user)) throw new Error('Account activation failed.');
  await sessionFor(user, cookies);
}
async function loginRateAllowed(email: string) {
  const now = nowSeconds();
  const key = { pk: 'AUTH#LOGIN#' + email + '#' + Math.floor(now / LOGIN_WINDOW), sk: 'META' };
  const result = await db.send(new GetCommand({ TableName: table, Key: key, ConsistentRead: true }));
  return { key, allowed: Number(result.Item?.attempts ?? 0) < LOGIN_ATTEMPTS };
}
async function recordFailedLogin(key: { pk: string; sk: string }) {
  const now = nowSeconds();
  await db.send(new UpdateCommand({
    TableName: table, Key: key,
    UpdateExpression: 'SET attempts = if_not_exists(attempts, :zero) + :one, ttl = :ttl',
    ExpressionAttributeValues: { ':zero': 0, ':one': 1, ':ttl': now + LOGIN_WINDOW * 2 }
  }));
}
export async function loginUser(emailInput: string, password: string, cookies: Cookies) {
  const email = normalizeEmail(emailInput);
  assertEmail(email);
  const rate = await loginRateAllowed(email);
  if (!rate.allowed) throw new Error('Too many attempts. Try again later.');
  const user = await lookupUser(email);
  if (!usable(user) || !await matchesPassword(password, user)) {
    await recordFailedLogin(rate.key);
    throw new Error('Invalid email or password.');
  }
  await sessionFor(user, cookies);
}
export async function requestPasswordReset(emailInput: string) {
  const email = normalizeEmail(emailInput);
  assertEmail(email);
  const user = await lookupUser(email);
  if (usable(user)) await issueCode('RESET', user.id, email);
}
export async function resetPassword(emailInput: string, code: string, password: string) {
  const email = normalizeEmail(emailInput);
  assertEmail(email);
  assertValidPassword(password);
  const id = await consumeCode('RESET', email, code.trim());
  const digest = await passwordDigest(password);
  await db.send(new UpdateCommand({
    TableName: table, Key: userKey(id),
    UpdateExpression: 'SET passwordSalt = :salt, passwordHash = :hash, updatedAt = :now ADD authEpoch :one',
    ConditionExpression: 'email = :email AND #status = :active',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':salt': digest.salt, ':hash': digest.digest, ':now': new Date().toISOString(),
      ':one': 1, ':email': email, ':active': 'ACTIVE'
    }
  }));
}
export async function logoutUser(cookies: Cookies) {
  const token = cookies.get(COOKIE);
  if (token) await db.send(new DeleteCommand({
    TableName: table, Key: { pk: 'SESSION#' + hash(token), sk: 'META' }
  }));
  cookies.delete(COOKIE, { path: '/' });
}
