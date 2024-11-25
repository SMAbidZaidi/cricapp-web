/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: 'https://cricapp-web.vercel.app/',
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000,
    transform: async (config, path) => {
      return {
        loc: path,
        changefreq: config.changefreq,
        priority: config.priority,
        lastmod: new Date().toISOString(),
      };
    },
  };
  
  module.exports = config;
  