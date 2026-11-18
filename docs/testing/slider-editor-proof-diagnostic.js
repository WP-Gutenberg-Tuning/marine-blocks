// Paste in the WordPress editor Console. Read-only: no dispatch, Save or content writes.
( async () => {
	const w = window.top;
	const script = w.document.getElementById( 'skvn-marine-blocks-editor-js' );
	let assetStatus = null;
	let assetError = null;
	let source = '';
	try {
		if ( script ) {
			const response = await w.fetch( script.src );
			assetStatus = response.status;
			source = await response.text();
		}
	} catch ( error ) {
		assetError = String( error );
	}
	const editor = w.wp?.data?.select( 'core/block-editor' );
	const names = ( blocks ) => blocks.flatMap( ( block ) => [ block.name, ...names( block.innerBlocks || [] ) ] );
	console.log( JSON.stringify( {
		url: w.location.href,
		editorScript: script?.src || null,
		assetStatus,
		assetError,
		// Fetched response markers, not proof of already-executed script bytes.
		jsHasConcept01: source.includes( 'skvn-slider--editor-focus' ) && source.includes( 'Pagination Indicator:' ),
		blockTypes: [ ...new Set( names( editor?.getBlocks() || [] ) ) ],
		selectedType: editor?.getSelectedBlock()?.name || null,
	}, null, 2 ) );
} )();
