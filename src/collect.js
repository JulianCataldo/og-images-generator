import fastGlob from 'fast-glob';
import { parse } from 'parse5';
import path from 'node:path';
import fs from 'node:fs';
import c from 'picocolors';

/**
 * @typedef {Record<string, string>} Metadata
 */
/**
 * @typedef Page
 * @property {string} path
 * @property {Metadata} metadata
 */
/**
 * @typedef CollectOptions
 * @property {string} [base]
 * @property {string} [out]
 * @property {string} [json]
 */

/**
 * @param {Required<CollectOptions>} options
 * @returns {Promise<Page[]>}
 * */
export async function collectHtmlPages(options) {
	console.log(c.bold(c.yellow('Collecting HTML pages…')));

	const files = await fastGlob(path.join(options.base, '**/*.html'));

	/** @type {Page[]} */
	const pages = [];

	await Promise.all(
		files.map(async (filePath) => {
			const fileContent = await fs.promises.readFile(filePath, 'utf-8');

			const ast = parse(fileContent);

			const doc = ast.childNodes.find((node) => node.nodeName === 'html');
			if (doc === undefined) return;
			if ('childNodes' in doc === false) return;

			const head = doc.childNodes.find((node) => node.nodeName === 'head');
			if (head === undefined) return;
			if ('childNodes' in head === false) return;

			const metas = head.childNodes.filter((node) =>
				['meta'].includes(node.nodeName),
			);

			/** @type {Metadata} */
			const pageMetas = {};
			metas.forEach((node) => {
				if ('attrs' in node === false) return;

				node.attrs.map((attr) => {
					if (attr.name === 'property' || attr.name === 'name') {
						const metaName = attr.value;
						const metaValue = node.attrs.find(
							(attr) => attr.name === 'content',
						)?.value;

						if (metaValue) pageMetas[metaName] = metaValue;
					}
				});
			});

			pages.push({
				path: path.relative(options.base, filePath),
				metadata: pageMetas,
			});
		}),
	);

	await fs.promises
		.mkdir(path.join(options.out), { recursive: true })
		.catch(() => null);

	await fs.promises.writeFile(
		path.join(options.json),
		JSON.stringify(pages, null, 2),
	);

	return pages;
}
