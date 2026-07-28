import https from 'https';

const apiKey = 'sb_publishable_0BblhLqDMLI50jSiLg2o8g_yiQ7hVLz';
const options = {
  headers: {
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`
  }
};

async function checkUploadedData() {
  console.log('Querying products table in live Supabase...');
  const url = 'https://kmxsgomxxhwpmoayeqmj.supabase.co/rest/v1/products?select=*';
  
  https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const products = JSON.parse(data);
        console.log(`\nTotal products found: ${products.length}`);
        products.forEach(p => {
          console.log(`- Product Name: "${p.name}"`);
          console.log(`  SKU: ${p.sku}`);
          console.log(`  Images: ${JSON.stringify(p.images)}`);
        });
      } catch (e) {
        console.log('Error parsing response:', data);
      }
    });
  }).on('error', (err) => {
    console.error('Error:', err.message);
  });
}

checkUploadedData();
