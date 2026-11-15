const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const parser = new Parser();
const NEWS_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'news.js');
const ARTICLES_DIR = path.join(__dirname, '..', 'public', 'articles', 'news');

// Ensure the directory exists
if (!fs.existsSync(ARTICLES_DIR)) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
}

const RSS_URL = 'https://news.google.com/rss/search?q=Artificial+Intelligence+when:1d&hl=en-US&gl=US&ceid=US:en';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const { GoogleGenerativeAI } = require("@google/generative-ai");

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function conciseTitle(text) {
  let title = String(text || '')
    .replace(/^(warning|grave warning|breaking news|the ai nightmare unfolds|the ai time bomb|the ai black box)\s*[:—-]\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (title.length > 72 && title.includes(':')) {
    const [lead, detail] = title.split(/:\s*/, 2);
    title = `${lead}: ${detail.slice(0, 27).replace(/\s+\S*$/, '').trim()}…`;
  }
  return title.length > 72 ? `${title.slice(0, 68).replace(/\s+\S*$/, '').trim()}…` : title;
}

function shortExcerpt(text) {
  const clean = String(text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length <= 84) return clean;
  return `${clean.slice(0, 80).replace(/\s+\S*$/, '').trim()}…`;
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function validSourceUrl(value) {
  return /^https?:\/\//i.test(String(value || '')) ? String(value) : '';
}

async function rewriteArticle(title, originalSnippet, originalUrl) {
  if (!GEMINI_API_KEY) {
    console.warn("No GEMINI_API_KEY found, returning fallback snippet.");
    return {
      title: conciseTitle(title),
      html: `<h2>${escapeHtml(title)}</h2><p>${escapeHtml(originalSnippet)}</p>`,
      excerpt: shortExcerpt(originalSnippet),
      sourceUrl: validSourceUrl(originalUrl)
    };
  }

  const systemPrompt = `
Act as an experienced AI engineering expert and SEO copywriter, tasked with rewriting a "Google News for Artificial Intelligence Topic". 

CRITICAL REQUIREMENT: Generate a concise, credible, highly engaging title that makes the reader want context. Keep it under 72 characters, use normal headline capitalization, and avoid sensational prefixes such as "WARNING", "GRAVE WARNING", or "THE AI TIME BOMB".

Write the opening summary as a fact-first quick read: 1–2 short sentences, under 140 characters where possible. State what happened, who is affected, and why it matters. Do not use vague promotional language.

Your primary goal for the content is to craft an enterprise-wide, scalable, and technically compelling piece that adheres to SEO best practices. The article should be well-researched, structured with headings (<h2>, <h3>), and use bullet points. Incorporate relevant keywords naturally. Include a strong call-to-action. The title and first summary must be useful before the reader clicks.

OUTPUT FORMAT:
You MUST output ONLY a valid JSON object with exactly two keys: "title" and "html". Do not include markdown code blocks like \`\`\`json.
Example:
{
  "title": "The Hidden Dangers of AI: Why Your Enterprise is at Risk",
  "html": "<h2>Navigating the Threat...</h2><p>Content goes here...</p>"
}

Topic: ${title}
Context: ${originalSnippet}
`;

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    let jsonText = response.text().trim();
    
    if (jsonText.startsWith('\`\`\`json')) jsonText = jsonText.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    if (jsonText.startsWith('\`\`\`')) jsonText = jsonText.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');

    const parsedData = JSON.parse(jsonText);
    const htmlContent = parsedData.html.trim();
    const newTitle = conciseTitle(parsedData.title.trim());

    // Validate if the generation was substantial enough to be an article
    if (htmlContent.length < 300 || !newTitle) {
      throw new Error("Generated content too short or missing title, skipping publication.");
    }

    const excerptMatch = htmlContent.match(/<p>(.*?)<\/p>/);
    const excerpt = excerptMatch ? shortExcerpt(excerptMatch[1]) : shortExcerpt(originalSnippet);

    return { title: newTitle, html: htmlContent, excerpt, sourceUrl: validSourceUrl(originalUrl) };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null; // Return null on failure to trigger skip
  }
}

async function updateNews() {
  try {
    console.log('Fetching RSS feed...');
    const feed = await parser.parseURL(RSS_URL);
    
    const topItems = feed.items.slice(0, 3); // Try 3 in case 1 fails
    const latestNews = [];

    for (let idx = 0; idx < topItems.length; idx++) {
      if (latestNews.length >= 2) break; // Only publish 2 maximum

      const item = topItems[idx];
      let originalTitle = item.title || '';
      let source = 'Google News';
      const lastDash = originalTitle.lastIndexOf(' - ');
      if (lastDash !== -1) {
        source = originalTitle.substring(lastDash + 3).trim();
        originalTitle = originalTitle.substring(0, lastDash).trim();
      }

      console.log(`Rewriting article: ${originalTitle}`);
      const rewritten = await rewriteArticle(originalTitle, item.contentSnippet || item.content || '', item.link);
      
      // Skip if generation failed validation
      if (!rewritten) {
        console.warn(`Skipping article "${originalTitle}" due to generation failure.`);
        continue;
      }
      
      const finalTitle = rewritten.title;
      const slug = slugify(finalTitle);
      const articleFilePath = path.join(ARTICLES_DIR, `${slug}.html`);
      const sourceUrl = rewritten.sourceUrl || validSourceUrl(item.link);
      const sourceAttribution = sourceUrl
        ? `<p><strong>Source:</strong> <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source)}</a></p>`
        : '';
      
      const htmlFull = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(finalTitle)} | IlluminAIst</title>
  <meta name="description" content="${escapeHtml(rewritten.excerpt)}">
</head>
<body>
  ${rewritten.html}
  ${sourceAttribution}
</body>
</html>
      `.trim();
      fs.writeFileSync(articleFilePath, htmlFull, 'utf8');

      latestNews.push({
        id: idx + 1,
        title: finalTitle,
        excerpt: rewritten.excerpt,
        source: source, // Reverted from 'IlluminAIst AI Editor' to actual publisher
        sourceUrl: sourceUrl || undefined,
        slug: slug,
        htmlPath: `/articles/news/${slug}.html`,
        publishedAt: item.isoDate ? new Date(item.isoDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        badge: latestNews.length === 0 ? 'Breaking' : 'Latest',
        badgeColor: latestNews.length === 0 ? 'cyan' : 'amber',
        category: 'AI News'
      });
    }

    syncAllNews(latestNews);
  } catch (e) {
    console.error(`Error updating news:`, e);
    // Still ensure all existing files on disk are synced
    try { syncAllNews(); } catch (_) {}
    process.exit(1);
  }
}

/**
 * Synchronizes all news articles from public/articles/news into src/data/news.js.
 * Preserves all metadata, incorporates new items, scans for any unindexed HTML files,
 * sorts chronologically, and re-indexes IDs.
 */
function syncAllNews(newlyAdded = []) {
  const newsMap = new Map();

  // 1. Load existing news from src/data/news.js
  if (fs.existsSync(NEWS_FILE_PATH)) {
    try {
      const existingContent = fs.readFileSync(NEWS_FILE_PATH, 'utf8');
      const match = existingContent.match(/export const newsItems = (\[[\s\S]*\]);/);
      if (match && match[1]) {
        const arr = JSON.parse(match[1]);
        arr.forEach(item => {
          if (item && item.slug) {
            newsMap.set(item.slug, {
              ...item,
              title: conciseTitle(item.title),
              excerpt: shortExcerpt(item.excerpt)
            });
          }
        });
      }
    } catch (e) {
      console.warn("Could not parse existing newsItems from news.js, scanning disk...", e.message);
    }
  }

  // 2. Put newly added items (these take priority with fresh metadata)
  newlyAdded.forEach(item => {
    if (item && item.slug) newsMap.set(item.slug, item);
  });

  // 3. Scan all HTML files in public/articles/news/
  if (fs.existsSync(ARTICLES_DIR)) {
    const htmlFiles = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.html'));

    htmlFiles.forEach(file => {
      const slug = file.replace(/\.html$/, '');
      if (!newsMap.has(slug)) {
        const htmlContent = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
        const titleMatch = htmlContent.match(/<title>(.*?) \| IlluminAIst<\/title>/i) || htmlContent.match(/<title>(.*?)<\/title>/i);
        const excerptMatch = htmlContent.match(/<meta name="description" content="(.*?)">/i);

        let title = titleMatch ? titleMatch[1].trim() : slug.replace(/_/g, ' ');
        let excerpt = excerptMatch ? excerptMatch[1].trim() : 'Read the full article to learn more about this AI news.';
        title = conciseTitle(title);
        excerpt = shortExcerpt(excerpt);

        let publishedAt = new Date().toISOString().split('T')[0];
        try {
          const gitDate = cp.execSync(`git log -1 --format="%as" -- "${path.join(ARTICLES_DIR, file)}"`, { encoding: 'utf8' }).trim();
          if (gitDate) publishedAt = gitDate;
        } catch (_) {
          try {
            const stat = fs.statSync(path.join(ARTICLES_DIR, file));
            publishedAt = stat.mtime.toISOString().split('T')[0];
          } catch (_) {}
        }

        newsMap.set(slug, {
          title,
          excerpt,
          source: 'Google News',
          slug,
          htmlPath: `/articles/news/${file}`,
          publishedAt,
          category: 'AI News'
        });
      }
    });
  }

  // 4. Convert to array and sort descending by publishedAt
  const allNews = Array.from(newsMap.values());
  allNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt) || a.title.localeCompare(b.title));

  // 5. Reassign IDs and badges
  allNews.forEach((item, index) => {
    item.id = index + 1;
    item.badge = index === 0 ? 'Breaking' : 'Latest';
    item.badgeColor = index === 0 ? 'cyan' : 'amber';
  });

  // 6. Write to NEWS_FILE_PATH
  const fileContent = `export const newsItems = ${JSON.stringify(allNews, null, 2)};\n`;
  fs.writeFileSync(NEWS_FILE_PATH, fileContent, 'utf8');
  console.log(`Successfully synced ${allNews.length} total news items in ${NEWS_FILE_PATH}`);

  // 7. Dispatch Subscriber Alerts for new news
  try {
    const ALERTS_SRC = path.join(__dirname, '..', 'src', 'data', 'alerts.json');
    const ALERTS_PUB = path.join(__dirname, '..', 'public', 'alerts.json');
    let alerts = [];
    if (fs.existsSync(ALERTS_SRC)) {
      alerts = JSON.parse(fs.readFileSync(ALERTS_SRC, 'utf8'));
    }
    const topNews = allNews[0];
    if (topNews && !alerts.some(a => a.slug === topNews.slug)) {
      const newAlert = {
        id: 'alert-news-' + Date.now(),
        type: 'news',
        title: topNews.title,
        slug: topNews.slug,
        excerpt: topNews.excerpt,
        url: `/news/${topNews.slug}`,
        timestamp: new Date().toISOString(),
        recipientsCount: 10450
      };
      alerts.unshift(newAlert);
      fs.writeFileSync(ALERTS_SRC, JSON.stringify(alerts.slice(0, 50), null, 2), 'utf8');
      fs.writeFileSync(ALERTS_PUB, JSON.stringify(alerts.slice(0, 50), null, 2), 'utf8');
      console.log(`📢 Dispatched subscriber news alert for: "${topNews.title}"`);
    }
  } catch (alertErr) {
    console.warn('Could not update alerts feed:', alertErr.message);
  }

  return allNews;
}

module.exports = { syncAllNews, updateNews };

if (require.main === module) {
  updateNews();
}
