import React from 'react';
import { Property, User } from '../types';
import { MapPin, Bed, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  showStatus?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, isFavorite, onToggleFavorite, showStatus }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-200 border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-xl group h-full flex flex-col">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 flex gap-2">
           {showStatus && (
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${
               property.status === 'approved' ? 'bg-green-100 text-green-700' : 
               property.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
             }`}>
               {property.status}
             </span>
           )}
           {onToggleFavorite && (
             <button 
              onClick={(e) => { e.preventDefault(); onToggleFavorite(property.id); }}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-accent text-accent' : 'text-gray-400'}`} />
            </button>
           )}
        </div>
        <div className="absolute bottom-4 left-4">
           <span className="bg-primary/90 text-white px-3 py-1 rounded-lg text-sm font-semibold">
            {property.type}
           </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
           <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{property.title}</h3>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
          {property.location}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {property.amenities.slice(0, 3).map((amenity, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 block">Rent per month</span>
            <span className="text-xl font-bold text-primary">${property.rent.toLocaleString()}</span>
          </div>
          <Link 
            to={`/property/${property.id}`}
            className="group flex items-center gap-2 bg-gray-50 hover:bg-primary hover:text-white text-primary px-4 py-2 rounded-xl transition-all font-medium text-sm"
          >
            View
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
