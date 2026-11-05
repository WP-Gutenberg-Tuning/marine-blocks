import { useBlockProps } from '@wordpress/block-editor';
import { heightVariables, type SpacerAttributes } from './model';

export function save( { attributes }: { attributes: SpacerAttributes } ) {
	return <div { ...useBlockProps.save( {
		className: 'skvn-responsive-spacer',
		style: heightVariables( attributes ),
		'aria-hidden': 'true',
	} ) } />;
}
