import React from 'react';
import type { NekudotOptions } from '../types';

type Props = {
  value: NekudotOptions;
  onChange: (value: NekudotOptions) => void;
};

export const NekudotSelector: React.FC<Props> = ({ value, onChange }) => {
  const update = (patch: Partial<NekudotOptions>) =>
    onChange({ ...value, ...patch });

  return (
    <section className="rounded-xl bg-white p-4 shadow-md">
      <h2 className="text-base font-semibold text-slate-900">
        Некудот зикуй (נקודות זיכוי)
      </h2>
      <div className="mt-3 space-y-3 text-sm">
        <div>
          <span className="text-xs font-medium text-slate-700">Пол</span>
          <div className="mt-1 inline-flex rounded-lg bg-slate-100 p-1 text-xs">
            <button
              type="button"
              onClick={() => update({ gender: 'male' })}
              className={`px-3 py-1 rounded-md ${
                value.gender === 'male'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              М
            </button>
            <button
              type="button"
              onClick={() => update({ gender: 'female' })}
              className={`px-3 py-1 rounded-md ${
                value.gender === 'female'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              Ж
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <NumberField
            label="Дети, рождённые в этом году"
            value={value.childrenBornThisYear}
            onChange={(childrenBornThisYear) => update({ childrenBornThisYear })}
          />
          <NumberField
            label="Дети 1–2 года"
            value={value.children1to2}
            onChange={(children1to2) => update({ children1to2 })}
          />
          <NumberField
            label="Дети 3 года"
            value={value.children3}
            onChange={(children3) => update({ children3 })}
          />
          <NumberField
            label="Дети 6–17 лет"
            value={value.children6to17}
            onChange={(children6to17) => update({ children6to17 })}
          />
        </div>

        <div className="space-y-1 text-xs">
          <CheckboxField
            label="Родитель-одиночка"
            checked={value.singleParent}
            onChange={(singleParent) => update({ singleParent })}
          />
          <CheckboxField
            label="Супруг/супруга с инвалидностью (слепота, ≥90%)"
            checked={value.disabledSpouse}
            onChange={(disabledSpouse) => update({ disabledSpouse })}
          />
          <CheckboxField
            label="100% инвалидность"
            checked={value.disability100}
            onChange={(disability100) => update({ disability100 })}
          />
        </div>

        <div className="space-y-2 text-xs">
          <span className="font-medium text-slate-700">Армейская служба</span>
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
            value={value.armyService}
            onChange={(e) => update({ armyService: e.target.value as NekudotOptions['armyService'] })}
          >
            <option value="none">Нет</option>
            <option value="full">Полная</option>
            <option value="short">Короткая</option>
          </select>
        </div>

        <div className="space-y-2 text-xs">
          <span className="font-medium text-slate-700">Образование</span>
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
            value={value.degree}
            onChange={(e) => update({ degree: e.target.value as NekudotOptions['degree'] })}
          >
            <option value="none">Нет</option>
            <option value="bachelor">Бакалавр</option>
            <option value="master">Магистр</option>
            <option value="certificate">Диплом / сертификат</option>
          </select>
        </div>

        <div className="space-y-2 text-xs">
          <CheckboxField
            label="Я — новый репатриант (оле хадаш)"
            checked={value.isOleh}
            onChange={(isOleh) => update({ isOleh })}
          />
          {value.isOleh && (
            <div>
              <label className="flex justify-between text-xs font-medium text-slate-700">
                <span>Дата репатриации</span>
              </label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                value={value.aliyahDate ?? ''}
                onChange={(e) => update({ aliyahDate: e.target.value || undefined })}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

const NumberField: React.FC<NumberFieldProps> = ({ label, value, onChange }) => (
  <div>
    <label className="text-[11px] font-medium text-slate-700">{label}</label>
    <input
      type="number"
      min={0}
      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
    />
  </div>
);

type CheckboxFieldProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span>{label}</span>
  </label>
);

