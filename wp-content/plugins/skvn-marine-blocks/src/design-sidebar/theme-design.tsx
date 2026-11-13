import { Button, Notice, PanelBody, SelectControl, Spinner, TextControl, ToggleControl } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

type Group = 'palette' | 'heading' | 'fonts' | 'product';
type Values = Record< string, string | boolean | { size: string; weight: string } >;
type SavedGroup = { value: Values; revision: string; canEdit: boolean };
type Snapshot = {
	available: boolean;
	incompatible: boolean;
	settingsUrl: string;
	groups?: Record< Group, SavedGroup >;
	presets?: { label: string; value: string }[];
	scopes?: { label: string; value: string }[];
};
declare global { interface Window { skvnMarineDesign?: { url: string; nonce: string; woocommerceAvailable: boolean; postEditor: boolean } } }

class DesignRequestError extends Error {
	code: string;
	current?: SavedGroup;
	canEdit?: boolean;
	constructor( message: string, code: string, current?: SavedGroup, canEdit?: boolean ) {
		super( message );
		this.code = code;
		this.current = current;
		this.canEdit = canEdit;
	}
}

async function request< T >( data: Record< string, string >, signal?: AbortSignal, session = false ): Promise< T > {
	const config = window.skvnMarineDesign;
	if ( ! config ) throw new Error( __( 'Design settings are unavailable. Reload the editor after updating the plugin.', 'skvn-marine-blocks' ) );
	const response = await fetch( config.url, {
		method: 'POST', credentials: 'same-origin', signal,
		cache: 'no-store',
		body: new URLSearchParams( { action: session ? 'skvn_marine_design_session' : 'skvn_marine_design_settings', nonce: config.nonce, ...data } ),
	} );
	let json;
	try { json = await response.json(); } catch {
		throw new DesignRequestError( __( 'The server response could not be read. Your draft is kept. Refresh your session or check the connection.', 'skvn-marine-blocks' ), 'request_error' );
	}
	if ( ! json || typeof json !== 'object' || typeof json.success !== 'boolean' || ! json.data || typeof json.data !== 'object' ) {
		throw new DesignRequestError( __( 'The server returned an unexpected response. Sign in if needed, then refresh your session. Your draft is kept.', 'skvn-marine-blocks' ), 'request_error' );
	}
	if ( ! response.ok || ! json.success ) throw new DesignRequestError(
		json.data?.message || __( 'Design settings could not be loaded or saved. Your draft is kept. Check your session and permissions.', 'skvn-marine-blocks' ),
		json.data?.code || 'request_error', json.data?.current || undefined,
		typeof json.data?.canEdit === 'boolean' ? json.data.canEdit : undefined
	);
	return json.data;
}

export function useThemeDesign( active: boolean ) {
	const [ snapshot, setSnapshot ] = useState< Snapshot | null >( null );
	const [ drafts, setDrafts ] = useState< Partial< Record< Group, Values > > >( {} );
	const [ error, setError ] = useState( '' );
	const [ statuses, setStatuses ] = useState< Partial< Record< Group, string > > >( {} );
	const [ pending, setPending ] = useState< Partial< Record< Group, boolean > > >( {} );
	const [ conflicts, setConflicts ] = useState< Partial< Record< Group, SavedGroup > > >( {} );
	const [ activated, setActivated ] = useState( false );
	const [ attempt, setAttempt ] = useState( 0 );
	const [ sessionError, setSessionError ] = useState( '' );
	const [ sessionPending, setSessionPending ] = useState( false );
	const [ readPending, setReadPending ] = useState( false );
	const lifecycle = useRef( new AbortController() );
	// Once activated, closing the panel must not cancel a read or discard drafts.
	useEffect( () => { if ( active ) setActivated( true ); }, [ active ] );
	useEffect( () => {
		lifecycle.current = new AbortController();
		return () => lifecycle.current.abort();
	}, [] );
	const recordSessionError = ( failure: unknown ) => {
		if ( failure instanceof DesignRequestError && [ 'expired_session', 'request_error' ].includes( failure.code ) ) setSessionError( failure.message );
	};
	useEffect( () => {
		if ( ! activated || snapshot ) return;
		const controller = new AbortController();
		let live = true;
		setError( '' );
		setReadPending( true );
		request< Snapshot >( { operation: 'read' }, controller.signal ).then( ( result ) => {
			if ( ! live ) return;
			setReadPending( false );
			setSessionError( '' );
			setSnapshot( result );
			if ( result.groups ) setDrafts( Object.fromEntries( Object.entries( result.groups ).map( ( [ key, group ] ) => [ key, group.value ] ) ) );
		} ).catch( ( failure ) => { if ( live ) { setReadPending( false ); if ( failure.name !== 'AbortError' ) { setError( failure.message ); recordSessionError( failure ); } } } );
		return () => { live = false; controller.abort(); };
	}, [ activated, attempt, snapshot ] );
	const retryRead = () => { if ( ! snapshot && ! sessionPending && ! readPending ) setAttempt( ( previous ) => previous + 1 ); };
	const dirty = ( group: Group ) => JSON.stringify( drafts[ group ] ) !== JSON.stringify( snapshot?.groups?.[ group ].value );
	const draftGroups = ( [ 'palette', 'heading', 'fonts', ...( snapshot?.groups?.product ? ( [ 'product' ] as const ) : [] ) ] ) as Group[];
	const hasDraft = !! snapshot?.groups && draftGroups.some( dirty );
	useEffect( () => {
		if ( ! hasDraft ) return;
		const warn = ( event: BeforeUnloadEvent ) => { event.preventDefault(); event.returnValue = ''; };
		window.addEventListener( 'beforeunload', warn );
		return () => window.removeEventListener( 'beforeunload', warn );
	}, [ hasDraft ] );
	const change = ( group: Group, value: Values ) => {
		setDrafts( ( previous ) => ( { ...previous, [ group ]: value } ) );
		setStatuses( ( previous ) => ( { ...previous, [ group ]: '' } ) );
	};
	const save = async ( group: Group ) => {
		if ( sessionError || sessionPending || ! snapshot?.groups?.[ group ].canEdit || conflicts[ group ] || Object.values( pending ).some( Boolean ) ) return;
		setPending( ( previous ) => ( { ...previous, [ group ]: true } ) );
		try {
			const saved = await request< SavedGroup >( { operation: 'save', group, revision: snapshot.groups[ group ].revision, value: JSON.stringify( drafts[ group ] ) }, lifecycle.current.signal );
			setSnapshot( ( previous ) => previous && ( { ...previous, groups: { ...previous.groups!, [ group ]: saved } } ) );
			setDrafts( ( previous ) => ( { ...previous, [ group ]: saved.value } ) );
			setStatuses( ( previous ) => ( { ...previous, [ group ]: __( 'Saved. Reload the editor to see the saved theme design in the canvas. The site uses saved settings.', 'skvn-marine-blocks' ) } ) );
		} catch ( failure ) {
			recordSessionError( failure );
			if ( failure instanceof DesignRequestError ) {
				if ( failure.code === 'conflict' && failure.current ) setConflicts( ( previous ) => ( { ...previous, [ group ]: failure.current } ) );
				if ( failure.canEdit === false ) setSnapshot( ( previous ) => previous?.groups ? ( { ...previous, groups: { ...previous.groups, [ group ]: { ...previous.groups[ group ], canEdit: false } } } ) : previous );
			}
			setStatuses( ( previous ) => ( { ...previous, [ group ]: failure instanceof Error ? failure.message : __( 'Save failed. Your draft is kept.', 'skvn-marine-blocks' ) } ) );
		} finally { setPending( ( previous ) => ( { ...previous, [ group ]: false } ) ); }
	};
	const discard = async ( group: Group ) => {
		if ( sessionError || sessionPending || Object.values( pending ).some( Boolean ) ) return;
		setPending( ( previous ) => ( { ...previous, [ group ]: true } ) );
		try {
			const current = await request< Snapshot >( { operation: 'read' }, lifecycle.current.signal );
			if ( ! current.groups?.[ group ] ) throw new Error( __( 'The theme integration is no longer available. Your draft is kept.', 'skvn-marine-blocks' ) );
			setSnapshot( ( previous ) => previous && ( { ...previous, groups: { ...previous.groups!, [ group ]: current.groups![ group ] } } ) );
			setDrafts( ( previous ) => ( { ...previous, [ group ]: current.groups![ group ].value } ) );
			setConflicts( ( previous ) => ( { ...previous, [ group ]: undefined } ) );
			setStatuses( ( previous ) => ( { ...previous, [ group ]: __( 'Draft discarded. Current saved values loaded for this group.', 'skvn-marine-blocks' ) } ) );
		} catch ( failure ) { recordSessionError( failure ); setStatuses( ( previous ) => ( { ...previous, [ group ]: failure instanceof Error ? failure.message : __( 'Could not reload this group. Your draft is kept.', 'skvn-marine-blocks' ) } ) ); }
		finally { setPending( ( previous ) => ( { ...previous, [ group ]: false } ) ); }
	};
	const resolveConflict = ( group: Group, useCurrent: boolean ) => {
		const current = conflicts[ group ];
		if ( ! current ) return;
		setSnapshot( ( previous ) => previous?.groups ? ( { ...previous, groups: { ...previous.groups, [ group ]: current } } ) : previous );
		if ( useCurrent ) setDrafts( ( previous ) => ( { ...previous, [ group ]: current.value } ) );
		setConflicts( ( previous ) => ( { ...previous, [ group ]: undefined } ) );
		setStatuses( ( previous ) => ( { ...previous, [ group ]: useCurrent
			? __( 'Current saved values loaded for this group. Other drafts are kept.', 'skvn-marine-blocks' )
			: __( 'Your draft is kept against the reviewed saved values. Nothing was saved. Choose Save group when ready.', 'skvn-marine-blocks' ) } ) );
	};
	const refreshAccess = async ( group: Group ) => {
		if ( sessionPending || Object.values( pending ).some( Boolean ) ) return;
		setPending( ( previous ) => ( { ...previous, [ group ]: true } ) );
		try {
			const current = await request< Snapshot >( { operation: 'read' }, lifecycle.current.signal );
			if ( ! current.available || ! current.groups?.[ group ] ) throw new Error( __( 'The theme integration is unavailable. Your draft is kept.', 'skvn-marine-blocks' ) );
			// Re-enable access only. Keep base revision so a later save still detects conflicts.
			setSnapshot( ( previous ) => previous?.groups ? ( { ...previous, groups: { ...previous.groups, [ group ]: { ...previous.groups[ group ], canEdit: current.groups![ group ].canEdit } } } ) : previous );
			setStatuses( ( previous ) => ( { ...previous, [ group ]: __( 'Permissions refreshed. Your draft and saved baseline are kept.', 'skvn-marine-blocks' ) } ) );
		} catch ( failure ) { recordSessionError( failure ); setStatuses( ( previous ) => ( { ...previous, [ group ]: failure instanceof Error ? failure.message : __( 'Permissions could not be refreshed. Your draft is kept.', 'skvn-marine-blocks' ) } ) ); }
		finally { setPending( ( previous ) => ( { ...previous, [ group ]: false } ) ); }
	};
	const refreshSession = async () => {
		if ( readPending || sessionPending || Object.values( pending ).some( Boolean ) ) return;
		setSessionPending( true );
		try {
			const token = await request< { nonce: string } >( {}, lifecycle.current.signal, true );
			if ( typeof token.nonce !== 'string' || ! token.nonce || ! window.skvnMarineDesign ) throw new Error( __( 'The session could not be refreshed. Your draft is kept.', 'skvn-marine-blocks' ) );
			window.skvnMarineDesign.nonce = token.nonce;
			const current = await request< Snapshot >( { operation: 'read' }, lifecycle.current.signal );
			// Access only: never rebase saved revisions or discard drafts/conflicts here.
			if ( snapshot ) {
				setSnapshot( ( previous ) => previous && ( { ...previous, available: current.available, incompatible: current.incompatible, settingsUrl: current.settingsUrl, groups: previous.groups && Object.fromEntries( Object.entries( previous.groups ).map( ( [ key, saved ] ) => [ key, { ...saved, canEdit: current.groups?.[ key ]?.canEdit === true } ] ) ) as Snapshot['groups'] } ) );
			} else {
				// Initial load failed: there are no editable drafts/base to replace yet.
				setSnapshot( current );
				if ( current.groups ) setDrafts( Object.fromEntries( Object.entries( current.groups ).map( ( [ key, saved ] ) => [ key, saved.value ] ) ) );
			}
			setSessionError( '' );
			setError( '' );
		} catch ( failure ) {
			setSessionError( failure instanceof Error ? failure.message : __( 'Sign in, then refresh your session. Your draft is kept.', 'skvn-marine-blocks' ) );
		} finally { setSessionPending( false ); }
	};
	return { snapshot, drafts, error, statuses, pending, conflicts, dirty, hasDraft, sessionError, sessionPending, readPending, retryRead, refreshSession, change, save, discard, resolveConflict, refreshAccess };
}

const labels: Record< Group, string > = {
	palette: __( 'Brand colors', 'skvn-marine-blocks' ),
	heading: __( 'Typography', 'skvn-marine-blocks' ),
	fonts: __( 'Fonts', 'skvn-marine-blocks' ),
	product: __( 'Product page', 'skvn-marine-blocks' ),
};
const productLabels: Record< string, string > = {
	columns: __( 'Columns', 'skvn-marine-blocks' ),
	ratio: __( 'Column ratio', 'skvn-marine-blocks' ),
	width: __( 'Width', 'skvn-marine-blocks' ),
	showGallery: __( 'Show gallery', 'skvn-marine-blocks' ),
	showPrice: __( 'Show price', 'skvn-marine-blocks' ),
	showExcerpt: __( 'Show excerpt', 'skvn-marine-blocks' ),
	showMeta: __( 'Show product meta', 'skvn-marine-blocks' ),
	showTabs: __( 'Show tabs', 'skvn-marine-blocks' ),
	showTrust: __( 'Show trust signals', 'skvn-marine-blocks' ),
	showContact: __( 'Show contact link', 'skvn-marine-blocks' ),
	showQuote: __( 'Show quote button', 'skvn-marine-blocks' ),
	titleScale: __( 'Title size', 'skvn-marine-blocks' ),
	summaryGap: __( 'Column gap', 'skvn-marine-blocks' ),
	specs: __( 'Specifications', 'skvn-marine-blocks' ),
	ctaStyle: __( 'Quote button style', 'skvn-marine-blocks' ),
};
const paletteLabels = {
	primary: __( 'Primary', 'skvn-marine-blocks' ), accent: __( 'Accent', 'skvn-marine-blocks' ),
	surface: __( 'Surface', 'skvn-marine-blocks' ), text: __( 'Text', 'skvn-marine-blocks' ),
};
export function ThemeDesign( { model }: { model: ReturnType< typeof useThemeDesign > } ) {
	const { snapshot, drafts, error, statuses, pending, conflicts, dirty, hasDraft, sessionError, sessionPending, readPending, retryRead, refreshSession, change, save, discard, resolveConflict, refreshAccess } = model;
	const [ exporting, setExporting ] = useState( false );
	const busy = readPending || sessionPending || Object.values( pending ).some( Boolean );
	const recovery = <PanelBody>
		{ sessionError && <Notice status="warning" isDismissible={ false }>{ sessionError }</Notice> }
		{ ( sessionError || error ) && <Button variant="secondary" disabled={ busy } onClick={ refreshSession }>{ sessionPending ? __( 'Refreshing session…', 'skvn-marine-blocks' ) : __( 'Refresh session', 'skvn-marine-blocks' ) }</Button> }
		{ hasDraft && <>
			<Button variant="tertiary" onClick={ () => setExporting( ! exporting ) }>{ __( 'Export draft', 'skvn-marine-blocks' ) }</Button>
			{ exporting && <><p>{ __( 'Copy this draft before reloading. Restore these values manually; automatic import is not available. Reloading loses unsaved drafts.', 'skvn-marine-blocks' ) }</p><label>{ __( 'Theme Design draft JSON', 'skvn-marine-blocks' ) }<textarea readOnly rows={ 12 } value={ JSON.stringify( { schemaVersion: 1, groups: Object.fromEntries( Object.entries( drafts ).filter( ( [ key ] ) => dirty( key as Group ) ) ) }, null, 2 ) } onFocus={ ( event ) => event.currentTarget.select() } /></label></> }
		</> }
	</PanelBody>;
	if ( error && ! snapshot ) return <>{ recovery }<PanelBody><Notice status="error" isDismissible={ false }>{ error }</Notice><Button variant="secondary" disabled={ busy } onClick={ retryRead }>{ __( 'Retry read', 'skvn-marine-blocks' ) }</Button></PanelBody></>;
	if ( ! snapshot ) return <>{ recovery }<PanelBody><Spinner /><p>{ __( 'Loading plugin settings…', 'skvn-marine-blocks' ) }</p></PanelBody></>;
	return <>
		{ recovery }
		<PanelBody>
			<h2>{ __( 'Plugin settings', 'skvn-marine-blocks' ) }</h2>
			<p>{ __( 'Selected block styles are saved with the page. Theme Design is saved separately by group and applies across the site where theme tokens are inherited.', 'skvn-marine-blocks' ) }</p>
			{ snapshot.settingsUrl && <Button href={ snapshot.settingsUrl } target="_blank" rel="noopener noreferrer" variant="link">{ __( 'Open plugin settings', 'skvn-marine-blocks' ) }</Button> }
			{ ! snapshot.available && <p>{ snapshot.incompatible ? __( 'Theme Design needs a compatible SKVN Marine integration. Your saved settings are retained.', 'skvn-marine-blocks' ) : __( 'Theme Design is available with the SKVN Marine child theme. Block design controls work with your current theme.', 'skvn-marine-blocks' ) }</p> }
		</PanelBody>
		{ snapshot.available && snapshot.groups && <>
			<PanelBody><h2>{ __( 'Theme Design — SKVN Marine', 'skvn-marine-blocks' ) }</h2><p>{ __( 'Drafts do not preview in the canvas. Page Save does not save these settings. Local block overrides keep their own styles.', 'skvn-marine-blocks' ) }</p></PanelBody>
			{ ( [ 'palette', 'heading', 'fonts', ...( snapshot.groups.product ? ( [ 'product' ] as const ) : [] ) ] as Group[] ).map( ( group ) => {
				const value = drafts[ group ] || snapshot.groups![ group ].value;
				const canEdit = snapshot.groups![ group ].canEdit;
				return <PanelBody key={ group } title={ labels[ group ] } initialOpen={ group === 'palette' }>
					{ ! canEdit && <><p>{ __( 'This group cannot be saved with the current theme or permissions. Your draft is kept.', 'skvn-marine-blocks' ) }</p><Button variant="secondary" disabled={ busy } onClick={ () => refreshAccess( group ) }>{ __( 'Refresh permissions', 'skvn-marine-blocks' ) }</Button></> }
					{ conflicts[ group ] && <Notice status="warning" isDismissible={ false }>
						<p>{ __( 'Site settings conflict: compare the saved values with your draft. Choosing an option does not save anything.', 'skvn-marine-blocks' ) }</p>
						<ConflictComparison current={ conflicts[ group ]!.value } draft={ value } group={ group } />
						<Button variant="secondary" disabled={ busy } onClick={ () => resolveConflict( group, true ) }>{ __( 'Use current values', 'skvn-marine-blocks' ) }</Button>
						<Button variant="secondary" disabled={ busy || ! canEdit } onClick={ () => resolveConflict( group, false ) }>{ __( 'Keep my draft', 'skvn-marine-blocks' ) }</Button>
					</Notice> }
					<fieldset disabled={ ! canEdit || busy || !! sessionError || !! conflicts[ group ] } style={ { border: 0, padding: 0, margin: 0, minWidth: 0 } }>
						<legend>{ labels[ group ] }</legend>
						{ group === 'palette' && Object.entries( paletteLabels ).map( ( [ key, label ] ) => <TextControl key={ key } label={ label } help={ __( 'Hex color, for example #0369a1.', 'skvn-marine-blocks' ) } value={ value[ key ] as string } onChange={ ( color ) => change( group, { ...value, [ key ]: color } ) } /> ) }
						{ group === 'heading' && [ 'h1', 'h2', 'h3', 'h4' ].map( ( level ) => {
							const heading = value[ level ] as { size: string; weight: string };
							return <div key={ level }><TextControl label={ `${ level.toUpperCase() } ${ __( 'size', 'skvn-marine-blocks' ) }` } help={ __( 'Use px or rem, for example 2.25rem.', 'skvn-marine-blocks' ) } value={ heading.size } onChange={ ( size ) => change( group, { ...value, [ level ]: { ...heading, size } } ) } /><SelectControl label={ `${ level.toUpperCase() } ${ __( 'weight', 'skvn-marine-blocks' ) }` } value={ heading.weight } options={ [ 100, 200, 300, 400, 500, 600, 700, 800, 900 ].map( ( weight ) => ( { value: String( weight ), label: String( weight ) } ) ) } onChange={ ( weight ) => change( group, { ...value, [ level ]: { ...heading, weight } } ) } /></div>;
						} ) }
						{ group === 'fonts' && <><SelectControl label={ __( 'Font preset', 'skvn-marine-blocks' ) } options={ snapshot.presets || [] } value={ value.preset as string } onChange={ ( preset ) => change( group, { ...value, preset } ) } /><SelectControl label={ __( 'Heading font scope', 'skvn-marine-blocks' ) } options={ snapshot.scopes || [] } value={ value.scope as string } onChange={ ( scope ) => change( group, { ...value, scope } ) } /><p>{ __( 'Uses the existing theme font registry and delivery. No fonts are loaded for drafts.', 'skvn-marine-blocks' ) }</p></> }
						{ group === 'product' && <>
							<SelectControl label={ productLabels.columns } value={ value.columns as string } options={ [
								{ label: __( 'Gallery left', 'skvn-marine-blocks' ), value: 'gallery-left' },
								{ label: __( 'Gallery right', 'skvn-marine-blocks' ), value: 'gallery-right' },
								{ label: __( 'Stacked', 'skvn-marine-blocks' ), value: 'stacked' },
							] } onChange={ ( columns ) => change( group, { ...value, columns } ) } />
							<SelectControl label={ productLabels.ratio } help={ __( 'Ignored when columns are stacked.', 'skvn-marine-blocks' ) } value={ value.ratio as string } options={ [
								{ label: '1:1', value: '1-1' }, { label: '3:2', value: '3-2' }, { label: '2:3', value: '2-3' },
							] } onChange={ ( ratio ) => change( group, { ...value, ratio } ) } />
							<SelectControl label={ productLabels.width } value={ value.width as string } options={ [
								{ label: __( 'Wide', 'skvn-marine-blocks' ), value: 'wide' },
								{ label: __( 'Content', 'skvn-marine-blocks' ), value: 'content' },
							] } onChange={ ( width ) => change( group, { ...value, width } ) } />
							<ToggleControl label={ productLabels.showGallery } checked={ !! value.showGallery } onChange={ ( showGallery ) => change( group, { ...value, showGallery } ) } />
							<ToggleControl label={ productLabels.showPrice } checked={ !! value.showPrice } onChange={ ( showPrice ) => change( group, { ...value, showPrice } ) } />
							<ToggleControl label={ productLabels.showExcerpt } checked={ !! value.showExcerpt } onChange={ ( showExcerpt ) => change( group, { ...value, showExcerpt } ) } />
							<ToggleControl label={ productLabels.showMeta } checked={ !! value.showMeta } onChange={ ( showMeta ) => change( group, { ...value, showMeta } ) } />
							<ToggleControl label={ productLabels.showTabs } checked={ !! value.showTabs } onChange={ ( showTabs ) => change( group, { ...value, showTabs } ) } />
							<ToggleControl label={ productLabels.showTrust } checked={ !! value.showTrust } onChange={ ( showTrust ) => change( group, { ...value, showTrust } ) } />
							<ToggleControl label={ productLabels.showContact } checked={ !! value.showContact } onChange={ ( showContact ) => change( group, { ...value, showContact } ) } />
							<ToggleControl label={ productLabels.showQuote } checked={ !! value.showQuote } onChange={ ( showQuote ) => change( group, { ...value, showQuote } ) } />
							<SelectControl label={ productLabels.titleScale } value={ value.titleScale as string } options={ [
								{ label: __( 'Current', 'skvn-marine-blocks' ), value: 'current' },
								{ label: __( 'Heading 2', 'skvn-marine-blocks' ), value: 'h2' },
								{ label: __( 'Heading 3', 'skvn-marine-blocks' ), value: 'h3' },
								{ label: __( 'Heading 4', 'skvn-marine-blocks' ), value: 'h4' },
							] } onChange={ ( titleScale ) => change( group, { ...value, titleScale } ) } />
							<SelectControl label={ productLabels.summaryGap } value={ value.summaryGap as string } options={ [
								{ label: __( 'Current', 'skvn-marine-blocks' ), value: 'current' },
								{ label: __( 'Tight', 'skvn-marine-blocks' ), value: 'tight' },
								{ label: __( 'Loose', 'skvn-marine-blocks' ), value: 'loose' },
							] } onChange={ ( summaryGap ) => change( group, { ...value, summaryGap } ) } />
							<SelectControl label={ productLabels.specs } value={ value.specs as string } options={ [
								{ label: __( 'Default', 'skvn-marine-blocks' ), value: 'default' },
								{ label: __( 'Compact', 'skvn-marine-blocks' ), value: 'compact' },
							] } onChange={ ( specs ) => change( group, { ...value, specs } ) } />
							<SelectControl label={ productLabels.ctaStyle } value={ value.ctaStyle as string } options={ [
								{ label: __( 'Current', 'skvn-marine-blocks' ), value: 'current' },
								{ label: __( 'Primary', 'skvn-marine-blocks' ), value: 'primary' },
							] } onChange={ ( ctaStyle ) => change( group, { ...value, ctaStyle } ) } />
						</> }
						<Button variant="primary" disabled={ ! dirty( group ) } onClick={ () => save( group ) }>{ __( 'Save group', 'skvn-marine-blocks' ) }</Button>
						<Button variant="tertiary" onClick={ () => discard( group ) }>{ __( 'Discard draft and reload group', 'skvn-marine-blocks' ) }</Button>
					</fieldset>
					<p role="status" aria-live="polite">{ pending[ group ] ? __( 'Saving or reloading…', 'skvn-marine-blocks' ) : statuses[ group ] || ( dirty( group ) ? __( 'Unsaved site design draft', 'skvn-marine-blocks' ) : __( 'Saved values', 'skvn-marine-blocks' ) ) }</p>
				</PanelBody>;
			} ) }
		</> }
	</>;
}

function formatProductValue( value: string | boolean | { size: string; weight: string } ) {
	if ( typeof value === 'boolean' ) {
		return value ? __( 'On', 'skvn-marine-blocks' ) : __( 'Off', 'skvn-marine-blocks' );
	}
	return String( value );
}

function ConflictComparison( { current, draft, group }: { current: Values; draft: Values; group: Group } ) {
	const rows = Object.entries( current ).flatMap( ( [ key, value ] ) => typeof value === 'object' && value !== null && 'size' in value
		? Object.entries( value ).map( ( [ field, saved ] ) => ( { label: `${ key.toUpperCase() } ${ field === 'size' ? __( 'size', 'skvn-marine-blocks' ) : __( 'weight', 'skvn-marine-blocks' ) }`, saved, draft: typeof draft[ key ] === 'object' && draft[ key ] !== null && 'size' in ( draft[ key ] as object ) ? ( draft[ key ] as Record< string, string > )[ field ] : '' } ) )
		: [ {
			label: group === 'product' ? ( productLabels[ key ] || key ) : group === 'palette' ? paletteLabels[ key as keyof typeof paletteLabels ] : key === 'preset' ? __( 'Font preset', 'skvn-marine-blocks' ) : __( 'Heading scope', 'skvn-marine-blocks' ),
			saved: group === 'product' ? formatProductValue( value ) : value,
			draft: group === 'product' ? formatProductValue( draft[ key ] as string | boolean ) : draft[ key ] as string,
		} ] );
	return <table style={ { width: '100%', tableLayout: 'fixed', overflowWrap: 'anywhere' } }>
		<caption>{ labels[ group ] }</caption>
		<thead><tr><th scope="col">{ __( 'Setting', 'skvn-marine-blocks' ) }</th><th scope="col">{ __( 'Current saved', 'skvn-marine-blocks' ) }</th><th scope="col">{ __( 'Your draft', 'skvn-marine-blocks' ) }</th></tr></thead>
		<tbody>{ rows.map( ( row ) => <tr key={ row.label }><th scope="row">{ row.label }</th><td>{ row.saved }</td><td>{ row.draft }</td></tr> ) }</tbody>
	</table>;
}
