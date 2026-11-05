/**
 * Gutenberg transport for the content projection.
 *
 * Plain-text block markup through the public `@wordpress/blocks` parser and
 * serializer. No custom JSON, MIME type, envelope or storage: the clipboard
 * payload is ordinary Gutenberg serialized markup, so native Copy/full-block
 * copy can be pasted as long as its tree and schema are supported.
 */

import { createBlock, getBlockType, parse, serialize } from '@wordpress/blocks';
import { RichTextData } from '@wordpress/rich-text';

import type { ContentFailure, TreeBlock } from './types';
import { isSupportedRoot } from './fields';
import { validateTree, MAX_CLIPBOARD_LENGTH } from './validation';

type UnknownBlock = {
	name: string;
	attributes: Record< string, unknown >;
	innerBlocks: UnknownBlock[];
	isValid?: boolean;
};

const FALLBACK_NAMES = [
	'core/missing',
	'core/freeform',
	'core/html',
	'core/block',
	'core/template-part',
	'core/pattern',
];

export function toTree( block: UnknownBlock ): TreeBlock {
	const attributes = { ...block.attributes };
	// WP 7.1 uses RichTextData for core rich-text attributes. Older runtimes
	// return strings; never coerce arbitrary clipboard objects to text.
	if ( typeof RichTextData === 'function' ) {
		for ( const key of Object.keys( attributes ) ) {
			if ( attributes[ key ] instanceof RichTextData ) {
				attributes[ key ] = ( attributes[ key ] as RichTextData ).toHTMLString();
			}
		}
	}
	return {
		name: block.name,
		isValid: block.isValid,
		attributes,
		innerBlocks: ( block.innerBlocks || [] ).map( toTree ),
	};
}

function toCreatedBlocks( node: TreeBlock ): UnknownBlock {
	return createBlock(
		node.name,
		node.attributes,
		node.innerBlocks.map( toCreatedBlocks )
	) as unknown as UnknownBlock;
}

/**
 * Serialize only the projection tree. Never pass a source block here: its
 * style/layout attributes must not reach the clipboard.
 */
export function serializeProjection( node: TreeBlock ): string {
	if ( ! validateTree( node, isSupportedName ).ok ) throw new Error( 'Invalid content tree' );
	return serialize( [ toCreatedBlocks( node ) as never ] );
}

/**
 * Schema defaults of a registered block. Used to resolve attributes that the
 * serializer omits because they equal their default.
 */
export function defaultsFor( name: string ): Record< string, unknown > {
	const blockType = getBlockType( name ) as
		| { attributes?: Record< string, { default?: unknown } > }
		| undefined;

	const defaults: Record< string, unknown > = {};

	if ( ! blockType || ! blockType.attributes ) {
		return defaults;
	}

	for ( const [ key, schema ] of Object.entries( blockType.attributes ) ) {
		if ( schema && Object.prototype.hasOwnProperty.call( schema, 'default' ) ) {
			defaults[ key ] = schema.default;
		}
	}

	return defaults;
}

export function isSupportedName( name: string ): boolean {
	if ( FALLBACK_NAMES.indexOf( name ) !== -1 ) {
		return false;
	}

	return Boolean( getBlockType( name ) );
}

/**
 * Parse clipboard text into exactly one supported root.
 * Unknown/unregistered/invalid descendants reject the whole payload instead of
 * being dropped.
 */
export function parseDocument(
	text: string
): { ok: boolean; value?: TreeBlock; detail?: string; code?: ContentFailure } {
	if ( text.length > MAX_CLIPBOARD_LENGTH ) return { ok: false, code: 'limit' };
	if ( text.indexOf( '<!-- wp:' ) === -1 ) {
		return { ok: false, detail: 'markup' };
	}

	let blocks: UnknownBlock[];

	try {
		blocks = parse( text ) as unknown as UnknownBlock[];
	} catch {
		return { ok: false, detail: 'parse' };
	}

	if ( blocks.length !== 1 ) {
		return { ok: false, detail: 'roots' };
	}

	const root = blocks[ 0 ];

	if ( ! isSupportedRoot( root.name ) ) {
		return { ok: false, detail: root.name };
	}

	const validation = validateTree( root, isSupportedName );
	if ( ! validation.ok ) {
		return { ok: false, code: validation.code, detail: validation.detail };
	}

	return { ok: true, value: toTree( root ) };
}
