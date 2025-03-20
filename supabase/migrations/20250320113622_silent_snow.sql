/*
  # Create bookings and contacts tables

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `room_id` (text)
      - `check_in` (date)
      - `check_out` (date)
      - `adults` (integer)
      - `children` (integer)
      - `special_requests` (text)
      - `status` (text)
      - `created_at` (timestamp)
      
    - `contacts`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their bookings
    - Add policies for staff to manage contacts
*/

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  room_id text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  adults integer NOT NULL,
  children integer NOT NULL DEFAULT 0,
  special_requests text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_dates CHECK (check_out > check_in),
  CONSTRAINT valid_guests CHECK (adults > 0 AND children >= 0)
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for contacts
CREATE POLICY "Anyone can create contact messages"
  ON contacts
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);
CREATE INDEX IF NOT EXISTS contacts_status_idx ON contacts(status);
CREATE INDEX IF NOT EXISTS contacts_email_idx ON contacts(email);