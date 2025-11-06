import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://qlhpzsucftqcakiotgpc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaHB6c3VjZnRxY2FraW90Z3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MDgxMTUsImV4cCI6MjA3NzE4NDExNX0.Giemxio92FcpcPpMpJhc4CqKe8sQXRZWEFJqcWBUVeQ'
)

// Create a small test file
const testContent = new Uint8Array([0x89, 0x50, 0x4E, 0x47]) // PNG file header

async function testStorage() {
  try {
    // 1. Try to list buckets
    console.log('1. Checking buckets...')
    const { data: buckets } = await supabase.storage.listBuckets()
    console.log('Available buckets:', buckets?.map(b => b.name))

    // 2. Try to list files in avatars bucket
    console.log('\n2. Checking avatars bucket access...')
    const { data: files, error: listError } = await supabase
      .storage
      .from('avatars')
      .list()

    if (listError) {
      console.log('List error:', listError.message)
    } else {
      console.log('Files in avatars bucket:', files)
    }

    // 3. Try to upload a test file (this should fail without auth)
    console.log('\n3. Testing upload (should fail without auth)...')
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload('test.png', testContent)

    if (uploadError) {
      console.log('Upload error (expected):', uploadError.message)
    } else {
      console.log('Upload succeeded (unexpected!)')
    }

  } catch (err) {
    console.error('Test error:', err)
  }
}

testStorage()