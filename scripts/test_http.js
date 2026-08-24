async function testStorefrontHttp() {
  try {
    const res = await fetch('http://localhost:8001/shop');
    console.log('HTTP Status:', res.status, res.statusText);
    const text = await res.text();
    console.log('HTML Length:', text.length);
    console.log('Contains "Sri Subhakari Fashions":', text.includes('Sri Subhakari Fashions'));
    console.log('Contains "Shop All Products":', text.includes('Shop All Products') || text.includes('Products'));
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

testStorefrontHttp();
