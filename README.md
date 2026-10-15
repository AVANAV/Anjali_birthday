# Anjali's 20th Birthday Scrapbook 🌸

A personal birthday website for Anjali's 20th birthday — **15 October 2026**.

Built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools, no dependencies.

---

## Project File Structure

```
anjali-birthday-scrapbook/
├── index.html               ← Main page
├── css/
│   └── styles.css           ← All styles, CSS variables, animations
├── js/
│   └── script.js            ← All interactions (no dependencies)
├── assets/
│   ├── anjali-current.jpg   ← ⚠️ ADD THIS FILE (see below)
│   ├── anjali-childhood.jpg ← ⚠️ ADD THIS FILE (see below)
│   ├── musicbox-song.mp3    ← Music box song audio file
│   └── background-music.mp3 ← Optional — add if you have music
└── README.md
```

---

## Adding the Photographs

The site uses exactly two real photographs:

### `assets/anjali-current.jpg`
- Anjali's current photograph
- Recommended: any portrait orientation, minimum 600px wide
- The image is displayed in a polaroid-style frame

### `assets/anjali-childhood.jpg`
- Anjali's childhood photograph
- Same format requirements
- Displayed first as a "before" reveal, with a button to transition to current

**How to add:**
1. Place your files directly in the `assets/` folder.
2. Name them exactly as shown above (case-sensitive on Linux/macOS).
3. If a file is missing, the site gracefully shows a placeholder with instructions.

---

## Adding Optional Background Music

1. Obtain a `.mp3` file you have rights to use.
2. Name it `background-music.mp3` and place it in `assets/`.
3. Music is **off by default** — the user must click the ♪ button.
4. The site works perfectly without music if the file is absent.

---

## Running Locally

### Option 1 — VS Code Live Server (recommended)
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
2. Right-click `index.html` → **Open with Live Server**.

### Option 2 — Python (no installation needed)
```bash
# Python 3
cd path/to/anjali-birthday-scrapbook
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

### Option 3 — Node.js serve
```bash
npx -y serve .
```

> **Do not open `index.html` directly as a `file://` URL** — audio and some resources may be blocked by the browser.

---

## Deploying

### GitHub Pages
1. Create a new GitHub repository.
2. Push all files to the `main` branch (or `gh-pages` branch).
3. Go to **Settings → Pages → Source** and select your branch.
4. Your site will be live at `https://yourusername.github.io/repo-name/`.

### Netlify (drag & drop — easiest)
1. Go to [netlify.com](https://netlify.com) and sign in.
2. Drag the entire project folder onto the Netlify dashboard.
3. Done. You get a live URL instantly.

> **Privacy note:** Once deployed, the URL and all content (including photographs) is accessible to anyone with the link. Keep the URL private and share it only with Anjali.

---

## Testing Checklist

### Visual & Layout
- [ ] Cover page looks correct on mobile (< 600px), tablet, and desktop
- [ ] Lily tooltip appears when clicking the flower button on the cover
- [ ] Chapter 20 sticker renders with gentle tilt
- [ ] All scrapbook cards have subtle rotation on desktop, straight on mobile

### Photo Reveal
- [ ] Childhood photo shown first on page load
- [ ] "See you now →" button transitions to current photo smoothly
- [ ] "← Back" button returns to childhood photo
- [ ] Photo placeholders show if image files are missing
- [ ] Works with keyboard (Tab + Enter/Space)

### Envelope / Letter
- [ ] Clicking the envelope or "Open your letter" reveals the letter
- [ ] "✕ Close letter" button hides the letter again
- [ ] "Read your letter again" from the finale scrolls to the letter section
- [ ] Letter is readable on mobile screens
- [ ] Works with keyboard navigation
- [ ] Escape key closes the letter

### Scroll Animations
- [ ] Sections fade in as you scroll down
- [ ] `prefers-reduced-motion` disables animations (test in OS accessibility settings)

### Music
- [ ] Music button is visible at bottom-right
- [ ] Music does NOT autoplay on page load
- [ ] Clicking button starts/stops music
- [ ] Site works perfectly with no music file present
- [ ] Button icon updates to pause icon when playing

### Accessibility
- [ ] All interactive elements are keyboard focusable
- [ ] Focus styles are visible
- [ ] Images have meaningful alt text
- [ ] ARIA labels present on buttons and regions
- [ ] No horizontal scroll overflow on any screen size

### Confetti
- [ ] Confetti fires when clicking "Open your surprise" on the cover
- [ ] Confetti is skipped when `prefers-reduced-motion` is enabled

---

## Design Details

**Color palette:**
- Ivory paper: `#faf6f0` / `#f5ede0`
- Dusty rose: `#c9848a`
- Sage green: `#7a9b7e`
- Warm brown: `#8b6347`
- Ink: `#3a2e26`

**Fonts (Google Fonts):**
- Headings: Playfair Display
- Body text: EB Garamond
- Handwritten notes: Caveat
- Labels & buttons: Lato

**Lily motif:** White lily SVGs appear on the cover, birthday note, envelope, letter, adventure card, wishlist, and finale — as a quiet personal detail that accumulates naturally.

---

## Content Summary

| Section | Content |
|---------|---------|
| A — Cover | Birthday cover with lily note, Chapter 20 sticker, and reveal button |
| B — Birthday Note | Warm card message on lined paper |
| C — Photo Reveal | Childhood → current Polaroid transition |
| D — How We Met | Personal note on how the friendship formed unexpectedly |
| E — Adventures | Four scrapbook cards: horror movies, places, adrenaline, future adventures |
| F — Letter | Interactive envelope with full personal birthday letter |
| G — Wishlist | Five sticky-note wishes for chapter 20 |
| H — Finale | Closing message with lily motif and "Re-read letter" button |

---

*Made with care, just for Anjali. 🌸*
