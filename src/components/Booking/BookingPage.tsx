import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Users, MapPin, Star, CreditCard, Check, X } from 'lucide-react';
import { Room, BookingFormData } from '../../types/hotel';
import { HotelService } from '../../services/HotelService';
import { BookingService } from '../../services/BookingService';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../Auth/AuthModal';

interface BookingPageProps {
  onNavigate: (page: string, data?: any) => void;
  data?: { roomId: string; searchFilters?: any };
}

const BookingPage: React.FC<BookingPageProps> = ({ onNavigate, data }) => {
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState<'form' | 'payment' | 'confirmation'>('form');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    checkInDate: data?.searchFilters?.checkIn || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    checkOutDate: data?.searchFilters?.checkOut || new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    guestCount: data?.searchFilters?.guests || 2,
    specialRequests: ''
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [processing, setProcessing] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (data?.roomId) {
      loadRoom();
    }
  }, [data]);

  const loadRoom = async () => {
    if (!data?.roomId) return;
    
    try {
      const roomData = await HotelService.getRoomById(data.roomId);
      setRoom(roomData);
    } catch (error) {
      console.error('Error loading room:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalCost = () => {
    if (!room?.category) return 0;
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights * room.category.base_price;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!data?.roomId) return;

    setProcessing(true);
    try {
      const booking = await BookingService.createBooking(data.roomId, bookingData);
      setBookingResult(booking);
      setBookingStep('payment');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingResult) return;

    setProcessing(true);
    try {
      const result = await BookingService.processPayment(bookingResult.id);
      setPaymentResult(result);
      setBookingStep('confirmation');
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentResult({ success: false, message: 'Payment processing failed' });
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Room not found</h2>
          <button
            onClick={() => onNavigate('search')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => onNavigate('search')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Search</span>
          </button>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className={bookingStep === 'form' ? 'text-blue-600 font-semibold' : ''}>
              1. Booking Details
            </span>
            <span>•</span>
            <span className={bookingStep === 'payment' ? 'text-blue-600 font-semibold' : ''}>
              2. Payment
            </span>
            <span>•</span>
            <span className={bookingStep === 'confirmation' ? 'text-blue-600 font-semibold' : ''}>
              3. Confirmation
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="relative h-64">
                <img
                  src={room.category?.image_url}
                  alt={room.category?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {room.category?.name}
                </div>
                {room.hotel && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <div className="flex items-center space-x-1">
                      {renderStars(room.hotel.rating)}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{room.hotel?.name}</h1>
                <div className="flex items-center space-x-1 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{room.hotel?.address}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Room Number</p>
                    <p className="font-semibold">{room.room_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Floor</p>
                    <p className="font-semibold">{room.floor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Max Occupancy</p>
                    <p className="font-semibold">{room.category?.max_occupancy} guests</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price per Night</p>
                    <p className="font-semibold text-blue-600">${room.category?.base_price}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                  <p className="text-gray-600">{room.category?.description}</p>
                </div>

                {room.category?.amenities && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Amenities</p>
                    <div className="grid grid-cols-2 gap-2">
                      {room.category.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Form */}
            {bookingStep === 'form' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Details</h2>
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={bookingData.checkInDate}
                          onChange={(e) => setBookingData(prev => ({ ...prev, checkInDate: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={bookingData.checkOutDate}
                          onChange={(e) => setBookingData(prev => ({ ...prev, checkOutDate: e.target.value }))}
                          min={bookingData.checkInDate}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <select
                        value={bookingData.guestCount}
                        onChange={(e) => setBookingData(prev => ({ ...prev, guestCount: parseInt(e.target.value) }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        required
                      >
                        {Array.from({ length: room.category?.max_occupancy || 2 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                      rows={3}
                      placeholder="Any special requests or preferences..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {processing ? 'Processing...' : 'Continue to Payment'}
                  </button>
                </form>
              </div>
            )}

            {/* Payment Form */}
            {bookingStep === 'payment' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardholderName}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                        required
                        placeholder="1234 5678 9012 3456"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                        required
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                        required
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Note:</strong> This is a simulation. No actual payment will be processed.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {processing ? 'Processing Payment...' : 'Complete Booking'}
                  </button>
                </form>
              </div>
            )}

            {/* Confirmation */}
            {bookingStep === 'confirmation' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  paymentResult?.success ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {paymentResult?.success ? (
                    <Check className="w-8 h-8 text-green-600" />
                  ) : (
                    <X className="w-8 h-8 text-red-600" />
                  )}
                </div>
                
                <h2 className={`text-2xl font-bold mb-2 ${
                  paymentResult?.success ? 'text-green-600' : 'text-red-600'
                }`}>
                  {paymentResult?.success ? 'Booking Confirmed!' : 'Booking Failed'}
                </h2>
                
                <p className="text-gray-600 mb-6">
                  {paymentResult?.message}
                </p>

                {paymentResult?.success && bookingResult && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                    <h3 className="font-semibold text-gray-900 mb-2">Booking Details</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Booking ID:</strong> {bookingResult.id}</p>
                      <p><strong>Hotel:</strong> {room.hotel?.name}</p>
                      <p><strong>Room:</strong> {room.category?.name} - Room {room.room_number}</p>
                      <p><strong>Check-in:</strong> {formatDate(bookingResult.check_in_date)}</p>
                      <p><strong>Check-out:</strong> {formatDate(bookingResult.check_out_date)}</p>
                      <p><strong>Guests:</strong> {bookingResult.guest_count}</p>
                      <p><strong>Total Amount:</strong> ${bookingResult.total_amount}</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4 justify-center">
                  {paymentResult?.success ? (
                    <>
                      <button
                        onClick={() => onNavigate('bookings')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View My Bookings
                      </button>
                      <button
                        onClick={() => onNavigate('home')}
                        className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Back to Home
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setBookingStep('payment')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => onNavigate('search')}
                        className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Back to Search
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-semibold">{formatDate(bookingData.checkInDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-semibold">{formatDate(bookingData.checkOutDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="font-semibold">{bookingData.guestCount} guest{bookingData.guestCount > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Room rate per night</span>
                  <span className="font-semibold">${room.category?.base_price}</span>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">
                    Number of nights ({
                      Math.ceil((new Date(bookingData.checkOutDate).getTime() - new Date(bookingData.checkInDate).getTime()) / (1000 * 60 * 60 * 24))
                    })
                  </span>
                  <span className="font-semibold">
                    ${calculateTotalCost()}
                  </span>
                </div>
                
                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">${calculateTotalCost()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

export default BookingPage;