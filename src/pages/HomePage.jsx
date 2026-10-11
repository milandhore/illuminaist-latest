import HeroSpotlight from '../components/home/HeroSpotlight'
import TrendingTicker from '../components/home/TrendingTicker'
import ArticleFeed from '../components/home/ArticleFeed'
import AdBanner from '../components/ads/AdBanner'
import InlineSubscribe from '../components/subscription/InlineSubscribe'
import { getPublishedArticles, getFeaturedArticle } from '../data/articles'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function HomePage() {
  const featured = getFeaturedArticle()
  const rest = getPublishedArticles().filter(a => !a.featured)

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Ad: Leaderboard */}
      <motion.div variants={itemVariants}>
        <AdBanner slot="header" />
      </motion.div>

      {/* Hero */}
      <motion.div variants={itemVariants}>
        <HeroSpotlight article={featured} />
      </motion.div>

      {/* Ticker */}
      <motion.div variants={itemVariants}>
        <TrendingTicker />
      </motion.div>

      {/* Article feed */}
      <motion.div variants={itemVariants}>
        <ArticleFeed articles={rest} />
      </motion.div>

      {/* Subscribe CTA */}
      <motion.div variants={itemVariants}>
        <InlineSubscribe />
      </motion.div>

      {/* Bottom ad */}
      <motion.div variants={itemVariants}>
        <AdBanner slot="bottom-feed" />
      </motion.div>
    </motion.div>
  )
}
