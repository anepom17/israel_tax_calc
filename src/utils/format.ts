/** Форматирование суммы в шекелях: макс. 2 знака после запятой */
export function formatShekel(n: number): string {
  return n.toLocaleString('he-IL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
