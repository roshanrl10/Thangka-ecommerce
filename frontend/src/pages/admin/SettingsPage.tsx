
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, User, Mail, Lock, Save, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function SettingsPage() {
    const { user, setUser } = useStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email
            }));
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await api.put('/users/profile', {
                name: formData.name,
                email: formData.email,
                password: formData.password || undefined
            });

            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            
            setUser(data);
            toast.success("Settings updated successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update settings");
        } finally {
            setIsLoading(false);
        }
    };

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

    return (
        <div className="min-h-screen bg-muted/30 p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Dashboard
                    </Link>
                    <h1 className="font-display text-3xl text-foreground">Admin Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your administrator profile and preferences.</p>
                </div>

                {/* Settings Form */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border bg-muted/20">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                                <Shield className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-foreground">{user.name}</h2>
                                <p className="text-sm text-muted-foreground">Administrator Access</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    Display Name
                                </Label>
                                <Input 
                                    id="name" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    Email Address
                                </Label>
                                <Input 
                                    id="email" 
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="border-t border-border pt-6 mt-2">
                                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-primary" />
                                    Security
                                </h3>
                                
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">New Password</Label>
                                        <Input 
                                            id="password" 
                                            type="password"
                                            placeholder="Leave blank to keep current password"
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
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" variant="gold" disabled={isLoading} className="w-full md:w-auto">
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
