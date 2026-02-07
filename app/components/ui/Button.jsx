'use client';

import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'relative overflow-hidden inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-300 ease-out';
  
  const variants = {
    primary: 'bg-rose-gradient text-white hover:shadow-glow hover:-translate-y-1 active:scale-95',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-white hover:shadow-glow',
    ghost: 'text-white hover:bg-white/10',
    glass: 'bg-glass-gradient backdrop-blur-md border border-white/20 text-white hover:bg-white/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={20} />}
      {children}
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
}
