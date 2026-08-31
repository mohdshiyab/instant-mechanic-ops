"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "@/lib/context";
import { DashboardMetrics, ActivityLogType } from "@/lib/types";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { MiniCharts } from "@/components/dashboard/MiniCharts";
import { BookingsTable } from "@/components/bookings/BookingsTable";
import {
  Wrench,
  AlertTriangle,
  PlusCircle,
  TrendingUp,
  Radio,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverviewPage() {
  const { refreshKey, setIsCreateBookingOpen, triggerEmergency, role } = useApp();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activities, setActivities] = useState<ActivityLogType[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      const [dRes, aRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/analytics?days=14"),
      ]);

      const dData = await dRes.json();
      const aData = await aRes.json();

      if (dData.success) {
        setMetrics(dData.data.metrics);
        setActivities(dData.data.recentActivity);
      }

      if (aData.success) {
        setRevenueData(aData.data.revenueOverTime);
        setStatusData(aData.data.bookingsByStatus);
      }
    } catch (err) {
      console.error("Failed to load dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData, refreshKey]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Action Buttons */}
      <div className="flex flex-col gap-4 rounded-2xl border border-blue-900/40 bg-gradient-to-r from-[#0c182d] via-[#10203f] to-[#0c182d] p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white tracking-tight sm:text-2xl">
              Live Vehicle Service Operations
            </h1>
            <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-500/30">
              Active Control
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-1 max-w-xl leading-relaxed">
            Real-time fleet monitoring, roadside emergency dispatches, mechanic telemetry, and work order lifecycle settlement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/mechanics"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition"
          >
            <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span>Open Fleet Radar</span>
          </Link>

          {role !== "VIEWER" && (
            <button
              onClick={() => setIsCreateBookingOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-500/25 transition active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Work Order</span>
            </button>
          )}
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <MetricCards metrics={metrics} loading={loading} />

      {/* Mini Charts & Visual BI Row */}
      <MiniCharts revenueData={revenueData} statusData={statusData} loading={loading} />

      {/* 2-Column Grid: Live Bookings Table & Live Dispatch Stream */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Live Bookings Queue */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Active Operational Work Orders</h3>
            <Link
              href="/bookings"
              className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
            >
              <span>Full Work Order Registry</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <BookingsTable />
        </div>

        {/* Right 1 Col: Live Activity Feed */}
        <div className="space-y-3">
          <h3 className="font-bold text-white text-base">Live Activity Feed</h3>
          <ActivityFeed activities={activities} loading={loading} />
        </div>
      </div>
    </div>
  );
}
