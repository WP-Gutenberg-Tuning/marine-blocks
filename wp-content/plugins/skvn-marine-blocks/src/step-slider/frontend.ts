import Swiper from 'swiper';
import { A11y, Autoplay, EffectFade, Keyboard, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import './style.css';

import { prefersReducedMotion } from '../shared/motion';

const roots = document.querySelectorAll( '.skvn-step-slider' );

const DWELL_DELAYS: Record< string, number > = {
	'5': 5000,
	'8': 8000,
	'10': 10000,
};

roots.forEach( ( root ) => {
	const viewport = root.querySelector< HTMLElement >( '.swiper' );
	const prevEl = root.querySelector< HTMLButtonElement >(
		'[data-skvn-step-dir="prev"]'
	);
	const nextEl = root.querySelector< HTMLButtonElement >(
		'[data-skvn-step-dir="next"]'
	);
	const playEl = root.querySelector< HTMLButtonElement >(
		'.skvn-step-slider__play'
	);
	const tabs = Array.from(
		root.querySelectorAll< HTMLButtonElement >( '.skvn-step-slider__tab' )
	);

	if ( ! viewport ) {
		return;
	}

	const reducedMotion = prefersReducedMotion();

	const autoplayWanted =
		root.getAttribute( 'data-autoplay' ) === '1' && ! reducedMotion;
	const dwellDelay =
		DWELL_DELAYS[ root.getAttribute( 'data-dwell' ) ?? '' ] ?? 8000;
	const loopWanted =
		root.getAttribute( 'data-loop' ) === '1' && tabs.length > 1;

	const progressEls = tabs.map( ( tab ) =>
		tab.querySelector< HTMLElement >( '.skvn-step-slider__tab-progress' )
	);

	// Our own transient pause stack: hover, hidden tab, root offscreen.
	const transient = {
		hover: false,
		hidden: false,
		offscreen: false,
	};
	let pausedByUs = false;
	let stoppedByFocus = false;

	try {
		const swiper = new Swiper( viewport, {
			modules: [ A11y, Autoplay, EffectFade, Keyboard, Navigation ],
			effect: 'fade',
			fadeEffect: { crossFade: true },
			speed: reducedMotion ? 0 : 800,
			loop: loopWanted,
			allowTouchMove: false,
			simulateTouch: false,
			autoHeight: true,
			keyboard: { enabled: true, onlyInViewport: true },
			navigation: {
				prevEl,
				nextEl,
			},
			autoplay: autoplayWanted
				? {
						delay: dwellDelay,
						disableOnInteraction: false,
						pauseOnMouseEnter: false,
						waitForTransition: true,
						stopOnLastSlide: ! loopWanted,
					}
				: false,
		} );

		const syncControls = () => {
			if ( prevEl ) {
				prevEl.disabled = ! loopWanted && swiper.isBeginning;
			}
			if ( nextEl ) {
				nextEl.disabled = ! loopWanted && swiper.isEnd;
			}
			tabs.forEach( ( tab, index ) => {
				const isActive = swiper.realIndex === index;
				tab.classList.toggle( 'is-active', isActive );
				if ( isActive ) {
					tab.setAttribute( 'aria-current', 'true' );
				} else {
					tab.removeAttribute( 'aria-current' );
					const span = progressEls[ index ];
					if ( span ) {
						span.style.width = '0%';
					}
				}
			} );
		};

		tabs.forEach( ( tab ) => {
			tab.addEventListener( 'click', () => {
				const index = Number( tab.getAttribute( 'data-skvn-step-index' ) );
				if ( Number.isFinite( index ) ) {
					swiper.slideTo( index );
				}
			} );
		} );

		swiper.on( 'slideChange', syncControls );
		syncControls();

		if ( autoplayWanted ) {
			const anyTransient = () =>
				transient.hover || transient.hidden || transient.offscreen;

			const applyPauseStack = () => {
				if ( stoppedByFocus || ! swiper.autoplay.running ) {
					return;
				}
				if ( anyTransient() && ! swiper.autoplay.paused ) {
					swiper.autoplay.pause();
					pausedByUs = swiper.autoplay.paused;
					return;
				}
				if ( ! anyTransient() && pausedByUs && swiper.autoplay.paused ) {
					swiper.autoplay.resume();
					pausedByUs = swiper.autoplay.paused;
				}
			};

			// Progress clock: width of the active tab span only.
			// First dwell starts at autoplayStart, later dwells at autoplayResume
			// (after the wrapper transitionend), so updates never run during fade.
			swiper.on( 'autoplayTimeLeft', ( _s, timeLeft ) => {
				if ( ! swiper.autoplay.running || swiper.autoplay.paused ) {
					return;
				}
				const span = progressEls[ swiper.realIndex ];
				if ( ! span ) {
					return;
				}
				const ratio = 1 - timeLeft / dwellDelay;
				const percent = Math.min( 100, Math.max( 0, ratio * 100 ) );
				span.style.width = percent + '%';
			} );

			// Swiper's own visibilitychange resume ignores hover and offscreen,
			// so re-pause right away when a transient condition still holds.
			swiper.on( 'autoplayResume', () => {
				if ( anyTransient() && ! swiper.autoplay.paused ) {
					swiper.autoplay.pause();
					pausedByUs = swiper.autoplay.paused;
				}
			} );

			root.addEventListener( 'pointerenter', ( event ) => {
				if ( event.pointerType === 'mouse' ) {
					transient.hover = true;
					applyPauseStack();
				}
			} );
			root.addEventListener( 'pointerleave', ( event ) => {
				if ( event.pointerType === 'mouse' ) {
					transient.hover = false;
					applyPauseStack();
				}
			} );

			document.addEventListener( 'visibilitychange', () => {
				transient.hidden = document.hidden;
				applyPauseStack();
			} );

			const observer = new IntersectionObserver( ( entries ) => {
				entries.forEach( ( entry ) => {
					transient.offscreen = entry.intersectionRatio === 0;
					applyPauseStack();
				} );
			} );
			observer.observe( root );

			// Focus into the root (tabs, arrows) stops autoplay and shows Play.
			// The Play button itself must not re-trigger the stop.
			if ( playEl ) {
				root.addEventListener( 'focusin', ( event ) => {
					const target = event.target;
					if ( target instanceof Node && playEl.contains( target ) ) {
						return;
					}
					stoppedByFocus = true;
					swiper.autoplay.stop();
					playEl.hidden = false;
				} );

				playEl.addEventListener( 'click', () => {
					stoppedByFocus = false;
					swiper.autoplay.start();
					playEl.hidden = true;
					// Hover still holds right after the click, so reconcile.
					applyPauseStack();
				} );
			}
		}

		root.classList.add( 'is-ready' );
	} catch {
		// Keep the steps stacked and readable without the runtime.
	}
} );
