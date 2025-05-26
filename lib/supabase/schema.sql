-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create roles enum
CREATE TYPE user_role AS ENUM ('provider', 'client', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  role user_role NOT NULL DEFAULT 'client',
  backup_email TEXT UNIQUE,
  secure BOOLEAN DEFAULT false,
  last_username_change TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Add user_type column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_type text;

-- Policy to allow users to update their own user_type
CREATE POLICY update_own_profile_type ON public.profiles 
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);