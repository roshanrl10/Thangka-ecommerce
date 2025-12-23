import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Heart, ShoppingBag, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

export default function ProfilePage() {
  const { user, logout, wishlist } = useStore();

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
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Edit Profile
            </Button>
            {user.role === 'admin' && (
              <Link to="/admin">
                <Button variant="gold" size="sm">
                  <Shield className="h-4 w-4 mr-1" />
                  Admin Panel
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
          <p className="font-display text-2xl text-foreground">0</p>
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
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>No orders yet</p>
            <Link to="/shop">
              <Button variant="link" className="mt-2 text-secondary">
                Start Shopping
              </Button>
            </Link>
          </div>
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
            {user.role === 'buyer' && (
              <Link to="/apply-artist" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                <Shield className="h-5 w-5 text-secondary" />
                <span className="font-ui text-foreground">Become an Artist</span>
              </Link>
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
