import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart, getCartTotal, clearCart } = useStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/50 z-50 animate-fade-in"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-elevated animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-secondary" />
              <h2 className="font-display text-xl text-foreground">Your Cart</h2>
              <span className="px-2 py-0.5 bg-muted text-xs font-ui text-muted-foreground rounded-full">
                {cart.length} items
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg text-foreground mb-2">Your cart is empty</h3>
                <p className="font-ui text-sm text-muted-foreground mb-6">
                  Discover sacred Thangka art and add pieces to your collection
                </p>
                <Button variant="gold" onClick={() => setCartOpen(false)} asChild>
                  <Link to="/shop">Browse Collection</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 bg-card rounded-lg border border-border"
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${item.product.id}`}
                      onClick={() => setCartOpen(false)}
                      className="w-20 h-24 flex-shrink-0 rounded overflow-hidden"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product.id}`}
                        onClick={() => setCartOpen(false)}
                        className="font-display text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.product.title}
                      </Link>
                      <p className="text-xs font-ui text-muted-foreground mt-1">
                        by {item.product.artistName}
                      </p>
                      <p className="font-display text-base text-foreground mt-2">
                        {formatPrice(item.product.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-ui text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {cart.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive w-full"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <span className="font-ui text-muted-foreground">Subtotal</span>
                <span className="font-display text-xl text-foreground">
                  {formatPrice(getCartTotal())}
                </span>
              </div>
              <p className="text-xs font-ui text-muted-foreground mb-4">
                Shipping and taxes calculated at checkout
              </p>
              <Button variant="gold" size="lg" className="w-full" asChild>
                <Link to="/checkout" onClick={() => setCartOpen(false)}>
                  Proceed to Checkout
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
