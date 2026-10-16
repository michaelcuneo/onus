import type { OnusUser } from './lib/server/auth';

declare global {
  namespace App {
    interface Locals {
      user: OnusUser | null;
    }
  }
}

export {};
