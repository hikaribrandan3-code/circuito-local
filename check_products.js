import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfwcquwoyaeqgekncmyc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5md2NxdXdveWFlcWdla25jbXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA3NDA2NTksImV4cCI6MjAyNjM0MDY1OX0.4vl6j3GyCW8pKSVKNvnf0gu1FEj3v8fJ7r_h0rL7p44'
);

async function checkProducts() {
  const { data: items, error } = await supabase.from('items').select('id, name, category_id, price');
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('All items in database:');
  items.forEach(item => {
    console.log(`  - ${item.name} (ID: ${item.id}, Category: ${item.category_id}, Price: ${item.price})`);
  });
  
  // Also get categories to see the mapping
  const { data: cats } = await supabase.from('categories').select('id, name');
  console.log('\nCategories:');
  cats.forEach(c => {
    console.log(`  - ${c.name} (ID: ${c.id})`);
  });
}

checkProducts();
