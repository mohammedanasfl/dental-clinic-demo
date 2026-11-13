/* Section choreography — one distinct pattern per section.
 *
 *   About        image mask-reveal + parallax, copy that reads itself in word by word
 *   Services     3D card flip-up (tilt + spotlight on hover, see app.js), marquee strip, banner wipe
 *   Appointment  full-width visual transition (island expands to the viewport)
 *   Dentists     cards fan out from a stack as you scroll (editorial image curtains)
 *   Contact      split-layout entrance (info from the left, form from the right)
 *   Footer       staggered columns, divider draws in, giant wordmark rises letter by letter
 *   Everywhere   line-drawn icons, page progress bar
 *
 * Everything is created inside gsap.matchMedia so it is reverted cleanly on
 * resize / breakpoint change, never duplicated, and skipped completely for
 * visitors who prefer reduced motion (content stays visible).
 */
(function () {
  'use strict';
  var DC = window.DentCare;
  if (!DC) return;
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;

  DC.initSections = function () {
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

    var mm = gsap.matchMedia();

    mm.add({
      desktop: '(min-width: 1024px)',
      wide: '(min-width: 1280px)',
      mobile: '(max-width: 1023px)',
      reduce: '(prefers-reduced-motion: reduce)'
    }, function (context) {
      var c = context.conditions;
      if (c.reduce) return; // everything stays visible and static

      var D = DC.dur, E = DC.ease, S = DC.stagger;
      var far = c.desktop ? 1 : 0.55; // smaller travel distances on small screens

      /* ---------- 1. headings: masked word reveal ---------- */
      $$('[data-split]').forEach(function (el) {
        if (el.id === 'hero-title') return; // hero has its own intro
        var words = DC.splitWords(el);
        gsap.set(words, { yPercent: 112 });
        DC.once(el, function () {
          gsap.to(words, { yPercent: 0, duration: D.cinematic, ease: E.out, stagger: S.tight });
        }, 'top 88%');
      });

      /* ---------- 2. grouped supporting copy ---------- */
      var groups = ['[data-head]', '[data-about-copy]', '[data-banner]', '[data-appt-copy]'];
      groups.forEach(function (sel) {
        $$(sel).forEach(function (group) {
          DC.riseIn($$('[data-a]', group), group, { y: 26 * far, delay: 0.2, start: 'top 82%' });
        });
      });
      $$('[data-a]').filter(function (el) {
        return !el.closest(groups.join(','));
      }).forEach(function (el) { DC.riseIn(el, el, { y: 24 * far, start: 'top 92%' }); });

      /* ---------- 3. ABOUT ---------- */
      var aboutImg = $('[data-about-img]');
      if (aboutImg) {
        var aImg = $('img', aboutImg);
        var note = $('[data-about-note]', aboutImg);
        gsap.set(aboutImg, { clipPath: 'inset(0% 100% 0% 0% round 16px)' });
        gsap.set(aImg, { scale: 1.4 });
        gsap.set(note, { opacity: 0, y: 30 });
        DC.once(aboutImg, function () {
          gsap.to(aboutImg, { clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1.25, ease: 'power4.inOut', clearProps: 'clipPath' });
          gsap.to(aImg, { scale: 1.12, duration: 1.7, ease: E.soft });
          gsap.to(note, { opacity: 1, y: 0, duration: D.reveal, ease: E.out, delay: 0.7, clearProps: 'transform' });
        }, 'top 82%');
        if (c.desktop) { // decorative parallax only
          gsap.fromTo(aImg, { yPercent: -5 }, {
            yPercent: 5, ease: 'none',
            scrollTrigger: { trigger: aboutImg, start: 'top bottom', end: 'bottom top', scrub: true }
          });
        }
      }
      DC.batchIn($$('[data-features] > *'), { y: 34 * far, scale: 0.97, start: 'top 92%' });

      // the lead paragraph "reads itself in" as you scroll through it
      var lead = $('.about__text .strong');
      if (lead) {
        var lw = DC.splitWords(lead);
        gsap.fromTo(lw, { opacity: 0.16 }, {
          opacity: 1, ease: 'none', stagger: 0.6,
          scrollTrigger: { trigger: lead, start: 'top 82%', end: 'bottom 52%', scrub: true }
        });
      }

      /* ---------- 4. SERVICES ---------- */
      DC.batchIn($$('[data-cards] > *'), {
        y: 90 * far, scale: 0.94, stagger: S.loose, start: 'top 92%',
        from: { rotationX: -24, transformOrigin: '50% 100%' }, to: { rotationX: 0 }
      });

      var bannerImg = $('[data-banner-img]');
      if (bannerImg) {
        var bImg = $('img', bannerImg);
        gsap.set(bannerImg, { clipPath: 'inset(0% 0% 0% 100% round 12px)' });
        gsap.set(bImg, { scale: 1.3 });
        DC.once(bannerImg, function () {
          gsap.to(bannerImg, { clipPath: 'inset(0% 0% 0% 0% round 12px)', duration: 1.2, ease: 'power4.inOut', clearProps: 'clipPath' });
          gsap.to(bImg, { scale: 1, duration: 1.6, ease: E.soft, clearProps: 'transform' });
        }, 'top 85%');
      }

      /* ---------- 5. APPOINTMENT: island expands to full width ---------- */
      var apptBg = $('[data-appt-bg]');
      if (apptBg) {
        var inset = c.desktop ? 'inset(7% 4% 7% 4% round 44px)' : 'inset(3% 3% 3% 3% round 28px)';
        gsap.fromTo(apptBg, { clipPath: inset }, {
          clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
          scrollTrigger: { trigger: '#appointment', start: 'top 95%', end: 'top 25%', scrub: 0.5 }
        });
        if (c.desktop) {
          $$('[data-appt-glow]').forEach(function (g, i) {
            gsap.fromTo(g, { yPercent: i ? 25 : -25 }, {
              yPercent: i ? -25 : 25, ease: 'none',
              scrollTrigger: { trigger: '#appointment', start: 'top bottom', end: 'bottom top', scrub: true }
            });
          });
        }
        var form = $('[data-appt-form]');
        DC.riseIn(form, form, { x: c.desktop ? 60 : 0, y: c.desktop ? 0 : 40, duration: D.cinematic, start: 'top 85%' });
      }

      /* ---------- 6. DENTISTS: editorial card reveals ---------- */
      var team = $('[data-team]');
      var cards = $$('[data-team] > .doc');
      cards.forEach(function (card) {
        gsap.set($('.doc__img', card), { clipPath: 'inset(100% 0% 0% 0%)' });
        gsap.set($('.doc__img img', card), { scale: 1.35 });
      });
      function curtain(batch) {
        batch.forEach(function (card, i) {
          gsap.to($('.doc__img', card), { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut', delay: 0.1 + i * S.loose, clearProps: 'clipPath' });
          gsap.to($('.doc__img img', card), { scale: 1, duration: 1.6, ease: E.soft, delay: 0.1 + i * S.loose, clearProps: 'transform' });
        });
      }
      if (c.wide) {
        // one row of five: the cards start stacked in the middle and fan out with the scroll
        var fan = gsap.timeline({
          scrollTrigger: { trigger: team, start: 'top 92%', end: 'top 36%', scrub: 0.8, invalidateOnRefresh: true }
        });
        cards.forEach(function (card, i) {
          fan.fromTo(card, {
            x: function () { return (team.offsetWidth / 2) - (card.offsetLeft - team.offsetLeft + card.offsetWidth / 2); },
            y: 80, rotation: (i - 2) * 7, scale: 0.84, opacity: 0, transformOrigin: '50% 100%'
          }, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, ease: 'power2.out', duration: 1 }, 0);
        });
        DC.once(team, function () { curtain(cards); }, 'top 80%');
      } else {
        DC.batchIn(cards, { y: 80 * far, stagger: S.loose, start: 'top 92%', onBatch: curtain });
      }

      /* ---------- 7. CONTACT: split-layout entrance ---------- */
      var info = $$('[data-contact-info] > .info');
      DC.batchIn(info, { x: c.desktop ? -50 : 0, y: c.desktop ? 0 : 30, start: 'top 90%' });
      var map = $('[data-map]');
      if (map) {
        gsap.set(map, { clipPath: 'inset(0% 0% 100% 0% round 16px)', opacity: 1 });
        DC.once(map, function () {
          gsap.to(map, { clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1.3, ease: 'power4.inOut', clearProps: 'clipPath' });
        }, 'top 90%');
      }
      var cform = $('[data-contact-form]');
      if (cform) {
        DC.riseIn(cform, cform, { x: c.desktop ? 60 : 0, y: c.desktop ? 0 : 40, duration: D.cinematic, start: 'top 88%' });
        DC.riseIn($$('.form-row, .field, .form-foot', cform).filter(function (el) { return !el.closest('.form-row') || el.classList.contains('form-row'); }), cform, { y: 18, stagger: 0.07, delay: 0.35, start: 'top 80%' });
      }

      /* ---------- 8. FOOTER: elegant close ---------- */
      DC.batchIn($$('[data-footer-grid] > *'), { y: 40 * far, stagger: S.base, start: 'top 95%' });
      var bottom = $('[data-footer-bottom]');
      if (bottom) {
        gsap.set(bottom, { '--line': 0 });
        gsap.set(bottom.children, { opacity: 0 });
        DC.once(bottom, function () {
          gsap.to(bottom, { '--line': 1, duration: 1.4, ease: E.out });
          gsap.to(bottom.children, { opacity: 1, duration: D.reveal, ease: 'power2.out', delay: 0.3, stagger: 0.12 });
        }, 'top 100%');
      }
      var mark = $('[data-footer-mark]');
      if (mark) {
        var mc = DC.splitChars(mark, { cls: 'ch' });
        gsap.set(mc, { yPercent: 110 });
        DC.once(mark, function () { gsap.to(mc, { yPercent: 0, duration: 1.5, ease: E.out, stagger: 0.07 }); }, 'top 100%');
      }

      /* ---------- 9. extras: phone roll-in, line-drawn icons, progress bar, marquee ---------- */
      var roll = $('[data-roll]');
      if (roll) {
        var rc = DC.splitChars(roll, { mask: true });
        gsap.set(rc, { yPercent: 115 });
        DC.once(roll, function () { gsap.to(rc, { yPercent: 0, duration: 1.1, ease: E.out, stagger: 0.05, delay: 0.25 }); }, 'top 88%');
      }

      var icons = $$('.feature__icon .ic, .card__icon .ic, .info__icon .ic, .checks .ic, .hotline__icon .ic');
      if (icons.length) {
        gsap.set(icons, { strokeDasharray: 100, strokeDashoffset: 100 });
        ScrollTrigger.batch(icons, {
          start: 'top 92%', once: true,
          onEnter: function (batch) {
            gsap.to(batch, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.08, delay: 0.4, clearProps: 'strokeDasharray,strokeDashoffset' });
          }
        });
      }

      gsap.to('.progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

      // marquee: drifts on its own, speeds up / reverses / skews with scroll velocity
      var track = $('[data-marquee-track]');
      var cleanup = null;
      if (track) {
        var half = 0, x = 0, vel = 1, targetVel = 1, skew = 0, skewT = 0, settle = null;
        var measure = function () { half = track.scrollWidth / 2; };
        measure();
        ScrollTrigger.addEventListener('refresh', measure);
        var tick = function (time, dt) {
          if (!half) return;
          vel += (targetVel - vel) * 0.08;
          skew += (skewT - skew) * 0.12;
          x -= 70 * vel * dt / 1000;
          if (x <= -half) x += half; else if (x > 0) x -= half;
          gsap.set(track, { x: x, skewX: skew });
        };
        gsap.ticker.add(tick);
        var st = ScrollTrigger.create({
          trigger: '[data-marquee]', start: 'top bottom', end: 'bottom top',
          onUpdate: function (self) {
            var v = self.getVelocity(), dir = self.direction || 1;
            targetVel = dir * (1 + Math.min(Math.abs(v) / 220, 9));
            skewT = gsap.utils.clamp(-9, 9, -v / 240);
            clearTimeout(settle);
            settle = setTimeout(function () { targetVel = dir; skewT = 0; }, 90);
          }
        });
        cleanup = function () { gsap.ticker.remove(tick); ScrollTrigger.removeEventListener('refresh', measure); clearTimeout(settle); st.kill(); };
      }
      return cleanup;
    });
  };
})();
