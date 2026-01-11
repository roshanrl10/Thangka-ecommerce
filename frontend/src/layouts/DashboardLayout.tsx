import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { 
  LayoutDashboard, 
  Users, 
  Palette, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ShoppingBag,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  role: 'admin' | 'artist';
}

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    // If we're not logged in, or if we're trying to access admin dashboard as non-admin
    // (Note: The App.tsx routes check role="admin" prop passed to this layout, but we enforce it here too)
    
    // Wait for store hydration (if any), but generally user should be present if we are here.
    // Ideally we have a 'loading' state in store but for now:
    
    if (!useStore.getState().user) {
        toast.error('Please login to access this area');
        navigate('/auth');
        return;
    }

    const user = useStore.getState().user;

    if (role === 'admin' && user?.role !== 'admin') {
        toast.error('Access Denied. Admin privileges required.');
        navigate('/auth'); // Or '/'
        return;
    }
    
    if (role === 'artist' && user?.role !== 'artist' && user?.role !== 'admin') {
         // Admin can see artist dashboard? Maybe not necessary, but usually admin has all access.
         // Requirements said "artist should control only artist product", implies segregation.
         // If a normal user tries to see artist dashboard:
         toast.error('Access Denied. Artist account required.');
         navigate('/auth');
    }

  }, [navigate, role]);

  const adminLinks = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
    { icon: Users, label: 'Users & Artists', path: '/admin/users' },
    { icon: Palette, label: 'Artworks', path: '/admin/products' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const artistLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/artist' },
    { icon: Palette, label: 'My Artworks', path: '/artist/products' },
    { icon: ShoppingBag, label: 'Orders', path: '/artist/orders' },
    { icon: BarChart3, label: 'Analytics', path: '/artist/analytics' },
    { icon: Settings, label: 'Profile', path: '/artist/profile' },
  ];

  const links = role === 'admin' ? adminLinks : artistLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display">
                ॐ
              </div>
              <span className="font-display text-xl text-foreground">
                Thangka<span className="text-secondary">Admin</span>
              </span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-secondary/10 text-secondary' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between">
          <Link to="/" className="font-display text-xl">ThangkaAdmin</Link>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Outlet />
        </main>
      </div>
    </div>
  );
}
