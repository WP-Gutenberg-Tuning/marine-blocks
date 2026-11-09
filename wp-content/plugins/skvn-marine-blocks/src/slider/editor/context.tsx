import { createContext } from '@wordpress/element';

export type SliderEditorFocus = {
	rootClientId: string;
	activeSlideClientId: string | null;
};

// UI-only React context. This never becomes Gutenberg block context/attributes.
export const SliderEditorFocusContext = createContext< SliderEditorFocus | null >( null );
