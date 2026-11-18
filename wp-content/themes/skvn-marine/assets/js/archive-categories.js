/** Archive-only progressive disclosure. CSS owns the actual container mode. */
(() => {
	if (!window.ResizeObserver) return; // Keep the complete navigation without enhancement.
	const canvas = document.querySelector('body.skvn-woo-archive .site-main');
	if (!canvas) return;
	const nav = canvas.querySelector('.skvn-archive-categories');
	const button = nav?.querySelector('.skvn-archive-categories__toggle');
	const list = button && document.getElementById(button.getAttribute('aria-controls'));
	if (!button || !list) return;
	let sidebar = null;
	const setExpanded = (expanded) => {
		button.setAttribute('aria-expanded', String(expanded));
		list.hidden = !expanded;
	};
	const sync = () => {
		const next = getComputedStyle(nav).getPropertyValue('--skvn-archive-sidebar-mode').trim() === '1';
		if (next === sidebar) return;
		const active = document.activeElement;
		if (next) {
			setExpanded(true);
			// Move focus before hiding the mobile trigger on entry to desktop mode.
			if (active === button) list.querySelector('a')?.focus();
			button.hidden = true;
		} else {
			button.hidden = false;
			// A resize must never hide a link that currently has focus.
			setExpanded(list.contains(active));
		}
		nav.classList.toggle('is-sidebar', next);
		nav.classList.add('is-enhanced');
		sidebar = next;
	};
	button.addEventListener('click', () => {
		if (!sidebar) setExpanded(button.getAttribute('aria-expanded') !== 'true');
	});
	list.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && !sidebar) {
			event.preventDefault();
			button.focus();
			setExpanded(false);
		}
	});
	sync();
	new ResizeObserver(sync).observe(canvas);
})();
