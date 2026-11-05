import { isAllowedChild, isSupportedRoot } from './fields';
import type { ContentResult, TreeBlock } from './types';

// Text limit is measured in UTF-16 code units, matching clipboard String.length.
export const MAX_CLIPBOARD_LENGTH = 1048576;
export const MAX_NODES = 200;
export const MAX_DEPTH = 20;

export function hasBoundContent( attributes: Record< string, unknown > ): boolean {
	const metadata = attributes.metadata;
	if ( ! metadata || typeof metadata !== 'object' ) return false;
	const bindings = ( metadata as { bindings?: unknown } ).bindings;
	return bindings !== undefined && bindings !== null &&
		( typeof bindings !== 'object' || Object.keys( bindings ).length > 0 );
}

/** Validate raw nodes before projection can discard validity or bindings. */
export function validateTree(
	root: TreeBlock,
	registered?: ( name: string ) => boolean
): ContentResult< true > {
	if ( ! isSupportedRoot( root.name ) ) return { ok: false, code: 'root-type' };
	const pending = [ { node: root, parent: null as string | null, depth: 1 } ];
	let count = 0;
	while ( pending.length ) {
		const { node, parent, depth } = pending.pop()!;
		if ( ++count > MAX_NODES || depth > MAX_DEPTH ) return { ok: false, code: 'limit' };
		if ( ! node || typeof node.name !== 'string' || ! isAllowedChild( parent, node.name ) ||
			node.isValid === false || ( registered && ! registered( node.name ) ) ) {
			return { ok: false, code: 'unsupported-node', detail: node?.name };
		}
		if ( hasBoundContent( node.attributes || {} ) ) return { ok: false, code: 'binding' };
		const children = node.innerBlocks || [];
		if ( ! Array.isArray( children ) ) return { ok: false, code: 'unsupported-node' };
		// Bound queued work too; a wide tree cannot allocate an unlimited stack.
		if ( count + pending.length + children.length > MAX_NODES ) return { ok: false, code: 'limit' };
		for ( let i = children.length - 1; i >= 0; i-- ) {
			pending.push( { node: children[ i ], parent: node.name, depth: depth + 1 } );
		}
	}
	return { ok: true, value: true };
}
