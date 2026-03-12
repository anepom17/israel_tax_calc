import React, { useMemo, useState } from 'react';
import { BusinessType, type TaxInput } from '../types';
import { formatShekel } from '../utils/format';
import { NekudotSelector } from './NekudotSelector';
import { PensionSection } from './PensionSection';
import { yishuvCities, type YishuvCity } from '../data/yishuvCities';
import { FormSection } from './FormSection';
import { CurrencyInput } from './CurrencyInput';
import { FormInput } from './FormInput';
import { BusinessTypeSelector } from './BusinessTypeSelector';
import { AdvancedOptionsToggle } from './AdvancedOptionsToggle';

type Props = {
  state: TaxInput;
  dispatch: React.Dispatch<any>;
  onOpenYishuvInfo: () => void;
  /** Текущая сумма льготы по месте жительства, ₪ (из расчёта) */
  yishuvCredit: number;
};

export const InputForm: React.FC<Props> = ({
  state,
  dispatch,
  onOpenYishuvInfo,
  yishuvCredit,
}) => {
  const gross = Math.max(0, state.revenue - state.expenses);
  const [cityQuery, setCityQuery] = useState(state.yishuvBenefit.cityName ?? '');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const citySuggestions = useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    if (!q) return [];
    return yishuvCities
      .filter((city) => city.name.toLowerCase().includes(q))
      .slice(0, 10);
  }, [cityQuery]);

  const handleSelectCity = (city: YishuvCity) => {
    setCityQuery(city.name);
    setShowCitySuggestions(false);
    dispatch({
      type: 'SET_STATE',
      value: {
        yishuvBenefit: {
          ...state.yishuvBenefit,
          cityName: city.name,
          maxIncomeYearly: city.maxBase,
          percent: city.percent,
        },
      },
    });
  };

  return (
    <section className="space-y-4">
      {/* ОСНОВНЫЕ ПАРАМЕТРЫ */}
      <FormSection title="Основные параметры" variant="basic">
        <div className="grid gap-3 sm:grid-cols-2">
          <CurrencyInput
            label="Годовой оборот (הכנסות)"
            value={state.revenue || ''}
            onChange={(e) =>
              dispatch({ type: 'SET_REVENUE', value: Number(e.target.value) || 0 })
            }
            helper="Общий объем продаж / услуг"
          />
          <CurrencyInput
            label="Годовые расходы (הוצאות מוכרות)"
            value={state.expenses || ''}
            onChange={(e) =>
              dispatch({ type: 'SET_EXPENSES', value: Number(e.target.value) || 0 })
            }
            helper="Признанные налогом расходы"
          />
        </div>
        <div className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-900">
          <p className="font-medium">Налогооблагаемый доход (до вычетов):</p>
          <p className="mt-1 text-sm font-semibold text-blue-700">{formatShekel(gross)} ₪</p>
        </div>
      </FormSection>

      {/* ТИП БИЗНЕСА */}
      <FormSection title="Тип бизнеса" variant="basic">
        <BusinessTypeSelector
          value={state.businessType}
          onChange={(value) =>
            dispatch({ type: 'SET_BUSINESS_TYPE', value })
          }
        />

        {/* Дополнительные опции для компании */}
        {state.businessType === BusinessType.HEVRA && (
          <div className="space-y-3 border-t border-slate-200 pt-3">
            <CurrencyInput
              label="Распределяемые дивиденды (%)"
              type="number"
              min={0}
              max={100}
              value={state.dividendPercent}
              onChange={(e) =>
                dispatch({
                  type: 'SET_DIVIDEND_PERCENT',
                  value: Number(e.target.value) || 0,
                })
              }
              helper="Процент прибыли на выплату дивидендов"
            />
            <label className="checkbox-item flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={state.isMajorShareholder}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_MAJOR_SHAREHOLDER',
                    value: e.target.checked,
                  })
                }
              />
              <span className="text-sm text-slate-700">
                Бааль манийот маhути (בעל מניות מהותי, ≥10%)
              </span>
            </label>
          </div>
        )}

        {/* НДС и экспорт — только для осек мурше и компании */}
        {state.businessType === BusinessType.PATUR ? (
          <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Осек патур не платит НДС и не может зачитывать входящий НДС.
          </div>
        ) : (
          <div className="mt-4 space-y-3 border-t border-slate-200 pt-3">
            <div>
              <label className="form-label">
                Доля экспортного дохода (НДС 0%), %
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={state.exportPercent}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_EXPORT_PERCENT',
                      value: Number(e.target.value) || 0,
                    })
                  }
                  className="flex-1"
                />
                <span className="min-w-12 text-right font-semibold text-slate-900">
                  {state.exportPercent}%
                </span>
              </div>
            </div>

            <label className="checkbox-item flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={state.includeInputVat}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_STATE',
                    value: { includeInputVat: e.target.checked },
                  })
                }
              />
              <span className="text-sm text-slate-700">
                Учитывать входящий НДС (зачёт по расходам)
              </span>
            </label>
          </div>
        )}
      </FormSection>

      {/* ОСНОВНЫЕ ВЫЧЕТЫ */}
      <NekudotSelector
        value={state.nekudot}
        onChange={(nekudot) => dispatch({ type: 'SET_STATE', value: { nekudot } })}
      />

      {/* РАСШИРЕННЫЕ ОПЦИИ */}
      <AdvancedOptionsToggle label="Расширенные параметры">
        {/* ЛЬГОТНЫЙ НАСЕЛЕННЫЙ ПУНКТ */}
        <FormSection 
          title="Льготный населённый пункт (יישוב מזכה)"
          variant="advanced"
        >
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Процент прямого вычета из подоходного налога на основе места жительства.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label className="form-label">Город</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Начните вводить…"
                    value={cityQuery}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCityQuery(value);
                      setShowCitySuggestions(true);
                    }}
                    onFocus={() => setShowCitySuggestions(true)}
                  />
                  {showCitySuggestions && citySuggestions.length > 0 && (
                    <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                      {citySuggestions.map((city) => (
                        <button
                          key={city.name}
                          type="button"
                          className="block w-full px-3 py-2 text-left text-xs text-slate-800 hover:bg-slate-50"
                          onClick={() => handleSelectCity(city)}
                        >
                          <span className="font-medium">{city.name}</span>
                          <span className="ml-2 text-slate-500">{city.percent}%</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <CurrencyInput
                label="Макс. сумма дохода/год"
                value={state.yishuvBenefit.maxIncomeYearly || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_STATE',
                    value: {
                      yishuvBenefit: {
                        ...state.yishuvBenefit,
                        maxIncomeYearly: Number(e.target.value) || 0,
                      },
                    },
                  })
                }
                showValue={false}
              />

              <div>
                <label className="form-label">% вычета</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  className="form-input mt-1"
                  value={state.yishuvBenefit.percent || ''}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_STATE',
                      value: {
                        yishuvBenefit: {
                          ...state.yishuvBenefit,
                          percent: Number(e.target.value) || 0,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-900">
              <p className="font-medium">Текущая льгота: {formatShekel(Math.max(0, Math.round(yishuvCredit)))} ₪</p>
            </div>
            <button
              type="button"
              onClick={onOpenYishuvInfo}
              className="button-toggle justify-center text-xs w-full"
            >
              📖 Справка по льготам
            </button>
          </div>
        </FormSection>

        {/* ПЕНСИЯ И ФОНДЫ */}
        <PensionSection
          value={{
            pension: state.pension,
            keren: state.keren,
            disabilityInsurance: state.disabilityInsurance,
          }}
          onChange={(value) => dispatch({ type: 'SET_STATE', value })}
          grossIncomeYearly={gross}
        />
      </AdvancedOptionsToggle>
    </section>
  );
};
