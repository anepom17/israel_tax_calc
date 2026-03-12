export const PENSION_SELF_EMPLOYED = {
  mandatory: {
    tier1: { upTo: 6_268, rate: 0.0445 },
    tier2: { upTo: 12_536, rate: 0.1255 },
  },
  taxBenefits: {
    nikuy: 0.11,
    zikuy: 0.055,
    zikuyReturnRate: 0.35,
    insuranceCap: 0.035,
  },
  incomeCap: 293_397,
} as const;

export const KEREN_HISHTALMUT = {
  incomeCap: 293_397,
  deductionRate: 0.045,
  exemptRate: 0.07,
  maxDeduction: 13_203,
} as const;

