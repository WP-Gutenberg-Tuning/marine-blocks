/** Reveal a rail row without scrolling the editor document or animating. */
export function revealRailRow( list: HTMLElement | null, row: HTMLElement | null ): void {
	if ( ! list || ! row || ! list.getClientRects().length ) return;
	const viewport = list.getBoundingClientRect();
	const selected = row.getBoundingClientRect();
	const delta = selected.top < viewport.top + 4 ? selected.top - viewport.top - 4 :
		selected.bottom > viewport.bottom - 4 ? selected.bottom - viewport.bottom + 4 : 0;
	if ( delta ) list.scrollTop = Math.max( 0, Math.min( list.scrollHeight - list.clientHeight, list.scrollTop + delta ) );
}
