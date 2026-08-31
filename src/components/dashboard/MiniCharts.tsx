"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, PieChart as PieIcon } from "lucide-react";

interface MiniChartsProps {
  revenueData?: { date: string; revenue: number; bookings: number }[];
  statusData?: { status: string; count: number; percentage: number; color: string }[];
  loading?: boolean;
}

export function MiniCharts({ revenueData = [], statusData = [], loading }: MiniChartsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5" />
        <div className="h-64 animate-pulse rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5" />
      </div>
    );
  }

  // Last 14 days slice for clean mini overview
  const chartRevenue = revenueData.slice(-14);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* 2-Col Area Chart */}
      <div className="lg:col-span-2 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Revenue Trajectory (Past 14 Days)</h3>
              <p className="text-[11px] text-zinc-400">Daily gross booking settlement</p>
            </div>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#52525b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#52525b"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
                formatter={(value: any) => [formatCurrency(Number(value)), "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 1-Col Donut Chart */}
      <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 shadow-lg shadow-black/20 flex flex-col">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <PieIcon className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-white text-sm">Work Order Statuses</h3>
          </div>
        </div>

        <div className="h-44 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={68}
                paddingAngle={3}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-auto grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-800/60">
          {statusData.slice(0, 4).map((s) => (
            <div key={s.status} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-zinc-400 capitalize text-[11px] truncate">
                {s.status.toLowerCase()}: <b className="text-zinc-200">{s.count}</b>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
