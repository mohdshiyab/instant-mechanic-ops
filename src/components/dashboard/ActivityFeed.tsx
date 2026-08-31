"use client";

import React from "react";
import { ActivityLogType } from "@/lib/types";
import { formatTimeAgo } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  UserCheck,
  Calendar,
  Radio,
} from "lucide-react";

interface ActivityFeedProps {
  activities: ActivityLogType[];
  loading?: boolean;
}

export function ActivityFeed({ activities, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5">
        <div className="h-6 w-32 animate-pulse rounded bg-zinc-800 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-zinc-800/40" />
          ))}
        </div>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "EMERGENCY_DISPATCH":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case "STATUS_CHANGED":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "PAYMENT_RECEIVED":
        return <DollarSign className="h-4 w-4 text-cyan-400" />;
      case "MECHANIC_ASSIGNED":
        return <UserCheck className="h-4 w-4 text-indigo-400" />;
      default:
        return <Calendar className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Radio className="h-4 w-4 animate-pulse text-cyan-400" />
          </div>
          <h3 className="font-semibold text-white text-sm">Live Dispatch Stream</h3>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
          Real-Time
        </span>
      </div>

      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <p className="text-center text-xs text-zinc-500 py-8">No recent activity logs.</p>
        ) : (
          activities.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3 rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-3 transition hover:border-zinc-700/80 hover:bg-zinc-800/30"
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-800/80 border border-zinc-700/40">
                {getActivityIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-zinc-200 truncate">{act.title}</h4>
                  <span className="text-[10px] text-zinc-500 shrink-0">
                    {formatTimeAgo(act.createdAt)}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{act.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
