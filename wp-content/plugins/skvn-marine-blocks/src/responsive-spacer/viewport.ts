import { useEffect, useState } from '@wordpress/element';
import type { SpacerDevice } from './model';

export function useCanvasDevice( ref: { current: HTMLElement | null } ) {
	const [ device, setDevice ] = useState< SpacerDevice >( 'desktop' );
	useEffect( () => {
		// ownerDocument follows the native iframe preview, not a Columns width.
		const view = ref.current?.ownerDocument.defaultView;
		if ( ! view ) return;
		const tablet = view.matchMedia( '(min-width: 768px)' );
		const desktop = view.matchMedia( '(min-width: 1024px)' );
		const update = () => setDevice( desktop.matches ? 'desktop' : tablet.matches ? 'tablet' : 'mobile' );
		update();
		tablet.addEventListener( 'change', update );
		desktop.addEventListener( 'change', update );
		return () => {
			tablet.removeEventListener( 'change', update );
			desktop.removeEventListener( 'change', update );
		};
	}, [ ref ] );
	return device;
}
