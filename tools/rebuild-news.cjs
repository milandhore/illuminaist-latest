const { syncAllNews } = require('./update-news.cjs');

console.log('Rebuilding news items from disk and git history...');
syncAllNews();

