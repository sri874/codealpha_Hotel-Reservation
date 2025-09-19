export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  image_url: string;
  created_at: string;
}

export interface RoomCategory {
  id: string;
  name: string;
  description: string;
  base_price: number;
  max_occupancy: number;
  amenities: string[];
  image_url: string;
  created_at: string;
}

export interface Room {
  id: string;
  hotel_id: string;
  category_id: string;
  room_number: string;
  floor: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  created_at: string;
  category?: RoomCategory;
  hotel?: Hotel;
}

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  guest_count: number;
  special_requests?: string;
  created_at: string;
  room?: Room;
}

export interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  created_at: string;
}

export interface SearchFilters {
  city?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface BookingFormData {
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  specialRequests?: string;
}