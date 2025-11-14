import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lpbntfvmmzikuspgqmlh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYm50ZnZtbXppa3VzcGdxbWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDc4NDMsImV4cCI6MjA3NTMyMzg0M30.bbiXIPa3eNNosNXH7BcDckftNl0GvLsua4UkJetEbZA'
)

const createTable = async () => {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'donor',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `
  })
  
  console.log('Table created:', !error)
  if (error) console.log('Error:', error.message)
}

createTable()