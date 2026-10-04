export const articles = [
  {
    "slug": "advanced_memory_systems_for_ai_agents_vector_dbs_graphrag",
    "topicSlug": "rag-agents",
    "category": "RAG & Agents",
    "difficulty": "Advanced",
    "title": "Advanced Memory Systems for AI Agents - Vector DBs & GraphRAG",
    "excerpt": "Moving beyond basic context windows. Learn how to implement Semantic Caching, Long-term Vector Storage, and GraphRAG for persistent agentic memory.",
    "avatar": "AI",
    "author": "IlluminAIst",
    "readingTime": 3,
    "publishedAt": "2026-10-04",
    "htmlFile": true,
    "featured": false,
    "status": "published",
    "tags": [
      "The Three Tiers of Agentic Memory",
      "The Hybrid Memory Architecture",
      "Agentic Hybrid Memory Subsystem",
      "LLM",
      "ChromaDB",
      "Embeddings"
    ]
  }
]
export const getPublishedArticles = () => articles.filter(a => a.status !== 'draft')
export const getFeaturedArticle = () => getPublishedArticles().find(a => a.featured) || getPublishedArticles()[0]
export const getArticleBySlug = (slug) => articles.find(a => a.slug === slug)
export const getArticlesByCategory = (category) => getPublishedArticles().filter(a => a.category === category)
