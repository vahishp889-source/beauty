'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  className = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <motion.label
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none font-body text-sm"
          animate={{
            y: isFocused || value ? -30 : 0,
            scale: isFocused || value ? 0.85 : 1,
            color: isFocused ? '#B76E79' : 'rgba(255,255,255,0.4)',
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            size={20}
          />
        )}
        <motion.input
          type={type}
          placeholder={!label ? placeholder : ''}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-4 bg-primary-light border rounded-xl text-white placeholder-white/40
            focus:outline-none transition-all duration-300
            ${Icon ? 'pl-12' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-white/20 focus:border-accent focus:ring-2 focus:ring-accent/20'
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
