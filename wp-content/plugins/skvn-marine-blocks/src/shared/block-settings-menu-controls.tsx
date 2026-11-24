import type { ComponentType, ReactNode } from '@wordpress/element';

type BlockSettingsMenuControlsProps = {
	children?: ( props: Record< string, unknown > ) => ReactNode;
};

function resolveBlockSettingsMenuControls():
	| ComponentType< BlockSettingsMenuControlsProps >
	| undefined {
	const blockEditor =
		typeof window !== 'undefined' ? window.wp?.blockEditor : undefined;
	return blockEditor?.BlockSettingsMenuControls;
}

/**
 * Block ⋮ Options menu fill. Resolve at render — not webpack external init (DP-20).
 */
export function BlockSettingsMenuControls( props: BlockSettingsMenuControlsProps ) {
	const Fill = resolveBlockSettingsMenuControls();
	if ( ! Fill ) {
		return null;
	}
	return <Fill { ...props } />;
}

export function hasBlockSettingsMenuControls(): boolean {
	return resolveBlockSettingsMenuControls() !== undefined;
}