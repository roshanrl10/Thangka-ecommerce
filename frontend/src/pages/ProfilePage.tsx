import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Heart, ShoppingBag, Settings, LogOut, Shield, Palette, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user, setUser, logout, wishlist } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit Form State
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
        fetchOrders();
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            confirmPassword: ''
        });
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get(`/order/orders/${user?.id}`);
      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.password && formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
      }

      try {
          const { data } = await api.put('/users/profile', {
              name: formData.name,
              email: formData.email,
              password: formData.password || undefined
          });
          
          // Update store
          // Need to reconstruct user object for store since it tracks token too
          // Assuming updateStoreUser(data) updates the user state. 
          // If useStore login expects {token, ...user}, we might need adjustments.
          // Check backend response: returns token too.
          if(data.token) {
              localStorage.setItem('token', data.token);
          }
          setUser(data);
          toast.success("Profile updated successfully");
          setIsEditing(false);
      } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to update profile");
      }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl text-foreground mb-2">Please Sign In</h1>
        <p className="text-muted-foreground mb-6">You need to be signed in to view your profile.</p>
        <Link to="/auth">
          <Button variant="gold">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      {/* Profile Header */}
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 border-4 border-secondary/30 flex items-center justify-center">
            <User className="h-12 w-12 md:h-16 md:w-16 text-primary" />
          </div>
          
          {/* User Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">
              {user.name}
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </span>
              <span className="hidden md:block">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Member since 2024
              </span>
            </div>
            
            {/* Role Badge */}
            <div className="mt-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-ui ${
                user.role === 'artist' 
                  ? 'bg-secondary/20 text-secondary' 
                  : user.role === 'admin'
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}>
                <Shield className="h-3 w-3" />
                {user.role === 'artist' ? 'Verified Artist' : user.role === 'admin' ? 'Administrator' : 'Buyer'}
              </span>
              {user.artistApplicationStatus === 'pending' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-ui bg-yellow-100 text-yellow-700 ml-2">
                  <Shield className="h-3 w-3" />
                  Verification Pending
                </span>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Edit Profile
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                                id="name" 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                value={formData.email} 
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password (Optional)</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="Leave blank to keep current"
                                value={formData.password} 
                                onChange={e => setFormData({...formData, password: e.target.value})} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input 
                                id="confirmPassword" 
                                type="password" 
                                placeholder="Confirm new password"
                                value={formData.confirmPassword} 
                                onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" variant="gold">Save Changes</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {user.role === 'admin' && (
              <Link to="/admin">
                <Button variant="gold" size="sm">
                  <Shield className="h-4 w-4 mr-1" />
                  Admin Panel
                </Button>
              </Link>
            )}
            {user.role === 'artist' && (
              <Link to="/artist">
                <Button variant="gold" size="sm">
                  <Palette className="h-4 w-4 mr-1" />
                  Artist Dashboard
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={logout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <ShoppingBag className="h-6 w-6 mx-auto text-primary mb-2" />
          <p className="font-display text-2xl text-foreground">0</p>
          <p className="text-sm text-muted-foreground">Orders</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <Heart className="h-6 w-6 mx-auto text-secondary mb-2" />
          <p className="font-display text-2xl text-foreground">{wishlist.length}</p>
          <p className="text-sm text-muted-foreground">Wishlist</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <User className="h-6 w-6 mx-auto text-primary mb-2" />
          <p className="font-display text-2xl text-foreground">{orders.length}</p>
          <p className="text-sm text-muted-foreground">Reviews</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <Shield className="h-6 w-6 mx-auto text-secondary mb-2" />
          <p className="font-display text-2xl text-foreground">0</p>
          <p className="text-sm text-muted-foreground">Addresses</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-xl text-foreground mb-4">Recent Orders</h2>
            {loadingOrders ? (
              <div className="py-8 text-center text-muted-foreground">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No orders yet</p>
                <Link to="/shop">
                  <Button variant="link" className="mt-2 text-secondary">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="border border-border rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4">
                            <div>
                                <p className="font-bold text-sm">Order #{order._id.slice(-6)}</p>
                                <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    order.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                                    order.status === 'delivered' ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="font-bold text-sm">
                                ${order.totalPrice}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Quick Links */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-xl text-foreground mb-4">Quick Links</h2>
          <div className="space-y-2">
            <Link to="/wishlist" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
              <Heart className="h-5 w-5 text-secondary" />
              <span className="font-ui text-foreground">My Wishlist</span>
              <span className="ml-auto text-muted-foreground">{wishlist.length} items</span>
            </Link>
            <Link to="/shop" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span className="font-ui text-foreground">Browse Shop</span>
            </Link>
            {(user.role === 'buyer' && user.artistApplicationStatus !== 'pending') && (
              <Link to="/apply-artist" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                <Shield className="h-5 w-5 text-secondary" />
                <span className="font-ui text-foreground">Become an Artist</span>
              </Link>
            )}
            {user.artistApplicationStatus === 'pending' && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50/50">
                <Shield className="h-5 w-5 text-yellow-600" />
                <span className="font-ui text-yellow-700">Application Under Review</span>
              </div>
            )}
            <Link to="/artists" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
              <User className="h-5 w-5 text-primary" />
              <span className="font-ui text-foreground">View Artists</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
