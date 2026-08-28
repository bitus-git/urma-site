# URMA — website

Static site. No build step, no dependencies. Open `index.html` in a browser,
or upload this whole folder.

## Publishing

**GitHub Pages** — create a public repo, upload this entire folder (keep the
`assets/` folder alongside the HTML files), then Settings → Pages → Deploy from
branch → main → / (root).

**Netlify** — drag this folder onto app.netlify.com/drop.

## Files

- `index.html` and the other 21 pages — one file per page, self-contained markup
- `assets/urma.css` — all styling, one stylesheet for every page
- `assets/urma.js` — nav, animations, product grids, form validation
- `assets/*.webp` — product photography, cut out with transparent backgrounds

## Editing

**Copy** lives directly in each HTML file. Search for the sentence you want to
change and edit it in place.

**Products** are defined once, in the `PRODUCTS` array near the top of
`assets/urma.js`. Adding a product there makes it appear in every grid
automatically. A product with an `img` key uses that photo; without one it falls
back to the logo mark on a colour tile.

**Colours** are CSS variables at the top of `assets/urma.css`:
`--cobalt` (Settle), `--ochre` (Play), `--kids` (Kids).

## Placeholders to fill before launch

Search the folder for `[` to find them all. The main ones:

- Company registry code, VAT number and registered address (footer, contact)
- `hello@urma.ee` — confirm the real address
- Shipping rates per zone, carrier name, Christmas cut-offs
- Wholesale price tiers
- Material certificate standards and a link to the actual certificates
- Product dimensions and weights on the product page
- Terms, Privacy and Returns need a lawyer — they ship as outlines, not drafts
