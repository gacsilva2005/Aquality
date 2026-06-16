import React, { SelectHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  iconLeft?: React.ReactNode;
  errorMessage?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, iconLeft, errorMessage, className = '', children, ...props },
    ref
  ) => {
    const hasError = !!errorMessage;
    const wrapperClass = `${styles.inputWrapper} ${
      hasError ? styles.hasError : ''
    } ${className}`.trim();

    return (
      <div className={styles.container}>
        {label && <label className={styles.label}>{label}</label>}
        
        <div className={wrapperClass}>
          {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
          
          <select ref={ref} className={styles.inputElement} {...props}>
            {children}
          </select>
        </div>
        
        {hasError && <span className={styles.errorMessage}>{errorMessage}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
