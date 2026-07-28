import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { WhatsAppFab, BackToTop } from '../components/layout/FloatingWidgets'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        title: 'Sri Subhakari Fashions — Elegance in Every Thread',
      },
      {
        name: 'description',
        content:
          'Discover beautiful sarees and ethnic wear crafted with elegance and tradition. Premium quality silk sarees, designer lehengas, and ethnic wear. Enquire on WhatsApp.',
      },
      { name: 'theme-color', content: '#c07dc4' },
      { property: 'og:site_name', content: 'Sri Subhakari Fashions' },
      { property: 'og:type', content: 'website' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: '' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFab />
        <BackToTop />

        <Scripts />
      </body>
    </html>
  )
}
