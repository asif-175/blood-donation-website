import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lpbntfvmmzikuspgqmlh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYm50ZnZtbXppa3VzcGdxbWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDc4NDMsImV4cCI6MjA3NTMyMzg0M30.bbiXIPa3eNNosNXH7BcDckftNl0GvLsua4UkJetEbZA'
)

const checkUsers = async () => {
  try {
    // Check what tables exist
    const { data: tables } = await supabase.rpc('get_tables')
    console.log('Available tables:', tables)
    
    // Check auth users
    const { data: session } = await supabase.auth.getSession()
    console.log('Current session:', !!session.session)
    
    // Try common table names
    const tableNames = ['users', 'profiles', 'user_profiles']
    for (const table of tableNames) {
      const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true })
      if (!error) {
        console.log(`Table '${table}' exists with ${data} records`)
      }
    }
  } catch (err) {
    console.log('Error:', err.message)
  }
}

checkUsers()