import { CONTACT, SITE_NAME, WHATSAPP_NUMBER, SOCIAL } from '../../constants'
import { DEMO_CATEGORIES, DEMO_COLLECTIONS, DEMO_PRODUCTS, DEMO_TESTIMONIALS, type Product, type Category, type Collection } from '../../types'
import { STATIC_CATEGORIES } from '../../constants/categories'

export interface ChatbotResponse {
  text: string
  products?: Product[]
  quickReplies?: string[]
  actionLink?: {
    label: string
    url: string
    isExternal?: boolean
    isWhatsApp?: boolean
  }
}

export interface ChatMessageData {
  id: string
  sender: 'bot' | 'user'
  text: string
  timestamp: string
  products?: Product[]
  quickReplies?: string[]
  actionLink?: {
    label: string
    url: string
    isExternal?: boolean
    isWhatsApp?: boolean
  }
}

export const INITIAL_SUGGESTIONS = [
  '✨ Recommend Bridal Sarees',
  '🌸 Sarees under ₹3,000',
  '📖 How to drape a Kanjivaram?',
  '🧵 Saree care & wash tips',
  '📦 Pan-India Shipping time',
  '🏛️ Store Location in Repalle',
  '💼 Wholesale & Bulk Orders',
]

export interface WebsiteDoc {
  id: string
  title: string
  category: 'about' | 'blog' | 'service' | 'policy' | 'store' | 'wholesale' | 'care' | 'draping' | 'testimonials' | 'faq'
  keywords: string[]
  url?: string
  actionLabel?: string
  isWhatsApp?: boolean
  getContent: (products: Product[]) => { text: string; products?: Product[]; quickReplies?: string[] }
}

/**
 * Full Scraped & Curated Knowledge Corpus of Sri Subhakari Fashions
 */
export const WEBSITE_KNOWLEDGE_BASE: WebsiteDoc[] = [
  // 1. BRAND STORY & FOUNDER
  {
    id: 'about-story',
    title: 'About Sri Subhakari Fashions & Founder Story',
    category: 'about',
    keywords: [
      'who are you',
      'about',
      'about us',
      'story',
      'history',
      'founder',
      'bhargavi',
      'thatavarthi',
      'who started',
      'who owns',
      'owner',
      'background',
      'journey',
      'company',
    ],
    url: '/about',
    actionLabel: 'Read Our Full Story',
    getContent: (products) => ({
      text: `🏛️ **About Sri Subhakari Fashions**\n\n- **Founder & Lead Stylist:** **Bhargavi Thatavarthi**.\n- **Our Journey:** Founded in **2001** with a passion for authentic handloom and ethnic sarees, serving both **wholesale and retail** customers across India.\n- **Milestones:**\n  • **2001:** Founded with wholesale & retail saree service.\n  • **2008:** Expanded into traditional South Indian handloom & designer bridal collections.\n  • **2015:** Expanded pan-India retail and wholesale presence.\n  • **2021:** Launched personalized shopping via WhatsApp.\n  • **2024–2026:** Debuted our digital boutique for saree lovers worldwide.\n- **Motto:** *"Where Style Meets Quality, and Fashion Becomes Affordable."*`,
      quickReplies: ['🎯 What is your mission?', '💼 Wholesale & Bulk Inquiries', '📍 Store Showroom Location', '✨ View Silk Sarees'],
    }),
  },

  // 2. MISSION & VISION
  {
    id: 'about-mission-vision',
    title: 'Mission, Vision & Core Values',
    category: 'about',
    keywords: ['mission', 'vision', 'values', 'what do you stand for', 'aim', 'goal', 'why choose', 'motto'],
    url: '/about',
    actionLabel: 'Learn More About Our Values',
    getContent: () => ({
      text: `🎯 **Our Mission & Vision**\n\n- **Our Mission:** To make premium, authentic Indian ethnic wear accessible to every woman — celebrating culture, craftsmanship, and confidence through hand-curated collections.\n- **Our Vision:** To become India's most trusted boutique for ethnic wear — where every customer finds not just a saree, but a piece of art that tells her story.\n\n💎 **Our Core Values:**\n1. **Authenticity:** Sourced directly from verified master weavers.\n2. **Quality:** Every piece is personally curated and inspected.\n3. **Tradition:** Celebrating centuries of Indian handloom heritage.\n4. **Trust:** Transparent pricing and personalized styling support.`,
      quickReplies: ['✨ Recommend Bridal Sarees', '🏛️ Store Location in Repalle', '💼 Wholesale Service'],
    }),
  },

  // 3. WHOLESALE & BULK ORDERS
  {
    id: 'wholesale-business',
    title: 'Wholesale & Retail Bulk Orders',
    category: 'wholesale',
    keywords: [
      'wholesale',
      'bulk',
      'bulk order',
      'reseller',
      'reselling',
      'b2b',
      'distributor',
      'retailer',
      'business purchase',
      'wholesale price',
      'bulk discount',
    ],
    url: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Sri Subhakari Fashions, I am interested in wholesale/bulk purchase.')}`,
    actionLabel: 'Discuss Wholesale on WhatsApp',
    isWhatsApp: true,
    getContent: () => ({
      text: `💼 **Wholesale & Retail Bulk Orders**\n\nSri Subhakari Fashions is a leading **wholesale supplier and retail destination** for sarees, kurtis, lehengas, and dress materials since 2001.\n\n- **For Retailers & Boutique Owners:** Bulk catalogue rates, volume discounts, and customized saree assortments.\n- **Minimum Order Quantity (MOQ):** Flexible bundles for startup boutiques and established stores.\n- **Custom Dispatch:** Direct pan-India courier/transport dispatch from our Repalle hub.\n\nConnect directly with our wholesale team on WhatsApp to receive the latest wholesale catalogs and wholesale price sheets!`,
      quickReplies: ['💬 Chat on WhatsApp for Wholesale', '📍 Store Location in Repalle', '🛍️ Browse Retail Catalog'],
    }),
  },

  // 4. BLOG: KANJIVARAM DRAPING GUIDE
  {
    id: 'blog-draping-guide',
    title: 'Ultimate Guide to Draping Kanjivaram Silk Sarees',
    category: 'draping',
    keywords: [
      'how to drape',
      'drape',
      'draping',
      'pleat',
      'pleats',
      'pallu',
      'saree draping tips',
      'how to wear',
      'petticoat',
      'safety pins',
      'waist pleats',
      'drape tutorial',
    ],
    url: '/blog/ultimate-guide-kanjivaram-silk-saree-draping',
    actionLabel: 'Read Full Draping Guide',
    getContent: (products) => {
      const silkProducts = products.filter((p) => p.fabric?.toLowerCase().includes('silk') || p.name.toLowerCase().includes('silk')).slice(0, 3)
      return {
        text: `🥻 **Expert Saree Draping Guide (By Founder Bhargavi Thatavarthi)**\n\n1. **The Foundation:** Wear your shoes and satin/cotton petticoat before the first wrap. Start from right navel and tuck clockwise tightly for an even floor-skimming hem.\n2. **The Pallu Pleats:** Measure 4 to 5 fingers wide per pleat. Let the pallu drop to the back of the knees for a majestic royal look. Keep the gold zari border on top.\n3. **Front Waist Pleats:** Make 6 to 8 even pleats (4 inches wide), pat them flat, and tuck neatly into the center navel.\n4. **Styling & Jewelry:** Pair with antique matte-gold temple jewelry, a contrast embroidered blouse, and fresh jasmine gajra!`,
        products: silkProducts,
        quickReplies: ['💎 View Pure Kanjivaram Sarees', '🧵 Saree Care & Wash Guide', '🎨 Trending Wedding Colors'],
      }
    },
  },

  // 5. BLOG: SILK SAREE CARE & WASHING GUIDE
  {
    id: 'blog-saree-care',
    title: 'Silk Saree Care 101: How to Preserve Zari & Luster',
    category: 'care',
    keywords: [
      'wash',
      'dry clean',
      'care',
      'maintain',
      'storage',
      'iron',
      'ironing',
      'zari care',
      'preserve',
      'crease',
      'muslin',
      'plastic cover',
      'clean saree',
      'stain',
    ],
    url: '/blog/silk-saree-care-preserve-zari-luster',
    actionLabel: 'Read Complete Care Guide',
    getContent: () => ({
      text: `🧵 **Silk Saree Care & Longevity Guide**\n\n- **Storage:** Always wrap silk sarees in **breathable pure muslin or cotton cloth**. Never store in airtight plastic bags (which trap moisture and tarnish metallic zari).\n- **Washing:** **Dry clean only** for the first 2–3 washes. Never machine wash pure handloom silks.\n- **The 6-Month Refolding Rule:** Unfold and air your sarees in a shaded room every 6 months and change the fold lines to prevent crease tears.\n- **Ironing:** Always iron on the reverse side on low/silk heat, or place a cotton sheet over the zari border.\n- **Moth Deterrent:** Use dried neem leaves or cloves instead of harsh chemical naphthalene balls.`,
      quickReplies: ['💎 View Pure Silk Sarees', '🌿 View Cotton Sarees', '🥻 How to drape a Kanjivaram?'],
    }),
  },

  // 6. BLOG: TRENDING FESTIVE COLOR PALETTES
  {
    id: 'blog-trending-colors',
    title: 'Trending Festive & Wedding Color Palettes',
    category: 'blog',
    keywords: [
      'trending',
      'trends',
      'colors',
      'color trends',
      'best color',
      'wedding color',
      'festive colors',
      'peacock teal',
      'coral',
      'rose pink',
      'lavender',
      'shades',
    ],
    url: '/blog/trending-festive-color-palettes-wedding-season',
    actionLabel: 'Explore Color Trends Article',
    getContent: (products) => ({
      text: `🎨 **This Season’s Hottest Ethnic Color Trends:**\n\n1. **Peacock Teal & Molten Antique Gold:** Regal, dramatic, and stunning for evening receptions & sangeets.\n2. **Sunset Coral & Rose Pink:** Romantic & youthful; radiates natural warmth for morning muhurthams & haldi.\n3. **Lavender Mist & Silver Zari:** Modern European-inspired haute couture look for contemporary fashion lovers.\n4. **Mustard Yellow & Vermillion Red:** Auspicious shades for poojas, festivals, and traditional rituals.`,
      products: products.slice(0, 3),
      quickReplies: ['🌸 Show Pink Sarees', '💛 Show Yellow Sarees', '💎 View Bridal Silk'],
    }),
  },

  // 7. BLOG: HANDLOOM VS POWERLOOM
  {
    id: 'blog-handloom-heritage',
    title: 'Handloom vs Powerloom: Identifying Genuine Handcrafted Weaves',
    category: 'blog',
    keywords: [
      'handloom',
      'powerloom',
      'handloom vs powerloom',
      'authentic weave',
      'korvai',
      'pure handloom',
      'weavers',
      'artisan',
      'how to identify handloom',
    ],
    url: '/blog/handloom-vs-powerloom-authentic-indian-weaves',
    actionLabel: 'Read Handloom Heritage Article',
    getContent: (products) => {
      const handloomProducts = products.filter((p) => p.fabric?.toLowerCase().includes('handloom') || p.fabric?.toLowerCase().includes('cotton')).slice(0, 3)
      return {
        text: `🌿 **How to Identify Authentic Handloom Sarees:**\n\n- **Organic Slubs & Texture:** Handwoven fabric features subtle, charming thread variations that give it depth and softness.\n- **Interlocking Borders (*Korvai*):** Authentic handloom borders show artisanal hand-joined weft lines on the reverse side.\n- **Supple Breathability:** Handloom cottons and silks drape with natural softness that softens with each wear.\n- **Empowering Artisans:** Every handloom saree from Sri Subhakari Fashions directly supports master weavers in South India!`,
        products: handloomProducts.length > 0 ? handloomProducts : products.slice(0, 3),
        quickReplies: ['🌿 View Handloom Cotton Sarees', '💎 View Kanjivaram Silk', '💬 Ask Stylist on WhatsApp'],
      }
    },
  },

  // 8. STORE LOCATION & SHOWROOM TIMINGS
  {
    id: 'store-location',
    title: 'Showroom Location, Address & Hours',
    category: 'store',
    keywords: [
      'location',
      'where is your store',
      'where is shop',
      'address',
      'repalle',
      'andhra pradesh',
      'guntur',
      'timings',
      'opening hours',
      'open',
      'close',
      'sunday',
      'showroom',
      'visit store',
      'google maps',
      'phone number',
      'contact number',
    ],
    url: CONTACT.googleMapUrl,
    actionLabel: 'Open in Google Maps',
    getContent: () => ({
      text: `🏛️ **Sri Subhakari Cloth Showroom — Repalle**\n\n📍 **Showroom Address:**\n${CONTACT.address}\n\n⏰ **Timings:**\n${CONTACT.businessHours} *(Open All 7 Days!)*\n\n📞 **Customer Support / WhatsApp:**\n${CONTACT.phone} / +${WHATSAPP_NUMBER}\n\n✉️ **Email:**\n${CONTACT.email}\n\nVisit our showroom in Repalle to explore thousands of handpicked sarees, lehengas, and kurtis in person!`,
      quickReplies: ['🗺️ Open in Google Maps', '💬 Chat on WhatsApp', '📦 Shipping & Delivery Info'],
    }),
  },

  // 9. SHIPPING, DELIVERY & COURIER TRACKING
  {
    id: 'shipping-delivery',
    title: 'Pan-India Shipping & Order Tracking',
    category: 'policy',
    keywords: [
      'shipping',
      'delivery',
      'dispatch',
      'how many days',
      'courier',
      'track',
      'tracking',
      'charges',
      'free shipping',
      'pan india',
      'hyderabad',
      'bangalore',
      'chennai',
      'mumbai',
      'delhi',
      'speed post',
    ],
    url: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Sri Subhakari Fashions, I would like to track my order.')}`,
    actionLabel: 'Track Order via WhatsApp',
    isWhatsApp: true,
    getContent: () => ({
      text: `📦 **Pan-India Shipping & Delivery Details**\n\n- **Coverage:** We deliver to all postal pincodes across India.\n- **Dispatch Time:** Every item is quality inspected and dispatched within **24–48 hours**.\n- **Delivery Timeline:**\n  • **South India (AP, Telangana, TN, Karnataka):** 2 to 4 business days.\n  • **Rest of India:** 4 to 7 business days.\n- **Safe Packaging:** 2-layer waterproof & tamper-evident luxury packaging.\n- **Tracking:** Real-time tracking link & courier AWB shared via WhatsApp & SMS immediately upon dispatch.`,
      quickReplies: ['💬 Track my order on WhatsApp', '🛡️ Return & Exchange Policy', '✨ Browse Sarees'],
    }),
  },

  // 10. RETURNS, EXCHANGES & REFUNDS
  {
    id: 'returns-exchange',
    title: 'Return, Exchange & Damage Replacement Policy',
    category: 'policy',
    keywords: [
      'return',
      'returns',
      'exchange',
      'refund',
      'damage',
      'defect',
      'cancel',
      'cancellation',
      'unboxing video',
      'policy',
      'guarantee',
    ],
    url: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I need assistance with an exchange/order query.')}`,
    actionLabel: 'Contact Exchange Support',
    isWhatsApp: true,
    getContent: () => ({
      text: `🛡️ **100% Quality Guarantee & Exchange Policy**\n\n- **Pre-dispatch Inspection:** Every saree undergoes individual hand inspection for fabric integrity, zari perfection, and finish.\n- **Transit Damage Support:** In the rare case of transit damage or defect, we provide prompt exchange.\n- **Unboxing Video Requirement:** Please record a continuous 360° unboxing video from sealed package opening for instant claim processing.\n- **How to Claim:** Contact our team on WhatsApp (+91 93463 97838) within 48 hours of delivery with pictures/video.`,
      quickReplies: ['💬 WhatsApp Support', '📦 Shipping Details', '🛍️ Browse New Arrivals'],
    }),
  },

  // 11. CUSTOM BLOUSE STITCHING, FALL & PICO
  {
    id: 'services-customization',
    title: 'Blouse Stitching, Fall & Pico Services',
    category: 'service',
    keywords: [
      'blouse',
      'stitching',
      'tailoring',
      'fall',
      'pico',
      'tassels',
      'kuchu',
      'maggam work',
      'embroidery',
      'custom size',
      'unstitched blouse',
    ],
    url: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Sri Subhakari Fashions, I would like to inquire about blouse stitching and fall/pico services.')}`,
    actionLabel: 'Discuss Tailoring on WhatsApp',
    isWhatsApp: true,
    getContent: () => ({
      text: `✂️ **Blouse Stitching & Finishing Services**\n\n- **Running Blouse Piece:** All our sarees include an unstitched 0.8m running or contrast designer blouse piece.\n- **Fall & Pico / Hand-tied Tassels (Kuchu):** Can be completed upon request before dispatch via WhatsApp!\n- **Custom Tailoring & Maggam Work:** Share your design measurements or reference photos on WhatsApp with our master tailors for bridal blouses and custom fits.`,
      quickReplies: ['💬 WhatsApp Tailoring Request', '💎 View Bridal Sarees', '👑 View Lehengas'],
    }),
  },

  // 12. CUSTOMER TESTIMONIALS & REVIEWS
  {
    id: 'testimonials-reviews',
    title: 'Customer Reviews & Feedback',
    category: 'testimonials',
    keywords: [
      'review',
      'reviews',
      'testimonial',
      'testimonials',
      'rating',
      'feedback',
      'customer say',
      'is it good',
      'trusted',
      'genuine',
      'reputation',
    ],
    url: '/about',
    actionLabel: 'Read Customer Reviews',
    getContent: () => {
      const topReviews = DEMO_TESTIMONIALS.slice(0, 3)
      const reviewText = topReviews
        .map((t) => `⭐ **${t.rating}/5 — ${t.customer_name}:** "${t.review}"`)
        .join('\n\n')
      return {
        text: `🌟 **What Our Happy Customers Say:**\n\n${reviewText}\n\nThousands of women across India trust Sri Subhakari Fashions for our authentic silk quality, transparent pricing, and fast dispatch!`,
        quickReplies: ['✨ View Best Sellers', '🌸 Sarees under ₹3,000', '💬 Chat on WhatsApp'],
      }
    },
  },

  // 13. SOCIAL MEDIA & YOUTUBE
  {
    id: 'social-media',
    title: 'YouTube Channel, Instagram & Social Handles',
    category: 'about',
    keywords: ['youtube', 'instagram', 'facebook', 'social', 'video', 'watch', 'subscribe', 'channel', 'drape tutorial video'],
    url: SOCIAL.youtube,
    actionLabel: 'Visit Our YouTube Channel',
    getContent: () => ({
      text: `📺 **Connect with Sri Subhakari Fashions on Social Media!**\n\n- **YouTube Channel:** [@srisubhakarifashions](${SOCIAL.youtube}) — Watch new saree collection unboxings, live fabric showcases, and draping tutorials!\n- **Instagram:** [@srisubhakarifashions](${SOCIAL.instagram}) — Daily new arrivals and customer style reels.\n- **Facebook:** [Sri Subhakari Fashions](${SOCIAL.facebook})\n- **WhatsApp VIP Broadcast:** Message us to get instant daily new arrival updates!`,
      quickReplies: ['💬 Join WhatsApp VIP Updates', '🛍️ Browse New Arrivals', '🏛️ Store Location in Repalle'],
    }),
  },
]

/**
 * Tokenizes text and cleans words
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
}

/**
 * Intelligent Multi-layer Knowledge & Product Matcher
 */
export function generateChatbotReply(
  userQuery: string,
  catalogProducts: Product[] = DEMO_PRODUCTS
): ChatbotResponse {
  const query = userQuery.toLowerCase().trim()
  const queryTokens = tokenize(query)
  const productsToSearch = catalogProducts && catalogProducts.length > 0 ? catalogProducts : DEMO_PRODUCTS

  // 1. GREETINGS
  if (/^(hi|hello|hey|namaste|namasthe|vanakkam|good\s*(morning|afternoon|evening)|hola|hii+)\b/i.test(query)) {
    return {
      text: `Namaste & Welcome to **${SITE_NAME}**! 🙏✨\n\nI am **Subha**, your dedicated Style Concierge & Shopping Advisor. I have comprehensive knowledge of our showroom catalog, artisan heritage, draping guides, fabric care, and order services.\n\nHow may I assist you today?`,
      quickReplies: [
        '👑 Recommend Bridal Sarees',
        '🌸 Sarees under ₹3,000',
        '📖 How to drape a Kanjivaram?',
        '🏛️ Store Address & Timings',
      ],
    }
  }

  // 2. CHECK AGAINST SCRAPED WEBSITE KNOWLEDGE BASE (BM25 / Keyword Scoring)
  let bestDoc: WebsiteDoc | null = null
  let maxDocScore = 0

  for (const doc of WEBSITE_KNOWLEDGE_BASE) {
    let score = 0

    // Exact title match bonus
    if (query.includes(doc.title.toLowerCase())) {
      score += 20
    }

    // Keyword match
    for (const kw of doc.keywords) {
      if (query.includes(kw)) {
        score += kw.length > 5 ? 12 : 8
      }
    }

    // Token overlap
    for (const t of queryTokens) {
      if (doc.keywords.some((k) => k.includes(t))) {
        score += 3
      }
      if (doc.title.toLowerCase().includes(t)) {
        score += 2
      }
    }

    if (score > maxDocScore) {
      maxDocScore = score
      bestDoc = doc
    }
  }

  // If we found a confident knowledge doc match (score >= 6), return the rich scraped answer!
  if (bestDoc && maxDocScore >= 6) {
    const docResult = bestDoc.getContent(productsToSearch)
    return {
      text: docResult.text,
      products: docResult.products,
      quickReplies: docResult.quickReplies,
      actionLink: bestDoc.url
        ? {
            label: bestDoc.actionLabel || 'Learn More',
            url: bestDoc.url,
            isExternal: bestDoc.url.startsWith('http') || bestDoc.isWhatsApp,
            isWhatsApp: bestDoc.isWhatsApp,
          }
        : undefined,
    }
  }

  // 3. BUDGET & PRICE PARSER (e.g. "under 2000", "below 5000", "between 2000 and 4000", "affordable")
  const priceMatch = query.match(/(?:under|below|less than|within|budget)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i)
  if (priceMatch && priceMatch[1]) {
    const maxBudget = parseInt(priceMatch[1], 10)
    const affordable = productsToSearch
      .filter((p) => {
        const effectivePrice = p.offer_price || p.price
        return effectivePrice <= maxBudget
      })
      .slice(0, 4)

    if (affordable.length > 0) {
      return {
        text: `💰 **Handcrafted Sarees & Outfits Under ₹${maxBudget.toLocaleString('en-IN')}:**\n\nHere are some of our most popular high-value pieces crafted with premium fabric and elegant motifs:`,
        products: affordable,
        quickReplies: ['🌸 Show Silk Sarees', '🌿 Pure Cotton Sarees', '💬 Chat with Stylist on WhatsApp'],
      }
    } else {
      const closest = [...productsToSearch].sort(
        (a, b) => (a.offer_price || a.price) - (b.offer_price || b.price)
      ).slice(0, 3)

      return {
        text: `Our most affordable handcrafted sarees currently start from **₹${(
          closest[0]?.offer_price || closest[0]?.price || 1500
        ).toLocaleString('en-IN')}**. Here are our top budget-friendly handloom picks:`,
        products: closest,
        quickReplies: ['🌸 View Cotton Sarees', '✨ Silk Sarees under ₹5,000', '💬 Enquire on WhatsApp'],
      }
    }
  }

  // 4. FABRICS SEARCH (Kanjivaram, Banarasi, Silk, Cotton, Organza, Chiffon, Georgette, Crepe, Lehengas, Kurtis)
  const fabrics = [
    { key: 'kanjivaram', label: 'Royal Kanjivaram Silk', desc: 'Woven with pure mulberry silk and authentic gold zari, renowned for royal weddings.' },
    { key: 'banarasi', label: 'Banarasi Silk Brocade', desc: 'Rich floral jaal motifs and metallic zari borders inspired by royal Mughal heritage.' },
    { key: 'silk', label: 'Pure Silk & Soft Silk', desc: 'Lustrous, feather-light drapes perfect for weddings, rituals, and festive evenings.' },
    { key: 'cotton', label: 'Handloom & Pure Cotton', desc: '100% breathable natural cotton woven by South Indian master artisans.' },
    { key: 'organza', label: 'Organza Silk', desc: 'Crisp, lightweight sheer luxury with delicate floral embroidery and modern sheen.' },
    { key: 'chiffon', label: 'Pure Chiffon', desc: 'Airy, fluid drape with exquisite falls and embellished sequin borders.' },
    { key: 'georgette', label: 'Designer Georgette', desc: 'Bouncy, graceful silhouette ideal for cocktail parties and evening events.' },
    { key: 'crepe', label: 'Crepe Silk', desc: 'Smooth crinkle texture with contemporary prints and effortless maintenance.' },
    { key: 'lehenga', label: 'Bridal & Festive Lehengas', desc: 'Grand flare, heavy skirt borders, and matching designer choli.' },
    { key: 'kurti', label: 'Designer Kurtis & Sets', desc: 'Contemporary ethnic sets, anarkalis, and everyday comfort wear.' },
    { key: 'dress material', label: 'Unstitched Dress Materials', desc: 'Premium 3-piece unstitched salwar suits with pure dupatta.' },
  ]

  for (const f of fabrics) {
    if (query.includes(f.key)) {
      const matching = productsToSearch
        .filter((p) => {
          const text = `${p.name} ${p.fabric || ''} ${p.description || ''} ${p.category || ''} ${(p.tags || []).join(' ')}`.toLowerCase()
          return text.includes(f.key)
        })
        .slice(0, 4)

      return {
        text: `✨ **${f.label} Collection**\n\n${f.desc}\n\nHere are handpicked items from our ${f.label} catalogue:`,
        products: matching.length > 0 ? matching : productsToSearch.slice(0, 3),
        quickReplies: [
          `🌸 View more ${f.label}`,
          '💰 Sarees under ₹3,000',
          '🧵 Fabric Care & Wash Guide',
          '💬 Ask Stylist on WhatsApp',
        ],
        actionLink: {
          label: `Browse ${f.label} in Shop`,
          url: '/shop',
        },
      }
    }
  }

  // 5. COLOR SEARCH (Red, Pink, Gold, Green, Blue, Yellow, Purple, Black, Wine, Orange, Teal, White)
  const colors = [
    { name: 'pink', title: 'Rani & Rose Pink', occasion: 'Perfect for weddings, baby showers, and festive mornings.' },
    { name: 'red', title: 'Auspicious Vermillion Red', occasion: 'The quintessential bridal color symbolizing prosperity and grace.' },
    { name: 'gold', title: 'Molten Royal Gold', occasion: 'Opulent and grand for wedding muhurthams and evening receptions.' },
    { name: 'green', title: 'Emerald & Parrot Green', occasion: 'Auspicious shade for poojas, seemantham, and temple celebrations.' },
    { name: 'yellow', title: 'Haldi Yellow & Mustard', occasion: 'Bright and joyful for Haldi ceremonies and harvest festivals.' },
    { name: 'blue', title: 'Royal & Peacock Blue', occasion: 'Deep, photogenic shade for sangeets and cocktail dinners.' },
    { name: 'purple', title: 'Regal Lavender & Purple', occasion: 'Modern, high-fashion statement for contemporary brides.' },
    { name: 'black', title: 'Midnight Black & Metallic', occasion: 'Chic designer wear for evening cocktail parties.' },
    { name: 'wine', title: 'Deep Wine & Maroon', occasion: 'Warm winter wedding favorite with antique zari embellishments.' },
    { name: 'teal', title: 'Peacock Teal', occasion: 'Rich South Indian jewel tone that contrasts wonderfully with gold jewelry.' },
  ]

  for (const c of colors) {
    if (query.includes(c.name)) {
      const colorMatching = productsToSearch
        .filter((p) => {
          const text = `${p.name} ${p.description || ''} ${(p.color || []).join(' ')}`.toLowerCase()
          return text.includes(c.name)
        })
        .slice(0, 4)

      if (colorMatching.length > 0) {
        return {
          text: `🎨 **${c.title} Collection**\n\n${c.occasion}\n\nHere are some of our top rated styles in this shade:`,
          products: colorMatching,
          quickReplies: [
            '✨ Recommend Bridal Sarees',
            '🌸 Sarees under ₹3,000',
            '💬 Chat on WhatsApp with Stylist',
          ],
        }
      }
    }
  }

  // 6. CATEGORY MATCHING (Sarees, Silk Sarees, Cotton Sarees, Designer Sarees, Lehengas, Kurtis, Dress Materials, Ethnic Wear)
  for (const cat of STATIC_CATEGORIES) {
    const isCatMatch =
      query.includes(cat.slug) ||
      query.includes(cat.name.toLowerCase()) ||
      cat.aliases.some((a) => query.includes(a.toLowerCase()))

    if (isCatMatch) {
      const catProducts = productsToSearch
        .filter((p) => {
          const catStr = (typeof p.category === 'object' && p.category ? p.category.name : p.category) || ''
          return (
            catStr.toLowerCase().includes(cat.slug) ||
            catStr.toLowerCase().includes(cat.name.toLowerCase()) ||
            p.name.toLowerCase().includes(cat.name.toLowerCase())
          )
        })
        .slice(0, 4)

      return {
        text: `${cat.emoji} **${cat.name} Collection**\n\n*${cat.subtitle}*\n\n${cat.description}\n\nHere are some of our top picks in **${cat.name}**:`,
        products: catProducts.length > 0 ? catProducts : productsToSearch.slice(0, 3),
        quickReplies: [
          `🛍️ Shop All ${cat.name}`,
          '💰 Sarees under ₹3,000',
          '💬 Chat on WhatsApp',
        ],
        actionLink: {
          label: `View ${cat.name} Collection`,
          url: `/shop?category=${cat.slug}`,
        },
      }
    }
  }

  // 7. SPECIFIC PRODUCT NAME / KEYWORD CATALOG SEARCH
  const matchingProducts = productsToSearch.filter((p) => {
    const nameWords = tokenize(p.name)
    const descWords = tokenize(p.description || '')
    const fabricWords = tokenize(p.fabric || '')
    const allWords = [...nameWords, ...descWords, ...fabricWords]
    return queryTokens.some((qt) => allWords.includes(qt))
  })

  if (matchingProducts.length > 0) {
    return {
      text: `✨ I found these beautiful sarees and ethnic pieces from our catalogue matching "**${userQuery}**":`,
      products: matchingProducts.slice(0, 4),
      quickReplies: [
        '✨ Recommend Bridal Sarees',
        '🌸 Sarees under ₹3,000',
        '💬 Enquire on WhatsApp',
      ],
      actionLink: {
        label: 'Explore Entire Shop',
        url: '/shop',
      },
    }
  }

  // 8. HIGHLY INFORMATIVE CONTEXTUAL FALLBACK
  return {
    text: `I'm happy to help you with anything on **${SITE_NAME}**! ✨\n\nHere are some popular topics you can ask me about:\n\n- **👗 Saree Recommendations:** *"Bridal Silk Sarees"*, *"Handloom Cotton under ₹2,500"*, *"Trending festive colors"*\n- **📖 Saree Draping & Care:** *"How to drape a Kanjivaram"*, *"Silk washing instructions"*\n- **🏛️ Store & Wholesale:** *"Where is your Repalle showroom?"*, *"Wholesale bulk order inquiries"*\n- **📦 Orders & Shipping:** *"Pan-India delivery time"*, *"Exchange & damage policy"*\n\nOr click below to speak directly with our master stylist on WhatsApp!`,
    products: productsToSearch.slice(0, 3),
    quickReplies: [
      '✨ Recommend Bridal Sarees',
      '🌸 Sarees under ₹3,000',
      '📖 How to drape a Kanjivaram?',
      '🏛️ Store Location in Repalle',
    ],
    actionLink: {
      label: 'Ask Stylist on WhatsApp',
      url: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hi Sri Subhakari Fashions! I have a question about: "${userQuery}"`
      )}`,
      isExternal: true,
      isWhatsApp: true,
    },
  }
}
