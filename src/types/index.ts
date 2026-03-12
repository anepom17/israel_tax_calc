export enum BusinessType {
  PATUR = 'PATUR',
  MURSHE = 'MURSHE',
  HEVRA = 'HEVRA',
}

export type Gender = 'male' | 'female';

export type ArmyService = 'none' | 'full' | 'short';

export type DegreeType = 'none' | 'bachelor' | 'master' | 'certificate';

export interface NekudotOptions {
  gender: Gender;
  childrenBornThisYear: number;
  children1to2: number;
  children3: number;
  children4to5: number;
  children6to17: number;
  singleParent: boolean;
  disabledSpouse: boolean;
  armyService: ArmyService;
  degree: DegreeType;
  disability100: boolean;
  isOleh: boolean;
  aliyahDate?: string;
}

export interface PensionOptions {
  enabled: boolean;
  /** Сумма взноса в ₪/год */
  amountYearly: number;
}

export interface KerenOptions {
  enabled: boolean;
  /** Сумма взноса в ₪/год */
  amountYearly: number;
}

export interface DisabilityInsuranceOptions {
  enabled: boolean;
  /** Сумма взноса в ₪/год */
  amountYearly: number;
}

export interface YishuvBenefitOptions {
  /** Название льготного населённого пункта (опционально, для справки) */
  cityName?: string;
  /** Максимальная сумма годового дохода, учитываемая для льготы, ₪/год */
  maxIncomeYearly: number;
  /** Процент вычета от дохода (0–100) */
  percent: number;
}

export interface TaxInput {
  revenue: number;
  expenses: number;
  businessType: BusinessType;
  exportPercent: number;
  /** Учитывать входящий НДС по расходам (зачёт/возмещение). Если выключено — входящий НДС не считается. */
  includeInputVat: boolean;
  nekudot: NekudotOptions;
  /** Льгота по месту жительства (יישוב מזכה) — прямой вычет из подоходного налога */
  yishuvBenefit: YishuvBenefitOptions;
  pension: PensionOptions;
  keren: KerenOptions;
  disabilityInsurance: DisabilityInsuranceOptions;
  dividendPercent: number;
  isMajorShareholder: boolean;
}

export interface TaxBracketResult {
  min: number;
  max: number;
  rate: number;
  taxablePortion: number;
  taxForBracket: number;
}

export interface IncomeTaxResult {
  taxableIncome: number;
  brackets: TaxBracketResult[];
  masYesef: number;
  nekudotCredit: number;
  pensionCredit: number;
  /** Прямой вычет из налога за льготный населённый пункт */
  yishuvCredit: number;
  totalIncomeTax: number;
}

export interface BituahLeumiResult {
  /** Monthly income before Section 345 adjustment (raw or capped to min/max) */
  monthlyGrossIncome: number;
  /** Monthly income after Section 345 formula (base for BL/MB calculation) */
  monthlyIncomeForCalc: number;
  reducedBase: number;
  fullBase: number;
  bituahLeumiReduced: number;
  bituahLeumiFull: number;
  masBriutReduced: number;
  masBriutFull: number;
  totalBituahLeumi: number;
  totalMasBriut: number;
  deductiblePortion: number;
}

export interface VatResult {
  outputVatDomestic: number;
  outputVatExport: number;
  inputVatOnExpenses: number;
  netVat: number;
}

export interface PensionResult {
  pensionContribution: number;
  pensionNikuy: number;
  pensionZikuyCredit: number;
  kerenContribution: number;
  kerenNikuy: number;
}

export interface CorporateTaxResult {
  profitBeforeTax: number;
  corporateTax: number;
  profitAfterCorporateTax: number;
  dividends: number;
  dividendTax: number;
  masYesefOnDividends: number;
  totalLoadOnDistributedProfit: number;
}

export interface TaxResult {
  grossIncome: number;
  taxableIncome: number;
  incomeTax: IncomeTaxResult | null;
  bituahLeumi: BituahLeumiResult | null;
  vat: VatResult | null;
  pension: PensionResult | null;
  corporate: CorporateTaxResult | null;
  netIncomeYearly: number;
  netIncomeMonthly: number;
  effectiveTaxRate: number;
  isPaturThresholdExceeded: boolean;
}

