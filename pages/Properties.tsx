import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { PropertyCard } from '../components/PropertyCard';
import { Property, PropertyStatus } from '../types';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const allProps = await api.getProperties();
      // Filter for approved properties only
      let filtered = allProps.filter(p => p.status === PropertyStatus.APPROVED);
      
      const loc = searchParams.get('location')?.toLowerCase();
      const type = searchParams.get('type');

      if (loc) filtered = filtered.filter(p => p.location.toLowerCase().includes(loc));
      if (type) filtered = filtered.filter(p => p.type === type);

      setProperties(filtered);
      setLoading(false);
    };

    fetchProperties();
  }, [searchParams]);

  const handleToggleFavorite = async (id: string) => {
    if (!user) {
      alert("Please login to favorite properties");
      return;
    }
    await api.toggleFavorite(user.id, id);
    await refreshUser();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Properties</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl h-96 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
                <div className="p-4 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <h2 className="text-xl text-gray-500">No properties found matching your criteria.</h2>
            <button onClick={() => window.history.back()} className="mt-4 text-primary font-medium hover:underline">Go Back</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(p => (
              <PropertyCard 
                key={p.id} 
                property={p} 
                isFavorite={user?.favorites.includes(p.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
