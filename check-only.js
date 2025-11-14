import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lpbntfvmmzikuspgqmlh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYm50ZnZtbXppa3VzcGdxbWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDc4NDMsImV4cCI6MjA3NTMyMzg0M30.bbiXIPa3eNNosNXH7BcDckftNl0GvLsua4UkJetEbZA'
)

const checkOnly = async () => {
  // Just check what we can see
  const { data, error, count } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
  
  console.log('Users visible:', count || 0)
  console.log('Data:', data)
  
  if (error) {
    console.log('Error:', error.message)
  }
}

checkOnly()