import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file. Please set VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  try {
    console.log('Checking for product_attributes table (attempting simple select)...')

    const { data, error } = await supabase
      .from('product_attributes')
      .select('id')
      .limit(1)

    if (error) {
      // Common error when table doesn't exist will be returned here
      console.log('product_attributes table does NOT exist. Error message from Supabase:', error.message)
      process.exitCode = 0
      return
    }

    console.log('product_attributes table exists (select succeeded).')
    return
  } catch (err: any) {
    console.error('Unexpected error during check:', err.message || err)
    process.exit(1)
  }
}

check()
