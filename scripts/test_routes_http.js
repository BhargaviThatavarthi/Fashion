async function checkUrl(path) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`http://localhost:8001${path}`, { signal: controller.signal });
    clearTimeout(timeout);
    return { path, status: res.status };
  } catch (err) {
    return { path, error: err.message };
  }
}

async function main() {
  const paths = [
    '/',
    '/shop',
    '/shop?category=sarees',
    '/shop?category=silk-sarees',
    '/admin/products',
    '/admin/products/new',
  ];

  console.log('='.repeat(50));
  console.log('🌐 TESTING STOREFRONT & ADMIN HTTP ROUTES');
  console.log('='.repeat(50));

  for (const p of paths) {
    const result = await checkUrl(p);
    if (result.error) {
      console.log(`❌ ${p} -> Error: ${result.error}`);
    } else {
      console.log(`✅ [${result.status}] ${p}`);
    }
  }

  console.log('='.repeat(50));
}

main();
