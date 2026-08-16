import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { PriceHistoryItem } from '../types';

interface PriceHistoryChartProps {
  history: PriceHistoryItem[];
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 text-xs bg-slate-900/40 rounded-2xl border border-slate-800">
        No price history logs recorded yet.
      </div>
    );
  }

  // Transform timeline records grouped by dateFormatted for Recharts
  const dateMap: Record<string, any> = {};

  history.forEach((item) => {
    if (!dateMap[item.dateFormatted]) {
      dateMap[item.dateFormatted] = { date: item.dateFormatted };
    }
    dateMap[item.dateFormatted][item.storeName] = item.price;
  });

  const chartData = Object.values(dateMap);
  const storeNames = Array.from(new Set(history.map((h) => h.storeName)));

  const strokeColors = [
    '#38bdf8', // Sky Blue
    '#34d399', // Emerald
    '#f43f5e', // Rose
    '#fbbf24', // Amber
    '#c084fc', // Purple
  ];

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-white">60-Day Price Trend Timeline</h3>
          <p className="text-xs text-slate-400">Track historical store price changes over time</p>
        </div>
        <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
          Last Updated Log: Today
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 12 }}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Price']}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            {storeNames.map((store, idx) => (
              <Line
                key={store}
                type="monotone"
                dataKey={store}
                stroke={strokeColors[idx % strokeColors.length]}
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
