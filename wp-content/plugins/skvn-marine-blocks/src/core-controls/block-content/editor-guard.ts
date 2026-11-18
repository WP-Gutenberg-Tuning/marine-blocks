import { hasBoundContent, validateTree } from './validation';
import type { TreeBlock } from './types';

export interface EditorBlock extends TreeBlock {
	clientId: string;
	innerBlocks: EditorBlock[];
}

export interface ContentEditor {
	getBlocksByClientId: ( ids: string[] ) => Array< EditorBlock | undefined >;
	getBlockParents: ( id: string ) => string[];
	getBlockEditingMode: ( id: string ) => string;
	areInnerBlocksControlled: ( id: string ) => boolean;
	canEditBlock: ( id: string ) => boolean;
}

/** Same eligibility policy for Copy, menu availability and last-moment Paste. */
export function guardEditorTree(
	root: EditorBlock,
	editor: ContentEditor,
	registered: ( name: string ) => boolean
): string | null {
	const validation = validateTree( root, registered );
	if ( ! validation.ok ) return validation.code || 'unsupported';
	const ancestors = editor.getBlockParents( root.clientId );
	const parents = editor.getBlocksByClientId( ancestors );
	if ( parents.length !== ancestors.length || parents.some( ( node ) => ! node ) ) return 'missing';
	const pending = [ root, ...parents as EditorBlock[] ];
	const visited = new Set< string >();
	while ( pending.length ) {
		const node = pending.pop()!;
		if ( ! node.clientId || visited.has( node.clientId ) ) return 'missing';
		visited.add( node.clientId );
		if ( ! registered( node.name ) || node.isValid === false || hasBoundContent( node.attributes ) ) return 'binding';
		if ( ! editor.canEditBlock( node.clientId ) ) return 'locked';
		if ( editor.getBlockEditingMode( node.clientId ) !== 'default' ) return 'mode';
		if ( editor.areInnerBlocksControlled( node.clientId ) ) return 'controlled';
		// Ancestor siblings are outside this operation. Only traverse the root subtree.
		if ( ! ancestors.includes( node.clientId ) ) pending.push( ...node.innerBlocks );
	}
	return null;
}

/** Include identities and parent chain; identical-content replacement must abort. */
export function treeIdentity( root: EditorBlock, editor: ContentEditor ): string {
	const ids: string[] = [];
	const pending = [ root ];
	while ( pending.length ) {
		const node = pending.pop()!;
		ids.push( node.clientId );
		pending.push( ...node.innerBlocks );
	}
	return JSON.stringify( [ editor.getBlockParents( root.clientId ), ids ] );
}
