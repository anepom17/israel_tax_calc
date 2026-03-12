import React from 'react';
import type { TaxInput, TaxResult } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from 'recharts';

type Props = {
  state: TaxInput;
  result: TaxResult;
};

export const TaxChart: React.FC<Props> = ({ result }) => {
  const taxParts = [
    {
      name: 'Подоходный налог',
      value: result.incomeTax?.totalIncomeTax ?? 0,
    },
    {
      name: 'Битуах Леуми',
      value: result.bituahLeumi?.totalBituahLeumi ?? 0,
    },
    {
      name: 'Мас бриют',
      value: result.bituahLeumi?.totalMasBriut ?? 0,
    },
    {
      name: 'НДС',
      value: result.vat?.netVat ?? 0,
    },
    {
      name: 'Корпоративный+дивиденды',
      value:
        (result.corporate?.corporateTax ?? 0) +
        (result.corporate?.dividendTax ?? 0) +
        (result.corporate?.masYesefOnDividends ?? 0),
    },
  ];

  const COLORS = ['#1e3a5f', '#3b82f6', '#6366f1', '#0ea5e9', '#f97316'];

  const gross = result.grossIncome;
  const afterBL =
    gross - (result.bituahLeumi?.totalBituahLeumi ?? 0) - (result.bituahLeumi?.totalMasBriut ?? 0);
  const afterIncomeTax = afterBL - (result.incomeTax?.totalIncomeTax ?? 0);
  const afterVat = afterIncomeTax - (result.vat?.netVat ?? 0);

  const waterfall = [
    { name: 'Брутто', value: gross },
    { name: 'После БЛ+МБ', value: afterBL },
    { name: 'После מס הכנסה', value: afterIncomeTax },
    { name: 'После НДС', value: afterVat },
    { name: 'Нетто', value: result.netIncomeYearly },
  ];

  if (!gross) {
    return null;
  }

  return (
    <section className="rounded-xl bg-white p-4 shadow-md">
      <h2 className="text-base font-semibold text-slate-900">
        Визуализация налоговой нагрузки
      </h2>
      <div className="mt-3 grid gap-4 text-xs lg:grid-cols-2">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taxParts}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={(entry) =>
                  entry.value > 0
                    ? `${entry.name}: ${((entry.value / gross) * 100).toFixed(0)}%`
                    : ''
                }
              >
                {taxParts.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfall}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

