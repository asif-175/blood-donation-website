import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lpbntfvmmzikuspgqmlh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYm50ZnZtbXppa3VzcGdxbWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDc4NDMsImV4cCI6MjA3NTMyMzg0M30.bbiXIPa3eNNosNXH7BcDckftNl0GvLsua4UkJetEbZA'
)

// Test basic connection
const test = async () => {
  console.log('Testing Supabase connection...')
  
  // Try to access any table
  const { data, error } = await supabase.from('users').select('*').limit(1)
  
  if (error) {
    console.log('❌ Error:', error.message)
    console.log('💡 Solution: Go to https://supabase.com/dashboard/project/lpbntfvmmzikuspgqmlh/editor')
    console.log('💡 Create a "users" table or check existing tables')
  } else {
    console.log('✅ Connected! Users found:', data?.length || 0)
  }
}

test()