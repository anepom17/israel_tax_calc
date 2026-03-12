import {
  BusinessType,
  type TaxInput,
  type TaxResult,
} from '../types';
import { calculateBituahLeumi } from './bituahLeumiCalc';
import { calculatePension } from './pensionCalc';
import { calculateVat } from './vatCalc';
import { calculateIncomeTax } from './incomeTaxCalc';
import { calculateTotalNekudot } from './nekudotCalc';
import { calculateCorporateTax } from './corporateTaxCalc';
import { VAT } from '../constants/vatRates';

export function calculateNetIncome(input: TaxInput): TaxResult {
  const grossIncome = Math.max(0, input.revenue - input.expenses);

  if (input.businessType === BusinessType.HEVRA) {
    const corporate = calculateCorporateTax(
      grossIncome,
      input.dividendPercent,
      input.isMajorShareholder,
    );

    const netIncomeYearly =
      corporate.profitAfterCorporateTax -
      corporate.dividends +
      (corporate.dividends -
        corporate.dividendTax -
        corporate.masYesefOnDividends);

    const netIncomeMonthly = netIncomeYearly / 12;

    return {
      grossIncome,
      taxableIncome: grossIncome,
      incomeTax: null,
      bituahLeumi: null,
      vat: null,
      pension: null,
      corporate,
      netIncomeYearly,
      netIncomeMonthly,
      effectiveTaxRate: grossIncome > 0 ? 1 - netIncomeYearly / grossIncome : 0,
      isPaturThresholdExceeded: false,
    };
  }

  const bl = calculateBituahLeumi(grossIncome);

  const pension = calculatePension(
    grossIncome,
    input.pension.enabled ? input.pension.amountYearly : 0,
    input.keren.enabled ? input.keren.amountYearly : 0,
    input.disabilityInsurance.enabled ? input.disabilityInsurance.amountYearly : 0,
  );

  const taxableIncome =
    grossIncome -
    bl.deductiblePortion -
    pension.pensionNikuy -
    pension.kerenNikuy;

  const nekudotTotal = calculateTotalNekudot(input.nekudot);

  // Льгота по месту жительства: % от дохода, но не более заданного годового максимума
  const yishuvPercent = Math.max(0, input.yishuvBenefit.percent) / 100;
  const yishuvBase = Math.min(
    Math.max(0, grossIncome),
    Math.max(0, input.yishuvBenefit.maxIncomeYearly),
  );
  const yishuvCredit =
    yishuvBase > 0 && yishuvPercent > 0 ? yishuvBase * yishuvPercent : 0;

  const incomeTax = calculateIncomeTax(
    taxableIncome,
    nekudotTotal,
    pension.pensionZikuyCredit,
    yishuvCredit,
  );

  const vat = calculateVat(
    input.revenue,
    input.expenses,
    input.exportPercent,
    input.businessType === BusinessType.PATUR,
    input.includeInputVat,
  );

  let isPaturThresholdExceeded = false;
  if (input.businessType === BusinessType.PATUR) {
    if (input.revenue > VAT.exemptThreshold) {
      isPaturThresholdExceeded = true;
    }
  }

  const netIncomeYearly =
    grossIncome -
    bl.totalBituahLeumi -
    bl.totalMasBriut -
    incomeTax.totalIncomeTax -
    pension.pensionContribution -
    pension.kerenContribution -
    vat.netVat;

  const netIncomeMonthly = netIncomeYearly / 12;

  return {
    grossIncome,
    taxableIncome,
    incomeTax,
    bituahLeumi: bl,
    vat,
    pension,
    corporate: null,
    netIncomeYearly,
    netIncomeMonthly,
    effectiveTaxRate: grossIncome > 0 ? 1 - netIncomeYearly / grossIncome : 0,
    isPaturThresholdExceeded,
  };
}
