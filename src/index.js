/**
 * @license
 * Julian Cataldo
 * SPDX-License-Identifier: ISC
 */

// export * from './generate.js';

/** @typedef {import('./collect.js').Metadata} MetadataCollection */

export { fetchFont, OG_DIMENSIONS, SOURCE_SANS_FONT } from './render.js';
/** @typedef {import('./render.js').RenderOptions} RenderOptions */

export { html } from '@lit-labs/ssr';
export { styled } from './dummy-literals.js';

/**
 * @typedef {import('@lit-labs/ssr').ServerRenderedTemplate} LitServerTemplate
 * @typedef TemplateOptions
 * @property {import('./collect.js').Metadata} metadata
 *
 * @typedef {(options: TemplateOptions) => LitServerTemplate} Template
 */
