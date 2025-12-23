import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  const handleAddToCart = (productId: string) => {
    const product = wishlist.find((p) => p.id === productId);
    if (product) {
      addToCart(product);
      toast.success('Added to cart');
    }
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
    toast.info('Removed from wishlist');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-display text-4xl text-foreground mb-2">Your Wishlist</h1>
          <p className="font-body text-muted-foreground">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl text-foreground mb-2">Your wishlist is empty</h2>
            <p className="font-body text-muted-foreground mb-8">
              Save your favorite Thangkas to revisit them later
            </p>
            <Button variant="gold" asChild>
              <Link to="/shop">
                Browse Collection
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border border-border"
              >
                {/* Image */}
                <Link
                  to={`/product/${product.id}`}
                  className="w-full sm:w-32 h-40 flex-shrink-0 rounded-lg overflow-hidden"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${product.id}`}
                    className="font-display text-lg text-foreground hover:text-primary transition-colors"
                  >
                    {product.title}
                  </Link>
                  <p className="font-ui text-sm text-muted-foreground mt-1">
                    by {product.artistName}
                  </p>
                  <p className="font-ui text-sm text-muted-foreground mt-1">
                    {product.size.width} × {product.size.height} {product.size.unit}
                  </p>
                  <p className="font-display text-xl text-foreground mt-3">
                    {formatPrice(product.price)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 sm:gap-3">
                  <Button
                    variant="gold"
                    size="sm"
                    className="flex-1 sm:flex-initial"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(product.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
