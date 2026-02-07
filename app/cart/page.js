'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Button from '../components/ui/Button';
import { formatINR } from '../utils/price';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  
  // SSR-safe store import
  const useStore = require('../store/useStore').useStore;
  const cart = useStore(state => state.cart);
  const updateQuantity = useStore(state => state.updateQuantity);
  const removeFromCart = useStore(state => state.removeFromCart);
  const getCartTotal = useStore(state => state.getCartTotal);
  const clearCart = useStore(state => state.clearCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-primary">
        <Navigation />
        <div className="pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading cart...</p>
          </div>
        </div>
      </main>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 5000 ? 0 : 150;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (productId, shade, newQuantity) => {
    updateQuantity(productId, shade, newQuantity);
  };

  const handleRemove = (productId, shade) => {
    removeFromCart(productId, shade);
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-primary">
        <Navigation />
        <div className="pt-24 pb-16 px-4 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-light flex items-center justify-center">
            <FiShoppingBag size={40} className="text-white/30" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-white mb-4">Your bag is empty</h2>
          <p className="text-white/60 mb-8">Looks like you haven't added any products yet.</p>
          <Button size="lg" onClick={() => window.location.href = '/products'}>Start Shopping</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-primary">
      <Navigation />

      <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl font-display font-bold text-white mb-2">Shopping Bag</h1>
            <p className="text-white/60">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your bag</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <AnimatePresence>
                {cart.map((item, index) => (
                  <motion.div
                    key={`${item._id}-${item.selectedShade || 'default'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="cart-item mb-4 relative overflow-hidden glass-card p-4"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs text-accent uppercase tracking-wider">{item.brand}</p>
                            <h3 className="text-white font-medium">{item.name}</h3>
                            {item.selectedShade && (
                              <p className="text-white/40 text-sm">Shade: {item.selectedShade}</p>
                            )}
                          </div>
                          <p className="text-accent font-semibold">{formatINR(item.price * 83.5 * item.quantity)}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.selectedShade, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                            >
                              <span className="text-lg">−</span>
                            </button>
                            <span className="text-white w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.selectedShade, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                            >
                              <span className="text-lg">+</span>
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemove(item._id, item.selectedShade)}
                            className="text-white/40 hover:text-red-400 transition-colors"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {cart.length > 0 && (
                <Button variant="outline" onClick={clearCart} className="mt-4">
                  Clear Cart
                </Button>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:w-96">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 sticky top-24"
              >
                <h3 className="font-display text-lg font-semibold text-white mb-4">Order Summary</h3>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block text-white/60 text-sm mb-2">Coupon Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-4 py-2 bg-primary-light border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    />
                    <Button variant="outline" size="sm">Apply</Button>
                  </div>
                </div>

                {/* Summary Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>GST (8%)</span>
                    <span>{formatINR(tax)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-accent">{formatINR(total)}</span>
                  </div>
                </div>

                {shipping === 0 && (
                  <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-500 text-sm">You've unlocked free shipping!</p>
                  </div>
                )}

                <Button fullWidth size="lg" onClick={() => window.location.href = '/checkout'}>
                  Proceed to Checkout
                </Button>

                <p className="text-white/40 text-xs text-center mt-4">
                  Secure checkout powered by Stripe
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
