'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiHeart, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Card({ children, className = '', hover = false, glass = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      className={`${glass ? 'glass-card' : 'bg-primary-light'} transition-all duration-500 ease-out ${hover ? 'hover:shadow-glow-lg cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ProductCard({ product, onQuickAdd, onWishlist }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [adding, setAdding] = useState(false);

  // Import store at module level (works with SSR safe guards)
  const useStore = require('../../store/useStore').useStore;
  const { addToCart } = useStore();

  useEffect(() => {
    setMounted(true);
    setIsWishlisted(!!product.isWishlisted);
  }, [product.isWishlisted]);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (adding) return;
    setAdding(true);

    try {
      // Determine shade - use first shade if available, otherwise null
      const shade = (product.shades && product.shades.length > 0) 
        ? product.shades[0].name 
        : null;
      
      addToCart(product, shade, 1);
      toast.success(`${product.name} added to cart!`);
      onQuickAdd?.(product);
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
    }
    
    setAdding(false);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success('Added to wishlist!');
    } else {
      toast.success('Removed from wishlist');
    }
    onWishlist?.(product._id);
  };

  if (!mounted) {
    return (
      <div className="product-card group relative glass-card p-4">
        <div className="aspect-square overflow-hidden rounded-xl mb-4 bg-white/5" />
        <div className="space-y-2">
          <div className="h-3 bg-white/10 rounded w-1/4" />
          <div className="h-5 bg-white/10 rounded w-3/4" />
          <div className="h-4 bg-white/10 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="product-card group relative"
    >
      {/* Badge */}
      {product.isNew && <span className="absolute top-4 left-4 z-20 badge">New</span>}
      {product.discount > 0 && <span className="absolute top-4 left-4 z-20 badge bg-crimson">-{product.discount}%</span>}

      {/* Wishlist Button */}
      <button onClick={handleWishlist} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-primary/80 text-white/60 hover:text-accent hover:bg-primary transition-all">
        <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isWishlisted ? '#B76E79' : 'none'} stroke="currentColor" className="w-5 h-5" whileTap={{ scale: 0.8 }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </motion.svg>
      </button>

      {/* Image */}
      <a href={`/products/${product._id}`} className="block relative aspect-square overflow-hidden rounded-xl mb-4">
        <motion.img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Add Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleQuickAdd}
          disabled={adding}
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white text-primary rounded-full font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 ${adding ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {adding ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <FiPlus size={16} />
              Quick Add
            </>
          )}
        </motion.button>
      </a>

      {/* Info */}
      <div className="space-y-2">
        <p className="text-xs text-accent uppercase tracking-wider">{product.brand}</p>
        <a href={`/products/${product._id}`}>
          <h3 className="font-display text-lg text-white group-hover:text-accent transition-colors line-clamp-1">{product.name}</h3>
        </a>
        {product.shades && product.shades.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {product.shades.slice(0, 4).map((shade, i) => (
                <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: shade.color }} title={shade.name} />
              ))}
            </div>
            {product.shades.length > 4 && <span className="text-xs text-white/40">+{product.shades.length - 4}</span>}
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className="price-tag">${product.price.toFixed(2)}</p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-accent' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
