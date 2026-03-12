import React, { useState } from 'react';
import type { ReactNode } from 'react';

export type FormSectionVariant = 'basic' | 'deductions' | 'advanced' | 'results' | 'default';

type Props = {
  title: string;
  description?: string;
  variant?: FormSectionVariant;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
};

const variantClasses: Record<FormSectionVariant, string> = {
  basic: 'form-section-basic',
  deductions: 'form-section-deductions',
  advanced: 'form-section-advanced',
  results: 'form-section-results',
  default: 'form-section',
};

export const FormSection: React.FC<Props> = ({
  title,
  description,
  variant = 'default',
  collapsible = false,
  defaultOpen = true,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const variantClass = variantClasses[variant];

  if (collapsible) {
    return (
      <details open={isOpen} onToggle={(e) => setIsOpen(e.currentTarget.open)}>
        <summary className={`${variantClass} cursor-pointer select-none ${className}`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="section-header">{title}</h2>
              {description && <p className="mt-1 text-xs text-slate-600">{description}</p>}
            </div>
            <span className="text-slate-400 transition-transform group-open:rotate-180">
              ▼
            </span>
          </div>
        </summary>
        <div className="mt-3 space-y-3">{children}</div>
      </details>
    );
  }

  return (
    <section className={`${variantClass} ${className}`}>
      <h2 className="section-header">{title}</h2>
      {description && <p className="mt-1 text-xs text-slate-600">{description}</p>}
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
};
