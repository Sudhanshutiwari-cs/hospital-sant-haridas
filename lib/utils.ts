import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Ensures doctor name is cleanly formatted with exactly one "Dr." prefix.
 * Strips any accidental leading duplicate "Dr.", "dr.", "Dr ", etc.
 */
export function formatDoctorName(name?: string | null, fallback = 'Assigned Doctor'): string {
  if (!name) return fallback;
  const clean = name.replace(/^(dr\.?\s*)+/i, '').trim();
  return clean ? `Dr. ${clean}` : (fallback || name.trim());
}

/**
 * Returns clean doctor name without any "Dr." prefix (useful for initials or raw name).
 */
export function cleanDoctorName(name?: string | null): string {
  if (!name) return '';
  return name.replace(/^(dr\.?\s*)+/i, '').trim();
}
