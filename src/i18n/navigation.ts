import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware replacements for next/link & next/navigation: href takes the
// internal (uk) pathname and renders the localized URL for the active locale.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
