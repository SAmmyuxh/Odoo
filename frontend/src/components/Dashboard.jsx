import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  UserCheck, 
  UserX, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  BarChart3,
  PieChart,
  Calendar,
  Filter
} from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // adjust path as needed
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockStats = {
        users: {
          total: 15847,
          active: 8932,
          banned: 145,
          recent: 234
        },
        swaps: {
          total: 45623,
          pending: 1247,
          completed: 42891,
          cancelled: 987,
          rejected: 498,
          recent: 89
        }
      };
      
      setStats(mockStats);
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color, bgGradient }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br ${bgGradient} border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-bold text-white">{value?.toLocaleString()}</h3>
          <p className="text-gray-300 text-sm font-medium">{title}</p>
          {subtitle && <p className="text-gray-400 text-xs">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const MetricCard = ({ title, metrics, icon: Icon, color }) => (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
      </div>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-3">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
              <span className="text-gray-300 font-medium">{metric.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold text-lg">{metric.value.toLocaleString()}</span>
              {metric.percentage && (
                <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                  {metric.percentage}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const userMetrics = [
    { label: 'Total Users', value: stats.users.total, icon: Users, color: 'text-blue-400', percentage: 100 },
    { label: 'Active Users', value: stats.users.active, icon: UserCheck, color: 'text-green-400', percentage: Math.round((stats.users.active / stats.users.total) * 100) },
    { label: 'Banned Users', value: stats.users.banned, icon: UserX, color: 'text-red-400', percentage: Math.round((stats.users.banned / stats.users.total) * 100) },
    { label: 'Recent Users', value: stats.users.recent, icon: Clock, color: 'text-purple-400', percentage: Math.round((stats.users.recent / stats.users.total) * 100) }
  ];

  const swapMetrics = [
    { label: 'Total Swaps', value: stats.swaps.total, icon: RefreshCw, color: 'text-blue-400', percentage: 100 },
    { label: 'Pending Swaps', value: stats.swaps.pending, icon: Clock, color: 'text-yellow-400', percentage: Math.round((stats.swaps.pending / stats.swaps.total) * 100) },
    { label: 'Completed Swaps', value: stats.swaps.completed, icon: CheckCircle, color: 'text-green-400', percentage: Math.round((stats.swaps.completed / stats.swaps.total) * 100) },
    { label: 'Cancelled Swaps', value: stats.swaps.cancelled, icon: XCircle, color: 'text-red-400', percentage: Math.round((stats.swaps.cancelled / stats.swaps.total) * 100) },
    { label: 'Rejected Swaps', value: stats.swaps.rejected, icon: AlertCircle, color: 'text-orange-400', percentage: Math.round((stats.swaps.rejected / stats.swaps.total) * 100) },
    { label: 'Recent Swaps', value: stats.swaps.recent, icon: Activity, color: 'text-purple-400', percentage: Math.round((stats.swaps.recent / stats.swaps.total) * 100) }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Monitor your platform's performance and user activity</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300">
              <Calendar className="w-4 h-4" />
              <span>Last 30 days</span>
            </button>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.users.total}
            subtitle="Platform users"
            icon={Users}
            trend="up"
            trendValue="12.5%"
            color="from-blue-500 to-blue-600"
            bgGradient="from-blue-500/20 to-blue-600/20"
          />
          <StatCard
            title="Active Users"
            value={stats.users.active}
            subtitle="Currently active"
            icon={UserCheck}
            trend="up"
            trendValue="8.2%"
            color="from-green-500 to-green-600"
            bgGradient="from-green-500/20 to-green-600/20"
          />
          <StatCard
            title="Total Swaps"
            value={stats.swaps.total}
            subtitle="All transactions"
            icon={RefreshCw}
            trend="up"
            trendValue="15.7%"
            color="from-purple-500 to-purple-600"
            bgGradient="from-purple-500/20 to-purple-600/20"
          />
          <StatCard
            title="Completed Swaps"
            value={stats.swaps.completed}
            subtitle="Successful transactions"
            icon={CheckCircle}
            trend="up"
            trendValue="9.3%"
            color="from-emerald-500 to-emerald-600"
            bgGradient="from-emerald-500/20 to-emerald-600/20"
          />
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Analytics */}
          <MetricCard
            title="User Analytics"
            metrics={userMetrics}
            icon={Users}
            color="from-blue-500 to-blue-600"
          />

          {/* Swap Analytics */}
          <MetricCard
            title="Swap Analytics"
            metrics={swapMetrics}
            icon={RefreshCw}
            color="from-purple-500 to-purple-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <button 
              onClick={() => window.location.href = '/users'}
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300 group"
            >
              <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">User List</p>
                <p className="text-gray-400 text-sm">View and manage users</p>
              </div>
            </button>
            
            <button 
              onClick={() => window.location.href = '/swaps/new'}
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300 group"
            >
              <div className="p-2 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Swap Form</p>
                <p className="text-gray-400 text-sm">Create new swaps</p>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl hover:from-emerald-500/30 hover:to-emerald-600/30 transition-all duration-300 group">
              <div className="p-2 bg-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Monitor Swaps</p>
                <p className="text-gray-400 text-sm">Track transactions</p>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 group">
              <div className="p-2 bg-green-500 rounded-lg group-hover:scale-110 transition-transform">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">View Reports</p>
                <p className="text-gray-400 text-sm">Generate analytics</p>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-300 group">
              <div className="p-2 bg-yellow-500 rounded-lg group-hover:scale-110 transition-transform">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Settings</p>
                <p className="text-gray-400 text-sm">Configure platform</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;