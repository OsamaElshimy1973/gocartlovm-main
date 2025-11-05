import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function inspectSchema() {
  // Get table info using a raw query
  const { data: tables, error: tablesError } = await supabase
    .rpc('query_schema', {
      sql_string: `
        SELECT 
          c.table_name,
          c.column_name,
          c.data_type,
          c.is_nullable,
          c.column_default
        FROM information_schema.columns c
        WHERE c.table_schema = 'public'
        ORDER BY c.table_name, c.ordinal_position`
    })

  if (tablesError) {
    console.error('Error fetching tables:', tablesError)
    return
  }

  console.log('Table Definitions:')
  console.log(JSON.stringify(tables, null, 2))
  
  // Get constraints
  const { data: constraints, error: constraintsError } = await supabase
    .rpc('query_schema', {
      sql_string: `
        SELECT 
          tc.table_name,
          tc.constraint_name,
          tc.constraint_type
        FROM information_schema.table_constraints tc
        WHERE tc.table_schema = 'public'
        ORDER BY tc.table_name`
    })

  if (constraintsError) {
    console.error('Error fetching constraints:', constraintsError)
    return
  }

  console.log('\nTable Constraints:')
  console.log(JSON.stringify(constraints, null, 2))
  
  // Get RLS policies
  const { data: policies, error: policiesError } = await supabase
    .rpc('query_schema', {
      sql_string: `
        SELECT 
          schemaname,
          tablename,
          policyname,
          permissive,
          roles,
          cmd,
          qual,
          with_check
        FROM pg_policies
        WHERE schemaname = 'public'
        ORDER BY tablename, policyname`
    })

  if (policiesError) {
    console.error('Error fetching policies:', policiesError)
    return
  }

  console.log('\nRLS Policies:')
  console.log(JSON.stringify(policies, null, 2))
}

inspectSchema().catch(console.error)