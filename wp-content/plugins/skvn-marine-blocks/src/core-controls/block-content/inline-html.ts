import type { ContentResult } from './types';

const SEMANTIC_TAGS = new Set( [ 'strong', 'b', 'em', 'i', 'sup', 'sub', 'code', 'mark', 'br', 'a' ] );
const SAFE_REL = new Set( [ 'noopener', 'noreferrer', 'nofollow', 'sponsored', 'ugc', 'external' ] );

/**
 * Public browser HTML parser + DOM serialization, independent of global WP
 * format registrations. Parse into an inert document, then construct a NEW
 * allowlisted tree. Never inject source HTML into the live editor document.
 * DOM attributes expose decoded entities before link validation.
 */
export function cleanInlineHtml(
	value: string,
	keepTags: boolean,
	safeUrl: ( value: string ) => boolean
): ContentResult< string > {
	if ( value.length > 8000 ) return { ok: false, code: 'limit' };
	if ( typeof DOMParser === 'undefined' ) return { ok: false, code: 'rich-text', detail: 'parser-unavailable' };
	let parsed: Document;
	try {
		parsed = new DOMParser().parseFromString( value, 'text/html' );
	} catch {
		// For example, a strict Trusted Types policy can forbid string parsing.
		return { ok: false, code: 'rich-text', detail: 'parser-unavailable' };
	}
	if ( parsed.createTreeWalker( parsed, 128 ).nextNode() ) return { ok: false, code: 'rich-text', detail: 'comment' };
	const clean = parsed.createElement( 'div' );
	let failure: 'rich-text' | 'url' | undefined;
	let count = 0;
	const walk = ( source: Node, target: Node, depth: number ): void => {
		if ( failure ) return;
		if ( ++count > 8000 || depth > 40 ) { failure = 'rich-text'; return; }
		if ( source.nodeType === 3 ) {
			target.appendChild( parsed.createTextNode( source.nodeValue || '' ) );
			return;
		}
		if ( source.nodeType !== 1 ) { failure = 'rich-text'; return; }
		const element = source as Element;
		const tag = element.localName;
		if ( ! SEMANTIC_TAGS.has( tag ) && tag !== 'span' ) { failure = 'rich-text'; return; }
		// Do not silently flatten embedded/bound or directional semantics.
		for ( const attribute of Array.from( element.attributes ) ) {
			if ( [ 'id', 'lang', 'dir', 'role', 'contenteditable' ].includes( attribute.name ) ||
				attribute.name.startsWith( 'data-rich-text-' ) || attribute.name.startsWith( 'data-wp-' ) ) {
				failure = 'rich-text'; return;
			}
		}
		const output = tag === 'span' || ! keepTags ? target : parsed.createElement( tag );
		if ( tag === 'a' ) {
			const href = element.getAttribute( 'href' ) || '';
			const linkTarget = element.getAttribute( 'target' ) || '';
			if ( ! safeUrl( href ) || ! [ '', '_self', '_blank' ].includes( linkTarget ) ) {
				failure = 'url'; return;
			}
			if ( keepTags ) {
				const link = output as Element;
				if ( href ) link.setAttribute( 'href', href );
				const rel = new Set( ( element.getAttribute( 'rel' ) || '' ).toLowerCase().split( /\s+/ ).filter( ( token ) => SAFE_REL.has( token ) ) );
				if ( linkTarget === '_blank' ) {
					link.setAttribute( 'target', '_blank' );
					rel.add( 'noopener' ); rel.add( 'noreferrer' );
				}
				if ( rel.size ) link.setAttribute( 'rel', Array.from( rel ).join( ' ' ) );
			}
		}
		if ( tag === 'br' && ! keepTags ) target.appendChild( parsed.createTextNode( '\n' ) );
		for ( const child of Array.from( source.childNodes ) ) walk( child, output, depth + 1 );
		if ( output !== target ) target.appendChild( output );
	};
	// Head-only nodes (script/style/title/etc.) must not disappear during HTML parsing.
	if ( parsed.head.childNodes.length ) return { ok: false, code: 'rich-text', detail: 'head-content' };
	for ( const node of Array.from( parsed.body.childNodes ) ) walk( node, clean, 1 );
	if ( failure ) return { ok: false, code: failure };
	// Getter serializes only newly constructed safe nodes; no innerHTML assignment.
	return { ok: true, value: keepTags ? clean.innerHTML : clean.textContent || '' };
}
