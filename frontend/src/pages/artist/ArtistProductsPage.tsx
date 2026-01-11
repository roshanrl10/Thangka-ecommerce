import { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

export default function ArtistProductsPage() {
  const { user } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      // Fetch products belonging to the logged-in artist
      const { data } = await api.get('/products/my-products');
      setProducts(data.data); // data.data because controller returns { success: true, data: [] }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      // Pass userId in body for ownership check (simulated middleware)
      await api.delete(`/artist-dashboard/products/${productId}`);
      toast.success('Product deleted');
      setProducts(prev => prev.filter(p => p._id !== productId));
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Artworks</h1>
          <p className="text-gray-500">Manage your portfolio and products</p>
        </div>
        <Link to="/artist/products/new">
          <Button className="gap-2 bg-secondary hover:bg-secondary/90 text-white">
            <Plus className="w-4 h-4" />
            Add New Artwork
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Product</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Price</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Stock</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                  <tr><td colSpan={5} className="p-8 text-center">Loading artifacts...</td></tr>
              ) : products.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">No products found. Start by adding one!</td></tr>
              ) : (
                  products.map((product) => (
                    <tr key={product._id} className="group hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                            <img 
                              src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                              alt={product.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.title}</p>
                            <p className="text-xs text-gray-500">ID: {product._id?.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600 capitalize">{product.category}</td>
                      <td className="p-4 text-sm font-medium text-gray-900">Rs. {product.price?.toLocaleString()}</td>
                      <td className="p-4 text-sm text-gray-600">{product.stock || 1}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.inStock 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/product/${product._id}`} target="_blank">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                             </Button>
                          </Link>
                          {/* Edit functionality to be implemented */}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-orange-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 className="w-4 h-4" />
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
    </div>
  );
}
