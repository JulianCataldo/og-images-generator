# og-images-generator

[![NPM](https://img.shields.io/npm/v/og-images-generator)](https://www.npmjs.com/package/og-images-generator)
![Downloads](https://img.shields.io/npm/dt/og-images-generator)
[![ISC License](https://img.shields.io/npm/l/og-images-generator)](./LICENSE)
[![GitHub](https://img.shields.io/badge/Repository-222222?logo=github)](https://github.com/JulianCataldo/og-images-generator)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://makeapullrequest.com)  
[![TypeScript](https://img.shields.io/badge/TypeScript-333333?logo=typescript)](http://www.typescriptlang.org/)
[![Prettier](https://img.shields.io/badge/Prettier-333333?logo=prettier)](https://prettier.io)
[![EditorConfig](https://img.shields.io/badge/EditorConfig-333333?logo=editorconfig)](https://editorconfig.org)

Generate OG images from a static folder. Extract metadata from HTML pages. No headless browser involved.

## Installation

```
npm i og-images-generator
```

Create a `og-images.config.js` in your current workspace root.

See [demos/vanilla/og-images.config.js](./demos/vanilla/og-images.config.js) for a full working example.

The gist is:

```js
// ./og-images.config.js

import {
	html,
	styled,
	OG_DIMENSIONS,
	SOURCE_SANS_FONT,
} from 'og-images-generator';

/** @type {import('og-images-generator').RenderOptions} */
export const renderOptions = {
	satori: { fonts: [await SOURCE_SANS_FONT()], ...OG_DIMENSIONS },
};

/** @type {import('og-images-generator').Template} */
export const template = ({ metadata }) => {
	if ('og:title' in metadata === false) throw Error('Missing title!');
	if ('og:description' in metadata === false)
		throw Error('Missing description!');

	const title = metadata['og:title'];
	const description = metadata['og:description'];

	return html` <!--  -->
		<div style=${styles.container}>
			<div style=${styles.foo}>
				${icon.main}
				<!-- ... -->
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

> [!NOTE]  
> `styled.div` is a dummy strings concatenation literal (to get syntax highlighting).  
> `div` is the only needed (and available) tag, as it makes no difference anyway.
>
> Also, you don't need to wrap interpolated HTML attributes with quotes (e.g. `style="${foo}"`).  
> `<foo-bar style=${styles.baz}></foo-bar>` just works.

---

> [!TIP]  
> Recommended VS Code extensions:
>
> - Styled Components for inline CSS highlighting: `styled-components.vscode-styled-components`
> - HTML highlighting: `bierner.lit-html`

## Usage

- [API documentation](https://juliancataldo.github.io/og-images-generator/)
- [Demo projects](./demos)

### CLI

```sh
npx generate-og

# defaults to
npx generate-og --base dist --out dist/og --json dist/og/index.json
```

### Programmatic (JS API)

```js
import { generateOgImages } from 'og-images-generator/api';

await generateOgImages(/* options */);
```

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
