const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

const NEWS_JSON_PATH = path.join(__dirname, '../src/data/news.js');
const ARTICLES_JSON_PATH = path.join(__dirname, '../src/data/articles.js');
const NEWS_DIR = path.join(__dirname, '../public/articles/news');
const ARTICLES_DIR = path.join(__dirname, '../public/articles/main');

const upload = multer({ dest: '/tmp/', limits: { files: 100, fileSize: 5 * 1024 * 1024 } });

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
}

function plainText(html) {
  return String(html || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
}

function metaValue(html, name) {
  const pattern = new RegExp('<meta[^>]+name=["\\\']' + name + '["\\\'][^>]+content=["\\\']([^"\\\']+)', 'i');
  const reverse = new RegExp('<meta[^>]+content=["\\\']([^"\\\']+)["\\\'][^>]+name=["\\\']' + name + '["\\\']', 'i');
  const match = html.match(pattern) || html.match(reverse);
  return match ? match[1].trim() : '';
}

function sanitizeHtml(html) {
  return String(html || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+(?:href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\1/gi, '');
}

function inspectUpload(file, type, overrideTitle, overrideExcerpt, useOverrides) {
  const html = fs.readFileSync(file.path, 'utf8');
  const safeHtml = sanitizeHtml(html);
  const body = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/i) || [null, html])[1].trim();
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const headingMatch = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const fallbackTitle = file.originalname.replace(/\.html?$/i, '').replace(/[_-]+/g, ' ').trim();
  const title = (useOverrides && overrideTitle ? overrideTitle : (titleMatch ? titleMatch[1] : (headingMatch ? plainText(headingMatch[1]) : fallbackTitle)))
    .replace(/\s*\|\s*IlluminAIst\s*$/i, '').trim();
  const paragraph = body.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const excerpt = (useOverrides && overrideExcerpt ? overrideExcerpt : (metaValue(html, 'description') || (paragraph ? plainText(paragraph[1]) : plainText(body)))).slice(0, 280).trim();
  const words = plainText(body).split(/\s+/).filter(word => word.length > 2).length;
  const errors = [];
  if (!/^news$|^article$/.test(type)) errors.push('type must be news or article');
  if (!title || title.length < 5 || title.length > 180) errors.push('title must be 5–180 characters');
  if (!excerpt || excerpt.length < 20) errors.push('excerpt must contain at least 20 characters');
  if (words < 20) errors.push('HTML content must contain at least 20 words');
  if (/<(?:iframe|object|embed|form)\b/i.test(safeHtml)) errors.push('unsupported embedded element');
  const slug = slugify(title);
  if (!slug) errors.push('title must produce a valid URL slug');
  return { file, html: safeHtml, title, excerpt, slug, errors };
}

app.get('/', (req, res) => {
  let newsItems = [];
  try {
    const dataFile = fs.readFileSync(NEWS_JSON_PATH, 'utf8');
    const match = dataFile.match(/export const newsItems = (\[[\s\S]*?^\]);/m);
    if (match) newsItems = JSON.parse(match[1]);
  } catch(e) { console.error("newsItems parse error:", e); }

  let articles = [];
  try {
    const dataFile = fs.readFileSync(ARTICLES_JSON_PATH, 'utf8');
    const match = dataFile.match(/export const articles = (\[[\s\S]*?^\])/m);
    if (match) articles = JSON.parse(match[1]);
  } catch(e) { console.error("articles parse error:", e); }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>IlluminAIst Local CMS Portal</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; max-width: 1000px; margin: 0 auto; }
        .article-card { background: #1e293b; border: 1px solid #334155; padding: 1.5rem; margin-bottom: 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
        .article-info h3 { margin: 0 0 0.5rem 0; color: #38bdf8; }
        .article-info p { margin: 0; color: #94a3b8; font-size: 0.9rem; }
        button { background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: bold; }
        button:hover { background: #dc2626; }
        .btn-upload { background: #10b981; }
        .btn-upload:hover { background: #059669; }
        .header { margin-bottom: 2rem; border-bottom: 1px solid #334155; padding-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; }
        .upload-section { background: #1e293b; border: 1px solid #334155; padding: 2rem; border-radius: 8px; margin-bottom: 2rem; display: none; }
        .upload-section.active { display: block; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; color: #cbd5e1; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid #334155; background: #0f172a; color: white; }
        .tabs { display: flex; gap: 1rem; margin-bottom: 2rem; }
        .tab { padding: 0.5rem 1rem; background: #334155; cursor: pointer; border-radius: 4px; }
        .tab.active { background: #38bdf8; color: #0f172a; font-weight: bold; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>🔐 Local CMS Admin Portal</h1>
          <p>Securely manage your static articles and news.</p>
        </div>
        <button class="btn-upload" onclick="document.getElementById('uploadForm').classList.toggle('active')">➕ Upload New Content</button>
      </div>
      
      <div id="uploadForm" class="upload-section">
        <h2>Upload New HTML Article</h2>
        <form onsubmit="submitUpload(event)">
          <div class="form-group">
            <label>Type</label>
            <select id="uploadType" required>
              <option value="news">News Feed (news.js)</option>
              <option value="article">Main Article (articles.js)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Title (optional override for a single file)</label>
            <input type="text" id="uploadTitle">
          </div>
          <div class="form-group">
            <label>Excerpt / Description (optional override for a single file)</label>
            <textarea id="uploadExcerpt" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>HTML Files</label>
            <input type="file" id="uploadFile" accept=".html,.htm" multiple required onchange="inspectSelectedFiles(event)">
            <div id="uploadSummary" style="margin-top:.6rem;color:#94a3b8;font-size:.9rem"></div>
          </div>
          <button type="submit" class="btn-upload" style="width: 100%">Upload & Publish to GitHub</button>
        </form>
      </div>

      <div class="tabs">
        <div class="tab active" onclick="switchTab('news')">News Feed</div>
        <div class="tab" onclick="switchTab('articles')">Main Articles</div>
      </div>

      <div id="news-tab" class="tab-content active">
        <h2>News Feed</h2>
        ${newsItems.map(item => `
          <div class="article-card" id="news-${item.id}">
            <div class="article-info">
              <h3>${item.title}</h3>
              <p>Slug: ${item.slug}</p>
            </div>
            <button onclick="deleteItem('news', ${item.id}, '${item.slug}')">Delete</button>
          </div>
        `).join('')}
      </div>

      <div id="articles-tab" class="tab-content">
        <h2>Main Articles</h2>
        ${articles.map((item, idx) => `
          <div class="article-card" id="article-${idx}">
            <div class="article-info">
              <h3>${item.title}</h3>
              <p>Slug: ${item.slug}</p>
            </div>
            <button onclick="deleteItem('article', ${idx}, '${item.slug}')">Delete</button>
          </div>
        `).join('')}
      </div>

      <script>
        function switchTab(tab) {
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
          event.target.classList.add('active');
          document.getElementById(tab + '-tab').classList.add('active');
        }

        function inspectSelectedFiles(e) {
          const files = [...e.target.files];
          const summary = document.getElementById('uploadSummary');
          if (!files.length) { summary.textContent = ''; return; }
          summary.textContent = '✓ ' + files.length + ' HTML file' + (files.length === 1 ? '' : 's') + ' selected. Titles, excerpts, slugs, and content will be validated automatically.';
        }

        async function submitUpload(e) {
          e.preventDefault();
          const files = [...document.getElementById('uploadFile').files];
          if (!files.length) return alert('Select at least one HTML file.');
          const formData = new FormData();
          formData.append('type', document.getElementById('uploadType').value);
          formData.append('title', document.getElementById('uploadTitle').value);
          formData.append('excerpt', document.getElementById('uploadExcerpt').value);
          files.forEach(file => formData.append('files', file));

          try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
              alert('Successfully uploaded ' + data.count + ' HTML file' + (data.count === 1 ? '' : 's') + ' and pushed to GitHub!');
              window.location.reload();
            } else {
              alert('Error: ' + data.error);
            }
          } catch(err) {
            alert('Upload failed.');
          }
        }

        async function deleteItem(type, id, slug) {
          if (!confirm('Are you sure you want to permanently delete this from GitHub?')) return;
          try {
            const res = await fetch('/api/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type, id, slug })
            });
            const data = await res.json();
            if (data.success) {
              document.getElementById(type + '-' + id).remove();
              alert('Successfully deleted and pushed to GitHub!');
            } else {
              alert('Error: ' + data.error);
            }
          } catch(err) {
            alert('Failed to delete.');
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.post('/api/upload', upload.array('files', 100), (req, res) => {
  try {
    const { type, title, excerpt } = req.body;
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ success: false, error: 'At least one HTML file is required.' });
    const seenSlugs = new Set();
    const inspected = files.map(file => inspectUpload(file, type, title, excerpt, files.length === 1));
    inspected.forEach(item => {
      if (seenSlugs.has(item.slug)) item.errors.push('duplicate title creates the same URL slug');
      seenSlugs.add(item.slug);
    });
    const invalid = inspected.filter(item => item.errors.length);
    if (invalid.length) {
      files.forEach(file => { try { fs.unlinkSync(file.path); } catch (_) {} });
      return res.status(400).json({
        success: false,
        error: 'Upload validation failed; no files were published.',
        validationErrors: invalid.map(item => ({ fileName: item.file.originalname, errors: item.errors }))
      });
    }

    const date = new Date().toISOString().split('T')[0];
    const targetDir = type === 'news' ? NEWS_DIR : ARTICLES_DIR;
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // Update JSON
    if (type === 'news') {
      let dataFile = fs.readFileSync(NEWS_JSON_PATH, 'utf8');
      const match = dataFile.match(/export const newsItems = (\[[\s\S]*?^\]);/m);
      let newsItems = JSON.parse(match[1]);
      let nextId = newsItems.length > 0 ? Math.max(...newsItems.map(n => n.id)) + 1 : 1;
      inspected.forEach(item => {
        fs.writeFileSync(path.join(targetDir, `${item.slug}.html`), item.html, 'utf8');
        newsItems.unshift({
          id: nextId++, title: item.title, excerpt: item.excerpt, source: 'Manual Upload', slug: item.slug,
          htmlPath: `/articles/news/${item.slug}.html`, publishedAt: date, badge: 'New', badgeColor: 'emerald', category: 'AI News'
        });
      });
      dataFile = dataFile.replace(/export const newsItems = \[[\s\S]*?^\];/m, `export const newsItems = ${JSON.stringify(newsItems, null, 2)};`);
      fs.writeFileSync(NEWS_JSON_PATH, dataFile);
    } else {
      let dataFile = fs.readFileSync(ARTICLES_JSON_PATH, 'utf8');
      const match = dataFile.match(/export const articles = (\[[\s\S]*?^\])/m);
      let articles = JSON.parse(match[1]);
      inspected.forEach(item => {
        fs.writeFileSync(path.join(targetDir, `${item.slug}.html`), item.html, 'utf8');
        const wordCount = plainText(item.html).split(/\s+/).filter(word => word.length > 2).length;
        articles.unshift({
          slug: item.slug, topicSlug: 'ai-llms', category: 'AI & LLMs', difficulty: 'Intermediate',
          title: item.title, excerpt: item.excerpt, avatar: 'AI', author: 'IlluminAIst',
          readingTime: Math.max(1, Math.round(wordCount / 200)), publishedAt: date,
          htmlFile: true, featured: false, status: 'published', tags: []
        });
      });
      dataFile = dataFile.replace(/export const articles = \[[\s\S]*?^\]/m, `export const articles = ${JSON.stringify(articles, null, 2)}`);
      fs.writeFileSync(ARTICLES_JSON_PATH, dataFile);
    }

    // Git push
    execSync('git add src/data/ public/articles/');
    execSync(`git commit -m "CMS: Uploaded ${inspected.length} ${type} HTML file(s)"`);
    execSync('git push origin main');

    res.json({ success: true, count: inspected.length, results: inspected.map(item => ({ fileName: item.file.originalname, slug: item.slug })) });
  } catch (err) {
    (req.files || []).forEach(file => { try { fs.unlinkSync(file.path); } catch (_) {} });
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/delete', (req, res) => {
  const { type, id, slug } = req.body;
  
  try {
    if (type === 'news') {
      let dataFile = fs.readFileSync(NEWS_JSON_PATH, 'utf8');
      const match = dataFile.match(/export const newsItems = (\[[\s\S]*?^\]);/m);
      let newsItems = JSON.parse(match[1]);
      newsItems = newsItems.filter(n => n.id != id && n.slug !== slug);
      dataFile = dataFile.replace(/export const newsItems = \[[\s\S]*?^\];/m, `export const newsItems = ${JSON.stringify(newsItems, null, 2)};`);
      fs.writeFileSync(NEWS_JSON_PATH, dataFile);
      
      const htmlPath = path.join(NEWS_DIR, `${slug}.html`);
      if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);
    } else {
      let dataFile = fs.readFileSync(ARTICLES_JSON_PATH, 'utf8');
      const match = dataFile.match(/export const articles = (\[[\s\S]*?^\])/m);
      let articles = JSON.parse(match[1]);
      articles.splice(id, 1);
      dataFile = dataFile.replace(/export const articles = \[[\s\S]*?^\]/m, `export const articles = ${JSON.stringify(articles, null, 2)}`);
      fs.writeFileSync(ARTICLES_JSON_PATH, dataFile);

      const htmlPath = path.join(ARTICLES_DIR, `${slug}.html`);
      if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);
    }

    try {
      execSync('git add src/data/ public/articles/');
      execSync(`git commit -m "CMS: Deleted ${type} '${slug}'"`);
      execSync('git push origin main');
    } catch(gitErr) {
      console.warn("Git push failed but files deleted locally:", gitErr.message);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Local CMS Portal running at http://localhost:${PORT}`);
  console.log(`To open the portal, CMD+Click this link: http://localhost:${PORT}`);
});
