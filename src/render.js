import satori from 'satori';
import { html as satoriHtml } from 'satori-html';
import { render as renderLit } from '@lit-labs/ssr';
import { collectResultSync } from '@lit-labs/ssr/lib/render-result.js';
import { Resvg } from '@resvg/resvg-js';

/**
 * @param {string} fontUrl
 * @returns {Promise<ArrayBuffer>}
 */
export const fetchFont = async (fontUrl) =>
	fetch(fontUrl).then((response) => response.arrayBuffer());

export const OG_DIMENSIONS = /** @type {const} */ ({
	width: 1200,
	height: 630,
});

const SOURCE_SANS_FONT_URL =
	'https://unpkg.com/typeface-source-sans-pro@1.1.13/files/source-sans-pro-400.woff';

export const SOURCE_SANS_FONT = async () => ({
	name: 'Source Sans Pro',
	data: await fetchFont(SOURCE_SANS_FONT_URL),
});

/**
 * @typedef RenderedOg
 * @property {string} path
 * @property {Buffer} data
 */
/**
 * @typedef RenderOgOptions
 * @property {import('./api.js').Metadata} [metadata=[]]
 */
/**
 * @typedef RenderOptions
 * @property {import('satori').SatoriOptions} satori
 * @property {import('@resvg/resvg-js').ResvgRenderOptions} [resvg]
 */

/**
 * @param {import('./generate.js').UserConfig} userConfig
 * @param {RenderOgOptions} [options]
 * @returns {Promise<Buffer>}
 */
export async function renderOgImage(userConfig, options) {
	const metadata = options?.metadata || {};
	const templateOptions = { metadata };

	const template = userConfig.template(templateOptions);

	const litSsred = collectResultSync(renderLit(template));
	const satoried = /** @type {import('react').ReactNode} Cast VNode */ (
		satoriHtml(litSsred)
	);

	const svg = await satori(satoried, userConfig.renderOptions.satori);

	const resvg = new Resvg(svg, userConfig.renderOptions.resvg);

	const image = resvg.render();

	return image.asPng();
}

/**
 * @param {import('./generate.js').UserConfig} config
 * @param {import('./api.js').Page[]} pages
 * @returns {Promise<RenderedOg[]>}
 */
export const renderAllPagesOg = (pages, config) =>
	Promise.all(
		pages.map(async (page) => ({
			path: page.path,
			data: await renderOgImage(config, { metadata: page.metadata }),
		})),
	);
