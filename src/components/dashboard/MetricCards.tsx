"use client";

import React from "react";
import { DashboardMetrics } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Wrench,
  AlertCircle,
  Activity,
} from "lucide-react";

interface MetricCardsProps {
  metrics: DashboardMetrics | null;
  loading?: boolean;
}

export function MetricCards({ metrics, loading }: MetricCardsProps) {
  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Bookings",
      value: metrics.totalBookings.toLocaleString(),
      change: `+${metrics.trends.bookingsDelta}%`,
      changePositive: metrics.trends.bookingsDelta >= 0,
      subtext: "vs. past 30 days",
      icon: CalendarDays,
      iconBg: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      accent: "from-blue-500/10 to-transparent",
    },
    {
      title: "Today's Bookings",
      value: metrics.todayBookings.toString(),
      change: "Live Today",
      changePositive: true,
      subtext: "Operations active",
      icon: Activity,
      iconBg: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
      accent: "from-cyan-500/10 to-transparent",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(metrics.totalRevenue),
      change: `+${metrics.trends.revenueDelta}%`,
      changePositive: metrics.trends.revenueDelta >= 0,
      subtext: `$${metrics.todayRevenue.toLocaleString()} today`,
      icon: DollarSign,
      iconBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      accent: "from-emerald-500/10 to-transparent",
    },
    {
      title: "Completed Jobs",
      value: metrics.completedBookings.toLocaleString(),
      change: `${((metrics.completedBookings / (metrics.totalBookings || 1)) * 100).toFixed(0)}%`,
      changePositive: true,
      subtext: "Success resolution rate",
      icon: CheckCircle2,
      iconBg: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
      accent: "from-teal-500/10 to-transparent",
    },
    {
      title: "Pending Bookings",
      value: metrics.pendingBookings.toString(),
      change: metrics.pendingBookings > 5 ? "High Load" : "Normal",
      changePositive: metrics.pendingBookings <= 5,
      subtext: "Awaiting technician dispatch",
      icon: Clock,
      iconBg: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      accent: "from-amber-500/10 to-transparent",
    },
    {
      title: "Active Mechanics",
      value: `${metrics.activeMechanics} / ${metrics.totalMechanics}`,
      change: `${((metrics.activeMechanics / (metrics.totalMechanics || 1)) * 100).toFixed(0)}%`,
      changePositive: true,
      subtext: "Technicians in field",
      icon: Wrench,
      iconBg: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
      accent: "from-indigo-500/10 to-transparent",
    },
    {
      title: "New Customers",
      value: metrics.newCustomers.toString(),
      change: `+${metrics.trends.customersDelta}%`,
      changePositive: true,
      subtext: `${metrics.totalCustomers} total accounts`,
      icon: Users,
      iconBg: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
      accent: "from-violet-500/10 to-transparent",
    },
    {
      title: "Average Response Time",
      value: `${metrics.avgResponseTimeMin} mins`,
      change: "Target < 20m",
      changePositive: true,
      subtext: `CSAT: ${metrics.averageRating}★`,
      icon: TrendingUp,
      iconBg: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
      accent: "from-rose-500/10 to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-gradient-to-b ${card.accent} to-zinc-900/60 p-5 shadow-lg shadow-black/20 transition hover:border-zinc-700/80`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">{card.title}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-white">{card.value}</div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-zinc-400">{card.subtext}</span>
                <span
                  className={`font-semibold ${
                    card.changePositive ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {card.change}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
