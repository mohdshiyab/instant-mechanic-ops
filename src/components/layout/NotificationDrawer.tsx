"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { X, Bell, AlertTriangle, CheckCircle2, Info, ChevronRight } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const { notifications, setSelectedBookingId } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-zinc-800 bg-[#0e1626] shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Live Activity Alerts</h3>
                <p className="text-xs text-zinc-400">Real-time dispatches and state updates</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body / Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/80 text-zinc-500 mb-3">
                  <Bell className="h-6 w-6" />
                </div>
                <p className="font-medium text-zinc-300 text-sm">No new alerts yet</p>
                <p className="text-xs text-zinc-500 max-w-xs mt-1">
                  Live operations events, technician movements, and incoming bookings will stream here automatically.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isEmergency = notif.type === "emergency";
                const isSuccess = notif.type === "success";

                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (notif.bookingId) {
                        setSelectedBookingId(notif.bookingId);
                        onClose();
                      }
                    }}
                    className={`group relative rounded-xl border p-3.5 transition cursor-pointer ${
                      isEmergency
                        ? "border-red-500/30 bg-red-950/20 hover:bg-red-950/40"
                        : isSuccess
                        ? "border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40"
                        : "border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isEmergency ? (
                          <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
                        ) : isSuccess ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <Info className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-semibold ${isEmergency ? "text-red-300" : isSuccess ? "text-emerald-300" : "text-zinc-200"}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-zinc-500">
                            {formatTimeAgo(notif.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                        {notif.bookingId && (
                          <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-blue-400 group-hover:text-blue-300">
                            <span>Inspect booking {notif.bookingId}</span>
                            <ChevronRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="border-t border-zinc-800 p-4 text-center">
            <p className="text-[11px] text-zinc-500">
              Instant Mechanic Operations Real-time Stream active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
