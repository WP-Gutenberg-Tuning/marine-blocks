import {
	Button,
	Notice,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { useRef, useState } from '@wordpress/element';
import { notify } from './notices';
import {
	discardDraft,
	keepDraftOverConflict,
	reloadConflictValue,
	saveDrafts,
	setDraftDescription,
	setDraftThumbnail,
	useCategoryDraft,
} from './store';
import type { CategoryRecord } from './types';

/**
 * Category details editor.
 *
 * Scope rules (Q3=B, save contract §4):
 * - the description is native term HTML; only formatting WordPress itself
 *   keeps for a term description (inline + links) is offered here;
 * - the stored description is never normalized or rewritten unless the field
 *   is dirty, so replacing a thumbnail cannot alter the description;
 * - nothing is written on blur or on panel close: only "Save category" or an
 *   explicit page Save/Update/Publish flushes the draft.
 */

type MediaItem = {
	id: number;
	source_url?: string;
	alt_text?: string;
};

function insertAroundSelection(
	value: string,
	start: number,
	end: number,
	before: string,
	after: string,
	replacement?: string
): string {
	const selected = value.slice( start, end ) || '';
	const inner = replacement !== undefined ? replacement : selected;

	return value.slice( 0, start ) + before + inner + after + value.slice( end );
}

function escapeAttribute( value: string ): string {
	return value
		.replace( /&/g, '&amp;' )
		.replace( /"/g, '&quot;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' );
}

export function CategoryDetailsPanel( {
	record,
	termId,
	onClose,
}: {
	record?: CategoryRecord;
	termId: number;
	onClose: () => void;
} ) {
	const draft = useCategoryDraft( termId );
	const [ linkOpen, setLinkOpen ] = useState( false );
	const [ linkUrl, setLinkUrl ] = useState( '' );
	const [ linkText, setLinkText ] = useState( '' );
	const [ saving, setSaving ] = useState( false );
	const containerRef = useRef< HTMLDivElement | null >( null );

	const media = useSelect(
		( select ) => {
			if ( ! draft || ! draft.thumbnailId ) {
				return undefined;
			}

			const store = select( 'core' ) as unknown as {
				getMedia?: ( id: number ) => MediaItem | undefined;
			};

			return store.getMedia ? store.getMedia( draft.thumbnailId ) : undefined;
		},
		[ draft?.thumbnailId ]
	);

	if ( ! draft ) {
		return (
			<div className="skvn-category-details">
				<Button onClick={ onClose } variant="link">
					{ __( '← Back to selection', 'skvn-marine-blocks' ) }
				</Button>
				<p>{ __( 'Loading category details…', 'skvn-marine-blocks' ) }</p>
			</div>
		);
	}

	const imageSrc = draft.thumbnailId
		? media?.source_url ||
		  ( record && draft.thumbnailId === record.thumbnail.storedId
				? record.thumbnail.src
				: '' )
		: '';

	const hasDirty = draft.dirty.description || draft.dirty.thumbnail;

	async function handleSave() {
		setSaving( true );
		try {
			await saveDrafts( [ termId ] );
		} finally {
			setSaving( false );
		}
	}

	function getTextarea() {
		return containerRef.current?.querySelector< HTMLTextAreaElement >( 'textarea' ) || null;
	}

	function getSelection( value: string ) {
		const textarea = getTextarea();
		const start = textarea?.selectionStart ?? value.length;
		const end = textarea?.selectionEnd ?? value.length;

		return { start, end };
	}

	function applyInlineFormat( before: string, after: string ) {
		const value = draft?.description ?? '';
		const { start, end } = getSelection( value );

		setDraftDescription(
			termId,
			insertAroundSelection( value, start, end, before, after )
		);
	}

	function applyLink() {
		const url = linkUrl.trim();

		if ( ! url ) {
			notify( __( 'Enter a URL for the link.', 'skvn-marine-blocks' ), 'warning' );
			return;
		}

		const value = draft?.description ?? '';
		const { start, end } = getSelection( value );
		const selected = value.slice( start, end );
		const href = escapeAttribute( url );
		const label = escapeAttribute( linkText.trim() || selected || url );

		setDraftDescription(
			termId,
			insertAroundSelection( value, start, end, `<a href="${ href }">`, '</a>', label )
		);
		setLinkOpen( false );
		setLinkUrl( '' );
		setLinkText( '' );
	}

	return (
		<div className="skvn-category-details" ref={ containerRef }>
			<div className="skvn-category-details__head">
				<Button onClick={ onClose } variant="link">
					{ __( '← Back to selection', 'skvn-marine-blocks' ) }
				</Button>
				<h3 className="skvn-category-details__title">
					{ record?.name || sprintf( __( 'Category #%d', 'skvn-marine-blocks' ), termId ) }
				</h3>
				{ record && record.path.length > 1 && (
					<p className="skvn-category-details__path">
						{ record.path.join( ' › ' ) }
					</p>
				) }
			</div>

			<p className="skvn-category-details__scope">
				{ __(
					'These details belong to the category itself and are shared by every block that uses it.',
					'skvn-marine-blocks'
				) }
			</p>

			{ ! draft.canEdit && (
				<Notice isDismissible={ false } status="warning">
					{ __(
						'You can view this category, but your role is not allowed to edit its shared details.',
						'skvn-marine-blocks'
					) }
				</Notice>
			) }

			<div className="skvn-category-details__field">
				<span className="skvn-category-details__label">
					{ __( 'Thumbnail', 'skvn-marine-blocks' ) }
				</span>
				<div className="skvn-category-details__thumb">
					{ imageSrc ? (
						<img alt="" src={ imageSrc } />
					) : (
						<span className="skvn-category-details__thumb-empty">
							{ __( 'WooCommerce placeholder', 'skvn-marine-blocks' ) }
						</span>
					) }
				</div>
				<div className="skvn-category-details__thumb-actions">
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={ [ 'image' ] }
							onSelect={ ( selected: { id?: number } ) => {
								if ( selected && selected.id ) {
									setDraftThumbnail( termId, selected.id );
								}
							} }
							render={ ( { open } ) => (
								<Button disabled={ ! draft.canEdit } onClick={ open } variant="secondary">
									{ draft.thumbnailId
										? __( 'Replace image', 'skvn-marine-blocks' )
										: __( 'Select image', 'skvn-marine-blocks' ) }
								</Button>
							) }
							value={ draft.thumbnailId || undefined }
						/>
					</MediaUploadCheck>
					{ draft.thumbnailId > 0 && (
						<Button
							disabled={ ! draft.canEdit }
							onClick={ () => setDraftThumbnail( termId, 0 ) }
							variant="tertiary"
						>
							{ __( 'Remove image', 'skvn-marine-blocks' ) }
						</Button>
					) }
				</div>
			</div>

			<div className="skvn-category-details__field">
				<span className="skvn-category-details__label">
					{ __( 'Description', 'skvn-marine-blocks' ) }
				</span>
				<div className="skvn-category-details__toolbar" role="toolbar">
					<Button
						disabled={ ! draft.canEdit }
						onClick={ () => applyInlineFormat( '<strong>', '</strong>' ) }
						size="small"
						variant="tertiary"
					>
						{ __( 'Bold', 'skvn-marine-blocks' ) }
					</Button>
					<Button
						disabled={ ! draft.canEdit }
						onClick={ () => applyInlineFormat( '<em>', '</em>' ) }
						size="small"
						variant="tertiary"
					>
						{ __( 'Italic', 'skvn-marine-blocks' ) }
					</Button>
					<Button
						disabled={ ! draft.canEdit }
						onClick={ () => setLinkOpen( ( open ) => ! open ) }
						size="small"
						variant="tertiary"
					>
						{ __( 'Link', 'skvn-marine-blocks' ) }
					</Button>
				</div>

				{ linkOpen && (
					<div className="skvn-category-details__link">
						<TextControl
							label={ __( 'Link text', 'skvn-marine-blocks' ) }
							onChange={ setLinkText }
							value={ linkText }
						/>
						<TextControl
							label={ __( 'Link URL', 'skvn-marine-blocks' ) }
							onChange={ setLinkUrl }
							type="url"
							value={ linkUrl }
						/>
						<Button onClick={ applyLink } variant="secondary">
							{ __( 'Add link', 'skvn-marine-blocks' ) }
						</Button>
					</div>
				) }

				<TextareaControl
					disabled={ ! draft.canEdit }
					help={ __(
						'WordPress keeps bold, italic and links in category descriptions. Paragraphs, headings and lists are not stored.',
						'skvn-marine-blocks'
					) }
					hideLabelFromVision
					label={ __( 'Category description', 'skvn-marine-blocks' ) }
					onChange={ ( value ) => setDraftDescription( termId, value ) }
					rows={ 6 }
					value={ draft.description }
				/>

				<p className="skvn-category-details__cards-note">
					{ __(
						"The saved description itself is not trimmed or stripped. Cards using this category show an excerpt or the full plain text, depending on each block's display settings.",
						'skvn-marine-blocks'
					) }
				</p>
			</div>

			{ draft.status === 'conflict' && draft.conflict && (
				<div className="skvn-category-details__conflict" role="alert">
					<p>
						{ __(
							'This category was changed elsewhere while you were editing. Your draft is kept.',
							'skvn-marine-blocks'
						) }
					</p>
					<Button onClick={ () => reloadConflictValue( termId ) } variant="secondary">
						{ __( 'Reload current value', 'skvn-marine-blocks' ) }
					</Button>
					<Button onClick={ () => keepDraftOverConflict( termId ) } variant="tertiary">
						{ __( 'Keep my draft', 'skvn-marine-blocks' ) }
					</Button>
				</div>
			) }

			{ draft.status === 'error' && draft.error && (
				<Notice isDismissible={ false } status="error">
					{ draft.error }
				</Notice>
			) }

			<div className="skvn-category-details__footer">
				<span aria-live="polite" className="skvn-category-details__status">
					{ draft.status === 'saving' || saving
						? __( 'Saving…', 'skvn-marine-blocks' )
						: hasDirty
						? __( 'Unsaved changes', 'skvn-marine-blocks' )
						: __( 'No unsaved changes', 'skvn-marine-blocks' ) }
				</span>
				<Button
					disabled={ ! draft.canEdit || ! hasDirty || saving }
					onClick={ handleSave }
					variant="primary"
				>
					{ __( 'Save category', 'skvn-marine-blocks' ) }
				</Button>
				<Button
					disabled={ ! hasDirty || saving }
					onClick={ () => discardDraft( termId ) }
					variant="tertiary"
				>
					{ __( 'Discard', 'skvn-marine-blocks' ) }
				</Button>
			</div>
		</div>
	);
}
