import { supabase } from './supabase/client'

// Check if user exists by email
export const checkUserExists = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .single()
  
  return { exists: !!data, user: data, error }
}

// Check current authenticated user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Check if user is authenticated
export const isUserAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session?.user
}