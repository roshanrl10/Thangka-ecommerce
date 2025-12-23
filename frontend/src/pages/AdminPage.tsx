import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Package, ShoppingCart, Palette, Settings, 
  CheckCircle, XCircle, Eye, Trash2, Shield, TrendingUp,
  DollarSign, Clock, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { products, artists } from '@/data/mockData';

type TabType = 'overview' | 'products' | 'artists' | 'orders' | 'users';

export default function AdminPage() {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Mock data for admin
  const pendingArtists = [
    { id: '1', name: 'Tenzin Norbu', email: 'tenzin@example.com', appliedDate: '2024-01-15', status: 'pending' },
    { id: '2', name: 'Karma Wangmo', email: 'karma@example.com', appliedDate: '2024-01-18', status: 'pending' },
  ];

  const recentOrders = [
    { id: 'ORD001', customer: 'John Doe', total: 2500, status: 'processing', date: '2024-01-20' },
    { id: 'ORD002', customer: 'Jane Smith', total: 1800, status: 'shipped', date: '2024-01-19' },
    { id: 'ORD003', customer: 'Mike Wilson', total: 3200, status: 'delivered', date: '2024-01-18' },
  ];

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Shield className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h1 className="font-display text-2xl text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You need admin privileges to access this page.</p>
        <Link to="/">
          <Button variant="gold">Go Home</Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: TrendingUp },
    { id: 'products' as TabType, label: 'Products', icon: Package },
    { id: 'artists' as TabType, label: 'Artists', icon: Palette },
    { id: 'orders' as TabType, label: 'Orders', icon: ShoppingCart },
    { id: 'users' as TabType, label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your Thangka marketplace</p>
          </div>
          <Link to="/profile">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'gold' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="flex-shrink-0"
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <DollarSign className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="font-display text-2xl text-foreground">$45,230</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="font-display text-2xl text-foreground">{products.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <Palette className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Verified Artists</p>
                    <p className="font-display text-2xl text-foreground">{artists.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="font-display text-2xl text-foreground">1,234</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl text-foreground">Pending Artist Applications</h2>
                  <span className="bg-destructive/20 text-destructive text-sm px-2 py-1 rounded-full">
                    {pendingArtists.length} pending
                  </span>
                </div>
                <div className="space-y-3">
                  {pendingArtists.map(artist => (
                    <div key={artist.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-ui text-foreground">{artist.name}</p>
                        <p className="text-sm text-muted-foreground">{artist.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl text-foreground">Recent Orders</h2>
                  <Button variant="link" className="text-secondary">View All</Button>
                </div>
                <div className="space-y-3">
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-ui text-foreground">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-foreground">${order.total}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-display text-xl text-foreground">All Products</h2>
              <Button variant="gold">Add Product</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-ui text-muted-foreground">Product</th>
                    <th className="text-left p-4 font-ui text-muted-foreground">Artist</th>
                    <th className="text-left p-4 font-ui text-muted-foreground">Price</th>
                    <th className="text-left p-4 font-ui text-muted-foreground">Category</th>
                    <th className="text-left p-4 font-ui text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-border">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.images[0]} 
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <span className="font-ui text-foreground">{product.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{product.artistName}</td>
                      <td className="p-4 font-display text-foreground">${product.price}</td>
                      <td className="p-4">
                        <span className="bg-muted px-2 py-1 rounded text-sm">{product.category}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Artists Tab */}
        {activeTab === 'artists' && (
          <div className="space-y-6">
            {/* Pending Applications */}
            <div className="bg-card rounded-xl border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Pending Applications
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {pendingArtists.map(artist => (
                  <div key={artist.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Palette className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-ui text-foreground">{artist.name}</p>
                        <p className="text-sm text-muted-foreground">{artist.email}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Applied: {artist.appliedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button variant="gold" size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Artists */}
            <div className="bg-card rounded-xl border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="font-display text-xl text-foreground">Verified Artists</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-ui text-muted-foreground">Artist</th>
                      <th className="text-left p-4 font-ui text-muted-foreground">Location</th>
                      <th className="text-left p-4 font-ui text-muted-foreground">Products</th>
                      <th className="text-left p-4 font-ui text-muted-foreground">Rating</th>
                      <th className="text-left p-4 font-ui text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artists.map(artist => (
                      <tr key={artist.id} className="border-b border-border">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={artist.profileImage} 
                              alt={artist.name}
                              className="w-10 h-10 object-cover rounded-full"
                            />
                            <div>
                              <span className="font-ui text-foreground">{artist.name}</span>
                              <p className="text-xs text-muted-foreground">{artist.yearsOfExperience} years exp.</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{artist.location}</td>
                        <td className="p-4 text-foreground">{artist.totalArtworks}</td>
                        <td className="p-4 text-secondary">⭐ {artist.rating}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Link to={`/artist/${artist.id}`}>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="font-display text-xl text-foreground">All Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-ui text-muted-foreground">Order ID</th>
                    <th className="text-left p-4 font-ui text-muted-foreground">Customer</th>
                    <th className="text-left p-4 font-ui text-muted-foreground">Date</th>
                    <th className="text-left p-4 font-ui text-muted-foreground">Total</th>
                    <th className="text-left p-4 font-ui text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-ui text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} className="border-b border-border">
                      <td className="p-4 font-ui text-foreground">{order.id}</td>
                      <td className="p-4 text-muted-foreground">{order.customer}</td>
                      <td className="p-4 text-muted-foreground">{order.date}</td>
                      <td className="p-4 font-display text-foreground">${order.total}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="font-display text-xl text-foreground">All Users</h2>
            </div>
            <div className="p-6 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>User management will be available once backend is connected.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
