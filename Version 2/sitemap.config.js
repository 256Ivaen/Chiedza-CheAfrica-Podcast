/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://emergefamilysupport.co.uk/',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    outDir: 'out',
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
    },
  }