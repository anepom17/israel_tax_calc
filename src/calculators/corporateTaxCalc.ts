import type { CorporateTaxResult } from '../types';
import { CORPORATE_TAX } from '../constants/corporateTax';
import { MAS_YESEF } from '../constants/taxBrackets';

export function calculateCorporateTax(
  profitBeforeTax: number,
  dividendPercent: number,
  isMajorShareholder: boolean,
): CorporateTaxResult {
  const profit = Math.max(0, profitBeforeTax);
  const corporateTax = profit * CORPORATE_TAX.rate;
  const profitAfterCorporateTax = profit - corporateTax;

  const dividendShare = Math.max(0, Math.min(100, dividendPercent)) / 100;
  const dividends = profitAfterCorporateTax * dividendShare;

  const dividendRate = isMajorShareholder
    ? CORPORATE_TAX.dividendTaxMajor
    : CORPORATE_TAX.dividendTaxRegular;

  const dividendTax = dividends * dividendRate;

  const masYesefOnDividends =
    dividends > MAS_YESEF.threshold
      ? (dividends - MAS_YESEF.threshold) * (MAS_YESEF.baseRate + MAS_YESEF.capitalSurcharge)
      : 0;

  const totalLoadOnDistributedProfit =
    profit > 0 ? (corporateTax + dividendTax + masYesefOnDividends) / profit : 0;

  return {
    profitBeforeTax: profit,
    corporateTax,
    profitAfterCorporateTax,
    dividends,
    dividendTax,
    masYesefOnDividends,
    totalLoadOnDistributedProfit,
  };
}

