import HeroSpotlight from '../components/home/HeroSpotlight'
import TrendingTicker from '../components/home/TrendingTicker'
import ArticleFeed from '../components/home/ArticleFeed'
import AdBanner from '../components/ads/AdBanner'
import InlineSubscribe from '../components/subscription/InlineSubscribe'
import { getPublishedArticles, getFeaturedArticle } from '../data/articles'

export default function HomePage() {
  const featured = getFeaturedArticle()
  const rest = getPublishedArticles().filter(a => !a.featured)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Ad: Leaderboard */}
      <AdBanner slot="header" />

      {/* Hero */}
      <HeroSpotlight article={featured} />

      {/* Ticker */}
      <TrendingTicker />

      {/* Article feed */}
      <ArticleFeed articles={rest} />

      {/* Subscribe CTA */}
      <InlineSubscribe />

      {/* Bottom ad */}
      <AdBanner slot="bottom-feed" />
    </div>
  )
}
