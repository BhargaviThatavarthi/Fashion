// Sri Subhakari Fashions — Type Definitions

export interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
  description?: string | null
  order?: number
  created_at?: string
}

export interface Collection {
  id: string
  title: string
  slug: string
  badge?: string | null
  subtitle?: string | null
  description?: string | null
  image?: string | null
  order?: number
  show_on_homepage?: boolean
  view_all_label?: string | null
  created_at?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  category_id?: string | null
  category?: Category | string | null
  collections?: Collection[] | null
  fabric?: string | null
  color?: string[] | null
  sizes?: string[] | null
  price: number
  offer_price?: number | null
  image_url?: string | null
  images?: string[] | null
  stock_quantity?: number | null
  status?: 'active' | 'out_of_stock' | 'draft' | 'archived' | string | null
  sku?: string | null
  wash_care?: string | null
  rating?: number | null
  review_count?: number | null
  featured?: boolean
  best_seller?: boolean
  new_arrival?: boolean
  stock?: number | null
  tags?: string[] | null
  in_stock?: boolean | null
  created_at?: string
  updated_at?: string
}

export interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  price: number
  originalPrice?: number | null
  image?: string | null
  quantity: number
  color?: string | null
  size?: string | null
  fabric?: string | null
  stock?: number | null
}

export interface Testimonial {
  id: string
  customer_name: string
  review: string
  rating: number
  image?: string | null
  created_at?: string
}

export interface HomepageBanner {
  id: string
  title: string
  subtitle?: string | null
  image?: string | null
  button_text?: string | null
  button_link?: string | null
  active?: boolean
  created_at?: string
}

export interface SocialLinks {
  id: string
  instagram?: string | null
  youtube?: string | null
  facebook?: string | null
  linkedin?: string | null
  whatsapp?: string | null
  updated_at?: string
}

export interface YoutubeVideo {
  id: string
  title: string
  video_id: string
  thumbnail?: string | null
  sort_order?: number
  created_at?: string
}

export interface ContactEnquiry {
  id: string
  name: string
  phone?: string | null
  email?: string | null
  message: string
  product_name?: string | null
  product_id?: string | null
  read?: boolean
  created_at?: string
}

export interface CustomerLead {
  id: string
  customer_name: string
  phone?: string | null
  email?: string | null
  source?: string | null
  message: string
  status: 'New' | 'Contacted' | 'Converted' | 'Closed'
  created_at?: string
  updated_at?: string
}

export interface MediaAsset {
  id?: string
  file_name: string
  file_path: string
  public_url: string
  file_type?: string | null
  file_size?: number | null
  created_at?: string
}

export interface AdminUser {
  id: string
  email: string
  role: string
  created_at?: string
}

export interface ProductFilters {
  search?: string
  category?: string
  collection?: string
  fabric?: string
  minPrice?: number
  maxPrice?: number
  color?: string
  size?: string
  newArrival?: boolean
  bestSeller?: boolean
  featured?: boolean
  sortBy?: 'latest' | 'popular' | 'price_asc' | 'price_desc'
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ------------------------------------------------------------------
// Canonical 8 Categories (Static Frontend display representation)
// ------------------------------------------------------------------
export const DEMO_CATEGORIES: Category[] = [
  { id: '1', name: 'Sarees', slug: 'sarees', image: '/images/categories/sarees.jpg', order: 1 },
  { id: '2', name: 'Silk Sarees', slug: 'silk-sarees', image: '/images/categories/silk-sarees.jpg', order: 2 },
  { id: '3', name: 'Cotton Sarees', slug: 'cotton-sarees', image: '/images/categories/cotton-sarees.jpg', order: 3 },
  { id: '4', name: 'Designer Sarees', slug: 'designer-sarees', image: '/images/categories/designer-sarees.jpg', order: 4 },
  { id: '5', name: 'Lehengas', slug: 'lehengas', image: '/images/categories/lehengas.jpg', order: 5 },
  { id: '6', name: 'Kurtis', slug: 'kurtis', image: '/images/categories/kurtis.jpg', order: 6 },
  { id: '7', name: 'Dress Materials', slug: 'dress-materials', image: '/images/categories/dress-materials.jpg', order: 7 },
  { id: '8', name: 'Ethnic Wear', slug: 'ethnic-wear', image: '/images/categories/ethnic-wear.jpg', order: 8 },
]

// ------------------------------------------------------------------
// Canonical 4 Collections / Sections (Managed dynamically in Sanity)
// ------------------------------------------------------------------
export const DEMO_COLLECTIONS: Collection[] = [
  {
    id: 'col-featured-sarees',
    title: 'Featured Sarees',
    slug: 'featured-sarees',
    badge: 'Handpicked',
    subtitle: 'Explore our most-loved collection of sarees and ethnic wear, crafted for the modern woman who celebrates tradition.',
    image: '/images/silk-saree.png',
    order: 1,
    show_on_homepage: true,
    view_all_label: 'View All Featured Sarees',
  },
  {
    id: 'col-new-arrivals',
    title: 'New Arrivals',
    slug: 'new-arrivals',
    badge: 'Just Arrived',
    subtitle: 'Be the first to discover our freshest designs — straight from the looms of master weavers.',
    image: '/images/cotton-saree.png',
    order: 2,
    show_on_homepage: true,
    view_all_label: 'See All New Arrivals',
  },
  {
    id: 'col-best-sellers',
    title: 'Best Sellers',
    slug: 'best-sellers',
    badge: 'Top Rated',
    subtitle: 'Our most popular designs — chosen by thousands of happy customers across India.',
    image: '/images/designer-saree.png',
    order: 3,
    show_on_homepage: true,
    view_all_label: 'View All Best Sellers',
  },
  {
    id: 'col-festival-collections',
    title: 'Festival Collections',
    slug: 'festival-collections',
    badge: 'Festival Ready',
    subtitle: 'Celebrate every auspicious occasion and festival in breathtaking elegance with our festive collection.',
    image: '/images/silk-saree.png',
    order: 4,
    show_on_homepage: true,
    view_all_label: 'Shop Festival Wear',
  },
]

// ------------------------------------------------------------------
// Products with Category and Multi-Collection Associations
// ------------------------------------------------------------------
export const DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Royal Kanjivaram Silk Saree',
    slug: 'royal-kanjivaram-silk-saree',
    description: 'A magnificent Kanjivaram silk saree woven with pure mulberry silk and gold zari. Features an intricate temple border in rose pink.',
    fabric: 'Pure Silk',
    color: ['Rose Pink', 'Gold'],
    sizes: ['Free Size'],
    price: 12500,
    offer_price: 10999,
    images: ['/images/silk-saree.png'],
    sku: 'SSF-KSS-001',
    wash_care: 'Dry clean only. Store with camphor balls in a cotton cloth.',
    rating: 4.8,
    review_count: 124,
    stock: 25,
    tags: ['Silk', 'Wedding', 'Traditional', 'Festival'],
    in_stock: true,
    category: DEMO_CATEGORIES.find((c) => c.slug === 'silk-saree'),
    category_id: 'cat-silk-saree',
    collections: [
      DEMO_COLLECTIONS.find((c) => c.slug === 'featured-sarees')!,
      DEMO_COLLECTIONS.find((c) => c.slug === 'best-sellers')!,
      DEMO_COLLECTIONS.find((c) => c.slug === 'festival-collections')!,
    ],
    featured: true,
    best_seller: true,
    new_arrival: false,
  },
  {
    id: '2',
    name: 'Mysore Crepe Chiffon Saree',
    slug: 'mysore-crepe-chiffon-saree',
    description: 'Lightweight and breathable Mysore crepe chiffon saree with delicate hand-block printed florals. Ideal for daytime events and parties.',
    fabric: 'Crepe',
    color: ['Sky Blue', 'White'],
    sizes: ['Free Size'],
    price: 4500,
    offer_price: 3799,
    images: ['/images/crape-saree.png'],
    sku: 'SSF-CCS-002',
    wash_care: 'Hand wash gently in cold water.',
    rating: 4.6,
    review_count: 87,
    stock: 12,
    tags: ['Crepe', 'Block Print', 'Floral'],
    in_stock: true,
    category: DEMO_CATEGORIES.find((c) => c.slug === 'crepe-saree'),
    category_id: 'cat-crepe-saree',
    collections: [
      DEMO_COLLECTIONS.find((c) => c.slug === 'featured-sarees')!,
      DEMO_COLLECTIONS.find((c) => c.slug === 'new-arrivals')!,
    ],
    featured: true,
    best_seller: false,
    new_arrival: true,
  },
  {
    id: '3',
    name: 'Designer Georgette Party Saree',
    slug: 'designer-georgette-party-saree',
    description: 'Contemporary designer saree with sequin embellishments and fine zari embroidery, designed for receptions and festive celebrations.',
    fabric: 'Georgette',
    color: ['Wine', 'Silver'],
    sizes: ['Free Size'],
    price: 8900,
    offer_price: 7499,
    images: ['/images/designer-saree.png'],
    sku: 'SSF-DGS-003',
    wash_care: 'Dry clean recommended.',
    rating: 4.9,
    review_count: 63,
    stock: 8,
    tags: ['Designer', 'Party', 'Sequin'],
    in_stock: true,
    category: DEMO_CATEGORIES.find((c) => c.slug === 'design-saree'),
    category_id: 'cat-design-saree',
    collections: [
      DEMO_COLLECTIONS.find((c) => c.slug === 'featured-sarees')!,
      DEMO_COLLECTIONS.find((c) => c.slug === 'best-sellers')!,
      DEMO_COLLECTIONS.find((c) => c.slug === 'festival-collections')!,
    ],
    featured: true,
    best_seller: true,
    new_arrival: false,
  },
  {
    id: '4',
    name: 'Handloom Cotton Ikat Saree',
    slug: 'handloom-cotton-ikat-saree',
    description: 'Authentic handloom cotton ikat saree showcasing traditional double ikat weaving techniques with geometric motifs.',
    fabric: 'Cotton',
    color: ['Teal', 'Orange'],
    sizes: ['Free Size'],
    price: 6800,
    offer_price: 5999,
    images: ['/images/cotton-saree.png'],
    sku: 'SSF-HPI-004',
    wash_care: 'First wash separately. Hand wash gently.',
    rating: 4.7,
    review_count: 152,
    stock: 15,
    tags: ['Cotton', 'Handloom', 'Ikat'],
    in_stock: true,
    category: DEMO_CATEGORIES.find((c) => c.slug === 'cotton-saree'),
    category_id: 'cat-cotton-saree',
    collections: [
      DEMO_COLLECTIONS.find((c) => c.slug === 'new-arrivals')!,
      DEMO_COLLECTIONS.find((c) => c.slug === 'best-sellers')!,
    ],
    featured: false,
    best_seller: true,
    new_arrival: true,
  },
  {
    id: '5',
    name: 'Embroidered Ethnic Peplum Top',
    slug: 'embroidered-ethnic-peplum-top',
    description: 'Chic embroidered ethnic designer top with mirror work and zari borders. Pairs beautifully with ethnic skirts and palazzos.',
    fabric: 'Rayon',
    color: ['Powder Blue', 'White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 2499,
    offer_price: 1899,
    images: ['/images/ethnic-top.png'],
    sku: 'SSF-TOP-005',
    wash_care: 'Hand wash or gentle machine wash.',
    rating: 4.8,
    review_count: 58,
    stock: 20,
    tags: ['Tops', 'Chikankari', 'Fusion', 'Festival'],
    in_stock: true,
    category: DEMO_CATEGORIES.find((c) => c.slug === 'tops'),
    category_id: 'cat-tops',
    collections: [
      DEMO_COLLECTIONS.find((c) => c.slug === 'new-arrivals')!,
      DEMO_COLLECTIONS.find((c) => c.slug === 'festival-collections')!,
    ],
    featured: false,
    best_seller: false,
    new_arrival: true,
  },
  {
    id: '7',
    name: 'Floral Georgette Flared Peplum Top',
    slug: 'floral-georgette-flared-peplum-top',
    description: 'Breezy floral georgette flared top featuring gathered waist and designer flared sleeves with delicate buttons.',
    fabric: 'Georgette',
    color: ['Sage Green', 'Silver'],
    sizes: ['M', 'L', 'XL'],
    price: 1999,
    offer_price: 1499,
    images: ['/images/ethnic-top.png'],
    sku: 'SSF-TOP-007',
    wash_care: 'Gentle hand wash in cold water.',
    rating: 4.7,
    review_count: 34,
    stock: 18,
    tags: ['Tops', 'Floral', 'Casual', 'Festival'],
    in_stock: true,
    category: DEMO_CATEGORIES.find((c) => c.slug === 'tops'),
    category_id: 'cat-tops',
    collections: [
      DEMO_COLLECTIONS.find((c) => c.slug === 'new-arrivals')!,
      DEMO_COLLECTIONS.find((c) => c.slug === 'best-sellers')!,
    ],
    featured: true,
    best_seller: true,
    new_arrival: true,
  },
  {
    id: '8',
    name: 'Chikankari Embroidered Designer Kurti Top',
    slug: 'chikankari-embroidered-designer-kurti-top',
    description: 'Exquisite Lucknowi chikankari embroidered ethnic top crafted with soft breathable cotton and subtle sequin highlights.',
    fabric: 'Cotton',
    color: ['Pistachio Green', 'White'],
    sizes: ['S', 'M', 'L', 'XL'],
    price: 2799,
    offer_price: 2199,
    images: ['/images/ethnic-top.png'],
    sku: 'SSF-TOP-008',
    wash_care: 'Hand wash separately.',
    rating: 4.9,
    review_count: 42,
    stock: 14,
    tags: ['Tops', 'Chikankari', 'Handcrafted', 'Festival'],
    in_stock: true,
    category: DEMO_CATEGORIES.find((c) => c.slug === 'tops'),
    category_id: 'cat-tops',
    collections: [
      DEMO_COLLECTIONS.find((c) => c.slug === 'new-arrivals')!,
      DEMO_COLLECTIONS.find((c) => c.slug === 'festival-collections')!,
    ],
    featured: true,
    best_seller: false,
    new_arrival: true,
  },
  {
    id: '6',
    name: 'Premium 4-Way Stretch Ethnic Leggings',
    slug: 'premium-stretch-ethnic-leggings',
    description: 'Ultra-comfortable 4-way stretch churidar leggings crafted from premium combed bio-washed cotton with high durability elastic waistband.',
    fabric: 'Cotton',
    color: ['Maroon', 'Gold', 'Black', 'White'],
    sizes: ['Free Size', 'Plus Size'],
    price: 899,
    offer_price: 699,
    images: ['/images/leggings.png'],
    sku: 'SSF-LEG-006',
    wash_care: 'Machine wash warm.',
    rating: 4.8,
    review_count: 210,
    stock: 50,
    tags: ['Leggings', 'Stretch', 'Daily Wear'],
    in_stock: true,
    category: DEMO_CATEGORIES.find((c) => c.slug === 'leggings'),
    category_id: 'cat-leggings',
    collections: [
      DEMO_COLLECTIONS.find((c) => c.slug === 'best-sellers')!,
    ],
    featured: false,
    best_seller: true,
    new_arrival: false,
  },
]

export const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    customer_name: 'Priya Sharma',
    review: 'Absolutely beautiful sarees! The Kanjivaram I ordered was even more gorgeous in person. The fabric quality is exceptional and delivery was prompt. Sri Subhakari Fashions has become my go-to for all ethnic wear!',
    rating: 5,
  },
  {
    id: '2',
    customer_name: 'Ananya Krishnan',
    review: 'I was skeptical about ordering online, but the saree I received exceeded all expectations. The colors were vibrant, packaging was premium, and the team was so helpful on WhatsApp. Highly recommend!',
    rating: 5,
  },
  {
    id: '3',
    customer_name: 'Meera Reddy',
    review: 'Bought the bridal lehenga for my wedding and received so many compliments! The embroidery work is flawless and the fit was perfect. Thank you Sri Subhakari Fashions for making my big day even more special.',
    rating: 5,
  },
  {
    id: '4',
    customer_name: 'Kavitha Nair',
    review: "The Pochampally Ikat saree I ordered is stunning. You can tell it's authentically handcrafted. The team was very responsive and even helped me pick the perfect color. Will definitely order again!",
    rating: 4,
  },
]
