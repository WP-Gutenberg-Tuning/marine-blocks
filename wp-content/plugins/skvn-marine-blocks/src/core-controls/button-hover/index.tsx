import {
	InspectorControls,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
} from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import type { BlockConfiguration } from '@wordpress/blocks';

import { isCoreControlEnabled } from '../config';
import { BUTTON_HOVER_ATTRIBUTES } from './attributes';
import './style.css';

if ( ! isCoreControlEnabled( 'button_hover' ) ) {
	// Nothing to register — preserve attributes without rendering controls.
	// We still need to add attributes so saved values are not lost.
}

/**
 * Add namespaced hover attributes to core/button regardless of toggle state.
 * This ensures that saved attribute values survive disable/re-enable cycles.
 */
addFilter(
	'blocks.registerBlockType',
	'skvn-marine/button-hover-attributes',
	( settings: BlockConfiguration, name: string ) => {
		if ( name !== 'core/button' ) {
			return settings;
		}

		return {
			...settings,
			attributes: {
				...( settings.attributes ?? {} ),
				...BUTTON_HOVER_ATTRIBUTES,
			},
		};
	}
);

/**
 * Add hover color Inspector panel to core/button edit when feature is enabled.
 *
 * Solid color and gradient are stored in SEPARATE attributes
 * (skvnHoverBgColor / skvnHoverBgGradient). Sharing a single attribute breaks
 * with PanelColorGradientSettings because the unused handler fires with
 * undefined and clobbers the value the user just picked.
 */
addFilter(
	'editor.BlockEdit',
	'skvn-marine/button-hover-controls',
	( BlockEdit: React.ComponentType< any > ) => {
		return function ButtonHoverControls( props: any ) {
			if ( props.name !== 'core/button' ) {
				return <BlockEdit { ...props } />;
			}

			const { attributes, setAttributes } = props;
			const {
				skvnHoverTextColor,
				skvnHoverBgColor,
				skvnHoverBgGradient,
			} = attributes;

			return (
				<>
					{ isCoreControlEnabled( 'button_hover' ) && (
						<InspectorControls group="styles">
							<PanelColorGradientSettings
								title={ __(
									'Hover Colors',
									'skvn-marine-blocks'
								) }
								initialOpen={ false }
								settings={ [
									{
										colorValue:
											skvnHoverTextColor || undefined,
										onColorChange: (
											value: string | undefined
										) => {
											if ( value === undefined ) {
												return;
											}
											setAttributes( {
												skvnHoverTextColor: value,
											} );
										},
										label: __(
											'Text',
											'skvn-marine-blocks'
										),
									},
									{
										colorValue:
											skvnHoverBgColor || undefined,
										gradientValue:
											skvnHoverBgGradient || undefined,
										onColorChange: (
											value: string | undefined
										) => {
											if ( value === undefined ) {
												return;
											}
											setAttributes( {
												skvnHoverBgColor: value,
												...( value
													? { skvnHoverBgGradient: '' }
													: {} ),
											} );
										},
										onGradientChange: (
											value: string | undefined
										) => {
											if ( value === undefined ) {
												return;
											}
											setAttributes( {
												skvnHoverBgGradient: value,
												...( value
													? { skvnHoverBgColor: '' }
													: {} ),
											} );
										},
										label: __(
											'Background',
											'skvn-marine-blocks'
										),
									},
								] }
							/>
						</InspectorControls>
					) }
					<BlockEdit { ...props } />
				</>
			);
		};
	}
);

/**
 * Inject hover CSS vars + marker classes on the editor block wrapper for live
 * preview. Markers mirror the frontend render filter so a text-only button
 * never has its background overridden, and vice versa.
 */
addFilter(
	'editor.BlockListBlock',
	'skvn-marine/button-hover-wrapper-props',
	( BlockListBlock: React.ComponentType< any > ) => {
		return function ButtonHoverWrapper( props: any ) {
			if (
				props.name !== 'core/button' ||
				! isCoreControlEnabled( 'button_hover' )
			) {
				return <BlockListBlock { ...props } />;
			}

			const {
				skvnHoverTextColor,
				skvnHoverBgColor,
				skvnHoverBgGradient,
			} = props.attributes;
			const hoverBg = skvnHoverBgGradient || skvnHoverBgColor;

			if ( ! skvnHoverTextColor && ! hoverBg ) {
				return <BlockListBlock { ...props } />;
			}

			const vars: Record< string, string > = {};
			const markers: string[] = [ 'has-skvn-button-hover' ];

			if ( skvnHoverTextColor ) {
				vars[ '--skvn-btn-hover-text' ] = skvnHoverTextColor;
				markers.push( 'has-skvn-btn-hover-text' );
			}
			if ( hoverBg ) {
				vars[ '--skvn-btn-hover-bg' ] = hoverBg;
				markers.push( 'has-skvn-btn-hover-bg' );
			}

			const existingClass = props.wrapperProps?.className ?? '';
			const className = markers.reduce(
				( cls: string, marker: string ) =>
					cls.includes( marker )
						? cls
						: `${ cls } ${ marker }`.trim(),
				existingClass
			);

			const wrapperProps = {
				...( props.wrapperProps ?? {} ),
				className,
				style: {
					...( props.wrapperProps?.style ?? {} ),
					...vars,
				},
			};

			return (
				<BlockListBlock { ...props } wrapperProps={ wrapperProps } />
			);
		};
	}
);
