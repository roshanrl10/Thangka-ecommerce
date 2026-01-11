import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { toast } from 'sonner';
import { OrderTracker } from '@/components/OrderTracker';

export default function ArtistOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/artist/orders'); 
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
      try {
          // Optimistic update
          setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
          
          await api.put(`/order/${orderId}/status`, { status: newStatus });
          toast.success('Order status updated');
      } catch (error) {
          toast.error('Failed to update status');
          fetchOrders(); // Revert
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">Artist Orders</h1>
            <p className="text-gray-500">Manage orders for your artworks</p>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No orders found containing your art.</div>
        ) : (
            <div className="divide-y divide-gray-100">
                {orders.map((order) => (
                    <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="font-mono text-xs text-gray-500 mb-1">ORDER #{order._id.slice(-6)}</p>
                                <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline">{order.status}</Badge>
                                <select 
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    className="px-2 py-1 rounded border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                        </div>

                        {/* Items specific to this artist */}
                        <div className="space-y-3 mb-4">
                            {order.items.map((item: any) => (
                                <div key={item._id} className="flex gap-4 bg-gray-50 p-2 rounded">
                                    <img src={item.productId?.images?.[0]} className="w-12 h-12 object-cover rounded" />
                                    <div>
                                        <p className="font-medium text-sm text-gray-900">{item.productId?.title}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2">
                             <OrderTracker status={order.status} />
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
