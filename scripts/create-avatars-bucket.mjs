// scripts/create-avatars-bucket.mjs
import 'dotenv/config';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE URL / KEY in .env (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY or SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

async function run() {
  try {
    const url = SUPABASE_URL.replace(/\/+$/, '') + '/storage/v1/buckets';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'avatars', public: true }),
    });

    const bodyText = await res.text();
    console.log('HTTP status:', res.status);
    console.log('Response body:', bodyText);
  } catch (err) {
    console.error('Request failed:', err);
  }
}

run();