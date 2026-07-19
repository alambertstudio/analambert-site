# analambert.com — static site

Portfolio site for Ana Ortega Lambert. Plain HTML and CSS, no build step, no dependencies.

## Structure

```
analambert-site/
├── index.html              Homepage
├── css/
│   └── style.css           The entire design system, one file
├── images/                 Your screenshots and headshot go here
└── work/
    └── brand-system.html   Case study template (flagship, content stubbed)
```

To add a case study: duplicate `work/brand-system.html`, rename it, replace the content between the bracketed prompts, and add a card for it on `index.html`.

## Images needed before launch

Same aspect ratio for all three card thumbnails (16:10, e.g. 1600x1000 px):

- `images/map-thumb.png` — global network map screenshot
- `images/homepage-thumb.png` — PSI homepage screenshot
- `images/survey-thumb.png` — school survey screenshot
- `images/ana-headshot.jpg` — headshot, 4:5 crop
- Case study figures as referenced inside each case study page

Export at 2x display size, then compress at squoosh.app (WebP, quality ~80).

## Preview locally

Open `index.html` in a browser. That's it. For nicer local serving:
`python3 -m http.server` in this folder, then visit localhost:8000.

## Deploy (chosen path): GitHub Pages, free

One account manages everything: GitHub stores the code AND serves the site.

1. Create an account at github.com.
2. Top right + icon → New repository. Name: `analambert-site`. Public. Create.
3. "Uploading an existing file" link → drag in the CONTENTS of this folder
   (index.html, css/, images/, work/, README.md) so index.html sits at the
   top level of the repo, not inside a subfolder. Commit changes.
4. Repo → Settings → Pages. Under "Build and deployment": Source = Deploy
   from a branch, Branch = main, folder = / (root). Save.
5. Wait ~2 minutes. The Pages screen shows your test URL:
   `https://YOURUSERNAME.github.io/analambert-site/`
   Review the whole site there before touching your domain.
6. Custom domain: on the same Pages screen, enter `analambert.com` and Save.
   GitHub creates a CNAME file in the repo.
7. At Namecheap: Domain List → Manage → Advanced DNS. Delete the existing
   A/CNAME records pointing at the old hosting, then add:
   - A record,  Host `@`, Value `185.199.108.153`
   - A record,  Host `@`, Value `185.199.109.153`
   - A record,  Host `@`, Value `185.199.110.153`
   - A record,  Host `@`, Value `185.199.111.153`
   - CNAME,     Host `www`, Value `YOURUSERNAME.github.io.`
   (These four IPs are GitHub Pages' published addresses; confirm on the
   GitHub Pages docs page if anything errors.)
8. Back on GitHub → Settings → Pages: once the domain check passes, tick
   "Enforce HTTPS".
9. DNS propagates in minutes to a few hours. The old WordPress site stays
   untouched on Namecheap hosting as a fallback; if anything goes wrong,
   restore the old DNS records and you're back.
10. Once stable for a couple of weeks, cancel the Namecheap hosting plan at
    renewal. Keep the domain registration.

Updates after launch: open the file on GitHub → pencil icon → edit → Commit.
Live in about a minute. No FTP, no cPanel, no plugins.

## Deploy (fallback): Namecheap hosting you already have

1. In Namecheap cPanel, back up the current site: File Manager → compress
   `public_html` to a zip and download it. Also export the WordPress database
   from phpMyAdmin (safety copy).
2. Empty `public_html` (the backup means nothing is lost).
3. Upload this folder's contents into `public_html` so `index.html` sits at the top level.
4. Done. Same URL, no DNS changes. Updates mean re-uploading changed files
   through File Manager or FTP.

## Design system quick reference

- Colors: brand blue `#1A1AE6`, deep blue `#10109E`, ink `#0B0B14`,
  tint `#E9E9FC`, paper `#FAFAF8`
- Type: Archivo (display, wide + heavy), Instrument Sans (body),
  IBM Plex Mono (labels, tags, data)
- All tokens live at the top of `css/style.css` as CSS variables;
  change them there and the whole site follows.
