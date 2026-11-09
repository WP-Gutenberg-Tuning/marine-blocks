/* Marine menu drawer, part of the shared theme runtime.
 * sync-preview.mjs refreshes the standalone example copy from this section.
 * Gutenberg editor keeps the original editable blocks and is never moved. */
(() => {
  function init() {
    document.querySelectorAll('.marine-menu-demo').forEach((root, index) => {
      if (root.closest('.editor-styles-wrapper') || root.dataset.drawerReady) return;
      const links = root.querySelector('.marine-menu-links');
      const cta = root.querySelector('.marine-menu-cta')?.closest('.wp-block-buttons');
      if (!links || !cta || typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;
      root.dataset.drawerReady = 'true';
      const translate = window.wp?.i18n?.__ || (text => text);
      const mobile = matchMedia('(width < 768px)');
      const reduced = matchMedia('(prefers-reduced-motion: reduce)');
      const linksHome = document.createComment('menu original position');
      const ctaHome = document.createComment('cta original position');
      links.before(linksHome);
      cta.before(ctaHome);

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'marine-menu-toggle';
      toggle.textContent = `☰ ${translate('Menu', 'skvn-marine')}`;
      toggle.setAttribute('aria-haspopup', 'dialog');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.hidden = true;
      linksHome.parentNode.append(toggle);

      const drawer = document.createElement('dialog');
      drawer.className = 'marine-menu-drawer';
      drawer.id = `marine-menu-drawer-${index}`;
      toggle.setAttribute('aria-controls', drawer.id);
      const top = document.createElement('div');
      top.className = 'marine-menu-drawer-top';
      const title = document.createElement('h2');
      title.id = `${drawer.id}-title`;
      title.textContent = translate('Menu', 'skvn-marine');
      drawer.setAttribute('aria-labelledby', title.id);
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'marine-menu-close';
      close.textContent = `${translate('Close', 'skvn-marine')} ×`;
      close.setAttribute('aria-label', translate('Close menu', 'skvn-marine'));
      top.append(title, close);
      drawer.append(top);
      root.append(drawer);

      let motion = null;
      let closing = false;
      let previousOverflow = null;
      function restoreScroll() {
        if (previousOverflow !== null) {
          document.body.style.overflowY = previousOverflow;
          previousOverflow = null;
        }
      }
      function finishClose(returnFocus = true) {
        motion?.cancel();
        motion = null;
        drawer.close();
        drawer.classList.remove('is-closing');
        toggle.setAttribute('aria-expanded', 'false');
        closing = false;
        restoreScroll();
        if (returnFocus && mobile.matches) toggle.focus();
      }
      function openDrawer() {
        if (drawer.open || !mobile.matches) return;
        drawer.showModal(); // Browser owns modal focus containment and inertness.
        toggle.setAttribute('aria-expanded', 'true');
        previousOverflow = document.body.style.overflowY;
        document.body.style.overflowY = 'hidden'; // Modal scroll lock, not geometry masking.
        close.focus();
        if (!reduced.matches && drawer.animate) {
          motion = drawer.animate(
            [{ transform: 'translateX(100%)', opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }],
            { duration: 240, easing: 'cubic-bezier(.2,.7,.2,1)' }
          );
        }
      }
      function closeDrawer() {
        if (!drawer.open || closing) return;
        closing = true;
        const { transform: start, opacity } = getComputedStyle(drawer);
        motion?.cancel();
        if (reduced.matches || !drawer.animate) { finishClose(); return; }
        drawer.classList.add('is-closing');
        motion = drawer.animate(
          [{ transform: start === 'none' ? 'translateX(0)' : start, opacity }, { transform: 'translateX(100%)', opacity: 0 }],
          { duration: 180, easing: 'ease-in', fill: 'forwards' }
        );
        motion.finished.then(() => finishClose()).catch(() => {});
      }
      function layout() {
        const focused = document.activeElement;
        const hadMenuFocus = links.contains(focused) || cta.contains(focused) || drawer.contains(focused) || focused === toggle;
        if (drawer.open) finishClose(false);
        toggle.hidden = !mobile.matches;
        if (mobile.matches) {
          drawer.append(links, cta); // Move, never clone IDs or duplicated nav links.
          if (hadMenuFocus) toggle.focus();
        } else {
          linksHome.after(links);
          ctaHome.after(cta);
          // If a focused drawer control was hidden by resize, focus real nav.
          if (hadMenuFocus) links.querySelector('summary, a')?.focus();
        }
      }
      toggle.addEventListener('click', openDrawer);
      close.addEventListener('click', closeDrawer);
      drawer.addEventListener('cancel', event => { event.preventDefault(); closeDrawer(); });
      drawer.addEventListener('click', event => {
        const rect = drawer.getBoundingClientRect();
        if (event.target === drawer && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeDrawer();
        else if (event.target.closest('a[href]')) closeDrawer();
      });
      drawer.addEventListener('close', () => {
        toggle.setAttribute('aria-expanded', 'false');
        restoreScroll();
      });
      mobile.addEventListener('change', layout);
      reduced.addEventListener('change', () => {
        if (reduced.matches) {
          motion?.cancel();
          if (closing) finishClose();
        }
      });
      layout();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
