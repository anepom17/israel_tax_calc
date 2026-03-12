import React from 'react';
import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: string;
  error?: string;
  required?: boolean;
};

export const FormInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, helper, error, required, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className={`form-label ${required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}`}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`form-input ${error ? 'border-red-500 focus:ring-red-100' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        {helper && !error && <p className="form-helper">{helper}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
