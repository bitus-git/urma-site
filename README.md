# URMA landing page

A static one-page site. No build step. It talks to a small Supabase database for three things:
the "I'd try this" counters, the "Try one" lead form and the "Share feedback" form.

```
index.html     page content
styles.css     all styling
script.js      page behaviour and the Supabase calls
config.js      your Supabase URL and key (fill this in)
supabase.sql   database setup, run once
images/        product photos
```

## 1. Set up the database (about 10 minutes, free)

1. Create a free project at https://supabase.com. Pick the region closest to your visitors.
2. Open SQL Editor, choose New query, paste the whole of `supabase.sql`, and press Run.
3. Open Project Settings, then API. Copy the **Project URL** and the **anon public** key.
4. Paste both into `config.js`:

   ```js
   window.URMA_CONFIG = {
     supabaseUrl: 'https://YOURPROJECT.supabase.co',
     supabaseAnonKey: 'YOUR-ANON-PUBLIC-KEY',
     email: 'hello@urma.ee'
   };
   ```

The anon key is meant to be public. The rules in `supabase.sql` let visitors add a lead, add feedback,
cast or remove a vote, and read vote totals. They cannot read anyone's details. Never put the
`service_role` key in this site.

## 2. Publish on GitHub Pages

Upload everything in this folder to the root of your repository (replace the old files), then
Settings, Pages, "Deploy from a branch", `main`, `/ (root)`.

## 3. Read your results

In Supabase, open Table Editor:

- `leads`: every "Try one" request, with company, team size and interest. Export as CSV from the table menu.
- `feedback`: open answers from the feedback form.
- `vote_events`: one row per vote. The totals on the page come from this table.

## Notes

- Until `config.js` is filled in, the counters show no numbers and the forms tell visitors to email you.
- Votes are one per browser per shape. Someone who clears their browser data can vote again, which is fine for
  early demand signals but not for anything official.
- The lead form asks for consent, and visitors can be removed on request. Keep that promise, and add a
  privacy page before you advertise the site.
- Supabase free projects pause after a week with no activity. Visit the dashboard to wake one up.
