import React from 'react';
import type { TaxInput, TaxResult } from '../types';
import { BusinessType } from '../types';
import { VAT } from '../constants/vatRates';
import { formatShekel } from '../utils/format';

type Props = {
  state: TaxInput;
  result: TaxResult;
};

export const TaxBreakdown: React.FC<Props> = ({ state, result }) => {
  const { incomeTax, bituahLeumi, vat, pension, corporate, isPaturThresholdExceeded, grossIncome } = result;

  const taxableFormula =
    incomeTax && bituahLeumi && pension
      ? {
          base: grossIncome,
          blDeductible: bituahLeumi.deductiblePortion,
          pensionNikuy: pension.pensionNikuy,
          kerenNikuy: pension.kerenNikuy,
          taxable: incomeTax.taxableIncome,
        }
      : null;

  return (
    <section className="rounded-xl bg-white p-4 shadow-md">
      <h2 className="text-base font-semibold text-slate-900">
        Детальная разбивка налогов
      </h2>
      <div className="mt-3 space-y-2 text-sm">
        {isPaturThresholdExceeded && (
          <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Ваш оборот превышает порог ({formatShekel(VAT.exemptThreshold)} ₪). Необходимо зарегистрироваться как осек мурше!
          </div>
        )}

        {incomeTax && (
          <details className="group rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
            <summary className="flex cursor-pointer items-center justify-between text-slate-800">
              <span>Подоходный налог (מס הכנסה)</span>
              <span className="font-semibold">
                {formatShekel(incomeTax.totalIncomeTax)} ₪
              </span>
            </summary>
            <div className="mt-2 space-y-1">
              <p>
                Налогооблагаемый доход: {formatShekel(incomeTax.taxableIncome)} ₪
              </p>
              {taxableFormula && (
                <p className="text-[11px] text-slate-600">
                  Формула: {formatShekel(taxableFormula.base)}{' '}
                  (доход после расходов) − {formatShekel(taxableFormula.blDeductible)}{' '}
                  (52% Битуах Леуми, вычитаемые) −{' '}
                  {formatShekel(taxableFormula.pensionNikuy)} (пенсионный ницуй) −{' '}
                  {formatShekel(taxableFormula.kerenNikuy)} (ниций по керен иштальмут) ={' '}
                  {formatShekel(taxableFormula.taxable)} (налогооблагаемый доход).
                </p>
              )}
              <table className="mt-1 w-full border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-1 text-left">Ступень</th>
                    <th className="py-1 text-right">Доход</th>
                    <th className="py-1 text-right">Ставка</th>
                    <th className="py-1 text-right">Налог</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeTax.brackets.map((b, idx) => (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="py-1">
                        {formatShekel(b.min)}–{Number.isFinite(b.max) ? formatShekel(b.max) : '∞'}
                      </td>
                      <td className="py-1 text-right">
                        {formatShekel(b.taxablePortion)} ₪
                      </td>
                      <td className="py-1 text-right">{(b.rate * 100).toFixed(1)}%</td>
                      <td className="py-1 text-right">
                        {formatShekel(b.taxForBracket)} ₪
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Мас йесеф: {formatShekel(incomeTax.masYesef)} ₪</p>
              <p>Зачёт некудот: −{formatShekel(incomeTax.nekudotCredit)} ₪</p>
              <p>Пенсионный зикуй: −{formatShekel(incomeTax.pensionCredit)} ₪</p>
              {incomeTax.yishuvCredit > 0 && (
                <p>
                  Льгота по месту жительства: −{formatShekel(incomeTax.yishuvCredit)} ₪
                </p>
              )}
            </div>
          </details>
        )}

        {vat && (
          <details className="group rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
            <summary className="flex cursor-pointer items-center justify-between text-slate-800">
              <span>НДС (מע&quot;מ)</span>
              <span className="font-semibold">
                {formatShekel(vat.netVat)} ₪
              </span>
            </summary>
            <div className="mt-2 space-y-1">
              {state.businessType === BusinessType.PATUR ? (
                <p>Осек патур не взимает НДС и не зачитывает входящий НДС.</p>
              ) : (
                <>
                  <p>Исходящий НДС (внутренний рынок): {formatShekel(vat.outputVatDomestic)} ₪</p>
                  <p>Исходящий НДС (экспорт, 0%): {formatShekel(vat.outputVatExport)} ₪</p>
                  <p>Входящий НДС на расходы: −{formatShekel(vat.inputVatOnExpenses)} ₪</p>
                  <p className="mt-1 rounded bg-amber-50 px-1.5 py-1 text-amber-900">
                    Калькулятор считает входящий НДС от всей суммы расходов. В реальности зачесть можно только НДС по расходам с правильной חשבונית מס и только по тем покупкам/услугам, которые облагаются НДС и относятся к деятельности. Арнона, часть услуг (обучение, медицина и др.), покупки у осек патур и т.п. часто не дают входящий НДС. Учитывайте только расходы с НДС для точной оценки.
                  </p>
                  {vat.netVat < 0 && (
                    <p className="mt-1 rounded bg-blue-50 px-1.5 py-1 text-slate-600">
                      Итого к возмещению: вы не начислили НДС с оборота (экспорт 0%), но входящий НДС по расходам можно зачесть — налоговая вернёт эту сумму.
                    </p>
                  )}
                </>
              )}
            </div>
          </details>
        )}

        {bituahLeumi && (
          <details className="group rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
            <summary className="flex cursor-pointer items-center justify-between text-slate-800">
              <span>Битуах Леуми и мас бриют</span>
              <span className="font-semibold">
                {formatShekel(bituahLeumi.totalBituahLeumi + bituahLeumi.totalMasBriut)} ₪/год (
                {formatShekel(
                  (bituahLeumi.totalBituahLeumi + bituahLeumi.totalMasBriut) / 12,
                )}{' '}
                ₪/мес)
              </span>
            </summary>
            <div className="mt-2 space-y-1">
              <p>Месячный доход (до ст. 345): {formatShekel(bituahLeumi.monthlyGrossIncome)} ₪</p>
              <p>База для расчёта (после ст. 345): {formatShekel(bituahLeumi.monthlyIncomeForCalc)} ₪</p>
              <p className="mt-1 font-medium text-slate-700">Битуах Леуми (ביטוח לאומי)</p>
              <p>
                Сниженная ставка: {formatShekel(bituahLeumi.reducedBase)} ₪ →{' '}
                {formatShekel(bituahLeumi.bituahLeumiReduced)} ₪/мес (
                {formatShekel(bituahLeumi.bituahLeumiReduced * 12)} ₪/год)
              </p>
              <p>
                Полная ставка: {formatShekel(bituahLeumi.fullBase)} ₪ →{' '}
                {formatShekel(bituahLeumi.bituahLeumiFull)} ₪/мес (
                {formatShekel(bituahLeumi.bituahLeumiFull * 12)} ₪/год)
              </p>
              <p>52% от БЛ, вычитаемые из налогооблагаемого дохода: −{formatShekel(bituahLeumi.deductiblePortion)} ₪</p>
              <p className="mt-1 font-medium text-slate-700">Мас бриют (מס בריאות)</p>
              <p>
                Сниженная ставка: {formatShekel(bituahLeumi.reducedBase)} ₪ →{' '}
                {formatShekel(bituahLeumi.masBriutReduced)} ₪/мес (
                {formatShekel(bituahLeumi.masBriutReduced * 12)} ₪/год)
              </p>
              <p>
                Полная ставка: {formatShekel(bituahLeumi.fullBase)} ₪ →{' '}
                {formatShekel(bituahLeumi.masBriutFull)} ₪/мес (
                {formatShekel(bituahLeumi.masBriutFull * 12)} ₪/год)
              </p>
            </div>
          </details>
        )}

        {pension && (
          <details className="group rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
            <summary className="flex cursor-pointer items-center justify-between text-slate-800">
              <span>Пенсия и фонды</span>
              <span className="font-semibold">
                {formatShekel(pension.pensionContribution + pension.kerenContribution)} ₪
              </span>
            </summary>
            <div className="mt-2 space-y-1">
              <p>Пенсионные отчисления: {formatShekel(pension.pensionContribution)} ₪</p>
              <p>Пенсионный ницу́й (ניכוי): −{formatShekel(pension.pensionNikuy)} ₪</p>
              <p>Пенсионный зикуй (זיכוי): −{formatShekel(pension.pensionZikuyCredit)} ₪</p>
              <p>Керен иштальмут: {formatShekel(pension.kerenContribution)} ₪</p>
              <p>Ницу́й по керену: −{formatShekel(pension.kerenNikuy)} ₪</p>
            </div>
          </details>
        )}

        {corporate && (
          <details className="group rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
            <summary className="flex cursor-pointer items-center justify-between text-slate-800">
              <span>Корпоративный налог и дивиденды</span>
              <span className="font-semibold">
                {formatShekel(corporate.corporateTax + corporate.dividendTax + corporate.masYesefOnDividends)} ₪
              </span>
            </summary>
            <div className="mt-2 space-y-1">
              <p>Прибыль до налога: {formatShekel(corporate.profitBeforeTax)} ₪</p>
              <p>Мас хеврот (מס חברות): {formatShekel(corporate.corporateTax)} ₪</p>
              <p>Дивиденды: {formatShekel(corporate.dividends)} ₪</p>
              <p>Налог на дивиденды: {formatShekel(corporate.dividendTax)} ₪</p>
              <p>Мас йесеф на дивиденды: {formatShekel(corporate.masYesefOnDividends)} ₪</p>
            </div>
          </details>
        )}
      </div>
    </section>
  );
};

