export interface IncomeTaxBracket {
  readonly min: number;
  readonly max: number;
  readonly rate: number;
}

export const INCOME_TAX_BRACKETS: readonly IncomeTaxBracket[] = [
  { min: 0, max: 84_120, rate: 0.1 },
  { min: 84_121, max: 120_720, rate: 0.14 },
  { min: 120_721, max: 193_800, rate: 0.2 },
  { min: 193_801, max: 269_280, rate: 0.31 },
  { min: 269_281, max: 560_280, rate: 0.35 },
  { min: 560_281, max: Infinity, rate: 0.47 },
] as const;

export const MAS_YESEF = {
  threshold: 721_560,
  baseRate: 0.03,
  capitalSurcharge: 0.02,
} as const;
