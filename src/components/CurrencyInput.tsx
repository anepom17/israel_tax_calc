import React from 'react';
import type { InputHTMLAttributes } from 'react';
import { formatShekel } from '../utils/format';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  showValue?: boolean;
};

export const CurrencyInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, helper, error, required, showValue = true, value, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className={`form-label ${required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}`}>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="number"
            value={value || ''}
            className={`form-input text-right ${error ? 'border-red-500 focus:ring-red-100' : ''} ${className}`}
            {...props}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            ₪
          </span>
        </div>
        {showValue && value && (
          <p className="text-right text-xs text-slate-500">{formatShekel(Number(value))}</p>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}
        {helper && !error && <p className="form-helper">{helper}</p>}
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
