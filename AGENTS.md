# Instructions for Codex

Read `NOTE-PROJET.md` first: current state, known pitfalls and prioritized next steps.

Project type:
- Static portfolio website, no build step
- HTML / CSS / vanilla JavaScript, Three.js for the 3D avatar only
- Deployed automatically by Netlify on every push to `main`; the whole repository is published

Structure:
- home.html: main portfolio page
- assets/: images, styles, scripts, fonts or media assets
- files/: downloadable files such as CV PDF
- scripts/: local preview server, local project editor and checks
- docs/: redesign, avatar and local editor documentation

Rules:
- Inspect existing structure before editing.
- Keep changes minimal and clean.
- Do not rewrite the whole website unless requested.
- Preserve the existing visual identity unless explicitly asked.
- Do not delete files from assets/ or files/ without permission.
- Explain modified files after each task.
- Test visually in browser after changes when possible.

Useful commands (no install needed):
- npm run dev: local preview on http://127.0.0.1:4173/home
- npm run check: required files are present
- npm run check:html: sections, anchors, path casing and image alt text

There is no build command. `gulpfile.js` is obsolete and does not work.