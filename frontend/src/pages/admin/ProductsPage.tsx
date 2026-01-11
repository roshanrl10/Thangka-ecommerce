import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm, ProductFormData } from '@/components/admin/ProductForm';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]); // New state for users
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null); // Track editing product
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchUsers(); // Fetch users too
  }, []);

  const fetchUsers = async () => {
    try {
        const { data } = await api.get('/admin/users');
        setUsers(data || []);
    } catch(err) {
        console.error("Failed to fetch users");
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(Array.isArray(data.data) ? data.data : []); 
    } catch (error) {
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: ProductFormData) => {
      try {
           const payload = {
            ...data,
            images: data.images.split(',').map(url => url.trim()),
            size: {
                width: data.width,
                height: data.height,
                unit: data.unit
            }
          };

          if (editingProduct) {
              await api.put(`/products/${editingProduct._id}`, payload);
              toast.success('Product updated');
          } else {
              await api.post('/products', payload);
              toast.success('Product created');
          }

          setIsDialogOpen(false);
          setEditingProduct(null); // Reset
          fetchProducts();
      } catch (error: any) {
          toast.error(error.response?.data?.message || 'Operation failed');
      }
  };

  const handleEdit = (product: any) => {
      setEditingProduct(product);
      setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
      if(!confirm("Are you sure?")) return;
      try {
          await api.delete(`/products/${id}`);
          toast.success('Product deleted');
          setProducts(products.filter(p => p._id !== id));
      } catch (error) {
          toast.error('Failed to delete');
      }
  };

  const filteredProducts = products.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">Products ({products.length})</h1>
            <p className="text-gray-500">Manage all artworks</p>
         </div>
         <Dialog open={isDialogOpen} onOpenChange={(open) => {
             setIsDialogOpen(open);
             if (!open) setEditingProduct(null); // Reset on close
         }}>
             <DialogTrigger asChild>
                <Button className="bg-secondary text-white gap-2" onClick={() => setEditingProduct(null)}>
                    <Plus className="w-4 h-4" /> Add Product
                </Button>
             </DialogTrigger>
             <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                 <DialogHeader>
                     <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                 </DialogHeader>
                 <ProductForm 
                    onSubmit={handleCreateOrUpdate} 
                    isAdmin={true} 
                    users={users} 
                    // Pass default values if editing
                    defaultValues={editingProduct ? {
                        title: editingProduct.title,
                        description: editingProduct.description,
                        price: editingProduct.price,
                        category: editingProduct.category,
                        material: editingProduct.material,
                        paintingDuration: editingProduct.paintingDuration,
                        width: editingProduct.size?.width,
                        height: editingProduct.size?.height,
                        unit: editingProduct.size?.unit,
                        spiritualMeaning: editingProduct.spiritualMeaning,
                        images: editingProduct.images?.join(', '),
                        artistId: editingProduct.artist?._id || editingProduct.artist,
                    } : undefined}
                 />
             </DialogContent>
         </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search products..." 
            className="pl-9"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
            <thead className="bg-gray-50">
                <tr>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Product</th>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Price</th>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Category</th>
                    <th className="text-left p-4 font-medium text-gray-500 text-sm">Artist</th>
                    <th className="text-right p-4 font-medium text-gray-500 text-sm">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
                ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">No products found</td></tr>
                ) : (
                    filteredProducts.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <img src={product.images?.[0]} className="w-10 h-10 object-cover rounded bg-gray-100" />
                                    <span className="font-medium text-gray-900">{product.title}</span>
                                </div>
                            </td>
                            <td className="p-4 text-gray-600">Rs. {product.price}</td>
                            <td className="p-4 text-gray-600 capitalize">{product.category}</td>
                            <td className="p-4 text-gray-600 text-sm">
                                {product.artist?.name || 'Unknown'}
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                        <Pencil className="w-4 h-4 text-blue-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product._id)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
