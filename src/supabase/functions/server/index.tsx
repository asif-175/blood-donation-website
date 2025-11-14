import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Enable CORS for all routes
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Enable logging
app.use('*', logger(console.log))

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Helper function to verify JWT token
async function verifyUser(token: string) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return null
    }
    return user
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// Auth routes
app.post('/make-server-b1fb2c61/auth/signup', async (c) => {
  try {
    const { email, password, name, role = 'donor' } = await c.req.json()
    
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })
    
    if (error) {
      console.error('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }
    
    // Store additional user data in KV store
    const userId = data.user.id
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
      donorBadges: [],
      donationCount: 0
    })
    
    return c.json({ 
      message: 'User created successfully',
      user: data.user
    })
  } catch (error) {
    console.error('Signup error:', error)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

app.post('/make-server-b1fb2c61/auth/signin', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('Signin error:', error)
      return c.json({ error: error.message }, 400)
    }
    
    // Get user data from KV store
    const userData = await kv.get(`user:${data.user.id}`)
    
    return c.json({
      access_token: data.session.access_token,
      user: { ...data.user, ...userData }
    })
  } catch (error) {
    console.error('Signin error:', error)
    return c.json({ error: 'Internal server error during signin' }, 500)
  }
})

app.get('/make-server-b1fb2c61/auth/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'No authorization header' }, 401)
    }
    
    const token = authHeader.split(' ')[1]
    const user = await verifyUser(token)
    
    if (!user) {
      return c.json({ error: 'Invalid token' }, 401)
    }
    
    // Get user data from KV store
    const userData = await kv.get(`user:${user.id}`)
    
    return c.json({ ...user, ...userData })
  } catch (error) {
    console.error('Auth me error:', error)
    return c.json({ error: 'Internal server error during auth check' }, 500)
  }
})

// Donor registration routes
app.post('/make-server-b1fb2c61/donors/register', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'No authorization header' }, 401)
    }
    
    const token = authHeader.split(' ')[1]
    const user = await verifyUser(token)
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const donorData = await c.req.json()
    const donorId = `donor:${user.id}`
    
    // Store donor data
    await kv.set(donorId, {
      ...donorData,
      userId: user.id,
      id: donorId,
      createdAt: new Date().toISOString(),
      lastDonation: null,
      isAvailable: true,
      donationCount: 0,
      badges: ['New Donor']
    })
    
    // Update user role to donor
    const userData = await kv.get(`user:${user.id}`) || {}
    await kv.set(`user:${user.id}`, {
      ...userData,
      role: 'donor',
      isDonor: true
    })
    
    return c.json({ message: 'Donor registered successfully' })
  } catch (error) {
    console.error('Donor registration error:', error)
    return c.json({ error: 'Internal server error during donor registration' }, 500)
  }
})

app.get('/make-server-b1fb2c61/donors/search', async (c) => {
  try {
    const bloodGroup = c.req.query('bloodGroup')
    const location = c.req.query('location')
    
    // Get all donors
    const donors = await kv.getByPrefix('donor:')
    
    let filteredDonors = donors.filter((donor: any) => donor.isAvailable)
    
    if (bloodGroup) {
      filteredDonors = filteredDonors.filter((donor: any) => 
        donor.bloodGroup === bloodGroup || 
        getCompatibleBloodGroups(bloodGroup).includes(donor.bloodGroup)
      )
    }
    
    if (location) {
      filteredDonors = filteredDonors.filter((donor: any) => 
        donor.city?.toLowerCase().includes(location.toLowerCase()) ||
        donor.state?.toLowerCase().includes(location.toLowerCase())
      )
    }
    
    return c.json(filteredDonors.map(donor => ({
      ...donor,
      // Remove sensitive information
      phone: donor.phone?.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2'),
      email: donor.email?.replace(/(.{2}).*(@.*)/, '$1****$2')
    })))
  } catch (error) {
    console.error('Donor search error:', error)
    return c.json({ error: 'Internal server error during donor search' }, 500)
  }
})

// Emergency request routes
app.post('/make-server-b1fb2c61/requests/create', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const requestData = await c.req.json()
    
    let userId = null
    if (authHeader) {
      const token = authHeader.split(' ')[1]
      const user = await verifyUser(token)
      if (user) userId = user.id
    }
    
    const requestId = `request:${Date.now()}`
    
    await kv.set(requestId, {
      ...requestData,
      id: requestId,
      userId,
      status: 'urgent',
      createdAt: new Date().toISOString(),
      donors: [],
      fulfilled: false
    })
    
    // Find matching donors and notify them
    const donors = await kv.getByPrefix('donor:')
    const matchingDonors = donors.filter((donor: any) => 
      donor.isAvailable && 
      (donor.bloodGroup === requestData.bloodGroup || 
       getCompatibleBloodGroups(requestData.bloodGroup).includes(donor.bloodGroup)) &&
      donor.city?.toLowerCase() === requestData.city?.toLowerCase()
    )
    
    console.log(`Found ${matchingDonors.length} matching donors for blood group ${requestData.bloodGroup}`)
    
    return c.json({ 
      message: 'Emergency request created successfully',
      id: requestId,
      matchingDonors: matchingDonors.length
    })
  } catch (error) {
    console.error('Request creation error:', error)
    return c.json({ error: 'Internal server error during request creation' }, 500)
  }
})

app.get('/make-server-b1fb2c61/requests/urgent', async (c) => {
  try {
    const requests = await kv.getByPrefix('request:')
    const urgentRequests = requests
      .filter((req: any) => req.status === 'urgent' && !req.fulfilled)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
    
    return c.json(urgentRequests)
  } catch (error) {
    console.error('Urgent requests fetch error:', error)
    return c.json({ error: 'Internal server error during urgent requests fetch' }, 500)
  }
})

// Feedback routes
app.post('/make-server-b1fb2c61/feedback/create', async (c) => {
  try {
    const feedbackData = await c.req.json()
    const feedbackId = `feedback:${Date.now()}`
    
    await kv.set(feedbackId, {
      ...feedbackData,
      id: feedbackId,
      createdAt: new Date().toISOString()
    })
    
    return c.json({ message: 'Feedback submitted successfully' })
  } catch (error) {
    console.error('Feedback creation error:', error)
    return c.json({ error: 'Internal server error during feedback creation' }, 500)
  }
})

app.get('/make-server-b1fb2c61/feedback/success-stories', async (c) => {
  try {
    const feedback = await kv.getByPrefix('feedback:')
    const successStories = feedback
      .filter((f: any) => f.type === 'success_story' && f.story)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
    
    return c.json(successStories)
  } catch (error) {
    console.error('Success stories fetch error:', error)
    return c.json({ error: 'Internal server error during success stories fetch' }, 500)
  }
})

// Stats routes
app.get('/make-server-b1fb2c61/stats', async (c) => {
  try {
    const donors = await kv.getByPrefix('donor:')
    const requests = await kv.getByPrefix('request:')
    const feedback = await kv.getByPrefix('feedback:')
    
    const totalDonors = donors.length
    const bloodUnitsCollected = donors.reduce((sum: number, donor: any) => sum + (donor.donationCount || 0), 0)
    const livesImpacted = bloodUnitsCollected * 3 // Each unit can save up to 3 lives
    const emergencyRequests = requests.filter((req: any) => req.fulfilled).length
    
    return c.json({
      totalDonors,
      bloodUnitsCollected,
      livesImpacted,
      emergencyRequests
    })
  } catch (error) {
    console.error('Stats fetch error:', error)
    return c.json({ error: 'Internal server error during stats fetch' }, 500)
  }
})

// Contact form
app.post('/make-server-b1fb2c61/contact', async (c) => {
  try {
    const contactData = await c.req.json()
    const contactId = `contact:${Date.now()}`
    
    await kv.set(contactId, {
      ...contactData,
      id: contactId,
      createdAt: new Date().toISOString(),
      status: 'new'
    })
    
    return c.json({ message: 'Contact form submitted successfully' })
  } catch (error) {
    console.error('Contact form error:', error)
    return c.json({ error: 'Internal server error during contact form submission' }, 500)
  }
})

// Helper function to get compatible blood groups
function getCompatibleBloodGroups(bloodGroup: string): string[] {
  const compatibility: { [key: string]: string[] } = {
    'O-': ['O-'],
    'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
  }
  
  return compatibility[bloodGroup] || []
}

// Health check
app.get('/make-server-b1fb2c61/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start the server
Deno.serve(app.fetch)