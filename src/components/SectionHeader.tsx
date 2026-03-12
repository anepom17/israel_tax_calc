import React from 'react';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: 'primary' | 'secondary';
};

export const SectionHeader: React.FC<Props> = ({
  title,
  description,
  action,
  variant = 'primary',
}) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className={`${variant === 'primary' ? 'section-header text-lg' : 'section-subheader'}`}>
          {title}
        </h2>
        {description && <p className="mt-1 text-xs text-slate-600">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
