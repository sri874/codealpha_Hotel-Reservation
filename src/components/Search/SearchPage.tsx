import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Users, Calendar, Star, Bed, Wifi, Car, Coffee } from 'lucide-react';
import { Room, SearchFilters, RoomCategory } from '../../types/hotel';
import { HotelService } from '../../services/HotelService';

interface SearchPageProps {
  onNavigate: (page: string, data?: any) => void;
  initialData?: any;
}

const SearchPage: React.FC<SearchPageProps> = ({ onNavigate, initialData }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<RoomCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    city: '',
    checkIn: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    checkOut: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // Day after tomorrow
    guests: 2,
    category: '',
    minPrice: 0,
    maxPrice: 1000
  });

  useEffect(() => {
    loadCategories();
    handleSearch();
  }, []);

  useEffect(() => {
    if (initialData?.selectedHotel) {
      // If a specific hotel was selected from homepage
      handleSearch();
    }
  }, [initialData]);

  const loadCategories = async () => {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        // Use fallback data when Supabase is not configured
        const fallbackCategories = [
          {
            id: '1',
            name: 'Standard',
            description: 'Comfortable rooms with essential amenities',
            base_price: 120,
            max_occupancy: 2,
            amenities: ['Free WiFi', 'Air Conditioning', 'TV'],
            image_url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Deluxe',
            description: 'Spacious rooms with premium amenities',
            base_price: 180,
            max_occupancy: 3,
            amenities: ['Free WiFi', 'Mini Bar', 'City View'],
            image_url: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Suite',
            description: 'Luxurious suites with living area',
            base_price: 350,
            max_occupancy: 4,
            amenities: ['Living Area', 'Room Service', 'Balcony'],
            image_url: 'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg',
            created_at: new Date().toISOString()
          }
        ];
        setCategories(fallbackCategories);
      } else {
        const categoriesData = await HotelService.getAllRoomCategories();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Use fallback data on error
      const fallbackCategories = [
        {
          id: '1',
          name: 'Standard',
          description: 'Comfortable rooms with essential amenities',
          base_price: 120,
          max_occupancy: 2,
          amenities: ['Free WiFi', 'Air Conditioning', 'TV'],
          image_url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
          created_at: new Date().toISOString()
        }
      ];
      setCategories(fallbackCategories);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        // Use fallback data when Supabase is not configured
        const fallbackRooms = [
          {
            id: '1',
            hotel_id: '1',
            category_id: '1',
            room_number: '101',
            floor: 1,
            status: 'available' as const,
            created_at: new Date().toISOString(),
            category: {
              id: '1',
              name: 'Standard',
              description: 'Comfortable rooms with essential amenities for a pleasant stay.',
              base_price: 120,
              max_occupancy: 2,
              amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Private Bathroom'],
              image_url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
              created_at: new Date().toISOString()
            },
            hotel: {
              id: '1',
              name: 'Grand Palace Hotel',
              description: 'Luxury hotel in the heart of the city with exceptional service and amenities.',
              address: '123 Main Street',
              city: 'New York',
              country: 'USA',
              rating: 5,
              image_url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
              created_at: new Date().toISOString()
            }
          },
          {
            id: '2',
            hotel_id: '2',
            category_id: '2',
            room_number: '205',
            floor: 2,
            status: 'available' as const,
            created_at: new Date().toISOString(),
            category: {
              id: '2',
              name: 'Deluxe',
              description: 'Spacious rooms with premium amenities and city views.',
              base_price: 180,
              max_occupancy: 3,
              amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'City View', 'Premium Bedding'],
              image_url: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
              created_at: new Date().toISOString()
            },
            hotel: {
              id: '2',
              name: 'Seaside Resort & Spa',
              description: 'Beautiful oceanfront resort with spa services and breathtaking views.',
              address: '456 Ocean Drive',
              city: 'Miami',
              country: 'USA',
              rating: 4,
              image_url: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg',
              created_at: new Date().toISOString()
            }
          },
          {
            id: '3',
            hotel_id: '3',
            category_id: '3',
            room_number: '301',
            floor: 3,
            status: 'available' as const,
            created_at: new Date().toISOString(),
            category: {
              id: '3',
              name: 'Suite',
              description: 'Luxurious suites with separate living area and premium services.',
              base_price: 350,
              max_occupancy: 4,
              amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Living Area', 'Premium Bedding', 'Room Service', 'Balcony'],
              image_url: 'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg',
              created_at: new Date().toISOString()
            },
            hotel: {
              id: '3',
              name: 'Mountain View Lodge',
              description: 'Cozy mountain retreat perfect for nature lovers and adventure seekers.',
              address: '789 Mountain Road',
              city: 'Denver',
              country: 'USA',
              rating: 4,
              image_url: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
              created_at: new Date().toISOString()
            }
          }
        ];
        setRooms(fallbackRooms);
      } else {
        const searchResults = await HotelService.searchAvailableRooms(filters);
        setRooms(searchResults);
      }
    } catch (error) {
      console.error('Error searching rooms:', error);
      // Use fallback data on error
      const fallbackRooms = [
        {
          id: '1',
          hotel_id: '1',
          category_id: '1',
          room_number: '101',
          floor: 1,
          status: 'available' as const,
          created_at: new Date().toISOString(),
          category: {
            id: '1',
            name: 'Standard',
            description: 'Comfortable rooms with essential amenities for a pleasant stay.',
            base_price: 120,
            max_occupancy: 2,
            amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Private Bathroom'],
            image_url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
            created_at: new Date().toISOString()
          },
          hotel: {
            id: '1',
            name: 'Grand Palace Hotel',
            description: 'Luxury hotel in the heart of the city with exceptional service and amenities.',
            address: '123 Main Street',
            city: 'New York',
            country: 'USA',
            rating: 5,
            image_url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
            created_at: new Date().toISOString()
          }
        }
      ];
      setRooms(fallbackRooms);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi':
        return <Wifi className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      case 'room service':
        return <Coffee className="w-4 h-4" />;
      default:
        return <Bed className="w-4 h-4" />;
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
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 lg:mr-6">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Where to?"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={filters.checkIn}
                  onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={filters.checkOut}
                  onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                  min={filters.checkIn}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  value={filters.guests}
                  onChange={(e) => handleFilterChange('guests', parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
              
              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>{loading ? 'Searching...' : 'Search'}</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price (per night)
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price (per night)
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 1000)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Available Rooms
            {rooms.length > 0 && (
              <span className="text-gray-600 font-normal ml-2">
                ({rooms.length} result{rooms.length !== 1 ? 's' : ''})
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-300"></div>
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
        ) : rooms.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or dates to find available rooms.
            </p>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-64 overflow-hidden">
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
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {room.hotel?.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{room.hotel?.city}, {room.hotel?.country}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        ${room.category?.base_price}
                      </p>
                      <p className="text-sm text-gray-600">per night</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 text-sm mb-2">
                      Room {room.room_number} • Floor {room.floor} • Up to {room.category?.max_occupancy} guests
                    </p>
                    <p className="text-gray-700 text-sm line-clamp-2">
                      {room.category?.description}
                    </p>
                  </div>

                  {room.category?.amenities && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
                      <div className="flex flex-wrap gap-2">
                        {room.category.amenities.slice(0, 4).map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-lg text-xs text-gray-700"
                          >
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </div>
                        ))}
                        {room.category.amenities.length > 4 && (
                          <div className="bg-gray-100 px-2 py-1 rounded-lg text-xs text-gray-700">
                            +{room.category.amenities.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => onNavigate('book', { roomId: room.id, searchFilters: filters })}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Book This Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;