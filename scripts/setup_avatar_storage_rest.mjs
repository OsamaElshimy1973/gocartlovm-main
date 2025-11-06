import fetch from 'node-fetch'

const PROJECT_ID = 'qlhpzsucftqcakiotgpc'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaHB6c3VjZnRxY2FraW90Z3BjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTYwODExNSwiZXhwIjoyMDc3MTg0MTE1fQ.rhSDgw-RaInbJL52MgKfDB7XWd9F6w_G86pVFZkyM3A'

async function setupAvatarStorage() {
  console.log('Setting up avatar storage via REST API...\n')

  try {
    // Create avatars bucket
    console.log('Creating avatars bucket...')
    const createBucketResponse = await fetch(
      `https://${PROJECT_ID}.supabase.co/storage/v1/bucket`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'avatars',
          public: true,
          file_size_limit: 2097152, // 2MB
          allowed_mime_types: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        })
      }
    )

    const bucketResult = await createBucketResponse.json()
    console.log('Bucket creation response:', bucketResult)

    // List buckets to verify
    console.log('\nVerifying buckets...')
    const listBucketsResponse = await fetch(
      `https://${PROJECT_ID}.supabase.co/storage/v1/bucket`,
      {
        headers: {
          'Authorization': `Bearer ${SERVICE_KEY}`
        }
      }
    )

    const buckets = await listBucketsResponse.json()
    console.log('Current buckets:', buckets)

    console.log('\nStorage setup complete!')

  } catch (err) {
    console.error('Error setting up storage:', err)
  }
}

setupAvatarStorage()