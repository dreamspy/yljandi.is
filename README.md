# Yljandi · Sána

Simple static site for Yljandi Sána, a sauna business in Iceland.

## Stack

Plain HTML, CSS, and JavaScript. No build step, no dependencies, no frameworks.

## Structure

```
index.html          page markup
css/style.css       styles
js/main.js          carousel + event rendering
data/events.json    event data, loaded by the page
img/                logo and carousel photos
```

## Updating events

Edit `data/events.json`. Each event is an object in the top-level array:

```json
{
  "title": "Saunagus við fullt tungl",
  "date": "2026-05-02",
  "time": "20:00",
  "location": "Fúsk sána, Reykjavík",
  "mapUrl": "https://www.google.com/maps/...",
  "description": "Leiddar gusur undir fullu tungli.",
  "price": "7.500 kr.",
  "bookingUrl": "https://form.jotform.com/..."
}
```

Dates must be in `YYYY-MM-DD` format. Past events are hidden automatically. Entries are sorted by date ascending.

Commit and push. GitHub Pages will pick up the change within a minute or so.

## Local preview

From the repo root:

```
python3 -m http.server 8000
```

Open http://localhost:8000. The page uses `fetch`, which does not work when opening `index.html` directly from disk, so a local server is required for preview.

## Deploy (GitHub Pages)

1. Repo → Settings → Pages → Source: `main` branch, `/ (root)` folder.
2. For the custom domain `yljandi.is`:
   - A file named `CNAME` at the repo root contains `yljandi.is`.
   - DNS is configured at ISNIC: four A records on the apex pointing to GitHub Pages (`185.199.108-111.153`) plus a CNAME on `www` pointing to `dreamspy.github.io.`. Apex domains cannot use a CNAME, so A records are required for `yljandi.is` itself.

## License

Private project. All rights reserved.
