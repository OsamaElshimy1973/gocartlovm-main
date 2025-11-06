import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Read .env file
const envContent = fs.readFileSync('.env', 'utf8')
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('='))
    .map(([key, value]) => [key, value.replace(/["']/g, '')])
)

const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_SERVICE_ROLE_KEY
)

async function checkSupabase() {
  console.log('Checking Supabase configuration...\n')

  try {
    // Check tables
    console.log('Checking tables...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tablesError) console.error('Error fetching tables:', tablesError)
    else console.log('Tables:', tables?.map(t => t.table_name))

    // Check storage buckets
    console.log('\nChecking storage buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) console.error('Error fetching buckets:', bucketsError)
    else console.log('Storage Buckets:', buckets)

    // Check RLS policies for a few key tables
    console.log('\nChecking RLS policies...')
    for (const table of ['profiles', 'products', 'stores']) {
      const { data, error } = await supabase
        .from(table)
        .select()
        .limit(0)
      
      console.log(`\nTable '${table}' access:`, error ? 'Restricted' : 'Allowed')
      if (error) console.log(`Policy info: ${error.message}`)
    }

  } catch (err) {
    console.error('Error checking Supabase:', err)
  }
}

checkSupabase()