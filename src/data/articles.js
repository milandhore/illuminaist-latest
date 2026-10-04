export const articles = []
export const getPublishedArticles = () => articles.filter(a => a.status !== 'draft')
export const getFeaturedArticle = () => getPublishedArticles().find(a => a.featured) || getPublishedArticles()[0]
export const getArticleBySlug = (slug) => articles.find(a => a.slug === slug)
export const getArticlesByCategory = (category) => getPublishedArticles().filter(a => a.category === category)
