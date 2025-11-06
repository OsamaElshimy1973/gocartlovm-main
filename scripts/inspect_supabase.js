const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function inspectDatabase() {
  console.log('Inspecting Supabase Configuration...\n');

  // Check tables and schemas
  console.log('=== Tables and Schemas ===');
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('*')
    .eq('table_schema', 'public');
  
  if (tablesError) console.error('Error fetching tables:', tablesError);
  else console.log('Tables:', tables.map(t => t.table_name));

  // Check RLS policies
  console.log('\n=== RLS Policies ===');
  const { data: policies, error: policiesError } = await supabase
    .from('pg_policies')
    .select('*');

  if (policiesError) console.error('Error fetching policies:', policiesError);
  else console.log('Policies:', policies);

  // Check storage buckets
  console.log('\n=== Storage Buckets ===');
  const { data: buckets, error: bucketsError } = await supabase
    .storage
    .listBuckets();

  if (bucketsError) console.error('Error fetching storage buckets:', bucketsError);
  else console.log('Buckets:', buckets);

  // Check custom functions
  console.log('\n=== Custom Functions ===');
  const { data: functions, error: functionsError } = await supabase
    .from('pg_proc')
    .select('*');

  if (functionsError) console.error('Error fetching functions:', functionsError);
  else console.log('Functions:', functions.map(f => f.proname));
}

inspectDatabase().catch(console.error);