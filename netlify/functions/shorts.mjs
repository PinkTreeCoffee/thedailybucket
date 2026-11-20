// Returns the latest uploads from The Daily Bucket YouTube channel as JSON.
// Reads YouTube's public RSS feed, so no API key is needed.
// Netlify's CDN caches the answer for an hour, so the function runs rarely.
const CHANNEL_ID = "UCsbA9yxnpoWz8hBcoe9dsBQ";

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&#39;/g, "'");

export function parseFeed(xml) {
  const videos = [];
  for (const entry of xml.split("<entry>").slice(1)) {
    const id = (entry.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/) || [])[1];
    const title = (entry.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
    const published = (entry.match(/<published>([^<]+)<\/published>/) || [])[1];
    if (id) videos.push({ id, title: decode(title || ""), published: published || "" });
  }
  return videos;
}

export default async () => {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
    if (!res.ok) throw new Error(`YouTube feed returned ${res.status}`);
    const videos = parseFeed(await res.text());
    return new Response(JSON.stringify({ videos }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
        "Netlify-CDN-Cache-Control": "public, durable, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ videos: [], error: String(err) }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
};

export const config = { path: "/api/shorts" };
