import React from 'react';
import type { TaxInput, TaxResult } from '../types';
import { BusinessType } from '../types';
import { formatShekel } from '../utils/format';
import { TaxBreakdown } from './TaxBreakdown';
import { TaxChart } from './TaxChart';
import { ResultsCard } from './ResultsCard';
import { FormSection } from './FormSection';
import { TaxCategoryBadge } from './TaxCategoryBadge';

type Props = {
  state: TaxInput;
  result: TaxResult;
};

export const ResultsDashboard: React.FC<Props> = ({ state, result }) => {
  const { netIncomeYearly, netIncomeMonthly, effectiveTaxRate, grossIncome, incomeTax, bituahLeumi, vat, pension, corporate } = result;
  const netShare = grossIncome > 0 ? netIncomeYearly / grossIncome : 0;

  const totalTaxYearly =
    incomeTax && bituahLeumi && vat
      ? incomeTax.totalIncomeTax +
        bituahLeumi.totalBituahLeumi +
        bituahLeumi.totalMasBriut +
        vat.netVat
      : corporate
        ? corporate.corporateTax + corporate.dividendTax + corporate.masYesefOnDividends
        : 0;

  const netIncomeWithoutExpensesYearly =
    state.revenue > 0 && incomeTax && bituahLeumi && vat && pension
      ? state.revenue -
        totalTaxYearly -
        pension.pensionContribution -
        pension.kerenContribution
      : null;

  return (
    <section className="space-y-4">
      {/* KEY METRICS CARDS */}
      <FormSection title="Итоговые показатели" variant="results">
        <div className="grid gap-3 sm:grid-cols-2">
          <ResultsCard
            label="Чистый доход (годовой)"
            value={formatShekel(netIncomeYearly)}
            subValue={`${formatShekel(netIncomeMonthly)}/мес`}
            variant={netIncomeYearly >= 0 ? 'highlight' : 'secondary'}
          />
          <ResultsCard
            label="Общий налог"
            value={formatShekel(totalTaxYearly)}
            variant="primary"
          />
          <ResultsCard
            label="Эффективная ставка"
            value={`${(effectiveTaxRate * 100).toFixed(1)}%`}
            variant="secondary"
          />
          <ResultsCard
            label="Брутто доход"
            value={formatShekel(grossIncome)}
            variant="secondary"
          />
        </div>

        {/* PROGRESS VISUALIZATION */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">Доля чистого дохода</span>
            <span className="font-semibold text-slate-900">
              {((Math.max(0, Math.min(1, netShare)) * 100)).toFixed(1)}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.max(0, Math.min(1, netShare)) * 100}%` }}
            />
          </div>
        </div>

        {/* ADDITIONAL INFO */}
        {state.revenue > 0 && (
          <div className="mt-4 space-y-2 text-sm">
            {vat && vat.netVat < 0 && (
              <div className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800">
                <p className="text-xs font-medium">Возмещение НДС от налоговой:</p>
                <p className="mt-1 font-semibold">+{formatShekel(-vat.netVat)}/год</p>
              </div>
            )}
            {netIncomeWithoutExpensesYearly !== null && (
              <div className="text-xs text-slate-600">
                Чистый доход без учёта расходов: <span className="font-semibold text-slate-900">{formatShekel(netIncomeWithoutExpensesYearly)}/год</span>
              </div>
            )}
          </div>
        )}
      </FormSection>

      {/* TAX BREAKDOWN BY CATEGORY */}
      {grossIncome > 0 && (
        <FormSection title="Налоговая нагрузка по категориям" variant="results">
          <div className="space-y-2">
            {incomeTax && incomeTax.totalIncomeTax > 0 && (
              <TaxCategoryBadge
                category="income"
                amount={formatShekel(incomeTax.totalIncomeTax)}
              />
            )}
            {bituahLeumi && (bituahLeumi.totalBituahLeumi + bituahLeumi.totalMasBriut > 0) && (
              <>
                <TaxCategoryBadge
                  category="bitouach"
                  amount={formatShekel(bituahLeumi.totalBituahLeumi)}
                />
                <div className="ml-3 text-xs text-slate-600">
                  + Мас бриют: {formatShekel(bituahLeumi.totalMasBriut)}
                </div>
              </>
            )}
            {vat && vat.netVat !== 0 && (
              <TaxCategoryBadge
                category="vat"
                amount={vat.netVat > 0 ? formatShekel(vat.netVat) : `−${formatShekel(-vat.netVat)}`}
              />
            )}
            {corporate && (corporate.corporateTax + corporate.dividendTax + corporate.masYesefOnDividends > 0) && (
              <TaxCategoryBadge
                category="corporate"
                amount={formatShekel(corporate.corporateTax + corporate.dividendTax + corporate.masYesefOnDividends)}
              />
            )}
          </div>
        </FormSection>
      )}

      {/* VISUALIZATION */}
      <TaxChart state={state} result={result} />

      {/* DETAILED BREAKDOWN */}
      <TaxBreakdown state={state} result={result} />
    </section>
  );
};
