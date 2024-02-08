import { generateOgImages } from '../generate.js';

/**
 * @returns {import('rollup').Plugin}
 */
export function rollupOgImagesGenerator() {
	return {
		name: 'og-images-generator',

		async closeBundle() {
			await generateOgImages();
		},
	};
}
