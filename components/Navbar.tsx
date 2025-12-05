
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, LogOut, User as UserIcon, Building, Menu, MessageCircle } from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (user?.role === UserRole.ADMIN) return '/admin';
    if (user?.role === UserRole.OWNER) return '/owner';
    return '/user';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Building className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-primary tracking-tight">RoyalEstates</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            <Link to="/properties" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Properties</Link>
            
            {user ? (
              <div className="flex items-center gap-4 ml-4">
                <Link to="/chat" className="relative group text-gray-500 hover:text-primary">
                  <MessageCircle className="w-6 h-6" />
                  <span className="sr-only">Messages</span>
                </Link>
                <span className="text-sm text-gray-500 font-medium">
                  {user.name} <span className="text-xs uppercase bg-gray-100 px-2 py-1 rounded-full text-gray-600">{user.role}</span>
                </span>
                <Link to={getDashboardLink()} className="bg-primary hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-primary hover:text-blue-800 px-3 py-2 font-medium">Log in</Link>
                <Link to="/login" className="bg-primary hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-gray-700">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 pb-4">
          <div className="px-2 pt-2 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Home</Link>
            <Link to="/properties" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Properties</Link>
            {user ? (
              <>
                 <Link to="/chat" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Messages</Link>
                 <Link to={getDashboardLink()} className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-blue-50">My Dashboard</Link>
                 <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-blue-50">Login / Register</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
