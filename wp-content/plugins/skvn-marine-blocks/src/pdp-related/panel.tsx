import { Button, PluginDocumentSettingPanel, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';

type RelatedMeta = Record< string, string | boolean | number > & { override?: boolean };

const defaults: RelatedMeta = {
	useCustomRelatedCard: false,
	showImage: true,
	imageRatio: '1:1',
	mediaLayout: 'flush',
	showProductTags: true,
	showProductCategories: false,
	showSpecChips: true,
	chipStyle: 'tag',
	chipColorScheme: '',
	productActionMode: 'quote',
	customActionUrl: '',
	chipAllowTags: true,
	chipAllowCategories: false,
	displayTagLimit: 3,
	relatedCount: 4,
};

// Theme palette slugs only, never raw hex. Keep in sync with the Theme Design palette group.
const chipColorSchemes: { label: string; value: string }[] = [
	{ label: __( 'Primary', 'skvn-marine-blocks' ), value: 'primary' },
	{ label: __( 'Accent', 'skvn-marine-blocks' ), value: 'accent' },
	{ label: __( 'Surface', 'skvn-marine-blocks' ), value: 'surface' },
	{ label: __( 'Text', 'skvn-marine-blocks' ), value: 'text' },
];

function PdpRelatedPanel() {
	const postType = useSelect( ( select ) => select( 'core/editor' ).getCurrentPostType(), [] );
	const [ meta, setMeta ] = useEntityProp( 'postType', 'product', 'meta' ) as [ Record< string, unknown >, ( value: Record< string, unknown > ) => void ];

	if ( postType !== 'product' ) {
		return null;
	}

	const stored = ( meta?._skvn_pdp_related && typeof meta._skvn_pdp_related === 'object'
		? meta._skvn_pdp_related
		: { override: false } ) as RelatedMeta;

	const overrideOn = stored.override === true;
	const values = overrideOn ? { ...defaults, ...stored } : defaults;
	const disabled = ! overrideOn;

	const setRelated = ( patch: Partial< RelatedMeta > ) => {
		const next = overrideOn
			? { ...stored, ...patch, override: true }
			: { override: true, ...defaults, ...patch };
		setMeta( { ...meta, _skvn_pdp_related: next } );
	};

	const setOverride = ( enabled: boolean ) => {
		if ( enabled ) {
			setMeta( { ...meta, _skvn_pdp_related: { override: true, ...defaults, ...stored } } );
		} else {
			setMeta( { ...meta, _skvn_pdp_related: { override: false } } );
		}
	};

	return (
		<PluginDocumentSettingPanel name="skvn-pdp-related" title={ __( 'Related products', 'skvn-marine-blocks' ) }>
			<ToggleControl
				label={ __( 'Override related products', 'skvn-marine-blocks' ) }
				checked={ overrideOn }
				onChange={ setOverride }
			/>
			{ ! overrideOn && <p>{ __( 'Using the site default.', 'skvn-marine-blocks' ) }</p> }
			<Button variant="secondary" disabled={ ! overrideOn } onClick={ () => setMeta( { ...meta, _skvn_pdp_related: { override: false } } ) }>
				{ __( 'Use site default', 'skvn-marine-blocks' ) }
			</Button>
			<ToggleControl label={ __( 'Use SKVN related cards', 'skvn-marine-blocks' ) } checked={ !! values.useCustomRelatedCard } disabled={ disabled } onChange={ ( useCustomRelatedCard ) => setRelated( { useCustomRelatedCard } ) } />
			<SelectControl
				label={ __( 'Image ratio', 'skvn-marine-blocks' ) }
				value={ String( values.imageRatio ?? '' ) }
				disabled={ disabled }
				options={ [
					{ label: '1:1', value: '1:1' },
					{ label: '4:3', value: '4:3' },
					{ label: '3:2', value: '3:2' },
					{ label: '16:9', value: '16:9' },
					{ label: __( 'Auto', 'skvn-marine-blocks' ), value: 'auto' },
				] }
				onChange={ ( imageRatio ) => setRelated( { imageRatio } ) }
			/>
			<SelectControl
				label={ __( 'Media layout', 'skvn-marine-blocks' ) }
				value={ String( values.mediaLayout ?? '' ) }
				disabled={ disabled }
				options={ [
					{ label: __( 'Flush', 'skvn-marine-blocks' ), value: 'flush' },
					{ label: __( 'Padded', 'skvn-marine-blocks' ), value: 'padded' },
					{ label: __( 'Floating', 'skvn-marine-blocks' ), value: 'floating' },
				] }
				onChange={ ( mediaLayout ) => setRelated( { mediaLayout } ) }
			/>
			<ToggleControl label={ __( 'Show image', 'skvn-marine-blocks' ) } checked={ !! values.showImage } disabled={ disabled } onChange={ ( showImage ) => setRelated( { showImage } ) } />
			<ToggleControl label={ __( 'Show product tags', 'skvn-marine-blocks' ) } checked={ !! values.showProductTags } disabled={ disabled } onChange={ ( showProductTags ) => setRelated( { showProductTags } ) } />
			<ToggleControl label={ __( 'Show product categories', 'skvn-marine-blocks' ) } checked={ !! values.showProductCategories } disabled={ disabled } onChange={ ( showProductCategories ) => setRelated( { showProductCategories } ) } />
			<ToggleControl label={ __( 'Show specification chips', 'skvn-marine-blocks' ) } checked={ !! values.showSpecChips } disabled={ disabled } onChange={ ( showSpecChips ) => setRelated( { showSpecChips } ) } />
			<SelectControl
				label={ __( 'Chip style', 'skvn-marine-blocks' ) }
				value={ String( values.chipStyle ?? '' ) }
				disabled={ disabled }
				options={ [
					{ label: __( 'Tag', 'skvn-marine-blocks' ), value: 'tag' },
					{ label: __( 'Hashtag', 'skvn-marine-blocks' ), value: 'hashtag' },
					{ label: __( 'Dot', 'skvn-marine-blocks' ), value: 'dot' },
					{ label: __( 'Plain', 'skvn-marine-blocks' ), value: 'plain' },
				] }
				onChange={ ( chipStyle ) => setRelated( { chipStyle } ) }
			/>
			<SelectControl
				label={ __( 'Chip color', 'skvn-marine-blocks' ) }
				value={ String( values.chipColorScheme ?? '' ) }
				disabled={ disabled }
				options={ [
					{ label: __( 'None', 'skvn-marine-blocks' ), value: '' },
					...chipColorSchemes,
				] }
				onChange={ ( chipColorScheme ) => setRelated( { chipColorScheme } ) }
			/>
			<SelectControl
				label={ __( 'Card action', 'skvn-marine-blocks' ) }
				value={ String( values.productActionMode ?? '' ) }
				disabled={ disabled }
				options={ [
					{ label: __( 'View product', 'skvn-marine-blocks' ), value: 'view' },
					{ label: __( 'Request quote', 'skvn-marine-blocks' ), value: 'quote' },
					{ label: __( 'Both', 'skvn-marine-blocks' ), value: 'both' },
					{ label: __( 'Custom URL', 'skvn-marine-blocks' ), value: 'custom' },
				] }
				onChange={ ( productActionMode ) => setRelated( { productActionMode } ) }
			/>
			{ 'custom' === values.productActionMode && (
				<TextControl
					label={ __( 'Custom action URL', 'skvn-marine-blocks' ) }
					value={ String( values.customActionUrl ?? '' ) }
					disabled={ disabled }
					onChange={ ( customActionUrl ) => setRelated( { customActionUrl } ) }
				/>
			) }
			<TextControl
				label={ __( 'Chip limit per product', 'skvn-marine-blocks' ) }
				help={ __( '0 shows all terms.', 'skvn-marine-blocks' ) }
				type="number"
				min={ 0 }
				max={ 10 }
				value={ String( values.displayTagLimit ?? '' ) }
				disabled={ disabled }
				onChange={ ( next ) => {
					const limit = parseInt( next, 10 );
					if ( Number.isNaN( limit ) ) return;
					setRelated( { displayTagLimit: Math.min( 10, Math.max( 0, limit ) ) } );
				} }
			/>
			<TextControl
				label={ __( 'Related products count', 'skvn-marine-blocks' ) }
				type="number"
				min={ 1 }
				max={ 10 }
				value={ String( values.relatedCount ?? '' ) }
				disabled={ disabled }
				onChange={ ( next ) => {
					const count = parseInt( next, 10 );
					if ( Number.isNaN( count ) ) return;
					setRelated( { relatedCount: Math.min( 10, Math.max( 1, count ) ) } );
				} }
			/>
			<h3 style={ { margin: '1em 0 0.25em' } }>{ __( 'Chip sources (allowlist)', 'skvn-marine-blocks' ) }</h3>
			<p>{ __( 'Terms come from each related product. No fixed term picklist.', 'skvn-marine-blocks' ) }</p>
			<ToggleControl label={ __( 'Allow product tags', 'skvn-marine-blocks' ) } checked={ !! values.chipAllowTags } disabled={ disabled || ! values.showProductTags } onChange={ ( chipAllowTags ) => setRelated( { chipAllowTags } ) } />
			<ToggleControl label={ __( 'Allow product categories', 'skvn-marine-blocks' ) } checked={ !! values.chipAllowCategories } disabled={ disabled || ! values.showProductCategories } onChange={ ( chipAllowCategories ) => setRelated( { chipAllowCategories } ) } />
		</PluginDocumentSettingPanel>
	);
}

registerPlugin( 'skvn-marine-pdp-related', {
	render: PdpRelatedPanel,
	icon: null,
} );
