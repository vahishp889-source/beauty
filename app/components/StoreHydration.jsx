'use client';

import { useEffect } from 'react';
import { useStore, hydrateStore } from '../store/useStore';

export default function StoreHydration({ children }) {
  useEffect(() => {
    hydrateStore();
  }, []);

  return children;
}
