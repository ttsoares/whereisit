/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Set SITE_URL in Vercel (Settings → Environment Variables) to the production domain
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  exclude: ['/api/*', '/icon.ico'],
}
