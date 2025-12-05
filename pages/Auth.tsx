
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { Building, Mail, CheckCircle2 } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [isLandlord, setIsLandlord] = useState(false); // Only used when registering new accounts
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // If logging in: pass undefined for role. The backend looks up the user and finds their role.
      // If registering: pass the selected role (Owner if checked, otherwise default User).
      const roleArg = isLogin ? undefined : (isLandlord ? UserRole.OWNER : UserRole.USER);
      
      const loggedInUser = await login(email.trim(), roleArg);
      
      // Navigate based on the detected role from the backend
      switch (loggedInUser.role) {
        case UserRole.ADMIN: navigate('/admin'); break;
        case UserRole.OWNER: navigate('/owner'); break;
        case UserRole.USER: navigate('/user'); break;
        default: navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setIsLogin(true); // Switch to login mode
    setError('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-primary mb-4">
            <Building className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-gray-500 mt-2">Access the RoyalEstates platform</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {!isLogin && (
             <div className="flex items-center p-3 border border-gray-100 rounded-xl bg-gray-50 cursor-pointer hover:border-blue-200 transition-colors" onClick={() => setIsLandlord(!isLandlord)}>
               <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${isLandlord ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
                 {isLandlord && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
               </div>
               <div className="flex-1">
                 <span className="block text-sm font-medium text-gray-700">I am a Property Owner</span>
                 <span className="block text-xs text-gray-500">Select this to list your properties</span>
               </div>
             </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-primary font-bold hover:underline"
            >
              {isLogin ? 'Register' : 'Log In'}
            </button>
          </p>
        </div>

        {/* Demo Credentials Helper */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-8">
          <p className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider text-center">Demo Credentials (Click to Fill)</p>
          <div className="space-y-2">
            <button 
              onClick={() => autofillDemo('user@demo.com')}
              className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-200 group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-sm text-gray-700 font-medium">Tenant</span>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-primary">user@demo.com</span>
            </button>
            <button 
              onClick={() => autofillDemo('owner@demo.com')}
              className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-200 group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-sm text-gray-700 font-medium">Landlord</span>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-primary">owner@demo.com</span>
            </button>
            <button 
              onClick={() => autofillDemo('admin@demo.com')}
              className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-200 group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-sm text-gray-700 font-medium">Admin</span>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-primary">admin@demo.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
