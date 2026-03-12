import React, { useState } from 'react';

type Props = {
  children: React.ReactNode;
  label?: string;
};

export const AdvancedOptionsToggle: React.FC<Props> = ({ children, label = 'Расширенные опции' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="button-toggle w-full justify-center"
      >
        {isOpen ? '− ' : '+ '}
        {isOpen ? 'Скрыть ' : 'Показать '}
        {label}
      </button>
      {isOpen && <div className="mt-4 space-y-4">{children}</div>}
    </div>
  );
};
