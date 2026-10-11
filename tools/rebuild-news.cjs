const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '..', 'public', 'articles', 'news');
const NEWS_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'news.js');

function rebuildNews() {
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.html'));
  
  const newsItems = [];
  
  files.forEach((file, index) => {
    const htmlContent = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
    
    const titleMatch = htmlContent.match(/<title>(.*?) \| IlluminAIst<\/title>/);
    const excerptMatch = htmlContent.match(/<meta name="description" content="(.*?)">/);
    
    let title = titleMatch ? titleMatch[1] : file.replace('.html', '').replace(/_/g, ' ');
    let excerpt = excerptMatch ? excerptMatch[1] : 'Read the full article to learn more about this AI news.';
    const slug = file.replace('.html', '');
    
    // Attempt to extract publishedAt from file stat or use a default
    const stat = fs.statSync(path.join(ARTICLES_DIR, file));
    const publishedAt = stat.mtime.toISOString().split('T')[0];

    newsItems.push({
      id: index + 1,
      title: title,
      excerpt: excerpt,
      source: "Google News",
      slug: slug,
      htmlPath: `/articles/news/${file}`,
      publishedAt: publishedAt,
      badge: index === 0 ? "Breaking" : "Latest",
      badgeColor: index === 0 ? "cyan" : "amber",
      category: "AI News"
    });
  });

  // Sort by publishedAt descending, though file stats might all be today if just cloned/pulled.
  newsItems.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  
  // Reassign IDs after sort
  newsItems.forEach((item, index) => {
    item.id = index + 1;
    item.badge = index === 0 ? "Breaking" : "Latest";
    item.badgeColor = index === 0 ? "cyan" : "amber";
  });

  const fileContent = `export const newsItems = ${JSON.stringify(newsItems, null, 2)};\n`;
  fs.writeFileSync(NEWS_FILE_PATH, fileContent, 'utf8');
  console.log(`Rebuilt news.js with ${newsItems.length} articles.`);
}

rebuildNews();
