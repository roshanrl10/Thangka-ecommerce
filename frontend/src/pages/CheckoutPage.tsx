import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import api from '@/lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); 

function CheckoutForm({ shippingData, total, onSuccess }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/checkout?status=success',
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message ?? "An unexpected error occurred.");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
        setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-foreground">Payment Details</h2>
        </div>
        
        <PaymentElement />
        
        {message && <div className="text-red-500 text-sm">{message}</div>}

        <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full"
            disabled={isProcessing || !stripe}
        >
            {isProcessing ? 'Processing...' : `Pay $${total}`}
        </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, user } = useStore();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [clientSecret, setClientSecret] = useState('');
  
  const [shippingData, setShippingData] = useState({
    firstName: '', lastName: '', email: user?.email || '', phone: '',
    address: '', city: '', country: '', postalCode: '',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 2000 ? 0 : 50;
  const total = subtotal + shipping;

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast.error('Please login to continue');
        navigate('/auth');
        return;
    }

    try {
        // Create Payment Intent
        const { data } = await api.post('/payment/create-payment-intent', {
            amount: total,
            currency: 'usd' // Using USD for this demo as Stripe default test
        });
        setClientSecret(data.clientSecret);
        setStep('payment');
    } catch (error) {
        console.error('Payment intent failed', error);
        toast.error('Failed to initialize payment');
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
      try {
        const payload = {
            userId: user?.id,
            items: cart.map(item => ({
              productId: item.product.id,
              quantity: item.quantity
            })),
            shippingAddress: {
              name: `${shippingData.firstName} ${shippingData.lastName}`,
              email: shippingData.email,
              phone: shippingData.phone,
              address: shippingData.address,
              city: shippingData.city,
              postalCode: shippingData.postalCode,
              country: shippingData.country
            },
            totalPrice: total,
            paymentMethod: 'Stripe',
            paymentId: paymentId
        };
  
        await api.post('/order/create', payload);
        
        clearCart();
        setStep('confirmation');
        toast.success('Order placed successfully!');
      } catch (error) {
          console.error('Order creation failed', error);
          toast.error('Payment succeeded but order creation failed. Contact support.');
      }
  };

  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Your cart is empty</h1>
          <Button variant="gold" asChild><Link to="/shop">Continue Shopping</Link></Button>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl text-foreground mb-4">Thank You!</h1>
          <p className="font-body text-muted-foreground mb-8">Your order has been placed successfully.</p>
          <Button variant="gold" className="w-full" asChild><Link to="/shop">Continue Shopping</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Link to="/shop" className="inline-flex items-center gap-2 font-ui text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
          <h1 className="font-display text-3xl text-foreground mt-4">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            
            {/* Steps Indicator */}
            <div className="flex items-center gap-4 mb-8">
               <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-secondary' : 'text-muted-foreground'}`}>
                 <Truck className="h-5 w-5" /> <span className="font-ui text-sm">Shipping</span>
               </div>
               <div className="h-px flex-1 bg-border" />
               <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-secondary' : 'text-muted-foreground'}`}>
                 <CreditCard className="h-5 w-5" /> <span className="font-ui text-sm">Payment</span>
               </div>
            </div>

            {step === 'shipping' ? (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <h2 className="font-display text-xl text-foreground">Shipping Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-2">First Name</label>
                            <input required type="text" value={shippingData.firstName} onChange={e => setShippingData({...shippingData, firstName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">Last Name</label>
                            <input required type="text" value={shippingData.lastName} onChange={e => setShippingData({...shippingData, lastName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm mb-2">Address</label>
                        <input required type="text" value={shippingData.address} onChange={e => setShippingData({...shippingData, address: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm mb-2">City</label>
                            <input required type="text" value={shippingData.city} onChange={e => setShippingData({...shippingData, city: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm mb-2">Country</label>
                            <input required type="text" value={shippingData.country} onChange={e => setShippingData({...shippingData, country: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                         <div>
                            <label className="block text-sm mb-2">Postal Code</label>
                            <input required type="text" value={shippingData.postalCode} onChange={e => setShippingData({...shippingData, postalCode: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                    </div>

                    <Button type="submit" variant="gold" size="lg" className="w-full">Continue to Payment</Button>
                </form>
            ) : (
                <div>
                     {clientSecret && (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <CheckoutForm 
                                shippingData={shippingData} 
                                total={total}
                                onSuccess={handlePaymentSuccess}
                            />
                        </Elements>
                    )}
                </div>
            )}
          </div>

          <div className="lg:col-span-1">
             <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="font-display text-xl text-foreground mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                    {cart.map(item => (
                        <div key={item.product.id} className="flex gap-3">
                            <img src={item.product.images[0]} className="w-16 h-20 rounded object-cover" />
                            <div>
                                <p className="font-display text-sm line-clamp-2">{item.product.title}</p>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                <p className="text-sm font-bold">${item.product.price * item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal}</span></div>
                    <div className="flex justify-between text-sm"><span>Shipping</span><span>${shipping}</span></div>
                    <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span>${total}</span></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
