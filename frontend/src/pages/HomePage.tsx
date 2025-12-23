import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Brush, Award, Truck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { products, categories } from '@/data/mockData';

export default function HomePage() {
  const allProducts = products;
  const newArrivals = products.slice(0, 4);
  const bestSellers = products.slice(2, 6);

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

        {/* New Arrivals Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl md:text-2xl text-foreground">New Arrivals</h2>
            <Link to="/shop" className="flex items-center gap-1 text-sm font-ui text-primary hover:underline">
              See all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

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
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl md:text-2xl text-foreground">Best Sellers</h2>
            <Link to="/shop" className="flex items-center gap-1 text-sm font-ui text-primary hover:underline">
              See all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* All Products Grid */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl md:text-2xl text-foreground">Explore All Thangkas</h2>
            <Link to="/shop" className="flex items-center gap-1 text-sm font-ui text-primary hover:underline">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

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
