import Header from './Header'
import Footer from './Footer'

export default function Layout({ children, onSubscribeClick }) {
  return (
    <div className="min-h-screen flex flex-col bg-obsidian">
      <Header onSubscribeClick={onSubscribeClick} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
