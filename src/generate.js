import c from 'picocolors';
import { collectHtmlPages } from './collect.js';
import { renderOgImage, renderAllPagesOg } from './render.js';
import fs from 'node:fs';
import path from 'node:path';

export const CONFIG_FILE_NAME = 'og-images.config.js';

export const CONFIG_FILE_PATH = path.join(process.cwd(), CONFIG_FILE_NAME);

/**
 * @typedef UserConfig
 * @property {import('./render.js').RenderOptions} renderOptions
 * @property {import('./api.js').Template} template
 */

/**
 * @returns {Promise<UserConfig>}
 */
async function loadUserConfig() {
	/** @type {unknown} */
	const config = await import(CONFIG_FILE_PATH).catch(() => {
		throw Error('Configuration not found.');
	});
	if (typeof config !== 'object' || !config)
		throw Error('Configuration is invalid.');
	if ('template' in config === false)
		throw Error('No template found in configuration.');
	if (typeof config.template !== 'function')
		throw Error('Template should be a returning function.');

	if ('renderOptions' in config === false || !config.renderOptions)
		throw Error('No render options found in configuration.');
	if (typeof config.renderOptions !== 'object')
		throw Error('Return options should be an object.');
	if ('satori' in config.renderOptions === false)
		throw Error('Satori options are mandatory.');

	// We assume the user has their config. properly typed from there,
	// further libs will throw in case of an invalid config.
	const resvg =
		/** @type {import('@resvg/resvg-js').ResvgRenderOptions} */
		('resvg' in config.renderOptions ? config.renderOptions.resvg : {});
	const satori = /** @type {import('satori').SatoriOptions} */ (
		config.renderOptions.satori
	);

	return {
		template:
			/** @type {UserConfig['template']} Lit render should gobble any shape */
			(config.template),
		renderOptions: { satori, resvg },
	};
}

/**
 *
 * @param {import('./render.js').RenderedOg[]} renderedImages
 * @param {string} out
 */
async function save(renderedImages, out) {
	await Promise.all(
		renderedImages.map(async (rendered) => {
			const dest = path.join(
				process.cwd(),
				out,
				rendered.path.slice(0, rendered.path.lastIndexOf('.')) + '.png',
			);

			await fs.promises
				.mkdir(path.dirname(dest), { recursive: true })
				.catch(() => null);

			await fs.promises.writeFile(dest, rendered.data);
		}),
	);

	console.log(c.bold(c.green(renderedImages.length + ' images generated.')));
}

/**
 * @param {import("./collect").CollectOptions} [options]
 * @return {Promise<void>}
 * */
export async function generateOgImages(options) {
	const config = await loadUserConfig();

	const optionsOrDefaults = {
		base: options?.base || './dist',
		out: options?.out || './dist/og',
		json: options?.json || './dist/og/index.json',
	};

	const pages = await collectHtmlPages(optionsOrDefaults);

	const renderedImages = await renderAllPagesOg(pages, config);

	await save(renderedImages, optionsOrDefaults.out);

	console.log(
		c.magenta('OG images generation completed successfully. ') +
			c.blue('Now exiting.'),
	);
}
