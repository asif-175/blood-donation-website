import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lpbntfvmmzikuspgqmlh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYm50ZnZtbXppa3VzcGdxbWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDc4NDMsImV4cCI6MjA3NTMyMzg0M30.bbiXIPa3eNNosNXH7BcDckftNl0GvLsua4UkJetEbZA'
)

const setup = async () => {
  // Insert a test user to create the table
  const { data, error } = await supabase
    .from('users')
    .insert({ 
      email: 'test@example.com', 
      name: 'Test User',
      role: 'donor' 
    })
    .select()

  if (error) {
    console.log('❌ Cannot create table:', error.message)
    console.log('🔧 Go to Supabase dashboard and create users table manually')
  } else {
    console.log('✅ User created:', data)
    
    // Now check all users
    const { data: users } = await supabase.from('users').select('*')
    console.log('📊 Total users:', users?.length || 0)
  }
}

setup()