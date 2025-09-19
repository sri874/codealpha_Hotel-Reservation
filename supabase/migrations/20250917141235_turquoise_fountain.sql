/*
  # Hotel Reservation System Database Schema

  1. New Tables
    - `hotels`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `address` (text)
      - `city` (text)
      - `country` (text)
      - `rating` (integer)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `room_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `base_price` (decimal)
      - `max_occupancy` (integer)
      - `amenities` (text[])
      - `created_at` (timestamp)
    
    - `rooms`
      - `id` (uuid, primary key)
      - `hotel_id` (uuid, foreign key)
      - `category_id` (uuid, foreign key)
      - `room_number` (text)
      - `floor` (integer)
      - `status` (text)
      - `created_at` (timestamp)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `room_id` (uuid, foreign key)
      - `check_in_date` (date)
      - `check_out_date` (date)
      - `total_amount` (decimal)
      - `status` (text)
      - `payment_status` (text)
      - `guest_count` (integer)
      - `special_requests` (text)
      - `created_at` (timestamp)
    
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to hotels and room data
*/

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  address text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  rating integer DEFAULT 3 CHECK (rating >= 1 AND rating <= 5),
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Room categories table
CREATE TABLE IF NOT EXISTS room_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  base_price decimal(10,2) NOT NULL DEFAULT 0,
  max_occupancy integer NOT NULL DEFAULT 2,
  amenities text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE,
  category_id uuid REFERENCES room_categories(id) ON DELETE CASCADE,
  room_number text NOT NULL,
  floor integer DEFAULT 1,
  status text DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')),
  created_at timestamptz DEFAULT now()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  status text DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  guest_count integer NOT NULL DEFAULT 1,
  special_requests text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Hotels: Public read access
CREATE POLICY "Anyone can view hotels"
  ON hotels
  FOR SELECT
  TO public
  USING (true);

-- Room categories: Public read access
CREATE POLICY "Anyone can view room categories"
  ON room_categories
  FOR SELECT
  TO public
  USING (true);

-- Rooms: Public read access
CREATE POLICY "Anyone can view rooms"
  ON rooms
  FOR SELECT
  TO public
  USING (true);

-- Profiles: Users can manage their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Bookings: Users can manage their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample data

-- Sample hotels
INSERT INTO hotels (name, description, address, city, country, rating, image_url) VALUES
('Grand Palace Hotel', 'Luxury hotel in the heart of the city with exceptional service and amenities.', '123 Main Street', 'New York', 'USA', 5, 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg'),
('Seaside Resort & Spa', 'Beautiful oceanfront resort with spa services and breathtaking views.', '456 Ocean Drive', 'Miami', 'USA', 4, 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg'),
('Mountain View Lodge', 'Cozy mountain retreat perfect for nature lovers and adventure seekers.', '789 Mountain Road', 'Denver', 'USA', 4, 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg');

-- Sample room categories
INSERT INTO room_categories (name, description, base_price, max_occupancy, amenities, image_url) VALUES
('Standard', 'Comfortable rooms with essential amenities for a pleasant stay.', 120.00, 2, '{"Free WiFi","Air Conditioning","TV","Private Bathroom"}', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'),
('Deluxe', 'Spacious rooms with premium amenities and city views.', 180.00, 3, '{"Free WiFi","Air Conditioning","TV","Mini Bar","City View","Premium Bedding"}', 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'),
('Suite', 'Luxurious suites with separate living area and premium services.', 350.00, 4, '{"Free WiFi","Air Conditioning","TV","Mini Bar","Living Area","Premium Bedding","Room Service","Balcony"}', 'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg'),
('Presidential', 'Ultimate luxury with personalized service and exclusive amenities.', 750.00, 6, '{"Free WiFi","Air Conditioning","Multiple TVs","Full Bar","Living Area","Premium Bedding","24/7 Concierge","Private Balcony","Jacuzzi","Kitchen"}', 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg');

-- Sample rooms for each hotel
DO $$
DECLARE
    hotel_record RECORD;
    category_record RECORD;
    room_number_counter INTEGER;
BEGIN
    FOR hotel_record IN SELECT id FROM hotels LOOP
        room_number_counter := 101;
        
        FOR category_record IN SELECT id, name FROM room_categories LOOP
            -- Create 3-5 rooms per category per hotel
            FOR i IN 1..(CASE 
                WHEN category_record.name = 'Standard' THEN 5
                WHEN category_record.name = 'Deluxe' THEN 4
                WHEN category_record.name = 'Suite' THEN 3
                ELSE 2
            END) LOOP
                INSERT INTO rooms (hotel_id, category_id, room_number, floor)
                VALUES (hotel_record.id, category_record.id, room_number_counter::text, 
                       CASE WHEN room_number_counter < 200 THEN 1 
                            WHEN room_number_counter < 300 THEN 2 
                            ELSE 3 END);
                room_number_counter := room_number_counter + 1;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;