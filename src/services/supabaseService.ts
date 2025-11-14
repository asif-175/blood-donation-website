import { supabase } from '../utils/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  name: string;
  phone?: string;
  city?: string;
  role: 'donor' | 'admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Donor {
  id: string;
  user_id: string;
  blood_group: string;
  age?: number;
  weight?: number;
  last_donation_date?: string;
  is_available: boolean;
  medical_conditions?: string[];
  emergency_contact?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface BloodRequest {
  id: string;
  patient_name: string;
  blood_group: string;
  units_needed: number;
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
  hospital: string;
  city: string;
  contact_person: string;
  phone: string;
  additional_notes?: string;
  status: 'active' | 'fulfilled' | 'cancelled';
  requested_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  request_id?: string;
  donation_date: string;
  location: string;
  amount_ml: number;
  notes?: string;
  created_at: string;
}

export interface DonorResponse {
  id: string;
  donor_id: string;
  request_id: string;
  response_type: 'accepted' | 'declined';
  message?: string;
  created_at: string;
}

class SupabaseService {
  // Auth methods
  async signUp(email: string, password: string, userData: { name: string; phone?: string; city?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    if (error) throw error;

    // Create profile
    if (data.user) {
      await this.createProfile(data.user.id, {
        name: userData.name,
        phone: userData.phone,
        city: userData.city,
        role: 'donor'
      });
    }

    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // Profile methods
  async createProfile(userId: string, profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id: userId, ...profileData }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Donor methods
  async createDonor(donorData: Omit<Donor, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('donors')
      .insert([donorData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getDonor(userId: string): Promise<Donor | null> {
    const { data, error } = await supabase
      .from('donors')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateDonor(donorId: string, updates: Partial<Donor>) {
    const { data, error } = await supabase
      .from('donors')
      .update(updates)
      .eq('id', donorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getDonors(filters?: { bloodGroup?: string; city?: string; available?: boolean }) {
    let query = supabase
      .from('donors')
      .select(`
        *,
        profile:profiles(*)
      `);

    if (filters?.bloodGroup) {
      query = query.eq('blood_group', filters.bloodGroup);
    }
    if (filters?.city) {
      query = query.eq('city', filters.city);
    }
    if (filters?.available !== undefined) {
      query = query.eq('is_available', filters.available);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Blood request methods
  async createBloodRequest(requestData: Omit<BloodRequest, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('blood_requests')
      .insert([requestData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getBloodRequests(filters?: { status?: string; bloodGroup?: string; city?: string }) {
    let query = supabase
      .from('blood_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.bloodGroup) {
      query = query.eq('blood_group', filters.bloodGroup);
    }
    if (filters?.city) {
      query = query.eq('city', filters.city);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async updateBloodRequest(requestId: string, updates: Partial<BloodRequest>) {
    const { data, error } = await supabase
      .from('blood_requests')
      .update(updates)
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Donation methods
  async createDonation(donationData: Omit<Donation, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('donations')
      .insert([donationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getDonations(donorId?: string) {
    let query = supabase
      .from('donations')
      .select('*')
      .order('donation_date', { ascending: false });

    if (donorId) {
      query = query.eq('donor_id', donorId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Donor response methods
  async createDonorResponse(responseData: Omit<DonorResponse, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('donor_responses')
      .insert([responseData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getDonorResponses(donorId?: string, requestId?: string) {
    let query = supabase
      .from('donor_responses')
      .select('*');

    if (donorId) {
      query = query.eq('donor_id', donorId);
    }
    if (requestId) {
      query = query.eq('request_id', requestId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // File upload methods
  async uploadDonorPhoto(userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('donor-photos')
      .upload(fileName, file, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('donor-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  // Realtime subscriptions
  subscribeToBloodRequests(callback: (payload: any) => void) {
    return supabase
      .channel('blood_requests')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'blood_requests' },
        callback
      )
      .subscribe();
  }

  // Utility methods
  getCompatibleBloodGroups(donorBloodGroup: string): string[] {
    const compatibility: Record<string, string[]> = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+']
    };
    return compatibility[donorBloodGroup] || [];
  }

  async getCompatibleRequests(donorBloodGroup: string, donorCity?: string) {
    const compatibleGroups = this.getCompatibleBloodGroups(donorBloodGroup);
    
    let query = supabase
      .from('blood_requests')
      .select('*')
      .eq('status', 'active')
      .in('blood_group', compatibleGroups)
      .order('created_at', { ascending: false });

    if (donorCity) {
      query = query.eq('city', donorCity);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
}

export const supabaseService = new SupabaseService();