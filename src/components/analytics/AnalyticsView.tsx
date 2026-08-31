"use client";

import React, { useState, useEffect } from "react";
import { AnalyticsData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Clock,
  Award,
  Calendar,
  DollarSign,
  CheckCircle2,
} from "lucide-react";

export function AnalyticsView() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics?days=${days}`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [days]);

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <div className="h-12 w-64 animate-pulse rounded-2xl bg-zinc-800/40" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5"
            />
          ))}
        </div>
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#06b6d4", "#8b5cf6", "#ec4899", "#f43f5e", "#14b8a6"];

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-white text-base">Executive Operations & Financial Analytics</h2>
          <p className="text-xs text-zinc-400">Deep telemetry across revenue, fleet throughput, and dispatch turnaround</p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 p-1 text-xs">
          {[
            { label: "7 Days", value: 7 },
            { label: "30 Days", value: 30 },
            { label: "90 Days", value: 90 },
          ].map((d) => (
            <button
              key={d.value}
              onClick={() => setDays(d.value)}
              className={`rounded-lg px-3 py-1 font-medium transition ${
                days === d.value ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Revenue Over Time & Booking Statuses */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Over Time Area Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-white text-sm">Revenue Trajectory & Daily Growth</h3>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueOverTime} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaColorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#52525b" fontSize={11} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.75rem", fontSize: "12px" }}
                  formatter={(val: any) => [formatCurrency(Number(val)), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#areaColorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Work Order Status Distribution Donut */}
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 shadow-lg shadow-black/20 flex flex-col">
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <PieIcon className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-white text-sm">Lifecycle Status Breakdown</h3>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.bookingsByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {data.bookingsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.75rem", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2 text-xs pt-3 border-t border-zinc-800/60">
            {data.bookingsByStatus.map((s) => (
              <div key={s.status} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-zinc-400 capitalize text-[11px] truncate">
                  {s.status.toLowerCase()}: <b className="text-zinc-200">{s.count} ({s.percentage}%)</b>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Service Breakdown & Hourly Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Service Category Breakdown Bar Chart */}
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 shadow-lg shadow-black/20">
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-blue-500/20">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-white text-sm">Service Category Volume & Demand</h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.serviceBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis dataKey="category" stroke="#52525b" fontSize={10} angle={-25} textAnchor="end" tickLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.75rem", fontSize: "12px" }}
                  formatter={(val: any, name: any) => [val, name === "count" ? "Bookings" : "Revenue ($)"]}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Dispatch Activity Heatmap / Bar */}
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 shadow-lg shadow-black/20">
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-white text-sm">Peak Dispatch Hours Distribution (24h)</h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.hourlyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="hour" stroke="#52525b" fontSize={10} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.75rem", fontSize: "12px" }}
                />
                <Bar dataKey="bookings" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dispatches" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Top Technician Performance Ranking Table */}
      <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 shadow-lg shadow-black/20">
        <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <Award className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-white text-sm">Fleet Technician Performance & CSAT Ranking</h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.mechanicPerformance.map((m, idx) => (
            <div
              key={m.name}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 font-bold text-xs border border-blue-500/30">
                  #{idx + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-xs">{m.name}</h4>
                  <span className="text-[10px] text-zinc-400">{m.jobsCompleted} Completed Jobs</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-amber-400 text-xs">{m.rating} ★</div>
                <span className="text-[10px] text-zinc-500 font-medium">{m.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
