'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiSearch, FiHeart, FiShoppingBag, FiUser, FiX, FiBell, FiSettings, FiLogOut } from 'react-icons/fi';
import { useMediaQuery } from '../hooks/useMediaQuery';

const navLinks = [
  { href: '/', label: 'Home', icon: FiHome },
  { href: '/products', label: 'Shop', icon: FiSearch },
  { href: '/wishlist', label: 'Wishlist', icon: FiHeart },
  { href: '/cart', label: 'Cart', icon: FiShoppingBag },
  { href: '/login', label: 'Profile', icon: FiUser },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setMounted(true);
    
    // Check scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check if user is admin
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setIsAdmin(user.role === 'admin');
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    // Get cart count from localStorage
    try {
      const cartData = localStorage.getItem('beauty-store');
      if (cartData) {
        const cart = JSON.parse(cartData);
        if (cart.state && cart.state.cart) {
          const count = cart.state.cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
          setCartCount(count);
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserMenuOpen(false);
    window.location.href = '/';
  };

  if (!mounted) {
    // Return placeholder during SSR
    return <div className="h-20" />;
  }

  return (
    <>
      {/* Desktop Top Navigation */}
      {!isMobile && (
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-primary/95 backdrop-blur-md shadow-soft' : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <motion.span
                  className="text-3xl font-display font-bold text-white"
                  whileHover={{ scale: 1.05 }}
                >
                  BEAUTY
                </motion.span>
              </Link>

              {/* Desktop Links */}
              <div className="hidden lg:flex items-center gap-8">
                {['Makeup', 'Skincare', 'Fragrance', 'Brands'].map((item) => (
                  <Link
                    key={item}
                    href={`/products?category=${item.toLowerCase()}`}
                    className="nav-link text-sm uppercase tracking-wider"
                  >
                    {item}
                  </Link>
                ))}
                {isAdmin && (
                  <Link href="/admin" className="nav-link text-sm uppercase tracking-wider text-accent">
                    Admin
                  </Link>
                )}
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-white/70 hover:text-white transition-colors">
                  <FiBell size={20} />
                </button>

                {/* Cart */}
                <Link href="/cart" className="relative p-2 text-white/70 hover:text-white transition-colors">
                  <FiShoppingBag size={20} />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-xs flex items-center justify-center text-white"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 text-white/70 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <FiUser size={18} className="text-accent" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 glass-card p-2"
                      >
                        <Link href="/profile" className="flex items-center gap-2 p-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                          <FiUser size={18} />
                          My Profile
                        </Link>
                        <Link href="/profile?tab=orders" className="flex items-center gap-2 p-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                          <FiShoppingBag size={18} />
                          My Orders
                        </Link>
                        <Link href="/profile?tab=wishlist" className="flex items-center gap-2 p-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                          <FiHeart size={18} />
                          Wishlist
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" className="flex items-center gap-2 p-3 text-accent hover:bg-white/5 rounded-lg transition-colors">
                            <FiSettings size={18} />
                            Admin Panel
                          </Link>
                        )}
                        <hr className="my-2 border-white/10" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full p-3 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <FiLogOut size={18} />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.nav>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && mounted && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
        >
          <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = typeof window !== 'undefined' && window.location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex flex-col items-center gap-1 p-2"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`${isActive ? 'text-accent' : 'text-white/40'}`}
                  >
                    <Icon size={22} />
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 w-1 h-1 bg-accent rounded-full"
                    />
                  )}
                </Link>
              );
            })}
            {/* Admin Link for Mobile */}
            {isAdmin && (
              <Link href="/admin" className="flex flex-col items-center gap-1 p-2">
                <motion.div className="text-accent">
                  <FiSettings size={22} />
                </motion.div>
              </Link>
            )}
          </div>
        </motion.nav>
      )}

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-primary-light p-6"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display font-bold text-white">Menu</h2>
                <button onClick={() => setMobileMenuOpen(false)} className="text-white/40 hover:text-white">
                  <FiX size={24} />
                </button>
              </div>
              <div className="space-y-4">
                {['Makeup', 'Skincare', 'Fragrance', 'Brands', 'New Arrivals', 'Sale'].map((item) => (
                  <Link
                    key={item}
                    href={`/products?category=${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xl font-display text-white/70 hover:text-white transition-colors py-2"
                  >
                    {item}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xl font-display text-accent py-2"
                  >
                    Admin Panel
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed nav */}
      <div className={isMobile ? 'h-24' : 'h-20'} />
    </>
  );
}
