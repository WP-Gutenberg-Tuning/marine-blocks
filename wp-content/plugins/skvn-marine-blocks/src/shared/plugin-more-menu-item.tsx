import type { ComponentType, ReactNode } from '@wordpress/element';

type PluginMoreMenuItemProps = {
	children?: ReactNode;
	icon?: string;
	onClick?: () => void;
	disabled?: boolean;
};

function resolvePluginMoreMenuItem():
	| ComponentType< PluginMoreMenuItemProps >
	| undefined {
	const wp = typeof window !== 'undefined' ? window.wp : undefined;
	return wp?.editor?.PluginMoreMenuItem;
}

export function PluginMoreMenuItem( props: PluginMoreMenuItemProps ) {
	const Item = resolvePluginMoreMenuItem();
	if ( ! Item ) {
		return null;
	}
	return <Item { ...props } />;
}