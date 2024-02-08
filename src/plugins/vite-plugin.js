import { connectOgImagesGenerator } from './connect-middleware.js';
import { rollupOgImagesGenerator } from './rollup-plugin.js';

/**
 * @returns {import('vite').Plugin}
 */
export function viteOgImagesGenerator() {
	return {
		...rollupOgImagesGenerator(),

		async configureServer(server) {
			server.middlewares.use(await connectOgImagesGenerator());
		},
	};
}
