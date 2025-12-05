import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, DollarSign, Home as HomeIcon } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { PropertyType } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (type) params.append('type', type);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-4xl w-full px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Find Your <span className="text-accent">Dream Home</span> Today
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Discover luxury apartments, cozy villas, and modern flats in prime locations.
          </p>
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="bg-white p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
            <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3">
              <MapPin className="text-gray-400 w-5 h-5 mr-3" />
              <input 
                type="text" 
                placeholder="Location (e.g. Downtown)" 
                className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3">
              <HomeIcon className="text-gray-400 w-5 h-5 mr-3" />
              <select 
                className="bg-transparent w-full outline-none text-gray-700 cursor-pointer"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Property Type</option>
                {Object.values(PropertyType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="bg-accent hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center justify-center">
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Features Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose RoyalEstates?</h2>
          <p className="text-gray-500">We provide the most complete and trusted rental experience.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Trusted Owners', desc: 'Verified landlords and property managers.', icon: <MapPin className="w-8 h-8 text-primary" /> },
            { title: 'Easy Booking', desc: 'Book your viewing or stay in just a few clicks.', icon: <DollarSign className="w-8 h-8 text-primary" /> },
            { title: 'Prime Locations', desc: 'Access to the best properties in town.', icon: <HomeIcon className="w-8 h-8 text-primary" /> },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-lg shadow-gray-100 border border-gray-50 text-center hover:translate-y-[-5px] transition-transform">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
