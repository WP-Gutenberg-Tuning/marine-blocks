// Pure projection / patch / allowlist tests for plan057 content actions.
// Simulated clipboard trees and schema defaults only: this is logic coverage,
// not browser clipboard, menu, Undo or Save evidence.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';

const root = new URL( '../../wp-content/plugins/skvn-marine-blocks/', import.meta.url );

function executable( path ) {
	const source = readFileSync( new URL( path, root ), 'utf8' )
		// Drop top-level `import ... from '...';` (single or multi-line).
		.replace( /^import[\s\S]*?;\r?\n/gm, '' )
		.replace( /^export\s/gm, '' );
	return stripTypeScriptTypes( source );
}

const bundle = [
	'src/core-controls/block-content/types.ts',
	'src/core-controls/block-content/fields.ts',
	'src/core-controls/block-content/plan.ts',
]
	.map( executable )
	.join( '\n' );

const api = vm.runInNewContext(
	bundle +
		'\n({ buildProjection, buildPatches, contentSignature, countNodes, treeDepth, itemLimit, sanitizeInlineHtml, toPlainText, isSafeUrl, contentFieldSpecs, isSupportedRoot, isAllowedChild, MAX_NODES, MAX_DEPTH })'
);

const plain = ( value ) => JSON.parse( JSON.stringify( value ) );

function block( name, attributes = {}, innerBlocks = [] ) {
	return { name, attributes, innerBlocks };
}

// Schema defaults for the attributes used by these fixtures (source of truth:
// the plugin block.json files and WP core block.json).
const DEFAULTS = {
	'skvn-marine/product-collection': {
		layout: 'grid',
		contentWidth: 'normal',
		eyebrow: '',
		heading: 'Featured products',
		showHeading: true,
		intro: '',
		accessibleLabel: '',
		categories: [],
		tags: [],
		relation: 'OR',
		orderMode: 'newest',
		itemsToShow: 3,
		productActionMode: 'quote',
		customActionUrl: '',
		appendQuoteContext: true,
		archiveUrl: '',
		archiveLabel: '',
		catalogCtaUrl: '',
		showCatalogCta: false,
		catalogCtaLabel: 'Download catalog',
	},
	'skvn-marine/post-collection': {
		layout: 'grid',
		eyebrow: '',
		heading: 'Latest articles',
		showHeading: true,
		intro: '',
		accessibleLabel: '',
		categories: [],
		tags: [],
		relation: 'OR',
		orderMode: 'newest',
		itemsToShow: 3,
		postActionMode: 'link',
		customActionUrl: '',
		archiveUrl: '',
		archiveLabel: '',
		showCatalogCta: false,
		catalogCtaUrl: '',
		catalogCtaLabel: '',
		readMoreLabel: '',
	},
	'skvn-marine/slider': { autoplay: true, effect: 'slide', preset: 'hero', loop: true },
	'skvn-marine/slide': {
		backgroundImageId: 0,
		backgroundImageUrl: '',
		backgroundImageAlt: '',
		overlayOpacity: 35,
	},
	'core/heading': { level: 2 },
	'core/paragraph': {},
	'core/button': { tagName: 'a', type: 'button', linkTarget: '', rel: '', backgroundColor: 'accent' },
	'core/buttons': {},
	'core/columns': {},
	'core/column': {},
	'core/group': {},
	'core/image': { id: 0, url: '', alt: '', caption: '', href: '', linkTarget: '', rel: '', sizeSlug: 'large', linkDestination: 'none' },
};

const defaultsFor = ( name ) => DEFAULTS[ name ] || {};

const PRODUCT_FIELDS = [
	'accessibleLabel',
	'archiveLabel',
	'archiveUrl',
	'catalogCtaLabel',
	'catalogCtaUrl',
	'categories',
	'customActionUrl',
	'eyebrow',
	'heading',
	'intro',
	'itemsToShow',
	'orderMode',
	'relation',
	'tags',
];

const heading = ( content ) => block( 'core/heading', { content, level: 2 } );
const paragraph = ( content ) => block( 'core/paragraph', { content } );
const buttons = ( text, url = 'https://example.test/quote' ) =>
	block( 'core/buttons', {}, [ block( 'core/button', { text, url } ) ] );
const slide = ( title, extra = [] ) =>
	block(
		'skvn-marine/slide',
		{
			backgroundImageId: 12,
			backgroundImageUrl: 'https://example.test/slide.jpg',
			backgroundImageAlt: 'Slide image',
			overlayOpacity: 40,
		},
		[ heading( title ), paragraph( 'Body copy' ), ...extra ]
	);
const slider = ( slides ) =>
	block( 'skvn-marine/slider', { autoplay: true, effect: 'fade', preset: 'hero' }, slides );

function applyPatches( dest, patches ) {
	const copy = plain( dest );

	for ( const patch of patches ) {
		let node = copy;

		for ( const index of patch.path ) {
			node = node.innerBlocks[ index ];
		}

		node.attributes = { ...node.attributes, ...patch.attributes };
	}

	return copy;
}

test( 'product projection keeps the allowlist and never leaks style or layout', () => {
	const source = block( 'skvn-marine/product-collection', {
		layout: 'carousel',
		contentWidth: 'wide',
		heading: 'Marine gear',
		intro: '<strong>Marine</strong> intro',
		categories: [ 'pumps' ],
		tags: [ 'marine' ],
		relation: 'AND',
		orderMode: 'featured',
		itemsToShow: 6,
		productActionMode: 'catalog',
		appendQuoteContext: false,
		customActionUrl: 'https://example.test/catalog',
		catalogCtaLabel: 'Open catalog',
		titleColor: '#ff0000',
		mediaWidthPercent: 70,
		style: { color: { text: '#ff0000' } },
	} );

	const projection = api.buildProjection( source, defaultsFor );

	assert.equal( projection.ok, true );
	assert.deepEqual(
		Object.keys( projection.value.attributes ).sort(),
		PRODUCT_FIELDS
	);
	assert.equal( 'layout' in projection.value.attributes, false );
	assert.equal( 'contentWidth' in projection.value.attributes, false );
	assert.equal( 'productActionMode' in projection.value.attributes, false );
	assert.equal( 'appendQuoteContext' in projection.value.attributes, false );
	assert.equal( 'style' in projection.value.attributes, false );
	assert.equal( projection.value.attributes.catalogCtaLabel, 'Open catalog' );
} );

test( 'slider and structural wrappers carry no presentation attributes', () => {
	const source = slider( [
		slide( 'First', [
			block( 'core/columns', { className: 'skvn-slider__showcase-layout' }, [
				block( 'core/column', {}, [
					block( 'core/image', {
						id: 44,
						url: 'https://example.test/a.jpg',
						alt: 'A',
						sizeSlug: 'full',
						linkDestination: 'media',
					} ),
				] ),
			] ),
		] ),
	] );

	const projection = api.buildProjection( source, defaultsFor );

	assert.equal( projection.ok, true );
	assert.deepEqual( plain( projection.value.attributes ), {} );

	const projectedSlide = projection.value.innerBlocks[ 0 ];
	assert.deepEqual( plain( projectedSlide.attributes ), {
		backgroundImageId: 12,
		backgroundImageUrl: 'https://example.test/slide.jpg',
		backgroundImageAlt: 'Slide image',
	} );
	assert.equal( 'overlayOpacity' in projectedSlide.attributes, false );

	const projectedColumns = projectedSlide.innerBlocks[ 2 ];
	assert.deepEqual( plain( projectedColumns.attributes ), {} );
	const projectedImage = projectedColumns.innerBlocks[ 0 ].innerBlocks[ 0 ];
	assert.deepEqual( plain( projectedImage.attributes ), {
		id: 44,
		url: 'https://example.test/a.jpg',
		alt: 'A',
		caption: '',
		href: '',
		linkTarget: '',
		rel: '',
	} );
	assert.equal( 'sizeSlug' in projectedImage.attributes, false );
	assert.equal( 'linkDestination' in projectedImage.attributes, false );
} );

test( 'empty source values overwrite the destination instead of being skipped', () => {
	const source = block( 'skvn-marine/product-collection', {
		eyebrow: '',
		heading: '',
		intro: '',
		categories: [],
		tags: [],
		archiveUrl: '',
		catalogCtaLabel: '',
	} );
	const dest = block( 'skvn-marine/product-collection', {
		eyebrow: 'Old eyebrow',
		heading: 'Old heading',
		intro: '<strong>Old</strong> intro',
		categories: [ 'pumps' ],
		tags: [ 'marine' ],
		archiveUrl: 'https://example.test/archive',
		catalogCtaLabel: 'Download',
	} );

	const plan = api.buildPatches( source, dest, defaultsFor );

	assert.equal( plan.ok, true );
	assert.equal( plan.value.length, 1 );
	assert.deepEqual( plain( plan.value[ 0 ].attributes ), {
		eyebrow: '',
		heading: '',
		intro: '',
		categories: [],
		tags: [],
		archiveUrl: '',
		catalogCtaLabel: '',
	} );
} );

test( 'identical content produces no patches, so no history entry', () => {
	const source = block( 'skvn-marine/post-collection', {
		heading: 'News',
		intro: '<em>Latest</em>',
		categories: [ 'company' ],
		orderMode: 'newest',
	} );
	const dest = block( 'skvn-marine/post-collection', {
		heading: 'News',
		intro: '<em>Latest</em>',
		categories: [ 'company' ],
		orderMode: 'newest',
	} );

	const plan = api.buildPatches( source, dest, defaultsFor );

	assert.equal( plan.ok, true );
	assert.deepEqual( plain( plan.value ), [] );
} );

test( 'style-only destination differences produce no patches and keep the signature', () => {
	const content = {
		heading: 'Marine gear',
		intro: '<strong>Intro</strong>',
		categories: [ 'pumps' ],
		itemsToShow: 6,
	};
	const source = block( 'skvn-marine/product-collection', {
		...content,
		layout: 'grid',
		titleColor: '#ff0000',
		mediaWidthPercent: 70,
	} );
	const dest = block( 'skvn-marine/product-collection', {
		...content,
		layout: 'carousel',
		showArrows: false,
		cardStyle: 'overlay',
		titleColor: '#00ff00',
		mediaWidthPercent: 40,
	} );

	const plan = api.buildPatches( source, dest, defaultsFor );

	assert.equal( plan.ok, true );
	assert.deepEqual( plain( plan.value ), [] );
	assert.equal(
		api.contentSignature( source, defaultsFor ),
		api.contentSignature( dest, defaultsFor )
	);
} );

test( 'grid and carousel of the same collection are compatible and keep the destination layout', () => {
	const source = block( 'skvn-marine/product-collection', {
		layout: 'carousel',
		heading: 'Copied heading',
		categories: [ 'pumps' ],
		relation: 'AND',
		itemsToShow: 4,
	} );
	const gridDest = block( 'skvn-marine/product-collection', {
		layout: 'grid',
		heading: 'Old',
		categories: [],
	} );
	const carouselDest = block( 'skvn-marine/product-collection', {
		layout: 'carousel',
		heading: 'Old',
		categories: [],
	} );

	for ( const dest of [ gridDest, carouselDest ] ) {
		const plan = api.buildPatches( source, dest, defaultsFor );

		assert.equal( plan.ok, true );

		for ( const patch of plan.value ) {
			assert.equal( 'layout' in patch.attributes, false );
		}

		const merged = applyPatches( dest, plan.value );
		assert.equal( merged.attributes.layout, dest.attributes.layout );
		assert.equal( merged.attributes.heading, 'Copied heading' );
		assert.deepEqual( plain( merged.attributes.categories ), [ 'pumps' ] );
	}
} );

test( 'a different root block type is rejected', () => {
	const product = block( 'skvn-marine/product-collection', { heading: 'A' } );
	const post = block( 'skvn-marine/post-collection', { heading: 'B' } );

	const plan = api.buildPatches( product, post, defaultsFor );

	assert.equal( plan.ok, false );
	assert.equal( plan.code, 'root-type' );
	assert.equal( api.buildProjection( block( 'core/group', {} ), defaultsFor ).code, 'root-type' );
} );

test( 'child count, child order or child name mismatch rejects the whole paste', () => {
	const twoSlides = slider( [ slide( 'One' ), slide( 'Two' ) ] );
	const threeSlides = slider( [ slide( 'One' ), slide( 'Two' ), slide( 'Three' ) ] );

	const count = api.buildPatches( twoSlides, threeSlides, defaultsFor );
	assert.equal( count.ok, false );
	assert.equal( count.code, 'shape' );

	const swapped = slider( [
		block( 'skvn-marine/slide', {}, [ paragraph( 'One' ), heading( 'Two' ) ] ),
	] );
	const expected = slider( [ slide( 'One' ) ] );
	const order = api.buildPatches( swapped, expected, defaultsFor );
	assert.equal( order.ok, false );
	assert.equal( order.code, 'shape' );

	const nested = slider( [
		slide( 'One', [ buttons( 'Quote' ) ] ),
	] );
	const withoutNested = slider( [ block( 'skvn-marine/slide', {}, [ heading( 'One' ) ] ) ] );
	const nestedMismatch = api.buildPatches( nested, withoutNested, defaultsFor );
	assert.equal( nestedMismatch.ok, false );
	assert.equal( nestedMismatch.code, 'shape' );
} );

test( 'unsupported descendants reject the projection instead of being dropped', () => {
	const withQuote = slider( [
		block( 'skvn-marine/slide', {}, [ heading( 'One' ), block( 'core/quote', {} ) ] ),
	] );

	const projection = api.buildProjection( withQuote, defaultsFor );

	assert.equal( projection.ok, false );
	assert.equal( projection.code, 'unsupported-node' );
	assert.equal( projection.detail, 'core/quote' );
	assert.equal( api.isAllowedChild( 'skvn-marine/slider', 'core/paragraph' ), false );
	assert.equal( api.isAllowedChild( 'skvn-marine/slider', 'skvn-marine/slide' ), true );
} );

test( 'rich text keeps semantic inline tags and removes inline presentation', () => {
	const result = api.sanitizeInlineHtml(
		'<strong>Bold</strong> <em>italic</em><br><a href="https://example.test/q" target="_blank" rel="opener sponsored">link</a>'
	);

	assert.equal( result.ok, true );
	assert.match( result.value, /<strong>Bold<\/strong>/ );
	assert.match( result.value, /<em>italic<\/em>/ );
	assert.match( result.value, /<br \/>/ );
	assert.match( result.value, /<a href="https:\/\/example.test\/q" target="_blank" rel="sponsored noopener noreferrer">link<\/a>/ );

	const styled = api.sanitizeInlineHtml( '<strong style="color:red">Bold</strong>' );
	assert.equal( styled.ok, true );
	assert.equal( styled.value, '<strong>Bold</strong>' );
} );

test( 'rich text rejects unsupported markup instead of stripping it silently', () => {
	const span = api.sanitizeInlineHtml( '<span style="font-family:serif">text</span>' );
	assert.equal( span.ok, false );
	assert.equal( span.code, 'rich-text' );

	const div = api.sanitizeInlineHtml( '<div>block</div>' );
	assert.equal( div.ok, false );

	const unbalanced = api.sanitizeInlineHtml( '<strong>open' );
	assert.equal( unbalanced.ok, false );
	assert.equal( unbalanced.detail, 'unclosed' );

	const comment = api.sanitizeInlineHtml( '<!-- note -->text' );
	assert.equal( comment.ok, false );
} );

test( 'link URLs are checked before any write', () => {
	assert.equal( api.isSafeUrl( 'https://example.test/a' ), true );
	assert.equal( api.isSafeUrl( '/relative/path' ), true );
	assert.equal( api.isSafeUrl( '#anchor' ), true );
	assert.equal( api.isSafeUrl( 'mailto:hello@example.test' ), true );
	assert.equal( api.isSafeUrl( 'tel:+84123456789' ), true );
	assert.equal( api.isSafeUrl( 'javascript:alert(1)' ), false );
	assert.equal( api.isSafeUrl( 'data:text/html;base64,AAAA' ), false );
	assert.equal( api.isSafeUrl( 'ftp://example.test' ), false );
	assert.equal( api.isSafeUrl( 'java\nscript:alert(1)' ), false );

	const badLink = api.sanitizeInlineHtml( '<a href="javascript:alert(1)">x</a>' );
	assert.equal( badLink.ok, false );
	assert.equal( badLink.code, 'url' );

	const badButtonUrl = api.buildProjection(
		slider( [
			block( 'skvn-marine/slide', {}, [
				block( 'core/buttons', {}, [
					block( 'core/button', { text: 'Go', url: 'javascript:alert(1)' } ),
				] ),
			] ),
		] ),
		defaultsFor
	);
	assert.equal( badButtonUrl.ok, false );
	assert.equal( badButtonUrl.code, 'url' );
} );

test( 'itemsToShow is validated against the destination layout limit without clamping', () => {
	assert.equal( api.itemLimit( 'skvn-marine/product-collection', {} ), 20 );
	assert.equal( api.itemLimit( 'skvn-marine/post-collection', { layout: 'grid' } ), 9 );
	assert.equal( api.itemLimit( 'skvn-marine/post-collection', { layout: 'carousel' } ), 10 );

	const productTwenty = block( 'skvn-marine/product-collection', { itemsToShow: 20 } );
	assert.equal( api.buildProjection( productTwenty, defaultsFor ).ok, true );
	assert.equal(
		api.buildProjection(
			block( 'skvn-marine/product-collection', { itemsToShow: 21 } ),
			defaultsFor
		).code,
		'field-range'
	);

	const tenPosts = block( 'skvn-marine/post-collection', { itemsToShow: 10 } );
	const postGrid = block( 'skvn-marine/post-collection', { layout: 'grid' } );
	const postCarousel = block( 'skvn-marine/post-collection', { layout: 'carousel' } );

	assert.equal( api.buildPatches( tenPosts, postCarousel, defaultsFor ).ok, true );

	const gridPlan = api.buildPatches( tenPosts, postGrid, defaultsFor );
	assert.equal( gridPlan.ok, false );
	assert.equal( gridPlan.code, 'field-range' );

	const elevenPosts = block( 'skvn-marine/post-collection', { itemsToShow: 11 } );
	assert.equal(
		api.buildPatches( elevenPosts, postCarousel, defaultsFor ).code,
		'field-range'
	);
} );

test( 'headings are flattened because the frontend escapes that attribute', () => {
	const source = block( 'skvn-marine/post-collection', {
		heading: 'News <strong>and</strong> <em>notes</em>',
	} );

	const projection = api.buildProjection( source, defaultsFor );

	assert.equal( projection.ok, true );
	assert.equal( projection.value.attributes.heading, 'News and notes' );
	assert.equal( api.toPlainText( '<a href="/x">Link</a>' ).value, 'Link' );
} );

test( 'content signature tracks content changes but ignores style changes', () => {
	const base = block( 'skvn-marine/slider', { preset: 'hero' }, [ slide( 'One' ) ] );
	const restyled = block( 'skvn-marine/slider', { preset: 'showcase', effect: 'fade' }, [
		block(
			'skvn-marine/slide',
			{
				backgroundImageId: 12,
				backgroundImageUrl: 'https://example.test/slide.jpg',
				backgroundImageAlt: 'Slide image',
				overlayOpacity: 10,
			},
			[ heading( 'One' ), paragraph( 'Body copy' ) ]
		),
	] );
	const edited = block( 'skvn-marine/slider', {}, [
		block(
			'skvn-marine/slide',
			{
				backgroundImageId: 12,
				backgroundImageUrl: 'https://example.test/slide.jpg',
				backgroundImageAlt: 'Slide image',
			},
			[ heading( 'Two' ), paragraph( 'Body copy' ) ]
		),
	] );

	assert.equal(
		api.contentSignature( base, defaultsFor ),
		api.contentSignature( restyled, defaultsFor )
	);
	assert.notEqual(
		api.contentSignature( base, defaultsFor ),
		api.contentSignature( edited, defaultsFor )
	);
} );

test( 'node and depth limits reject oversized trees', () => {
	const manySlides = [];
	for ( let index = 0; index < 100; index++ ) {
		manySlides.push( slide( `Slide ${ index }` ) );
	}

	// 1 slider + 100 slides + 100 headings + 100 paragraphs + 100 buttons groups.
	// Each slide here only carries heading + paragraph, so the fixture stays under
	// the node cap until the slide count itself exceeds it.
	const wide = slider( manySlides );
	assert.equal( api.countNodes( wide ), 301 );
	assert.equal( api.buildProjection( wide, defaultsFor ).code, 'limit' );

	const underLimit = slider( manySlides.slice( 0, 65 ) );
	assert.equal( api.countNodes( underLimit ), 196 );
	assert.equal( api.buildProjection( underLimit, defaultsFor ).ok, true );

	const nested = ( depth ) => {
		let node = paragraph( 'deep' );
		for ( let index = 0; index < depth; index++ ) {
			node = block( 'core/group', {}, [ node ] );
		}
		return slider( [ block( 'skvn-marine/slide', {}, [ node ] ) ] );
	};

	// slider + slide + groups + paragraph
	assert.equal( api.treeDepth( nested( 17 ) ), api.MAX_DEPTH );
	assert.equal( api.buildProjection( nested( 17 ), defaultsFor ).ok, true );
	assert.equal( api.buildProjection( nested( 18 ), defaultsFor ).code, 'limit' );
} );
