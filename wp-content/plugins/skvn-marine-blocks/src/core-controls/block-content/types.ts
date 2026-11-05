/**
 * Shared types for the content-only Copy/Paste actions (plan057).
 *
 * These types are runtime-free on purpose: `fields.ts` and `plan.ts` stay
 * dependency free so the projection, allowlist and shape rules can be tested
 * without a browser or a built bundle.
 */

export type ContentFieldKind =
	| 'plain'
	| 'richtext'
	| 'heading'
	| 'slugs'
	| 'enum'
	| 'int'
	| 'url';

export interface ContentField {
	key: string;
	kind: ContentFieldKind;
	values?: string[];
	min?: number;
	max?: number;
}

/**
 * Minimal block tree used by the pure planner. WordPress block objects already
 * expose `name`, `attributes` and `innerBlocks`, so a live block can be passed
 * straight in.
 */
export interface TreeBlock {
	isValid?: boolean;
	name: string;
	attributes: Record< string, unknown >;
	innerBlocks: TreeBlock[];
}

/** A patch for one node of the destination tree, addressed by child indexes. */
export interface BlockPatch {
	path: number[];
	attributes: Record< string, unknown >;
}

export type ContentFailure =
	| 'binding'
	| 'root-type'
	| 'unsupported-node'
	| 'shape'
	| 'field-type'
	| 'field-enum'
	| 'field-range'
	| 'url'
	| 'rich-text'
	| 'limit'
	| 'empty';

export interface ContentResult< T > {
	ok: boolean;
	value?: T;
	code?: ContentFailure;
	detail?: string;
}
