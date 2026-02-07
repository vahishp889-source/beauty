'use client';

import { motion } from 'framer-motion';
import Button from './ui/Button';
import { FiArrowRight } from 'react-icons/fi';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-dark-gradient">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose rounded-full blur-3xl animate-pulse-slow animation-delay-400" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-crimson rounded-full blur-3xl animate-pulse-slow animation-delay-800" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full bg-glass-gradient border border-white/10 text-sm text-white/80 mb-6"
          >
            ✨ Introducing Our New Collection
          </motion.span>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hero-text mb-6"
          >
            Luxury Beauty
            <br />
            <span className="text-transparent bg-clip-text bg-rose-gradient">
              Redefined
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl text-white/60 max-w-2xl mx-auto mb-10"
          >
            Discover the finest selection of premium cosmetics, curated for those who 
            embrace elegance and confidence in every stroke.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="xl"
              fullWidth={false}
              icon={FiArrowRight}
              onClick={() => window.location.href = '/products'}
            >
              Shop Collection
            </Button>
            <Button
              variant="outline"
              size="xl"
              fullWidth={false}
              onClick={() => window.location.href = '/brands'}
            >
              Explore Brands
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Cards */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 hidden lg:flex justify-center gap-8"
        >
          {[
            { brand: 'DIOR', product: 'Sauvage Elixir', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400' },
            { brand: 'CHANEL', product: 'No. 5 Eau de Parfum', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400' },
            { brand: 'MAC', product: 'Matte Lipstick', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400' },
          ].map((item, index) => (
            <motion.div
              key={item.brand}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.2 }}
              whileHover={{ y: -10 }}
              className="glass-card p-4 w-72 cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-xl mb-4">
                <img
                  src={item.image}
                  alt={item.product}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              <p className="text-xs text-accent uppercase tracking-wider">{item.brand}</p>
              <h3 className="font-display text-lg text-white">{item.product}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-3 bg-accent rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
