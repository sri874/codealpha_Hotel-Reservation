import { supabase } from '../lib/supabase';
import { Hotel, Room, RoomCategory, Booking, SearchFilters } from '../types/hotel';

export class HotelService {
  static async getAllHotels(): Promise<Hotel[]> {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getHotelById(id: string): Promise<Hotel | null> {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getAllRoomCategories(): Promise<RoomCategory[]> {
    const { data, error } = await supabase
      .from('room_categories')
      .select('*')
      .order('base_price', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async searchAvailableRooms(filters: SearchFilters): Promise<Room[]> {
    let query = supabase
      .from('rooms')
      .select(`
        *,
        category:room_categories(*),
        hotel:hotels(*)
      `)
      .eq('status', 'available');

    // Filter by hotel city if specified
    if (filters.city) {
      query = query.ilike('hotel.city', `%${filters.city}%`);
    }

    // Filter by category if specified
    if (filters.category) {
      query = query.eq('category.name', filters.category);
    }

    const { data, error } = await query;
    
    if (error) throw error;

    // Filter out rooms that are already booked for the requested dates
    const availableRooms = await this.filterAvailableRooms(
      data || [], 
      filters.checkIn, 
      filters.checkOut
    );

    // Filter by guest capacity and price range
    return availableRooms.filter(room => {
      const meetsCapacity = room.category && room.category.max_occupancy >= filters.guests;
      const meetsPrice = !filters.minPrice || !filters.maxPrice || 
        (room.category && 
         room.category.base_price >= filters.minPrice && 
         room.category.base_price <= filters.maxPrice);
      
      return meetsCapacity && meetsPrice;
    });
  }

  private static async filterAvailableRooms(
    rooms: Room[], 
    checkIn: string, 
    checkOut: string
  ): Promise<Room[]> {
    if (!rooms.length) return [];

    const roomIds = rooms.map(room => room.id);
    
    const { data: conflictingBookings } = await supabase
      .from('bookings')
      .select('room_id')
      .in('room_id', roomIds)
      .not('status', 'eq', 'cancelled')
      .or(`check_in_date.lte.${checkOut},check_out_date.gte.${checkIn}`);

    const bookedRoomIds = new Set(
      conflictingBookings?.map(booking => booking.room_id) || []
    );

    return rooms.filter(room => !bookedRoomIds.has(room.id));
  }

  static async getRoomById(id: string): Promise<Room | null> {
    const { data, error } = await supabase
      .from('rooms')
      .select(`
        *,
        category:room_categories(*),
        hotel:hotels(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
}