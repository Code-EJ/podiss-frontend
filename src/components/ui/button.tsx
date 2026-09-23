import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  children?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
};
const variants = {
  primary: 'bg-red-500 text-white hover:bg-red-600',
  secondary: 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
};

/** Accessible action with a pending state and subtle, preference-aware tactile feedback. @author oEnzoRibas */
export function Button({ loading = false, loadingText = 'Processando...', variant = 'primary',
  disabled, children, className = '', type = 'button', ...props }: ButtonProps) {
  const reduced = useReducedMotion();
  return <motion.button {...props} type={type} disabled={disabled || loading} aria-busy={loading}
    whileHover={reduced || disabled || loading ? undefined : { y: -1 }}
    whileTap={reduced || disabled || loading ? undefined : { scale: 0.98 }}
    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-60 ${loading ? 'bg-amber-100 text-amber-900' : variants[variant]} ${className}`}>
    {loading && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none" />}
    {loading ? loadingText : children}
  </motion.button>;
}
