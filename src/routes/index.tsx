import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import HeroBanner from '../components/home/HeroBanner'
import ProductSection from '../components/home/ProductSection'
import ShopByCategory from '../components/home/ShopByCategory'
import WhyChooseUs from '../components/home/WhyChooseUs'
import Testimonials from '../components/home/Testimonials'
import YouTubeSection from '../components/home/YouTubeSection'
import ContactCTA from '../components/home/ContactCTA'
import {
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
} from '../services/products'
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
          'Shop premium sarees, silk sarees, lehengas and ethnic wear at Sri Subhakari Fashions. Beautiful handcrafted ethnic wear with WhatsApp enquiry.',
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
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

  const { data: youtubeVideos } = useQuery({
    queryKey: ['youtube-videos'],
    queryFn: getYoutubeVideos,
    staleTime: 5 * 60 * 1000,
  })

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Featured Sarees */}
      <ProductSection
        sectionId="featured"
        badge="⭐ Handpicked"
        title="Featured Sarees"
        subtitle="Explore our most-loved collection of sarees and ethnic wear, each crafted for the modern woman who celebrates tradition."
        products={featured || []}
        isLoading={loadingFeatured}
        viewAllLink="/shop"
        viewAllLabel="View All Sarees"
      />

      {/* Shop by Category */}
      <ShopByCategory />

      {/* New Arrivals */}
      <ProductSection
        sectionId="new-arrivals"
        badge="🆕 Just Arrived"
        title="New Arrivals"
        subtitle="Be the first to discover our freshest designs — straight from the looms of master weavers."
        products={newArrivals || []}
        isLoading={loadingNew}
        viewAllLink="/shop"
        viewAllLabel="See All New Arrivals"
      />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Best Sellers */}
      <ProductSection
        sectionId="best-sellers"
        badge="🏆 Top Rated"
        title="Best Sellers"
        subtitle="Our most popular designs — chosen by thousands of happy customers across India."
        products={bestSellers || []}
        isLoading={loadingBest}
        viewAllLink="/shop"
        viewAllLabel="View All Best Sellers"
      />

      {/* Festival Collections */}
      <ProductSection
        sectionId="festival"
        badge="🎊 Festival Ready"
        title="Festival Collections"
        subtitle="Celebrate every festival in style with our exclusive festive wear collection."
        products={(featured || []).filter((_, i) => i % 2 === 0)}
        isLoading={loadingFeatured}
        viewAllLink="/shop"
        viewAllLabel="Shop Festival Wear"
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

