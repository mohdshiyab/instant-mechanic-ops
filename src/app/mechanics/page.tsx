"use client";

import React from "react";
import { MechanicFleetView } from "@/components/mechanics/MechanicFleetView";
import { Wrench } from "lucide-react";

export default function MechanicsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Mechanics Fleet & Live GPS Radar</h1>
            <p className="text-xs text-zinc-400">
              Live location tracking of 25 mobile workshop units, ratings, equipment, and field statuses
            </p>
          </div>
        </div>
      </div>

      <MechanicFleetView />
    </div>
  );
}
