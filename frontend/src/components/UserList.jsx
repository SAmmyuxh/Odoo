import React, { useEffect, useState } from 'react';
import { Search, Users, UserCheck, UserX, Filter, MoreVertical } from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Mock data for demonstration
  useEffect(() => {
    const fetchUsers = async () => {
      // Simulate API call
      setTimeout(() => {
        setUsers([
          { _id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@email.com', isBanned: false, joinDate: '2024-01-15', avatar: 'SJ' },
          { _id: '2', name: 'Michael Chen', email: 'michael.chen@email.com', isBanned: false, joinDate: '2024-02-20', avatar: 'MC' },
          { _id: '3', name: 'Emily Rodriguez', email: 'emily.rodriguez@email.com', isBanned: true, joinDate: '2024-01-08', avatar: 'ER' },
          { _id: '4', name: 'David Thompson', email: 'david.thompson@email.com', isBanned: false, joinDate: '2024-03-10', avatar: 'DT' },
          { _id: '5', name: 'Anna Williams', email: 'anna.williams@email.com', isBanned: false, joinDate: '2024-02-28', avatar: 'AW' },
          { _id: '6', name: 'James Wilson', email: 'james.wilson@email.com', isBanned: true, joinDate: '2024-01-22', avatar: 'JW' },
        ]);
        setLoading(false);
      }, 1500);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && !user.isBanned) ||
                         (statusFilter === 'banned' && user.isBanned);
    return matchesSearch && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'email') return a.email.localeCompare(b.email);
    if (sortBy === 'status') return Number(a.isBanned) - Number(b.isBanned);
    return 0;
  });

  const activeUsers = users.filter(user => !user.isBanned).length;
  const bannedUsers = users.filter(user => user.isBanned).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded-lg w-64 mb-8"></div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="h-12 bg-slate-200 rounded-lg mb-6"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-48"></div>
                    </div>
                    <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-slate-800">{users.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Active Users</p>
                  <p className="text-2xl font-bold text-emerald-600">{activeUsers}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Banned Users</p>
                  <p className="text-2xl font-bold text-red-600">{bannedUsers}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <UserX className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
          {/* Controls */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="banned">Banned Only</option>
                  </select>
                </div>
                
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="email">Sort by Email</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
              
              <div className="text-sm text-slate-600">
                {sortedUsers.length} of {users.length} users
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="p-6">
            {sortedUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">No users found</p>
                <p className="text-slate-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedUsers.map((user, index) => (
                  <div
                    key={user._id}
                    className="group flex items-center p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-slate-50 hover:bg-white"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.avatar}
                      </div>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-slate-800 truncate">
                          {user.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isBanned 
                            ? 'bg-red-100 text-red-700 border border-red-200' 
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          {user.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </div>
                      <p className="text-slate-600 truncate mt-1">{user.email}</p>
                      <p className="text-slate-400 text-sm mt-1">
                        Joined {new Date(user.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex-shrink-0 ml-4">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;