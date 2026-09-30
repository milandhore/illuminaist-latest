const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();
const NEWS_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'news.js');

const RSS_URL = 'https://news.google.com/rss/search?q=Artificial+Intelligence+when:1d&hl=en-US&gl=US&ceid=US:en';

async function updateNews() {
  try {
    console.log('Fetching RSS feed...');
    const feed = await parser.parseURL(RSS_URL);
    
    // We want the top 4 articles
    const latestNews = feed.items.slice(0, 4).map((item, idx) => {
      // Google News titles often end with ' - Source Name'
      let title = item.title || '';
      let source = 'Google News';
      const lastDash = title.lastIndexOf(' - ');
      if (lastDash !== -1) {
        source = title.substring(lastDash + 3).trim();
        title = title.substring(0, lastDash).trim();
      }

      return {
        id: idx + 1,
        title: title,
        excerpt: (item.contentSnippet || item.content || '').substring(0, 150) + '...',
        source: source,
        externalUrl: item.link,
        publishedAt: item.isoDate ? new Date(item.isoDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        badge: idx === 0 ? 'Breaking' : 'Latest',
        badgeColor: idx === 0 ? 'cyan' : 'amber',
        category: 'AI News'
      };
    });

    if (latestNews.length === 0) {
      console.error("No news fetched. Aborting update.");
      process.exit(1);
    }

    const fileContent = `export const newsItems = ${JSON.stringify(latestNews, null, 2)};\n`;

    fs.writeFileSync(NEWS_FILE_PATH, fileContent, 'utf8');
    console.log(`Successfully updated ${NEWS_FILE_PATH} with ${latestNews.length} articles.`);
  } catch (e) {
    console.error(`Error updating news:`, e);
    process.exit(1);
  }
}

updateNews();
