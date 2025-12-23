import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useStore();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 2000 ? 0 : 50;
  const total = subtotal + shipping;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setStep('confirmation');
    clearCart();
    toast.success('Order placed successfully!');
  };

  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Your cart is empty</h1>
          <Button variant="gold" asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="font-display text-3xl text-foreground mb-4">Thank You!</h1>
          <p className="font-body text-muted-foreground mb-2">
            Your order has been placed successfully.
          </p>
          <p className="font-ui text-sm text-muted-foreground mb-8">
            Order confirmation has been sent to {shippingData.email}
          </p>
          <div className="space-y-3">
            <Button variant="gold" className="w-full" asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-ui text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="font-display text-3xl text-foreground mt-4">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Progress */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-secondary' : 'text-muted-foreground'}`}>
                <Truck className="h-5 w-5" />
                <span className="font-ui text-sm">Shipping</span>
              </div>
              <div className="h-px flex-1 bg-border" />
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-secondary' : 'text-muted-foreground'}`}>
                <CreditCard className="h-5 w-5" />
                <span className="font-ui text-sm">Payment</span>
              </div>
            </div>

            {/* Shipping Form */}
            {step === 'shipping' && (
              <form onSubmit={handleShippingSubmit} className="space-y-6 animate-fade-in">
                <h2 className="font-display text-xl text-foreground">Shipping Information</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-ui text-sm text-foreground mb-2">First Name</label>
                    <input
                      type="text"
                      value={shippingData.firstName}
                      onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-ui text-sm text-foreground mb-2">Last Name</label>
                    <input
                      type="text"
                      value={shippingData.lastName}
                      onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-ui text-sm text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      value={shippingData.email}
                      onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-ui text-sm text-foreground mb-2">Phone</label>
                    <input
                      type="tel"
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-ui text-sm text-foreground mb-2">Address</label>
                  <input
                    type="text"
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-ui text-sm text-foreground mb-2">City</label>
                    <input
                      type="text"
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-ui text-sm text-foreground mb-2">Country</label>
                    <input
                      type="text"
                      value={shippingData.country}
                      onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                      className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-ui text-sm text-foreground mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={shippingData.postalCode}
                      onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                      className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" variant="gold" size="lg" className="w-full">
                  Continue to Payment
                </Button>
              </form>
            )}

            {/* Payment Form */}
            {step === 'payment' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl text-foreground">Payment Details</h2>
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="font-ui text-sm text-secondary hover:underline"
                  >
                    Edit Shipping
                  </button>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-ui text-sm text-foreground">Shipping to:</p>
                  <p className="font-ui text-sm text-muted-foreground">
                    {shippingData.firstName} {shippingData.lastName}, {shippingData.address}, {shippingData.city}, {shippingData.country}
                  </p>
                </div>

                <div>
                  <label className="block font-ui text-sm text-foreground mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-ui text-sm text-foreground mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-ui text-sm text-foreground mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-ui text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-secondary" />
                  <span className="font-ui">Your payment information is secure and encrypted</span>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
                </Button>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              <h2 className="font-display text-xl text-foreground mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-16 h-20 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm text-foreground line-clamp-2">
                        {item.product.title}
                      </p>
                      <p className="font-ui text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="font-ui text-sm text-foreground mt-1">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex justify-between font-ui text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-ui text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-display text-lg border-t border-border pt-3">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">{formatPrice(total)}</span>
                </div>
              </div>

              {subtotal < 2000 && (
                <p className="mt-4 font-ui text-xs text-muted-foreground text-center">
                  Free shipping on orders over $2,000
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
