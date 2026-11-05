import { Button, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { DEFAULT_HEIGHT, isValidHeight, resolveHeights, type SpacerAttributes, type SpacerDevice } from './model';

export type SpacerControlsProps = {
	attributes: SpacerAttributes;
	setAttributes: ( attributes: Partial< SpacerAttributes > ) => void;
};

export const deviceLabels = () => ( {
	desktop: __( 'Desktop', 'skvn-marine-blocks' ),
	tablet: __( 'Tablet', 'skvn-marine-blocks' ),
	mobile: __( 'Mobile', 'skvn-marine-blocks' ),
} );

function HeightControl( { device, attributes, setAttributes }: SpacerControlsProps & { device: SpacerDevice } ) {
	const key = `${ device }Height` as keyof SpacerAttributes;
	const value = resolveHeights( attributes )[ device ];
	const explicit = isValidHeight( attributes[ key ] );
	const [ draft, setDraft ] = useState( String( value ) );
	const [ invalid, setInvalid ] = useState( false );
	useEffect( () => { setDraft( String( value ) ); setInvalid( false ); }, [ value, explicit ] );
	const inheritedHelp = device === 'mobile' && isValidHeight( attributes.tabletHeight )
		? __( 'Inherited from Tablet.', 'skvn-marine-blocks' )
		: __( 'Inherited from Desktop.', 'skvn-marine-blocks' );
	return <div>
		<TextControl
			label={ `${ deviceLabels()[ device ] } (px)` }
			type="number" min={ 0 } step={ 1 } value={ draft }
			aria-invalid={ invalid }
			help={ invalid ? __( 'Enter a non-negative whole number in pixels.', 'skvn-marine-blocks' ) : device !== 'desktop' && ! explicit ? inheritedHelp : __( 'Spacing height in pixels.', 'skvn-marine-blocks' ) }
			onChange={ ( next ) => {
				setDraft( next );
				const valid = /^\d+$/.test( next ) && isValidHeight( Number( next ) );
				setInvalid( next !== '' && ! valid );
				if ( valid ) setAttributes( { [ key ]: Number( next ) } );
			} }
			onBlur={ () => { setDraft( String( value ) ); setInvalid( false ); } }
		/>
		<Button variant="tertiary"
			disabled={ device === 'desktop' ? value === DEFAULT_HEIGHT : ! explicit }
			onClick={ () => {
				setAttributes( { [ key ]: device === 'desktop' ? DEFAULT_HEIGHT : undefined } );
				setInvalid( false );
			} }
		>{ device === 'desktop' ? __( 'Reset to default', 'skvn-marine-blocks' ) : __( 'Reset to inherited', 'skvn-marine-blocks' ) }</Button>
	</div>;
}

export function SpacerControls( props: SpacerControlsProps ) {
	return <>
		{ ( [ 'desktop', 'tablet', 'mobile' ] as SpacerDevice[] ).map( ( device ) => <HeightControl key={ device } device={ device } { ...props } /> ) }
		<p>{ __( 'Adds this height. Parent block spacing and section margins may add extra space.', 'skvn-marine-blocks' ) }</p>
		<p>{ __( 'The editor frame includes labels and an indicator. Its total height differs from the frontend spacing.', 'skvn-marine-blocks' ) }</p>
	</>;
}
