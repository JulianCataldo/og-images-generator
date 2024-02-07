/**
 * @license
 * Julian Cataldo
 * SPDX-License-Identifier: ISC
 */

export * from './generate.js';
export * from './collect.js';
export * from './render.js';

export { html } from '@lit-labs/ssr';
export { styled } from './dummy-literals.js';

/**
 * @typedef {import('@lit-labs/ssr').ServerRenderedTemplate} LitServerTemplate
 * @typedef TemplateOptions
 * @property {import('./collect.js').Metadata} metadata
 *
 * @typedef {(options: TemplateOptions) => LitServerTemplate} Template
 */
