import sareesImg from '../assets/categories/sarees.jpg'
import silkSareesImg from '../assets/categories/silk-sarees.jpg'
import cottonSareesImg from '../assets/categories/cotton-sarees.jpg'
import designerSareesImg from '../assets/categories/designer-sarees.jpg'
import lehengasImg from '../assets/categories/lehengas.jpg'
import kurtisImg from '../assets/categories/kurtis.jpg'
import dressMaterialsImg from '../assets/categories/dress-materials.jpg'
import ethnicWearImg from '../assets/categories/ethnic-wear.jpg'
import type { Category } from '../types'

export interface StaticCategory extends Category {
  image: string
  emoji: string
  subtitle: string
  aliases: string[]
}

/**
 * The 8 Canonical Static Categories with static frontend display assets.
 * NOTE: Category images are purely static frontend assets bundled in the client.
 * They are NOT stored in or fetched from Supabase Storage or the Supabase database.
 */
export const STATIC_CATEGORIES: StaticCategory[] = [
  {
    id: '1',
    name: 'Sarees',
    slug: 'sarees',
    image: sareesImg,
    emoji: '🥻',
    subtitle: 'Classic Handloom & Everyday Elegance',
    description: 'Explore our quintessential collection of Indian sarees, crafted with pure handlooms and exquisite motifs.',
    order: 1,
    aliases: ['sarees', 'saree'],
  },
  {
    id: '2',
    name: 'Silk Sarees',
    slug: 'silk-sarees',
    image: silkSareesImg,
    emoji: '✨',
    subtitle: 'Soft Silk & Dailywear Handloom Weaves',
    description: 'Comfortable, lightweight soft silk sarees crafted for daily elegance, workwear, and festive gatherings.',
    order: 2,
    aliases: ['silk-sarees', 'silk-saree', 'silksaree', 'silk sarees', 'silk saree', 'cat-silk-saree'],
  },
  {
    id: '3',
    name: 'Cotton Sarees',
    slug: 'cotton-sarees',
    image: cottonSareesImg,
    emoji: '🌿',
    subtitle: 'Lightweight & Breathable Handloom Weaves',
    description: 'Comfortable, breathable pure handloom cotton sarees ideal for work and casual elegance.',
    order: 3,
    aliases: ['cotton-sarees', 'cotton-saree', 'cottonsaree', 'cotton sarees', 'cotton saree', 'cat-cotton-saree'],
  },
  {
    id: '4',
    name: 'Designer Sarees',
    slug: 'designer-sarees',
    image: designerSareesImg,
    emoji: '💎',
    subtitle: 'Contemporary Embellished & Party Wear',
    description: 'Modern silhouettes, rich sequins, and designer party wear sarees tailored to dazzle.',
    order: 4,
    aliases: [
      'designer-sarees',
      'designer-saree',
      'design-saree',
      'design saree',
      'designer sarees',
      'crepe-saree',
      'cat-design-saree',
      'cat-crepe-saree',
    ],
  },
  {
    id: '5',
    name: 'Lehengas',
    slug: 'lehengas',
    image: lehengasImg,
    emoji: '👑',
    subtitle: 'Opulent Bridal & Festive Lehenga Cholis',
    description: 'Magnificent lehenga cholis with elaborate embroidery, flare, and royal elegance.',
    order: 5,
    aliases: ['lehengas', 'lehenga', 'lehenga-choli', 'bridal-lehenga', 'cat-lehengas'],
  },
  {
    id: '6',
    name: 'Kurtis',
    slug: 'kurtis',
    image: kurtisImg,
    emoji: '👚',
    subtitle: 'Trendy Ethnic & Fusion Designer Kurtis',
    description: 'Chic everyday and festive kurtis, tunics, and coordinated sets for contemporary style.',
    order: 6,
    aliases: ['kurtis', 'kurti', "kurti's", 'tops', 'cat-tops', 'ethnic-tops', '3pc-kurta-sets', '3pc kurta sets', '2-piece-sets', '2 piece sets'],
  },
  {
    id: '7',
    name: 'Dress Materials',
    slug: 'dress-materials',
    image: dressMaterialsImg,
    emoji: '🧵',
    subtitle: 'Unstitched Luxury Salwar Suit Sets',
    description: 'Premium unstitched salwar suit fabrics and luxury matching dupatta sets ready to custom tailor.',
    order: 7,
    aliases: ['dress-materials', 'dress-material', 'salwar-suit', 'dress materials', 'cat-dress-materials', 'unstitched-suit'],
  },
  {
    id: '8',
    name: 'Ethnic Wear',
    slug: 'ethnic-wear',
    image: ethnicWearImg,
    emoji: '🌸',
    subtitle: 'Complete Festive & Traditional Attire',
    description: 'Celebration-ready traditional dresses, anarkalis, and ethnic wear ensembles.',
    order: 8,
    aliases: ['ethnic-wear', 'ethnic wear', 'leggings', 'cat-leggings', 'traditional-wear'],
  },
]

export const STATIC_CATEGORY_MAP = new Map<string, StaticCategory>()
STATIC_CATEGORIES.forEach((cat) => {
  STATIC_CATEGORY_MAP.set(cat.id, cat)
  STATIC_CATEGORY_MAP.set(cat.slug.toLowerCase(), cat)
  STATIC_CATEGORY_MAP.set(cat.name.toLowerCase(), cat)
  cat.aliases.forEach((alias) => {
    STATIC_CATEGORY_MAP.set(alias.toLowerCase(), cat)
  })
})

/**
 * Finds a static category by ID, slug, or name.
 */
export function getStaticCategory(key?: string | null): StaticCategory | undefined {
  if (!key) return undefined
  const clean = key.toLowerCase().trim()
  return STATIC_CATEGORY_MAP.get(clean)
}

/**
 * Returns the static image associated with a category.
 */
export function getStaticCategoryImage(key?: string | null): string {
  const cat = getStaticCategory(key)
  return cat ? cat.image : sareesImg
}

/**
 * Returns all possible DB search identifiers (ID, slug, name, aliases) for a category filter query.
 */
export function getCategoryFilterIdentifiers(categoryParam?: string | null): string[] {
  if (!categoryParam) return []
  const cat = getStaticCategory(categoryParam)
  if (cat) {
    return Array.from(new Set([cat.id, cat.slug, cat.name, ...cat.aliases]))
  }
  return [categoryParam]
}
