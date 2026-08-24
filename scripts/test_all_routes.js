const routes = [
  'http://localhost:8001/',
  'http://localhost:8001/shop',
  'http://localhost:8001/shop?category=sarees',
  'http://localhost:8001/shop?category=silk-sarees',
  'http://localhost:8001/admin/products',
  'http://localhost:8001/admin/products/new',
];

async function testAllRoutes() {
  console.log('Testing routes:');
  for (const url of routes) {
    try {
      const res = await fetch(url);
      console.log(`  ${res.status === 200 ? '✅' : '❌'} [${res.status}] ${url}`);
    } catch (err) {
      console.log(`  ❌ [FAILED] ${url} -> ${err.message}`);
    }
  }
}

testAllRoutes();
