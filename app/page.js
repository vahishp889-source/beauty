'use client';

import { motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Button from './components/ui/Button';
import { ProductCard } from './components/ui/Card';
import { useStore } from './store/useStore';
import toast from 'react-hot-toast';

const featuredProducts = [
  { _id: '1', name: 'Matte Lipstick Collection', brand: 'MAC', price: 54, rating: 4.8, images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'], shades: [{ color: '#C25B56', name: 'Ruby Woo' }, { color: '#B76E79', name: 'Velvet Teddy' }], isNew: true },
  { _id: '2', name: "Pro Filt'r Soft Matte Foundation", brand: 'FENTY BEAUTY', price: 39, rating: 4.9, images: ['https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=600'], shades: [{ color: '#8D5524' }, { color: '#C68642' }], isNew: false },
  { _id: '3', name: 'Dior Sauvage Elixir', brand: 'DIOR', price: 185, rating: 4.7, images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'], shades: [], discount: 15 },
  { _id: '4', name: 'Soft Matte Complete Foundation', brand: 'NARS', price: 49, rating: 4.6, images: ['https://images.unsplash.com/photo-1515688594390-b649af70d282?w=600'], shades: [{ color: '#F5D5C8' }, { color: '#E8B4A6' }], isNew: false },
  { _id: '5', name: 'Naked3 Eyeshadow Palette', brand: 'URBAN DECAY', price: 54, rating: 4.8, images: ['https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600'], shades: [], isNew: false },
  { _id: '6', name: 'Tiffany & Co. Eau de Parfum', brand: 'TIFFANY', price: 125, rating: 4.9, images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600'], shades: [], isNew: true },
];

const brands = [
  { name: 'DIOR', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300' },
  { name: 'CHANEL', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300' },
  { name: 'MAC', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300' },
  { name: 'FENTY BEAUTY', image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=300' },
  { name: 'NARS', image: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=300' },
  { name: 'URBAN DECAY', image: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=300' },
];

const reviews = [
  { name: 'Sarah M.', rating: 5, text: 'Absolutely love this luxury shopping experience! The products are authentic and the delivery was super fast.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { name: 'Emma K.', rating: 5, text: 'Best online beauty store I have ever used. The curated collections are amazing!', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
  { name: 'Olivia L.', rating: 5, text: 'The customer service is exceptional. Helped me find the perfect shade match!', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
];

export default function Home() {
  const { addToCart } = useStore();

  const handleQuickAdd = (product) => {
    const shade = product.shades && product.shades.length > 0 ? product.shades[0].name : null;
    addToCart(product, shade, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (productId) => {
    toast.success('Added to wishlist!');
  };

  return (
    <main className="min-h-screen bg-primary">
      <Navigation />

      <Hero />

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title mb-4">Featured Collection</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Discover our handpicked selection of luxury beauty essentials</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div key={product._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <ProductCard product={product} onQuickAdd={handleQuickAdd} onWishlist={handleWishlist} />
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
            <Button size="lg" variant="outline" onClick={() => window.location.href = '/products'}>View All Products</Button>
          </motion.div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-light/30">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title mb-4">Luxury Brands</h2>
            <p className="text-white/60">Discover the world's most prestigious beauty houses</p>
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((brand, index) => (
              <motion.div key={brand.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05 }} className="glass-card p-4 text-center cursor-pointer">
                <div className="aspect-square overflow-hidden rounded-xl mb-3">
                  <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-display font-bold text-white">{brand.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title mb-4">What Our Clients Say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div key={review.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-white">{review.name}</p>
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-white/60 italic">"{review.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent/20 to-crimson/20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="section-title mb-4">Join the Beauty Club</h2>
            <p className="text-white/60 mb-8">Subscribe for exclusive offers and new arrivals.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-4 bg-primary-light border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-accent" />
              <Button size="lg" onClick={() => toast.success('Subscribed!')}>Subscribe</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-display font-bold text-white mb-4">BEAUTY</h3>
              <p className="text-white/60">Your destination for luxury beauty.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Shop</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="/products" className="hover:text-accent">Makeup</a></li>
                <li><a href="/products?category=skincare" className="hover:text-accent">Skincare</a></li>
                <li><a href="/products?category=fragrance" className="hover:text-accent">Fragrance</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="/contact" className="hover:text-accent">Contact Us</a></li>
                <li><a href="/shipping" className="hover:text-accent">Shipping</a></li>
                <li><a href="/returns" className="hover:text-accent">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="/privacy" className="hover:text-accent">Privacy</a></li>
                <li><a href="/terms" className="hover:text-accent">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/40">
            <p>&copy; 2024 BEAUTY. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
