import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Package, DollarSign, Star, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';

export default function ArtistDashboard() {
  const { user } = useStore();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/artist-dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading stats...</div>;
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: `Rs. ${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'My Artworks',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Total Sales',
      value: stats?.totalSales || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      label: 'My Rating',
      value: stats?.rating || 'N/A',
      icon: Star,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Artist Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}</p>
      </div>

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

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
            <select className="text-sm border-gray-200 rounded-lg">
                <option>Last 6 Months</option>
                <option>This Year</option>
            </select>
          </div>
          <div className="h-80 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
             {/* Placeholder for Graph - Real data would need aggregation by date */}
             <p>Sales Chart functionality coming soon</p>
          </div>
      </div>
    </div>
  );
}
