/**
 * @license
 * Julian Cataldo
 * SPDX-License-Identifier: ISC
 */

// export * from './generate.js';

/** @typedef {import('./collect.js').Metadata} MetadataCollection */

export { fetchFont, OG_DIMENSIONS, SOURCE_SANS_FONT } from './render.js';
/** @typedef {import('./render.js').RenderOptions} RenderOptions */

export { styled } from './dummy-literals.js';

// NOTE: Just `export { html } from '@lit-labs/ssr';` will not show in TypeDoc.
// FIXME: Also, `html` produce a 404, see https://github.com/TypeStrong/typedoc/issues/2497
import { html as litHtml } from '@lit-labs/ssr';
export const html = litHtml;

/**
 * @typedef {import('@lit-labs/ssr').ServerRenderedTemplate} LitServerTemplate
 * @typedef TemplateOptions
 * @property {import('./collect.js').Metadata} metadata
 *
 * @typedef {(options: TemplateOptions) => LitServerTemplate} Template
 */
