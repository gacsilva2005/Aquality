import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'logout';
  loading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  loading = false, 
  disabled, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseClass = styles.btnBase;
  const variantClass = styles[`btn${variant.charAt(0).toUpperCase() + variant.slice(1)}`];
  const combinedClass = `${baseClass} ${variantClass} ${className}`.trim();

  return (
    <button 
      className={combinedClass} 
      disabled={disabled || loading} 
      {...props}
    >
      {loading ? (
        <span className={styles.loader}></span>
      ) : (
        children
      )}
    </button>
  );
}
