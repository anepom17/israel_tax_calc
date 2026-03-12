import type { VatResult } from '../types';
import { VAT } from '../constants/vatRates';

export function calculateVat(
  revenue: number,
  expenses: number,
  exportPercent: number,
  isPatur: boolean,
  includeInputVat: boolean,
): VatResult {
  if (isPatur) {
    return {
      outputVatDomestic: 0,
      outputVatExport: 0,
      inputVatOnExpenses: 0,
      netVat: 0,
    };
  }

  const rate = VAT.rate;
  const domesticShare = Math.max(0, Math.min(100, 100 - exportPercent)) / 100;
  const exportShare = Math.max(0, Math.min(100, exportPercent)) / 100;

  const outputVatDomestic = revenue * domesticShare * rate;
  const outputVatExport = revenue * exportShare * VAT.exportRate;

  const inputVatOnExpenses = includeInputVat ? expenses * (rate / (1 + rate)) : 0;

  const netVat = outputVatDomestic + outputVatExport - inputVatOnExpenses;

  return {
    outputVatDomestic,
    outputVatExport,
    inputVatOnExpenses,
    netVat,
  };
}
