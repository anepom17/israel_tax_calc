import type { PensionResult } from '../types';
import { PENSION_SELF_EMPLOYED, KEREN_HISHTALMUT } from '../constants/pension';

/** Годовой обязательный минимум пенсии по закону (для самозанятых), ₪/год. Лимиты в константах — месячные. */
export function getMinMandatoryPensionYearly(yearlyIncome: number): number {
  const income = Math.max(0, yearlyIncome);
  const [t1, t2] = [
    PENSION_SELF_EMPLOYED.mandatory.tier1.upTo * 12,
    PENSION_SELF_EMPLOYED.mandatory.tier2.upTo * 12,
  ];
  const r1 = PENSION_SELF_EMPLOYED.mandatory.tier1.rate;
  const r2 = PENSION_SELF_EMPLOYED.mandatory.tier2.rate;
  if (income <= t1) return income * r1;
  if (income <= t2) return t1 * r1 + (income - t1) * r2;
  return t1 * r1 + (t2 - t1) * r2;
}

/**
 * @param pensionAmountYearly Сумма пенсионных взносов ₪/год (0 если отключено)
 * @param kerenAmountYearly Сумма взносов в керен иштальмут ₪/год (0 если отключено)
 * @param _disabilityAmountYearly Сумма страховки от потери трудоспособности ₪/год (пока не используется в расчёте)
 */
export function calculatePension(
  yearlyIncome: number,
  pensionAmountYearly: number,
  kerenAmountYearly: number,
  _disabilityAmountYearly: number,
): PensionResult {
  const income = Math.max(0, yearlyIncome);
  const pensionContribution = Math.max(0, pensionAmountYearly);
  const kerenContribution = Math.max(0, kerenAmountYearly);

  // Ницуй и зикуй не могут превышать фактически уплаченную сумму взносов.
  const nikuyBase = Math.min(income, PENSION_SELF_EMPLOYED.incomeCap);
  const maxNikuyByLaw = Math.min(
    income * PENSION_SELF_EMPLOYED.taxBenefits.nikuy,
    nikuyBase * PENSION_SELF_EMPLOYED.taxBenefits.nikuy,
  );
  const pensionNikuy =
    pensionContribution > 0 ? Math.min(maxNikuyByLaw, pensionContribution) : 0;

  const zikuyBase = Math.min(income, PENSION_SELF_EMPLOYED.incomeCap);
  const maxZikuyEligible = Math.min(
    income * PENSION_SELF_EMPLOYED.taxBenefits.zikuy,
    zikuyBase * PENSION_SELF_EMPLOYED.taxBenefits.zikuy,
  );
  const pensionZikuyCredit =
    pensionContribution > 0
      ? Math.min(pensionContribution, maxZikuyEligible) *
        PENSION_SELF_EMPLOYED.taxBenefits.zikuyReturnRate
      : 0;

  const maxKerenNikuyByLaw = Math.min(
    income * KEREN_HISHTALMUT.deductionRate,
    KEREN_HISHTALMUT.maxDeduction,
  );
  const kerenNikuy =
    kerenContribution > 0
      ? Math.min(maxKerenNikuyByLaw, kerenContribution)
      : 0;

  return {
    pensionContribution,
    pensionNikuy,
    pensionZikuyCredit,
    kerenContribution,
    kerenNikuy,
  };
}

