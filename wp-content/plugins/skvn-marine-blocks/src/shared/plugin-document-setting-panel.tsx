import type { ComponentType, ReactNode } from '@wordpress/element';

type PluginDocumentSettingPanelProps = {
	name: string;
	title: string;
	className?: string;
	children?: ReactNode;
};

declare global {
	interface Window {
		wp?: {
			editor?: {
				PluginDocumentSettingPanel?: ComponentType< PluginDocumentSettingPanelProps >;
			};
			editPost?: {
				PluginDocumentSettingPanel?: ComponentType< PluginDocumentSettingPanelProps >;
			};
			components?: {
				PluginDocumentSettingPanel?: ComponentType< PluginDocumentSettingPanelProps >;
			};
		};
	}
}

function resolvePluginDocumentSettingPanel():
	| ComponentType< PluginDocumentSettingPanelProps >
	| undefined {
	const wp = typeof window !== 'undefined' ? window.wp : undefined;
	return (
		wp?.editor?.PluginDocumentSettingPanel ??
		wp?.editPost?.PluginDocumentSettingPanel ??
		wp?.components?.PluginDocumentSettingPanel
	);
}

/**
 * WP 6.6+: panel lives on wp.editor; 6.4–6.5: wp.editPost. Not on wp.components.
 */
export function PluginDocumentSettingPanel(
	props: PluginDocumentSettingPanelProps
) {
	const Panel = resolvePluginDocumentSettingPanel();
	if ( ! Panel ) {
		return null;
	}
	return <Panel { ...props } />;
}