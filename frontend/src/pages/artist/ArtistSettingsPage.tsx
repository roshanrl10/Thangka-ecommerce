import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';
import { Loader2, Save } from 'lucide-react';

interface ArtistProfileData {
  biography: string;
  location: string;
  nationality: string;
  yearsOfExperience: number;
  artLineage: string;
  thangkaTypes: string[]; // We'll handle as comma separated string in form
  profileImage: string;
  bannerImage: string;
}

export default function ArtistSettingsPage() {
  const { user } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<any>();

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      // We can fetch via /artist/user-id if we had that, or traverse.
      // Easiest is to add a "get my profile" endpoint or just reuse public fetch if we know ID.
      // But wait, we don't know ArtistID easily from User object in store unless we stored it.
      // Let's use the 'getArtistProducts' trick -> backend knows who I am.
      // Actually, best practice: GET /artist/me (Protected).
      // But I didn't create that. I created PUT /artist/profile which updates "me".
      // I can fetch my own profile if I know my ID.
      // Workaround: Use the public API with a filter or search? No.
      // Let's just assume the user can fill it fresh or I fetch via the public API matching the user ID?
      // "getArtistProfile searches by userId too".
      
      const { data } = await api.get(`/artist/${user?.id}`); // user?.id is the User ID.
      // The backend getArtistProfile handles UserID lookup now!
      
      setValue('biography', data.biography);
      setValue('location', data.location);
      setValue('nationality', data.nationality);
      setValue('yearsOfExperience', data.yearsOfExperience);
      setValue('artLineage', data.artLineage);
      setValue('profileImage', data.profileImage);
      setValue('bannerImage', data.bannerImage);
      setValue('thangkaTypes', data.thangkaTypes?.join(', '));
      
    } catch (error) {
      console.error(error);
      // Could be 404 if not fully set up? Should accept default.
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        thangkaTypes: data.thangkaTypes.split(',').map((t: string) => t.trim()),
        yearsOfExperience: Number(data.yearsOfExperience)
      };

      await api.put('/artist/profile', payload);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Artist Profile Settings</h1>
        <p className="text-gray-500">Manage your public artist profile</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="profileImage">Profile Image URL</Label>
            <Input id="profileImage" placeholder="https://..." {...register('profileImage')} />
            <p className="text-xs text-muted-foreground">URL to your profile picture (overrides Google avatar)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bannerImage">Banner Image URL</Label>
            <Input id="bannerImage" placeholder="https://..." {...register('bannerImage')} />
             <p className="text-xs text-muted-foreground">Large banner image for your profile page</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>Nationality</Label>
                <Input {...register('nationality')} />
             </div>
             <div className="space-y-2">
                <Label>Location</Label>
                <Input {...register('location')} placeholder="e.g. Kathmandu, Nepal" />
             </div>
          </div>

          <div className="space-y-2">
            <Label>Biography</Label>
            <Textarea rows={4} {...register('biography')} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input type="number" {...register('yearsOfExperience')} />
             </div>
             <div className="space-y-2">
                <Label>Art Lineage / School</Label>
                <Input {...register('artLineage')} />
             </div>
          </div>

          <div className="space-y-2">
            <Label>Specializations (comma separated)</Label>
            <Input {...register('thangkaTypes')} placeholder="Mandala, Green Tara, etc." />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </>
                )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
