import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, X, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';

const thangkaTypes = [
  'Buddha',
  'Mandala',
  'Tara',
  'Medicine Buddha',
  'Wheel of Life',
  'Deity',
  'Wrathful Deities',
  'Peaceful Deities',
  'Other',
];

export default function ApplyArtistPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    nationality: '',
    biography: '',
    yearsOfExperience: '',
    artLineage: '',
    thangkaTypes: [] as string[],
    idProof: null as File | null,
    sampleArtworks: [] as File[],
    declaration: false,
  });

  const handleTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      thangkaTypes: prev.thangkaTypes.includes(type)
        ? prev.thangkaTypes.filter((t) => t !== type)
        : [...prev.thangkaTypes, type],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'idProof' | 'sampleArtworks') => {
    const files = e.target.files;
    if (!files) return;

    if (field === 'idProof') {
      setFormData((prev) => ({ ...prev, idProof: files[0] }));
    } else {
      const newFiles = Array.from(files).slice(0, 3 - formData.sampleArtworks.length);
      setFormData((prev) => ({
        ...prev,
        sampleArtworks: [...prev.sampleArtworks, ...newFiles].slice(0, 3),
      }));
    }
  };

  const removeSampleArtwork = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sampleArtworks: prev.sampleArtworks.filter((_, i) => i !== index),
    }));
  };

  const { user } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      toast.error('You must be logged in to apply');
      setIsSubmitting(false);
      return;
    }

    try {
      // For now, we are sending mock URLs for files as file upload is not yet implemented
      const payload = {
        userId: user.id,
        fullName: formData.fullName,
        nationality: formData.nationality,
        biography: formData.biography,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        artLineage: formData.artLineage,
        thangkaTypes: formData.thangkaTypes,
        idProof: 'https://placehold.co/600x400?text=ID+Proof', // Mock URL
        portfolio: formData.sampleArtworks.map((_, i) => `https://placehold.co/600x400?text=Artwork+${i+1}`), // Mock URLs
      };

      await api.post('/artist/apply', payload);

      toast.success('Application submitted successfully!', {
        description: 'We will review your application and get back to you within 5-7 business days.',
      });

      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Application failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = formData.fullName && formData.nationality && formData.biography.length >= 300;
  const isStep2Valid = formData.yearsOfExperience && formData.thangkaTypes.length > 0;
  const isStep3Valid = formData.idProof && formData.sampleArtworks.length >= 2 && formData.declaration;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl text-foreground mb-4">Apply as Artist</h1>
          <p className="font-body text-muted-foreground">
            Join our community of verified Thangka artists and share your sacred art with collectors worldwide
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-ui text-sm transition-colors ${
                  step >= s
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > s ? <CheckCircle className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 md:w-24 h-1 mx-2 transition-colors ${
                    step > s ? 'bg-secondary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-6 md:p-8">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-display text-xl text-foreground mb-6">Personal Information</h2>

              <div>
                <label className="block font-ui text-sm text-foreground mb-2">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  required
                />
              </div>

              <div>
                <label className="block font-ui text-sm text-foreground mb-2">
                  Nationality <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="e.g., Nepali, Tibetan, Bhutanese"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  required
                />
              </div>

              <div>
                <label className="block font-ui text-sm text-foreground mb-2">
                  Biography <span className="text-destructive">*</span>
                  <span className="text-muted-foreground ml-2">(min. 300 characters)</span>
                </label>
                <textarea
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  placeholder="Tell us about yourself, your artistic journey, training, and philosophy..."
                  rows={6}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
                  required
                />
                <p className="mt-1 font-ui text-xs text-muted-foreground">
                  {formData.biography.length}/300 characters
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Artistic Background */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-display text-xl text-foreground mb-6">Artistic Background</h2>

              <div>
                <label className="block font-ui text-sm text-foreground mb-2">
                  Years of Experience <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  placeholder="e.g., 10"
                  min="1"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  required
                />
              </div>

              <div>
                <label className="block font-ui text-sm text-foreground mb-2">
                  Art Lineage / Teacher Name
                </label>
                <input
                  type="text"
                  value={formData.artLineage}
                  onChange={(e) => setFormData({ ...formData, artLineage: e.target.value })}
                  placeholder="e.g., Karma Gadri School, trained under Master..."
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>

              <div>
                <label className="block font-ui text-sm text-foreground mb-2">
                  Types of Thangka <span className="text-destructive">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {thangkaTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeToggle(type)}
                      className={`px-3 py-1.5 rounded-full font-ui text-sm transition-colors ${
                        formData.thangkaTypes.includes(type)
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documents & Declaration */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-display text-xl text-foreground mb-6">Documents & Declaration</h2>

              {/* ID Proof */}
              <div>
                <label className="block font-ui text-sm text-foreground mb-2">
                  ID Proof (Passport/Citizenship) <span className="text-destructive">*</span>
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  {formData.idProof ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-ui text-sm text-foreground">{formData.idProof.name}</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, idProof: null })}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="font-ui text-sm text-muted-foreground">Click to upload</p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, 'idProof')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Sample Artworks */}
              <div>
                <label className="block font-ui text-sm text-foreground mb-2">
                  Sample Artworks (2-3 images) <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {formData.sampleArtworks.map((file, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Sample ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeSampleArtwork(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-foreground/80 text-background rounded-full flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {formData.sampleArtworks.length < 3 && (
                    <label className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-secondary transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e, 'sampleArtworks')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Declaration */}
              <div className="p-4 bg-muted rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.declaration}
                    onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
                    className="mt-1"
                  />
                  <span className="font-ui text-sm text-foreground">
                    I declare that all artworks I create and sell on this platform are original, 
                    hand-painted works created by me. I understand that any violation of this 
                    declaration may result in removal from the platform.
                  </span>
                </label>
              </div>

              <div className="flex items-start gap-2 p-4 bg-secondary/10 rounded-lg">
                <Info className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <p className="font-ui text-sm text-muted-foreground">
                  Your application will be reviewed by our team within 5-7 business days. 
                  We may contact you for additional information if needed.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            {step > 1 ? (
              <Button type="button" variant="ghost" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            ) : (
              <Link to="/">
                <Button type="button" variant="ghost">Cancel</Button>
              </Link>
            )}

            {step < 3 ? (
              <Button
                type="button"
                variant="gold"
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                variant="gold"
                disabled={!isStep3Valid || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
