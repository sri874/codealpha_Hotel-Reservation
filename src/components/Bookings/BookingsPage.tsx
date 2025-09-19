import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, CreditCard, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Booking } from '../../types/hotel';
import { BookingService } from '../../services/BookingService';
import { useAuth } from '../../contexts/AuthContext';

interface BookingsPageProps {
  onNavigate: (page: string) => void;
}

const BookingsPage: React.FC<BookingsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      const userBookings = await BookingService.getUserBookings();
      setBookings(userBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await BookingService.cancelBooking(bookingId);
      await loadBookings(); // Reload bookings
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your bookings</h2>
          <button
            onClick={() => onNavigate('home')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-32 mt-2 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="h-32 bg-gray-300 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your hotel reservations and view booking details</p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">
              Start planning your next trip by searching for hotels
            </p>
            <button
              onClick={() => onNavigate('search')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search Hotels
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Hotel Image and Info */}
                    <div className="lg:col-span-1">
                      <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                        <img
                          src={booking.room?.category?.image_url}
                          alt={booking.room?.category?.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          {booking.room?.category?.name}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {booking.room?.hotel?.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.room?.hotel?.city}, {booking.room?.hotel?.country}</span>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="lg:col-span-1">
                      <h4 className="font-semibold text-gray-900 mb-3">Booking Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Check-in</p>
                            <p className="font-medium">{formatDate(booking.check_in_date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Check-out</p>
                            <p className="font-medium">{formatDate(booking.check_out_date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-gray-600">Guests</p>
                            <p className="font-medium">{booking.guest_count}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Room and Payment Info */}
                    <div className="lg:col-span-1">
                      <h4 className="font-semibold text-gray-900 mb-3">Room & Payment</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-gray-600">Room Number</p>
                          <p className="font-medium">{booking.room?.room_number}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Amount</p>
                          <p className="font-medium text-lg text-blue-600">${booking.total_amount}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getPaymentStatusColor(booking.payment_status)}`}>
                            {booking.payment_status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="lg:col-span-1">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Status</h4>
                          <div className="flex items-center space-x-2 mb-4">
                            {getStatusIcon(booking.status)}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={cancellingId === booking.id}
                              className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 text-sm font-medium"
                            >
                              {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                            </button>
                          )}
                          
                          <button
                            onClick={() => onNavigate('search')}
                            className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            Book Again
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {booking.special_requests && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2">Special Requests</h5>
                      <p className="text-sm text-gray-600">{booking.special_requests}</p>
                    </div>
                  )}

                  {/* Booking ID and Date */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                    <span>Booking ID: {booking.id}</span>
                    <span>Booked on {formatDate(booking.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;