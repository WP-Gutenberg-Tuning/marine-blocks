import { create, getTextContent, RichTextData } from '@wordpress/rich-text';
import { __, sprintf } from '@wordpress/i18n';

export type NativeSlideBlock = {
	clientId: string;
	name: string;
	attributes: Record< string, unknown >;
	innerBlocks: NativeSlideBlock[];
};
export type MediaThumbnail = { media_details?: { sizes?: Record< string, { source_url?: string } > } };
export type SlideSummary = { clientId: string; label: string; thumbnail: string; position: number };

function headingText( value: unknown ): string {
	const html = typeof value === 'string' ? value :
		( typeof RichTextData === 'function' && value instanceof RichTextData ? value.toHTMLString() : '' );
	return html ? getTextContent( create( { html } ) ).replace( /\s+/g, ' ' ).trim() : '';
}
function firstDescendant( blocks: NativeSlideBlock[], name: string ): NativeSlideBlock | undefined {
	for ( const block of blocks ) {
		if ( block.name === name ) return block;
		// A nested Slider owns its own content; never label its outer Slide from it.
		if ( block.name === 'skvn-marine/slider' ) continue;
		const child = firstDescendant( block.innerBlocks || [], name );
		if ( child ) return child;
	}
}
export function safeThumbnailUrl( value: unknown ): string {
	if ( typeof value !== 'string' || ! value.trim() ) return '';
	const url = value.trim();
	try {
		const parsed = new URL( url, 'https://marine-blocks.invalid/' );
		return [ 'https:', 'http:' ].includes( parsed.protocol ) &&
			( url.startsWith( '/' ) || /^https?:\/\//i.test( url ) ) ? url : '';
	} catch { return ''; }
}

/** Read-only metadata projection from core tree + existing core-data resolver cache. */
export function summarizeSlides( blocks: NativeSlideBlock[], preset: string, media: ( id: number ) => MediaThumbnail | null | undefined ): SlideSummary[] {
	return blocks.filter( ( block ) => block.name === 'skvn-marine/slide' ).map( ( slide, position ) => {
		const heading = firstDescendant( slide.innerBlocks || [], 'core/heading' );
		const metadata = slide.attributes.metadata as { name?: unknown } | undefined;
		const customName = typeof metadata?.name === 'string' ? metadata.name.trim() : '';
		const label = customName || headingText( heading?.attributes.content ) || sprintf( __( 'Slide %d', 'skvn-marine-blocks' ), position + 1 );
		const usesContentImage = [ 'product-showcase', 'card-carousel' ].includes( preset );
		const image = usesContentImage ? firstDescendant( slide.innerBlocks || [], 'core/image' ) : undefined;
		const id = Number( usesContentImage ? image?.attributes.id : slide.attributes.backgroundImageId );
		const fallback = usesContentImage ? image?.attributes.url : slide.attributes.backgroundImageUrl;
		const sizes = Number.isInteger( id ) && id > 0 ? media( id )?.media_details?.sizes : undefined;
		// An attachment ID waits for a small rendition; never fetch its full-size
		// source merely for the rail. URL-only media reuses the existing content URL.
		const thumbnail = Number.isInteger( id ) && id > 0
			? safeThumbnailUrl( sizes?.thumbnail?.source_url || sizes?.medium?.source_url )
			: safeThumbnailUrl( fallback );
		return { clientId: slide.clientId, label, thumbnail, position };
	} );
}
