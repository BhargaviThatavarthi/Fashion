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

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  category: 'Saree Styling' | 'Fabric Care' | 'Festive Trends' | 'Bridal Guides' | 'Handloom Heritage' | string
  tags: string[]
  author: {
    name: string
    role: string
    avatar?: string
  }
  published_at: string
  read_time_minutes: number
  featured?: boolean
  related_product_ids?: string[]
}

export const DEMO_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Ultimate Guide to Draping Kanjivaram Silk Sarees for Weddings',
    slug: 'ultimate-guide-kanjivaram-silk-saree-draping',
    excerpt: 'Master the timeless royal drape with our step-by-step styling tips, pleat techniques, and accessory pairings for Indian brides and guests.',
    featured_image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    category: 'Saree Styling',
    tags: ['Kanjivaram', 'Bridal', 'Draping Tutorial', 'Silk Sarees', 'Wedding Style'],
    author: {
      name: 'Bhargavi Thatavarthi',
      role: 'Founder & Lead Stylist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    published_at: '2026-08-28',
    read_time_minutes: 6,
    featured: true,
    related_product_ids: ['1', '2'],
    content: `
### The Regal Heritage of Kanjivaram Draping

The Kanjivaram saree, woven with pure mulberry silk and dipped in molten gold zari, is more than an attire — it is an heirloom that embodies centuries of South Indian artisan mastery. When it comes to styling this royal masterpiece for weddings and auspicious celebrations, the drape can transform the silhouette into pure majestic poetry.

---

### Step 1: Crafting the Perfect Foundation

Before pleating your saree, ensure you have:
- **A Breathable Satin or Cotton-Silk Petticoat** tailored closely to your waist to prevent bulkiness.
- **Your Wedding Heels or Footwear On** before tucking in the first layer to get the exact ground-skimming length.
- **Good Quality Gold-Plated Safety Pins** or saree clips that do not snag pure silk fibers.

> [!TIP]
> **Styling Secret:** Tuck the first wrap tightly starting from the right navel, going clockwise around the waist. Ensure the bottom border touches the tip of your shoes evenly on all sides.

---

### Step 2: The Art of the Pallu Pleats

1. **Calculate the Pallu Length:** Drape the decorated zari pallu across your left shoulder, allowing it to fall at least to the back of your knees for a stately, royal look.
2. **Iron-Crisp Pleats:** Measure 4 to 5 fingers wide per pleat. Pin the pleats neatly from the shoulder down to the pallu drop.
3. **The Temple Accent:** Keep the heaviest gold zari border on the topmost pleat facing outwards.

---

### Step 3: Defining the Front Waist Pleats

Create 6 to 8 even pleats (approx. 4 inches wide). Tap the pleats gently against your hand so the silk settles naturally. Tuck them into the navel center and secure with an inner pin to the petticoat.

---

### Step 4: Accessorizing for the Grand Celebration

- **Temple Jewelry:** Pair with antique matte-gold necklaces, jhumkas, and a delicate *kamarbandh* (waist belt) to accentuate your waistline.
- **Blouse Styling:** An elbow-length contrast blouse in deep magenta or emerald green with maggam embroidery complements golden Kanjivaram motifs effortlessly.
- **Fresh Jasmine Flowers (Gajra):** A braided jasmine garland adds authentic South Indian fragrance and elegance.
    `,
  },
  {
    id: 'blog-2',
    title: 'Silk Saree Care 101: How to Preserve Zari & Luster for Generations',
    slug: 'silk-saree-care-preserve-zari-luster',
    excerpt: 'Essential storage, washing, and folding techniques from master weavers to keep your pure silk sarees radiant for decades.',
    featured_image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
    category: 'Fabric Care',
    tags: ['Fabric Care', 'Silk Sarees', 'Zari Preservation', 'Heirloom Care'],
    author: {
      name: 'Bhargavi Thatavarthi',
      role: 'Founder & Lead Stylist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    published_at: '2026-08-20',
    read_time_minutes: 5,
    featured: false,
    related_product_ids: ['1', '3'],
    content: `
### Preserving Pure Handloom Silk: A Master Guide

Pure silk sarees are living treasures crafted with delicate organic proteins and metallic zari threads. With proper care, a well-preserved silk saree becomes a cherished heirloom passed down from mothers to daughters.

---

### 1. The Right Way to Store Pure Silk

- **Always Wrap in Pure Cotton or Muslin Cloth:** Avoid plastic covers or airtight nylon pouches. Silk needs to breathe; plastic traps moisture and can lead to fabric yellowing or zari tarnishing.
- **Use Saree Storage Bags with Breathable Windows:** Store your sarees flat on wooden wardrobe shelves rather than hanging them on metal hangers which cause crease stress.
- **Add Natural Moth Deterrents:** Use dried neem leaves or cloves in your wardrobe corners instead of chemical naphthalene balls which damage metallic zari luster.

---

### 2. Washing & Dry Cleaning Guidelines

- **First 3 Washes:** Always opt for professional dry cleaning from trusted fabric care specialists.
- **Spot Cleaning:** If liquid spills on your saree, blot immediately with a clean, dry muslin cloth. Never rub vigorously.
- **Ironing Rules:** Always iron silk sarees on the reverse side using medium-low heat or place a thin cotton sheet between the iron and the zari border.

> [!IMPORTANT]
> **The 6-Month Refolding Rule:** Every 6 months, take your silk sarees out of the wardrobe, air them in a shaded, well-ventilated room for a few hours, and change the fold lines to prevent permanent crease wear.
    `,
  },
  {
    id: 'blog-3',
    title: 'Trending Festive Color Palettes for the Upcoming Wedding Season',
    slug: 'trending-festive-color-palettes-wedding-season',
    excerpt: 'Explore this season’s hottest shades in sarees and lehengas — from royal peacock teal to sunset coral and pastel rose.',
    featured_image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
    category: 'Festive Trends',
    tags: ['Color Trends', 'Festive Fashion', 'Bridal Wear', 'Lehengas', 'Sarees'],
    author: {
      name: 'Priya Sharma',
      role: 'Fashion Editor',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    },
    published_at: '2026-08-15',
    read_time_minutes: 4,
    featured: true,
    related_product_ids: ['2', '4'],
    content: `
### Color Harmonies That Define Modern Ethnic Luxury

This wedding season is all about rich contrasts, royal jewel tones, and luminous metallic accents that shimmer under celebratory lights. Here are the top color trends taking center stage at Sri Subhakari Fashions:

---

### 1. Peacock Teal & Molten Antique Gold
A regal combination inspired by royal Indian architecture. The deep teal body with intricate gold temple borders creates a dramatic, photogenic presence for receptions and evening sangeets.

### 2. Sunset Coral & Rose Pink Duo
Warm, romantic, and youthful. Sunset coral sarees reflect radiant natural glow on Indian skin tones, making them the top choice for morning wedding muhurthams and haldi ceremonies.

### 3. Lavender Mist & Silver Zari
For the contemporary fashion lover who appreciates understated minimalism, pastel lavender with silver shimmer offers an ethereal, European-inspired haute couture aesthetic.
    `,
  },
  {
    id: 'blog-4',
    title: 'Handloom vs Powerloom: Celebrating the Art of Authentic Indian Weaves',
    slug: 'handloom-vs-powerloom-authentic-indian-weaves',
    excerpt: 'Discover the heart and soul behind handcrafted sarees, how to identify genuine handloom weaves, and why artisan textiles are unmatched.',
    featured_image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=80',
    category: 'Handloom Heritage',
    tags: ['Handloom', 'Weaving Artisan', 'Pochampally', 'Ikat', 'Heritage'],
    author: {
      name: 'Bhargavi Thatavarthi',
      role: 'Founder & Lead Stylist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    published_at: '2026-08-05',
    read_time_minutes: 5,
    featured: false,
    related_product_ids: ['3', '5'],
    content: `
### The Soul of the Handloom

Behind every handloom saree lies weeks of painstaking craftsmanship, where master weavers intertwine thousands of individual silk warp and weft threads by hand on wooden pit looms.

---

### How to Spot Genuine Handloom Weaves:

1. **Natural Texture & Slubs:** Handwoven fabric has charming, subtle organic variations in thread tension that give it depth and character.
2. **Intricate Reversible Borders:** Authentic interlocking wefts (like *Korvai* in Kanjivaram) show hand-joined weaving lines on the reverse.
3. **Soft Drapability:** Handlooms possess a supple, breathable drape that softens with every wear.

Supporting authentic handloom weaves sustains traditional weaver communities and preserves India's rich cultural heritage.
    `,
  },
]
