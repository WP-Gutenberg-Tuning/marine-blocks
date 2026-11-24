import { store as blockEditorStore } from '@wordpress/block-editor';
import { parse, serialize } from '@wordpress/blocks';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { PluginMoreMenuItem } from '../../shared/plugin-more-menu-item';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { registerPlugin } from '@wordpress/plugins';

import { isCoreControlEnabled } from '../config';

const BLOCK_DELIMITER = '<!-- wp:';

function BlockClipboardMenuItems() {
	const { createNotice } = useDispatch( noticesStore );
	const { insertBlocks } = useDispatch( blockEditorStore );
	const { insertionPoint, selectedBlocks } = useSelect( ( select ) => {
		const editor = select( blockEditorStore );
		const selectedClientIds = editor.getSelectedBlockClientIds();

		return {
			insertionPoint: editor.getBlockInsertionPoint(),
			selectedBlocks: editor.getBlocksByClientId( selectedClientIds ),
		};
	}, [] );

	const copyBlocks = async () => {
		if ( ! selectedBlocks.length ) {
			return;
		}

		try {
			await navigator.clipboard.writeText( serialize( selectedBlocks ) );
			createNotice(
				'success',
				__(
					'Selected block content copied.',
					'skvn-marine-blocks'
				),
				{ type: 'snackbar' }
			);
		} catch {
			createNotice(
				'error',
				__(
					'Clipboard access was blocked by the browser.',
					'skvn-marine-blocks'
				),
				{ type: 'snackbar' }
			);
		}
	};

	const pasteBlocks = async () => {
		try {
			const content = await navigator.clipboard.readText();

			if ( ! content.includes( BLOCK_DELIMITER ) ) {
				createNotice(
					'warning',
					__(
						'The clipboard does not contain Gutenberg block markup.',
						'skvn-marine-blocks'
					),
					{ type: 'snackbar' }
				);
				return;
			}

			const blocks = parse( content );

			if ( ! blocks.length ) {
				createNotice(
					'warning',
					__(
						'No valid Gutenberg blocks were found.',
						'skvn-marine-blocks'
					),
					{ type: 'snackbar' }
				);
				return;
			}

			const editor = select( blockEditorStore );
			const canInsertAtSelection = blocks.every( ( block ) =>
				editor.canInsertBlockType(
					block.name,
					insertionPoint.rootClientId
				)
			);
			const canInsertAtCanvas = blocks.every( ( block ) =>
				editor.canInsertBlockType( block.name )
			);

			if ( ! canInsertAtSelection && ! canInsertAtCanvas ) {
				createNotice(
					'warning',
					__(
						'These blocks cannot be inserted in the current editor.',
						'skvn-marine-blocks'
					),
					{ type: 'snackbar' }
				);
				return;
			}

			const rootClientId = canInsertAtSelection
				? insertionPoint.rootClientId
				: undefined;
			const index = canInsertAtSelection
				? insertionPoint.index
				: editor.getBlockOrder().length;

			insertBlocks( blocks, index, rootClientId, true );
			createNotice(
				'success',
				__( 'Block content pasted.', 'skvn-marine-blocks' ),
				{ type: 'snackbar' }
			);
		} catch {
			createNotice(
				'error',
				__(
					'Clipboard access was blocked or the block markup is invalid.',
					'skvn-marine-blocks'
				),
				{ type: 'snackbar' }
			);
		}
	};

	return (
		<>
			<PluginMoreMenuItem
				disabled={ ! selectedBlocks.length }
				icon="clipboard"
				onClick={ copyBlocks }
			>
				{ __( 'Copy selected block(s)', 'skvn-marine-blocks' ) }
			</PluginMoreMenuItem>
			<PluginMoreMenuItem icon="editor-paste-text" onClick={ pasteBlocks }>
				{ __( 'Paste block(s)', 'skvn-marine-blocks' ) }
			</PluginMoreMenuItem>
		</>
	);
}

if ( isCoreControlEnabled( 'block_clipboard' ) ) {
	registerPlugin( 'skvn-marine-block-clipboard', {
		render: BlockClipboardMenuItems,
	} );
}
