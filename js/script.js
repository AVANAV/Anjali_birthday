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
  const cover   = $('#cover');
  const book    = $('#scrapbook');
  const openBtn = $('#open-surprise-btn');

  if (!cover || !book || !openBtn) return;

  openBtn.addEventListener('click', () => {
    openBtn.disabled = true;
    launchConfetti();
    startHappyBirthday();
    cover.classList.add('hidden');
    cover.addEventListener('transitionend', () => {
      cover.style.display = 'none';
    }, { once: true });
    book.classList.add('visible');
    setTimeout(() => {
      const h2 = book.querySelector('h2, h1, [tabindex]');
      if (h2) h2.focus({ preventScroll: false });
    }, 900);
  });

  openBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBtn.click(); }
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

  [btnReveal, btnBack].forEach(btn => {
    btn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });
}

/* ── 4. ENVELOPE LETTER + LILY SHOWER ────────────────────── */
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
      openBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6L9 17l-5-5"/></svg> Letter opened`;
      openBtn.disabled = true;
    }

    // 🌸 Trigger white lily shower!
    launchLilyShower();

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
      openBtn.innerHTML = `Open your letter <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15l-9-9-9 9"/></svg>`;
      openBtn.disabled = false;
    }
    envelope.focus();
  }

  envelope.addEventListener('click', openLetter);
  openBtn?.addEventListener('click', (e) => { e.stopPropagation(); openLetter(); });
  closeBtn?.addEventListener('click', closeLetter);

  rereadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const letterSection = $('#section-letter');
      if (letterSection) letterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        if (!isOpen) openLetter();
        else letter.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 600);
    });
  });

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

  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target)) { shown = false; tooltip.classList.remove('visible'); }
  });
}

/* ══════════════════════════════════════════════════════════
   6. HAPPY BIRTHDAY SONG — Web Audio API synthesizer
   Plays the full "Happy Birthday to You" melody with a
   warm bell-like tone. No external file required.
   ══════════════════════════════════════════════════════════ */

/* Note frequency table */
const NOTE_FREQ = {
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
  'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46,
  'G5': 783.99, 'A5': 880.00,
  'C3': 130.81, 'G3': 196.00, 'A3': 220.00, 'D3': 146.83,
};

/*
  Happy Birthday to You — melody notes
  Each entry: [note, duration_in_beats, isRest?]
  BPM: 80  →  beat = 0.75s
*/
const HAPPY_BIRTHDAY = [
  // "Hap-py Birth-day to you"
  ['G4', 0.75], ['G4', 0.25], ['A4', 1],   ['G4', 1],   ['C5', 1],   ['B4', 2],
  // "Hap-py Birth-day to you"
  ['G4', 0.75], ['G4', 0.25], ['A4', 1],   ['G4', 1],   ['D5', 1],   ['C5', 2],
  // "Hap-py Birth-day dear An-ja-li"
  ['G4', 0.75], ['G4', 0.25], ['G5', 1],   ['E5', 1],   ['C5', 1],   ['B4', 1],   ['A4', 2],
  // "Hap-py Birth-day to you"
  ['F5', 0.75], ['F5', 0.25], ['E5', 1],   ['C5', 1],   ['D5', 1],   ['C5', 3],
];

let audioCtx   = null;
let hbPlaying  = false;
let hbNodes    = [];   // track all active nodes for stop
let hbTimeout  = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

/* Create a warm bell/music-box tone for one note */
function playNote(ctx, freq, startTime, duration, gain = 0.32) {
  const osc      = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filter   = ctx.createBiquadFilter();

  filter.type      = 'lowpass';
  filter.frequency.value = 2400;

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, startTime);

  // Add slight vibrato for warmth
  const vibrato = ctx.createOscillator();
  const vibGain = ctx.createGain();
  vibrato.frequency.value = 5.5;
  vibGain.gain.value = 3;
  vibrato.connect(vibGain);
  vibGain.connect(osc.frequency);
  vibrato.start(startTime);
  vibrato.stop(startTime + duration + 0.1);

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.02);
  gainNode.gain.setValueAtTime(gain * 0.85, startTime + duration * 0.4);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration + 0.18);

  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.2);

  hbNodes.push(osc, vibrato, gainNode, filter, vibGain);
  return startTime + duration;
}

function pauseBackgroundMusic() {
  const bgAudio  = $('#bg-audio');
  const musicBtn = $('#music-btn');
  const bgLabel  = $('#music-label');
  if (bgAudio && !bgAudio.paused) {
    bgAudio.pause();
    if (musicBtn) {
      musicBtn.classList.remove('playing');
      musicBtn.setAttribute('aria-label', 'Play background music');
      musicBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v14l11-7-11-7z"/></svg>`;
    }
    if (bgLabel) bgLabel.textContent = 'Play music';
  }
}

function playSynthesizedBirthday() {
  stopSynthesizedBirthday();
  const ctx   = getAudioCtx();
  const BPM   = 82;
  const beat  = 60 / BPM;
  let t       = ctx.currentTime + 0.05;
  const totalDuration = HAPPY_BIRTHDAY.reduce((s, n) => s + n[1] * beat, 0);

  HAPPY_BIRTHDAY.forEach(([note, beats]) => {
    const freq = NOTE_FREQ[note];
    const dur  = beats * beat * 0.92; // slight staccato gap
    if (freq) playNote(ctx, freq, t, dur);
    t += beats * beat;
  });

  hbPlaying = true;
  updateHBPlayerUI();

  // Auto-reset when song ends
  hbTimeout = setTimeout(() => {
    hbPlaying = false;
    hbNodes   = [];
    updateHBPlayerUI();
  }, (totalDuration + 0.5) * 1000);
}

function stopSynthesizedBirthday() {
  clearTimeout(hbTimeout);
  if (audioCtx) {
    hbNodes.forEach(n => {
      try { n.stop(audioCtx.currentTime + 0.02); } catch (_) {}
      try { n.disconnect(); } catch (_) {}
    });
  }
  hbNodes   = [];
}

async function startHappyBirthday() {
  // If background audio is playing, pause it to prevent clash
  pauseBackgroundMusic();

  const musicboxAudio = $('#musicbox-audio');
  if (musicboxAudio) {
    try {
      musicboxAudio.volume = 0.8;
      await musicboxAudio.play();
      hbPlaying = true;
      updateHBPlayerUI();
      return;
    } catch (err) {
      console.warn('Could not play musicbox audio, falling back to synthesized notes:', err.message);
    }
  }

  // Fallback to synthesized melody
  playSynthesizedBirthday();
}

function pauseHappyBirthday() {
  const musicboxAudio = $('#musicbox-audio');
  if (musicboxAudio && !musicboxAudio.paused) {
    musicboxAudio.pause();
  }
  stopSynthesizedBirthday();
  hbPlaying = false;
  updateHBPlayerUI();
}

function stopHappyBirthday() {
  const musicboxAudio = $('#musicbox-audio');
  if (musicboxAudio) {
    musicboxAudio.pause();
    musicboxAudio.currentTime = 0;
  }
  stopSynthesizedBirthday();
  hbPlaying = false;
  updateHBPlayerUI();
}

function updateHBPlayerUI() {
  const playBtn     = $('#hb-play-btn');
  const stopBtn     = $('#hb-stop-btn');
  const bars        = $$('.hb-bar');
  const statusTxt   = $('#hb-status-text');
  const actionLabel = $('#hb-action-label');

  if (!playBtn) return;

  const musicboxAudio = $('#musicbox-audio');
  const hasProgress = musicboxAudio && musicboxAudio.currentTime > 0 && !musicboxAudio.ended;

  if (hbPlaying) {
    playBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>`;
    playBtn.setAttribute('aria-label', 'Pause birthday song');
    playBtn.classList.add('playing');
    if (stopBtn) stopBtn.disabled = false;
    bars.forEach(b => b.classList.add('active'));
    if (statusTxt) statusTxt.textContent = '♪ Playing for Anjali…';
    if (actionLabel) actionLabel.textContent = 'Pause';
  } else {
    playBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v14l11-7-11-7z"/></svg>`;
    playBtn.setAttribute('aria-label', 'Play birthday song');
    playBtn.classList.remove('playing');
    if (stopBtn) stopBtn.disabled = !hasProgress;
    bars.forEach(b => b.classList.remove('active'));
    if (statusTxt) statusTxt.textContent = '♪ Happy Birthday, Anjali';
    if (actionLabel) actionLabel.textContent = hasProgress ? 'Resume' : 'Play';
  }
}

function initHappyBirthdayPlayer() {
  const playBtn       = $('#hb-play-btn');
  const stopBtn       = $('#hb-stop-btn');
  const musicboxAudio = $('#musicbox-audio');
  if (!playBtn) return;

  if (musicboxAudio) {
    musicboxAudio.addEventListener('play', () => {
      pauseBackgroundMusic();
      hbPlaying = true;
      updateHBPlayerUI();
    });
    musicboxAudio.addEventListener('pause', () => {
      hbPlaying = false;
      updateHBPlayerUI();
    });
    musicboxAudio.addEventListener('ended', () => {
      hbPlaying = false;
      musicboxAudio.currentTime = 0;
      updateHBPlayerUI();
    });
  }

  playBtn.addEventListener('click', () => {
    if (hbPlaying) {
      pauseHappyBirthday();
    } else {
      startHappyBirthday();
    }
  });

  stopBtn?.addEventListener('click', () => {
    stopHappyBirthday();
  });

  updateHBPlayerUI();
}

/* ── 7. BACKGROUND MUSIC CONTROL ─────────────────────────── */
function initMusic() {
  const audio    = $('#bg-audio');
  const musicBtn = $('#music-btn');
  const label    = $('#music-label');

  if (!musicBtn) return;

  if (!audio) {
    musicBtn.closest('.music-control')?.setAttribute('aria-hidden', 'true');
    return;
  }

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
      // If Happy Birthday is playing, stop it so tracks don't overlap
      if (hbPlaying) stopHappyBirthday();
      try {
        audio.volume = 0.4;
        await audio.play();
        playing = true;
      } catch (err) {
        console.warn('Audio could not play:', err.message);
        return;
      }
    } else {
      audio.pause();
      playing = false;
    }
    updateUI();
  });

  audio.addEventListener('ended', () => { playing = false; updateUI(); });
  updateUI();
}

/* ── 8. CONFETTI (cover reveal) ───────────────────────────── */
function launchConfetti() {
  if (prefersReducedMotion) return;
  const canvas = $('#confetti-canvas');
  if (!canvas) return;

  const ctx     = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.classList.add('active');

  const colors = ['#c9848a','#e8b4b8','#7a9b7e','#a8c4ac','#b8936a','#f5dde0','#d8e8da','#fff'];
  const pieces = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height * 0.5 - 20,
    r: Math.random() * 6 + 3,
    d: Math.random() * 4 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    tiltAngle: 0,
    tiltAngleInc: Math.random() * 0.07 + 0.05,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
    w: Math.random() * 10 + 5,
    h: Math.random() * 5 + 3,
  }));

  let frame, elapsed = 0, lastTime = performance.now();
  const maxDuration = 3200;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.tiltAngle * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.85;
      if (p.shape === 'circle') {
        ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
      p.y += p.d; p.x += Math.sin(p.tiltAngle) * 1.5; p.tiltAngle += p.tiltAngleInc;
    });
  }

  function animate(now) {
    elapsed += now - lastTime; lastTime = now; draw();
    if (elapsed < maxDuration) {
      frame = requestAnimationFrame(animate);
    } else {
      canvas.classList.remove('active');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  frame = requestAnimationFrame(animate);
  window.addEventListener('resize', () => { cancelAnimationFrame(frame); canvas.classList.remove('active'); }, { once: true });
}

/* ══════════════════════════════════════════════════════════
   9. WHITE LILY SHOWER — canvas animation on letter open
   Draws elegant falling white lilies with sage-green details.
   3–5 second gentle shower, auto-clearing & debounced.
   ══════════════════════════════════════════════════════════ */

let lilyShowerRunning = false;

function launchLilyShower() {
  if (prefersReducedMotion) return;
  if (lilyShowerRunning) return; // Prevent repeated triggers in rapid succession

  const canvas = $('#lily-canvas');
  if (!canvas) return;

  lilyShowerRunning = true;

  const ctx     = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.classList.add('active');

  const PETAL_PALETTE = ['#ffffff', '#fcfbf8', '#f9f6f0', '#fdfaf5'];
  const SAGE_GREEN    = '#7a9b7e';
  const SAGE_ACCENT   = 'rgba(122, 155, 126, 0.55)';

  /* Draw a single white lily at (cx, cy) with given scale, rotation, and color */
  function drawLily(x, y, scale, angle, alpha, petalColor) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.globalAlpha = alpha;

    const s = scale;

    // 3 elegant white petals (ellipses rotated 0, 60, -60 degrees)
    [-60, 0, 60].forEach(deg => {
      ctx.save();
      ctx.rotate(deg * Math.PI / 180);
      ctx.beginPath();
      ctx.ellipse(0, -s * 9.5, s * 3.4, s * 9.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = petalColor;
      ctx.strokeStyle = SAGE_ACCENT;
      ctx.lineWidth = 0.6 * s;
      ctx.fill();
      ctx.stroke();

      // Delicate subtle petal vein in soft sage
      ctx.beginPath();
      ctx.moveTo(0, -s * 2);
      ctx.lineTo(0, -s * 14);
      ctx.strokeStyle = 'rgba(122, 155, 126, 0.28)';
      ctx.lineWidth = 0.5 * s;
      ctx.stroke();

      ctx.restore();
    });

    // Centre stamen in soft sage-gold
    ctx.beginPath();
    ctx.arc(0, 0, s * 2.8, 0, Math.PI * 2);
    ctx.fillStyle = '#f0ebe1';
    ctx.strokeStyle = SAGE_GREEN;
    ctx.lineWidth = 0.6 * s;
    ctx.fill();
    ctx.stroke();

    // Subtle sage stamen dots
    [-30, 30, 90, 210].forEach(ang => {
      const rad = ang * Math.PI / 180;
      ctx.beginPath();
      ctx.arc(Math.cos(rad) * s * 3.2, Math.sin(rad) * s * 3.2, s * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = SAGE_GREEN;
      ctx.fill();
    });

    // Sage-green stem
    ctx.beginPath();
    ctx.moveTo(0, s * 2.5);
    ctx.lineTo(0, s * 13);
    ctx.strokeStyle = SAGE_GREEN;
    ctx.lineWidth = 1.1 * s;
    ctx.stroke();

    // Subtle sage-green leaf
    ctx.save();
    ctx.translate(0, s * 8);
    ctx.rotate(Math.PI / 4.5);
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 2.2, s * 4.8, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(122, 155, 126, 0.45)';
    ctx.strokeStyle = 'rgba(122, 155, 126, 0.6)';
    ctx.lineWidth = 0.5 * s;
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  /* Spawn lily particles */
  const lilies = Array.from({ length: 38 }, () => {
    const s = Math.random() * 0.75 + 0.5;
    return {
      x:          Math.random() * canvas.width,
      y:          Math.random() * -canvas.height * 0.5 - 30,
      scale:      s,
      angle:      Math.random() * Math.PI * 2,
      rotSpeed:   (Math.random() - 0.5) * 0.02,
      vy:         Math.random() * 1.5 + 0.8,
      vx:         (Math.random() - 0.5) * 0.9,
      alpha:      Math.random() * 0.4 + 0.55,
      alphaDecay: Math.random() * 0.0018 + 0.0008,
      wobble:     Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.035 + 0.015,
      petalColor: PETAL_PALETTE[Math.floor(Math.random() * PETAL_PALETTE.length)],
    };
  });

  let frame, elapsed = 0, lastTime = performance.now();
  const maxDuration = 4200; // ~4.2 seconds total shower duration

  function cleanup() {
    cancelAnimationFrame(frame);
    canvas.classList.remove('active');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTimeout(() => { lilyShowerRunning = false; }, 800);
  }

  function animate(now) {
    elapsed += now - lastTime;
    lastTime = now;

    const fadeRatio = Math.min(1, elapsed / 350);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let allGone = true;

    lilies.forEach(p => {
      if (p.alpha <= 0) return;
      allGone = false;

      // Towards end of duration, gently fade out
      if (elapsed > maxDuration - 900) {
        p.alpha -= p.alphaDecay * 3.5;
      }

      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 0.35;
      p.y += p.vy;
      p.angle += p.rotSpeed;

      drawLily(p.x, p.y, p.scale, p.angle, Math.max(0, p.alpha * fadeRatio), p.petalColor);

      if (p.y > canvas.height + 50) p.alpha = 0;
    });

    if (!allGone && elapsed < maxDuration + 600) {
      frame = requestAnimationFrame(animate);
    } else {
      cleanup();
    }
  }

  frame = requestAnimationFrame(animate);

  window.addEventListener('resize', () => {
    cleanup();
  }, { once: true });
}

/* ── 10. WISH NOTE micro-animation ───────────────────────── */
function initWishNotes() {
  if (prefersReducedMotion) return;
  $$('.wish-note').forEach(note => {
    note.addEventListener('click', () => {
      note.style.transform = 'scale(1.08) rotate(0deg)';
      setTimeout(() => { note.style.transform = ''; }, 300);
    });
  });
}

/* ── 11. PHOTO ERROR FALLBACK ─────────────────────────────── */
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

/* ── 12. SMOOTH NAV ───────────────────────────────────────── */
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
  initHappyBirthdayPlayer();
  initMusic();
  initWishNotes();
  initPhotoFallbacks();
  initSmoothNav();
});
