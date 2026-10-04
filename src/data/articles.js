export const articles = [
  {
    "slug": "building_production_rag_pipelines_with_langchain_pinecone",
    "topicSlug": "rag-agents",
    "category": "RAG & Agents",
    "difficulty": "Advanced",
    "title": "Building Production RAG Pipelines with LangChain & Pinecone",
    "excerpt": "A deep-dive into constructing retrieval-augmented generation systems that actually hold up in production.",
    "avatar": "AI",
    "author": "IlluminAIst",
    "readingTime": 1,
    "publishedAt": "2026-10-04",
    "htmlFile": true,
    "featured": false,
    "status": "published",
    "tags": [
      "Introduction",
      "2. Choosing Your Embedding Model",
      "Cost vs. Quality Trade-off",
      "3. Pinecone Serverless Setup",
      "4. Re-ranking for Precision",
      "5. Evaluating Your Pipeline",
      "LLM",
      "Vector DB"
    ]
  },
  {
    "slug": "agentic_ai_vs_generative_ai_strategic_architectural_comparison",
    "topicSlug": "rag-agents",
    "category": "RAG & Agents",
    "difficulty": "Advanced",
    "title": "Agentic AI vs Generative AI - Strategic Architectural Comparison",
    "excerpt": "Explore the critical difference between AI agents and LLMs. Our strategic architectural comparison of Agentic AI vs Generative AI guides enterprise adoption in 2026.",
    "avatar": "AI",
    "author": "IlluminAIst",
    "readingTime": 7,
    "publishedAt": "2026-10-04",
    "htmlFile": true,
    "featured": false,
    "status": "published",
    "tags": [
      "Generative AI (The Copilot)",
      "Agentic AI (The Actor)",
      "Architectural Selection Matrix",
      "The Architectural Stack Comparison",
      "LangGraph",
      "CrewAI",
      "RAG",
      "LLM"
    ]
  },
  {
    "slug": "agentic_ai_security_threat_vectors_sandboxing_and_governance",
    "topicSlug": "rag-agents",
    "category": "RAG & Agents",
    "difficulty": "Advanced",
    "title": "Agentic AI Security - Threat Vectors, Sandboxing, and Governance",
    "excerpt": "A comprehensive guide to mitigating agentic AI security risks. Learn about securing autonomous AI agents, sandboxing, and defending against indirect prompt injection.",
    "avatar": "AI",
    "author": "IlluminAIst",
    "readingTime": 6,
    "publishedAt": "2026-10-04",
    "htmlFile": true,
    "featured": false,
    "status": "published",
    "tags": [
      "The Anatomy of an Indirect Attack",
      "Execution Sandboxing Strategies",
      "The Ephemeral Container Approach",
      "LLM",
      "Docker",
      "AWS"
    ]
  },
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
