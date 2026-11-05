/**
 * Pure projection / patch planner for content-only Copy-Paste (plan057 §11–12).
 *
 * Copy builds a new tree that only carries allowlisted content. Paste compares
 * that tree with the destination and returns attribute patches addressed by
 * child indexes. Nothing here reads or writes the editor store, so the rules
 * can be tested from Node with plain fixtures.
 */

import type { BlockPatch, ContentResult, ContentField, TreeBlock } from './types';
import {
	contentFieldSpecs,
	emptyValueFor,
	isAllowedChild,
	isSupportedRoot,
	itemLimit,
	normalizeFieldValue,
} from './fields';

export const MAX_CLIPBOARD_LENGTH = 1048576;
export const MAX_NODES = 200;
export const MAX_DEPTH = 20;

export type DefaultsFor = ( name: string ) => Record< string, unknown >;

function ownValue(
	source: Record< string, unknown > | undefined,
	key: string
): { found: boolean; value?: unknown } {
	if ( ! source || ! Object.prototype.hasOwnProperty.call( source, key ) ) {
		return { found: false };
	}

	return { found: true, value: source[ key ] };
}

/** Raw value of the field, resolving schema defaults for omitted attributes. */
export function rawFieldValue(
	block: TreeBlock,
	field: ContentField,
	defaultsFor: DefaultsFor
): unknown {
	const own = ownValue( block.attributes, field.key );

	if ( own.found ) {
		return own.value;
	}

	const defaults = defaultsFor( block.name ) || {};
	const fallback = ownValue( defaults, field.key );

	if ( fallback.found ) {
		return fallback.value;
	}

	return emptyValueFor( field );
}

function normalizeFields(
	block: TreeBlock,
	defaultsFor: DefaultsFor,
	maxItems?: number
): ContentResult< Record< string, unknown > > {
	const specs = contentFieldSpecs( block.name );

	if ( specs === null ) {
		return { ok: false, code: 'unsupported-node', detail: block.name };
	}

	const attributes: Record< string, unknown > = {};

	for ( const field of specs ) {
		const fieldSpec =
			field.key === 'itemsToShow' && typeof maxItems === 'number'
				? { ...field, max: maxItems }
				: field;
		const normalized = normalizeFieldValue(
			fieldSpec,
			rawFieldValue( block, field, defaultsFor )
		);

		if ( ! normalized.ok ) {
			return {
				ok: false,
				code: normalized.code,
				detail: `${ block.name }.${ field.key }`,
			};
		}

		attributes[ field.key ] = normalized.value;
	}

	return { ok: true, value: attributes };
}

export function countNodes( block: TreeBlock ): number {
	let total = 1;

	for ( const child of block.innerBlocks || [] ) {
		total += countNodes( child );
	}

	return total;
}

export function treeDepth( block: TreeBlock ): number {
	let deepest = 0;

	for ( const child of block.innerBlocks || [] ) {
		deepest = Math.max( deepest, treeDepth( child ) );
	}

	return deepest + 1;
}

function limits( block: TreeBlock ): ContentResult< true > {
	if ( countNodes( block ) > MAX_NODES || treeDepth( block ) > MAX_DEPTH ) {
		return { ok: false, code: 'limit' };
	}

	return { ok: true, value: true };
}

function projectNode(
	block: TreeBlock,
	parentName: string | null,
	defaultsFor: DefaultsFor
): ContentResult< TreeBlock > {
	if ( ! isAllowedChild( parentName, block.name ) ) {
		return { ok: false, code: 'unsupported-node', detail: block.name };
	}

	const attributes = normalizeFields( block, defaultsFor );

	if ( ! attributes.ok ) {
		return { ok: false, code: attributes.code, detail: attributes.detail };
	}

	const innerBlocks: TreeBlock[] = [];

	for ( const child of block.innerBlocks || [] ) {
		const projected = projectNode( child, block.name, defaultsFor );

		if ( ! projected.ok || ! projected.value ) {
			return { ok: false, code: projected.code, detail: projected.detail };
		}

		innerBlocks.push( projected.value );
	}

	return {
		ok: true,
		value: {
			name: block.name,
			attributes: attributes.value ?? {},
			innerBlocks,
		},
	};
}

/**
 * Build the content-only tree that goes to the clipboard. Source style,
 * layout, behavior, query results and media presentation never enter it.
 */
export function buildProjection(
	block: TreeBlock,
	defaultsFor: DefaultsFor
): ContentResult< TreeBlock > {
	if ( ! isSupportedRoot( block.name ) ) {
		return { ok: false, code: 'root-type', detail: block.name };
	}

	const projected = projectNode( block, null, defaultsFor );

	if ( ! projected.ok || ! projected.value ) {
		return { ok: false, code: projected.code, detail: projected.detail };
	}

	const size = limits( projected.value );

	if ( ! size.ok ) {
		return { ok: false, code: 'limit' };
	}

	return projected;
}

/** Exact type + exact tree shape, compared node by node and in order. */
function shapeMatches( source: TreeBlock, dest: TreeBlock ): boolean {
	if ( source.name !== dest.name ) {
		return false;
	}

	const sourceChildren = source.innerBlocks || [];
	const destChildren = dest.innerBlocks || [];

	if ( sourceChildren.length !== destChildren.length ) {
		return false;
	}

	for ( let index = 0; index < sourceChildren.length; index++ ) {
		if ( ! shapeMatches( sourceChildren[ index ], destChildren[ index ] ) ) {
			return false;
		}
	}

	return true;
}

function sameContent( current: unknown, next: unknown ): boolean {
	if ( current === next ) {
		return true;
	}

	try {
		return JSON.stringify( current ) === JSON.stringify( next );
	} catch {
		return false;
	}
}

function visitPatches(
	source: TreeBlock,
	dest: TreeBlock,
	path: number[],
	patches: BlockPatch[],
	defaultsFor: DefaultsFor
): ContentResult< true > {
	if ( source.name !== dest.name ) {
		return { ok: false, code: 'shape', detail: source.name };
	}

	const maxItems = itemLimit( dest.name, dest.attributes );
	const normalized = normalizeFields( source, defaultsFor, maxItems );

	if ( ! normalized.ok ) {
		return { ok: false, code: normalized.code, detail: normalized.detail };
	}

	const specs = contentFieldSpecs( source.name ) ?? [];
	const changed: Record< string, unknown > = {};

	for ( const field of specs ) {
		const next = ( normalized.value ?? {} )[ field.key ];
		const current = rawFieldValue( dest, field, defaultsFor );

		if ( ! sameContent( current, next ) ) {
			changed[ field.key ] = next;
		}
	}

	if ( Object.keys( changed ).length > 0 ) {
		patches.push( { path, attributes: changed } );
	}

	const sourceChildren = source.innerBlocks || [];
	const destChildren = dest.innerBlocks || [];

	if ( sourceChildren.length !== destChildren.length ) {
		return { ok: false, code: 'shape', detail: source.name };
	}

	for ( let index = 0; index < sourceChildren.length; index++ ) {
		const child = visitPatches(
			sourceChildren[ index ],
			destChildren[ index ],
			[ ...path, index ],
			patches,
			defaultsFor
		);

		if ( ! child.ok ) {
			return child;
		}
	}

	return { ok: true, value: true };
}

/**
 * Patches for the destination tree. An empty result means the destination
 * already holds this content: the caller must not dispatch or add history.
 */
export function buildPatches(
	source: TreeBlock,
	dest: TreeBlock,
	defaultsFor: DefaultsFor
): ContentResult< BlockPatch[] > {
	if ( source.name !== dest.name || ! isSupportedRoot( source.name ) ) {
		return { ok: false, code: 'root-type', detail: source.name };
	}

	// Whole-shape pre-check: a mismatch must reject before any patch exists.
	if ( ! shapeMatches( source, dest ) ) {
		return { ok: false, code: 'shape', detail: source.name };
	}

	const patches: BlockPatch[] = [];
	const walked = visitPatches( source, dest, [], patches, defaultsFor );

	if ( ! walked.ok ) {
		return { ok: false, code: walked.code, detail: walked.detail };
	}

	return { ok: true, value: patches };
}

/**
 * Content revision signature used to detect a destination that changed while
 * clipboard access was pending. Style-only edits do not change it.
 */
export function contentSignature( block: TreeBlock, defaultsFor: DefaultsFor ): string {
	const specs = contentFieldSpecs( block.name ) ?? [];
	const values = specs.map( ( field ) => [
		field.key,
		rawFieldValue( block, field, defaultsFor ),
	] );

	return JSON.stringify( [
		block.name,
		values,
		( block.innerBlocks || [] ).map( ( child ) =>
			contentSignature( child, defaultsFor )
		),
	] );
}
