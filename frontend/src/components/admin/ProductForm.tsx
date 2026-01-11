import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ProductFormData {
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
  images: string; 
  artistId?: string; // Admin can specify
}

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
  isAdmin?: boolean;
  users?: any[];
}

export function ProductForm({ defaultValues, onSubmit, isLoading, isAdmin, users }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues
  });

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      
      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">Basic Information</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Artwork Title</Label>
            <Input id="title" placeholder="e.g., Green Tara" {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select 
                id="category" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} placeholder="Description..." {...register('description', { required: 'Description is required' })} />
            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
          </div>

           {isAdmin && (
               <div className="space-y-2">
                <Label htmlFor="artistId">Assign Artist (Optional)</Label>
                <select
                    id="artistId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...register('artistId')}
                >
                    <option value="">Me (Admin)</option>
                    {users?.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.name} ({user.email})
                        </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500">Select an artist to assign this product to them.</p>
               </div>
           )}
        </div>
      </div>

      {/* Pricing & Specification */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">Details & Pricing</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">Price (Rs.)</Label>
            <Input id="price" type="number" placeholder="0.00" {...register('price', { required: 'Price is required', min: 1 })} />
            {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Input id="material" placeholder="e.g., Cotton" {...register('material', { required: true })} />
          </div>

          <div className="space-y-2">
             <Label htmlFor="duration">Duration</Label>
             <Input id="duration" placeholder="e.g., 3 months" {...register('paintingDuration', { required: true })} />
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
            <Textarea id="spiritualMeaning" rows={2} placeholder="Spiritual meaning..." {...register('spiritualMeaning')} />
         </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-100">Images</h2>
        
        <div className="space-y-2">
            <Label htmlFor="images">Image URLs (Comma separated)</Label>
            <Input id="images" placeholder="url1, url2" {...register('images', { required: 'At least one image is required' })} />
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white min-w-[150px]" disabled={isLoading}>
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                </>
            ) : (
                'Save Product'
            )}
        </Button>
      </div>
    </form>
  );
}
