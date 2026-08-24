import { createClient } from '@sanity/client'
import fs from 'fs'

// Load .env
function loadEnv() {
  const env = {}
  if (fs.existsSync('.env')) {
    const content = fs.readFileSync('.env', 'utf-8')
    content.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
      if (match) {
        let value = match[2] || ''
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.substring(1, value.length - 1)
        }
        env[match[1]] = value.trim()
      }
    })
  }
  return env
}

const env = loadEnv()
const projectId = env['VITE_SANITY_PROJECT_ID'] || 'i2lza03m'
const dataset = env['VITE_SANITY_DATASET'] || 'shopdb'
const token = env['SANITY_AUTH_TOKEN'] || env['VITE_SANITY_TOKEN'] || ''

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-01-01',
  token: token || undefined,
  useCdn: false,
})

const CATEGORIES = [
  { _id: 'cat-tops', _type: 'category', name: 'Tops', slug: { _type: 'slug', current: 'tops' }, order: 1, description: 'Trendy Ethnic & Fusion Designer Kurti Tops' },
  { _id: 'cat-cotton-saree', _type: 'category', name: 'Cotton Saree', slug: { _type: 'slug', current: 'cotton-saree' }, order: 2, description: 'Lightweight & Breathable Handloom Cotton Sarees' },
  { _id: 'cat-design-saree', _type: 'category', name: 'Design Saree', slug: { _type: 'slug', current: 'design-saree' }, order: 3, description: 'Contemporary Embellished & Party Wear Sarees' },
  { _id: 'cat-crepe-saree', _type: 'category', name: 'Crepe Saree', slug: { _type: 'slug', current: 'crepe-saree' }, order: 4, description: 'Fluid Drapes & Soft Luxurious Crepe Chiffon' },
  { _id: 'cat-leggings', _type: 'category', name: 'Leggings', slug: { _type: 'slug', current: 'leggings' }, order: 5, description: 'Premium Stretch & Comfortable Ethnic Leggings' },
  { _id: 'cat-silk-saree', _type: 'category', name: 'Silk Saree', slug: { _type: 'slug', current: 'silk-saree' }, order: 6, description: 'Pure Zari & Heritage Kanjivaram Silk Weaves' },
]

const COLLECTIONS = [
  {
    _id: 'col-featured-sarees',
    _type: 'collection',
    title: 'Featured Sarees',
    slug: { _type: 'slug', current: 'featured-sarees' },
    badge: '⭐ Handpicked',
    subtitle: 'Explore our most-loved collection of sarees and ethnic wear, each crafted for the modern woman who celebrates tradition.',
    order: 1,
    showOnHomepage: true,
    viewAllLabel: 'View All Featured Sarees',
  },
  {
    _id: 'col-new-arrivals',
    _type: 'collection',
    title: 'New Arrivals',
    slug: { _type: 'slug', current: 'new-arrivals' },
    badge: '🆕 Just Arrived',
    subtitle: 'Be the first to discover our freshest designs — straight from the looms of master weavers.',
    order: 2,
    showOnHomepage: true,
    viewAllLabel: 'See All New Arrivals',
  },
  {
    _id: 'col-best-sellers',
    _type: 'collection',
    title: 'Best Sellers',
    slug: { _type: 'slug', current: 'best-sellers' },
    badge: '🏆 Top Rated',
    subtitle: 'Our most popular designs — chosen by thousands of happy customers across India.',
    order: 3,
    showOnHomepage: true,
    viewAllLabel: 'View All Best Sellers',
  },
  {
    _id: 'col-festival-collections',
    _type: 'collection',
    title: 'Festival Collections',
    slug: { _type: 'slug', current: 'festival-collections' },
    badge: '🎊 Festival Ready',
    subtitle: 'Celebrate every festival in style with our exclusive festive wear collection.',
    order: 4,
    showOnHomepage: true,
    viewAllLabel: 'Shop Festival Wear',
  },
]

async function seed() {
  console.log(`Checking Sanity connection for Project: ${projectId}, Dataset: ${dataset}...`)
  
  if (!token) {
    console.log('NOTE: No write token found in .env (SANITY_AUTH_TOKEN).')
    console.log('The schemas for Categories and Collections are active in Sanity Studio at http://localhost:8000/studio where you can create/manage them directly.')
    console.log('Local fallback data is also active and configured with all 6 categories and 4 collections.')
    return
  }

  const transaction = client.transaction()
  CATEGORIES.forEach((cat) => transaction.createOrReplace(cat))
  COLLECTIONS.forEach((col) => transaction.createOrReplace(col))
  
  const result = await transaction.commit()
  console.log('Successfully seeded categories and collections to Sanity:', result)
}

seed().catch(console.error)
