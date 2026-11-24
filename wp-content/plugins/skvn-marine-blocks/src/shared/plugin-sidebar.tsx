import type { ComponentType, ReactNode } from '@wordpress/element';

type PluginSidebarProps = {
	name: string;
	title: string;
	className?: string;
	icon?: ComponentType | string;
	children?: ReactNode;
};

function resolvePluginSidebar(): ComponentType< PluginSidebarProps > | undefined {
	const wp = typeof window !== 'undefined' ? window.wp : undefined;
	return wp?.editor?.PluginSidebar ?? wp?.editPost?.PluginSidebar;
}

/**
 * WP 6.6+: wp.editor; older: wp.editPost. Resolve at render (not webpack external init).
 */
export function PluginSidebar( props: PluginSidebarProps ) {
	const Sidebar = resolvePluginSidebar();
	if ( ! Sidebar ) {
		return null;
	}
	return <Sidebar { ...props } />;
}