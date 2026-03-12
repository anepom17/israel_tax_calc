import React from 'react';

export type TaxCategory = 'income' | 'bitouach' | 'vat' | 'corporate';

type Props = {
  category: TaxCategory;
  amount: string;
  className?: string;
};

const categoryConfig: Record<TaxCategory, { label: string; class: string }> = {
  income: { label: 'Подоходный налог', class: 'tax-badge-income' },
  bitouach: { label: 'Битуах Леуми', class: 'tax-badge-bitouach' },
  vat: { label: 'НДС', class: 'tax-badge-vat' },
  corporate: { label: 'Корпоративный налог', class: 'tax-badge-corporate' },
};

export const TaxCategoryBadge: React.FC<Props> = ({ category, amount, className = '' }) => {
  const config = categoryConfig[category];

  return (
    <div className={`flex items-center justify-between gap-2 rounded-lg p-2 ${config.class} ${className}`}>
      <span className="text-xs font-medium">{config.label}</span>
      <span className="font-semibold">{amount}</span>
    </div>
  );
};
