import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from the project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing required environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('VITE_SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? '✓' : '✗');
  process.exit(1);
}

console.log('Using Supabase URL:', supabaseUrl);
// Don't log the full key for security
console.log('Service Role Key starts with:', supabaseServiceRoleKey.substring(0, 10) + '...');

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function addStatusColumn() {
  try {
    // First test the connection
    const { data: test, error: testError } = await supabase
      .from('user_roles')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('Connection test failed:', testError);
      process.exit(1);
    }

    console.log('Connection test successful');

    // Then try to add the column
    const { error } = await supabase.rpc('exec_sql', {
      sql_string: `
        ALTER TABLE public.user_roles 
        ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved' 
        CHECK (status IN ('pending', 'approved', 'rejected'));
      `
    });

    if (error) {
      console.error('Error adding status column:', error);
      process.exit(1);
    }

    console.log('Status column added successfully');
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

addStatusColumn();