import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import HomePage from './components/Home/HomePage';
import SearchPage from './components/Search/SearchPage';
import BookingPage from './components/Booking/BookingPage';
import BookingsPage from './components/Bookings/BookingsPage';

type PageType = 'home' | 'search' | 'book' | 'bookings';

interface NavigationData {
  page: PageType;
  data?: any;
}

function App() {
  const [currentNav, setCurrentNav] = useState<NavigationData>({ page: 'home' });

  const handleNavigate = (page: string, data?: any) => {
    setCurrentNav({ page: page as PageType, data });
  };

  const renderCurrentPage = () => {
    switch (currentNav.page) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'search':
        return <SearchPage onNavigate={handleNavigate} initialData={currentNav.data} />;
      case 'book':
        return <BookingPage onNavigate={handleNavigate} data={currentNav.data} />;
      case 'bookings':
        return <BookingsPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header onNavigate={handleNavigate} currentPage={currentNav.page} />
        {renderCurrentPage()}
      </div>
    </AuthProvider>
  );
}

export default App;