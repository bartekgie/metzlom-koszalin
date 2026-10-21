/* =====================================================
   METZŁOM – Custom Animations JS
   v1.0 | 2025
   ===================================================== */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------
     PAGE EXIT TRANSITION
     Fades current page out when user clicks an internal
     link, then navigates to the next page.
  --------------------------------------------------- */
  function initPageTransition() {
    document.querySelectorAll('a[href]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (
        !href ||
        href.charAt(0) === '#' ||
        href.indexOf('javascript:') === 0 ||
        href.indexOf('tel:') === 0 ||
        href.indexOf('mailto:') === 0 ||
        href.indexOf('http://') === 0 ||
        href.indexOf('https://') === 0 ||
        link.hasAttribute('download') ||
        link.getAttribute('target') === '_blank'
      ) {
        return;
      }

      link.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
          return;
        }

        var target = this.getAttribute('href');
        e.preventDefault();
        document.body.classList.add('mtz-is-leaving');
        setTimeout(function () {
          window.location.href = target;
        }, 260);
      });
    });
  }

  /* ---------------------------------------------------
     SCROLL-TRIGGERED ANIMATIONS
     Uses IntersectionObserver to reveal elements as
     they enter the viewport.
  --------------------------------------------------- */
  function initScrollAnimations() {
    if (prefersReducedMotion) return;

    /* Fix Webflow opacity:0 inline styles so our
       animations can take over cleanly */
    var webflowHidden = [
      '[data-w-id="7d0a280b-5bf4-c690-c8ae-e6b5941f89f8"]',
      '[data-w-id="93672c37-2cf1-0860-0f85-d8246314cb98"]',
      '[data-w-id="4416e339-b1f2-6cf0-a80c-b02c9ecd8bc3"]'
    ];

    webflowHidden.forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.style.opacity = '';
    });

    /* Define which elements get which animation */
    var targets = [
      /* ---- index.html: trust + values sections ---- */
      {
        sel: '[data-w-id="7d0a280b-5bf4-c690-c8ae-e6b5941f89f8"]',
        dir: 'mtz-from-bottom'
      },
      {
        sel: '.section-4 .values .paragraph',
        dir: 'mtz-from-left'
      },
      {
        sel: '.section-4 .photo',
        dir: 'mtz-from-right'
      },
      {
        sel: '[data-w-id="93672c37-2cf1-0860-0f85-d8246314cb98"]',
        dir: 'mtz-from-bottom'
      },
      /* ---- value cards ---- */
      {
        sel: '.div-block-14',
        dir: 'mtz-from-bottom'
      },
      /* ---- index.html: CTA section ---- */
      {
        sel: '[data-w-id="4416e339-b1f2-6cf0-a80c-b02c9ecd8bc3"]',
        dir: 'mtz-from-bottom'
      },
      {
        sel: '.cta .p1-cta',
        dir: 'mtz-from-bottom'
      },
      {
        sel: '.cta .div-block-20',
        dir: 'mtz-from-bottom'
      },
      /* ---- subpages: info--section--text ---- */
      {
        sel: '.info--section--text .h2',
        dir: 'mtz-from-left'
      },
      {
        sel: '.info--section--text .paragraph',
        dir: 'mtz-from-bottom'
      },
      {
        sel: '.info--section--text .footer-block',
        dir: 'mtz-from-bottom'
      },
      /* ---- projekty-eu ---- */
      {
        sel: '.info--section--text.is--no--bottom .paragraph',
        dir: 'mtz-from-bottom'
      },
      /* footer: no scroll animations */
    ];

    /* Apply classes to elements */
    targets.forEach(function (item) {
      document.querySelectorAll(item.sel).forEach(function (el) {
        el.classList.add('mtz-animate', item.dir);
      });
    });

    /* Stagger value cards (pairs appear together, rows stagger) */
    document.querySelectorAll('.div-block-16').forEach(function (row, rowIdx) {
      row.querySelectorAll('.div-block-14').forEach(function (card, cardIdx) {
        var delay = rowIdx * 2 + cardIdx + 1;
        card.classList.add('mtz-delay-' + Math.min(delay, 6));
      });
    });

    /* Stagger paragraphs on subpages */
    document.querySelectorAll('.info--section--text .paragraph').forEach(function (el, i) {
      el.classList.add('mtz-delay-' + Math.min(i + 1, 4));
    });



    /* Stagger subpage info headings */
    document.querySelectorAll('.info--section--text .h2').forEach(function (el, i) {
      el.classList.add('mtz-delay-' + (i === 0 ? '1' : Math.min(i * 2, 6)));
    });

    /* IntersectionObserver */
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('mtz-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    document.querySelectorAll('.mtz-animate').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------
     CTA PARALLAX
     Shifts the background image of .div-block-18
     (the CTA section background) on scroll.
  --------------------------------------------------- */
  function initParallax() {
    if (prefersReducedMotion) return;

    var ctaBg = document.querySelector('.div-block-18');
    if (!ctaBg) return;

    var ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          var rect = ctaBg.getBoundingClientRect();
          var winH = window.innerHeight;

          if (rect.bottom > 0 && rect.top < winH) {
            var progress = (winH - rect.top) / (winH + rect.height);
            var offset = (progress - 0.5) * 100;
            ctaBg.style.backgroundPositionY = 'calc(50% + ' + offset + 'px)';
          }

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------
     BUTTON RIPPLE EFFECT
     Creates a circular wave on button clicks.
  --------------------------------------------------- */
  function initRipple() {
    document.querySelectorAll('.button, .button-cta').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var rect = this.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height) * 2;
        var x = e.clientX - rect.left - size / 2;
        var y = e.clientY - rect.top - size / 2;

        var ripple = document.createElement('span');
        ripple.classList.add('mtz-ripple');
        ripple.style.cssText =
          'width:' + size + 'px;' +
          'height:' + size + 'px;' +
          'left:' + x + 'px;' +
          'top:' + y + 'px;';

        this.appendChild(ripple);

        setTimeout(function () {
          if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
        }, 700);
      });
    });
  }

  /* ---------------------------------------------------
     INIT
  --------------------------------------------------- */
  function init() {
    if (!prefersReducedMotion) {
      initPageTransition();
    }
    initScrollAnimations();
    initParallax();
    initRipple();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
