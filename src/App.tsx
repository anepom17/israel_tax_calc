import React, { useMemo, useReducer, useState } from 'react';
import { BusinessType, type TaxInput } from './types';
import { calculateNetIncome } from './calculators/netIncomeCalc';
import { InputForm } from './components/InputForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { YishuvInfoDrawer } from './components/YishuvInfoDrawer';

type Action =
  | { type: 'SET_REVENUE'; value: number }
  | { type: 'SET_EXPENSES'; value: number }
  | { type: 'SET_BUSINESS_TYPE'; value: BusinessType }
  | { type: 'SET_EXPORT_PERCENT'; value: number }
  | { type: 'SET_DIVIDEND_PERCENT'; value: number }
  | { type: 'SET_MAJOR_SHAREHOLDER'; value: boolean }
  | { type: 'SET_STATE'; value: Partial<TaxInput> };

function reducer(state: TaxInput, action: Action): TaxInput {
  switch (action.type) {
    case 'SET_REVENUE':
      return { ...state, revenue: Math.max(0, action.value) };
    case 'SET_EXPENSES':
      return { ...state, expenses: Math.max(0, action.value) };
    case 'SET_BUSINESS_TYPE':
      return { ...state, businessType: action.value };
    case 'SET_EXPORT_PERCENT':
      return { ...state, exportPercent: Math.min(100, Math.max(0, action.value)) };
    case 'SET_DIVIDEND_PERCENT':
      return { ...state, dividendPercent: Math.min(100, Math.max(0, action.value)) };
    case 'SET_MAJOR_SHAREHOLDER':
      return { ...state, isMajorShareholder: action.value };
    case 'SET_STATE':
      return { ...state, ...action.value };
    default:
      return state;
  }
}

const initialState: TaxInput = {
  revenue: 0,
  expenses: 0,
  businessType: BusinessType.PATUR,
  exportPercent: 0,
  includeInputVat: false,
  nekudot: {
    gender: 'male',
    childrenBornThisYear: 0,
    children1to2: 0,
    children3: 0,
    children4to5: 0,
    children6to17: 0,
    singleParent: false,
    disabledSpouse: false,
    armyService: 'none',
    degree: 'none',
    disability100: false,
    isOleh: false,
    aliyahDate: undefined,
  },
  yishuvBenefit: {
    cityName: '',
    maxIncomeYearly: 0,
    percent: 0,
  },
  pension: {
    enabled: false,
    amountYearly: 0,
  },
  keren: {
    enabled: false,
    amountYearly: 0,
  },
  disabilityInsurance: {
    enabled: false,
    amountYearly: 0,
  },
  dividendPercent: 0,
  isMajorShareholder: true,
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isYishuvInfoOpen, setYishuvInfoOpen] = useState(false);

  const result = useMemo(() => calculateNetIncome(state), [state]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 lg:text-4xl">
            Налоговый калькулятор «Бизнес Израиль»
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Расчёт чистого дохода после налогов и обязательных отчислений для предпринимателей в Израиле.
          </p>
        </header>
        <div className="grid gap-6 lg:grid-cols-2">
          <InputForm
            state={state}
            dispatch={dispatch}
            onOpenYishuvInfo={() => setYishuvInfoOpen(true)}
            yishuvCredit={result.incomeTax?.yishuvCredit ?? 0}
          />
          <ResultsDashboard state={state} result={result} />
        </div>
        <footer className="mt-8 text-xs text-slate-500">
          ⚠️ <strong>Данный калькулятор предназначен исключительно для ознакомительных целей и
          предварительной оценки.</strong>{' '}
          Он не заменяет профессиональную консультацию бухгалтера (רואה חשבון) или налогового
          консультанта (יועץ מס). Фактический расчёт налогов может отличаться в зависимости от
          индивидуальных обстоятельств, применения специальных льгот и интерпретации закона
          налоговыми органами. Ставки актуальны на <strong>2026 налоговый год</strong> и могут быть изменены{' '}
          законодателем.
        </footer>
        {/* Справка по льготным населённым пунктам */}
        <YishuvInfoDrawer open={isYishuvInfoOpen} onClose={() => setYishuvInfoOpen(false)} />
      </div>
    </div>
  );
};

export default App;

