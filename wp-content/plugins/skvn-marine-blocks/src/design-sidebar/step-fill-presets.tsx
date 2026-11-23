/**
 * Step fill presets — Marine Blocks sidebar library (Plugin tab) and the
 * "Fill preset" SelectControl used in the Selected block tab for step-slider /
 * step-slide selections.
 *
 * Deep Marine is built into the plugin: shown, never editable, never deletable,
 * never written to the option. Guest presets live in the
 * skvn_marine_blocks_step_fill_presets option via a dedicated AJAX action and
 * nonce (skvn_marine_blocks_step_fill_presets), independent from
 * skvn_marine_design_settings. Read: users who can edit posts or pages.
 * Write and delete: manage_options, rechecked on the server.
 */

import { Button, Notice, PanelBody, SelectControl, Spinner, TextControl } from '@wordpress/components';
import { useCallback, useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import {
	DEEP_MARINE_SLUG,
	PROCESS_STRIP_SLUG,
	type StepFillPreset,
} from '../step-slide/fill-preset';
import { STEP_DEFAULT_FILLS } from '../step-slide/default-fills';
import { PROCESS_STRIP_FILLS } from '../step-slide/process-strip-fills';

const MAX_SLOTS = 8;

declare global {
	interface Window {
		skvnMarineStepFillPresets?: {
			url: string;
			nonce: string;
			canManageOptions: boolean;
		};
	}
}

export type StepFillPresetsSnapshot = {
	presets: StepFillPreset[];
	canManageOptions: boolean;
};

type RequestData = Record< string, string >;

class StepFillPresetsError extends Error {}

async function post< T >( data: RequestData, signal?: AbortSignal ): Promise< T > {
	const config = window.skvnMarineStepFillPresets;
	if ( ! config ) {
		throw new StepFillPresetsError(
			__( 'Step fill presets are unavailable. Reload the editor after updating the plugin.', 'skvn-marine-blocks' )
		);
	}
	const response = await fetch( config.url, {
		method: 'POST',
		credentials: 'same-origin',
		signal,
		cache: 'no-store',
		body: new URLSearchParams( {
			action: 'skvn_marine_blocks_step_fill_presets',
			nonce: config.nonce,
			...data,
		} ),
	} );
	let json;
	try {
		json = await response.json();
	} catch {
		throw new StepFillPresetsError(
			__( 'The server response could not be read. Your changes are kept in the form. Try again.', 'skvn-marine-blocks' )
		);
	}
	if ( ! json || typeof json !== 'object' || typeof json.success !== 'boolean' || ! json.data || typeof json.data !== 'object' ) {
		throw new StepFillPresetsError(
			__( 'The server returned an unexpected response. Reload the editor and try again.', 'skvn-marine-blocks' )
		);
	}
	if ( ! response.ok || ! json.success ) {
		throw new StepFillPresetsError(
			typeof json.data?.message === 'string' && json.data.message
				? json.data.message
				: __( 'Step fill presets could not be loaded or saved. Try again.', 'skvn-marine-blocks' )
		);
	}
	return json.data as T;
}

// Module-level cache shared by the Plugin tab and every mounted step-slide.
// invalidateStepFillPresets() clears it and notifies subscribers to refetch.
let cache: StepFillPresetsSnapshot | null = null;
let inflight: Promise< StepFillPresetsSnapshot > | null = null;
const listeners = new Set< () => void >();

function readShared(): Promise< StepFillPresetsSnapshot > {
	if ( ! inflight ) {
		inflight = post< StepFillPresetsSnapshot >( { operation: 'read' } ).finally( () => {
			inflight = null;
		} );
	}
	return inflight;
}

function notify() {
	listeners.forEach( ( listener ) => listener() );
}

function invalidateStepFillPresets() {
	cache = null;
	notify();
}

export type StepFillPresetsModel = {
	snapshot: StepFillPresetsSnapshot | null;
	loading: boolean;
	error: string;
	canManageOptions: boolean;
	reload: () => void;
	save: ( slug: string, name: string, fills: string[] ) => Promise< void >;
	remove: ( slug: string ) => Promise< void >;
};

export function useStepFillPresets(): StepFillPresetsModel {
	const [ snapshot, setSnapshot ] = useState< StepFillPresetsSnapshot | null >( cache );
	const [ loading, setLoading ] = useState( ! cache );
	const [ error, setError ] = useState( '' );
	const mounted = useRef( true );

	useEffect( () => {
		mounted.current = true;
		const load = () => {
			setError( '' );
			if ( cache ) {
				if ( mounted.current ) {
					setSnapshot( cache );
					setLoading( false );
				}
				return;
			}
			setLoading( true );
			readShared()
				.then( ( result ) => {
					cache = result;
					if ( mounted.current ) {
						setSnapshot( result );
						setLoading( false );
					}
				} )
				.catch( ( failure: unknown ) => {
					if ( mounted.current ) {
						setError(
							failure instanceof Error
								? failure.message
								: __( 'Step fill presets could not be loaded.', 'skvn-marine-blocks' )
						);
						setLoading( false );
					}
				} );
		};
		const listener = () => {
			if ( mounted.current ) {
				load();
			}
		};
		listeners.add( listener );
		load();
		return () => {
			mounted.current = false;
			listeners.delete( listener );
		};
	}, [] );

	const canManageOptions = snapshot
		? snapshot.canManageOptions
		: window.skvnMarineStepFillPresets?.canManageOptions === true;

	const save = useCallback( async ( slug: string, name: string, fills: string[] ) => {
		const result = await post< StepFillPresetsSnapshot >( {
			operation: 'save',
			slug,
			name,
			fills: JSON.stringify( fills ),
		} );
		cache = result;
		notify();
	}, [] );

	const remove = useCallback( async ( slug: string ) => {
		const result = await post< StepFillPresetsSnapshot >( {
			operation: 'delete',
			slug,
		} );
		cache = result;
		notify();
	}, [] );

	const reload = useCallback( () => {
		invalidateStepFillPresets();
	}, [] );

	return { snapshot, loading, error, canManageOptions, reload, save, remove };
}

/**
 * SelectControl bound to the step-slider fillPreset attribute. The caller
 * decides which block attribute is written (the step-slider itself, or the
 * parent slider when a step-slide is selected).
 */
export function StepFillPresetSelect( {
	value,
	onChange,
	disabled = false,
}: {
	value: string;
	onChange: ( fillPreset: string ) => void;
	disabled?: boolean;
} ) {
	const { snapshot, loading } = useStepFillPresets();
	const options = useMemo(
		() => [
			{ label: __( 'Deep Marine', 'skvn-marine-blocks' ), value: DEEP_MARINE_SLUG },
			{
				label: __( 'Process Strip', 'skvn-marine-blocks' ),
				value: PROCESS_STRIP_SLUG,
			},
			...( snapshot?.presets ?? [] ).map( ( preset ) => ( {
				label: preset.name,
				value: preset.slug,
			} ) ),
		],
		[ snapshot ]
	);
	const current = typeof value === 'string' && value ? value : DEEP_MARINE_SLUG;
	const known = options.some( ( option ) => option.value === current );

	return (
		<>
			<SelectControl
				disabled={ disabled || loading }
				help={ __(
					'Every step tab uses this preset, including steps that have an image. The image stays on the slide.',
					'skvn-marine-blocks'
				) }
				label={ __( 'Fill preset', 'skvn-marine-blocks' ) }
				onChange={ onChange }
				options={ options }
				value={ known ? current : DEEP_MARINE_SLUG }
			/>
			{ ! known && (
				<Notice isDismissible={ false } status="warning">
					{ __(
						'The saved preset no longer exists. Steps without an image use Deep Marine until you pick another preset.',
						'skvn-marine-blocks'
					) }
				</Notice>
			) }
		</>
	);
}

function BuiltInPresetRow( {
	fills,
	name,
	note,
}: {
	fills: readonly string[];
	name: string;
	note: string;
} ) {
	return (
		<div style={ { marginBottom: 16 } }>
			<div style={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 } }>
				<strong>{ name }</strong>
				<span>{ __( 'Built-in preset', 'skvn-marine-blocks' ) }</span>
			</div>
			<div style={ { display: 'flex', gap: 6, marginTop: 6 } }>
				{ fills.map( ( fill, index ) => (
					<span
						aria-hidden="true"
						key={ index }
						style={ {
							border: '1px solid #ccc',
							borderRadius: 4,
							display: 'inline-block',
							height: 32,
							width: 48,
							background: fill,
						} }
						title={ fill }
					/>
				) ) }
			</div>
			<p style={ { margin: '6px 0 0' } }>{ note }</p>
		</div>
	);
}

function DeepMarineRow() {
	return (
		<BuiltInPresetRow
			fills={ STEP_DEFAULT_FILLS }
			name={ __( 'Deep Marine', 'skvn-marine-blocks' ) }
			note={ __(
				'It cannot be edited or deleted. Sliders without a preset, with an unknown slug, or a deleted preset use Deep Marine.',
				'skvn-marine-blocks'
			) }
		/>
	);
}

function ProcessStripRow() {
	return (
		<BuiltInPresetRow
			fills={ PROCESS_STRIP_FILLS }
			name={ __( 'Process Strip', 'skvn-marine-blocks' ) }
			note={ __(
				'Flat navy tabs (#0b1219). The active tab uses #232d37 with the progress accent on top, matching the step-bar artifact.',
				'skvn-marine-blocks'
			) }
		/>
	);
}

type Draft = {
	id: string;
	slug: string;
	name: string;
	fills: string[];
	isNew: boolean;
};

function presetToDraft( preset: StepFillPreset ): Draft {
	return {
		id: preset.slug,
		slug: preset.slug,
		name: preset.name,
		fills: [ ...preset.fills ],
		isNew: false,
	};
}

function canSaveDraft( draft: Draft ): boolean {
	return draft.name.trim() !== '' && draft.fills.some( ( fill ) => fill.trim() !== '' );
}

function PresetCard( {
	initial,
	canManageOptions,
	busy,
	onSave,
	onRemove,
	onCancelNew,
}: {
	initial: Draft;
	canManageOptions: boolean;
	busy: boolean;
	onSave: ( draft: Draft ) => void;
	onRemove: ( slug: string ) => void;
	onCancelNew: () => void;
} ) {
	const [ draft, setDraft ] = useState< Draft >( initial );
	const [ confirming, setConfirming ] = useState( false );
	const initialRef = useRef( initial );

	// Resync when the library snapshot replaces this preset (e.g. after a save
	// or when another editor changed it).
	useEffect( () => {
		if ( initialRef.current !== initial ) {
			initialRef.current = initial;
			setDraft( initial );
			setConfirming( false );
		}
	}, [ initial ] );

	const disabled = ! canManageOptions || busy;
	const updateSlot = ( index: number, fill: string ) =>
		setDraft( ( previous ) => {
			const fills = [ ...previous.fills ];
			fills[ index ] = fill;
			return { ...previous, fills };
		} );
	const removeSlot = ( index: number ) =>
		setDraft( ( previous ) => ( {
			...previous,
			fills: previous.fills.filter( ( _, i ) => i !== index ),
		} ) );
	const addSlot = () =>
		setDraft( ( previous ) =>
			previous.fills.length >= MAX_SLOTS
				? previous
				: { ...previous, fills: [ ...previous.fills, '' ] }
		);

	// Read-only rendering for users without manage_options.
	if ( ! canManageOptions ) {
		return (
			<div style={ { border: '1px solid #ddd', borderRadius: 4, padding: 12, marginBottom: 12 } }>
				<strong>{ draft.name || draft.slug }</strong>
				<div style={ { display: 'flex', gap: 6, marginTop: 6 } }>
					{ draft.fills.map( ( fill, index ) => (
						<span
							aria-hidden="true"
							key={ index }
							style={ {
								border: '1px solid #ccc',
								borderRadius: 4,
								display: 'inline-block',
								height: 32,
								width: 48,
								background: fill || 'transparent',
							} }
							title={ fill || __( 'Empty slot', 'skvn-marine-blocks' ) }
						/>
					) ) }
				</div>
			</div>
		);
	}

	return (
		<div style={ { border: '1px solid #ddd', borderRadius: 4, padding: 12, marginBottom: 12 } }>
			<TextControl
				disabled={ disabled }
				help={ __( 'Stable slug, never shown on the page.', 'skvn-marine-blocks' ) }
				label={ __( 'Preset name', 'skvn-marine-blocks' ) }
				onChange={ ( name ) => setDraft( ( previous ) => ( { ...previous, name } ) ) }
				value={ draft.name }
			/>
			{ draft.fills.map( ( fill, index ) => (
				<div key={ index } style={ { display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 } }>
					<div style={ { flex: 1 } }>
						<TextControl
							disabled={ disabled }
							help={
								index === 0
									? __( 'Hex color or CSS gradient. Leave a slot empty to cycle that step through Deep Marine.', 'skvn-marine-blocks' )
									: undefined
							}
							label={ sprintf( /* translators: %d: slot position */ __( 'Slot %d', 'skvn-marine-blocks' ), index + 1 ) }
							onChange={ ( value ) => updateSlot( index, value ) }
							placeholder="#0f4266"
							value={ fill }
						/>
					</div>
					<span
						aria-hidden="true"
						style={ {
							border: '1px solid #ccc',
							borderRadius: 4,
							display: 'inline-block',
							height: 32,
							marginTop: 24,
							width: 48,
							background: fill || 'transparent',
						} }
						title={ fill || __( 'Empty slot', 'skvn-marine-blocks' ) }
					/>
					{ draft.fills.length > 1 && (
						<Button
							disabled={ disabled }
							isDestructive
							onClick={ () => removeSlot( index ) }
							style={ { marginTop: 24 } }
							variant="tertiary"
						>
							{ __( 'Remove', 'skvn-marine-blocks' ) }
						</Button>
					) }
				</div>
			) ) }
			<Button
				disabled={ disabled || draft.fills.length >= MAX_SLOTS }
				onClick={ addSlot }
				variant="secondary"
			>
				{ __( 'Add slot', 'skvn-marine-blocks' ) }
			</Button>
			<div style={ { display: 'flex', gap: 8, marginTop: 12 } }>
				<Button
					disabled={ disabled || ! canSaveDraft( draft ) }
					onClick={ () => onSave( draft ) }
					variant="primary"
				>
					{ __( 'Save preset', 'skvn-marine-blocks' ) }
				</Button>
				{ draft.isNew && (
					<Button onClick={ onCancelNew } variant="tertiary">
						{ __( 'Cancel', 'skvn-marine-blocks' ) }
					</Button>
				) }
				{ ! draft.isNew && ! confirming && (
					<Button isDestructive onClick={ () => setConfirming( true ) } variant="tertiary">
						{ __( 'Delete', 'skvn-marine-blocks' ) }
					</Button>
				) }
				{ ! draft.isNew && confirming && (
					<>
						<span style={ { alignSelf: 'center' } }>
							{ __( 'Delete this preset? Pages using it fall back to Deep Marine.', 'skvn-marine-blocks' ) }
						</span>
						<Button isDestructive onClick={ () => onRemove( draft.slug ) } variant="secondary">
							{ __( 'Delete', 'skvn-marine-blocks' ) }
						</Button>
						<Button onClick={ () => setConfirming( false ) } variant="tertiary">
							{ __( 'Keep', 'skvn-marine-blocks' ) }
						</Button>
					</>
				) }
			</div>
		</div>
	);
}

/**
 * Preset library rendered in the Plugin tab of the Marine Blocks sidebar.
 */
export function StepFillPresetsLibrary() {
	const { snapshot, loading, error, canManageOptions, reload, save, remove } = useStepFillPresets();
	const [ newDraft, setNewDraft ] = useState< Draft | null >( null );
	const [ busy, setBusy ] = useState( false );
	const [ status, setStatus ] = useState( '' );
	const counter = useRef( 0 );

	const presets = snapshot?.presets ?? [];
	// Stable draft identities across re-renders; reset only when the snapshot changes.
	const drafts = useMemo( () => presets.map( presetToDraft ), [ presets ] );

	const run = async ( action: () => Promise< void >, successMessage: string, failureMessage: string ) => {
		setBusy( true );
		setStatus( '' );
		try {
			await action();
			setStatus( successMessage );
		} catch ( failure ) {
			setStatus( failure instanceof Error && failure.message ? failure.message : failureMessage );
		} finally {
			setBusy( false );
		}
	};

	const handleSave = ( draft: Draft ) =>
		run(
			async () => {
				await save( draft.isNew ? '' : draft.slug, draft.name.trim(), draft.fills.map( ( fill ) => fill ) );
				if ( draft.isNew ) {
					setNewDraft( null );
				}
			},
			__( 'Preset saved.', 'skvn-marine-blocks' ),
			__( 'The preset could not be saved.', 'skvn-marine-blocks' )
		);

	const handleRemove = ( slug: string ) =>
		run(
			() => remove( slug ),
			__( 'Preset deleted.', 'skvn-marine-blocks' ),
			__( 'The preset could not be deleted.', 'skvn-marine-blocks' )
		);

	const startNew = () => {
		counter.current += 1;
		setNewDraft( {
			id: `new-${ counter.current }`,
			slug: '',
			name: '',
			fills: [ '' ],
			isNew: true,
		} );
	};

	return (
		<PanelBody initialOpen={ true } title={ __( 'Step fill presets', 'skvn-marine-blocks' ) }>
			<p>
				{ __(
					'Named fill sequences for Step Slider tabs. Assign a preset to a slider in the Selected block tab. Sliders keep only the preset slug. A step image stays on the slide; its tab still uses the preset.',
					'skvn-marine-blocks'
				) }
			</p>
			{ error && (
				<Notice isDismissible={ false } status="error">
					<p>{ error }</p>
					<Button disabled={ loading } onClick={ reload } variant="secondary">
						{ __( 'Retry', 'skvn-marine-blocks' ) }
					</Button>
				</Notice>
			) }
			<DeepMarineRow />
			<ProcessStripRow />
			{ loading && <Spinner /> }
			{ canManageOptions && ! newDraft && (
				<Button onClick={ startNew } variant="secondary">
					{ __( 'Add preset', 'skvn-marine-blocks' ) }
				</Button>
			) }
			{ newDraft && (
				<PresetCard
					busy={ busy }
					canManageOptions={ canManageOptions }
					initial={ newDraft }
					onCancelNew={ () => setNewDraft( null ) }
					onRemove={ handleRemove }
					onSave={ handleSave }
				/>
			) }
			{ drafts.map( ( draft ) => (
				<PresetCard
					busy={ busy }
					canManageOptions={ canManageOptions }
					initial={ draft }
					key={ draft.slug }
					onCancelNew={ () => {} }
					onRemove={ handleRemove }
					onSave={ handleSave }
				/>
			) ) }
			{ ! canManageOptions && ! loading && (
				<p>
					{ __( 'You can view step fill presets. Only administrators can add, rename, edit or delete presets.', 'skvn-marine-blocks' ) }
				</p>
			) }
			{ status && (
				<p aria-live="polite" role="status">
					{ status }
				</p>
			) }
		</PanelBody>
	);
}
