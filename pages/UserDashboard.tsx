
import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Booking, Property, PropertyStatus } from '../types';
import * as api from '../services/api';
import { PropertyCard } from '../components/PropertyCard';
import { Calendar, Heart, Clock } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { useNavigate } from 'react-router-dom';

export const UserDashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites'>('bookings');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Get Bookings
      api.getBookings().then(all => {
        setBookings(all.filter(b => b.userId === user.id));
      });
      
      // Get Favorites
      api.getProperties().then(all => {
        setFavorites(all.filter(p => user.favorites.includes(p.id)));
      });
    }
  }, [user]);

  const handleRemoveFav = async (id: string) => {
    if(user) {
      await api.toggleFavorite(user.id, id);
      refreshUser();
      setFavorites(prev => prev.filter(p => p.id !== id));
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatsCard title="Total Bookings" value={bookings.length} icon={<Calendar className="w-6 h-6"/>} />
          <StatsCard title="Favorites" value={favorites.length} icon={<Heart className="w-6 h-6"/>} colorClass="bg-red-500" />
          <StatsCard title="Pending Requests" value={bookings.filter(b => b.status === 'pending').length} icon={<Clock className="w-6 h-6"/>} colorClass="bg-accent" />
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 px-4 font-medium text-sm transition-colors relative ${activeTab === 'bookings' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            My Bookings
            {activeTab === 'bookings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`pb-4 px-4 font-medium text-sm transition-colors relative ${activeTab === 'favorites' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Saved Homes
            {activeTab === 'favorites' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'bookings' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Property</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Date Requested</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{b.propertyTitle}</td>
                      <td className="p-4 text-gray-600">{new Date(b.date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          b.status === 'approved' ? 'bg-green-100 text-green-700' : 
                          b.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => navigate(`/chat?userId=${b.ownerId}`)}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          Message Owner
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-gray-500">No booking history yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(p => (
              <PropertyCard key={p.id} property={p} isFavorite={true} onToggleFavorite={handleRemoveFav} />
            ))}
            {favorites.length === 0 && (
              <div className="col-span-3 text-center py-10 text-gray-500">No favorites added.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
