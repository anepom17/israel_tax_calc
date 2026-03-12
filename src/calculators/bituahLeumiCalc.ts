import type { BituahLeumiResult } from '../types';
import { BITUAH_LEUMI } from '../constants/bituahLeumi';

/**
 * Section 345 of the National Insurance Law: the income base for BL
 * contributions is reduced by 52% of BL itself (only ביטוח לאומי, not בריאות).
 * This creates a circular dependency resolved algebraically:
 *
 *   If Y > threshold:
 *     W = [Y + Z × threshold × (T2 − T1)] / (1 + Z × T2)
 *   If Y ≤ threshold:
 *     W = Y / (1 + Z × T1)
 *
 *   Y  = "optimal income" (input before formula)
 *   W  = income subject to insurance (after formula)
 *   T1 = reduced BL rate (BL only)
 *   T2 = full BL rate (BL only)
 *   Z  = 0.52 (deductible portion)
 */
function applySection345(
  monthlyIncome: number,
  threshold: number,
  t1: number,
  t2: number,
  z: number,
): number {
  if (monthlyIncome > threshold) {
    return (monthlyIncome + z * threshold * (t2 - t1)) / (1 + z * t2);
  }
  return monthlyIncome / (1 + z * t1);
}

export function calculateBituahLeumi(yearlyIncome: number): BituahLeumiResult {
  const config = BITUAH_LEUMI;

  const monthlyRaw = yearlyIncome / 12;
  const monthlyGrossIncome = Math.min(
    config.maxIncome,
    Math.max(config.minIncome, monthlyRaw),
  );

  const monthlyIncomeForCalc = applySection345(
    monthlyGrossIncome,
    config.reducedThreshold,
    config.bituahLeumi.reduced,
    config.bituahLeumi.full,
    config.deductiblePortion,
  );

  const reducedBase = Math.min(monthlyIncomeForCalc, config.reducedThreshold);
  const fullBase = Math.max(0, monthlyIncomeForCalc - config.reducedThreshold);

  const bituahLeumiReduced = reducedBase * config.bituahLeumi.reduced;
  const bituahLeumiFull = fullBase * config.bituahLeumi.full;
  const masBriutReduced = reducedBase * config.masBriut.reduced;
  const masBriutFull = fullBase * config.masBriut.full;

  const totalBituahLeumiMonthly = bituahLeumiReduced + bituahLeumiFull;
  const totalMasBriutMonthly = masBriutReduced + masBriutFull;

  const totalBituahLeumi = totalBituahLeumiMonthly * 12;
  const totalMasBriut = totalMasBriutMonthly * 12;

  const deductiblePortion = totalBituahLeumi * config.deductiblePortion;

  return {
    monthlyGrossIncome,
    monthlyIncomeForCalc,
    reducedBase,
    fullBase,
    bituahLeumiReduced,
    bituahLeumiFull,
    masBriutReduced,
    masBriutFull,
    totalBituahLeumi,
    totalMasBriut,
    deductiblePortion,
  };
}
