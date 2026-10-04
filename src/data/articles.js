export const articles = [
  {
    "slug": "enterprise_agentic_ai_real_world_use_cases_delivering_measured_roi",
    "topicSlug": "ai-llms",
    "category": "AI & LLMs",
    "difficulty": "Intermediate",
    "title": "Enterprise Agentic AI - Real-World Use Cases Delivering Measured ROI",
    "excerpt": "Discover real-world agentic ai enterprise use cases. Learn how businesses are measuring agentic AI ROI and integrating AI agents into core business operations.",
    "avatar": "AI",
    "author": "IlluminAIst",
    "readingTime": 6,
    "publishedAt": "2026-09-27",
    "htmlFile": true,
    "featured": false,
    "status": "published",
    "tags": []
  }
]
export const getPublishedArticles = () => articles.filter(a => a.status !== 'draft')
export const getFeaturedArticle = () => getPublishedArticles().find(a => a.featured) || getPublishedArticles()[0]
export const getArticleBySlug = (slug) => articles.find(a => a.slug === slug)
export const getArticlesByCategory = (category) => getPublishedArticles().filter(a => a.category === category)
