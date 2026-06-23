'use client';
import { useEffect } from 'react';

export function NormalCursor() {
  useEffect(() => {
    document.documentElement.classList.add('is-client');
    return () => document.documentElement.classList.remove('is-client');
  }, []);
  return null;
}
