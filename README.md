# The Daily Bucket

One page site for The Daily Bucket golf channel.

- Static site: `index.html`, `images/`, favicons. No build step.
- Deploy on Netlify with the publish directory set to the repo root. Netlify picks up `netlify/functions/shorts.mjs` automatically.
- `/api/shorts` returns the channel's latest YouTube uploads from YouTube's public RSS feed (no API key). Netlify caches it for an hour, so new videos show up within about an hour.
- If the function ever fails, the page falls back to a single YouTube player with the channel's uploads.
