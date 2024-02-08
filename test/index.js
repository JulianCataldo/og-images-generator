import test from 'node:test';
import assert from 'node:assert';

import * as api from '../src/api.js';
import { hash } from './utils.js';

const options = {
	base: process.cwd() + '/test/__fixtures__/pages',
	out: process.cwd() + '/test/__fixtures__/.test-outputs',
	json: process.cwd() + '/test/__fixtures__/.test-outputs/index.json',
};

test('Collect HTML pages metadata', async (t) => {
	const pages = await api.collectHtmlPages(options);

	assert.equal(hash(pages), 'c0a4d63001e47bd28ee3b2e84f11345a');
});

test('Fetch Source Sans', async (t) => {
	const font = await api.fetchFont(api.SOURCE_SANS_FONT_URL);

	assert.equal(hash(font), '060e4e9e30bcb9ae675a80328a87a687');
});

test('Load user config', async (t) => {
	const config = await api.loadUserConfig(
		process.cwd() + '/test/__fixtures__/og-images.config.fixture.js',
	);

	assert.ok('template' in config);
	assert.ok('resvg' in config.renderOptions);
	assert.ok('satori' in config.renderOptions);
});

test('Generate single image', async (t) => {
	const config = await api.loadUserConfig(
		process.cwd() + '/test/__fixtures__/og-images.config.fixture.js',
	);

	const image = await api.renderOgImage(config, {
		path: '/nested/page',
		meta: {
			tags: { 'og:title': 'hello', 'og:description': 'there' },
			jsonLds: [],
		},
	});

	assert.equal(hash(image), '1713e565e6e51914980e4ca9c7efa832');
});
