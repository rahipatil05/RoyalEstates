
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Property, UserRole } from '../types';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, CheckCircle, User, Calendar, MessageCircle } from 'lucide-react';

export const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api.getPropertyById(id).then(p => {
        setProperty(p || null);
        setLoading(false);
      });
    }
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (property) {
      // Create a mock booking
      await api.createBooking(property, user, new Date().toISOString());
      alert('Booking request sent successfully!');
      navigate('/user'); // Redirect to user dashboard
    }
  };

  const handleMessage = () => {
    if(!user) {
      navigate('/login');
      return;
    }
    if(property) {
      navigate(`/chat?userId=${property.ownerId}`);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  if (!property) return <div className="min-h-screen bg-background flex items-center justify-center">Property not found</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      {/* Image Header */}
      <div className="h-[400px] w-full overflow-hidden relative">
        <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 text-white max-w-7xl w-full mx-auto">
          <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
          <div className="flex items-center text-gray-200">
            <MapPin className="w-5 h-5 mr-2" />
            {property.location}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed">{property.description}</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200 border border-gray-100 sticky top-24">
            <div className="mb-6">
              <span className="text-gray-500 text-sm">Monthly Rent</span>
              <div className="text-3xl font-bold text-primary">${property.rent.toLocaleString()}</div>
            </div>
            
            <div className="flex items-center p-4 bg-gray-50 rounded-xl mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold mr-3">
                {property.ownerName.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Property Owner</p>
                <p className="font-semibold text-gray-900">{property.ownerName}</p>
              </div>
            </div>

            {user?.role === UserRole.USER ? (
              <>
                <button 
                  onClick={handleBook}
                  className="w-full bg-accent hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-colors mb-3"
                >
                  Request Booking
                </button>
                <button 
                  onClick={handleMessage}
                  className="w-full border-2 border-primary text-primary font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" /> Send Message
                </button>
              </>
            ) : user?.role === UserRole.OWNER || user?.role === UserRole.ADMIN ? (
              <div className="text-center p-4 bg-gray-50 rounded-xl text-gray-500">
                Owners/Admins cannot book own properties.
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-primary hover:bg-blue-800 text-white font-bold py-4 rounded-xl transition-colors"
              >
                Login to Book
              </button>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};
