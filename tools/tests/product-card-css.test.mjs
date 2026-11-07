import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire( new URL( '../../wp-content/plugins/skvn-marine-blocks/package.json', import.meta.url ) );
const postcss = require( 'postcss' );
const selectorParser = require( 'postcss-selector-parser' );
const { JSDOM } = require( 'jsdom' );
const asset = readFileSync( new URL( '../../wp-content/plugins/skvn-marine-blocks/assets/css/product-card.css', import.meta.url ), 'utf8' );
const collection = readFileSync( new URL( '../../wp-content/plugins/skvn-marine-blocks/src/collection/style.css', import.meta.url ), 'utf8' );
const css = postcss.parse( asset + '\n' + collection );
const compare = ( a, b ) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
function specificity( selector ) {
	const result = [ 0, 0, 0 ];
	for ( const node of selector.nodes ?? [] ) {
		if ( node.type === 'id' ) result[0]++;
		else if ( [ 'class', 'attribute' ].includes( node.type ) ) result[1]++;
		else if ( node.type === 'tag' ) result[2]++;
		else if ( node.type === 'pseudo' ) {
			if ( node.value === ':where' ) continue;
			if ( [ ':is', ':not', ':has' ].includes( node.value ) ) {
				const max = node.nodes.map( specificity ).sort( compare ).at( -1 ) ?? [ 0, 0, 0 ];
				max.forEach( ( value, index ) => result[index] += value );
			} else result[ node.value.startsWith( '::' ) ? 2 : 1 ]++;
		}
	}
	return result;
}
// Static cascade model only: no browser layout, hover, media/container evaluation.
function styles( wrapper, card, target = 'skvn-collection-card__image' ) {
	const doc = new JSDOM( `<section class="${wrapper}"><article class="skvn-collection-card ${card}"><div class="skvn-collection-card__media"><img class="skvn-collection-card__image"></div><div class="skvn-collection-card__spec-values"><span class="skvn-collection-card__spec-tag">Value</span></div></article></section>` ).window.document;
	const element = doc.querySelector( `.${target}` );
	const winners = {};
	css.walkRules( rule => {
		if ( rule.parent.type !== 'root' ) return;
		for ( const selector of rule.selectors ) {
			if ( /::|:(hover|active|focus)/.test( selector ) || ! element.matches( selector ) ) continue;
			const weight = specificity( selectorParser().astSync( selector ).first );
			rule.walkDecls( declaration => {
				const previous = winners[declaration.prop];
				if ( ! previous || compare( weight, previous.weight ) >= 0 ) winners[declaration.prop] = { weight, value: declaration.value };
			} );
		}
	} );
	return Object.fromEntries( Object.entries( winners ).map( ( [ key, value ] ) => [ key, value.value ] ) );
}
test( 'legacy saved ratio and cover behavior survives extraction', () => {
	const style = styles( 'skvn-collection skvn-collection--ratio-4-3', '' );
	assert.equal( style['aspect-ratio'], '4 / 3' ); assert.equal( style['object-fit'], 'cover' );
} );
test( 'explicit flush still wins over the legacy ratio class', () => {
	const style = styles( 'skvn-collection skvn-collection--ratio-16-9', 'skvn-collection-card--media-flush' );
	assert.equal( style['aspect-ratio'], '1 / 1' ); assert.equal( style['object-fit'], 'contain' );
} );
test( 'padded preset retains saved ratio and contain', () => {
	const style = styles( 'skvn-collection skvn-collection--ratio-16-9', 'skvn-collection-card--media-padded' );
	assert.equal( style['aspect-ratio'], '16 / 9' ); assert.equal( style['object-fit'], 'contain' );
} );
test( 'floating media preserves offset and relative width', () => {
	const style = styles( 'skvn-collection skvn-collection--ratio-3-2', 'skvn-collection-card--media-floating' );
	assert.equal( style['aspect-ratio'], '3 / 2' ); assert.equal( style.width, 'var(--skvn-media-float-width, 100%)' );
	assert.equal( style.transform, 'translateY(var(--skvn-media-float-offset, -12px))' );
} );
test( 'explicit chip palette still overrides hashtag defaults', () => {
	const style = styles( 'skvn-collection', 'skvn-collection-card--chip-hashtag skvn-chips--skvn-blue-950', 'skvn-collection-card__spec-tag' );
	assert.equal( style.color, 'var(--wp--preset--color--skvn-blue-950, #082f49)' );
	assert.equal( style.background, 'none' );
} );
test( 'archive media is square and static without a Collection wrapper', () => {
	const style = styles( '', 'skvn-collection-card--archive skvn-collection-card--media-flush' );
	assert.equal( style['aspect-ratio'], '1 / 1' ); assert.equal( style.transform, 'none' );
	assert.equal( style.transition, 'none' ); assert.equal( style['object-fit'], 'contain' );
} );
test( 'standalone card asset excludes carousel and editor layout', () => {
	assert.doesNotMatch( collection, /@import.*product-card|^\.skvn-collection-card\s*\{/m );
	const bootstrap = readFileSync( new URL( '../../wp-content/plugins/skvn-marine-blocks/skvn-marine-blocks.php', import.meta.url ), 'utf8' );
	assert.match( bootstrap, /plugins_url\( 'build\/style-index\.ts\.css', __FILE__ \),\s*\$card_style_deps/ );
	assert.match( bootstrap, /plugins_url\( 'build\/collection-view\.ts\.css', __FILE__ \),\s*\$card_style_deps/ );
	assert.doesNotMatch( asset, /swiper|skvn-collection__carousel|skvn-collection__editor/ );
	assert.doesNotMatch( asset, /100vw|50vw|overflow-x:\s*(hidden|clip)/ );
} );
