# Open Graph Images Generator <!-- omit in toc -->

[![NPM](https://img.shields.io/npm/v/og-images-generator)](https://www.npmjs.com/package/og-images-generator)
![Downloads](https://img.shields.io/npm/dt/og-images-generator)
[![ISC License](https://img.shields.io/npm/l/og-images-generator)](./LICENSE)
[![GitHub](https://img.shields.io/badge/Repository-222222?logo=github)](https://github.com/JulianCataldo/og-images-generator)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://makeapullrequest.com)  
[![TypeScript](https://img.shields.io/badge/TypeScript-333333?logo=typescript)](http://www.typescriptlang.org/)
[![Prettier](https://img.shields.io/badge/Prettier-333333?logo=prettier)](https://prettier.io)
[![EditorConfig](https://img.shields.io/badge/EditorConfig-333333?logo=editorconfig)](https://editorconfig.org)

Generate social sharing thumbnails for your websites, with plain **HTML** + **CSS** templates.  
Extract metadata from pages, on-the-fly (middleware) or from distributables (static folder).

**No headless browser** involved = fast cold boot, much less MBs.  
Exposes all underlying APIs for full output customization.

Usable as a **CLI**, an **API** or via **plugins** for **Astro**, **Express**, **Rollup** and **Vite**.

Moreover, a handful of helpers are here to ease poster images authoring.

Under the hood, it will transform your HTML / CSS to **SVG**, while **retaining layout and typography calculations**, then it's converted to **PNG**.  
You can use gradients, borders, flexboxes, inline SVGs, and [more](https://github.com/vercel/satori)…

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
- [Possible improvements](#possible-improvements)
- [Notes on image optimization](#notes-on-image-optimization)
- [References](#references)

</div>

---

**Additional ressources**

- [Demo projects](./demos)
- [API documentation](https://juliancataldo.github.io/og-images-generator/)

## Installation

```
npm i og-images-generator
```

Create a `og-images.config.js` in your current workspace root.

See this [og-images.example-config.js](./demos/__common/og-images.example-config.js) for a full working example. It's the config used in every [demo](./demos/).

The gist is:

```js
// ./og-images.config.js

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

/** @type {import('og-images-generator').Template} */
export const template = ({ page }) =>
	html` <!-- Contrived example -->
		<div style=${style1}>
			${page.meta?.tags['og:title']} - ${page.meta?.tags['og:description']}
		</div>`;

/** @type {import('og-images-generator').RenderOptions} */
export const renderOptions = {
	satori: { fonts: [await FONTS.sourceSans()], ...OG_SIZE },
};
```

**At the minimum**, you need to export `renderOptions` (with **size** and **font**) and `template` from your `og-images-generator` configuration file.  
`paths` is optional.

> [!NOTE]  
> **Helpers**  
> `styled.div` is a dummy strings concatenation literal (bringing syntax highlighting and formatting).  
> `div` is the only needed (and available) tag, as it makes no difference anyway for this sugar.
>
> Also, you don't need to wrap interpolated HTML attributes with quotes (e.g. `style="${foo}"`).  
> `<foo-bar style=${styles.baz}></foo-bar>` just works.

---

You can also just clone this repo. and play with the demos for your favorite environments.  
E.g.

```sh
git clone https://github.com/JulianCataldo/og-images-generator
cd og-images-generator
pnpm i -r # Recursive

cd demos/<…>

# Do the command(s) in the demo's README.
```

## Usage

**As a preamble**, don't forget to add the appropriate meta for your OGs, there is plenty
on [ressources](https://code.juliancataldo.com/component/astro-seo-metadata) on the web on how to setup your SEO with your favorite environment.

That way, `og-images-generator` will crawl them back to your template.

It will parse all the **meta tags** (in head) and **JSON LDs** script tags content (in head and body).

---

By default:

- `https://example.com/` gives `https://example.com/og/index.png`
- `https://example.com/my-page/` gives `https://example.com/og/my-page.png`

> [!WARNING]  
> `/` → `index.png` is an exception.  
> We don't want `https://example.com/og.png`, as to keep this library output well segregated from the rest of your `dist` folder.  
> That's why so we need to disambiguate the root path.

For `https://example.com`:

```html
<meta property="og:image" content="https://example.com/og/index.png" />
```

```html
<meta property="og:image" content="https://example.com/og/nested/my-page.png" />
```

It's a contrived example. Fine-tuning SEO tags is an dark, ancient art.  
You'll need the `twitter:` stuff and other massaging, so you're sure it looks great everywhere.
But that's really out of the scope of this library, which does not mess with your HTML in the first place.

Alongside meta tag, JSON LD blocks are also extracted and made available for your template to consume.

**_What if I need to attribute different templates depending on the page route?_**  
To achieve per URL template variations, add your branching logic in the root template.  
You can split and import full or partial templates accordingly if it grows too much, or to organize styles separately.  
Also, `page.url` is provided, alongside metadata (which should hold those info too, like `og:url`).

---

> [!TIP]  
> Recommended VS Code extensions
>
> - Styled Components for inline CSS highlighting: `styled-components.vscode-styled-components`
> - HTML highlighting: `bierner.lit-html`

Please note that the HTML to SVG engine under the hood ([Satori](https://github.com/vercel/satori)) has some limitations you have to be aware of.  
It's kind of trial and error, but overall, you can achieve incomparable results from pure SVGs, especially for things like typography and fluid layouts.

Hopefully the [example configuration](./demos/__common/og-images.example-config.js) will guide you towards some neat patterns I'm discovering empirically and collected here.

### CLI

```sh
npx generate-og

# defaults to
npx generate-og --base dist --out dist/og --json dist/og/index.json
```

### Programmatic (JS API)

Use this API if you want to build your custom workflow, or create a plugin for an unsupported dev/build tools or JS runtimes (e.g. "serverless" functions).

```js
import * as api from 'og-images-generator/api';

await api.generateOgImages(/* options */);

await api.renderOgImage(/* options */);
```

See also the [tests folder](./test) for more minimal insights.

### Express / Connect middleware

```js
import express from 'express';

import { connectOgImagesGenerator } from 'og-images-generator/connect';

const app = express();

app.use(await connectOgImagesGenerator());

app.get('/', (_, res) => {
	res.send(`
		<html>
			<head>
				<meta property="og:title" content="Express / Connect demo" />
				<meta property="og:description" content="Welcome to my website!" />
			</head>
			<body> 
				<img src="/og/index.png"/>
			</body>
		</html>
	`);
});

app.listen(1234);
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
import { defineConfig } from 'vite';
import { viteOgImagesGenerator } from 'og-images-generator/vite';

export default defineConfig({
	plugins: [
		//
		viteOgImagesGenerator(),
	],
	build: {
		rollupOptions: {
			input: {
				foo: 'pages/foo.html',
				bar: 'pages/bar.html',
			},
		},
	},
});
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

## Possible improvements

For now, your configuration is evaluated once at runtime, meaning you should restart
the node process if you need to see templates changes. On contrary, metadata are injected dynamically; you can see changes for title, description, etc. with a simple browser reload.

Even if for Node + Express with `--watch`, it's quick and painless,
for Vite and Astro it should be preferable to hot reload the user template.

Here is the immediate solution I can think of: using Vite's `ssrModuleLoader` in the middleware, so we are sure to get a fresh config. on the fly.  
It seems feasible, so there is definitely a room for exploration here, for the next release.

## Notes on image optimization

If you're running this on a server, you should use a CDN or any kind of proxying + caching, to handle on the fly image optimizations, with the rest of your assets.  
Also AFAIK, all major social networks crawlers are transforming and caching assets themselves.  
It's their job to normalize optimizations in order to serve images to their users efficiently.

## References

- Vercel's Satori: [vercel/satori](https://github.com/vercel/satori)
- Nate Moore's HTML to Satori AST adapter: [natemoo-re/satori-html](https://github.com/natemoo-re/satori-html)
- SVG to PNG conversion with resvg: [yisibl/resvg-js](https://github.com/yisibl/resvg-js)
- Static HTML template literal authoring / rendering with Lit SSR: [lit/ssr](https://github.com/lit/lit/tree/d68f5c705484b9f6ea1f553d4851a9aa6a440db0/packages/labs/ssr)

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
