import { createContext } from '@wordpress/element';

/**
 * Editor-only focus for Step Slider. React state, never a block attribute.
 *
 * Null means the native stacked editing view: the parent guard failed, so the
 * step-slide children keep their normal editor markup instead of being hidden.
 */
export type StepSliderEditorFocus = {
	rootClientId: string;
	activeClientId: string | null;
};

export const StepSliderEditorFocusContext =
	createContext< StepSliderEditorFocus | null >( null );
