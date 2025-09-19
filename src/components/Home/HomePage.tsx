import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, Users, Calendar } from 'lucide-react';
import { Hotel } from '../../types/hotel';
import { HotelService } from '../../services/HotelService';

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        // Use fallback data when Supabase is not configured
        const fallbackHotels = [
          {
            id: '1',
            name: 'Grand Palace Hotel',
            city: 'New York',
            country: 'USA',
            rating: 5,
            description: 'Luxury hotel in the heart of Manhattan with world-class amenities and stunning city views.',
            image_url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg'
          },
          {
            id: '2',
            name: 'Ocean View Resort',
            city: 'Miami',
            country: 'USA',
            rating: 4,
            description: 'Beachfront resort offering pristine ocean views and tropical paradise experience.',
            image_url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg'
          },
          {
            id: '3',
            name: 'Mountain Lodge',
            city: 'Aspen',
            country: 'USA',
            rating: 4,
            description: 'Cozy mountain retreat perfect for skiing and outdoor adventures.',
            image_url: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'
          }
        ];
        setHotels(fallbackHotels);
      } else {
        const hotelsData = await HotelService.getAllHotels();
        setHotels(hotelsData.slice(0, 3)); // Show top 3 hotels
      }
    } catch (error) {
      console.error('Error loading hotels:', error);
      // Use fallback data on error
      const fallbackHotels = [
        {
          id: '1',
          name: 'Grand Palace Hotel',
          city: 'New York',
          country: 'USA',
          rating: 5,
          description: 'Luxury hotel in the heart of Manhattan with world-class amenities and stunning city views.',
          image_url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg'
        },
        {
          id: '2',
          name: 'Ocean View Resort',
          city: 'Miami',
          country: 'USA',
          rating: 4,
          description: 'Beachfront resort offering pristine ocean views and tropical paradise experience.',
          image_url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg'
        },
        {
          id: '3',
          name: 'Mountain Lodge',
          city: 'Aspen',
          country: 'USA',
          rating: 4,
          description: 'Cozy mountain retreat perfect for skiing and outdoor adventures.',
          image_url: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'
        }
      ];
      setHotels(fallbackHotels);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-800/80"></div>
        <div
          className="relative bg-cover bg-center h-96 flex items-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg)'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover luxury hotels and make unforgettable memories
            </p>
            <button
              onClick={() => onNavigate('search')}
              className="bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Start Your Journey</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Destination</p>
                <p className="font-semibold">Where to?</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Check-in</p>
                <p className="font-semibold">Select date</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Check-out</p>
                <p className="font-semibold">Select date</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Guests</p>
                <p className="font-semibold">2 guests</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('search')}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Search Hotels
            </button>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Hotels</h2>
          <p className="text-gray-600 text-lg">Discover our handpicked selection of premium accommodations</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => onNavigate('search', { selectedHotel: hotel.id })}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hotel.image_url}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <div className="flex items-center space-x-1">
                      {renderStars(hotel.rating)}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                  <div className="flex items-center space-x-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{hotel.city}, {hotel.country}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {hotel.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      {renderStars(hotel.rating)}
                      <span className="text-sm text-gray-600 ml-1">({hotel.rating}.0)</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Starting from</p>
                      <p className="text-xl font-bold text-blue-600">$120/night</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LuxeStay</h2>
            <p className="text-gray-600 text-lg">Experience the difference with our premium services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Search, compare, and book your perfect stay with just a few clicks
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Carefully curated hotels ensuring the highest standards of comfort and service
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our dedicated support team is here to help you every step of the way
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;