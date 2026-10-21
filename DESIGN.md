# You caught my eye

An intimate text-art experience, not a greeting-card template. The visitor sees a procedural ASCII eye, then zooms into a colored beating heart before reading the original letter.

## Tokens
- Night: #101216; reading surface: #ebe9ef; primary light text: #faf7ff.
- Letter ink: #252332; plum ink: #773d78; blush: #e7aac9.
- Display: Bodoni Moda, reading: Georgia, character art and controls: Inconsolata.
- Desktop outer spacing 40px; phone 20–23px. Single reading column capped at 660px.

## Behavior
Canvas character-grid rendering is original procedural artwork. A warm hazel iris with amber fibers, a shaded sclera, catchlights, and a pupil edge sits inside an asymmetric lid; pointer tracking and a periodic blink share one bounded animation. On selection the camera pushes into the pupil, the eye dissolves, and a rose heart emerges as a small ember then slowly swells to full size with a gentle beat. The reveal lasts about nine seconds. Skip is always available; reduced-motion visitors bypass the transition. Stop drawing after entering the letter. Music only starts following user interaction. Response choices are local, not transmitted.

## References
https://www.asciiart.eu/themes/valentines-day/2026
https://github.com/T4ras123/ascii-love
References informed the text-art technique; no source artwork or code was copied. The existing cover.jpg artwork is retained; the soundtrack is Daniel Caesar’s “Too Deep to Turn Back.”

## Verification
JavaScript syntax checked with node --check. Browser DOM verified canvas initialization and no horizontal overflow at the available viewport. Screenshot capture was blocked by the browser visibility requirement; desktop/mobile visual review remains outstanding.

## Letter surface refresh
The letter now uses a continuous off-white sheet (#fbfaf8), charcoal ink (#353539), and muted rose (#93515f). Literata sets readable prose and a modest opening heading; Caveat renders the existing signature. A fine margin thread grows with reading position, ending in an outlined heart. All text is visible without scrolling effects or JavaScript. Reduced motion renders the complete thread. The existing pullquote becomes a small blush passage without quotation ornaments or dividers. Responsive phone prose is 16px with 1.9 line height. Intro styling, original letter text, music, and response behavior remain intact. The surface-specific rules live in letter.css; syntax validation passed, visual review remains outstanding.
