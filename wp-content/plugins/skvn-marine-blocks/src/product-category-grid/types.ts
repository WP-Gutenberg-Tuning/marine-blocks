export type CategoryDestination = 'archive' | 'custom';

/** Ordered selection stored in the block. No category snapshot is stored. */
export type CategorySelection = {
	termId: number;
	destination: CategoryDestination;
	customUrl: string;
};

export type CategoryGap = 'small' | 'medium' | 'large';
export type CategoryMediaFit = 'contain' | 'cover';
export type CategoryDescriptionDisplay = 'excerpt' | 'full';
export type CategoryDescriptionAlign = 'left' | 'center' | 'right' | 'justify';
export type CategoryActionWidthMode = 'auto' | 'full' | 'custom';
export type CategoryActionAlign = 'left' | 'center' | 'right';
export type CategoryActionRadiusMode = 'pill' | 'custom';
export type CategoryActionPlacement = 'flow' | 'bottom';
export type CategoryRadius = 'none' | 'sm' | 'md' | 'lg';
export type CategoryPadding = 'none' | 'sm' | 'md' | 'lg';
export type CategoryShadow = 'none' | 'soft' | 'strong';
export type CategoryColumns = 1 | 2 | 3 | 4;

export type CategoryGridAttributes = {
	align?: '' | 'wide' | 'full';
	categories: CategorySelection[];
	columnsDesktop: CategoryColumns;
	columnsTablet: CategoryColumns;
	columnsMobile: CategoryColumns;
	gap: CategoryGap;
	mediaFit: CategoryMediaFit;
	showImage: boolean;
	showName: boolean;
	showDescription: boolean;
	descriptionDisplay?: CategoryDescriptionDisplay;
	/** Plan 061 §4: enum attributes fall back to their default when invalid. */
	descriptionAlign?: CategoryDescriptionAlign;
	showPath: boolean;
	showCount: boolean;
	showCta: boolean;
	ctaLabel: string;
	/** Button geometry (plan 061 §4). `actionGapPx` absent = Default 0.4rem. */
	actionWidthMode?: CategoryActionWidthMode;
	actionWidthPercent?: number;
	actionAlign?: CategoryActionAlign;
	actionRadiusMode?: CategoryActionRadiusMode;
	actionRadiusPx?: number;
	actionPlacement?: CategoryActionPlacement;
	actionGapPx?: number;
	cardBackground?: string;
	cardRadius?: CategoryRadius;
	cardPadding?: CategoryPadding;
	cardShadow?: CategoryShadow;
	nameColor?: string;
	nameFontFamily?: string;
	nameFontSize?: string;
	detailsColor?: string;
	detailsFontSize?: string;
	actionBackgroundColor?: string;
	actionTextColor?: string;
	actionHoverBackgroundColor?: string;
	actionHoverTextColor?: string;
};

export type CategoryThumbnail = {
	id: number;
	storedId: number;
	src: string;
	alt: string;
	placeholder: boolean;
};

/** Native category data resolved by the REST endpoint on every request. */
export type CategoryRecord = {
	id: number;
	name: string;
	slug: string;
	parent: number;
	path: string[];
	count: number;
	hasProducts: boolean;
	descriptionExcerpt: string;
	/**
	 * Full plain-text description (presentation field, resolved server side).
	 * Optional: stale API responses without the field must not be treated as
	 * full text (plan 061 §5.1 - never coalesce excerpt into full).
	 */
	descriptionText?: string;
	canEdit: boolean;
	thumbnail: CategoryThumbnail;
	/** Raw native value; only present for editors that may edit the term. */
	description?: string;
};

export type CategoryListResponse = {
	items: CategoryRecord[];
	total: number;
	page: number;
	perPage: number;
	hasMore: boolean;
	filtered: boolean;
};

export type SaveDetailsRequestItem = {
	termId: number;
	revision: number;
	descriptionDirty?: boolean;
	description?: string;
	descriptionBase?: string;
	thumbnailDirty?: boolean;
	thumbnailId?: number;
	thumbnailBase?: number;
};

export type SaveDetailsResult = {
	termId: number;
	revision: number;
	status: 'saved' | 'unchanged' | 'conflict' | 'error';
	fields?: string[];
	code?: string;
	message?: string;
	notice?: string;
	description?: string;
	descriptionExcerpt?: string;
	thumbnailId?: number;
	thumbnail?: CategoryThumbnail;
};

export type SaveDetailsResponse = {
	results: SaveDetailsResult[];
	saved: number;
	failed: number;
};
