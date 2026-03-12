import React from 'react';
import { BusinessType } from '../types';

type Props = {
  value: BusinessType;
  onChange: (value: BusinessType) => void;
};

const businessTypes = [
  {
    value: BusinessType.PATUR,
    label: 'Осек патур',
    hebrewLabel: '(עוסק פטור)',
    description: 'Самозанятый без НДС',
  },
  {
    value: BusinessType.MURSHE,
    label: 'Осек мурше',
    hebrewLabel: '(עוסק מורשה)',
    description: 'Самозанятый с НДС',
  },
  {
    value: BusinessType.HEVRA,
    label: 'Компания',
    hebrewLabel: '(חברה בע״מ)',
    description: 'ООО / Corporation',
  },
];

export const BusinessTypeSelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {businessTypes.map((type) => (
        <button
          key={type.value}
          onClick={() => onChange(type.value)}
          className={`radio-card ${value === type.value ? 'selected' : ''}`}
          type="button"
        >
          <input
            type="radio"
            name="businessType"
            value={type.value}
            checked={value === type.value}
            onChange={() => onChange(type.value)}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-900">{type.label}</span>
              <span className="text-xs text-slate-500">{type.hebrewLabel}</span>
            </div>
            <p className="mt-0.5 text-xs text-slate-600">{type.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
};
