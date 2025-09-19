import { supabase } from '../lib/supabase';
import { Booking, BookingFormData } from '../types/hotel';

export class BookingService {
  static async createBooking(
    roomId: string, 
    bookingData: BookingFormData
  ): Promise<Booking> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get room details to calculate total amount
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select(`
        *,
        category:room_categories(*)
      `)
      .eq('id', roomId)
      .single();

    if (roomError) throw roomError;
    if (!room || !room.category) throw new Error('Room not found');

    // Calculate total amount (simple calculation - can be enhanced)
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = nights * room.category.base_price;

    const bookingPayload = {
      user_id: user.id,
      room_id: roomId,
      check_in_date: bookingData.checkInDate,
      check_out_date: bookingData.checkOutDate,
      guest_count: bookingData.guestCount,
      special_requests: bookingData.specialRequests || null,
      total_amount: totalAmount,
      status: 'pending' as const,
      payment_status: 'pending' as const
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingPayload])
      .select(`
        *,
        room:rooms(
          *,
          category:room_categories(*),
          hotel:hotels(*)
        )
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserBookings(): Promise<Booking[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        room:rooms(
          *,
          category:room_categories(*),
          hotel:hotels(*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async cancelBooking(bookingId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        payment_status: 'refunded'
      })
      .eq('id', bookingId)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  static async processPayment(bookingId: string): Promise<{ success: boolean; message: string }> {
    // Simulate payment processing
    const paymentSuccess = Math.random() > 0.1; // 90% success rate

    if (paymentSuccess) {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed',
          payment_status: 'paid'
        })
        .eq('id', bookingId);

      if (error) throw error;

      return { success: true, message: 'Payment processed successfully' };
    } else {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          payment_status: 'failed'
        })
        .eq('id', bookingId);

      if (error) throw error;

      return { success: false, message: 'Payment failed. Please try again.' };
    }
  }
}