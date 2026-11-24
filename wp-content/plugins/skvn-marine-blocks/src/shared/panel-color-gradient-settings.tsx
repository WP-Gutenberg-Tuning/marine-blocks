import type { ComponentType } from '@wordpress/element';

// Props vary by WP version; keep loose to match @wordpress/block-editor export.
type PanelColorGradientSettingsProps = Record< string, unknown >;

function resolvePanelColorGradientSettings():
	| ComponentType< PanelColorGradientSettingsProps >
	| undefined {
	const blockEditor =
		typeof window !== 'undefined' ? window.wp?.blockEditor : undefined;
	return (
		blockEditor?.__experimentalPanelColorGradientSettings ??
		blockEditor?.PanelColorGradientSettings
	);
}

export function PanelColorGradientSettings(
	props: PanelColorGradientSettingsProps
) {
	const Panel = resolvePanelColorGradientSettings();
	if ( ! Panel ) {
		return null;
	}
	return <Panel { ...props } />;
}