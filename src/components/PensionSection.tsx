import React from 'react';
import type {
  DisabilityInsuranceOptions,
  KerenOptions,
  PensionOptions,
} from '../types';
import { getMinMandatoryPensionYearly } from '../calculators/pensionCalc';
import { PENSION_SELF_EMPLOYED, KEREN_HISHTALMUT } from '../constants/pension';
import { INCOME_TAX_BRACKETS } from '../constants/taxBrackets';
import { formatShekel } from '../utils/format';
import { FormSection } from './FormSection';

type Value = {
  pension: PensionOptions;
  keren: KerenOptions;
  disabilityInsurance: DisabilityInsuranceOptions;
};

type Props = {
  value: Value;
  onChange: (value: Value) => void;
  /** Годовой доход (оборот − расходы) для расчёта лимитов и кнопок */
  grossIncomeYearly?: number;
};

const MONTHLY_TIER1 = PENSION_SELF_EMPLOYED.mandatory.tier1.upTo;
const MONTHLY_TIER2 = PENSION_SELF_EMPLOYED.mandatory.tier2.upTo;
const NIKUY_PERCENT = PENSION_SELF_EMPLOYED.taxBenefits.nikuy * 100;
const ZIKUY_PERCENT = PENSION_SELF_EMPLOYED.taxBenefits.zikuy * 100;
const ZIKUY_RETURN_PERCENT = PENSION_SELF_EMPLOYED.taxBenefits.zikuyReturnRate * 100;
const INCOME_CAP = PENSION_SELF_EMPLOYED.incomeCap;
const KEREN_DEDUCT_PERCENT = KEREN_HISHTALMUT.deductionRate * 100;
const KEREN_MAX_DEDUCT = KEREN_HISHTALMUT.maxDeduction;
const PENSION_MAX_PERCENT = 16.5;
const KEREN_MAX_PERCENT = 7;
const DISABILITY_MAX_PERCENT = 3.5;

export const PensionSection: React.FC<Props> = ({ value, onChange, grossIncomeYearly = 0 }) => {
  const update = (patch: Partial<Value>) => onChange({ ...value, ...patch });
  const gross = Math.max(0, grossIncomeYearly);
  const minMandatoryYearly = gross > 0 ? getMinMandatoryPensionYearly(gross) : 0;
  const pensionMaxAmount = gross * (PENSION_MAX_PERCENT / 100);
  const kerenMaxAmount = gross * (KEREN_MAX_PERCENT / 100);
  const disabilityMaxAmount = gross * (DISABILITY_MAX_PERCENT / 100);

  const getKerenTaxSaving = (amountYearly: number) => {
    if (gross <= 0 || amountYearly <= 0) return null;

    // Сумма, которая реально даёт вычет по закону (ницуй)
    const maxKerenNikuyByLaw = Math.min(
      gross * KEREN_HISHTALMUT.deductionRate,
      KEREN_HISHTALMUT.maxDeduction,
    );
    const deductible = Math.min(amountYearly, maxKerenNikuyByLaw);
    if (deductible <= 0) return null;

    // Определяем предельную налоговую ставку по годовому доходу
    const incomeBracket =
      INCOME_TAX_BRACKETS.find(
        (b) => gross >= b.min && gross <= b.max,
      ) ?? INCOME_TAX_BRACKETS[INCOME_TAX_BRACKETS.length - 1];

    const rate = incomeBracket?.rate ?? 0.47;
    const saving = deductible * rate;

    return { saving, rate };
  };

  const kerenTaxSaving =
    value.keren.enabled && value.keren.amountYearly > 0
      ? getKerenTaxSaving(value.keren.amountYearly)
      : null;

  const setPensionToMandatory = () => {
    if (gross <= 0) return;
    update({
      pension: { enabled: true, amountYearly: minMandatoryYearly },
    });
  };

  const setKerenToOptimal = () => {
    if (gross <= 0) return;
    const optimalAmount = Math.min(
      gross * KEREN_HISHTALMUT.deductionRate,
      KEREN_HISHTALMUT.maxDeduction,
    );
    update({
      keren: { enabled: true, amountYearly: optimalAmount },
    });
  };

  const clampAmount = (v: number, max: number) => Math.max(0, Number.isFinite(max) ? Math.min(v, max) : v);

  return (
    <FormSection
      title="Пенсия и фонды"
      description="Пенсионные отчисления и страховки"
      variant="advanced"
    >
      <div className="space-y-3 text-sm">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="min-w-0 flex-1">
              <AmountInput
                label="Пенсионные отчисления"
                enabled={value.pension.enabled}
                amountYearly={value.pension.amountYearly}
                maxAmount={pensionMaxAmount}
                onEnabledChange={(enabled) =>
                  update({ pension: { ...value.pension, enabled } })
                }
                onAmountChange={(amountYearly) =>
                  update({
                    pension: {
                      ...value.pension,
                      amountYearly: clampAmount(amountYearly, pensionMaxAmount),
                    },
                  })
                }
              />
            </div>
            <button
              type="button"
              onClick={setPensionToMandatory}
              disabled={gross <= 0}
              className="shrink-0 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Обязательная сумма
            </button>
          </div>
          <div className="mt-1.5 space-y-1 rounded bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600">
            <p>
              <strong>Обязательный минимум по закону:</strong> процент считается от вашего
              дохода по ступеням: с дохода до {formatShekel(MONTHLY_TIER1)} ₪/мес —{' '}
              {PENSION_SELF_EMPLOYED.mandatory.tier1.rate * 100}%, с дохода {formatShekel(MONTHLY_TIER1)}–{formatShekel(MONTHLY_TIER2)} ₪/мес —{' '}
              {PENSION_SELF_EMPLOYED.mandatory.tier2.rate * 100}%.
            </p>
            {gross > 0 && (
              <p>
                При вашем доходе минимум в год: <strong>{formatShekel(minMandatoryYearly)} ₪</strong>.
              </p>
            )}
            <p>
              <strong>Учитываются в налогообложении:</strong> ницуй до {NIKUY_PERCENT}% дохода (лимит дохода {formatShekel(INCOME_CAP)} ₪/год), зикуй {ZIKUY_PERCENT}%×{ZIKUY_RETURN_PERCENT}%. Выгодно отчислять до этих лимитов.
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="min-w-0 flex-1">
              <AmountInput
                label="Керен иштальмут"
                enabled={value.keren.enabled}
                amountYearly={value.keren.amountYearly}
                maxAmount={kerenMaxAmount}
                onEnabledChange={(enabled) =>
                  update({ keren: { ...value.keren, enabled } })
                }
                onAmountChange={(amountYearly) =>
                  update({
                    keren: {
                      ...value.keren,
                      amountYearly: clampAmount(amountYearly, kerenMaxAmount),
                    },
                  })
                }
              />
            </div>
            <button
              type="button"
              onClick={setKerenToOptimal}
              disabled={gross <= 0}
              className="shrink-0 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Оптимальная сумма
            </button>
          </div>
          <div className="mt-1.5 rounded bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600">
            <p>
              <strong>Учитывается в налогообложении:</strong> до {KEREN_DEDUCT_PERCENT}% дохода, макс. вычет {formatShekel(KEREN_MAX_DEDUCT)} ₪/год.
            </p>
            {kerenTaxSaving && (
              <p className="mt-1">
                При текущем взносе экономия по подоходному налогу примерно{' '}
                <strong>{formatShekel(kerenTaxSaving.saving)} ₪/год</strong>{' '}
                (по ставке {Math.round(kerenTaxSaving.rate * 100)}% по вашей налоговой ступени).
              </p>
            )}
          </div>
        </div>
        <AmountInput
          label="Страховка от потери трудоспособности"
          enabled={value.disabilityInsurance.enabled}
          amountYearly={value.disabilityInsurance.amountYearly}
          maxAmount={disabilityMaxAmount}
          onEnabledChange={(enabled) =>
            update({ disabilityInsurance: { ...value.disabilityInsurance, enabled } })
          }
          onAmountChange={(amountYearly) =>
            update({
              disabilityInsurance: {
                ...value.disabilityInsurance,
                amountYearly: clampAmount(amountYearly, disabilityMaxAmount),
              },
            })
          }
        />
      </div>
    </FormSection>
  );
};

type AmountInputProps = {
  label: string;
  enabled: boolean;
  amountYearly: number;
  maxAmount: number;
  onEnabledChange: (enabled: boolean) => void;
  onAmountChange: (amountYearly: number) => void;
};

const AmountInput: React.FC<AmountInputProps> = ({
  label,
  enabled,
  amountYearly,
  maxAmount,
  onEnabledChange,
  onAmountChange,
}) => {
  const [raw, setRaw] = React.useState('');
  const displayValue =
    raw !== '' ? raw : (enabled && amountYearly > 0 ? String(Number(amountYearly.toFixed(2))) : '');

  const handleBlur = () => {
    if (raw === '') return;
    const n = parseFloat(raw.replace(/\s/g, '').replace(',', '.')) || 0;
    onAmountChange(n);
    setRaw('');
  };

  return (
    <div className="space-y-1 text-xs">
      <label className="flex items-center justify-between gap-2">
        <span className="font-medium text-slate-700">{label}</span>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
        />
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={Number.isFinite(maxAmount) && maxAmount > 0 ? maxAmount : undefined}
          step="any"
          disabled={!enabled}
          className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm tabular-nums disabled:bg-slate-100"
          placeholder={enabled ? '0' : ''}
          value={displayValue}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={handleBlur}
        />
        <span className="shrink-0 text-slate-500">₪/год</span>
      </div>
      {enabled && Number.isFinite(maxAmount) && maxAmount > 0 && (
        <p className="text-[11px] text-slate-500">
          макс. {formatShekel(maxAmount)} ₪/год
        </p>
      )}
    </div>
  );
};
