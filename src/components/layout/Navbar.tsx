"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import {
  Wrench,
  Radio,
  Bell,
  Volume2,
  VolumeX,
  Shield,
  UserCheck,
  Eye,
  AlertTriangle,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { NotificationDrawer } from "./NotificationDrawer";

export function Navbar() {
  const {
    role,
    setRole,
    sseConnected,
    unreadCount,
    markNotificationsAsRead,
    soundEnabled,
    setSoundEnabled,
    triggerEmergency,
    setIsCreateBookingOpen,
  } = useApp();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);

  const handleEmergencyClick = async () => {
    setIsEmergencyLoading(true);
    await triggerEmergency();
    setIsEmergencyLoading(false);
  };

  const handleOpenNotifications = () => {
    markNotificationsAsRead();
    setIsDrawerOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-800 bg-[#0d1322]/90 px-4 backdrop-blur-md sm:px-6">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/25">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white sm:text-lg">INSTANT</span>
                <span className="font-bold tracking-tight text-cyan-400 sm:text-lg">MECHANIC</span>
                <span className="hidden rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20 md:inline">
                  OPS CONTROL
                </span>
              </div>
            </div>
          </div>

          {/* SSE Live Connection Orb */}
          <div className="hidden items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs sm:flex">
            <div className="relative flex h-2 w-2">
              {sseConnected && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  sseConnected ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                }`}
              ></span>
            </div>
            <span className="text-zinc-300 font-medium">
              {sseConnected ? "Live SSE Feed" : "Connecting..."}
            </span>
          </div>
        </div>

        {/* Right: Actions, Role Switcher, Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Quick Create Booking Button */}
          {role !== "VIEWER" && (
            <button
              onClick={() => setIsCreateBookingOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden md:inline">New Booking</span>
            </button>
          )}

          {/* Quick Emergency Button */}
          {role !== "VIEWER" && (
            <button
              onClick={handleEmergencyClick}
              disabled={isEmergencyLoading}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 shadow-sm hover:bg-red-500/20 transition active:scale-95 disabled:opacity-50"
              title="Inject instant roadside breakdown incident"
            >
              <AlertTriangle className={`h-4 w-4 ${isEmergencyLoading ? "animate-spin" : "animate-bounce"}`} />
              <span className="hidden lg:inline">Emergency Dispatch</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            title={soundEnabled ? "Mute audio alerts" : "Enable audio alerts"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-cyan-400" /> : <VolumeX className="h-4 w-4 text-zinc-500" />}
          </button>

          {/* Notifications Button */}
          <button
            onClick={handleOpenNotifications}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            title="Notification Center"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-md animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 p-1 text-xs">
            <button
              onClick={() => setRole("ADMIN")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 font-medium transition ${
                role === "ADMIN"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Admin Role (Full System Access)"
            >
              <Shield className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            <button
              onClick={() => setRole("OPERATIONS")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 font-medium transition ${
                role === "OPERATIONS"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Operations Lead (Dispatch & Work Orders)"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Ops</span>
            </button>

            <button
              onClick={() => setRole("VIEWER")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 font-medium transition ${
                role === "VIEWER"
                  ? "bg-zinc-700 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Auditor / Read-Only Mode"
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Viewer</span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Notification Drawer */}
      <NotificationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
