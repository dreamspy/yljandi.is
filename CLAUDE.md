# Claude instructions for yljandi.is

## Project

Static marketing page for Yljandi Sána, a sauna business in Iceland. Hosted on GitHub Pages at the custom domain `yljandi.is`.

## Stack

Plain HTML, CSS, and JavaScript. No build step, no package manager, no frameworks. Everything is served as-is by GitHub Pages.

Do not introduce a build step, bundler, or dependency manifest unless the user explicitly asks for one.

## Content language

All user-facing copy is Icelandic. Preserve special characters: á, é, í, ó, ú, ý, þ, æ, ö, ð. Do not translate existing strings to English unless asked.

Tone: calm, minimal, zen. Avoid marketing language.

## Design system

Design tokens live as CSS custom properties at the top of `css/style.css`:

- `--bg`, `--bg-soft`: warm off-white background
- `--ink`, `--ink-soft`: text colors
- `--accent`: sage green (hover / highlight)
- `--line`: hairline borders
- Fonts: Cormorant Garamond (display, serif) + Inter (body, sans-serif)

Any new component should reuse these tokens rather than introducing new colors or fonts.

Layout is generous whitespace, centered, mobile-first. Borders and separators are hairline, not heavy.

## Events

Events are rendered client-side from `data/events.json` by `js/main.js`:

- Array of objects. Schema is documented in `README.md`.
- Dates must be `YYYY-MM-DD`. Past events are filtered out automatically.
- Booking URLs go to JotForm. The placeholder `https://form.jotform.com/PLACEHOLDER` is used until real links are provided.

When adding features around events, keep the data file as the single source of truth. Do not hard-code event details in HTML.

## Repo notes

Two files at the repo root are intentionally not tracked: `2.png` and `469983820_...jpg`. They were present before the repo was initialized and their purpose is unconfirmed. Do not add them to git without asking.

## User preferences

Do not use em-dashes in prose written for the user. Substitute commas, colons, periods, or parentheses. En-dashes in numeric ranges are fine.

For small edits to an existing file, confirm before editing in place or writing a new version. For large or multi-step revisions, default to a new version.

Never commit or push without an explicit request.
