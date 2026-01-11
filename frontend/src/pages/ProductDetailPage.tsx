import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  BadgeCheck,
  Ruler,
  Clock,
  Palette,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
// import { products, artists } from "@/data/mockData"; // Removed mock data
import { ProductCard } from "@/components/product/ProductCard"; // You might need to update this to fetch real data too or remove for now
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null); // State for product
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]); // State for related products

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useStore();

  const inWishlist = product ? isInWishlist(product._id) : false;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
      setLoading(true);
      try {
          const { data } = await api.get(`/products/${id}`);
          setProduct(data.data);
          
          // Fetch related products (mock logic for now or real if backend has filter)
          // For now we don't fetch related, or could fetch all and filter client side (not efficient but okay for small app)
          // setRelatedProducts([]); 
      } catch (error: any) {
          console.error("Failed to fetch product", error);
          setErrorMsg(error.response?.data?.message || error.message || "Unknown error");
          setProduct(null);
      } finally {
          setLoading(false);
      }
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">
            Product not found
          </h1>
          <p className="text-muted-foreground mb-4">
            Could not load product with ID: {id} <br/>
            Error: {errorMsg}
          </p>
          <Button variant="gold" asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const artist = product.artist; 

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    // Ensure product shape matches what addToCart expects from User/Store type
    // Store usually expects `id` instead of `_id` if using the mock interface, 
    // but we should align types. The store likely uses `id` or `_id`. 
    // Let's assume store logic adapts or we map it. 
    // If strict types, we might need to map `_id` to `id`.
    const cartProduct = { ...product, id: product._id }; 

    for (let i = 0; i < quantity; i++) {
        // We pass the product object. The store logic handles adding qty if same item.
        // Wait, the store `addToCart` takes (product). 
        // If we call it multiple times loop, it might add multiple entries or update qty?
        // Store implementation: 
        // addToCart: (product) => { ... if exists set qty+1 ... }
        // So looping is correct for store that increments by 1 per call.
      addToCart(cartProduct);
    }
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleWishlistToggle = () => {
    const wishlistProduct = { ...product, id: product._id };
    if (inWishlist) {
      removeFromWishlist(product._id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(wishlistProduct);
      toast.success("Added to wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm font-ui">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              to="/shop"
              className="text-muted-foreground hover:text-foreground"
            >
              Shop
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-3 py-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-card rounded-lg overflow-hidden border border-border">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors",
                      selectedImage === index
                        ? "border-secondary"
                        : "border-transparent"
                    )}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Artist */}
            {artist && (
            <Link
              to={`/artist/${artist._id}`} // Use _id
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors"
            >
                <img
                  src={artist.avatar || artist.profileImage || "https://ui-avatars.com/api/?name=" + artist.name}
                  alt={artist.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              <span className="font-ui text-sm">{artist.name}</span>
              {product.isVerifiedArtist && (
                <BadgeCheck className="h-4 w-4 text-secondary" />
              )}
            </Link>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl text-foreground">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating || 0)
                        ? "fill-secondary text-secondary"
                        : "text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="font-ui text-sm text-muted-foreground">
                {product.rating || 0} ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-display text-3xl text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="font-ui text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-ui rounded">
                    Save{" "}
                    {Math.round(
                      (1 - product.price / product.originalPrice) * 100
                    )}
                    %
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="font-body text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Ruler className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-ui text-xs text-muted-foreground">Size</p>
                  <p className="font-ui text-sm text-foreground">
                    {product.size.width} × {product.size.height}{" "}
                    {product.size.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Palette className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-ui text-xs text-muted-foreground">
                    Material
                  </p>
                  <p className="font-ui text-sm text-foreground line-clamp-1">
                    {product.material}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-ui text-xs text-muted-foreground">
                    Creation Time
                  </p>
                  <p className="font-ui text-sm text-foreground">
                    {product.paintingDuration || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <BadgeCheck className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-ui text-xs text-muted-foreground">
                    Status
                  </p>
                  <p className="font-ui text-sm text-foreground">
                    {product.inStock ? "Available" : "Sold"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-ui text-sm text-muted-foreground">
                  Quantity:
                </span>
                <div className="flex items-center gap-2 border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-ui">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="gold"
                  size="xl"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="calm"
                  size="xl"
                  onClick={handleWishlistToggle}
                  className={cn(inWishlist && "text-primary")}
                >
                  <Heart
                    className={cn("h-5 w-5", inWishlist && "fill-current")}
                  />
                </Button>
                <Button variant="calm" size="xl">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm font-ui text-muted-foreground">
                <Truck className="h-4 w-4 text-secondary" />
                Free worldwide shipping
              </div>
              <div className="flex items-center gap-2 text-sm font-ui text-muted-foreground">
                <Shield className="h-4 w-4 text-secondary" />
                Authenticity guaranteed
              </div>
            </div>
          </div>
        </div>

        {/* Spiritual Meaning */}
        {product.spiritualMeaning && (
          <div className="mt-16 p-8 bg-card rounded-lg border border-border">
            <h2 className="font-display text-2xl text-foreground mb-4">
              Spiritual Significance
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              {product.spiritualMeaning}
            </p>
          </div>
        )}

        {/* Artist Info */}
        {artist && (
          <div className="mt-16 p-8 bg-card rounded-lg border border-border">
            <div className="flex flex-col md:flex-row gap-6">
              <Link to={`/artist/${artist._id}`} className="flex-shrink-0">
                <img
                  src={artist.avatar || artist.profileImage || "https://ui-avatars.com/api/?name=" + artist.name}
                  alt={artist.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Link
                    to={`/artist/${artist._id}`}
                    className="font-display text-xl text-foreground hover:text-primary transition-colors"
                  >
                    {artist.name}
                  </Link>
                  {artist.isVerified && (
                    <BadgeCheck className="h-5 w-5 text-secondary" />
                  )}
                </div>
                 <p className="font-ui text-sm text-muted-foreground mb-3">
                  {artist.location} • {artist.yearsOfExperience} years of
                  experience
                </p>
                <p className="font-body text-muted-foreground line-clamp-3">
                  {artist.biography}
                </p>
                <Button variant="sacred" size="sm" className="mt-4" asChild>
                  <Link to={`/artist/${artist._id}`}>View Full Profile</Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Related Products: Could be re-enabled later if we fetch them */}
        {/*
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl text-foreground mb-8">
              Related Thangkas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
        */}
      </div>
    </div>
  );
}
