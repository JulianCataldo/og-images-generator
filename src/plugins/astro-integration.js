import { generateOgImages } from 'og-images-generator/api';
import { applyViteDevServerMiddleware } from './vite-plugin.js';

/**
 * @returns {import('astro').AstroIntegration}
 */
export function astroOgImagesGenerator() {
	return {
		name: 'og-images-generator',

		hooks: {
			'astro:server:setup': ({ server }) =>
				applyViteDevServerMiddleware(server),

			'astro:build:done': () => generateOgImages(),
		},
	};
}
