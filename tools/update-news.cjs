const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

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

async function rewriteArticle(title, originalSnippet, originalUrl) {
  if (!GEMINI_API_KEY) {
    console.warn("No GEMINI_API_KEY found, returning fallback snippet.");
    return {
      html: `<p>Original article: <a href="${originalUrl}">${originalUrl}</a></p>`,
      excerpt: originalSnippet
    };
  }

  const systemPrompt = `
Act as an experienced AI engineering expert and SEO copywriter, tasked with rewriting a "Google News for Artificial Intelligence Topic". 

CRITICAL REQUIREMENT: You must generate a NEW, highly engaging, negatively influencing, and SEO-optimized title. The title should focus on the risks, hidden dangers, or alarming aspects of the topic to maximize click-through rate (CTR).

Your primary goal for the content is to craft an enterprise-wide, scalable, and technically compelling piece that adheres to SEO best practices. The article should be well-researched, structured with headings (<h2>, <h3>), and use bullet points. Incorporate relevant keywords naturally. Include a strong call-to-action.

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
    const newTitle = parsedData.title.trim();

    // Validate if the generation was substantial enough to be an article
    if (htmlContent.length < 300 || !newTitle) {
      throw new Error("Generated content too short or missing title, skipping publication.");
    }

    const excerptMatch = htmlContent.match(/<p>(.*?)<\/p>/);
    const excerpt = excerptMatch ? excerptMatch[1].replace(/<[^>]+>/g, '').substring(0, 150) + '...' : originalSnippet;

    return { title: newTitle, html: htmlContent, excerpt };
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
      
      const htmlFull = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${finalTitle} | IlluminAIst</title>
  <meta name="description" content="${rewritten.excerpt}">
</head>
<body>
  ${rewritten.html}
</body>
</html>
      `.trim();
      fs.writeFileSync(articleFilePath, htmlFull, 'utf8');

      latestNews.push({
        id: idx + 1,
        title: finalTitle,
        excerpt: rewritten.excerpt,
        source: source, // Reverted from 'IlluminAIst AI Editor' to actual publisher
        slug: slug,
        htmlPath: `/articles/news/${slug}.html`,
        publishedAt: item.isoDate ? new Date(item.isoDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        badge: latestNews.length === 0 ? 'Breaking' : 'Latest',
        badgeColor: latestNews.length === 0 ? 'cyan' : 'amber',
        category: 'AI News'
      });
    }

    if (latestNews.length === 0) {
      console.error("No news fetched. Aborting update.");
      process.exit(1);
    }

    let existingNews = [];
    if (fs.existsSync(NEWS_FILE_PATH)) {
      const existingContent = fs.readFileSync(NEWS_FILE_PATH, 'utf8');
      const match = existingContent.match(/export const newsItems = (\[[\s\S]*\]);/);
      if (match && match[1]) {
        try {
          existingNews = JSON.parse(match[1]);
        } catch (e) {
          console.error("Error parsing existing news items, starting fresh.");
        }
      }
    }

    // Filter out duplicates based on slug
    const newSlugs = new Set(latestNews.map(n => n.slug));
    existingNews = existingNews.filter(n => !newSlugs.has(n.slug));

    const allNews = [...latestNews, ...existingNews];
    
    allNews.forEach((item, index) => {
      item.id = index + 1;
      item.badge = index === 0 ? 'Breaking' : 'Latest';
      item.badgeColor = index === 0 ? 'cyan' : 'amber';
    });

    const fileContent = `export const newsItems = ${JSON.stringify(allNews, null, 2)};\n`;
    fs.writeFileSync(NEWS_FILE_PATH, fileContent, 'utf8');
    
    console.log(`Successfully updated ${NEWS_FILE_PATH} with ${latestNews.length} new articles. Total: ${allNews.length}`);
  } catch (e) {
    console.error(`Error updating news:`, e);
    process.exit(1);
  }
}

updateNews();
