import { GoogleLogin } from '@react-oauth/google';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const SocialLogin = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const res = await api.post('/auth/google', {
        token: credentialResponse.credential,
      });

      const { token, ...user } = res.data;
      
      // Save token
      localStorage.setItem('token', token);
      
      setUser({
         id: user._id,
         name: user.name,
         email: user.email,
         role: user.role,
         avatar: user.avatar
      });

      toast.success(`Welcome back, ${user.name}!`);
      
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'artist') navigate('/artist');
      else navigate('/');
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Google Login Failed');
    }
  };

  return (
    <div className="w-full flex justify-center mt-4">
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
                toast.error('Google Login connection failed');
            }}
            useOneTap
            shape="circle"
        />
    </div>
  );
};
