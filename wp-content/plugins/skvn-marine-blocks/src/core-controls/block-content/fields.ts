/**
 * Content allowlist, value validation and inline rich-text policy.
 *
 * Table source: plan057 §11.3. Every key that is not listed for a block keeps
 * the destination value. Style, layout, behavior, media presentation and
 * shared-data references are never listed here on purpose.
 *
 * Dependency free: no `@wordpress/*` import, no DOM. The transport (Gutenberg
 * parser/serializer) lives in `transport.ts`.
 */

import type { ContentField, ContentResult } from './types';

const MAX_INLINE_LENGTH = 8000;

const SAFE_URL_SCHEMES = [ 'http', 'https', 'mailto', 'tel' ];

/** Inline elements that are safe to keep. Everything else is rejected. */
const INLINE_TAGS = [
	'strong',
	'b',
	'em',
	'i',
	'sup',
	'sub',
	'code',
	'mark',
	'br',
	'a',
];

const LINK_ATTRIBUTES = [ 'href', 'target', 'rel' ];

const VOID_TAGS = [ 'br' ];

const SAFE_REL_TOKENS = [
	'noopener',
	'noreferrer',
	'nofollow',
	'sponsored',
	'ugc',
	'external',
];

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

function escapeAttribute( value: string ): string {
	return value
		.replace( /&(?!#?\w+;)/g, '&amp;' )
		.replace( /"/g, '&quot;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' );
}

function readLinkAttributes(
	segment: string
): ContentResult< Record< string, string > > {
	const attributes: Record< string, string > = {};
	const pattern =
		/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>=`]+)))?/g;
	let match: RegExpExecArray | null = pattern.exec( segment );

	while ( match !== null ) {
		const name = match[ 1 ].toLowerCase();
		const value = match[ 2 ] ?? match[ 3 ] ?? match[ 4 ] ?? '';

		if ( name === 'href' ) {
			if ( ! isSafeUrl( value ) ) {
				return { ok: false, code: 'url' };
			}
			attributes.href = value;
		} else if ( name === 'target' ) {
			if ( value === '_blank' ) {
				attributes.target = '_blank';
			} else if ( value !== '' && value !== '_self' ) {
				return { ok: false, code: 'url' };
			}
		} else if ( name === 'rel' ) {
			const tokens = value
				.split( /\s+/ )
				.filter( Boolean )
				.map( ( token ) => token.toLowerCase() )
				.filter( ( token ) => SAFE_REL_TOKENS.indexOf( token ) !== -1 );
			if ( tokens.length ) {
				attributes.rel = tokens.join( ' ' );
			}
		}

		// Anything else (style, class, data-*, on*) is dropped: inline
		// presentation belongs to the destination, not to the content.
		match = pattern.exec( segment );
	}

	if ( attributes.target === '_blank' ) {
		const tokens = ( attributes.rel ? attributes.rel.split( ' ' ) : [] ).filter(
			Boolean
		);

		for ( const required of [ 'noopener', 'noreferrer' ] ) {
			if ( tokens.indexOf( required ) === -1 ) {
				tokens.push( required );
			}
		}

		attributes.rel = tokens.join( ' ' );
	}

	return { ok: true, value: attributes };
}

function writeLinkTag( attributes: Record< string, string > ): string {
	const order = [ 'href', 'target', 'rel' ];
	const parts: string[] = [];

	for ( const name of order ) {
		const value = attributes[ name ];
		if ( typeof value === 'string' && value !== '' ) {
			parts.push( `${ name }="${ escapeAttribute( value ) }"` );
		}
	}

	return parts.length ? `<a ${ parts.join( ' ' ) }>` : '<a>';
}

function scanInlineMarkup(
	value: string,
	keepTags: boolean
): ContentResult< string > {
	let output = '';
	let index = 0;
	const stack: string[] = [];

	while ( index < value.length ) {
		const open = value.indexOf( '<', index );

		if ( open === -1 ) {
			output += value.slice( index );
			break;
		}

		output += value.slice( index, open );

		if ( value.startsWith( '<!--', open ) ) {
			return { ok: false, code: 'rich-text', detail: 'comment' };
		}

		const close = value.indexOf( '>', open );

		if ( close === -1 ) {
			return { ok: false, code: 'rich-text', detail: 'unterminated' };
		}

		let segment = value.slice( open + 1, close ).trim();
		let closing = false;

		if ( segment.startsWith( '/' ) ) {
			closing = true;
			segment = segment.slice( 1 ).trim();
		}

		let selfClosing = false;

		if ( segment.endsWith( '/' ) ) {
			selfClosing = true;
			segment = segment.slice( 0, -1 ).trim();
		}

		if ( segment.indexOf( '<' ) !== -1 ) {
			return { ok: false, code: 'rich-text', detail: 'nested' };
		}

		const spaceIndex = segment.search( /\s/ );
		const rawName =
			spaceIndex === -1 ? segment : segment.slice( 0, spaceIndex );
		const name = rawName.toLowerCase();
		const attributeSegment =
			spaceIndex === -1 ? '' : segment.slice( spaceIndex + 1 );

		if ( INLINE_TAGS.indexOf( name ) === -1 ) {
			return { ok: false, code: 'rich-text', detail: name };
		}

		if ( closing ) {
			if ( attributeSegment !== '' ) {
				return { ok: false, code: 'rich-text', detail: 'closing' };
			}
			if ( stack.pop() !== name ) {
				return { ok: false, code: 'rich-text', detail: 'nesting' };
			}
			if ( keepTags ) {
				output += `</${ name }>`;
			}
			index = close + 1;
			continue;
		}

		if ( VOID_TAGS.indexOf( name ) !== -1 ) {
			if ( keepTags ) {
				output += `<${ name } />`;
			}
			index = close + 1;
			continue;
		}

		if ( name === 'a' ) {
			const attributes = readLinkAttributes( attributeSegment );

			if ( ! attributes.ok ) {
				return { ok: false, code: attributes.code };
			}

			if ( keepTags ) {
				output += writeLinkTag( attributes.value ?? {} );
			}
		} else {
			const hasAttributes = attributeSegment
				.split( /\s+/ )
				.filter( Boolean ).length > 0;

			if ( hasAttributes && attributeSegment.indexOf( '=' ) === -1 ) {
				return {
					ok: false,
					code: 'rich-text',
					detail: 'bare-attribute',
				};
			}

			if ( keepTags ) {
				output += `<${ name }>`;
			}
		}

		if ( ! selfClosing ) {
			stack.push( name );
		}

		index = close + 1;
	}

	if ( stack.length ) {
		return { ok: false, code: 'rich-text', detail: 'unclosed' };
	}

	return { ok: true, value: output };
}

/**
 * Keep semantic inline formatting only. Fonts, colors, classes, styles and
 * event attributes are dropped. Any construct we cannot keep safely rejects
 * the whole paste instead of disappearing silently.
 */
export function sanitizeInlineHtml( value: string ): ContentResult< string > {
	if ( value.length > MAX_INLINE_LENGTH ) {
		return { ok: false, code: 'limit' };
	}

	if ( value.indexOf( '<' ) === -1 ) {
		return { ok: true, value };
	}

	return scanInlineMarkup( value, true );
}

/** Flatten a rich-text value to text, used for fields the frontend escapes. */
export function toPlainText( value: string ): ContentResult< string > {
	if ( value.indexOf( '<' ) === -1 ) {
		return { ok: true, value };
	}

	const stripped = scanInlineMarkup( value, false );

	if ( ! stripped.ok ) {
		return { ok: false, code: stripped.code, detail: stripped.detail };
	}

	return { ok: true, value: stripped.value ?? '' };
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
