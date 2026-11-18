import { Button, PluginDocumentSettingPanel, SelectControl, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';

type ProductDesignMeta = Record< string, string | boolean > & { override?: boolean };

const defaults: ProductDesignMeta = {
	columns: 'gallery-left',
	ratio: '1-1',
	width: 'wide',
	showGallery: true,
	showPrice: true,
	showExcerpt: true,
	showMeta: true,
	showTabs: true,
	showTrust: true,
	showContact: true,
	showQuote: true,
	titleScale: 'current',
	summaryGap: 'current',
	specs: 'default',
	ctaStyle: 'current',
};

function ProductDesignPanel() {
	const postType = useSelect( ( select ) => select( 'core/editor' ).getCurrentPostType(), [] );
	const [ meta, setMeta ] = useEntityProp( 'postType', 'product', 'meta' ) as [ Record< string, unknown >, ( value: Record< string, unknown > ) => void ];

	if ( postType !== 'product' ) {
		return null;
	}

	const stored = ( meta?._skvn_product_design && typeof meta._skvn_product_design === 'object'
		? meta._skvn_product_design
		: { override: false } ) as ProductDesignMeta;

	const overrideOn = stored.override === true;
	const values = overrideOn ? { ...defaults, ...stored } : defaults;

	const setDesign = ( patch: Partial< ProductDesignMeta > ) => {
		const next = overrideOn
			? { ...stored, ...patch, override: true }
			: { override: true, ...defaults, ...patch };
		setMeta( { ...meta, _skvn_product_design: next } );
	};

	const setOverride = ( enabled: boolean ) => {
		if ( enabled ) {
			setMeta( { ...meta, _skvn_product_design: { override: true, ...defaults, ...stored } } );
		} else {
			setMeta( { ...meta, _skvn_product_design: { override: false } } );
		}
	};

	const disabled = ! overrideOn;

	return (
		<PluginDocumentSettingPanel name="skvn-product-design" title={ __( 'Product page', 'skvn-marine-blocks' ) }>
			<ToggleControl
				label={ __( 'Override this product', 'skvn-marine-blocks' ) }
				checked={ overrideOn }
				onChange={ setOverride }
			/>
			{ ! overrideOn && <p>{ __( 'Using the site default.', 'skvn-marine-blocks' ) }</p> }
			<Button variant="secondary" disabled={ ! overrideOn } onClick={ () => setMeta( { ...meta, _skvn_product_design: { override: false } } ) }>
				{ __( 'Use site default', 'skvn-marine-blocks' ) }
			</Button>
			<SelectControl
				label={ __( 'Columns', 'skvn-marine-blocks' ) }
				value={ String( values.columns ) }
				disabled={ disabled }
				options={ [
					{ label: __( 'Gallery left', 'skvn-marine-blocks' ), value: 'gallery-left' },
					{ label: __( 'Gallery right', 'skvn-marine-blocks' ), value: 'gallery-right' },
					{ label: __( 'Stacked', 'skvn-marine-blocks' ), value: 'stacked' },
				] }
				onChange={ ( columns ) => setDesign( { columns } ) }
			/>
			<SelectControl
				label={ __( 'Column ratio', 'skvn-marine-blocks' ) }
				help={ __( 'Ignored when columns are stacked.', 'skvn-marine-blocks' ) }
				value={ String( values.ratio ) }
				disabled={ disabled }
				options={ [
					{ label: '1:1', value: '1-1' },
					{ label: '3:2', value: '3-2' },
					{ label: '2:3', value: '2-3' },
				] }
				onChange={ ( ratio ) => setDesign( { ratio } ) }
			/>
			<SelectControl
				label={ __( 'Width', 'skvn-marine-blocks' ) }
				value={ String( values.width ) }
				disabled={ disabled }
				options={ [
					{ label: __( 'Wide', 'skvn-marine-blocks' ), value: 'wide' },
					{ label: __( 'Content', 'skvn-marine-blocks' ), value: 'content' },
				] }
				onChange={ ( width ) => setDesign( { width } ) }
			/>
			<ToggleControl label={ __( 'Show gallery', 'skvn-marine-blocks' ) } checked={ !! values.showGallery } disabled={ disabled } onChange={ ( showGallery ) => setDesign( { showGallery } ) } />
			<ToggleControl label={ __( 'Show price', 'skvn-marine-blocks' ) } checked={ !! values.showPrice } disabled={ disabled } onChange={ ( showPrice ) => setDesign( { showPrice } ) } />
			<ToggleControl label={ __( 'Show excerpt', 'skvn-marine-blocks' ) } checked={ !! values.showExcerpt } disabled={ disabled } onChange={ ( showExcerpt ) => setDesign( { showExcerpt } ) } />
			<ToggleControl label={ __( 'Show product meta', 'skvn-marine-blocks' ) } checked={ !! values.showMeta } disabled={ disabled } onChange={ ( showMeta ) => setDesign( { showMeta } ) } />
			<ToggleControl label={ __( 'Show tabs', 'skvn-marine-blocks' ) } checked={ !! values.showTabs } disabled={ disabled } onChange={ ( showTabs ) => setDesign( { showTabs } ) } />
			<ToggleControl label={ __( 'Show trust signals', 'skvn-marine-blocks' ) } checked={ !! values.showTrust } disabled={ disabled } onChange={ ( showTrust ) => setDesign( { showTrust } ) } />
			<ToggleControl label={ __( 'Show contact link', 'skvn-marine-blocks' ) } checked={ !! values.showContact } disabled={ disabled } onChange={ ( showContact ) => setDesign( { showContact } ) } />
			<ToggleControl label={ __( 'Show quote button', 'skvn-marine-blocks' ) } checked={ !! values.showQuote } disabled={ disabled } onChange={ ( showQuote ) => setDesign( { showQuote } ) } />
			<SelectControl
				label={ __( 'Title size', 'skvn-marine-blocks' ) }
				value={ String( values.titleScale ) }
				disabled={ disabled }
				options={ [
					{ label: __( 'Current', 'skvn-marine-blocks' ), value: 'current' },
					{ label: __( 'Heading 2', 'skvn-marine-blocks' ), value: 'h2' },
					{ label: __( 'Heading 3', 'skvn-marine-blocks' ), value: 'h3' },
					{ label: __( 'Heading 4', 'skvn-marine-blocks' ), value: 'h4' },
				] }
				onChange={ ( titleScale ) => setDesign( { titleScale } ) }
			/>
			<SelectControl
				label={ __( 'Column gap', 'skvn-marine-blocks' ) }
				value={ String( values.summaryGap ) }
				disabled={ disabled }
				options={ [
					{ label: __( 'Current', 'skvn-marine-blocks' ), value: 'current' },
					{ label: __( 'Tight', 'skvn-marine-blocks' ), value: 'tight' },
					{ label: __( 'Loose', 'skvn-marine-blocks' ), value: 'loose' },
				] }
				onChange={ ( summaryGap ) => setDesign( { summaryGap } ) }
			/>
			<SelectControl
				label={ __( 'Specifications', 'skvn-marine-blocks' ) }
				value={ String( values.specs ) }
				disabled={ disabled }
				options={ [
					{ label: __( 'Default', 'skvn-marine-blocks' ), value: 'default' },
					{ label: __( 'Compact', 'skvn-marine-blocks' ), value: 'compact' },
				] }
				onChange={ ( specs ) => setDesign( { specs } ) }
			/>
			<SelectControl
				label={ __( 'Quote button style', 'skvn-marine-blocks' ) }
				value={ String( values.ctaStyle ) }
				disabled={ disabled }
				options={ [
					{ label: __( 'Current', 'skvn-marine-blocks' ), value: 'current' },
					{ label: __( 'Primary', 'skvn-marine-blocks' ), value: 'primary' },
				] }
				onChange={ ( ctaStyle ) => setDesign( { ctaStyle } ) }
			/>
		</PluginDocumentSettingPanel>
	);
}

registerPlugin( 'skvn-marine-product-design', {
	render: ProductDesignPanel,
	icon: null,
} );
