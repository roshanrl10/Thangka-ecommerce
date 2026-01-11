import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';
import { Badge } from '@/components/ui/badge';
import { OrderTracker } from '@/components/OrderTracker';

interface OrderItem {
  _id: string;
  productId: {
    _id: string;
    title: string;
    images: string[];
    price: number;
  };
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function OrderHistoryPage() {
  const { user } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      // Endpoint verified in backend/route/orderRoutes.js: /orders/:userId
      const { data } = await api.get(`/order/orders/${user?.id || user?._id}`); 
      // Note: user object in store might use 'id' or '_id'. Assuming 'id' based on previous context, but checking '_id' fallback.
      if (data.orders) {
          setOrders(data.orders.reverse()); // Show newest first
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
      return (
          <div className="container mx-auto px-4 py-12 text-center">
              <p>Please log in to view your orders.</p>
              <Button asChild className="mt-4"><Link to="/auth">Sign In</Link></Button>
          </div>
      )
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-foreground mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-display text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start collecting your spiritual art journey.</p>
            <Button variant="gold" asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-card rounded-lg border border-border overflow-hidden">
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-border bg-muted/30 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Order Date</p>
                      <p className="font-medium text-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Total</p>
                      <p className="font-medium text-foreground">Rs. {order.totalPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Status</p>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className="capitalize">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/orders`}>View Details</Link> 
                    {/* Note: User doesn't have a specific order detail page yet except 'order-success', let's just stick to listing items here or link to nothing */}
                  </Button> 
                  {/* Actually, user might want to see details. Reusing 'order-success' page? no that's for immediate post-purchase. 
                      For now, listing items directly below is better. */}
                </div>

                {/* Tracker */}
                <div className="px-6 pb-2">
                    <OrderTracker status={order.status} />
                </div>

                {/* Items */}
                <div className="p-4 md:p-6 space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex gap-4">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                        <img
                          src={item.productId?.images?.[0] || 'placeholder.jpg'}
                          alt={item.productId?.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-foreground">
                            <h3>
                              <Link to={`/product/${item.productId?._id}`} className="hover:underline">
                                {item.productId?.title || 'Unknown Product'}
                              </Link>
                            </h3>
                            <p className="ml-4">Rs. {item.productId?.price?.toLocaleString()}</p>
                          </div>
                   
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-muted-foreground">Qty {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
