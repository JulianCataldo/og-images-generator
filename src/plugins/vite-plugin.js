import { connectOgImagesGenerator } from './connect-middleware.js';
import { rollupOgImagesGenerator } from './rollup-plugin.js';

/**
 * @param {import('vite').ViteDevServer} server
 */
export const applyViteDevServerMiddleware = async (server) => {
	server.middlewares.use(
		await connectOgImagesGenerator({
			configReloader:
				/** @type {import('./connect-middleware.js').ConfigReloader} */ (
					() => server.ssrLoadModule('./og-images.config.js')
				),
		}),
	);
};

/**
 * @returns {import('vite').Plugin}
 */
export function viteOgImagesGenerator() {
	return {
		...rollupOgImagesGenerator(),

		configureServer: (server) => applyViteDevServerMiddleware(server),
	};
}
