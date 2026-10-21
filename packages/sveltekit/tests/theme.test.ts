import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../src/app.html', import.meta.url), 'utf8');
const bootstrap = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(bootstrap, 'Theme bootstrap must run before the application renders.');

function initialise(saved: string | null, storageUnavailable = false) {
	const element = { dataset: { themePreference: '' }, style: { colorScheme: '' } };
	const warnings: unknown[][] = [];
	runInNewContext(bootstrap!, {
		document: { documentElement: element },
		matchMedia: () => ({ matches: false }),
		localStorage: {
			getItem(key: string) {
				assert.equal(key, 'onus-theme');
				if (storageUnavailable) throw new Error('Storage unavailable');
				return saved;
			}
		},
		console: { warn: (...args: unknown[]) => warnings.push(args) }
	});
	return { element, warnings };
}

test('theme defaults to the system scheme before first paint', () => {
	assert.ok(html.includes('color-scheme: light dark'));
	assert.ok(html.indexOf('<script>') < html.indexOf('%sveltekit.head%'));
	for (const saved of [null, 'system', '', 'invalid']) {
		const { element, warnings } = initialise(saved);
		assert.equal(element.dataset.themePreference, 'system');
		assert.equal(element.style.colorScheme, 'light dark');
		assert.equal(warnings.length, 0);
	}
});

test('saved light and dark preferences override the system before first paint', () => {
	for (const saved of ['light', 'dark']) {
		const { element } = initialise(saved);
		assert.equal(element.dataset.themePreference, saved);
		assert.equal(element.style.colorScheme, saved);
	}
});

test('unavailable storage is reported and leaves the CSS system default intact', () => {
	const { element, warnings } = initialise(null, true);
	assert.equal(element.style.colorScheme, '');
	assert.equal(warnings.length, 1);
	assert.match(String(warnings[0][0]), /Unable to read ONUS theme preference/);
});
