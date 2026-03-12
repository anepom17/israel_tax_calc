import React from 'react';
import type { ReactNode } from 'react';

type Props = {
  label: string;
  value: string | number | ReactNode;
  subValue?: string;
  variant?: 'primary' | 'secondary' | 'highlight';
  className?: string;
};

export const ResultsCard: React.FC<Props> = ({
  label,
  value,
  subValue,
  variant = 'primary',
  className = '',
}) => {
  const variantClass = {
    primary: 'from-blue-50 to-blue-100 border-blue-200',
    secondary: 'from-slate-50 to-slate-100 border-slate-200',
    highlight: 'from-green-50 to-green-100 border-green-200',
  }[variant];

  return (
    <div className={`results-card ${variantClass} ${className}`}>
      <p className="results-card-label">{label}</p>
      <p className="results-card-value">{value}</p>
      {subValue && <p className="mt-1 text-xs text-slate-600">{subValue}</p>}
    </div>
  );
};
