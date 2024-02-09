import { html, styled, OG_SIZE, FONTS } from 'og-images-generator';

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

const nestedTemplate = html`<span>My Website</span>`;

/** @type {import('og-images-generator').Template} */
export const template = ({ page }) =>
	html` <!-- Contrived example -->
		<div style=${style1}>
			${page.meta?.tags['og:title']} - ${page.meta?.tags['og:description']}
			${nestedTemplate}
			<em>Nice</em>
			<strong>Weather</strong>
		</div>`;

/** @type {import('og-images-generator').RenderOptions} */
export const renderOptions = {
	satori: { fonts: [await FONTS.sourceSans()], ...OG_SIZE },
};
