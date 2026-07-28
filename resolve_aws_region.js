import https from 'https';

const ip = '2406:da1a:314:7102:28a9:fc9f:5d8e:b446';

console.log('Fetching AWS IP ranges...');
https.get('https://ip-ranges.amazonaws.com/ip-ranges.json', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const json = JSON.parse(data);
    const ip6Prefixes = json.ipv6_prefixes;
    
    // We want to find the prefix that matches our IP
    // For simplicity, we can search for prefixes starting with "2406:da1a:"
    const matches = ip6Prefixes.filter(p => p.ipv6_prefix.startsWith('2406:da1a:'));
    console.log('Matching prefixes:');
    matches.forEach(m => {
      console.log(`- Prefix: ${m.ipv6_prefix}, Region: ${m.region}, Service: ${m.service}`);
    });
  });
});
