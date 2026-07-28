import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://kmxsgomxxhwpmoayeqmj.supabase.co';
const supabaseAnonKey = 'sb_publishable_0BblhLqDMLI50jSiLg2o8g_yiQ7hVLz';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadHeroImage() {
  const filePath = 'C:\\Users\\New User\\.gemini\\antigravity-ide\\brain\\83857694-dd31-488c-9a2a-fbba79935472\\media__1785235017539.jpg';
  
  if (!fs.existsSync(filePath)) {
    console.error('Error: Source file not found.');
    return;
  }

  const fileBuffer = fs.readFileSync(filePath);
  console.log('Uploading hero-subhakari.jpg to products bucket...');
  
  const { data, error } = await supabase.storage
    .from('products')
    .upload('hero-subhakari.jpg', fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) {
    console.error('Upload failed:', error.message);
  } else {
    console.log('Upload successful!', data);
    console.log('Public URL:', `${supabaseUrl}/storage/v1/object/public/products/hero-subhakari.jpg`);
  }
}

uploadHeroImage();
