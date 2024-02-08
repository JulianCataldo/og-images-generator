import fastGlob from 'fast-glob';
import { parse } from 'parse5';
import path from 'node:path';
import fs from 'node:fs';
import c from 'picocolors';

/**
 * @typedef {Record<string, string>} MetaTags
 */
/**
 * @typedef Page
 * @property {Metadata} meta
 * @property {string} path
 */
/**
 * @typedef Metadata
 * @property {MetaTags} tags
 * @property {Record<string, any>[]} jsonLds
 */

// NOTE: unexposed for now
// * @property {unknown} ast - Parse5 AST is untyped.

/**
 * @typedef PathsOptions
 * @property {string} [base]
 * @property {string} [out]
 * @property {string} [json]
 *
 * @typedef {Required<PathsOptions>} CollectOptions
 */

/**
 * @param {string} fileContent
 * @returns {Metadata}
 */
export function extractMetadataFromHtml(fileContent) {
	const ast = parse(fileContent);

	const doc = ast.childNodes.find((node) => node.nodeName === 'html');
	if (doc === undefined) throw Error('Invalid base HTML document.');
	if ('childNodes' in doc === false) throw Error('Invalid base HTML document.');

	const head = doc.childNodes.find((node) => node.nodeName === 'head');
	if (head === undefined) throw Error('Invalid HTML head element.');
	if ('childNodes' in head === false) throw Error('Invalid HTML head element.');

	const body = doc.childNodes.find((node) => node.nodeName === 'body');
	if (body === undefined) throw Error('Invalid HTML body element.');
	if ('childNodes' in body === false) throw Error('Invalid HTML body element.');

	const metaTagsNode = head.childNodes.filter((node) =>
		['meta'].includes(node.nodeName),
	);

	/** @type {Page['meta']['jsonLds']} */
	const jsonLds = [];

	[...head.childNodes, ...body.childNodes].forEach((node) => {
		// console.log(node.nodeName);
		if (
			['script'].includes(node.nodeName) &&
			'attrs' in node &&
			node.attrs.find((attr) => (attr.name = 'type'))?.value ===
				'application/ld+json'
		) {
			const content = node.childNodes.at(0);
			if (content && 'value' in content)
				jsonLds.push(JSON.parse(content.value));
		}
	});

	// console.log({ jsonLds });

	/** @type {MetaTags} */
	const metaTags = {};
	metaTagsNode.forEach((node) => {
		if ('attrs' in node === false) return;

		node.attrs.map((attr) => {
			if (attr.name === 'property' || attr.name === 'name') {
				const metaName = attr.value;
				const metaValue = node.attrs.find(
					(attr) => attr.name === 'content',
				)?.value;

				if (metaValue) metaTags[metaName] = metaValue;
			}
		});
	});

	return { tags: metaTags, jsonLds };
}

/**
 * @param {CollectOptions} options
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

			const pageMetas = extractMetadataFromHtml(fileContent);

			pages.push({
				path: path.relative(options.base, filePath),
				meta: pageMetas,
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

	return pages.sort((p, n) => (p.path < n.path ? -1 : 1));
}
