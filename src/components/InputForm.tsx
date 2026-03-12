import React, { useMemo, useState } from 'react';
import { BusinessType, type TaxInput } from '../types';
import { formatShekel } from '../utils/format';
import { NekudotSelector } from './NekudotSelector';
import { PensionSection } from './PensionSection';
import { yishuvCities, type YishuvCity } from '../data/yishuvCities';

type Props = {
  state: TaxInput;
  dispatch: React.Dispatch<any>;
  onOpenYishuvInfo: () => void;
  /** Текущая сумма льготы по месту жительства, ₪ (из расчёта) */
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
      <div className="rounded-xl bg-white p-4 shadow-md">
        <h2 className="text-base font-semibold text-slate-900">
          Основные параметры
        </h2>
        <div className="mt-3 space-y-3">
          <div>
            <label className="flex justify-between text-xs font-medium text-slate-700">
              <span>Годовой оборот (הכנסות), ₪</span>
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={state.revenue || ''}
              onChange={(e) =>
                dispatch({ type: 'SET_REVENUE', value: Number(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <label className="flex justify-between text-xs font-medium text-slate-700">
              <span>Годовые расходы (הוצאות מוכרות), ₪</span>
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={state.expenses || ''}
              onChange={(e) =>
                dispatch({ type: 'SET_EXPENSES', value: Number(e.target.value) || 0 })
              }
            />
          </div>
          <p className="text-xs text-slate-600">
            Налогооблагаемый доход до вычетов: {formatShekel(gross)} ₪
          </p>
          <p className="text-xs text-slate-500">
            Для точного расчёта НДС учитывайте во «входящем» только расходы с חשבונית מס по облагаемым операциям (не арнона, не часть обучения/услуг и т.д.).
          </p>
          <p className="text-xs text-slate-500">
            Ставки налогового года 2026
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-md">
        <h2 className="text-base font-semibold text-slate-900">Тип бизнеса</h2>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="businessType"
                checked={state.businessType === BusinessType.PATUR}
                onChange={() =>
                  dispatch({ type: 'SET_BUSINESS_TYPE', value: BusinessType.PATUR })
                }
              />
              <span>Осек патур (עוסק פטור)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="businessType"
                checked={state.businessType === BusinessType.MURSHE}
                onChange={() =>
                  dispatch({ type: 'SET_BUSINESS_TYPE', value: BusinessType.MURSHE })
                }
              />
              <span>Осек мурше (עוסק מורשה)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="businessType"
                checked={state.businessType === BusinessType.HEVRA}
                onChange={() =>
                  dispatch({ type: 'SET_BUSINESS_TYPE', value: BusinessType.HEVRA })
                }
              />
              <span>Компания (חברה בע&quot;מ)</span>
            </label>
          </div>

          {state.businessType === BusinessType.HEVRA && (
            <div className="mt-3 space-y-2">
              <div>
                <label className="flex justify-between text-xs font-medium text-slate-700">
                  <span>Распределяемые дивиденды, %</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={state.dividendPercent}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_DIVIDEND_PERCENT',
                      value: Number(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-xs">
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
                <span>Бааль манийот маhути (בעל מניות מהותי, ≥10%)</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-md">
        <h2 className="text-base font-semibold text-slate-900">НДС и экспорт</h2>
        <div className="mt-3 space-y-2 text-sm">
          <label className="flex justify-between text-xs font-medium text-slate-700">
            <span>Доля экспортного дохода, % (НДС 0%)</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={state.businessType === BusinessType.PATUR ? 0 : state.exportPercent}
            disabled={state.businessType === BusinessType.PATUR}
            onChange={(e) =>
              dispatch({
                type: 'SET_EXPORT_PERCENT',
                value: Number(e.target.value) || 0,
              })
            }
            className="mt-1 w-full"
          />
          <p className="text-xs text-slate-600">
            {state.businessType === BusinessType.PATUR
              ? 'Осек патур не платит НДС и не может зачитывать входящий НДС.'
              : `Экспорт: ${state.exportPercent}% от оборота облагается НДС 0% (шиур эфес).`}
          </p>
          {state.businessType !== BusinessType.PATUR && (
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={state.includeInputVat}
                onChange={(e) =>
                  dispatch({ type: 'SET_STATE', value: { includeInputVat: e.target.checked } })
                }
              />
              <span>Считать входящий НДС (зачёт по расходам с חשבונית מס)</span>
            </label>
          )}
        </div>
      </div>

      <NekudotSelector
        value={state.nekudot}
        onChange={(nekudot) => dispatch({ type: 'SET_STATE', value: { nekudot } })}
      />

      <div className="rounded-xl bg-white p-4 shadow-md">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">
            Льготный населённый пункт (יישוב מזכה)
          </h2>
          <button
            type="button"
            onClick={onOpenYishuvInfo}
            className="inline-flex h-6 items-center justify-center rounded-full border border-slate-200 px-2 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
            aria-label="Открыть справку по льготным населённым пунктам"
          >
            i
          </button>
        </div>
        <div className="mt-3 space-y-2 text-xs text-slate-700">
          <p>
            Здесь можно задать льготу по месту жительства: процент вычета от
            дохода до максимальной годовой базы. Эта сумма{' '}
            <strong>напрямую уменьшит подоходный налог</strong>, но не может
            сделать его отрицательным.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="text-[11px] font-medium text-slate-700">
                Город (автодополнение)
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  placeholder="Начните вводить название города…"
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
                        className="block w-full cursor-pointer px-3 py-1.5 text-left text-[11px] text-slate-800 hover:bg-slate-50"
                        onClick={() => handleSelectCity(city)}
                      >
                        <span className="block">{city.name}</span>
                        <span className="block text-[10px] text-slate-500">
                          {city.percent}% · макс. {formatShekel(city.maxBase)} ₪
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700">
                Макс. сумма дохода в год, ₪
              </label>
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
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
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700">
                % вычета от дохода
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step="0.1"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
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
          <p className="text-[11px] text-slate-500">
            Текущая сумма льготы по месту жительства:{' '}
            <strong>{formatShekel(Math.max(0, Math.round(yishuvCredit)))} ₪</strong>. Эта
            сумма напрямую уменьшает подоходный налог, но не может сделать его
            отрицательным.
          </p>
        </div>
      </div>

      <PensionSection
        value={{
          pension: state.pension,
          keren: state.keren,
          disabilityInsurance: state.disabilityInsurance,
        }}
        onChange={(value) => dispatch({ type: 'SET_STATE', value })}
        grossIncomeYearly={gross}
      />
    </section>
  );
};

