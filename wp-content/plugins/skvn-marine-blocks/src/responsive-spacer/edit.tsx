import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEditorPreviewFrame } from '../shared/editor-preview-frame';
import { deviceLabels, SpacerControls, type SpacerControlsProps } from './controls';
import { isValidHeight, previewPadding, resolveHeights, type SpacerDevice } from './model';
import { useCanvasDevice } from './viewport';
import './editor/style.css';

export function Edit( props: SpacerControlsProps ) {
	const ref = useEditorPreviewFrame();
	const device = useCanvasDevice( ref );
	const heights = resolveHeights( props.attributes );
	const height = heights[ device ];
	const labels = deviceLabels();
	const blockProps = useBlockProps( {
		ref,
		className: 'skvn-editor-preview-frame skvn-editor-preview-frame--spacer',
	} );
	return <>
		<InspectorControls>
			<PanelBody title={ __( 'Spacing height', 'skvn-marine-blocks' ) }>
				<SpacerControls { ...props } />
			</PanelBody>
		</InspectorControls>
		<div { ...blockProps }>
			<div className="skvn-editor-preview-frame__label">{ __( 'Responsive Spacer', 'skvn-marine-blocks' ) }</div>
			<div className="skvn-spacer-preview__summary">
				{ ( [ 'desktop', 'tablet', 'mobile' ] as SpacerDevice[] ).map( ( tier ) => {
					const inherited = tier !== 'desktop' && ! isValidHeight( props.attributes[ `${ tier }Height` ] );
					return <span key={ tier } className={ tier === device ? 'skvn-spacer-preview__current' : undefined } aria-current={ tier === device ? 'true' : undefined }>
						{ labels[ tier ] }: { heights[ tier ] }px{ inherited ? ` (${ __( 'inherited', 'skvn-marine-blocks' ) })` : '' }
					</span>;
				} ) }
			</div>
			<div className="skvn-spacer-preview__indicator" style={ { paddingTop: previewPadding( height ), paddingBottom: previewPadding( height ) } }>
				<span aria-hidden="true">↕ </span>{ height }px
			</div>
			{ height > 200 && <div className="skvn-spacer-preview__note">{ __( 'Preview capped at 200px', 'skvn-marine-blocks' ) }</div> }
		</div>
	</>;
}
