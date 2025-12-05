
import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Property, PropertyStatus, User } from '../types';
import * as api from '../services/api';
import { StatsCard } from '../components/StatsCard';
import { Users, Home, Clock, CheckCircle, XCircle, Ban, Unlock, Search } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [pendingProps, setPendingProps] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');

  const loadData = async () => {
    const s = await api.getAdminStats();
    setStats(s);
    const props = await api.getProperties();
    setPendingProps(props.filter(p => p.status === PropertyStatus.PENDING));
    setUsers(await api.getUsers());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    await api.updatePropertyStatus(id, PropertyStatus.APPROVED);
    setPendingProps(prev => prev.filter(p => p.id !== id));
    setStats({...stats, pendingProperties: stats.pendingProperties - 1});
  };

  const handleReject = async (id: string) => {
    await api.updatePropertyStatus(id, PropertyStatus.REJECTED);
    setPendingProps(prev => prev.filter(p => p.id !== id));
    setStats({...stats, pendingProperties: stats.pendingProperties - 1});
  };

  const handleToggleBlock = async (userId: string) => {
    await api.toggleUserBlockStatus(userId);
    // Refresh user list
    const updatedUsers = await api.getUsers();
    setUsers(updatedUsers);
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.includes(userSearch.toLowerCase()));

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard title="Total Users" value={stats.totalUsers} icon={<Users className="w-5 h-5"/>} />
          <StatsCard title="Total Properties" value={stats.totalProperties} icon={<Home className="w-5 h-5"/>} colorClass="bg-blue-600" />
          <StatsCard title="Pending Approvals" value={stats.pendingProperties} icon={<Clock className="w-5 h-5"/>} colorClass="bg-accent" />
          <StatsCard title="Total Bookings" value={stats.totalBookings} icon={<CheckCircle className="w-5 h-5"/>} colorClass="bg-green-500" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pending Approvals Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Property Approvals Needed</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {pendingProps.map(p => (
                <div key={p.id} className="p-6 flex flex-col sm:flex-row gap-4">
                  <img src={p.image} alt="" className="w-24 h-24 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{p.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">Owner: {p.ownerName} | Rent: ${p.rent}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 justify-center">
                    <button 
                      onClick={() => handleApprove(p.id)}
                      className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button 
                      onClick={() => handleReject(p.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))}
              {pendingProps.length === 0 && (
                <div className="p-8 text-center text-gray-500">All caught up! No pending properties.</div>
              )}
            </div>
          </div>

          {/* User Management Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[600px]">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Users</h2>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 flex-1">
              {filteredUsers.map(u => (
                <div key={u.id} className={`flex items-center gap-3 p-3 rounded-xl border ${u.isBlocked ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${u.isBlocked ? 'bg-red-400' : 'bg-gray-300'}`}>
                    {u.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="font-medium text-gray-900 truncate">{u.name} {u.isBlocked && <span className="text-xs text-red-500 font-bold">(BLOCKED)</span>}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                     <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 uppercase">
                      {u.role}
                    </span>
                    <button 
                      onClick={() => handleToggleBlock(u.id)}
                      className={`p-1.5 rounded-lg transition-colors ${u.isBlocked ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                      title={u.isBlocked ? "Unblock User" : "Block User"}
                    >
                      {u.isBlocked ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && <p className="text-center text-gray-400 text-sm">No users found</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
