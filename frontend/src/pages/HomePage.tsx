import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Brush, Award, Truck, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import api from '@/lib/api';

// Reusing local categories for UI consistency
// Categories will be derived dynamically from products

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        const productsData = data.data;
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error("Failed to fetch products for home page", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Map();
    products.forEach(product => {
      // Assuming product.category exists and is a string
      if (product.category && !uniqueCategories.has(product.category)) {
        uniqueCategories.set(product.category, {
          id: product.category,
          name: product.category
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          image: product.images && product.images.length > 0 ? product.images[0] : '', // Fallback or empty
        });
      }
    });
    return Array.from(uniqueCategories.values());
  }, [products]);

  const newArrivals = products.slice(0, 4);
  const bestSellers = products.length > 4 ? products.slice(4, 8) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Trust Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-xs font-ui">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" /> Verified Artists
            </span>
            <span className="flex items-center gap-1">
              <Brush className="h-3 w-3" /> 100% Handmade
            </span>
            <span className="flex items-center gap-1">
              <Award className="h-3 w-3" /> Authenticity Certified
            </span>
            <span className="hidden md:flex items-center gap-1">
              <Truck className="h-3 w-3" /> Global Shipping
            </span>
          </div>
        </div>
      </div>

      {/* Categories Strip */}
      <div className="bg-card border-b border-border py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            <Link to="/shop" className="font-ui text-sm text-foreground hover:text-primary whitespace-nowrap font-medium">
              All Thangkas
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="font-ui text-sm text-muted-foreground hover:text-primary whitespace-nowrap transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Category Cards Row */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="group bg-card rounded-lg border border-border p-3 hover:shadow-card transition-all"
            >
              <div className="aspect-square rounded overflow-hidden mb-2">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="font-ui text-xs text-foreground text-center truncate">{category.name}</p>
            </Link>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
             <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
        ) : (
            <>
                {/* New Arrivals Section */}
                {newArrivals.length > 0 && (
                    <section className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display text-xl md:text-2xl text-foreground">New Arrivals</h2>
                        <Link to="/shop" className="flex items-center gap-1 text-sm font-ui text-primary hover:underline">
                        See all <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {newArrivals.map((product) => (
                        <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    </section>
                )}

                {/* Deal Banner */}
                <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 mb-10 flex items-center justify-between">
                <div>
                    <p className="font-display text-xl md:text-2xl text-primary-foreground mb-1">Authentic Thangka Collection</p>
                    <p className="font-body text-sm text-primary-foreground/80">Hand-painted by verified Himalayan artists</p>
                </div>
                <Button variant="secondary" size="sm" asChild>
                    <Link to="/shop">Shop Now</Link>
                </Button>
                </div>

                {/* Best Sellers Section */}
                {bestSellers.length > 0 && (
                    <section className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display text-xl md:text-2xl text-foreground">Featured Artworks</h2>
                        <Link to="/shop" className="flex items-center gap-1 text-sm font-ui text-primary hover:underline">
                        See all <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {bestSellers.map((product) => (
                        <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    </section>
                )}

                {/* All Products Grid */}
                {products.length > 0 && (
                    <section className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display text-xl md:text-2xl text-foreground">Explore All Thangkas</h2>
                        <Link to="/shop" className="flex items-center gap-1 text-sm font-ui text-primary hover:underline">
                        View all <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    </section>
                )}
                
                {products.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-lg mb-10">
                        <p className="text-gray-500 mb-4">Our artisans are currently curating new masterpieces.</p>
                        <Button asChild>
                            <Link to="/shop">Browse Shop</Link>
                        </Button>
                    </div>
                )}
            </>
        )}

        {/* Artist Banner */}
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg text-foreground mb-1">Are you a Thangka Artist?</p>
            <p className="font-body text-sm text-muted-foreground">Join our community of verified masters and sell your artwork</p>
          </div>
          <Button variant="gold" asChild>
            <Link to="/apply-artist">
              Apply Now <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
