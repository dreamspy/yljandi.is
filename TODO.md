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
- [ ] Confirm the site is reachable at `https://dreamspy.github.io/yljandi.is/` before moving on.

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
- [ ] Click through nav and confirm event data loads.
- [ ] Check on mobile.

## Troubleshooting quick refs

- DNS not resolving after a few hours: re-check the records at ISNIC, especially that there is no leftover default A record pointing elsewhere.
- "Domain does not resolve" in Pages settings: DNS has not propagated yet, or the host field at ISNIC is wrong (it should be the bare apex, not `@` unless ISNIC requires it).
- HTTPS stuck on "unavailable": GitHub needs DNS to be correct first; once it is, wait up to an hour.
