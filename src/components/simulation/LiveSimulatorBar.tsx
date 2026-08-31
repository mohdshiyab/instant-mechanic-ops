"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import {
  Play,
  Pause,
  Zap,
  RotateCcw,
  AlertOctagon,
  Sparkles,
  Gauge,
  CheckCircle2,
} from "lucide-react";

export function LiveSimulatorBar() {
  const {
    isSimulating,
    toggleSimulation,
    simSpeed,
    setSimSpeed,
    triggerEmergency,
    triggerRefresh,
    role,
  } = useApp();

  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset and re-seed the operational database?")) return;
    setIsResetting(true);
    try {
      await fetch("/api/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      setResetSuccess(true);
      triggerRefresh();
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="border-b border-blue-900/30 bg-gradient-to-r from-[#0d1629] via-[#0f1d38] to-[#0d1629] px-4 py-2.5 sm:px-6 shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Simulation Engine Status & Controller */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-cyan-400 border border-cyan-500/30">
              <Gauge className="h-4 w-4 animate-pulse" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-white">Live Simulator:</span>{" "}
              <span className={isSimulating ? "font-bold text-emerald-400" : "text-zinc-400"}>
                {isSimulating ? "ACTIVE (AUTO-DISPATCHING)" : "PAUSED"}
              </span>
            </div>
          </div>

          {/* Play/Pause Button */}
          {role !== "VIEWER" && (
            <button
              onClick={toggleSimulation}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold shadow-sm transition active:scale-95 ${
                isSimulating
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  <span>Pause Engine</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Start Live Operations</span>
                </>
              )}
            </button>
          )}

          {/* Speed Selector */}
          <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/80 p-0.5 text-xs">
            <span className="px-2 text-[10px] font-medium text-zinc-400">Speed:</span>
            {[
              { label: "10s (Realistic)", value: 10000 },
              { label: "3s (Fast)", value: 3000 },
              { label: "1s (Turbo)", value: 1000 },
            ].map((speed) => (
              <button
                key={speed.value}
                onClick={() => setSimSpeed(speed.value)}
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${
                  simSpeed === speed.value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {speed.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {role !== "VIEWER" && (
            <button
              onClick={() => triggerEmergency()}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-600/20 px-2.5 py-1 text-xs font-semibold text-red-300 hover:bg-red-600/30 transition active:scale-95"
            >
              <AlertOctagon className="h-3.5 w-3.5" />
              <span>Simulate Breakdown</span>
            </button>
          )}

          {role === "ADMIN" && (
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 transition disabled:opacity-50"
            >
              {resetSuccess ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Database Reset</span>
                </>
              ) : (
                <>
                  <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? "animate-spin" : ""}`} />
                  <span>Reset Seed DB</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
