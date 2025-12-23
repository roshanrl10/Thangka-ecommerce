import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication
    setUser({
      id: 'user-1',
      email: formData.email,
      name: formData.name || formData.email.split('@')[0],
      role: 'buyer',
    });

    toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
    navigate('/');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display text-xl">ॐ</span>
          </div>
          <span className="font-display text-2xl text-foreground tracking-wide">
            Thangka<span className="text-secondary">Art</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-card rounded-lg border border-border p-6 md:p-8 shadow-card">
          <h1 className="font-display text-2xl text-foreground text-center mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="font-body text-sm text-muted-foreground text-center mb-8">
            {isLogin
              ? 'Sign in to access your collection'
              : 'Join our community of art collectors'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block font-ui text-sm text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            )}

            <div>
              <label className="block font-ui text-sm text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="block font-ui text-sm text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  required
                  minLength={6}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="font-ui text-sm text-secondary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-ui text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-secondary hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Artist CTA */}
        <div className="mt-6 text-center">
          <p className="font-ui text-sm text-muted-foreground">
            Are you an artist?{' '}
            <Link to="/apply-artist" className="text-secondary hover:underline">
              Apply to sell your art
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
