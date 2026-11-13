import Swiper from 'swiper';
import {
	A11y,
	Autoplay,
	EffectFade,
	Keyboard,
	Navigation,
	Pagination,
	Parallax,
} from 'swiper/modules';
import { __, sprintf } from '@wordpress/i18n';
import {
	createAutoplayPauseCoordinator,
	type AutoplayPauseCoordinator,
} from '../shared/autoplay';
import { normalizeGovernedTime } from '../shared/governed-time';
import { prefersReducedMotion } from '../shared/motion';
import {
	SLIDER_AUTOPLAY_TIME,
	SLIDER_TRANSITION_TIME,
} from './time';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './style.css';

type ArrowStyle = 'minimal' | 'circle' | 'pill';
type ArrowPosition =
	| 'side-center'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right';
type PaginationStyle =
	| 'dots'
	| 'fraction'
	| 'timed-fraction'
	| 'timed-segments';
type BottomPosition = 'bottom-left' | 'bottom-center' | 'bottom-right';
type TransitionStyle = 'directional-wipe' | 'fade' | 'slide' | 'zoom-out';

type SliderConfig = {
	autoplay?: boolean;
	autoplayDelay?: number;
	loop?: boolean;
	showArrows?: boolean;
	arrowStyle?: string;
	arrowPosition?: string;
	showPagination?: boolean;
	paginationStyle?: string;
	paginationPosition?: string;
	effect?: string;
	transitionStyle?: string;
	transitionDuration?: number;
	heightPreset?: string;
	slidesPerView?: number;
	responsiveSlides?: string;
	slideCount?: number;
	enableParallax?: boolean;
	parallaxIntensity?: string;
	parallaxAdvanced?: boolean;
	parallaxDepth?: string;
	parallaxDirection?: string;
	parallaxTranslate?: number;
	parallaxScale?: number;
	parallaxInset?: number;
};

type NormalizedSliderConfig = {
	autoplay: boolean;
	autoplayDelay: number;
	loop: boolean;
	showArrows: boolean;
	arrowStyle: ArrowStyle;
	arrowPosition: ArrowPosition;
	showPagination: boolean;
	paginationStyle: PaginationStyle;
	paginationPosition: BottomPosition;
	transitionStyle: TransitionStyle;
	transitionDuration: number;
	heightPreset:
		| 'default'
		| 'content'
		| 'medium'
		| 'tall'
		| 'viewport-below-header';
	slidesPerView: number;
	responsiveSlides: '3-2-1' | 'uniform';
	slideCount: number;
	enableParallax: boolean;
	parallaxIntensity: 'subtle' | 'medium' | 'strong';
	parallaxAdvanced: boolean;
	parallaxDepth: 'both' | 'translate' | 'scale';
	parallaxDirection: 'horizontal' | 'vertical';
	parallaxTranslate: number;
	parallaxScale: number;
	parallaxInset: number;
};

type SliderElement = HTMLElement & {
	swiper?: Swiper;
	skvnSliderCleanup?: () => void;
};

function clampInteger(
	value: unknown,
	fallback: number,
	minimum: number,
	maximum: number
) {
	return typeof value === 'number' && Number.isFinite( value )
		? Math.min( maximum, Math.max( minimum, Math.round( value ) ) )
		: fallback;
}

function clampNumber(
	value: unknown,
	fallback: number,
	minimum: number,
	maximum: number
) {
	return typeof value === 'number' && Number.isFinite( value )
		? Math.min( maximum, Math.max( minimum, value ) )
		: fallback;
}

function normalizeChoice< T extends string >(
	value: unknown,
	allowed: readonly T[],
	fallback: T
) {
	return typeof value === 'string' && allowed.includes( value as T )
		? ( value as T )
		: fallback;
}

function parseSliderConfig(
	rawConfig: string,
	fallbackSlideCount: number
): NormalizedSliderConfig {
	let parsed: SliderConfig = {};

	try {
		const candidate = JSON.parse( rawConfig ) as SliderConfig;
		parsed =
			candidate && typeof candidate === 'object' ? candidate : {};
	} catch {
		parsed = {};
	}

	const slideCount = clampInteger(
		parsed.slideCount,
		fallbackSlideCount,
		0,
		100
	);
	const hasMultipleSlides = slideCount > 1;
	const arrowStyle = normalizeChoice(
		parsed.arrowStyle,
		[ 'minimal', 'circle', 'pill' ] as const,
		'circle'
	);
	let arrowPosition = normalizeChoice(
		parsed.arrowPosition,
		[
			'side-center',
			'bottom-left',
			'bottom-center',
			'bottom-right',
		] as const,
		'side-center'
	);

	if ( arrowStyle === 'pill' && arrowPosition === 'side-center' ) {
		arrowPosition = 'bottom-left';
	}

	return {
		autoplay:
			hasMultipleSlides &&
			( typeof parsed.autoplay === 'boolean' ? parsed.autoplay : true ),
		autoplayDelay: normalizeGovernedTime(
			parsed.autoplayDelay,
			SLIDER_AUTOPLAY_TIME
		),
		loop:
			hasMultipleSlides &&
			( typeof parsed.loop === 'boolean' ? parsed.loop : true ),
		showArrows:
			hasMultipleSlides &&
			( typeof parsed.showArrows === 'boolean'
				? parsed.showArrows
				: true ),
		arrowStyle,
		arrowPosition,
		showPagination:
			hasMultipleSlides &&
			( typeof parsed.showPagination === 'boolean'
				? parsed.showPagination
				: true ),
		paginationStyle: normalizeChoice(
			parsed.paginationStyle,
			[
				'dots',
				'fraction',
				'timed-fraction',
				'timed-segments',
			] as const,
			'dots'
		),
		paginationPosition: normalizeChoice(
			parsed.paginationPosition,
			[ 'bottom-left', 'bottom-center', 'bottom-right' ] as const,
			'bottom-center'
		),
		transitionStyle: normalizeChoice(
			parsed.transitionStyle,
			[ 'directional-wipe', 'fade', 'slide', 'zoom-out' ] as const,
			parsed.effect === 'fade' ? 'fade' : 'directional-wipe'
		),
		transitionDuration: normalizeGovernedTime(
			parsed.transitionDuration,
			SLIDER_TRANSITION_TIME
		),
		heightPreset: normalizeChoice(
			parsed.heightPreset,
			[
				'default',
				'content',
				'medium',
				'tall',
				'viewport-below-header',
			] as const,
			'default'
		),
		slidesPerView: clampInteger( parsed.slidesPerView, 1, 1, 4 ),
		responsiveSlides:
			parsed.responsiveSlides === '3-2-1' ? '3-2-1' : 'uniform',
		slideCount,
		enableParallax: typeof parsed.enableParallax === 'boolean' ? parsed.enableParallax : false,
		parallaxIntensity: normalizeChoice(
			parsed.parallaxIntensity,
			[ 'subtle', 'medium', 'strong' ] as const,
			'medium'
		),
		parallaxAdvanced:
			typeof parsed.parallaxAdvanced === 'boolean'
				? parsed.parallaxAdvanced
				: false,
		parallaxDepth: normalizeChoice(
			parsed.parallaxDepth,
			[ 'both', 'translate', 'scale' ] as const,
			'both'
		),
		parallaxDirection: normalizeChoice(
			parsed.parallaxDirection,
			[ 'horizontal', 'vertical' ] as const,
			'horizontal'
		),
		parallaxTranslate: clampInteger( parsed.parallaxTranslate, 30, 0, 80 ),
		parallaxScale: clampNumber( parsed.parallaxScale, 1.12, 1, 2 ),
		parallaxInset: clampInteger( parsed.parallaxInset, 35, 0, 80 ),
	};
}

function formatSlideNumber( value: number ) {
	return String( value ).padStart( 2, '0' );
}

function renderFraction(
	swiper: Swiper,
	total: number,
	timed: boolean
) {
	const current = Math.min( total, swiper.realIndex + 1 );
	const timer = timed
		? '<span aria-hidden="true" class="skvn-slider__timer"><span class="skvn-slider__timer-fill"></span></span>'
		: '<span aria-hidden="true" class="skvn-slider__fraction-separator">/</span>';

	return [
		`<span class="skvn-slider__fraction-current">${ formatSlideNumber(
			current
		) }</span>`,
		timer,
		`<span class="skvn-slider__fraction-total">${ formatSlideNumber(
			total
		) }</span>`,
	].join( '' );
}

function renderSegments( total: number ) {
	return Array.from(
		{ length: total },
		( _, index ) =>
			`<button class="swiper-pagination-bullet" data-skvn-slide-index="${ index }" type="button"></button>`
	).join( '' );
}

function setPaginationA11y(
	slider: SliderElement,
	swiper: Swiper,
	total: number
) {
	slider
		.querySelectorAll< HTMLButtonElement >(
			'.skvn-slider__pagination .swiper-pagination-bullet'
		)
		.forEach( ( bullet, index ) => {
			bullet.setAttribute(
				'aria-label',
				sprintf(
					__( 'Go to slide %d', 'skvn-marine-blocks' ),
					index + 1
				)
			);
			bullet.classList.toggle(
				'swiper-pagination-bullet-active',
				index === swiper.realIndex % total
			);

			if ( index === swiper.realIndex % total ) {
				bullet.setAttribute( 'aria-current', 'true' );
			} else {
				bullet.removeAttribute( 'aria-current' );
			}
		} );
}

function initSlider( slider: SliderElement ): void {
		if ( slider.classList.contains( 'skvn-slider--editor' ) ) {
			return;
		}

		if ( slider.swiper?.destroyed ) {
			slider.skvnSliderCleanup?.();
			delete slider.swiper;
		}

		if (
			slider.swiper ||
			slider.dataset.skvnSliderInitialized === 'true'
		) {
			return;
		}

		const wrapper = slider.querySelector( '.swiper-wrapper' );
		const realSlideCount =
			wrapper?.querySelectorAll( ':scope > .swiper-slide' ).length ?? 0;
		const rawConfig = slider.getAttribute( 'data-skvn-slider' ) || '{}';
		const config = parseSliderConfig( rawConfig, realSlideCount );

		// Apply style/position classes that save.tsx omits — read from JSON config.
		const controlsEl = slider.querySelector< HTMLElement >( '.skvn-slider__controls' );
		const arrowsEl = slider.querySelector< HTMLElement >( '.skvn-slider__arrows' );
		const paginEl = slider.querySelector< HTMLElement >( '.swiper-pagination' );
		if ( arrowsEl && config.showArrows ) {
			arrowsEl.classList.add(
				`skvn-slider__arrows--${ config.arrowStyle }`,
				`skvn-slider__arrows--${ config.arrowPosition }`
			);
		}
		if ( paginEl && config.showPagination ) {
			paginEl.classList.add(
				`skvn-slider__pagination--${ config.paginationStyle }`,
				`skvn-slider__pagination--${ config.paginationPosition }`
			);
		}
		const useFlankCluster =
			config.showArrows &&
			config.showPagination &&
			config.slideCount > 1 &&
			config.arrowPosition === 'bottom-center' &&
			config.paginationPosition === 'bottom-center' &&
			config.arrowStyle !== 'pill';
		const controlsCluster =
			config.showArrows &&
			config.showPagination &&
			config.arrowPosition !== 'side-center' &&
			config.arrowPosition === config.paginationPosition;
		if ( controlsEl && controlsCluster ) {
			controlsEl.classList.add(
				'skvn-slider__controls--cluster',
				`skvn-slider__controls--${ config.arrowPosition }`
			);
			if ( useFlankCluster ) {
				controlsEl.classList.add(
					'skvn-slider__controls--cluster-flank',
					`skvn-slider__controls--arrows-${ config.arrowStyle }`
				);
			} else if (
				arrowsEl &&
				paginEl &&
				! controlsEl.querySelector( '.skvn-slider__controls-separator' )
			) {
				const sep = document.createElement( 'span' );
				sep.setAttribute( 'aria-hidden', 'true' );
				sep.className = 'skvn-slider__controls-separator';
				arrowsEl.after( sep );
			}
		}

		const usesCardBreakpoints = config.responsiveSlides === '3-2-1';
		const reducedMotion = prefersReducedMotion();
		const shouldParallax = config.enableParallax && ! reducedMotion && config.slidesPerView === 1;
		const transitionStyle = reducedMotion
			? 'fade'
			: config.transitionStyle;
		const paginationElement =
			slider.querySelector< HTMLElement >( '.swiper-pagination' );
		const timedPagination =
			config.paginationStyle === 'timed-fraction' ||
			config.paginationStyle === 'timed-segments';
		const syncViewportHeight = ( swiperInstance?: Swiper ) => {
			if ( config.heightPreset !== 'viewport-below-header' ) {
				return;
			}

			const header = document.querySelector< HTMLElement >(
				'#masthead, .site-header'
			);
			const adminBar = document.querySelector< HTMLElement >(
				'#wpadminbar'
			);
			const offset =
				( header?.getBoundingClientRect().height ?? 0 ) +
				( adminBar?.getBoundingClientRect().height ?? 0 );

			slider.style.setProperty(
				'--skvn-slider-viewport-offset',
				`${ Math.max( 0, Math.round( offset ) ) }px`
			);

			const activeSwiper = swiperInstance ?? slider.swiper;
			if ( activeSwiper && ! activeSwiper.destroyed ) {
				activeSwiper.updateSize();
				activeSwiper.updateSlides();
			}
		};
		syncViewportHeight();
		const publishReady = () => {
			if ( config.slideCount > 1 && ( ! slider.swiper?.initialized || slider.swiper.destroyed ) ) {
				return;
			}
			const box = slider.getBoundingClientRect();
			const slide = slider.querySelector< HTMLElement >( '.skvn-slide' );
			if ( box.width <= 0 || box.height <= 0 || ! slide || slide.getBoundingClientRect().width <= 0 ) {
				return;
			}
			slider.dataset.skvnSliderReady = 'true';
			slider.dispatchEvent( new Event( 'skvn:slider-ready', { bubbles: true } ) );
		};
		// Optional document lifecycle gate. No theme/loader means normal autoplay.
		const loaderActive = () => {
			const root = document.documentElement;
			return root.hasAttribute( 'data-skvn-loading' ) &&
				Number( root.dataset.skvnLoadingUntil ) > Date.now();
		};

		if ( config.slideCount <= 1 ) {
			slider.classList.add( 'skvn-slider--static' );
			window.requestAnimationFrame( publishReady );
			return;
		}

		slider.dataset.skvnSliderInitialized = 'true';
		slider.classList.add( 'skvn-slider--initialized' );
		slider.classList.toggle(
			'skvn-slider--reduced-motion',
			reducedMotion
		);
		slider.classList.add(
			`skvn-slider--transition-${ transitionStyle }`
		);
		slider.style.setProperty(
			'--skvn-slider-transition-duration',
			`${ config.transitionDuration }ms`
		);

		window.addEventListener( 'resize', syncViewportHeight );

		// Swiper 11 loop mode does not create DOM clones (rearrangement /
		// loopFix only). Inject data attrs BEFORE new Swiper() so the Parallax
		// module reads them on init. Resting inset stays 0 (plan 070): a
		// negative inset zooms the still image. Scale during the move covers
		// the translate instead.
		slider.style.removeProperty( '--skvn-parallax-inset' );
		if ( reducedMotion ) {
			slider.classList.remove( 'skvn-slider--parallax' );
		} else if ( shouldParallax ) {
			const presetTranslate = {
				subtle: 15,
				medium: 30,
				strong: 50,
			} as const;
			const presetScale = {
				subtle: 1.3,
				medium: 1.6,
				strong: 2,
			} as const;
			const intensity = config.parallaxIntensity;
			const advanced = config.parallaxAdvanced;
			const depth = advanced ? config.parallaxDepth : 'both';
			const direction = advanced
				? config.parallaxDirection
				: 'horizontal';
			const translateMag = advanced
				? config.parallaxTranslate
				: presetTranslate[ intensity ];
			const chosenScale = advanced
				? config.parallaxScale
				: presetScale[ intensity ];
			const includeTranslate = depth !== 'scale';
			// Plan 072: Translate only must not zoom. The cover-scale floor
			// stays on Both (and on intensity presets, which use Both).
			const includeScale = depth !== 'translate';
			const coverScale =
				Math.round( ( 1 + 2 * ( translateMag / 100 ) ) * 100 ) / 100;
			const scaleVal =
				depth === 'both'
					? Math.max( chosenScale, coverScale )
					: chosenScale;
			const axis = direction === 'vertical' ? 'y' : 'x';
			const durationMs = String( config.transitionDuration );

			slider
				.querySelectorAll< HTMLElement >( '.skvn-slide__bg' )
				.forEach( ( bg ) => {
					bg.removeAttribute( 'data-swiper-parallax' );
					bg.removeAttribute( 'data-swiper-parallax-x' );
					bg.removeAttribute( 'data-swiper-parallax-y' );
					bg.removeAttribute( 'data-swiper-parallax-scale' );
					bg.removeAttribute( 'data-swiper-parallax-duration' );

					if ( includeTranslate ) {
						bg.setAttribute(
							`data-swiper-parallax-${ axis }`,
							`-${ translateMag }%`
						);
					}

					if ( includeScale ) {
						bg.setAttribute(
							'data-swiper-parallax-scale',
							scaleVal.toFixed( 2 )
						);
					}

					// Keep parallax transition in phase with slide speed
					// (avoids desync / stutter on loopFix and manual nav).
					bg.setAttribute(
						'data-swiper-parallax-duration',
						durationMs
					);
				} );

			slider.classList.add( 'skvn-slider--parallax' );
		}

		try {
			const pagination =
				config.showPagination && paginationElement
					? config.paginationStyle === 'timed-segments'
						? false
						: config.paginationStyle === 'fraction' ||
					  config.paginationStyle === 'timed-fraction'
						? {
								el: paginationElement,
								renderCustom: ( swiper: Swiper ) =>
									renderFraction(
										swiper,
										config.slideCount,
										config.paginationStyle ===
											'timed-fraction'
									),
								type: 'custom' as const,
						  }
						: {
								bulletElement: 'button',
								clickable: true,
								el: paginationElement,
								type: 'bullets' as const,
						  }
					: false;
			const swiper = new Swiper( slider, {
				modules: [
					A11y,
					Autoplay,
					EffectFade,
					Keyboard,
					Navigation,
					Pagination,
					Parallax,
				],
				a11y: {
					containerRoleDescriptionMessage: __(
						'Content slider',
						'skvn-marine-blocks'
					),
					nextSlideMessage: __(
						'Next slide',
						'skvn-marine-blocks'
					),
					prevSlideMessage: __(
						'Previous slide',
						'skvn-marine-blocks'
					),
					slideLabelMessage: __(
						'{{index}} of {{slidesLength}}',
						'skvn-marine-blocks'
					),
				},
				autoplay:
					config.autoplay && ! reducedMotion
						? {
								enabled: ! loaderActive(),
								delay: config.autoplayDelay,
								disableOnInteraction: false,
								pauseOnMouseEnter: false,
								stopOnLastSlide: ! config.loop,
						  }
						: false,
				effect:
					transitionStyle === 'fade' ||
					transitionStyle === 'zoom-out'
						? 'fade'
						: 'slide',
				fadeEffect: {
					crossFade: true,
				},
				parallax: shouldParallax,
				speed: config.transitionDuration,
				keyboard: { enabled: true },
				loop: config.loop,
				navigation: config.showArrows
					? {
							nextEl: slider.querySelector< HTMLElement >(
								'.swiper-button-next'
							),
							prevEl: slider.querySelector< HTMLElement >(
								'.swiper-button-prev'
							),
					  }
					: false,
				pagination,
				breakpoints: usesCardBreakpoints
					? {
							600: { slidesPerView: 2 },
							1024: { slidesPerView: 3 },
					  }
					: undefined,
				slidesPerView: usesCardBreakpoints
					? 1
					: config.slidesPerView,
			} );
			syncViewportHeight( swiper );

			let pauseCoordinator: AutoplayPauseCoordinator | undefined;
			let cleaned = false;
			let previousRealIndex = 0;
			let loaderTimer: number | undefined;
			const readyFrame = window.requestAnimationFrame( publishReady );

			const resetProgress = () => {
				slider.style.setProperty( '--skvn-slider-progress', '0' );
			};
			const syncAutoplay = () => {
				if (
					! config.autoplay ||
					reducedMotion ||
					loaderActive() ||
					pauseCoordinator?.isPaused()
				) {
					swiper.autoplay?.pause();
					return;
				}

				if ( ! config.loop && swiper.isEnd ) {
					swiper.autoplay?.stop();
					return;
				}

				if ( typeof swiper.params.autoplay === 'object' ) {
					swiper.params.autoplay.enabled = true;
				}
				if ( swiper.autoplay && ! swiper.autoplay.running ) {
					swiper.autoplay.start();
				} else {
					swiper.autoplay?.resume();
				}
			};
			const updatePaginationA11y = () => {
				setPaginationA11y(
					slider,
					swiper,
					config.slideCount
				);
			};
			const handleRealIndexChange = () => {
				const direction = swiper.swipeDirection === 'prev'
					? 'previous'
					: swiper.swipeDirection === 'next'
						? 'next'
						: swiper.realIndex >= previousRealIndex
							? 'next'
							: 'previous';
				slider.dataset.skvnDirection = direction;
				previousRealIndex = swiper.realIndex;
				resetProgress();

				if (
					config.paginationStyle === 'fraction' ||
					config.paginationStyle === 'timed-fraction'
				) {
					if ( paginationElement ) {
						paginationElement.innerHTML = renderFraction(
							swiper,
							config.slideCount,
							config.paginationStyle === 'timed-fraction'
						);
					}
				} else if (
					config.paginationStyle === 'timed-segments' &&
					paginationElement &&
					! paginationElement.hasChildNodes()
				) {
					paginationElement.innerHTML = renderSegments(
						config.slideCount
					);
				}

				updatePaginationA11y();
			};
			const handleTransitionStart = () => {
				if ( transitionStyle === 'directional-wipe' ) {
					slider.classList.add( 'skvn-slider--transitioning' );
				}
			};
			const handleTransitionEnd = () => {
				slider.classList.remove( 'skvn-slider--transitioning' );
			};
			const handlePaginationClick = ( event: MouseEvent ) => {
				const target = event.target;
				const paginationButton =
					target instanceof HTMLElement
						? target.closest< HTMLButtonElement >(
								'.swiper-pagination-bullet'
						  )
						: null;

				if (
					paginationButton?.getAttribute( 'aria-current' ) ===
					'true'
				) {
					event.preventDefault();
					event.stopImmediatePropagation();
					return;
				}

				if (
					config.paginationStyle === 'timed-segments' &&
					paginationButton
				) {
					const index = Number(
						paginationButton.dataset.skvnSlideIndex
					);

					if ( Number.isInteger( index ) ) {
						event.preventDefault();
						event.stopImmediatePropagation();
						handleInteractionStart();

						if ( config.loop ) {
							swiper.slideToLoop( index );
						} else {
							swiper.slideTo( index );
						}

						handleManualNavigation();
					}
				}
			};
			const handleInteractionStart = () => {
				pauseCoordinator?.setPauseReason( 'interaction', true );
			};
			const handleInteractionEnd = () => {
				pauseCoordinator?.setPauseReason( 'interaction', false );
				resetProgress();
			};
			const handleManualNavigation = () => {
				pauseCoordinator?.setPauseReason( 'interaction', false );
				resetProgress();
				syncAutoplay();
			};
			const handleAutoplayTimeLeft = (
				_instance: Swiper,
				_timeLeft: number,
				percentage: number
			) => {
				if ( ! timedPagination || reducedMotion ) {
					return;
				}

				slider.style.setProperty(
					'--skvn-slider-progress',
					String(
						Math.min( 1, Math.max( 0, 1 - percentage ) )
					)
				);
			};
			const cleanup = () => {
				if ( cleaned ) {
					return;
				}

				cleaned = true;
				window.cancelAnimationFrame( readyFrame );
				window.clearTimeout( loaderTimer );
				window.removeEventListener( 'skvn:loading-released', releaseLoader );
				delete slider.dataset.skvnSliderReady;
				pauseCoordinator?.cleanup();
				paginationElement?.removeEventListener(
					'click',
					handlePaginationClick,
					true
				);
				window.removeEventListener( 'resize', syncViewportHeight );
				swiper.off( 'autoplayTimeLeft', handleAutoplayTimeLeft );
				swiper.off( 'navigationNext', handleManualNavigation );
				swiper.off( 'navigationPrev', handleManualNavigation );
				swiper.off( 'paginationUpdate', updatePaginationA11y );
				swiper.off( 'realIndexChange', handleRealIndexChange );
				swiper.off( 'transitionStart', handleTransitionStart );
				swiper.off( 'transitionEnd', handleTransitionEnd );
				swiper.off( 'sliderFirstMove', handleInteractionStart );
				swiper.off( 'touchEnd', handleInteractionEnd );

				if ( ! swiper.destroyed ) {
					swiper.destroy( true, true );
				}

				delete slider.skvnSliderCleanup;
				delete slider.dataset.skvnSliderInitialized;
				slider.classList.remove(
					'skvn-slider--initialized',
					'skvn-slider--transitioning'
				);
				slider.style.removeProperty( '--skvn-slider-progress' );
				slider.style.removeProperty(
					'--skvn-slider-transition-duration'
				);
				slider.style.removeProperty(
					'--skvn-slider-viewport-offset'
				);
				slider.style.removeProperty( '--skvn-parallax-inset' );
				slider.classList.remove( 'skvn-slider--parallax' );
				delete slider.dataset.skvnDirection;

				if ( slider.swiper?.destroyed ) {
					delete slider.swiper;
				}
			};

			pauseCoordinator = createAutoplayPauseCoordinator( slider, {
				onPause: syncAutoplay,
				onResume: syncAutoplay,
			} );
			function releaseLoader() {
				if ( cleaned ) { return; }
				pauseCoordinator?.setPauseReason( 'loader', false );
				syncAutoplay();
			}
			if ( loaderActive() ) {
				pauseCoordinator.setPauseReason( 'loader', true );
				window.addEventListener( 'skvn:loading-released', releaseLoader );
				// A broken theme script cannot leave the plugin permanently paused.
				loaderTimer = window.setTimeout( releaseLoader,
					Math.max( 0, Number( document.documentElement.dataset.skvnLoadingUntil ) - Date.now() ) + 50 );
			}
			paginationElement?.addEventListener(
				'click',
				handlePaginationClick,
				true
			);
			swiper.on( 'autoplayTimeLeft', handleAutoplayTimeLeft );
			swiper.on( 'navigationNext', handleManualNavigation );
			swiper.on( 'navigationPrev', handleManualNavigation );
			swiper.on( 'paginationUpdate', updatePaginationA11y );
			swiper.on( 'realIndexChange', handleRealIndexChange );
			swiper.on( 'transitionStart', handleTransitionStart );
			swiper.on( 'transitionEnd', handleTransitionEnd );
			swiper.on( 'sliderFirstMove', handleInteractionStart );
			swiper.on( 'touchEnd', handleInteractionEnd );
			slider.skvnSliderCleanup = cleanup;
			swiper.on( 'destroy', cleanup );
			resetProgress();
			handleRealIndexChange();
			syncAutoplay();
		} catch {
			window.removeEventListener( 'resize', syncViewportHeight );
			slider.skvnSliderCleanup?.();
			delete slider.dataset.skvnSliderInitialized;
			slider.classList.remove( 'skvn-slider--initialized' );
		}
}

document
	.querySelectorAll< SliderElement >( '[data-skvn-slider]' )
	.forEach( initSlider );

// Gutenberg (apiVersion 3) replaces the slider DOM element on every attribute
// change without reloading the script. The observer tears down the orphaned
// Swiper on the removed element and initialises the fresh replacement so
// instances never accumulate across edit cycles.
const sliderObserver = new MutationObserver( ( mutations ) => {
	for ( const mutation of mutations ) {
		Array.from( mutation.removedNodes ).forEach( ( node ) => {
			if ( ! ( node instanceof HTMLElement ) ) {
				return;
			}

			if ( node.matches( '[data-skvn-slider]' ) ) {
				( node as SliderElement ).skvnSliderCleanup?.();
			}

			node
				.querySelectorAll< SliderElement >( '[data-skvn-slider]' )
				.forEach( ( s ) => s.skvnSliderCleanup?.() );
		} );

		Array.from( mutation.addedNodes ).forEach( ( node ) => {
			if ( ! ( node instanceof HTMLElement ) ) {
				return;
			}

			if ( node.matches( '[data-skvn-slider]' ) ) {
				initSlider( node as SliderElement );
			}

			node
				.querySelectorAll< SliderElement >( '[data-skvn-slider]' )
				.forEach( initSlider );
		} );
	}
} );

sliderObserver.observe( document.body, { childList: true, subtree: true } );
