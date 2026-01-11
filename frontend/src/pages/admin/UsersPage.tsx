import { useEffect, useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Shield 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [pendingArtists, setPendingArtists] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'pending') {
        const { data } = await api.get('/admin/pending-artists');
        setPendingArtists(data);
      } else {
        const { data } = await api.get('/admin/users'); 
        setUsers(data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (artistId: string) => {
    try {
      await api.post('/admin/approve-artist', { artistId });
      toast.success('Artist approved successfully');
      // Remove from list locally
      setPendingArtists(prev => prev.filter(a => a._id !== artistId));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Approval failed');
    }
  };

  const handleReject = async (artistId: string) => {
    try {
      await api.post('/admin/reject-artist', { artistId });
      toast.info('Artist application rejected');
      setPendingArtists(prev => prev.filter(a => a._id !== artistId));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Rejection failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage users and artist applications</p>
        </div>
        <div className="flex gap-2">
            <Button 
                variant={activeTab === 'pending' ? 'default' : 'outline'}
                onClick={() => setActiveTab('pending')}
            >
                Pending Artists
            </Button>
            <Button 
                variant={activeTab === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveTab('all')}
            >
                All Users
            </Button>
        </div>
      </div>

      {activeTab === 'pending' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    Pending Applications ({pendingArtists.length})
                </h2>
            </div>
            
            {pendingArtists.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                    No pending applications at the moment.
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {pendingArtists.map((artist) => (
                        <div key={artist._id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                        {artist.userId?.avatar ? (
                                            <img src={artist.userId.avatar} alt={artist.userId.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <Users className="w-6 h-6 text-gray-500" />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-gray-900">{artist.userId?.name || 'Unknown User'}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>{artist.nationality}</span>
                                            <span>•</span>
                                            <span>{artist.yearsOfExperience} years exp.</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2 max-w-2xl">{artist.biography}</p>
                                        
                                        {/* Portfolio / Info */}
                                        <div className="flex gap-2 mt-3">
                                            {artist.thangkaTypes.map((type: string) => (
                                                <span key={type} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button 
                                        onClick={() => handleApprove(artist._id)}
                                        className="bg-green-600 hover:bg-green-700 text-white gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        onClick={() => handleReject(artist._id)}
                                        className="text-red-600 border-red-200 hover:bg-red-50 gap-2"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}

      {activeTab === 'all' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="text-left p-4 text-sm font-medium text-gray-500">Name</th>
                                <th className="text-left p-4 text-sm font-medium text-gray-500">Email</th>
                                <th className="text-left p-4 text-sm font-medium text-gray-500">Role</th>
                                <th className="text-left p-4 text-sm font-medium text-gray-500">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No users found</td></tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-900">{user.name}</td>
                                        <td className="p-4 text-gray-600">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'artist' ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
               </div>
          </div>
      )}
    </div>
  );
}
