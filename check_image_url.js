import https from 'https';

const url = 'https://kmxsgomxxhwpmoayeqmj.supabase.co/storage/v1/object/public/products/ps23okglh_1785232168018.webp';

console.log(`Checking URL: ${url}`);
https.request(url, { method: 'HEAD' }, (res) => {
  console.log(`HTTP Status Code: ${res.statusCode}`);
  console.log('Headers:', res.headers);
}).on('error', (err) => {
  console.error('Error:', err.message);
}).end();
