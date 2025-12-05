import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Booking, BookingStatus, Property, PropertyType } from '../types';
import * as api from '../services/api';
import { Plus, Home, Users, DollarSign, Trash2, Edit } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProp, setNewProp] = useState<Partial<Property>>({ type: PropertyType.FLAT_1BHK, amenities: [] });

  useEffect(() => {
    if (user) {
      api.getProperties().then(all => setProperties(all.filter(p => p.ownerId === user.id)));
      api.getBookings().then(all => setBookings(all.filter(b => b.ownerId === user.id)));
    }
  }, [user]);

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && newProp.title && newProp.rent) {
      await api.addProperty({
        title: newProp.title,
        description: newProp.description || '',
        rent: Number(newProp.rent),
        location: newProp.location || '',
        type: newProp.type as PropertyType,
        amenities: newProp.amenities || ['Wifi'],
        image: 'https://picsum.photos/800/600',
        ownerId: user.id
      }, user);
      setShowAddModal(false);
      // Refresh
      api.getProperties().then(all => setProperties(all.filter(p => p.ownerId === user.id)));
    }
  };

  const handleBookingAction = async (id: string, status: BookingStatus) => {
    await api.updateBookingStatus(id, status);
    // Refresh
    api.getBookings().then(all => setBookings(all.filter(b => b.ownerId === user!.id)));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-gray-500">Manage your properties and requests</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Property
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard title="My Properties" value={properties.length} icon={<Home className="w-6 h-6"/>} />
          <StatsCard title="Total Requests" value={bookings.length} icon={<Users className="w-6 h-6"/>} colorClass="bg-accent" />
          <StatsCard title="Active Tenants" value={bookings.filter(b => b.status === 'approved').length} icon={<DollarSign className="w-6 h-6"/>} colorClass="bg-green-500" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Properties List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Listings</h2>
            <div className="space-y-4">
              {properties.map(p => (
                <div key={p.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                   <img src={p.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                   <div className="flex-1">
                     <h3 className="font-bold text-gray-900">{p.title}</h3>
                     <p className="text-sm text-gray-500">{p.location} - ${p.rent}</p>
                     <span className={`text-xs px-2 py-0.5 rounded ${p.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                       {p.status}
                     </span>
                   </div>
                   <div className="flex gap-2">
                     <button className="text-gray-400 hover:text-primary"><Edit className="w-5 h-5"/></button>
                     <button className="text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5"/></button>
                   </div>
                </div>
              ))}
              {properties.length === 0 && <p className="text-gray-400 text-center py-4">No properties listed.</p>}
            </div>
          </div>

          {/* Booking Requests */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Booking Requests</h2>
            <div className="space-y-4">
              {bookings.map(b => (
                <div key={b.id} className="p-4 border border-gray-100 rounded-xl">
                   <div className="flex justify-between items-start mb-2">
                     <div>
                       <h3 className="font-bold text-gray-900">{b.userName}</h3>
                       <p className="text-sm text-gray-500">Requested: {b.propertyTitle}</p>
                       <p className="text-xs text-gray-400">{new Date(b.date).toLocaleDateString()}</p>
                     </div>
                     <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                          b.status === 'approved' ? 'bg-green-100 text-green-700' : 
                          b.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {b.status}
                     </span>
                   </div>
                   {b.status === 'pending' && (
                     <div className="flex gap-3 mt-3">
                       <button 
                        onClick={() => handleBookingAction(b.id, BookingStatus.APPROVED)}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600"
                       >
                         Approve
                       </button>
                       <button 
                        onClick={() => handleBookingAction(b.id, BookingStatus.REJECTED)}
                        className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
                       >
                         Reject
                       </button>
                     </div>
                   )}
                </div>
              ))}
              {bookings.length === 0 && <p className="text-gray-400 text-center py-4">No booking requests.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add New Property</h2>
            <form onSubmit={handleAddProperty} className="space-y-4">
              <input 
                placeholder="Property Title" 
                className="w-full p-3 border rounded-xl"
                onChange={e => setNewProp({...newProp, title: e.target.value})} 
                required
              />
              <textarea 
                placeholder="Description" 
                className="w-full p-3 border rounded-xl"
                onChange={e => setNewProp({...newProp, description: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="Rent ($)" 
                  className="w-full p-3 border rounded-xl"
                  onChange={e => setNewProp({...newProp, rent: Number(e.target.value)})} 
                  required
                />
                 <select 
                  className="w-full p-3 border rounded-xl"
                  onChange={e => setNewProp({...newProp, type: e.target.value as PropertyType})}
                 >
                   {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                 </select>
              </div>
              <input 
                placeholder="Location" 
                className="w-full p-3 border rounded-xl"
                onChange={e => setNewProp({...newProp, location: e.target.value})}
                required
              />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-gray-600 font-medium">Cancel</button>
                <button type="submit" className="flex-1 bg-primary text-white rounded-xl py-3 font-medium">Create Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
