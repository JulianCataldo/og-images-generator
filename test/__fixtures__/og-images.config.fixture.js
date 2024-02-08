import { html, styled, OG_SIZE, FONTS } from '../../src/index.js';
const style1 = styled.div`
	display: flex;
`;

/** @type {import('og-images-generator').PathsOptions} */
export const paths = {
	// DEFAULTS:
	base: './dist',
	out: './dist/og',
	json: './dist/og/index.json',
};

/** @type {import('og-images-generator').Template} */
export const template = ({ page }) =>
	html` <!--  -->
		<div style=${style1}>
			${page.meta?.tags['og:title']}${page.meta?.tags['og:description']}
		</div>`;

/** @type {import('og-images-generator').RenderOptions} */
export const renderOptions = {
	satori: { fonts: [await FONTS.sourceSans()], ...OG_SIZE },
};
