export interface BituahLeumiConfig {
  readonly reducedThreshold: number;
  readonly maxIncome: number;
  readonly minIncome: number;
  readonly bituahLeumi: {
    readonly reduced: number;
    readonly full: number;
  };
  readonly masBriut: {
    readonly reduced: number;
    readonly full: number;
  };
  readonly deductiblePortion: number;
}

export const BITUAH_LEUMI: BituahLeumiConfig = {
  reducedThreshold: 7_703,
  maxIncome: 51_910,
  minIncome: 3_442,
  bituahLeumi: {
    reduced: 0.0447,
    full: 0.1283,
  },
  masBriut: {
    reduced: 0.0323,
    full: 0.0517,
  },
  deductiblePortion: 0.52,
} as const;
