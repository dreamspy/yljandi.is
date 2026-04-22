# TODO: Publish yljandi.is to GitHub Pages

Plan for getting the site live at `https://yljandi.is`. The repo is already on GitHub at `github.com/dreamspy/yljandi.is` on the `main` branch.

## 1. Push the current state

- [x] Review uncommitted changes (`git status`, `git diff`).[[]()]()
- [x] Commit anything intended for the first live version.
- [x] `git push origin main`.

Note: `2.png` and `469983820_...jpg` at the repo root are untracked on purpose. Leave them out.

## 2. Enable GitHub Pages

- [x] GitHub → repo `dreamspy/yljandi.is` → **Settings** → **Pages**.
- [x] Under **Build and deployment**:
  - **Source**: Deploy from a branch
  - **Branch**: `main`, folder `/ (root)`
- [x] Save. Wait for the first build (takes up to a minute).
- [x] Confirm the site is reachable at `https://dreamspy.github.io/yljandi.is/` before moving on.

## 3. Add the CNAME file

GitHub Pages reads this file to know which custom domain to serve.

- [x] Create a file named `CNAME` at the repo root (no extension) containing exactly:
  ```
  yljandi.is
  ```
- [x] Commit and push. GitHub Pages will set the custom domain automatically.

## 4. Configure DNS at ISNIC

ISNIC's web console is at `https://www.isnic.is/` (log in with the handle used when buying the domain).

A new `.is` domain may be on ISNIC's **parking** nameservers (`parking00/01.isnic.is`), which have no editable zone. Before adding records, go to **Flytja hýsingu** on the domain and pick **DNS Hýsing ISNIC**, then confirm. The nameservers will switch to `forwarding00/01.isnic.is` and the zone editor becomes available. Takes ~10 min.

For the apex domain `yljandi.is`, add four A records. In ISNIC's form, **Heiti (host)** should be `@` (do not type the domain itself: ISNIC warns "Heiti inniheldur yljandi.is"):

| Type | Host | Value             |
| ---- | ---- | ----------------- |
| A    | `@`  | `185.199.108.153` |
| A    | `@`  | `185.199.109.153` |
| A    | `@`  | `185.199.110.153` |
| A    | `@`  | `185.199.111.153` |

Optional (recommended) IPv6 records, same host:

| Type | Host | Value                 |
| ---- | ---- | --------------------- |
| AAAA | `@`  | `2606:50c0:8000::153` |
| AAAA | `@`  | `2606:50c0:8001::153` |
| AAAA | `@`  | `2606:50c0:8002::153` |
| AAAA | `@`  | `2606:50c0:8003::153` |

For the `www` subdomain, add a CNAME so `www.yljandi.is` also works:

| Type  | Host  | Value (Lén)           |
| ----- | ----- | --------------------- |
| CNAME | `www` | `dreamspy.github.io.` |

- [x] Move domain off parking onto DNS Hýsing ISNIC.
- [x] Save DNS changes at ISNIC.
- [x] Wait for propagation (usually minutes, can take a few hours).
- [x] Check from the terminal:
  ```
  dig yljandi.is +short
  dig www.yljandi.is +short
  ```
  The A records should show the four GitHub IPs above. If the public resolver is still empty after adding records, query the authoritative server directly: `dig @forwarding00.isnic.is yljandi.is +short`.

## 5. Verify the custom domain on GitHub

- [x] Back in **Settings → Pages**, the **Custom domain** field should show `yljandi.is` with a green check ("DNS check successful").
- [x] Tick **Enforce HTTPS** once the check passes. GitHub issues a Let's Encrypt certificate automatically; this can take up to an hour after DNS is correct. Immediately after DNS passes, the checkbox is disabled with the message *"Unavailable for your site because a certificate has not yet been issued for your domain"*. That's expected: just wait and refresh the page.

## 6. Smoke test

- [x] Visit `https://yljandi.is` in a fresh browser window.
- [x] Visit `https://www.yljandi.is` and confirm it redirects to `https://yljandi.is`.
- [x] Click through nav and confirm event data loads.
- [x] Check on mobile.

## Troubleshooting quick refs

- DNS not resolving after a few hours: re-check the records at ISNIC, especially that there is no leftover default A record pointing elsewhere.
- "Domain does not resolve" in Pages settings: DNS has not propagated yet, or the host field at ISNIC is wrong (it should be the bare apex, not `@` unless ISNIC requires it).
- HTTPS stuck on "unavailable": GitHub needs DNS to be correct first; once it is, wait up to an hour.

# TODO: Visitor analytics

Goal: know how many people visit the site, which pages (sections) they land on, where they come from, and what device they use, without dragging in a cookie banner.

## 0. Confirm Cloudflare setup mode

Cloudflare can be used two different ways and the steps below branch slightly:

- [ ] Decide: **Full proxy** (Cloudflare is the authoritative DNS, nameservers at ISNIC point to Cloudflare's `*.ns.cloudflare.com`, traffic is proxied through Cloudflare) or **Snippet only** (DNS stays at ISNIC, Cloudflare is only used for the Web Analytics JS beacon).
- [ ] If full proxy: update `CLAUDE.md` and `README.md` to note that DNS is now at Cloudflare, not ISNIC. The four GitHub Pages A records live in Cloudflare's dashboard instead.
- [ ] If full proxy: on the Cloudflare DNS tab, set the apex and `www` records to **DNS only** (grey cloud) at first. GitHub Pages and Cloudflare both try to terminate TLS, and proxying (orange cloud) on top of Pages can cause redirect loops until SSL mode is set to **Full (strict)**. Verify the site still loads before enabling the orange cloud.

## 1. Cloudflare Web Analytics (primary)

Privacy-friendly, no cookies, free, no consent banner needed.

- [x] Cloudflare dashboard → **Analytics & Logs** → **Web Analytics** → **Add a site**.
- [x] Enter `yljandi.is`. If the site is proxied, Cloudflare can enable automatic setup (no snippet). If not proxied, choose **Manual setup** and copy the `<script>` beacon it gives you.
- [x] Paste the beacon snippet into `index.html` just before `</body>`. It looks like:
  ```html
  <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "REPLACE_WITH_TOKEN"}'></script>
  ```
- [x] Commit, push, wait a minute for GitHub Pages to rebuild.
- [x] Visit `https://yljandi.is` from a phone or incognito window to generate a pageview. Check the Web Analytics dashboard after ~5 minutes: pageviews, visits, top paths, referrers, and country breakdown should appear.
- [x] check in cloudflare analytics

## 2. Google Search Console (needed anyway for SEO, gives search-side metrics)

Search Console is not a visitor counter, but it tells you how many impressions and clicks the site gets from Google, and which queries bring people in. Set it up as part of analytics.

- [x] Go to `https://search.google.com/search-console` and add `yljandi.is` as a **Domain property** (not URL-prefix: domain property covers `https`, `http`, `www`, and subdomains).
- [x] Verify via DNS TXT record. Add the TXT record at whichever DNS provider is currently authoritative (Cloudflare if nameservers were moved, otherwise ISNIC). Host `@`, value is the `google-site-verification=...` string Google provides.
- [x] Wait a few minutes, click **Verify**. Verification is checked again periodically, so do not delete the TXT record.

## 3. Optional: Google Analytics 4

Only add this if Cloudflare Web Analytics turns out to be too coarse. GA4 gives richer event and funnel data but requires a cookie consent banner under Icelandic privacy rules (which follow the EU ePrivacy directive). Skip for now unless there is a real need.

---

# TODO: SEO / Google ranking

Context: single-page Icelandic marketing site for a small local business. The big wins are on-page metadata, a Google Business Profile, and a handful of strong backlinks. Do not over-engineer: no blog, no schema zoo, no keyword-stuffed copy.

## 1. On-page metadata in `index.html`

Current `<head>` has a title, a one-line description, and nothing else. Expand it so that Google, Facebook, and iMessage all render the site nicely.

- [ ] Rewrite `<title>` to include the primary search intent. Current: `Yljandi - Sána`. Proposed: `Yljandi Sána · Leiddar saunagus gusur á Íslandi`. Keep under ~60 characters.
- [ ] Expand `<meta name="description">` to ~150 characters, include location (Reykjavík / Ísland) and the main keyword ("saunagus" / "sána").
- [ ] Add `<link rel="canonical" href="https://yljandi.is/">` so Google does not treat `https://www.yljandi.is/` or query-string variants as duplicates.
- [ ] Add Open Graph tags for social share previews:
  ```html
  <meta property="og:type" content="website">
  <meta property="og:title" content="...">
  <meta property="og:description" content="...">
  <meta property="og:url" content="https://yljandi.is/">
  <meta property="og:image" content="https://yljandi.is/img/og-cover.jpg">
  <meta property="og:locale" content="is_IS">
  ```
- [ ] Add a Twitter card:
  ```html
  <meta name="twitter:card" content="summary_large_image">
  ```
- [ ] Create `img/og-cover.jpg`, 1200×630, a calm photo of the sauna or the logo on the warm background. This is the image that shows up on Facebook, WhatsApp, iMessage link previews.
- [ ] Add JSON-LD structured data marking the business as a `HealthAndBeautyBusiness` (or more specific `DaySpa` if it fits). Include `name`, `url`, `image`, `address`, `areaServed`, `sameAs` (Facebook URL), and `event` entries pulled from `data/events.json` at hand-edit time. Example skeleton:
  ```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "name": "Yljandi Sána",
    "url": "https://yljandi.is/",
    "image": "https://yljandi.is/img/og-cover.jpg",
    "sameAs": ["https://facebook.com/yljandi"]
  }
  </script>
  ```

## 2. Indexability files at the repo root

- [ ] Add `robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://yljandi.is/sitemap.xml
  ```
- [ ] Add `sitemap.xml`:
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://yljandi.is/</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
  </urlset>
  ```
- [ ] In Search Console → **Sitemaps**, submit `https://yljandi.is/sitemap.xml`.

## 3. Content and accessibility passes

Google rewards pages that look intentional and are easy to read. Most of these also help real users.

- [ ] Review `alt` text on all images in `img/`. `alt="Yljandi merki"` on the hero logo is fine. Carousel photos should describe the scene (e.g. `alt="Gufa stígur upp úr heitum potti við sjóinn"`), not "photo1".
- [ ] Confirm heading hierarchy: exactly one `<h1>` (currently the hero name), `<h2>` for sections (currently "Komandi viðburðir"). Do not skip levels.
- [ ] Keep the home page above ~300 words of visible text. Short pages with mostly images can rank poorly. A short "Hvað er saunagus?" paragraph under the hero would help without breaking the minimal tone.
- [ ] Make sure every event rendered from `data/events.json` has a real `description` field. The description text is part of what Google sees and indexes.

## 4. Local SEO (highest-leverage item for a small Iceland business)

For a sauna business, most customers find you by searching "saunagus Reykjavík" or via Google Maps. A Business Profile usually outranks the website itself on these queries.

- [ ] Create a **Google Business Profile** at `https://business.google.com/`. Category: *Sauna* or *Spa*. Add address, opening hours, phone, photos, link to `https://yljandi.is`.
- [ ] Verify the profile (Google usually sends a postcard or asks for a video tour).
- [ ] List the business on `ja.is` (Icelandic directory). Free, and a strong local signal.
- [ ] Optional: `1819.is` listing.
- [ ] Make sure the Facebook page at `facebook.com/yljandi` links back to `yljandi.is` in its About section. That is a cheap authoritative backlink.

## 5. Performance and Core Web Vitals

Google uses page speed as a small ranking factor and a larger "does this feel good" factor. The site is already light, so the bar is low.

- [ ] Run Lighthouse (Chrome DevTools → Lighthouse → Mobile) against `https://yljandi.is`. Aim for Performance ≥ 90 and Accessibility ≥ 95.
- [ ] Compress any photos in `img/` to under ~200 KB each; convert to `.webp` where possible.
- [ ] If Cloudflare is in full-proxy mode, enable **Auto Minify** (HTML/CSS/JS), **Brotli**, and **Polish (Lossy)** for images in the Cloudflare dashboard. Free tier covers all of these.

## 6. After launch: monitor

- [ ] Once a week for the first month, skim Cloudflare Web Analytics: traffic trend, top referrers, bounce-ish signals (time on page).
- [ ] Once a month, open Search Console → **Performance**: which queries bring impressions, which bring clicks, what the average position is. Iterate on title and description copy based on what people actually search.
