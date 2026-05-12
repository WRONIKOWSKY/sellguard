const SITE = "https://www.sellcov.com";

const STATIC_PATHS = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/demo", priority: "0.9", changefreq: "monthly" },
  { path: "/protection", priority: "0.9", changefreq: "monthly" },
  { path: "/annonce", priority: "0.9", changefreq: "monthly" },
  { path: "/litige", priority: "0.9", changefreq: "monthly" },
  { path: "/faq", priority: "0.8", changefreq: "monthly" },
  { path: "/compte", priority: "0.6", changefreq: "monthly" },
  { path: "/calculateur", priority: "0.6", changefreq: "monthly" },
  { path: "/guide", priority: "0.6", changefreq: "monthly" },
  { path: "/blog", priority: "0.7", changefreq: "weekly" },
  { path: "/mentions-legales", priority: "0.3", changefreq: "yearly" },
  { path: "/cgu", priority: "0.3", changefreq: "yearly" },
  { path: "/confidentialite", priority: "0.3", changefreq: "yearly" },
];

function buildSitemap() {
  const today = new Date().toISOString().split("T")[0];
  const urls = STATIC_PATHS.map(
    ({ path, priority, changefreq }) => `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  res.write(buildSitemap());
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
