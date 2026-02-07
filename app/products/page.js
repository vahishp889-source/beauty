'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/Navigation';
import Button from '../components/ui/Button';
import { ProductCard } from '../components/ui/Card';
import { FiFilter, FiGrid, FiList, FiChevronDown, FiX, FiSearch } from 'react-icons/fi';

const allProducts = [
  { _id: '1', name: 'Matte Lipstick Collection', brand: 'MAC', price: 54, rating: 4.8, images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'], shades: [{ color: '#C25B56', name: 'Ruby Woo' }], category: 'makeup', isNew: true },
  { _id: '2', name: "Pro Filt'r Soft Matte Foundation", brand: 'FENTY BEAUTY', price: 39, rating: 4.9, images: ['https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=600'], shades: [{ color: '#8D5524' }], category: 'makeup' },
  { _id: '3', name: 'Dior Sauvage Elixir', brand: 'DIOR', price: 185, rating: 4.7, images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'], shades: [], category: 'fragrance', discount: 15 },
  { _id: '4', name: 'Soft Matte Complete Foundation', brand: 'NARS', price: 49, rating: 4.6, images: ['https://images.unsplash.com/photo-1515688594390-b649af70d282?w=600'], shades: [{ color: '#F5D5C8' }], category: 'makeup' },
  { _id: '5', name: 'Naked3 Eyeshadow Palette', brand: 'URBAN DECAY', price: 54, rating: 4.8, images: ['https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600'], shades: [], category: 'makeup' },
  { _id: '6', name: 'Tiffany & Co. Eau de Parfum', brand: 'TIFFANY', price: 125, rating: 4.9, images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600'], shades: [], category: 'fragrance', isNew: true },
  { _id: '7', name: 'Advanced Night Repair Serum', brand: 'ESTÉE LAUDER', price: 95, rating: 4.7, images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'], shades: [], category: 'skincare' },
  { _id: '8', name: 'Black Opium Eau de Parfum', brand: 'YSL', price: 130, rating: 4.8, images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'], shades: [], category: 'fragrance' },
];

const categories = [
  { id: 'all', name: 'All' },
  { id: 'makeup', name: 'Makeup' },
  { id: 'skincare', name: 'Skincare' },
  { id: 'fragrance', name: 'Fragrance' },
];

const brands = ['MAC', 'FENTY BEAUTY', 'DIOR', 'NARS', 'URBAN DECAY', 'TIFFANY', 'ESTÉE LAUDER', 'YSL'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simulate API call
    setTimeout(() => {
      setProducts(allProducts);
      setLoading(false);
    }, 500);
  }, []);

  const handleQuickAdd = (product) => {
    console.log('Quick add:', product);
  };

  const handleWishlist = (productId) => {
    console.log('Add to wishlist:', productId);
  };

  const handleBrandToggle = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
    }

    setProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedBrands, sortBy, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setSortBy('featured');
    setSearchQuery('');
    setProducts(allProducts);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-primary">
        <Navigation />
        <div className="pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading products...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-primary">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-2">Shop All Products</h1>
          <p className="text-white/60">Discover our luxury collection of beauty products</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-6 py-3 bg-primary-light rounded-xl text-white"
          >
            <FiFilter size={20} />
            Filters
          </motion.button>

          {/* Sidebar Filters */}
          <AnimatePresence>
            {(showFilters || mounted) && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="hidden lg:block w-64 flex-shrink-0"
              >
                <div className="glass-card p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-lg font-semibold text-white">Filters</h3>
                    <button onClick={clearFilters} className="text-white/40 hover:text-white text-sm">
                      Clear All
                    </button>
                  </div>

                  {/* Categories */}
                  <div className="mb-8">
                    <h4 className="text-white/60 text-sm uppercase tracking-wider mb-4">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            selectedCategory === cat.id
                              ? 'bg-accent text-white'
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brands */}
                  <div>
                    <h4 className="text-white/60 text-sm uppercase tracking-wider mb-4">Brands</h4>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <label key={brand} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                            className="w-4 h-4 rounded border-white/20 bg-primary-light text-accent focus:ring-accent"
                          />
                          <span className="text-white/60">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
            >
              <p className="text-white/60">
                Showing {products.length} products
              </p>

              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden sm:block">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-primary-light border border-white/10 rounded-full text-white text-sm w-64 focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-2 bg-primary-light border border-white/10 rounded-full text-white text-sm pr-10 focus:outline-none focus:border-accent cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={16} />
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-accent text-white">
                    <FiGrid size={20} />
                  </button>
                  <button className="p-2 rounded-lg bg-primary-light text-white/40 hover:text-white">
                    <FiList size={20} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card p-4 animate-pulse">
                    <div className="aspect-square bg-white/10 rounded-xl mb-4" />
                    <div className="h-4 bg-white/10 rounded w-1/4 mb-2" />
                    <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-white/10 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard
                        product={product}
                        onQuickAdd={handleQuickAdd}
                        onWishlist={handleWishlist}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {products.length === 0 && !loading && (
              <div className="text-center py-12">
                <FiSearch size={48} className="text-white/30 mx-auto mb-4" />
                <p className="text-white/60">No products found matching your criteria</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
