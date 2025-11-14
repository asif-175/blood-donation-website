-- Blood Donation System Database Schema
-- Run this in Supabase SQL Editor

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE blood_group_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE urgency_level_enum AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE request_status_enum AS ENUM ('active', 'fulfilled', 'cancelled');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    city TEXT,
    role TEXT DEFAULT 'donor' CHECK (role IN ('donor', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donors table
CREATE TABLE public.donors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    blood_group blood_group_enum NOT NULL,
    age INTEGER CHECK (age >= 18 AND age <= 65),
    weight DECIMAL CHECK (weight >= 50),
    last_donation_date DATE,
    is_available BOOLEAN DEFAULT true,
    medical_conditions TEXT[],
    emergency_contact TEXT,
    address TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blood requests table
CREATE TABLE public.blood_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_name TEXT NOT NULL,
    blood_group blood_group_enum NOT NULL,
    units_needed INTEGER NOT NULL CHECK (units_needed > 0),
    urgency_level urgency_level_enum NOT NULL,
    hospital TEXT NOT NULL,
    city TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    additional_notes TEXT,
    status request_status_enum DEFAULT 'active',
    requested_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donation history table
CREATE TABLE public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE,
    request_id UUID REFERENCES public.blood_requests(id),
    donation_date DATE NOT NULL,
    location TEXT NOT NULL,
    amount_ml INTEGER DEFAULT 450,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donor responses to blood requests
CREATE TABLE public.donor_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE,
    request_id UUID REFERENCES public.blood_requests(id) ON DELETE CASCADE,
    response_type TEXT CHECK (response_type IN ('accepted', 'declined')),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(donor_id, request_id)
);

-- Create indexes for better performance
CREATE INDEX idx_donors_blood_group ON public.donors(blood_group);
CREATE INDEX idx_donors_city ON public.donors(city);
CREATE INDEX idx_donors_available ON public.donors(is_available);
CREATE INDEX idx_blood_requests_status ON public.blood_requests(status);
CREATE INDEX idx_blood_requests_blood_group ON public.blood_requests(blood_group);
CREATE INDEX idx_blood_requests_city ON public.blood_requests(city);
CREATE INDEX idx_blood_requests_created_at ON public.blood_requests(created_at);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Donors: Public read access, users can only modify their own donor profile
CREATE POLICY "Donors are viewable by everyone" ON public.donors
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own donor profile" ON public.donors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own donor profile" ON public.donors
    FOR UPDATE USING (auth.uid() = user_id);

-- Blood requests: Public read access, authenticated users can create
CREATE POLICY "Blood requests are viewable by everyone" ON public.blood_requests
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create blood requests" ON public.blood_requests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own blood requests" ON public.blood_requests
    FOR UPDATE USING (auth.uid() = requested_by);

-- Donations: Users can view all, but only insert their own
CREATE POLICY "Donations are viewable by everyone" ON public.donations
    FOR SELECT USING (true);

CREATE POLICY "Donors can insert their own donations" ON public.donations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.donors 
            WHERE donors.id = donations.donor_id 
            AND donors.user_id = auth.uid()
        )
    );

-- Donor responses: Users can view all, but only manage their own
CREATE POLICY "Donor responses are viewable by everyone" ON public.donor_responses
    FOR SELECT USING (true);

CREATE POLICY "Donors can manage their own responses" ON public.donor_responses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.donors 
            WHERE donors.id = donor_responses.donor_id 
            AND donors.user_id = auth.uid()
        )
    );

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.donors
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.blood_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for donor photos
INSERT INTO storage.buckets (id, name, public) VALUES ('donor-photos', 'donor-photos', true);

-- Storage policies
CREATE POLICY "Donor photos are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'donor-photos');

CREATE POLICY "Authenticated users can upload donor photos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'donor-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own donor photos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'donor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own donor photos" ON storage.objects
    FOR DELETE USING (bucket_id = 'donor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);