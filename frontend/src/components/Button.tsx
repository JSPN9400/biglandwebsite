import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from '@/lib/clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  children: ReactNode;
}

export default function Button({ variant = 'primary', className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium text-sm px-7 py-2.5 rounded-full',
        'min-h-11 min-w-11 transition-all duration-200 border-[1.5px]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
        variant === 'primary' &&
          'bg-accent border-accent text-white hover:bg-accent-hover hover:border-accent-hover hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(184,149,58,0.2)] active:scale-[0.97]',
        variant === 'outline' &&
          'bg-transparent border-border text-text hover:border-accent hover:bg-accent-soft hover:-translate-y-px',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
