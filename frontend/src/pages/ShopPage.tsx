import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Grid3X3, LayoutList, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

// Categories will be derived dynamically from products

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: '0-1000', label: 'Under $1,000' },
  { value: '1000-2000', label: '$1,000 - $2,000' },
  { value: '2000-3000', label: '$2,000 - $3,000' },
  { value: '3000+', label: 'Over $3,000' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real Data State
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        // Backend returns { success: true, data: [...] }
        const productsData = data.data;
        // Map backend data to match Product interface (flatten artist)
        const mappedProducts = Array.isArray(productsData) ? productsData.map((p: any) => ({
            ...p,
            id: p.id || p._id,
            artistId: p.artist?._id || p.artist,
            artistName: p.artist?.name || 'Unknown Artist',
            // Ensure images is array
            images: Array.isArray(p.images) ? p.images : [p.images].filter(Boolean)
        })) : [];
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const counts = new Map();
    products.forEach(p => {
        if(p.category) {
            counts.set(p.category, (counts.get(p.category) || 0) + 1);
        }
    });

    return Array.from(counts.entries()).map(([cat, count]) => ({
        id: cat,
        name: cat.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        productCount: count
    }));
  }, [products]);

  // Get filter values from URL
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedSort = searchParams.get('sort') || 'newest';
  const selectedPrice = searchParams.get('price') || 'all';

  // Update filters
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || value === 'newest') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.artist?.name?.toLowerCase().includes(query) || // Backend might populate artist or just return ID
          p.category?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Price filter
    if (selectedPrice !== 'all') {
      const [min, max] = selectedPrice.split('-').map((v) => (v === '' ? Infinity : parseInt(v)));
      if (selectedPrice.endsWith('+')) {
        const minPrice = parseInt(selectedPrice);
        result = result.filter((p) => p.price >= minPrice);
      } else {
        result = result.filter((p) => p.price >= min && p.price <= (max || Infinity));
      }
    }

    // Sort
    switch (selectedSort) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        // result.sort((a, b) => b.rating - a.rating); // Handle optional rating
        break;
      case 'popular':
        // result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSort, selectedPrice]);

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedPrice !== 'all' || searchQuery;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-display text-4xl text-foreground mb-4">Shop Thangka Art</h1>
          <p className="font-body text-muted-foreground max-w-2xl">
            Browse our curated collection of authentic hand-painted Thangkas from verified 
            Himalayan artists. Each piece is unique and crafted with devotion.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Thangkas, artists..."
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Sort */}
          <select
            value={selectedSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="px-4 py-2.5 bg-card border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Mobile Filter Toggle */}
          <Button
            variant="calm"
            className="md:hidden"
            onClick={() => setIsFilterOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>

          {/* View Mode Toggle */}
          <div className="hidden md:flex items-center gap-1 border border-border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-display text-lg text-foreground mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => updateFilter('category', 'all')}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg font-ui text-sm transition-colors",
                      selectedCategory === 'all'
                        ? "bg-secondary/10 text-secondary"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateFilter('category', cat.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg font-ui text-sm transition-colors flex items-center justify-between",
                        selectedCategory === cat.id
                          ? "bg-secondary/10 text-secondary"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {cat.name}
                      <span className="text-xs">({cat.productCount})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-display text-lg text-foreground mb-4">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => updateFilter('price', range.value)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg font-ui text-sm transition-colors",
                        selectedPrice === range.value
                          ? "bg-secondary/10 text-secondary"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="font-ui text-sm text-muted-foreground">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="md:hidden"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-display text-xl text-foreground mb-2">No Thangkas found</p>
                <p className="font-ui text-muted-foreground mb-6">
                  Try adjusting your filters or search term
                </p>
                <Button variant="gold" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === 'grid'
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                )}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-foreground/50 z-50 md:hidden"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50 md:hidden max-h-[80vh] overflow-y-auto animate-slide-in-right">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-lg">Filters</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 space-y-6">
              {/* Categories */}
              <div>
                <h4 className="font-ui font-medium text-foreground mb-3">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      updateFilter('category', 'all');
                      setIsFilterOpen(false);
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full font-ui text-sm transition-colors",
                      selectedCategory === 'all'
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        updateFilter('category', cat.id);
                        setIsFilterOpen(false);
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-full font-ui text-sm transition-colors",
                        selectedCategory === cat.id
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="font-ui font-medium text-foreground mb-3">Price Range</h4>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        updateFilter('price', range.value);
                        setIsFilterOpen(false);
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-full font-ui text-sm transition-colors",
                        selectedPrice === range.value
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <Button variant="gold" className="w-full" onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
