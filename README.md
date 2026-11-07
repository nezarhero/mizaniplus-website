# Mizani Plus – Official website

Static multilingual (German / English / Arabic) promotional website for Mizani Plus.

## Cloudflare Pages configuration
- Repository: `nezarhero/mizaniplus-website`
- Production branch: `main`
- Framework preset: `None`
- Build command: leave empty
- Build output directory: `.`

## Publish
Upload all files and the `assets` folder to the root of the GitHub repository, then deploy via Cloudflare Pages. After the Pages deployment succeeds, add `mizaniplus.de` under **Custom domains** and follow Cloudflare's DNS instructions for the GoDaddy-registered domain. Do not alter nameservers until Cloudflare displays the exact assigned values and you have reviewed existing DNS records, especially email records.

## Before public launch
- Replace sample screenshots containing potentially personal amounts with anonymized/demo data.
- Complete and legally review `legal.html` and `privacy.html`, including responsible party, address, actual hosting/privacy disclosures.
- Add real support contact to `support.html`.
- Add the official Google Play listing URL only after publication.
- Verify claims against the final Android release.

No build tools, trackers, remote fonts, analytics, or backend required. The language preference is stored locally in the browser.
