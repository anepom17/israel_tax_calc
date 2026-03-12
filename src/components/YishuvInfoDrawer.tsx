import React, { useMemo, useState } from 'react';
import { yishuvCities, type YishuvCity } from '../data/yishuvCities';
import { formatShekel } from '../utils/format';

type Props = {
  open: boolean;
  onClose: () => void;
};

export const YishuvInfoDrawer: React.FC<Props> = ({ open, onClose }) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'percent' | 'maxBase'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: 'name' | 'percent' | 'maxBase') => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortDirection((prevDir) => (prevDir === 'asc' ? 'desc' : 'asc'));
        return prevKey;
      }
      setSortDirection('asc');
      return key;
    });
  };

  const filteredAndSorted = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    let list: YishuvCity[] = yishuvCities;
    if (normalizedSearch) {
      list = list.filter((city) => city.name.toLowerCase().includes(normalizedSearch));
    }

    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sortKey === 'percent') {
        cmp = a.percent - b.percent;
      } else {
        cmp = a.maxBase - b.maxBase;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [search, sortKey, sortDirection]);

  if (!open) {
    return null;
  }

  const sortIndicator = (key: 'name' | 'percent' | 'maxBase') => {
    if (sortKey !== key) return null;
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  return (
    <div
      className="fixed inset-0 z-30 flex"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div className="flex-1 bg-slate-900/30 backdrop-blur-sm" />
      <div
        className="relative h-full w-full max-w-md overflow-y-auto bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Льготные населённые пункты (יישובים מזכים)
            </h2>
            <p className="mt-1 text-[11px] text-slate-600">
              Таблица населённых пунктов с льготой по месту жительства. Можно сортировать
              по названию, ставке и максимальной базе, а также искать по части названия.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Закрыть справку по льготным населённым пунктам"
          >
            ×
          </button>
        </div>

        <div className="border-b border-slate-200 px-4 py-3">
          <label className="block text-[11px] font-medium text-slate-700">
            Поиск по названию города
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
            placeholder="Начните вводить название города…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="px-2 py-2">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th
                    scope="col"
                    className="cursor-pointer px-2 py-2 text-left font-medium text-slate-700"
                    onClick={() => handleSort('name')}
                  >
                    Город {sortIndicator('name')}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-2 py-2 text-right font-medium text-slate-700"
                    onClick={() => handleSort('percent')}
                  >
                    Ставка {sortIndicator('percent')}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-2 py-2 text-right font-medium text-slate-700"
                    onClick={() => handleSort('maxBase')}
                  >
                    Макс. база {sortIndicator('maxBase')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((city) => (
                  <tr key={city.name} className="border-b border-slate-100">
                    <td className="px-2 py-1.5 text-left text-slate-800">{city.name}</td>
                    <td className="px-2 py-1.5 text-right text-slate-800">
                      {city.percent}%
                    </td>
                    <td className="px-2 py-1.5 text-right text-slate-800">
                      {formatShekel(city.maxBase)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

