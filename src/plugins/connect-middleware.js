import {
	renderOgImage,
	loadUserConfig,
	extractMetadataFromHtml,
} from 'og-images-generator/api';

/**
 * @param pathPrefix - Default: `/og/`
 * @returns {Promise<import('connect').NextHandleFunction>}
 */
export async function connectOgImagesGenerator(pathPrefix = '/og/') {
	const config = await loadUserConfig();

	return async (req, res, next) => {
		if (!req.url) return next();
		if (req.url.startsWith(pathPrefix) === false) return next();

		const base = 'http://' + req.rawHeaders[req.rawHeaders.indexOf('Host') + 1];
		const path = req.url
			.replace(pathPrefix, '')
			.replace(/^index.png$/, '')
			.replace(/\.png$/, '');

		const pageUrl = new URL(path, base).href;

		const associatedPageHtml = await (await fetch(pageUrl)).text();

		const meta = extractMetadataFromHtml(associatedPageHtml);

		console.log(meta);

		const image = await renderOgImage(config, { path, meta });

		res.setHeader('Content-Type', 'image/png');
		// HACK:
		await new Promise(() => setTimeout(() => res.end(image), 0));
	};
}
