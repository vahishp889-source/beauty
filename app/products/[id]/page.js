'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { formatINR } from '../../utils/price';
import { FiHeart, FiMinus, FiPlus, FiShoppingBag, FiStar, FiArrowLeft } from 'react-icons/fi';

export async function generateStaticParams() {
  const products = ['1', '2', '3', '4', '5', '6'];
  return products.map((id) => ({
    id,
  }));
}

// Mock product for demo
const getProductById = (id) => {
  const products = {
    '1': { _id: '1', name: 'Matte Lipstick Collection', brand: 'MAC', price: 54, description: 'A collection of highly pigmented matte lipsticks with intense color payoff and long-lasting wear. Perfect for creating bold, statement looks.', images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'], shades: [{ name: 'Ruby Woo', color: '#C25B56' }, { name: 'Velvet Teddy', color: '#B76E79' }, { name: 'Lady Danger', color: '#D62828' }], rating: 4.8, reviews: 234, stock: 50, category: 'makeup' },
    '2': { _id: '2', name: "Pro Filt'r Soft Matte Foundation", brand: 'FENTY BEAUTY', price: 39, description: 'A soft matte foundation that provides medium coverage with a natural finish. Suitable for all skin types.', images: ['https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=600'], shades: [{ name: 'Shade 1', color: '#8D5524' }, { name: 'Shade 2', color: '#C68642' }, { name: 'Shade 3', color: '#F5D5C8' }], rating: 4.9, reviews: 567, stock: 120, category: 'makeup' },
    '3': { _id: '3', name: 'Dior Sauvage Elixir', brand: 'DIOR', price: 185, description: 'A powerful and mysterious fragrance with spicy notes and woody undertones. Perfect for evening wear.', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'], shades: [], rating: 4.7, reviews: 189, stock: 30, category: 'fragrance' },
    '4': { _id: '4', name: 'Soft Matte Complete Foundation', brand: 'NARS', price: 49, description: 'A full coverage foundation with a soft matte finish that lasts all day. Buildable coverage.', images: ['https://images.unsplash.com/photo-1515688594390-b649af70d282?w=600'], shades: [{ name: 'Siberia', color: '#F5D5C8' }, { name: 'Shell Beach', color: '#E8B4A6' }], rating: 4.6, reviews: 312, stock: 85, category: 'makeup' },
    '5': { _id: '5', name: 'Naked3 Eyeshadow Palette', brand: 'URBAN DECAY', price: 54, description: 'A palette of neutral pinkish nude shades for creating everyday wearable looks.', images: ['https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600'], shades: [], rating: 4.8, reviews: 445, stock: 65, category: 'makeup' },
    '6': { _id: '6', name: 'Tiffany & Co. Eau de Parfum', brand: 'TIFFANY', price: 125, description: 'A luxurious fragrance with floral and woody notes. Elegant and sophisticated.', images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600'], shades: [], rating: 4.9, reviews: 156, stock: 25, category: 'fragrance' },
  };
  return products[id] || null;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedShade, setSelectedShade] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [mounted, setMounted] = useState(false);

  // SSR-safe store import
  const useStore = require('../../store/useStore').useStore;
  const addToCart = useStore(state => state.addToCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/products/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.product);
        } else {
          const mockProduct = getProductById(params.id);
          setProduct(mockProduct);
        }
      } catch (error) {
        const mockProduct = getProductById(params.id);
        setProduct(mockProduct);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    if (product && product.shades && product.shades.length > 0) {
      setSelectedShade(product.shades[0].name);
    } else {
      setSelectedShade(null);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Safety check: require shade if product has shades
    if (product.shades && product.shades.length > 0 && !selectedShade) {
      toast.error('Please select a shade');
      return;
    }
    
    // Pass null for shade if product doesn't have shades
    const shadeToAdd = product.shades && product.shades.length > 0 ? selectedShade : null;
    
    addToCart(product, shadeToAdd, quantity);
    toast.success(`${product.name} added to cart!`);
    
    // Trigger confetti
    if (typeof window !== 'undefined') {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B76E79', '#E8B4B8', '#D4AF37', '#FFFFFF'],
        });
      }).catch(() => {});
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  if (loading || !mounted) {
    return (
      <main className="min-h-screen bg-primary">
        <Navigation />
        <div className="pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading product...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-primary">
        <Navigation />
        <div className="pt-24 pb-16 px-4 text-center">
          <h1 className="text-3xl font-display font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-white/60 mb-8">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/products')}>Browse Products</Button>
        </div>
      </main>
    );
  }

  const inrPrice = product.price * 83.5;

  return (
    <main className="min-h-screen bg-primary">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
          >
            <FiArrowLeft size={20} />
            Back to Shopping
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="aspect-square overflow-hidden rounded-2xl mb-4 glass-card p-2">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === idx ? 'border-accent' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <p className="text-accent text-sm uppercase tracking-wider mb-2">{product.brand}</p>
                <h1 className="text-4xl font-display font-bold text-white mb-4">{product.name}</h1>
                <p className="text-white/60 text-lg">{product.description}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={18} className={i < Math.floor(product.rating) ? 'text-accent fill-accent' : 'text-white/20'} />
                  ))}
                  <span className="text-white/60 ml-2">{product.rating}</span>
                </div>
                <span className="text-white/40">|</span>
                <span className="text-white/60">{product.reviews} reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-display font-bold text-white">{formatINR(inrPrice)}</span>
                {product.discount && (
                  <span className="text-white/40 line-through">{formatINR(inrPrice * (1 + product.discount / 100))}</span>
                )}
              </div>

              {/* Shade Selection */}
              {product.shades && product.shades.length > 0 && (
                <div>
                  <h3 className="text-white font-medium mb-3">Select Shade</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.shades.map((shade, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedShade(shade.name)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                          selectedShade === shade.name
                            ? 'border-accent bg-accent/10'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <span
                          className="w-6 h-6 rounded-full border border-white/20"
                          style={{ backgroundColor: shade.color }}
                        />
                        <span className="text-white text-sm">{shade.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-white font-medium mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-primary-light rounded-full px-4 py-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-white/60 hover:text-white transition-colors"
                    >
                      <FiMinus size={18} />
                    </button>
                    <span className="text-white font-medium w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-white/60 hover:text-white transition-colors"
                    >
                      <FiPlus size={18} />
                    </button>
                  </div>
                  <span className="text-white/60">{product.stock} in stock</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1"
                  icon={FiShoppingBag}
                >
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="px-6"
                >
                  <FiHeart className={isWishlisted ? 'fill-accent text-accent' : ''} />
                </Button>
              </div>

              {/* Buy Now */}
              <Button
                size="lg"
                onClick={handleBuyNow}
                fullWidth
                className="mt-4"
              >
                Buy Now
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
