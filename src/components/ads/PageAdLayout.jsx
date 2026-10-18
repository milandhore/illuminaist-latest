import AdBanner from './AdBanner'

export default function PageAdLayout({ children }) {
  return (
    <div className="page-ad-layout px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto mb-10">
        <AdBanner slot="header" />
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 2xl:grid-cols-[250px_minmax(0,896px)_250px] gap-8 items-start justify-center">
        <aside className="hidden 2xl:block">
          <div className="sticky top-24">
            <AdBanner slot="sidebar" className="page-ad-rail" />
          </div>
        </aside>

        <main className="page-ad-content w-full max-w-4xl mx-auto min-w-0">
          {children}
        </main>

        <aside className="hidden 2xl:block">
          <div className="sticky top-24">
            <AdBanner slot="sidebar" className="page-ad-rail" />
          </div>
        </aside>
      </div>

      <div className="max-w-4xl mx-auto mt-10">
        <AdBanner slot="bottom-feed" />
      </div>
    </div>
  )
}
