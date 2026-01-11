import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  material: string;
  paintingDuration: string;
  width: number;
  height: number;
  unit: string;
  spiritualMeaning: string;
  images: string; // Comma separated for now
  stock: number;
}

export default function AddProductPage() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>();

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        images: data.images.split(',').map(url => url.trim()), // Convert string to array
        size: {
            width: data.width,
            height: data.height,
            unit: data.unit
        },
        stock: Number(data.stock)
      };

      await api.post('/products', payload);
      toast.success('Product created successfully');
      navigate('/artist/products');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/artist/products" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Artwork</h1>
        <p className="text-gray-500">Share your Thangka masterpiece with the world</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">Basic Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Artwork Title</Label>
                <Input id="title" placeholder="e.g., Green Tara - The Liberator" {...register('title', { required: 'Title is required' })} />
                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select 
                    id="category" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('category', { required: 'Category is required' })}
                >
                    <option value="">Select Category</option>
                    <option value="buddha">Buddha</option>
                    <option value="tara">Tara</option>
                    <option value="mandala">Mandala</option>
                    <option value="deity">Deity</option>
                    <option value="wheel">Wheel of Life</option>
                    <option value="medicine">Medicine Buddha</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description (Details & Iconography)</Label>
                <Textarea id="description" rows={4} placeholder="Describe the deity, symbols, and artistic details..." {...register('description', { required: 'Description is required' })} />
                {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          {/* Pricing & Specification */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">Details & Pricing</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price (Rs.)</Label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">Rs.</span>
                    <Input id="price" type="number" className="pl-10" placeholder="0.00" {...register('price', { required: 'Price is required', min: 1 })} />
                </div>
                {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="material">Material (Canvas/Pigments)</Label>
                <Input id="material" placeholder="e.g., Cotton, Gold Dust" {...register('material', { required: true })} />
              </div>

              <div className="space-y-2">
                 <Label htmlFor="duration">Painting Duration</Label>
                 <Input id="duration" placeholder="e.g., 3 months" {...register('paintingDuration', { required: true })} />
              </div>

              <div className="space-y-2 md:col-span-1">
                 <Label htmlFor="stock">Stock Quantity</Label>
                 <Input id="stock" type="number" placeholder="1" defaultValue={1} min={0} {...register('stock', { required: true, min: 0 })} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <Label>Width</Label>
                    <Input type="number" placeholder="W" {...register('width', { required: true })} />
                 </div>
                 <div className="space-y-2">
                    <Label>Height</Label>
                    <Input type="number" placeholder="H" {...register('height', { required: true })} />
                 </div>
                 <div className="space-y-2">
                    <Label>Unit</Label>
                    <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        {...register('unit', { required: true })}
                    >
                        <option value="cm">cm</option>
                        <option value="inches">inches</option>
                    </select>
                 </div>
            </div>
            
             <div className="space-y-2">
                <Label htmlFor="spiritualMeaning">Spiritual Meaning</Label>
                <Textarea id="spiritualMeaning" rows={2} placeholder="What does this Thangka represent spiritually?" {...register('spiritualMeaning')} />
             </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">Images</h2>
            
            <div className="space-y-2">
                <Label htmlFor="images">Image URLs (Comma separated)</Label>
                <Input id="images" placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" {...register('images', { required: 'At least one image is required' })} />
                <p className="text-xs text-muted-foreground">For this demo, please paste direct image links. File upload coming soon.</p> 
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link to="/artist/products">
                <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white min-w-[150px]" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                    </>
                ) : (
                    'Publish Artwork'
                )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
