# URMA landing page

A static one-page site. No build step, no dependencies.

```
index.html     page content
styles.css     all styling
script.js      ticker, menu, hold-to-press marks, feedback message builder
images/        product photos
favicon.svg
```

## Publish with GitHub Pages

1. Create a repository and upload everything in this folder to its root (including `.nojekyll`).
2. In the repository, open Settings, then Pages.
3. Under Build and deployment, choose "Deploy from a branch", pick `main` and `/ (root)`, and save.
4. The site appears at `https://<your-user>.github.io/<repo-name>/` after a minute or two.

For a custom domain, add it under Settings, then Pages, and point your DNS at GitHub.

## Things to know

- Fonts load from Google Fonts. Everything else is local.
- The feedback form builds a message that visitors copy or open in their email app, addressed to hello@urma.ee. To collect responses properly, replace it with a form service such as Formspree, Tally or Google Forms.
- The "I'd try this" buttons preselect the product in that form. The live vote counter from the Claude preview is not included, because it needs a backend.
