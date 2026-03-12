import React from 'react';
import type { TaxInput, TaxResult } from '../types';
import { BusinessType } from '../types';
import { formatShekel } from '../utils/format';
import { TaxBreakdown } from './TaxBreakdown';
import { TaxChart } from './TaxChart';

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
      <div className="rounded-xl bg-white p-4 shadow-md">
        <h2 className="text-base font-semibold text-slate-900">
          Итог
        </h2>
        <div className="mt-3 space-y-2 text-sm text-slate-700">
          {state.revenue > 0 && (
            <p>
              Оборот (доход до вычета расходов):{" "}
              <span className="font-semibold">{formatShekel(state.revenue)} ₪/год</span>
            </p>
          )}
          <p>
            Общая сумма налога:{" "}
            <span className="font-semibold">{formatShekel(totalTaxYearly)} ₪/год</span>
          </p>
          {vat && vat.netVat < 0 && (
            <p className="rounded bg-emerald-50 px-2 py-1 text-emerald-800">
              Возмещение НДС (возврат от налоговой):{" "}
              <span className="font-semibold">+{formatShekel(-vat.netVat)} ₪/год</span>{" "}
              (+{formatShekel(-vat.netVat / 12)} ₪/мес) — уже учтено в чистом доходе ниже.
            </p>
          )}
          {netIncomeWithoutExpensesYearly !== null && (
            <p>
              Чистый доход без учёта расходов (от оборота):{" "}
              <span className="font-semibold">
                {formatShekel(netIncomeWithoutExpensesYearly)} ₪/год
              </span>{" "}
              ({formatShekel(netIncomeWithoutExpensesYearly / 12)} ₪/мес)
            </p>
          )}
          <p>
            Чистый доход (после вычета расходов, налогов и отчислений):{" "}
            <span className="font-semibold">
              {formatShekel(netIncomeYearly)} ₪/год
            </span>{" "}
            ({formatShekel(netIncomeMonthly)} ₪/мес)
          </p>
        </div>
        <p className="mt-1 text-xs text-slate-600">
          Эффективная налоговая ставка:{" "}
          <span className="font-medium">
            {(effectiveTaxRate * 100).toFixed(1)}%
          </span>
        </p>
        <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-blue-500"
            style={{ width: `${Math.max(0, Math.min(1, netShare)) * 100}%` }}
          />
        </div>
      </div>

      <TaxBreakdown state={state} result={result} />
      <TaxChart state={state} result={result} />
    </section>
  );
};

