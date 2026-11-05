/**
 * Content allowlist, value validation and inline rich-text policy.
 *
 * Table source: plan057 §11.3. Every key that is not listed for a block keeps
 * the destination value. Style, layout, behavior, media presentation and
 * shared-data references are never listed here on purpose.
 *
 * No WordPress runtime imports. Inline HTML uses the public browser DOM parser
 * through inline-html.ts; Gutenberg transport lives in transport.ts.
 */

import type { ContentField, ContentResult } from './types';
import { cleanInlineHtml } from './inline-html';

const SAFE_URL_SCHEMES = [ 'http', 'https', 'mailto', 'tel' ];

const COLLECTION_FIELDS: ContentField[] = [
	{ key: 'eyebrow', kind: 'plain' },
	{ key: 'heading', kind: 'heading' },
	{ key: 'intro', kind: 'richtext' },
	{ key: 'accessibleLabel', kind: 'plain' },
	{ key: 'categories', kind: 'slugs' },
	{ key: 'tags', kind: 'slugs' },
	{ key: 'relation', kind: 'enum', values: [ 'OR', 'AND' ] },
	{
		key: 'orderMode',
		kind: 'enum',
		values: [ 'featured', 'newest', 'manual', 'shuffle-balanced' ],
	},
	{ key: 'itemsToShow', kind: 'int', min: 1, max: 20 },
	{ key: 'customActionUrl', kind: 'url' },
	{ key: 'archiveUrl', kind: 'url' },
	{ key: 'archiveLabel', kind: 'plain' },
	{ key: 'catalogCtaUrl', kind: 'url' },
	{ key: 'catalogCtaLabel', kind: 'plain' },
];

const POST_COLLECTION_FIELDS: ContentField[] = [
	...COLLECTION_FIELDS,
	{ key: 'readMoreLabel', kind: 'plain' },
];

const SLIDER_FIELDS: ContentField[] = [];

const SLIDE_FIELDS: ContentField[] = [
	{ key: 'backgroundImageId', kind: 'int', min: 0, max: 2147483647 },
	{ key: 'backgroundImageUrl', kind: 'url' },
	{ key: 'backgroundImageAlt', kind: 'plain' },
];

const CORE_HEADING_FIELDS: ContentField[] = [
	{ key: 'content', kind: 'richtext' },
];

const CORE_PARAGRAPH_FIELDS: ContentField[] = [
	{ key: 'content', kind: 'richtext' },
];

const CORE_BUTTON_FIELDS: ContentField[] = [
	{ key: 'text', kind: 'richtext' },
	{ key: 'title', kind: 'plain' },
	{ key: 'url', kind: 'url' },
	{ key: 'linkTarget', kind: 'enum', values: [ '', '_blank' ] },
	{ key: 'rel', kind: 'plain' },
];

const CORE_IMAGE_FIELDS: ContentField[] = [
	{ key: 'id', kind: 'int', min: 0, max: 2147483647 },
	{ key: 'url', kind: 'url' },
	{ key: 'alt', kind: 'plain' },
	{ key: 'caption', kind: 'richtext' },
	{ key: 'href', kind: 'url' },
	{ key: 'linkTarget', kind: 'enum', values: [ '', '_blank' ] },
	{ key: 'rel', kind: 'plain' },
];

/**
 * Structural wrappers copy no attributes: the destination keeps all of them.
 * They are still listed so shape mapping can address their children.
 */
const STRUCTURAL_FIELDS: ContentField[] = [];

const FIELD_SPECS: Record< string, ContentField[] > = {
	'skvn-marine/product-collection': COLLECTION_FIELDS,
	'skvn-marine/post-collection': POST_COLLECTION_FIELDS,
	'skvn-marine/slider': SLIDER_FIELDS,
	'skvn-marine/slide': SLIDE_FIELDS,
	'core/heading': CORE_HEADING_FIELDS,
	'core/paragraph': CORE_PARAGRAPH_FIELDS,
	'core/button': CORE_BUTTON_FIELDS,
	'core/image': CORE_IMAGE_FIELDS,
	'core/buttons': STRUCTURAL_FIELDS,
	'core/columns': STRUCTURAL_FIELDS,
	'core/column': STRUCTURAL_FIELDS,
	'core/group': STRUCTURAL_FIELDS,
};

/** Roots that expose the actions in the block options menu. */
const SUPPORTED_ROOTS = [
	'skvn-marine/product-collection',
	'skvn-marine/post-collection',
	'skvn-marine/slider',
	'skvn-marine/slide',
];

/** Allowed child names per parent. A child outside this table rejects the paste. */
const ALLOWED_CHILDREN: Record< string, string[] > = {
	'skvn-marine/slider': [ 'skvn-marine/slide' ],
	'skvn-marine/slide': [
		'core/heading',
		'core/paragraph',
		'core/buttons',
		'core/image',
		'core/columns',
		'core/group',
	],
	'core/buttons': [ 'core/button' ],
	'core/columns': [ 'core/column' ],
	'core/column': [
		'core/heading',
		'core/paragraph',
		'core/buttons',
		'core/image',
		'core/columns',
		'core/group',
	],
	'core/group': [
		'core/heading',
		'core/paragraph',
		'core/buttons',
		'core/image',
		'core/columns',
		'core/group',
	],
};

export function contentFieldSpecs( name: string ): ContentField[] | null {
	return FIELD_SPECS[ name ] ?? null;
}

export function isSupportedRoot( name: string ): boolean {
	return SUPPORTED_ROOTS.indexOf( name ) !== -1;
}

export function isAllowedChild( parent: string | null, name: string ): boolean {
	if ( parent === null ) {
		return isSupportedRoot( name );
	}

	const allowed = ALLOWED_CHILDREN[ parent ];
	return Array.isArray( allowed ) && allowed.indexOf( name ) !== -1;
}

export function emptyValueFor( field: ContentField ): unknown {
	switch ( field.kind ) {
		case 'slugs':
			return [];
		case 'int':
			return field.min ?? 0;
		default:
			return '';
	}
}

/**
 * URL policy: relative paths, fragments and the four link schemes the editor
 * can produce. `javascript:` and `data:` never pass.
 */
export function isSafeUrl( value: string ): boolean {
	const trimmed = value.trim();

	if ( '' === trimmed ) {
		return true;
	}

	// eslint-disable-next-line no-control-regex
	if ( /[\u0000-\u001f\u007f\s]/.test( trimmed ) ) {
		return false;
	}

	if ( /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test( trimmed ) ) {
		const scheme = trimmed.slice( 0, trimmed.indexOf( ':' ) ).toLowerCase();
		return SAFE_URL_SCHEMES.indexOf( scheme ) !== -1;
	}

	return (
		trimmed.startsWith( '/' ) ||
		trimmed.startsWith( '#' ) ||
		trimmed.startsWith( '?' ) ||
		trimmed.startsWith( './' ) ||
		trimmed.startsWith( '../' )
	);
}

/** Browser HTML parsing keeps semantic text and discards presentation only. */
export function sanitizeInlineHtml( value: string ): ContentResult< string > {
 return cleanInlineHtml( value, true, isSafeUrl );
}
export function toPlainText( value: string ): ContentResult< string > {
 return cleanInlineHtml( value, false, isSafeUrl );
}

export function normalizeFieldValue(
	field: ContentField,
	raw: unknown
): ContentResult< unknown > {
	switch ( field.kind ) {
		case 'plain':
			return typeof raw === 'string'
				? { ok: true, value: raw }
				: { ok: false, code: 'field-type' };

		case 'richtext':
			return typeof raw === 'string'
				? sanitizeInlineHtml( raw )
				: { ok: false, code: 'field-type' };

		case 'heading': {
			if ( typeof raw !== 'string' ) {
				return { ok: false, code: 'field-type' };
			}
			const text = toPlainText( raw );
			return text.ok
				? { ok: true, value: text.value }
				: { ok: false, code: 'rich-text', detail: text.detail };
		}

		case 'slugs': {
			if ( ! Array.isArray( raw ) ) {
				return { ok: false, code: 'field-type' };
			}

			const slugs: string[] = [];

			for ( const item of raw ) {
				if ( typeof item !== 'string' ) {
					return { ok: false, code: 'field-type' };
				}
				const slug = item.trim();
				if ( slug === '' || slug.length > 200 ) {
					return { ok: false, code: 'field-type' };
				}
				slugs.push( slug );
			}

			return { ok: true, value: slugs };
		}

		case 'enum': {
			if ( typeof raw !== 'string' ) {
				return { ok: false, code: 'field-type' };
			}
			const values = field.values ?? [];
			return values.indexOf( raw ) !== -1
				? { ok: true, value: raw }
				: { ok: false, code: 'field-enum' };
		}

		case 'int': {
			if ( typeof raw !== 'number' || ! Number.isFinite( raw ) ) {
				return { ok: false, code: 'field-type' };
			}
			if ( ! Number.isInteger( raw ) ) {
				return { ok: false, code: 'field-type' };
			}
			if ( typeof field.min === 'number' && raw < field.min ) {
				return { ok: false, code: 'field-range' };
			}
			if ( typeof field.max === 'number' && raw > field.max ) {
				return { ok: false, code: 'field-range' };
			}
			return { ok: true, value: raw };
		}

		case 'url':
			if ( typeof raw !== 'string' ) {
				return { ok: false, code: 'field-type' };
			}
			return isSafeUrl( raw )
				? { ok: true, value: raw }
				: { ok: false, code: 'url' };

		default:
			return { ok: false, code: 'field-type' } as ContentResult< unknown >;
	}
}

/** Post/Product collection item limit for a given destination layout. */
export function itemLimit(
	name: string,
	attributes: Record< string, unknown >
): number {
	if ( name === 'skvn-marine/product-collection' ) {
		return 20;
	}

	if ( name === 'skvn-marine/post-collection' ) {
		return attributes.layout === 'carousel' ? 10 : 9;
	}

	return 20;
}
