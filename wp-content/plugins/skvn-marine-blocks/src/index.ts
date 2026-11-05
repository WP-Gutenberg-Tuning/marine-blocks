import { registerBlockType } from '@wordpress/blocks';

import './core-controls';
import './design-sidebar';
import spacerMetadata from './responsive-spacer/block.json';
import { Edit as SpacerEdit } from './responsive-spacer/edit';
import { save as spacerSave } from './responsive-spacer/save';

import accordionMetadata from './accordion/block.json';
import { Edit as AccordionEdit } from './accordion/edit';
import { save as accordionSave } from './accordion/save';

import slideMetadata from './slide/block.json';
import { Edit as SlideEdit } from './slide/edit';
import { save as slideSave } from './slide/save';

import sliderMetadata from './slider/block.json';
import sliderDeprecated from './slider/deprecated';
import { Edit as SliderEdit } from './slider/edit';
import { save as sliderSave } from './slider/save';
import { registerSliderVariations } from './slider/variations';

import cardGridMetadata from './card-grid/block.json';
import { Edit as CardGridEdit } from './card-grid/edit';
import { save as cardGridSave } from './card-grid/save';

import cardMetadata from './card/block.json';
import { Edit as CardEdit } from './card/edit';
import { save as cardSave } from './card/save';

import featureShowcaseMetadata from './feature-showcase/block.json';
import featureShowcaseDeprecated from './feature-showcase/deprecated';
import { Edit as FeatureShowcaseEdit } from './feature-showcase/edit';
import { save as featureShowcaseSave } from './feature-showcase/save';
import './feature-showcase/style.css';
import './collection/style.css';

import postCollectionMetadata from './post-collection/block.json';
import { Edit as PostCollectionEdit } from './post-collection/edit';
import { save as postCollectionSave } from './post-collection/save';
import { registerPostCollectionVariations } from './post-collection/variations';

import productCollectionMetadata from './product-collection/block.json';
import { Edit as ProductCollectionEdit } from './product-collection/edit';
import { save as productCollectionSave } from './product-collection/save';
import { registerProductCollectionVariations } from './product-collection/variations';

import productCategoryGridMetadata from './product-category-grid/block.json';
import { Edit as ProductCategoryGridEdit } from './product-category-grid/edit';
import './product-category-grid/style.css';

registerBlockType( spacerMetadata.name, {
	...spacerMetadata,
	edit: SpacerEdit,
	save: spacerSave,
} );

registerBlockType( accordionMetadata.name, {
	...accordionMetadata,
	edit: AccordionEdit,
	save: accordionSave,
} );

registerBlockType( slideMetadata.name, {
	...slideMetadata,
	edit: SlideEdit,
	save: slideSave,
} );

registerBlockType( sliderMetadata.name, {
	...sliderMetadata,
	deprecated: sliderDeprecated,
	edit: SliderEdit,
	save: sliderSave,
} );
registerSliderVariations();

registerBlockType( cardGridMetadata.name, {
	...cardGridMetadata,
	edit: CardGridEdit,
	save: cardGridSave,
} );

registerBlockType( cardMetadata.name, {
	...cardMetadata,
	edit: CardEdit,
	save: cardSave,
} );

registerBlockType( featureShowcaseMetadata.name, {
	...featureShowcaseMetadata,
	deprecated: featureShowcaseDeprecated,
	edit: FeatureShowcaseEdit,
	save: featureShowcaseSave,
} );

registerBlockType( postCollectionMetadata.name, {
	...postCollectionMetadata,
	edit: PostCollectionEdit,
	save: postCollectionSave,
} );
registerPostCollectionVariations();

registerBlockType( productCollectionMetadata.name, {
	...productCollectionMetadata,
	edit: ProductCollectionEdit,
	save: productCollectionSave,
} );
registerProductCollectionVariations();

registerBlockType( productCategoryGridMetadata.name, {
	...productCategoryGridMetadata,
	edit: ProductCategoryGridEdit,
	// Dynamic block: the front end is rendered by PHP, so nothing is stored.
	save: () => null,
} );
