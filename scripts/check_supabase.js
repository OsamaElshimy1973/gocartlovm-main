const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
)

async function checkSupabase() {
  console.log('Checking Supabase configuration...\n')

  // Check tables
  const { data: tables } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
  console.log('Tables:', tables?.map(t => t.table_name))

  // Check storage buckets
  const { data: buckets } = await supabase.storage.listBuckets()
  console.log('\nStorage Buckets:', buckets)

  // Check policies
  const { data: policies } = await supabase.rpc('get_policies')
  console.log('\nRLS Policies:', policies)

  // Check installed extensions
  const { data: extensions } = await supabase
    .from('pg_extension')
    .select('extname')
  console.log('\nInstalled Extensions:', extensions?.map(e => e.extname))
}

checkSupabase().catch(console.error)