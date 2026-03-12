import type { NekudotOptions } from '../types';
import { BASE_POINTS } from '../constants/nekudotZikuy';

export function calculateTotalNekudot(options: NekudotOptions): number {
  let points = 0;

  points += options.gender === 'male' ? BASE_POINTS.maleResident : BASE_POINTS.femaleResident;

  points += options.childrenBornThisYear * 1;
  points += options.children1to2 * 2;
  points += options.children3 * 1;
  points += options.children6to17 * 1;

  if (options.singleParent) {
    points += 1;
  }
  if (options.disabledSpouse) {
    points += 1;
  }

  if (options.armyService === 'full') {
    points += 2;
  } else if (options.armyService === 'short') {
    points += 1;
  }

  if (options.degree === 'bachelor') {
    points += 1;
  } else if (options.degree === 'master' || options.degree === 'certificate') {
    points += 0.5;
  }

  if (options.disability100) {
    points += 2;
  }

  if (options.isOleh && options.aliyahDate) {
    const aliyah = new Date(options.aliyahDate);
    const now = new Date();
    const months =
      (now.getFullYear() - aliyah.getFullYear()) * 12 +
      (now.getMonth() - aliyah.getMonth());

    if (months > 0 && months <= 42) {
      let olehPoints = 0;
      const firstPeriod = Math.min(months, 18);
      olehPoints += firstPeriod * 0.25;

      if (months > 18) {
        const secondPeriod = Math.min(months - 18, 12);
        olehPoints += secondPeriod * (1 / 6);
      }

      if (months > 30) {
        const thirdPeriod = Math.min(months - 30, 12);
        olehPoints += thirdPeriod * (1 / 12);
      }

      points += olehPoints;
    }
  }

  return points;
}

