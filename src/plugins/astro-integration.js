import { generateOgImages } from 'og-images-generator/api';
import { viteOgImagesGenerator } from './vite-plugin.js';

/**
 * @returns {import('astro').AstroIntegration}
 */
export function astroOgImagesGenerator() {
	return {
		name: 'og-images-generator',

		hooks: {
			'astro:config:setup': ({ updateConfig }) => {
				updateConfig({
					vite: {
						plugins: [viteOgImagesGenerator()],
					},
				});
			},

			'astro:build:done': async () => {
				await generateOgImages();
			},
		},
	};
}
