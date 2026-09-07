// Sri Subhakari Fashions — Constants
export { DEMO_CATEGORIES, DEMO_COLLECTIONS, DEMO_PRODUCTS, DEMO_TESTIMONIALS } from '../types'

export const SITE_NAME = 'Sri Subhakari Fashions'
export const SITE_TAGLINE = 'Elegance in Every Thread'
export const SITE_DESCRIPTION =
  'Discover beautiful sarees and ethnic wear crafted with elegance and tradition. Premium quality silk sarees, designer lehengas, and ethnic wear at Sri Subhakari Fashions.'

// Store WhatsApp Number in international format (without +, spaces, or dashes)
// Configurable via VITE_WHATSAPP_NUMBER env var or directly here
const envWhatsApp = typeof import.meta !== 'undefined' && import.meta.env?.VITE_WHATSAPP_NUMBER
export const WHATSAPP_NUMBER = (envWhatsApp || '919346397838').replace(/[^0-9]/g, '')

export const CONTACT = {
  whatsapp: `+${WHATSAPP_NUMBER}`,
  phone: '+91 93463 97838',
  email: 'thatavathibhargavi@gmail.com',
  address: 'Sri subhakari cloth showroom, 13-21-16, 4thward, opposite bhavana rushi mandir, Repalle, Andhra Pradesh-522265',
  googleMapUrl: 'https://q.me-qr.com/19x1qvhh',
  qrLocationUrl: 'https://q.me-qr.com/19x1qvhh',
  businessHours: 'Mon–Sun: 09:00 AM – 10:00 PM',
}

export const SOCIAL = {
  instagram: 'https://instagram.com/srisubhakarifashions',
  youtube: 'https://youtube.com/@srisubhakarifashions',
  facebook: 'https://facebook.com/srisubhakarifashions',
  linkedin: 'https://linkedin.com/company/srisubhakarifashions',
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
}

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop All', href: '/shop' },
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
]

export const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Sanity CMS', href: '/studio', icon: 'Edit' },
  { label: 'Products', href: '/admin/products', icon: 'Package' },
  { label: 'Categories', href: '/admin/categories', icon: 'Tag' },
  { label: 'Homepage', href: '/admin/homepage', icon: 'Home' },
  { label: 'Testimonials', href: '/admin/testimonials', icon: 'MessageSquare' },
  { label: 'Social Media', href: '/admin/social', icon: 'Share2' },
  { label: 'YouTube', href: '/admin/youtube', icon: 'Youtube' },
  { label: 'Enquiries', href: '/admin/enquiries', icon: 'Inbox' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
]

export const FABRIC_OPTIONS = [
  'Pure Silk',
  'Kanjivaram Silk',
  'Banarasi Silk',
  'Chiffon',
  'Georgette',
  'Cotton',
  'Handloom Cotton',
  'Crepe',
  'Net',
  'Linen',
  'Organza',
  'Tussar Silk',
  'Rayon',
]

export const COLOR_OPTIONS = [
  'Red',
  'Pink',
  'Rose Pink',
  'Gold',
  'Blue',
  'Sky Blue',
  'Green',
  'Yellow',
  'Purple',
  'Maroon',
  'Orange',
  'Teal',
  'White',
  'Black',
  'Wine',
  'Peach',
]

export const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size']

export const SORT_OPTIONS = [
  { label: 'Latest', value: 'latest' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
]

export const YOUTUBE_VIDEOS = [
  {
    id: 'yt-1',
    video_id: 'K5qB8hrlB_E',
    title: 'Elegant Embroidered Anarkali-Style Kurta Set',
    thumbnail: 'https://i.ytimg.com/vi/K5qB8hrlB_E/mqdefault.jpg',
    sort_order: 0,
  },
  {
    id: 'yt-2',
    video_id: 'GgxEPjYNan0',
    title: 'Space Silk Sarees — Double Shaded New Collection',
    thumbnail: 'https://i.ytimg.com/vi/GgxEPjYNan0/mqdefault.jpg',
    sort_order: 1,
  },
  {
    id: 'yt-3',
    video_id: 'Jt3t4B6qaFY',
    title: 'Elegant Semi-Stitched Lehenga Collection',
    thumbnail: 'https://i.ytimg.com/vi/Jt3t4B6qaFY/mqdefault.jpg',
    sort_order: 2,
  },
  {
    id: 'yt-4',
    video_id: '5FMEHeXsk_o',
    title: 'Banaras Sarees Best Price Collection',
    thumbnail: 'https://i.ytimg.com/vi/5FMEHeXsk_o/mqdefault.jpg',
    sort_order: 3,
  },
  {
    id: 'yt-5',
    video_id: 'QhLb7HRUA-Y',
    title: 'Fancy Saree with Heavy Embroidery',
    thumbnail: 'https://i.ytimg.com/vi/QhLb7HRUA-Y/mqdefault.jpg',
    sort_order: 4,
  },
  {
    id: 'yt-6',
    video_id: 'k-yMr11D7tU',
    title: 'Beautiful Half Sarees Collection',
    thumbnail: 'https://i.ytimg.com/vi/k-yMr11D7tU/mqdefault.jpg',
    sort_order: 5,
  },
]

export const WHY_CHOOSE_US = [
  {
    icon: 'Shield',
    title: 'Premium Quality',
    description: 'Every piece is hand-selected for the finest fabric quality and authentic craftsmanship.',
  },
  {
    icon: 'Sparkles',
    title: 'Authentic Handcraft',
    description: 'We work directly with master weavers and artisans to bring you genuine handcrafted pieces.',
  },
  {
    icon: 'MessageCircle',
    title: 'WhatsApp Support',
    description: 'Personalized shopping assistance via WhatsApp. We help you find your perfect ethnic wear.',
  },
  {
    icon: 'TruckIcon',
    title: 'Pan-India Delivery',
    description: 'We deliver across India with safe and secure packaging to keep your precious garments pristine.',
  },
  {
    icon: 'ShieldCheck',
    title: '100% Quality Inspected',
    description: 'Every handloom piece undergoes rigorous inspection & secure waterproof packaging prior to dispatch.',
  },
  {
    icon: 'Award',
    title: 'Trusted Since Years',
    description: 'A trusted name in ethnic fashion with thousands of happy customers across India.',
  },
]

export const INSTAGRAM_POSTS = [
  { id: 'ig1', image: '/placeholder-ig-1.jpg', link: 'https://instagram.com' },
  { id: 'ig2', image: '/placeholder-ig-2.jpg', link: 'https://instagram.com' },
  { id: 'ig3', image: '/placeholder-ig-3.jpg', link: 'https://instagram.com' },
  { id: 'ig4', image: '/placeholder-ig-4.jpg', link: 'https://instagram.com' },
  { id: 'ig5', image: '/placeholder-ig-5.jpg', link: 'https://instagram.com' },
  { id: 'ig6', image: '/placeholder-ig-6.jpg', link: 'https://instagram.com' },
]
