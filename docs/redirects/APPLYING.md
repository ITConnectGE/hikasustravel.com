# Applying the legacy redirects in Cloudflare

**Status: NOT YET APPLIED.** This is the one outstanding technical-SEO item on the
site, and it can only be done from the Cloudflare dashboard — see *Why this
cannot be fixed in the repo* below.

## What the problem is

1,610 legacy URLs (218 paths x 7 locales, plus renamed tour slugs) currently
return **HTTP 200**, not a 301. They are served as prerendered stub pages that
carry `noindex, follow`, a canonical pointing at the new location, and a
meta-refresh:

```
$ curl -I https://www.hikasustravel.com/en/things-to-do-in-tbilisi/
HTTP/1.1 200 OK          <-- should be 301
```

```html
<meta http-equiv="refresh" content="0; url=.../en/georgia/tbilisi/things-to-do-in-tbilisi/">
<link rel="canonical" href=".../en/georgia/tbilisi/things-to-do-in-tbilisi/">
<meta name="robots" content="noindex, follow">
```

The stubs are correct and safe — nothing is mis-indexed, and every one of them
is excluded from `sitemap.xml`. But each is a page Google must fetch and
re-fetch to learn nothing, it passes less link equity than a real 301, and it is
the most likely source of a large **"Crawled - currently not indexed"** bucket in
Search Console.

## Why this cannot be fixed in the repo

The site is hosted on **GitHub Pages**, which serves static files only and cannot
issue a 301 for an arbitrary path. There is no `_redirects`, `netlify.toml`,
`vercel.json` or server config in this project, and adding one would have no
effect. **Cloudflare fronts the origin**, so the redirect has to live there.

Note the trailing-slash redirect (`/en/x` -> `/en/x/`) already works correctly
site-wide and needs no rule — do not add one, it would duplicate existing
behaviour.

## What to apply

`scripts/generate-redirects.js` generates two interchangeable forms of the same
coverage. **Apply one, not both.**

| | file | plan needed | rules |
|---|---|---|---|
| **Option A (recommended)** | `cloudflare-bulk-redirects.csv` | any, incl. Free | 1 list of 1,610 rows |
| Option B | `cloudflare-redirect-rules.md` | needs `matches` (regex) — **not on Free** | 4 pattern + 64 exact |

Option A is recommended: no regex support required, no ordering hazards, and
every legacy URL resolves in a single hop.

Both are generated from `places.js` / `tours.js`, so they cannot drift from the
routes the build emits. The generator refuses to write anything unless a
simulation proves the rules rewrite all 1,610 legacy URLs correctly **and** match
none of the 2,695 live published URLs. Re-run it after adding or renaming a
route:

```bash
node scripts/generate-redirects.js
```

> The generator writes LF line endings while the repo checks these files out as
> CRLF, so re-running it shows both files as modified even when nothing changed.
> Confirm with `git diff --numstat docs/redirects/` — if it reports no added or
> removed lines, the content is identical and you should `git checkout --` them
> rather than commit a line-ending-only diff.

## Option A — Bulk Redirects, step by step

1. Regenerate so the CSV matches the current routes:
   `node scripts/generate-redirects.js`
2. Cloudflare dashboard -> select the **hikasustravel.com** zone.
3. **Bulk Redirects** (left nav: *Rules -> Redirect Rules -> Bulk Redirects*).
4. **Create a new list**
   - Name: `hikasus-legacy-urls`
   - Content type: **Redirect**
   - Upload `docs/redirects/cloudflare-bulk-redirects.csv`
   - The CSV header is `source,target,status,preserve_query_string`, so status
     **301** and query preservation are already set per row — do not override.
5. **Create a Bulk Redirect Rule** that references the list, and deploy it.
6. Leave the prerendered stubs in place. They stay as a harmless fallback for
   anything that reaches the origin without passing the edge, and the 301 takes
   precedence for real traffic.

### Verify after deploying

```bash
curl -sI https://www.hikasustravel.com/en/things-to-do-in-tbilisi/ | head -3
# expect: HTTP/1.1 301   location: .../en/georgia/tbilisi/things-to-do-in-tbilisi/

curl -sI https://www.hikasustravel.com/en/destinations/cities/mestia/ | head -3
# expect: HTTP/1.1 301   location: .../en/georgia/mestia/
```

Then confirm no live page was caught by the rules — this must stay **200**:

```bash
curl -sI https://www.hikasustravel.com/en/georgia/regions/svaneti/ | head -1
# expect: HTTP/1.1 200
```

## Option B — Single Redirect Rules

Only if you are on a plan with the `matches` operator and prefer few rules. The
exact expressions, dynamic targets and the required rule **order** are in
`cloudflare-redirect-rules.md`.

> **Order is load-bearing.** Cloudflare stops at the first matching rule, so all
> exact rules must sit **above** the pattern rules, and `destinations-cities`
> must precede `destinations-tree`. Getting this wrong 301s a live page to a 404.
> The generator's simulation enforces exactly this ordering.

## Optional: collapse the `/index.html` duplicate

`/en/georgia/regions/svaneti/index.html` also returns 200 and is a crawlable
duplicate of the canonical directory URL. Its canonical tag already points at
the slash form and nothing on the site links to it, so this is low priority. If
you want it gone, add one Redirect Rule:

```
Rule name:  Strip /index.html
Expression: ends_with(http.request.uri.path, "/index.html")
Target:     concat("https://", http.host, substring(http.request.uri.path, 0, -10))
Status:     301
Preserve query string: Enabled
```

Verify the substring offset against a real request before deploying — an
off-by-one here would break every directory URL.
