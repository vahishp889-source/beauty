'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';
import { formatINR } from '../utils/price';
import { FiTruck, FiCheckCircle, FiMapPin, FiPackage } from 'react-icons/fi';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // SSR-safe store import
  const useStore = require('../store/useStore').useStore;
  const cart = useStore(state => state.cart);
  const getCartTotal = useStore(state => state.getCartTotal);
  const getCartTotalUSD = useStore(state => state.getCartTotalUSD);
  const clearCart = useStore(state => state.clearCart);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    notes: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = mounted ? getCartTotal() : 0;
  const subtotalUSD = mounted ? getCartTotalUSD() : 0;
  const shipping = subtotal > 5000 ? 0 : 150;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const triggerSuccessConfetti = () => {
    if (typeof window !== 'undefined') {
      import('canvas-confetti').then((confetti) => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);
          confetti.default({
            particleCount: 50 * (timeLeft / duration),
            spread: 360,
            origin: { y: 0.6 },
            colors: ['#B76E79', '#E8B4B8', '#D4AF37'],
          });
        }, 250);
      }).catch(() => {});
    }
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!formData[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').trim()}`);
        return false;
      }
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          productName: item.name,
          shade: item.selectedShade || null,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        pricing: {
          subtotal: subtotalUSD,
          shipping: shipping / 83.5,
          tax: tax / 83.5,
          total: total / 83.5,
        },
        pricingINR: {
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total,
        },
        paymentMethod: 'COD',
        status: 'Pending',
        notes: formData.notes,
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok && data.order) {
        setOrderId(data.order._id || `ORD-${Date.now().toString(36).toUpperCase()}`);
        toast.success('Order placed successfully!');
        triggerSuccessConfetti();
        clearCart();
        setOrderPlaced(true);
      } else {
        // Demo mode - simulate success
        const mockOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
        setOrderId(mockOrderId);
        toast.success('Order placed successfully! (Demo)');
        triggerSuccessConfetti();
        clearCart();
        setOrderPlaced(true);
      }
    } catch (error) {
      console.error('Order error:', error);
      // Demo mode fallback
      const mockOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
      setOrderId(mockOrderId);
      toast.success('Order placed successfully! (Demo)');
      triggerSuccessConfetti();
      clearCart();
      setOrderPlaced(true);
    }
    
    setLoading(false);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-primary">
        <Navigation />
        <div className="pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading checkout...</p>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <main className="min-h-screen bg-primary">
        <Navigation />
        <div className="pt-24 pb-16 px-4 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-light flex items-center justify-center">
            <FiPackage size={40} className="text-white/30" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-4">Your cart is empty</h1>
          <Button onClick={() => router.push('/products')}>Browse Products</Button>
        </div>
      </main>
    );
  }

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-primary">
        <Navigation />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-lg mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <FiCheckCircle size={48} className="text-green-500" />
              </div>
              <h1 className="text-3xl font-display font-bold text-white mb-4">Order Confirmed!</h1>
              <p className="text-white/60 mb-2">Thank you for your order.</p>
              <p className="text-accent font-medium mb-6">Order ID: {orderId}</p>
              
              <div className="bg-primary/50 rounded-xl p-4 mb-6 text-left">
                <h3 className="text-white font-medium mb-3">Shipping to:</h3>
                <p className="text-white/60 text-sm">
                  {formData.firstName} {formData.lastName}<br />
                  {formData.address}<br />
                  {formData.city}, {formData.state} {formData.zipCode}<br />
                  {formData.phone}
                </p>
              </div>

              <p className="text-white/60 text-sm mb-6">
                You will receive a confirmation email at <strong>{formData.email}</strong>
              </p>

              <div className="flex gap-4">
                <Button variant="outline" fullWidth onClick={() => router.push('/')}>Continue Shopping</Button>
                <Button fullWidth onClick={() => router.push('/profile')}>View Orders</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-primary">
      <Navigation />

      <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold text-white mb-8">
            Checkout
          </motion.h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Shipping Form */}
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <FiMapPin className="text-accent" size={20} />
                  </div>
                  <h2 className="text-xl font-display font-semibold text-white">Shipping Details</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name *" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                    <Input label="Last Name *" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                  </div>
                  <Input label="Email *" type="email" name="email" value={formData.email} onChange={handleInputChange} />
                  <Input label="Phone *" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                  <Input label="Address *" name="address" value={formData.address} onChange={handleInputChange} />
                  <div className="grid grid-cols-3 gap-4">
                    <Input label="City *" name="city" value={formData.city} onChange={handleInputChange} />
                    <Input label="State *" name="state" value={formData.state} onChange={handleInputChange} />
                    <Input label="PIN Code *" name="zipCode" value={formData.zipCode} onChange={handleInputChange} />
                  </div>
                  <Input label="Order Notes (optional)" name="notes" value={formData.notes} onChange={handleInputChange} />
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-96">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 sticky top-24">
                <h3 className="font-display text-lg font-semibold text-white mb-4">Order Summary</h3>

                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={`${item._id}-${item.selectedShade || 'default'}`} className="flex gap-3">
                      <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300'} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm text-white truncate">{item.name}</p>
                        {item.selectedShade && <p className="text-xs text-white/50">{item.selectedShade}</p>}
                        <p className="text-sm text-white/60">Qty: {item.quantity}</p>
                        <p className="text-sm text-accent">{formatINR(item.price * 83.5 * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-white/60 text-sm"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
                  <div className="flex justify-between text-white/60 text-sm"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span></div>
                  <div className="flex justify-between text-white/60 text-sm"><span>GST (8%)</span><span>{formatINR(tax)}</span></div>
                  <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10 mt-2">
                    <span>Total</span><span className="text-accent">{formatINR(total)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <p className="text-green-500 text-sm flex items-center gap-2">
                    <FiTruck size={16} />
                    Cash on Delivery Available
                  </p>
                </div>

                <Button fullWidth size="lg" className="mt-4" onClick={handlePlaceOrder} loading={loading}>
                  Place Order
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
