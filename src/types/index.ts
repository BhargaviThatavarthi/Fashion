// Sri Subhakari Fashions — Type Definitions

export interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
  created_at?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  category_id?: string | null
  category?: Category | null
  fabric?: string | null
  color?: string[] | null
  sizes?: string[] | null
  price: number
  offer_price?: number | null
  images?: string[] | null
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

// Mock product with full details for demo
export const DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Royal Kanjivaram Silk Saree',
    slug: 'royal-kanjivaram-silk-saree',
    description: 'A magnificent Kanjivaram silk saree woven with pure mulberry silk and gold zari. This exquisite piece features a rich rose-pink body with an elaborate golden border depicting traditional temple motifs. Perfect for weddings and festive occasions.',
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
    featured: true,
    best_seller: true,
    new_arrival: false,
    stock: 25,
    tags: ['Silk', 'Wedding', 'Traditional'],
    in_stock: true,
    category: { id: '1', name: 'Silk Sarees', slug: 'silk-sarees' },
  },
  {
    id: '2',
    name: 'Mysore Crepe Chiffon Saree',
    slug: 'mysore-crepe-chiffon-saree',
    description: 'Lightweight and breathable Mysore crepe chiffon saree with delicate hand-block printed florals. Ideal for daytime events and parties.',
    fabric: 'Chiffon',
    color: ['Sky Blue', 'White'],
    sizes: ['Free Size'],
    price: 4500,
    offer_price: 3799,
    images: ['/images/crape-saree.png'],
    sku: 'SSF-CCS-002',
    wash_care: 'Hand wash gently in cold water.',
    rating: 4.6,
    review_count: 87,
    featured: true,
    best_seller: false,
    new_arrival: true,
    stock: 12,
    tags: ['Chiffon', 'Block Print', 'Floral'],
    in_stock: true,
    category: { id: '4', name: 'Crape Sarees', slug: 'crape-sarees' },
  },
  {
    id: '3',
    name: 'Bridal Red Lehenga Choli',
    slug: 'bridal-red-lehenga-choli',
    description: 'Stunning bridal red lehenga choli with heavy gold embroidery and mirror work. The set includes a fully embellished lehenga, blouse, and dupatta — your complete bridal look.',
    fabric: 'Net & Georgette',
    color: ['Red', 'Gold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    price: 28000,
    offer_price: 24500,
    images: ['/images/designer-saree.png'],
    sku: 'SSF-BRL-003',
    wash_care: 'Dry clean only.',
    rating: 4.9,
    review_count: 63,
    featured: true,
    best_seller: true,
    new_arrival: false,
    stock: 5,
    tags: ['Lehenga', 'Bridal', 'Embroidery'],
    in_stock: true,
    category: { id: '5', name: 'Lehengas', slug: 'lehengas' },
  },
  {
    id: '4',
    name: 'Handloom Pochampally Ikat Saree',
    slug: 'handloom-pochampally-ikat-saree',
    description: 'Authentic handloom Pochampally ikat saree showcasing the traditional double ikat weaving technique from Telangana. Each saree is unique, made by skilled artisans.',
    fabric: 'Handloom Cotton',
    color: ['Teal', 'Orange'],
    sizes: ['Free Size'],
    price: 6800,
    offer_price: 5999,
    images: ['/images/cotton-saree.png'],
    sku: 'SSF-HPI-004',
    wash_care: 'First wash separately. Machine washable on gentle cycle.',
    rating: 4.7,
    review_count: 152,
    featured: false,
    best_seller: true,
    new_arrival: false,
    stock: 0,
    tags: ['Ikat', 'Handloom', 'Cotton'],
    in_stock: false,
    category: { id: '3', name: 'Cotton Sarees', slug: 'cotton-sarees' },
  },
  {
    id: '5',
    name: 'Designer Georgette Party Saree',
    slug: 'designer-georgette-party-saree',
    description: 'Contemporary designer georgette saree with sequin and thread embroidery. Perfect for cocktail parties, receptions, and festive gatherings.',
    fabric: 'Georgette',
    color: ['Wine', 'Silver'],
    sizes: ['Free Size'],
    price: 8900,
    offer_price: 7499,
    images: ['/images/designer-saree.png'],
    sku: 'SSF-DGS-005',
    wash_care: 'Dry clean recommended.',
    rating: 4.5,
    review_count: 78,
    featured: true,
    best_seller: false,
    new_arrival: true,
    stock: 8,
    tags: ['Georgette', 'Designer', 'Party'],
    in_stock: true,
    category: { id: '4', name: 'Designer Sarees', slug: 'designer-sarees' },
  },
  {
    id: '6',
    name: 'Anarkali Kurti with Dupatta',
    slug: 'anarkali-kurti-with-dupatta',
    description: 'Floor-length Anarkali kurti in premium rayon fabric with intricate chikankari embroidery. Paired with a matching embroidered dupatta.',
    fabric: 'Rayon',
    color: ['Powder Blue', 'White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    price: 3500,
    offer_price: 2899,
    images: ['/images/ethnic-top.png'],
    sku: 'SSF-AKD-006',
    wash_care: 'Hand wash or gentle machine wash.',
    rating: 4.4,
    review_count: 211,
    featured: false,
    best_seller: true,
    new_arrival: true,
    stock: 18,
    tags: ['Anarkali', 'Kurti', 'Chikankari'],
    in_stock: true,
    category: { id: '6', name: 'Kurtis', slug: 'kurtis' },
  },
]

export const DEMO_CATEGORIES: Category[] = [
  { id: '1', name: 'Sarees', slug: 'sarees' },
  { id: '2', name: 'Silk Sarees', slug: 'silk-sarees' },
  { id: '3', name: 'Cotton Sarees', slug: 'cotton-sarees' },
  { id: '4', name: 'Designer Sarees', slug: 'designer-sarees' },
  { id: '5', name: 'Lehengas', slug: 'lehengas' },
  { id: '6', name: 'Kurtis', slug: 'kurtis' },
  { id: '7', name: 'Dress Materials', slug: 'dress-materials' },
  { id: '8', name: 'Ethnic Wear', slug: 'ethnic-wear' },
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
    review: 'The Pochampally Ikat saree I ordered is stunning. You can tell it\'s authentically handcrafted. The team was very responsive and even helped me pick the perfect color. Will definitely order again!',
    rating: 4,
  },
]
