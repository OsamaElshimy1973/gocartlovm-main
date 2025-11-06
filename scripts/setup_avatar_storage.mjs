import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://qlhpzsucftqcakiotgpc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaHB6c3VjZnRxY2FraW90Z3BjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTYwODExNSwiZXhwIjoyMDc3MTg0MTE1fQ.rhSDgw-RaInbJL52MgKfDB7XWd9F6w_G86pVFZkyM3A"
)

async function setupAvatarStorage() {
  console.log('Setting up avatar storage...\n')

  try {
    // Create avatars bucket
    console.log('Creating avatars bucket...')
    const { data: bucket, error: bucketError } = await supabase
      .storage
      .createBucket('avatars', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        fileSizeLimit: 1024 * 1024 * 2 // 2MB
      })

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('Avatars bucket already exists')
      } else {
        console.error('Error creating bucket:', bucketError)
        return
      }
    } else {
      console.log('Successfully created avatars bucket')
    }

    // Check bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    console.log('\nCurrent buckets:', buckets?.map(b => b.name))

    // Set up storage policies
    console.log('\nSetting up storage policies...')
    
    // Allow authenticated users to upload their own avatars
    const { error: uploadError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'avatars',
      operation: 'INSERT',
      policy_name: 'Allow authenticated users to upload avatars',
      policy_definition: `(auth.uid() = auth.uid())`
    })

    if (uploadError) {
      console.error('Error setting upload policy:', uploadError)
    } else {
      console.log('Upload policy set successfully')
    }

    // Allow public read access
    const { error: readError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'avatars',
      operation: 'SELECT',
      policy_name: 'Allow public to read avatars',
      policy_definition: `(true)`
    })

    if (readError) {
      console.error('Error setting read policy:', readError)
    } else {
      console.log('Read policy set successfully')
    }

    // Allow users to update their own avatars
    const { error: updateError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'avatars',
      operation: 'UPDATE',
      policy_name: 'Allow users to update their avatars',
      policy_definition: `(auth.uid() = auth.uid())`
    })

    if (updateError) {
      console.error('Error setting update policy:', updateError)
    } else {
      console.log('Update policy set successfully')
    }

    console.log('\nStorage setup complete!')

  } catch (err) {
    console.error('Error setting up storage:', err)
  }
}

setupAvatarStorage()