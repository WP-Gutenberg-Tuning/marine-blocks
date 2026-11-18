/**
 * Marine Blocks brand mark for the editor sidebar indicator.
 *
 * The Icon component treats a plain string as a Dashicon name, so the branded
 * SVG must be passed as a component instead of a URL string. The URLs ride the
 * window.skvnMarineDesign bootstrap payload, keeping the ~33KB path data out
 * of the editor bundle.
 *
 * Three states, split by mechanism (plan 080):
 * - base: always rendered.
 * - hover: CSS-driven (.components-button:hover / :focus-visible) — display toggle.
 * - selected: React-driven (core/edit-post active sidebar === this panel) — class .is-open.
 * When both apply, selected wins (.is-open scopes hover out in CSS).
 * Variants overlay the base img absolutely, so a missing hover/selected file
 * degrades to base without leaving gaps.
 */
import { useSelect } from '@wordpress/data';

export function MarineBlocksSidebarIcon() {
	const iconUrl = window.skvnMarineDesign?.iconUrl;
	const hoverUrl = window.skvnMarineDesign?.iconHoverUrl;
	const selectedUrl = window.skvnMarineDesign?.iconSelectedUrl;
	const isOpen = useSelect(
		( read ) => {
			try {
				return read( 'core/edit-post' )?.getActiveGeneralSidebarName?.() === 'skvn-marine-design/design';
			} catch ( error ) {
				// Store unavailable (e.g. site editor) — base icon still renders.
				return false;
			}
		},
		[]
	);
	if ( typeof iconUrl !== 'string' || ! iconUrl ) return null;
	return (
		<span className={ 'skvn-marine-sidebar-icon' + ( isOpen && selectedUrl ? ' is-open' : '' ) }>
			<img className="skvn-marine-sidebar-icon__img skvn-marine-sidebar-icon__img--base" src={ iconUrl } alt="" width={ 24 } height={ 24 } />
			{ hoverUrl ? <img className="skvn-marine-sidebar-icon__img skvn-marine-sidebar-icon__img--hover" src={ hoverUrl } alt="" width={ 24 } height={ 24 } /> : null }
			{ selectedUrl ? <img className="skvn-marine-sidebar-icon__img skvn-marine-sidebar-icon__img--selected" src={ selectedUrl } alt="" width={ 24 } height={ 24 } /> : null }
		</span>
	);
}
