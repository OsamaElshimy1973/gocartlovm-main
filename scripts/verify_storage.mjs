import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://qlhpzsucftqcakiotgpc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaHB6c3VjZnRxY2FraW90Z3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MDgxMTUsImV4cCI6MjA3NzE4NDExNX0.Giemxio92FcpcPpMpJhc4CqKe8sQXRZWEFJqcWBUVeQ"
)

async function verifyStorageSetup() {
  console.log('Verifying storage setup...\n')

  try {
    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets()

    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError)
    } else {
      console.log('Available buckets:', buckets)
      
      // Verify avatars bucket exists
      const avatarsBucket = buckets?.find(b => b.name === 'avatars')
      if (avatarsBucket) {
        console.log('\nAvatars bucket found:', avatarsBucket)
        console.log('Public access:', avatarsBucket.public ? 'Enabled' : 'Disabled')
      }
    }

    // Try to list files in avatars bucket (this should work with public access)
    const { data: files, error: filesError } = await supabase
      .storage
      .from('avatars')
      .list()

    if (filesError) {
      console.error('\nError listing files:', filesError)
    } else {
      console.log('\nCurrent files in avatars bucket:', files)
    }

  } catch (err) {
    console.error('Error during verification:', err)
  }
}

verifyStorageSetup()