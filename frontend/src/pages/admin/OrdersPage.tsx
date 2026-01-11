import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/admin/orders'); // Ensure this endpoint exists
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(
      order => 
      order._id.includes(searchQuery) || 
      order.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = async (orderId: string, newStatus: string) => {
      try {
          // Optimistic update
          setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
          
          await api.put(`/order/${orderId}/status`, { status: newStatus });
          toast.success('Order status updated');
      } catch (error) {
          toast.error('Failed to update status');
          fetchOrders(); // Revert on failure
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders ({orders.length})</h1>
            <p className="text-gray-500">View and manage customer orders</p>
         </div>
      </div>

     {/* Search */}
      <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search by ID or Email..." 
            className="pl-9"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
            <thead className="bg-gray-50">
                <tr>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Order ID</th>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Customer</th>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Total</th>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Date</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
                ) : filteredOrders.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">No orders found</td></tr>
                ) : (
                    filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                            <td className="p-4 font-mono text-xs text-gray-600">#{order._id.slice(-6)}</td>
                            <td className="p-4">
                                <p className="font-medium text-gray-900">{order.userId?.name || 'Guest'}</p>
                                <p className="text-xs text-gray-500">{order.userId?.email}</p>
                            </td>
                            <td className="p-4 font-medium">Rs. {order.totalPrice}</td>
                            <td className="p-4">
                                <select 
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    className="px-2 py-1 rounded border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td className="p-4 text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
