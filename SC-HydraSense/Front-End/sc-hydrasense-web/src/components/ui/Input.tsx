import React, { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  errorMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, iconLeft, iconRight, errorMessage, className = '', ...props },
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
          
          <input ref={ref} className={styles.inputElement} {...props} />
          
          {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
        </div>
        
        {hasError && <span className={styles.errorMessage}>{errorMessage}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
