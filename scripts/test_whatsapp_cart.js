// Verification test for WhatsApp cart ordering message format
import { generateCartWhatsAppMessage, buildWhatsAppCartOrderUrl, formatRupees } from '../src/utils/whatsapp.ts'

const testCart = [
  {
    id: 'test-1',
    productId: 'prod-1',
    name: 'Blue Silk Saree',
    slug: 'blue-silk-saree',
    price: 2999,
    quantity: 2,
  },
  {
    id: 'test-2',
    productId: 'prod-2',
    name: 'Cotton Saree',
    slug: 'cotton-saree',
    price: 1499,
    quantity: 1,
  },
]

console.log('--- Testing WhatsApp Message Generation ---')
const message = generateCartWhatsAppMessage(testCart)
console.log('GENERATED MESSAGE:\n')
console.log(message)
console.log('\n-------------------------------------------')

const url = buildWhatsAppCartOrderUrl(testCart, '919346397838')
console.log('GENERATED URL:\n', url)

// Assertions
const expectedParts = [
  'Hello! I would like to place an order.',
  '🛍️ *Order Details*',
  '1. *Blue Silk Saree*',
  'Quantity: 2',
  'Price: ₹2,999',
  'Subtotal: ₹5,998',
  '2. *Cotton Saree*',
  'Quantity: 1',
  'Price: ₹1,499',
  'Subtotal: ₹1,499',
  '*Total Items:* 3',
  '*Total Amount:* ₹7,497',
]

let allPassed = true
for (const part of expectedParts) {
  if (!message.includes(part)) {
    console.error(`❌ FAILED: Message missing "${part}"`)
    allPassed = false
  } else {
    console.log(`✅ Passed: Contains "${part}"`)
  }
}

if (!url.startsWith('https://wa.me/919346397838?text=')) {
  console.error('❌ FAILED: URL prefix invalid')
  allPassed = false
} else {
  console.log('✅ Passed: URL format valid')
}

if (allPassed) {
  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!')
  process.exit(0)
} else {
  console.error('\n❌ SOME TESTS FAILED!')
  process.exit(1)
}
