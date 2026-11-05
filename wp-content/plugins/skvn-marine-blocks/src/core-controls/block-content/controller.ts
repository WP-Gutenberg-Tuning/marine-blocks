/**
 * Content-only Copy/Paste controller (plan057 §11–12).
 *
 * One root per action, one public multi-block attribute mutation per paste,
 * full validation before any write. No replace/insert/reset, no private undo
 * or persistence flags, no partial paste.
 */

import { store as blockEditorStore } from '@wordpress/block-editor';
import { dispatch, select } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import { readClipboardText, writeClipboardText } from './clipboard';
import { isSupportedRoot } from './fields';
import {
	buildPatches,
	buildProjection,
	contentSignature,
	MAX_CLIPBOARD_LENGTH,
} from './plan';
import { unresolvedReferences } from './taxonomy';
import {
	defaultsFor,
	parseDocument,
	serializeProjection,
	toTree,
} from './transport';
import type { BlockPatch, ContentResult, TreeBlock } from './types';

type WpBlock = {
	clientId: string;
	name: string;
	attributes: Record< string, unknown >;
	innerBlocks: WpBlock[];
};

type TargetInfo = {
	ok: boolean;
	reason?: string;
	tree?: TreeBlock;
	signature?: string;
};

const TEXT_DOMAIN = 'skvn-marine-blocks';

function notify(
	status: 'success' | 'error' | 'warning',
	message: string
): void {
	dispatch( noticesStore ).createNotice( status, message, {
		type: 'snackbar',
		isDismissible: true,
	} );
}

/**
 * Public API probe. When the running editor does not expose these selectors
 * the actions stay hidden instead of throwing inside the block toolbar.
 */
export function hasContentActionsApi(): boolean {
	try {
		const editor = select( blockEditorStore ) as unknown as Record<
			string,
			unknown
		>;
		const actions = dispatch( blockEditorStore ) as unknown as Record<
			string,
			unknown
		>;

		return Boolean(
			editor &&
				actions &&
				typeof editor.getBlocksByClientId === 'function' &&
				typeof editor.getBlockEditingMode === 'function' &&
				typeof editor.areInnerBlocksControlled === 'function' &&
				typeof editor.canEditBlock === 'function' &&
				typeof actions.updateBlockAttributes === 'function'
		);
	} catch {
		return false;
	}
}

function hasBindings( node: TreeBlock ): boolean {
	const metadata = node.attributes?.metadata;

	if ( metadata && typeof metadata === 'object' ) {
		const bindings = ( metadata as { bindings?: unknown } ).bindings;

		if (
			bindings &&
			typeof bindings === 'object' &&
			Object.keys( bindings as Record< string, unknown > ).length > 0
		) {
			return true;
		}
	}

	return ( node.innerBlocks || [] ).some( hasBindings );
}

function isControlled( clientId: string ): boolean {
	const editor = select( blockEditorStore ) as unknown as {
		areInnerBlocksControlled?: ( id: string ) => boolean;
		getBlockParents?: ( id: string ) => string[];
	};

	if ( typeof editor.areInnerBlocksControlled !== 'function' ) {
		return true;
	}

	if ( editor.areInnerBlocksControlled( clientId ) ) {
		return true;
	}

	const parents =
		typeof editor.getBlockParents === 'function'
			? editor.getBlockParents( clientId )
			: [];

	return parents.some( ( parent ) =>
		Boolean( editor.areInnerBlocksControlled?.( parent ) )
	);
}

function getBlock( clientId: string ): WpBlock | undefined {
	const editor = select( blockEditorStore ) as unknown as {
		getBlocksByClientId: ( ids: string[] ) => Array< WpBlock | undefined >;
	};

	return editor.getBlocksByClientId( [ clientId ] )[ 0 ];
}

/** Read-only view: used by Copy, which never writes to the block. */
function readSource( clientId: string ): TargetInfo {
	const block = getBlock( clientId );

	if ( ! block ) {
		return { ok: false, reason: 'missing' };
	}

	if ( ! isSupportedRoot( block.name ) ) {
		return { ok: false, reason: 'unsupported' };
	}

	const tree = toTree( block );

	if ( hasBindings( tree ) ) {
		return { ok: false, reason: 'binding' };
	}

	return { ok: true, tree };
}

/** Write view: used by Paste, which mutates the selected subtree. */
function readTarget( clientId: string ): TargetInfo {
	const source = readSource( clientId );

	if ( ! source.ok || ! source.tree ) {
		return source;
	}

	const editor = select( blockEditorStore ) as unknown as {
		getBlockEditingMode: ( id: string ) => string;
		canEditBlock: ( id: string ) => boolean;
	};

	if ( isControlled( clientId ) ) {
		return { ok: false, reason: 'controlled' };
	}

	if ( editor.getBlockEditingMode( clientId ) !== 'default' ) {
		return { ok: false, reason: 'mode' };
	}

	const block = getBlock( clientId );
	const blocked = block ? subtreeLock( block, editor ) : 'missing';

	if ( blocked ) {
		return { ok: false, reason: blocked };
	}

	return {
		ok: true,
		tree: source.tree,
		signature: contentSignature( source.tree, defaultsFor ),
	};
}

/**
 * Paste writes attributes on nested nodes too, so every descendant must be
 * content-editable. `canEditBlock` covers preview mode and `lock.edit`.
 */
function subtreeLock(
	block: WpBlock,
	editor: { canEditBlock: ( id: string ) => boolean }
): string | null {
	if ( ! editor.canEditBlock( block.clientId ) ) {
		return 'locked';
	}

	for ( const child of block.innerBlocks || [] ) {
		const blocked = subtreeLock( child, editor );

		if ( blocked ) {
			return blocked;
		}
	}

	return null;
}

/** Path → clientId map for the selected root and its subtree. */
function clientIdsByPath( clientId: string ): Map< string, string > {
	const map = new Map< string, string >();
	const block = getBlock( clientId );

	const walk = ( node: WpBlock, path: number[] ): void => {
		map.set( path.join( '.' ), node.clientId );
		( node.innerBlocks || [] ).forEach( ( child, index ) =>
			walk( child, [ ...path, index ] )
		);
	};

	if ( block ) {
		walk( block, [] );
	}

	return map;
}

function failureMessage( result: ContentResult< unknown > ): string {
	switch ( result.code ) {
		case 'shape':
			return __(
				'The source and destination block structures do not match.',
				TEXT_DOMAIN
			);
		case 'root-type':
			return __(
				'Content cannot be pasted into this block type.',
				TEXT_DOMAIN
			);
		case 'rich-text':
			return __(
				'The copied content uses formatting that cannot be pasted without changing its design.',
				TEXT_DOMAIN
			);
		case 'url':
			return __( 'The copied content contains an invalid link.', TEXT_DOMAIN );
		case 'field-enum':
		case 'field-range':
			return __(
				'The copied settings are not supported by this block.',
				TEXT_DOMAIN
			);
		case 'limit':
			return __( 'The copied content is too large to paste.', TEXT_DOMAIN );
		case 'empty':
			return __( 'The block has no supported content to copy.', TEXT_DOMAIN );
		default:
			return __( 'No compatible block content found.', TEXT_DOMAIN );
	}
}

function targetFailureMessage( reason?: string ): string {
	if ( reason === 'locked' || reason === 'mode' || reason === 'controlled' ) {
		return __( 'The selected block cannot be edited.', TEXT_DOMAIN );
	}

	if ( reason === 'missing' ) {
		return __( 'The destination changed. Try pasting again.', TEXT_DOMAIN );
	}

	return __( 'No compatible block content found.', TEXT_DOMAIN );
}

export async function copyBlockContent( clientId: string ): Promise< void > {
	const target = readSource( clientId );

	if ( ! target.ok || ! target.tree ) {
		notify( 'error', targetFailureMessage( target.reason ) );
		return;
	}

	const projection = buildProjection( target.tree, defaultsFor );

	if ( ! projection.ok || ! projection.value ) {
		notify( 'error', failureMessage( projection ) );
		return;
	}

	let text = '';

	try {
		text = serializeProjection( projection.value );
	} catch {
		notify( 'error', __( 'No compatible block content found.', TEXT_DOMAIN ) );
		return;
	}

	if ( text === '' || text.length > MAX_CLIPBOARD_LENGTH ) {
		notify( 'error', failureMessage( { ok: false, code: 'limit' } ) );
		return;
	}

	const written = await writeClipboardText( text );

	if ( ! written.ok ) {
		notify(
			'error',
			__( 'Clipboard access was blocked by the browser.', TEXT_DOMAIN )
		);
		return;
	}

	notify( 'success', __( 'Content copied.', TEXT_DOMAIN ) );
}

export async function pasteBlockContent( clientId: string ): Promise< void > {
	const initial = readTarget( clientId );

	if ( ! initial.ok || ! initial.tree || ! initial.signature ) {
		notify( 'error', targetFailureMessage( initial.reason ) );
		return;
	}

	const clipboard = await readClipboardText();

	if ( ! clipboard.ok || typeof clipboard.text !== 'string' ) {
		notify(
			'error',
			__( 'Clipboard access was blocked by the browser.', TEXT_DOMAIN )
		);
		return;
	}

	const text = clipboard.text.trim();

	if ( text === '' ) {
		notify( 'warning', __( 'No compatible block content found.', TEXT_DOMAIN ) );
		return;
	}

	if ( clipboard.text.length > MAX_CLIPBOARD_LENGTH ) {
		notify( 'error', failureMessage( { ok: false, code: 'limit' } ) );
		return;
	}

	const parsed = parseDocument( text );

	if ( ! parsed.ok || ! parsed.value ) {
		notify( 'warning', __( 'No compatible block content found.', TEXT_DOMAIN ) );
		return;
	}

	if ( parsed.value.name !== initial.tree.name ) {
		notify(
			'warning',
			__( 'Content cannot be pasted into this block type.', TEXT_DOMAIN )
		);
		return;
	}

	const missing = await unresolvedReferences(
		parsed.value.name,
		parsed.value.attributes
	);

	if ( missing.length > 0 ) {
		notify(
			'error',
			sprintf(
				/* translators: %s: comma separated list of taxonomy slugs. */
				__( 'These taxonomy terms do not exist on this site: %s', TEXT_DOMAIN ),
				missing.join( ', ' )
			)
		);
		return;
	}

	const current = readTarget( clientId );

	if (
		! current.ok ||
		! current.tree ||
		current.signature !== initial.signature
	) {
		notify(
			'warning',
			__( 'The destination changed. Try pasting again.', TEXT_DOMAIN )
		);
		return;
	}

	const plan = buildPatches( parsed.value, current.tree, defaultsFor );

	if ( ! plan.ok || ! plan.value ) {
		notify( 'warning', failureMessage( plan ) );
		return;
	}

	if ( plan.value.length === 0 ) {
		notify(
			'warning',
			__( 'The block already contains this content.', TEXT_DOMAIN )
		);
		return;
	}

	const paths = clientIdsByPath( clientId );
	const clientIds: string[] = [];
	const attributes: Record< string, Record< string, unknown > > = {};

	for ( const patch of plan.value as BlockPatch[] ) {
		const target = paths.get( patch.path.join( '.' ) );

		if ( ! target ) {
			notify(
				'warning',
				__( 'The destination changed. Try pasting again.', TEXT_DOMAIN )
			);
			return;
		}

		clientIds.push( target );
		attributes[ target ] = patch.attributes;
	}

	if ( clientIds.length === 0 ) {
		notify(
			'warning',
			__( 'The block already contains this content.', TEXT_DOMAIN )
		);
		return;
	}

	try {
		dispatch( blockEditorStore ).updateBlockAttributes( clientIds, attributes, {
			uniqueByBlock: true,
		} );
	} catch {
		notify(
			'error',
			__( 'The content could not be pasted. Try again.', TEXT_DOMAIN )
		);
		return;
	}

	notify( 'success', __( 'Content pasted.', TEXT_DOMAIN ) );
}

/** Availability used by the menu to disable an action with a visible reason. */
export function copyAvailability( clientId: string ): {
	enabled: boolean;
	reason?: string;
} {
	const source = readSource( clientId );

	if ( ! source.ok || ! source.tree ) {
		return { enabled: false, reason: targetFailureMessage( source.reason ) };
	}

	const projection = buildProjection( source.tree, defaultsFor );

	return projection.ok
		? { enabled: true }
		: { enabled: false, reason: failureMessage( projection ) };
}

export function pasteAvailability( clientId: string ): {
	enabled: boolean;
	reason?: string;
} {
	const target = readTarget( clientId );

	return target.ok
		? { enabled: true }
		: { enabled: false, reason: targetFailureMessage( target.reason ) };
}
