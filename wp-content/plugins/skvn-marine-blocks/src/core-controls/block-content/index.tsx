/**
 * Content actions in the existing per-block options menu (plan057 P3).
 *
 * One registered Fill for the whole editor: `BlockSettingsMenuControls` renders
 * inside the same `MenuGroup` as the native block actions, so the two items sit
 * in the block's own ⋮ menu. No header button, no editor-wide menu, no
 * contextmenu handler and no Ctrl+C/V override.
 */

import { BlockSettingsMenuControls } from '@wordpress/block-editor';
import { MenuGroup, MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';

import { isCoreControlEnabled } from '../config';
import { isSupportedRoot } from './fields';
import {
	copyAvailability,
	copyBlockContent,
	hasContentActionsApi,
	pasteAvailability,
	pasteBlockContent,
} from './controller';

const TEXT_DOMAIN = 'skvn-marine-blocks';

/**
 * Module-level busy flag: the request keeps running after the Fill unmounts
 * (the menu closes on click), and a second click must not start a second plan.
 */
let requestInFlight = false;

type ContentActionsProps = {
	selectedClientIds?: string[];
	selectedBlocks?: string[];
	onClose?: () => void;
};

function ContentActionsMenuItems( {
	selectedClientIds,
	selectedBlocks,
	onClose,
}: ContentActionsProps ) {
	const clientId =
		selectedClientIds && selectedClientIds.length === 1
			? selectedClientIds[ 0 ]
			: '';
	const name =
		selectedBlocks && selectedBlocks.length === 1 ? selectedBlocks[ 0 ] : '';

	// No root, multi-select or unknown block: no group at all.
	if ( ! clientId || ! name || ! isSupportedRoot( name ) ) {
		return null;
	}

	if ( ! hasContentActionsApi() ) {
		return null;
	}

	const copy = copyAvailability( clientId );
	const paste = pasteAvailability( clientId );

	const run = ( action: () => Promise< void > ): void => {
		if ( requestInFlight ) {
			return;
		}

		requestInFlight = true;
		onClose?.();
		void action()
			// The controller reports every expected failure as a notice; this
			// guard only keeps an unexpected rejection out of the console.
			.catch( () => undefined )
			.finally( () => {
				requestInFlight = false;
			} );
	};

	return (
		<MenuGroup label={ __( 'Content actions', TEXT_DOMAIN ) }>
			<MenuItem
				disabled={ ! copy.enabled }
				info={ copy.enabled ? undefined : copy.reason }
				onClick={ () => run( () => copyBlockContent( clientId ) ) }
			>
				{ __( 'Copy content', TEXT_DOMAIN ) }
			</MenuItem>
			<MenuItem
				disabled={ ! paste.enabled }
				info={ paste.enabled ? undefined : paste.reason }
				onClick={ () => run( () => pasteBlockContent( clientId ) ) }
			>
				{ __( 'Paste content only', TEXT_DOMAIN ) }
			</MenuItem>
		</MenuGroup>
	);
}

function BlockContentActions() {
	return (
		<BlockSettingsMenuControls>
			{ ( fillProps: ContentActionsProps ) => (
				<ContentActionsMenuItems { ...fillProps } />
			) }
		</BlockSettingsMenuControls>
	);
}

if ( isCoreControlEnabled( 'block_clipboard' ) ) {
	registerPlugin( 'skvn-marine-block-content-actions', {
		render: BlockContentActions,
	} );
}
