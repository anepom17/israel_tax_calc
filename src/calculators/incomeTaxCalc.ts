import type { IncomeTaxResult, TaxBracketResult } from '../types';
import { INCOME_TAX_BRACKETS, MAS_YESEF } from '../constants/taxBrackets';
import { NEKUDA_VALUE } from '../constants/nekudotZikuy';

export function calculateIncomeTax(
  taxableIncome: number,
  nekudotCredit: number,
  pensionCredit: number,
  yishuvCredit: number,
): IncomeTaxResult {
  const brackets: TaxBracketResult[] = [];
  let remaining = Math.max(0, taxableIncome);
  let totalTaxWithoutCredits = 0;

  for (const bracket of INCOME_TAX_BRACKETS) {
    if (remaining <= 0) {
      brackets.push({
        min: bracket.min,
        max: bracket.max,
        rate: bracket.rate,
        taxablePortion: 0,
        taxForBracket: 0,
      });
      continue;
    }

    const upperBound = Number.isFinite(bracket.max) ? bracket.max : taxableIncome;
    const bracketRange = Math.max(0, upperBound - bracket.min + 1);
    const taxablePortion = Math.min(remaining, bracketRange);
    const taxForBracket = taxablePortion * bracket.rate;

    totalTaxWithoutCredits += taxForBracket;
    remaining -= taxablePortion;

    brackets.push({
      min: bracket.min,
      max: bracket.max,
      rate: bracket.rate,
      taxablePortion,
      taxForBracket,
    });
  }

  const masYesefBase =
    taxableIncome > MAS_YESEF.threshold
      ? (taxableIncome - MAS_YESEF.threshold) * MAS_YESEF.baseRate
      : 0;

  const grossTax = totalTaxWithoutCredits + masYesefBase;
  const totalCredits =
    nekudotCredit * NEKUDA_VALUE + pensionCredit + yishuvCredit;
  const totalIncomeTax = Math.max(0, grossTax - totalCredits);

  return {
    taxableIncome,
    brackets,
    masYesef: masYesefBase,
    nekudotCredit: nekudotCredit * NEKUDA_VALUE,
    pensionCredit,
    yishuvCredit,
    totalIncomeTax,
  };
}
