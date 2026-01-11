import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Users, ShoppingBag, DollarSign, Palette, ArrowUpRight } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [pendingArtists, setPendingArtists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, artistsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/pending-artists')
      ]);
      setStats(statsRes.data);
      setPendingArtists(artistsRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (artistId: string) => {
    try {
        await api.post('/admin/approve-artist', { artistId });
        toast.success('Artist approved');
        setPendingArtists(prev => prev.filter(a => a._id !== artistId));
        // Refresh stats to update counts
        const { data } = await api.get('/admin/stats');
        setStats(data);
    } catch (error) {
        toast.error('Failed to approve artist');
    }
  };

  const handleReject = async (artistId: string) => {
    if (!confirm('Reject this artist application?')) return;
    try {
        await api.post('/admin/reject-artist', { artistId });
        toast.success('Artist rejected');
        setPendingArtists(prev => prev.filter(a => a._id !== artistId));
    } catch (error) {
        toast.error('Failed to reject artist');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading stats...</div>;
  }

  if (!stats) {
    return <div className="p-8 text-center text-red-500">Failed to load dashboard data.</div>;
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      label: 'Pending Artists',
      value: pendingArtists.length,
      icon: Palette,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Administrator</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Charts Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Analytics</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.revenueGraph}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id" stroke="#888" />
                <YAxis stroke="#888" tickFormatter={(value) => `Rs.${value}`} />
                <Tooltip 
                  formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#CA8A04" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#CA8A04' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h2>
          <div className="space-y-6">
            {stats.recentOrders.length === 0 ? (
                <p className="text-gray-500">No recent orders</p>
            ) : (
                stats.recentOrders.map((order: any) => (
                    <div key={order._id} className="flex items-center justify-between">
                        <div>
                        <p className="text-sm font-medium text-gray-900">{order.userId?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">Rs. {order.totalPrice}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'Paid' ? 'bg-green-100 text-green-700' :
                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {order.status}
                        </span>
                        </div>
                    </div>
                ))
            )}
          </div>
          
          <button className="w-full mt-6 flex items-center justify-center gap-2 text-sm text-secondary font-medium hover:underline">
            View All Orders <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pending Artists Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Pending Artist Applications</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Artist</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Location</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Experience</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingArtists.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-gray-500">No pending applications</td></tr>
                ) : (
                    pendingArtists.map((artist) => (
                      <tr key={artist._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={artist.userId?.avatar || artist.profileImage} className="w-10 h-10 rounded-full object-cover" alt="" />
                            <div>
                                <p className="font-medium text-gray-900">{artist.userId?.name || 'Unknown'}</p>
                                <p className="text-xs text-gray-500">{artist.userId?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{artist.location}</td>
                        <td className="p-4 text-sm text-gray-600">{artist.yearsOfExperience} years</td>
                        <td className="p-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                               <button 
                                 onClick={() => handleReject(artist._id)}
                                 className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                               >
                                Reject
                               </button>
                               <button 
                                 onClick={() => handleApprove(artist._id)}
                                 className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                               >
                                Approve
                               </button>
                           </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
