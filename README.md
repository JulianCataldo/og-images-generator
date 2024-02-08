# OpenGraph Images Generator <!-- omit in toc -->

[![NPM](https://img.shields.io/npm/v/og-images-generator)](https://www.npmjs.com/package/og-images-generator)
![Downloads](https://img.shields.io/npm/dt/og-images-generator)
[![ISC License](https://img.shields.io/npm/l/og-images-generator)](./LICENSE)
[![GitHub](https://img.shields.io/badge/Repository-222222?logo=github)](https://github.com/JulianCataldo/og-images-generator)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://makeapullrequest.com)  
[![TypeScript](https://img.shields.io/badge/TypeScript-333333?logo=typescript)](http://www.typescriptlang.org/)
[![Prettier](https://img.shields.io/badge/Prettier-333333?logo=prettier)](https://prettier.io)
[![EditorConfig](https://img.shields.io/badge/EditorConfig-333333?logo=editorconfig)](https://editorconfig.org)

Generate OG images from a static folder. Extract metadata from HTML pages. No headless browser involved.
Comes as a CLI, API or plugins.

---

<div > 
<div align="center">Table of Contents</div>

- [Installation](#installation)
- [Usage](#usage)
  - [CLI](#cli)
  - [Programmatic (JS API)](#programmatic-js-api)
  - [Express / Connect middleware](#express--connect-middleware)
  - [Rollup plugin](#rollup-plugin)
  - [Vite plugin](#vite-plugin)
  - [Astro integration](#astro-integration)
- [Notes on image optimization](#notes-on-image-optimization)
- [References](#references)

</div>

---

## Installation

```
npm i og-images-generator
```

Create a `og-images.config.js` in your current workspace root.

See [demos/vanilla/og-images.config.js](./demos/vanilla/og-images.config.js) for a full working example.

The gist is:

```js
// ./og-images.config.js

import { html, styled, OG_SIZE, FONTS } from '../../src/index.js';

/** @type {import('og-images-generator').RenderOptions} */
export const renderOptions = {
	satori: { fonts: [await FONTS.sourceSans()], ...OG_SIZE },
};

/** @type {import('og-images-generator').PathsOptions} */
export const paths = {
	// DEFAULTS:
	// base: './dist',
	// out: './dist/og',
	// json: './dist/og/index.json',
};

/** @type {import('og-images-generator').Template} */
export const template = ({ page }) => {
	console.log('OG Template for: ', page.path);

	if ('og:title' in page.meta === false) throw Error('Missing title!');
	if ('og:description' in page.meta === false)
		throw Error('Missing description!');

	const title = page.meta['og:title'];
	const description = page.meta['og:description'];

	// IDEA:
	// const breadcrumbs = page.meta.jsonLds.find(/* ... */)

	return html` <!-- Contrived template example -->
		<div style=${styles.container}>
			<span>${title}</span>
			<div style=${styles.foo}>
				${icons.main}

				<span>${description}</span>
				<!-- etc... -->
			</div>
		</div>`;
};

const tokens = {
	primaryColor: `rgb(82,245,187)`,
};

const icons = {
	main: html`
		<svg>
			<!-- ... -->
		</svg>
	`,
};

const styles = {
	container: styled.div`
		display: flex;
		height: 100%;
		width: 100%;
		/* ... */
	`,

	foo: styled.div`
		display: flex;
		color: ${tokens.primaryColor};
		/* ... */
	`,
};
```

**You need to export** `renderOptions` and `template` from your `og-images-generator` configuration file.

> [!NOTE] Helpers
> `styled.div` is a dummy strings concatenation literal (to get syntax highlighting).  
> `div` is the only needed (and available) tag, as it makes no difference anyway.
>
> Also, you don't need to wrap interpolated HTML attributes with quotes (e.g. `style="${foo}"`).  
> `<foo-bar style=${styles.baz}></foo-bar>` just works.

## Usage

**As a preamble**, don't forget to add the appropriate meta for your OGs, there is plenty
on [ressources](https://code.juliancataldo.com/component/astro-seo-metadata) on the web on how to setup your SEO with your favorite environment.

---

By default:

- `https://example.com/` gives `https://example.com/og/index.png`
- `https://example.com/my-page/` gives `https://example.com/og/my-page.png`

> [!WARNING]  
> `/` → `index.png` is an exception.  
> We don't want `https://example.com/og.png`, as to keep this library output well segregated from the rest of your `dist`.  
> That's why so we need to disambiguate the root path.

For `https://example.com`:

```html
<meta property="og:image" content="https://example.com/og/index.png" />
```

```html
<meta property="og:image" content="https://example.com/og/nested/my-page.png" />
```

It's a contrived example. Fine-tuning SEO tags is an ancient, dark art.  
You'll need the `twitter:` stuff and other massaging,
but that's really out of the scope of this library, which does not mess with your HTML.

> [!NOTE] Additional ressources
>
> - [Demo projects](./demos)
> - [API documentation](https://juliancataldo.github.io/og-images-generator/)

---

> [!TIP] Recommended VS Code extensions
>
> - Styled Components for inline CSS highlighting: `styled-components.vscode-styled-components`
> - HTML highlighting: `bierner.lit-html`

### CLI

```sh
npx generate-og

# defaults to
npx generate-og --base dist --out dist/og --json dist/og/index.json
```

It will parse all the meta tags (in head) and JSON LDs script content (in head and body).

### Programmatic (JS API)

```js
import { generateOgImages } from 'og-images-generator/api';

await generateOgImages(/* options */);
```

### Express / Connect middleware

```js
import { connectOgImagesGenerator } from 'og-images-generator/connect';

app.use(await connectOgImagesGenerator());
```

### Rollup plugin

```js
import { rollupOgImagesGenerator } from 'og-images-generator/rollup';

/** @type {import('rollup').RollupOptions} */
export default {
	plugins: [
		//
		rollupOgImagesGenerator(),
	],
};
```

### Vite plugin

```js

```

### Astro integration

```js
import { defineConfig } from 'astro/config';

import { astroOgImagesGenerator } from 'og-images-generator/astro';

export default defineConfig({
	integrations: [
		//
		astroOgImagesGenerator(),
	],
});
```

## Notes on image optimization

You could use a CDN proxy to handle on the fly image optimizations.  
Also AFAIK, all major social networks crawlers are transforming and caching assets themselves.  
It their job to normalize optimizations for later asset serving from their website.

## References

- [vercel/satori](https://github.com/vercel/satori)
- [natemoo-re/satori-html](https://github.com/natemoo-re/satori-html)
- [yisibl/resvg-js](https://github.com/yisibl/resvg-js)
- [lit/ssr](https://github.com/lit/lit/tree/d68f5c705484b9f6ea1f553d4851a9aa6a440db0/packages/labs/ssr)

---

**Other projects 👀**…

- [retext-case-police](https://github.com/JulianCataldo/retext-case-police): Check popular names casing. Example: ⚠️ `github` → ✅ `GitHub`.
- [remark-lint-frontmatter-schema](https://github.com/JulianCataldo/remark-lint-frontmatter-schema): Validate your Markdown **frontmatter** data against a **JSON schema**.
- [JSON Schema Form Element](https://github.com/json-schema-form-element/jsfe): Effortless forms, with standards.

---

<div align="center">

**Find this project useful?**

[![GitHub](https://img.shields.io/badge/Star_me_on_GitHub-222222?logo=github&style=social)](https://github.com/JulianCataldo/og-images-generator)

</div>

---

🔗  [JulianCataldo.com](https://www.juliancataldo.com)
