import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, BadgeCheck } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  className?: string;
  style?: React.CSSProperties;
}

export function ProductCard({ product, className, style }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Added to cart', {
      description: product.title,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      style={style}
      className={cn(
        "group block bg-card rounded-lg overflow-hidden thangka-card border border-border/50 transition-all",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
            <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
        </Link>
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 pointer-events-auto">
            <Button
              variant="calm"
              size="sm"
              className="flex-1 bg-background/95 hover:bg-background"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
            <Button
              variant="calm"
              size="icon"
              className={cn(
                "bg-background/95 hover:bg-background",
                inWishlist && "text-primary"
              )}
              onClick={handleWishlistToggle}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </Button>
          </div>
        </div>

        {/* Badge */}
        {product.originalPrice && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-ui rounded">
            Sale
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Artist */}
        <div className="flex items-center gap-1 mb-2">
          <Link
            to={`/artist/${product.artistId}`}
            className="text-xs font-ui text-muted-foreground hover:text-secondary transition-colors"
          >
            {product.artistName}
          </Link>
          {product.isVerifiedArtist && (
            <BadgeCheck className="h-3.5 w-3.5 text-secondary" />
          )}
        </div>

        {/* Title */}
        <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-display text-base text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.title}
            </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
          <span className="text-xs font-ui text-muted-foreground">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-display text-lg text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm font-ui text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Size */}
        <p className="text-xs font-ui text-muted-foreground mt-1">
          {product.size.width} × {product.size.height} {product.size.unit}
        </p>
      </div>
    </div>
  );
}
