import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import HeroBanner from '../components/home/HeroBanner'
import CategoryQuickNav from '../components/home/CategoryQuickNav'
import ProductSection from '../components/home/ProductSection'
import WhyChooseUs from '../components/home/WhyChooseUs'
import Testimonials from '../components/home/Testimonials'
import YouTubeSection from '../components/home/YouTubeSection'
import ContactCTA from '../components/home/ContactCTA'
import {
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getFestivalProducts,
} from '../services/products'
import { getCollections } from '../services/collections'
import { getYoutubeVideos } from '../services/youtube'

export const Route = createFileRoute('/')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['featured-products'],
        queryFn: getFeaturedProducts,
      }),
      queryClient.ensureQueryData({
        queryKey: ['best-sellers'],
        queryFn: getBestSellers,
      }),
      queryClient.ensureQueryData({
        queryKey: ['new-arrivals'],
        queryFn: getNewArrivals,
      }),
      queryClient.ensureQueryData({
        queryKey: ['festival-products'],
        queryFn: getFestivalProducts,
      }),
      queryClient.ensureQueryData({
        queryKey: ['collections'],
        queryFn: getCollections,
      }),
      queryClient.ensureQueryData({
        queryKey: ['youtube-videos'],
        queryFn: getYoutubeVideos,
      }),
    ])
  },
  head: () => ({
    meta: [
      { title: 'Sri Subhakari Fashions — Premium Sarees & Ethnic Wear' },
      {
        name: 'description',
        content:
          'Shop premium sarees, silk sarees, tops, lehengas and ethnic wear at Sri Subhakari Fashions. Beautiful handcrafted ethnic wear with WhatsApp enquiry.',
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const { data: collections = [] } = useQuery({
    queryKey: ['collections'],
    queryFn: getCollections,
    staleTime: 5 * 60 * 1000,
  })

  const { data: featured, isLoading: loadingFeatured } = useQuery({
    queryKey: ['featured-products'],
    queryFn: getFeaturedProducts,
    staleTime: 5 * 60 * 1000,
  })

  const { data: bestSellers, isLoading: loadingBest } = useQuery({
    queryKey: ['best-sellers'],
    queryFn: getBestSellers,
    staleTime: 5 * 60 * 1000,
  })

  const { data: newArrivals, isLoading: loadingNew } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: getNewArrivals,
    staleTime: 5 * 60 * 1000,
  })

  const { data: festivalProducts, isLoading: loadingFestival } = useQuery({
    queryKey: ['festival-products'],
    queryFn: getFestivalProducts,
    staleTime: 5 * 60 * 1000,
  })

  const { data: youtubeVideos } = useQuery({
    queryKey: ['youtube-videos'],
    queryFn: getYoutubeVideos,
    staleTime: 5 * 60 * 1000,
  })

  // Find collection metadata from Sanity
  const featuredCol = collections.find((c) => c.slug === 'featured-sarees')
  const newArrivalsCol = collections.find((c) => c.slug === 'new-arrivals')
  const bestSellersCol = collections.find((c) => c.slug === 'best-sellers')
  const festivalCol = collections.find((c) => c.slug === 'festival-collections')

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Quick Nav Story Carousel */}
      <CategoryQuickNav />

      {/* Featured Sarees Section */}
      <ProductSection
        sectionId="featured"
        badge={featuredCol?.badge?.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim() || 'Handpicked'}
        title={featuredCol?.title || 'Featured Sarees'}
        subtitle={
          featuredCol?.subtitle ||
          'Explore our most-loved collection of sarees and ethnic wear, each crafted for the modern woman who celebrates tradition.'
        }
        products={featured || []}
        isLoading={loadingFeatured}
        viewAllLink="/shop?collection=featured-sarees"
        viewAllLabel={featuredCol?.view_all_label || 'View All Featured Sarees'}
      />

      {/* New Arrivals Section */}
      <ProductSection
        sectionId="new-arrivals"
        badge={newArrivalsCol?.badge?.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim() || 'Just Arrived'}
        title={newArrivalsCol?.title || 'New Arrivals'}
        subtitle={
          newArrivalsCol?.subtitle ||
          'Be the first to discover our freshest designs — straight from the looms of master weavers.'
        }
        products={newArrivals || []}
        isLoading={loadingNew}
        viewAllLink="/shop?collection=new-arrivals"
        viewAllLabel={newArrivalsCol?.view_all_label || 'See All New Arrivals'}
      />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Best Sellers Section */}
      <ProductSection
        sectionId="best-sellers"
        badge={bestSellersCol?.badge?.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim() || 'Top Rated'}
        title={bestSellersCol?.title || 'Best Sellers'}
        subtitle={
          bestSellersCol?.subtitle ||
          'Our most popular designs — chosen by thousands of happy customers across India.'
        }
        products={bestSellers || []}
        isLoading={loadingBest}
        viewAllLink="/shop?collection=best-sellers"
        viewAllLabel={bestSellersCol?.view_all_label || 'View All Best Sellers'}
      />

      {/* Festival Collections Section */}
      <ProductSection
        sectionId="festival"
        badge={festivalCol?.badge?.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim() || 'Festival Ready'}
        title={festivalCol?.title || 'Festival Collections'}
        subtitle={
          festivalCol?.subtitle ||
          'Celebrate every festival in style with our exclusive festive wear collection.'
        }
        products={festivalProducts || []}
        isLoading={loadingFestival}
        viewAllLink="/shop?collection=festival-collections"
        viewAllLabel={festivalCol?.view_all_label || 'Shop Festival Wear'}
      />

      {/* Testimonials */}
      <Testimonials />

      {/* YouTube */}
      <YouTubeSection videos={youtubeVideos} />

      {/* Contact CTA */}
      <ContactCTA />
    </>
  )
}
