/* ============================================================
   ANJALI'S 20TH BIRTHDAY SCRAPBOOK — script.js
   Vanilla JS — no dependencies
   ============================================================ */

'use strict';

/* ── Utility helpers ──────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── 1. COVER → SCRAPBOOK reveal ─────────────────────────── */
function initCoverReveal() {
  const cover    = $('#cover');
  const book     = $('#scrapbook');
  const openBtn  = $('#open-surprise-btn');

  if (!cover || !book || !openBtn) return;

  openBtn.addEventListener('click', () => {
    launchConfetti();
    cover.classList.add('hidden');
    cover.addEventListener('transitionend', () => {
      cover.style.display = 'none';
    }, { once: true });
    book.classList.add('visible');
    // Focus first heading after transition
    setTimeout(() => {
      const h2 = book.querySelector('h2, h1, [tabindex]');
      if (h2) h2.focus({ preventScroll: false });
    }, 900);
  });

  // Keyboard: Enter / Space
  openBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openBtn.click();
    }
  });
}

/* ── 2. SCROLL REVEAL ─────────────────────────────────────── */
function initScrollReveal() {
  if (prefersReducedMotion) {
    $$('.reveal').forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.07, 0.35)}s`;
    observer.observe(el);
  });
}

/* ── 3. PHOTO REVEAL (Childhood ↔ Current) ───────────────── */
function initPhotoReveal() {
  const stateChildhood = $('#photo-childhood');
  const stateCurrent   = $('#photo-current');
  const btnReveal      = $('#btn-reveal-current');
  const btnBack        = $('#btn-back-childhood');

  if (!stateChildhood || !stateCurrent) return;

  function showCurrent() {
    stateChildhood.classList.remove('active');
    stateCurrent.classList.add('active');
    if (btnReveal) btnReveal.setAttribute('aria-pressed', 'true');
    stateCurrent.querySelector('button, [tabindex]')?.focus();
  }

  function showChildhood() {
    stateCurrent.classList.remove('active');
    stateChildhood.classList.add('active');
    if (btnReveal) btnReveal.setAttribute('aria-pressed', 'false');
    stateChildhood.querySelector('button, [tabindex]')?.focus();
  }

  btnReveal?.addEventListener('click', showCurrent);
  btnBack?.addEventListener('click', showChildhood);

  // Keyboard support
  [btnReveal, btnBack].forEach(btn => {
    btn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });
}

/* ── 4. ENVELOPE LETTER ───────────────────────────────────── */
function initEnvelope() {
  const envelope   = $('#envelope');
  const openBtn    = $('#envelope-open-btn');
  const letter     = $('#letter-paper');
  const closeBtn   = $('#btn-close-letter');
  const rereadBtns = $$('.btn-reread-letter');
  let isOpen       = false;

  if (!envelope || !letter) return;

  function openLetter() {
    if (isOpen) return;
    isOpen = true;
    envelope.classList.add('open');
    envelope.setAttribute('aria-expanded', 'true');
    if (openBtn) {
      openBtn.textContent = '✓ Letter opened';
      openBtn.disabled = true;
    }
    // Animate letter in
    setTimeout(() => {
      letter.style.display = 'block';
      requestAnimationFrame(() => {
        letter.classList.add('visible');
        letter.setAttribute('aria-hidden', 'false');
        letter.querySelector('p, .letter-greeting')?.focus?.();
      });
    }, 420);
  }

  function closeLetter() {
    letter.classList.remove('visible');
    letter.setAttribute('aria-hidden', 'true');
    setTimeout(() => { letter.style.display = 'none'; }, 400);
    isOpen = false;
    envelope.classList.remove('open');
    envelope.setAttribute('aria-expanded', 'false');
    if (openBtn) {
      openBtn.textContent = 'Open your letter';
      openBtn.disabled = false;
    }
    envelope.focus();
  }

  envelope.addEventListener('click', openLetter);
  openBtn?.addEventListener('click', (e) => { e.stopPropagation(); openLetter(); });
  closeBtn?.addEventListener('click', closeLetter);

  rereadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Scroll to envelope section and open
      const letterSection = $('#section-letter');
      if (letterSection) {
        letterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setTimeout(() => {
        if (!isOpen) openLetter();
        else letter.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 600);
    });
  });

  // Keyboard
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLetter(); }
    if (e.key === 'Escape') closeLetter();
  });

  letter.setAttribute('aria-hidden', 'true');
  letter.setAttribute('aria-live', 'polite');
  letter.setAttribute('tabindex', '-1');
}

/* ── 5. LILY TOOLTIP (Cover) ──────────────────────────────── */
function initLilyTooltip() {
  const trigger = $('#lily-trigger');
  const tooltip = $('#lily-tooltip');
  if (!trigger || !tooltip) return;

  let shown = false;

  function toggle() {
    shown = !shown;
    tooltip.classList.toggle('visible', shown);
    trigger.setAttribute('aria-expanded', String(shown));
  }

  trigger.addEventListener('click', toggle);
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    if (e.key === 'Escape') { shown = false; tooltip.classList.remove('visible'); }
  });

  // Click outside
  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target)) {
      shown = false;
      tooltip.classList.remove('visible');
    }
  });
}

/* ── 6. MUSIC CONTROL ─────────────────────────────────────── */
function initMusic() {
  const audio    = $('#bg-audio');
  const musicBtn = $('#music-btn');
  const label    = $('#music-label');

  if (!musicBtn) return;

  // If no audio element or no src, just hide button gracefully
  if (!audio) {
    musicBtn.closest('.music-control')?.setAttribute('aria-hidden', 'true');
    return;
  }

  // Handle missing file gracefully
  audio.addEventListener('error', () => {
    musicBtn.closest('.music-control').style.display = 'none';
  });

  let playing = false;

  function updateUI() {
    musicBtn.classList.toggle('playing', playing);
    musicBtn.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
    musicBtn.innerHTML = playing
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v14l11-7-11-7z"/></svg>`;
    if (label) label.textContent = playing ? 'Pause music' : 'Play music';
  }

  musicBtn.addEventListener('click', async () => {
    if (!playing) {
      try {
        audio.volume = 0.45;
        await audio.play();
        playing = true;
      } catch (err) {
        // Autoplay blocked or file missing — fail silently
        console.warn('Audio could not play:', err.message);
        return;
      }
    } else {
      audio.pause();
      playing = false;
    }
    updateUI();
  });

  audio.addEventListener('ended', () => {
    playing = false;
    updateUI();
  });

  updateUI();
}

/* ── 7. CONFETTI ──────────────────────────────────────────── */
function launchConfetti() {
  if (prefersReducedMotion) return;

  const canvas = $('#confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.classList.add('active');

  const colors = ['#c9848a','#e8b4b8','#7a9b7e','#a8c4ac','#b8936a','#f5dde0','#d8e8da','#fff'];
  const pieces = Array.from({ length: 90 }, () => ({
    x:    Math.random() * canvas.width,
    y:    Math.random() * -canvas.height * 0.5 - 20,
    r:    Math.random() * 6 + 3,
    d:    Math.random() * 4 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    tilt: Math.random() * 10 - 5,
    tiltAngle: 0,
    tiltAngleInc: Math.random() * 0.07 + 0.05,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
    w:    Math.random() * 10 + 5,
    h:    Math.random() * 5 + 3,
  }));

  let frame;
  let elapsed = 0;
  const maxDuration = 3000;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.tiltAngle * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.85;
      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
      p.y += p.d;
      p.x += Math.sin(p.tiltAngle) * 1.5;
      p.tiltAngle += p.tiltAngleInc;
    });
  }

  let lastTime = performance.now();
  function animate(now) {
    elapsed += now - lastTime;
    lastTime = now;
    draw();
    if (elapsed < maxDuration) {
      frame = requestAnimationFrame(animate);
    } else {
      canvas.classList.remove('active');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  frame = requestAnimationFrame(animate);

  // Cleanup on resize
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame);
    canvas.classList.remove('active');
  }, { once: true });
}

/* ── 8. WISH NOTE flip animation ──────────────────────────── */
function initWishNotes() {
  if (prefersReducedMotion) return;
  $$('.wish-note').forEach(note => {
    note.addEventListener('click', () => {
      note.style.transform = 'scale(1.08) rotate(0deg)';
      setTimeout(() => { note.style.transform = ''; }, 300);
    });
  });
}

/* ── 9. PHOTO ERROR FALLBACK ──────────────────────────────── */
function initPhotoFallbacks() {
  $$('img[data-photo]').forEach(img => {
    img.addEventListener('error', () => {
      const wrap = img.closest('.polaroid-img-wrap');
      if (!wrap) return;
      img.style.display = 'none';
      const label = img.getAttribute('data-photo') === 'current'
        ? 'Add anjali-current.jpg\nto the assets/ folder'
        : 'Add anjali-childhood.jpg\nto the assets/ folder';
      let ph = wrap.querySelector('.photo-placeholder');
      if (!ph) {
        ph = document.createElement('div');
        ph.className = 'photo-placeholder';
        ph.innerHTML = `
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
          <span style="white-space:pre-line;font-size:0.82rem;">${label}</span>
        `;
        wrap.appendChild(ph);
      }
    });
  });
}

/* ── 10. SMOOTH NAV back to letter ───────────────────────── */
function initSmoothNav() {
  $$('[data-scroll-to]').forEach(el => {
    el.addEventListener('click', () => {
      const target = $(el.dataset.scrollTo);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── Init all ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCoverReveal();
  initScrollReveal();
  initPhotoReveal();
  initEnvelope();
  initLilyTooltip();
  initMusic();
  initWishNotes();
  initPhotoFallbacks();
  initSmoothNav();
});
