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
Act as an experienced AI engineering expert and SEO copywriter, tasked with writing an enterprise grade news and readable article based on the provided "Google News for Artificial Intelligence Topic". 
Your primary goal is to craft a Enterprise wide scalable technically compelling solution, informative piece that not only adheres to SEO best practices but also ranks high on search engines for the chosen keywords. 
The article should be well-researched, engaging to the target audience, and structured in a way that enhances readability (using headings, subheadings, bullet points, etc.). 
Incorporate relevant keywords naturally throughout the text, without compromising the flow or quality of the content. 
Ensure that the article answers the questions or solves the problems outlined, providing value to the reader. 
Additionally, include a strong call-to-action that encourages reader engagement.

OUTPUT FORMAT:
Provide ONLY valid HTML inside a <section> tag. Do not include markdown code blocks (\`\`\`html). Use <h2>, <h3>, <p>, <ul>, etc.
Do NOT include the main <h1> title, as it will be rendered by the application UI.

Topic: ${title}
Context: ${originalSnippet}
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: systemPrompt }]
        }]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    let htmlContent = data.candidates[0].content.parts[0].text.trim();
    // Clean markdown formatting if the model accidentally included it
    if (htmlContent.startsWith('\`\`\`html')) htmlContent = htmlContent.replace(/^\`\`\`html\n/, '').replace(/\n\`\`\`$/, '');

    // Generate a short excerpt for the UI card
    const excerptMatch = htmlContent.match(/<p>(.*?)<\/p>/);
    const excerpt = excerptMatch ? excerptMatch[1].replace(/<[^>]+>/g, '').substring(0, 150) + '...' : originalSnippet;

    return { html: htmlContent, excerpt };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { html: `<p>${originalSnippet}</p>`, excerpt: originalSnippet };
  }
}

async function updateNews() {
  try {
    console.log('Fetching RSS feed...');
    const feed = await parser.parseURL(RSS_URL);
    
    // We only process the top 2 articles per run to save API costs & time
    const topItems = feed.items.slice(0, 2);
    const latestNews = [];

    for (let idx = 0; idx < topItems.length; idx++) {
      const item = topItems[idx];
      
      let title = item.title || '';
      let source = 'Google News';
      const lastDash = title.lastIndexOf(' - ');
      if (lastDash !== -1) {
        source = title.substring(lastDash + 3).trim();
        title = title.substring(0, lastDash).trim();
      }

      console.log(`Rewriting article: ${title}`);
      const rewritten = await rewriteArticle(title, item.contentSnippet || item.content || '', item.link);
      
      const slug = slugify(title);
      const articleFilePath = path.join(ARTICLES_DIR, `${slug}.html`);
      
      // Save the generated HTML
      const htmlFull = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} | IlluminAIst</title>
  <meta name="description" content="${rewritten.excerpt}">
</head>
<body>
  ${rewritten.html}
</body>
</html>
      `.trim();
      fs.writeFileSync(articleFilePath, htmlFull, 'utf8');

      // We will link to our own internal path now instead of the external URL
      latestNews.push({
        id: idx + 1,
        title: title,
        excerpt: rewritten.excerpt,
        source: 'IlluminAIst AI Editor',
        slug: slug,
        htmlPath: `/articles/news/${slug}.html`,
        publishedAt: item.isoDate ? new Date(item.isoDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        badge: idx === 0 ? 'Breaking' : 'Latest',
        badgeColor: idx === 0 ? 'cyan' : 'amber',
        category: 'AI News'
      });
    }

    if (latestNews.length === 0) {
      console.error("No news fetched. Aborting update.");
      process.exit(1);
    }

    const fileContent = `export const newsItems = ${JSON.stringify(latestNews, null, 2)};\n`;
    fs.writeFileSync(NEWS_FILE_PATH, fileContent, 'utf8');
    
    console.log(`Successfully rewritten and updated ${NEWS_FILE_PATH} with ${latestNews.length} original articles.`);
  } catch (e) {
    console.error(`Error updating news:`, e);
    process.exit(1);
  }
}

updateNews();
