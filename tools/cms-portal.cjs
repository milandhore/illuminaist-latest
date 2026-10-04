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

const upload = multer({ dest: '/tmp/' });

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
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
            <label>Title</label>
            <input type="text" id="uploadTitle" required>
          </div>
          <div class="form-group">
            <label>Excerpt / Description</label>
            <textarea id="uploadExcerpt" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label>HTML File</label>
            <input type="file" id="uploadFile" accept=".html" required>
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

        async function submitUpload(e) {
          e.preventDefault();
          const formData = new FormData();
          formData.append('type', document.getElementById('uploadType').value);
          formData.append('title', document.getElementById('uploadTitle').value);
          formData.append('excerpt', document.getElementById('uploadExcerpt').value);
          formData.append('file', document.getElementById('uploadFile').files[0]);

          try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
              alert('Successfully uploaded and pushed to GitHub!');
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

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    const { type, title, excerpt } = req.body;
    const slug = slugify(title);
    const date = new Date().toISOString().split('T')[0];

    // Move file
    const targetDir = type === 'news' ? NEWS_DIR : ARTICLES_DIR;
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    
    const targetPath = path.join(targetDir, `${slug}.html`);
    fs.renameSync(req.file.path, targetPath);

    // Update JSON
    if (type === 'news') {
      let dataFile = fs.readFileSync(NEWS_JSON_PATH, 'utf8');
      const match = dataFile.match(/export const newsItems = (\[[\s\S]*?^\]);/m);
      let newsItems = JSON.parse(match[1]);
      
      const newId = newsItems.length > 0 ? Math.max(...newsItems.map(n => n.id)) + 1 : 1;
      newsItems.unshift({
        id: newId,
        title: title,
        excerpt: excerpt,
        source: 'Manual Upload',
        slug: slug,
        htmlPath: `/articles/news/${slug}.html`,
        publishedAt: date,
        badge: "New",
        badgeColor: "emerald",
        category: "AI News"
      });
      
      dataFile = dataFile.replace(/export const newsItems = \[[\s\S]*?^\];/m, `export const newsItems = ${JSON.stringify(newsItems, null, 2)};`);
      fs.writeFileSync(NEWS_JSON_PATH, dataFile);
    } else {
      let dataFile = fs.readFileSync(ARTICLES_JSON_PATH, 'utf8');
      const match = dataFile.match(/export const articles = (\[[\s\S]*?^\])/m);
      let articles = JSON.parse(match[1]);
      
      articles.unshift({
        slug: slug,
        topicSlug: "ai-llms",
        category: "AI & LLMs",
        difficulty: "Beginner",
        title: title,
        excerpt: excerpt,
        avatar: "AI",
        author: "IlluminAIst",
        readingTime: 5,
        publishedAt: date,
        htmlFile: true,
        featured: false,
        status: "published",
        tags: []
      });
      
      dataFile = dataFile.replace(/export const articles = \[[\s\S]*?^\]/m, `export const articles = ${JSON.stringify(articles, null, 2)}`);
      fs.writeFileSync(ARTICLES_JSON_PATH, dataFile);
    }

    // Git push
    execSync('git add src/data/ public/articles/');
    execSync(`git commit -m "CMS: Uploaded new ${type} '${slug}'"`);
    execSync('git push origin main');

    res.json({ success: true });
  } catch (err) {
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
