import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://qlhpzsucftqcakiotgpc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaHB6c3VjZnRxY2FraW90Z3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MDgxMTUsImV4cCI6MjA3NzE4NDExNX0.Giemxio92FcpcPpMpJhc4CqKe8sQXRZWEFJqcWBUVeQ"
)

async function checkSupabase() {
  console.log('Checking Supabase configuration with anon key...\n')

  try {
    // Try to fetch public data
    console.log('Checking public tables...')
    const { data: siteTexts, error: textError } = await supabase
      .from('site_texts')
      .select('*')
      .limit(1)
    
    if (textError) {
      console.error('Error accessing site_texts:', textError)
    } else {
      console.log('Successfully accessed site_texts table')
    }

    // Check storage buckets (public access)
    console.log('\nChecking storage buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('Error accessing storage:', bucketsError)
    } else {
      console.log('Storage buckets:', buckets)
    }

    // Check some key tables
    console.log('\nChecking key tables...')
    const tables = ['products', 'stores', 'profiles']
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)
      
      console.log(`\nTable '${table}':`, error ? `Error: ${error.message}` : 'Accessible')
    }

  } catch (err) {
    console.error('Error checking Supabase:', err)
  }
}

checkSupabase()