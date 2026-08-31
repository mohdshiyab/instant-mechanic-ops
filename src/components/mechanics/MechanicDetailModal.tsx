"use client";

import React, { useState, useEffect } from "react";
import { MechanicType, MechanicStatus } from "@/lib/types";
import { formatCurrency, formatDate, getMechanicStatusBadge } from "@/lib/utils";
import { useApp } from "@/lib/context";
import {
  X,
  Star,
  Wrench,
  Car,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
} from "lucide-react";

interface MechanicDetailModalProps {
  mechanicId: string;
  onClose: () => void;
}

export function MechanicDetailModal({ mechanicId, onClose }: MechanicDetailModalProps) {
  const { setSelectedBookingId, triggerRefresh, role } = useApp();

  const [mechanic, setMechanic] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/mechanics/${mechanicId}`);
        const json = await res.json();
        if (json.success) setMechanic(json.data);
      } catch (err) {
        console.error("Failed to load mechanic detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [mechanicId]);

  const handleStatusChange = async (newStatus: MechanicStatus) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/mechanics/${mechanicId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setMechanic((prev: any) => ({ ...prev, status: newStatus }));
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(false);
    }
  };

  if (!mechanicId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-[#0e1628] p-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-base">
              {mechanic?.name?.charAt(0) || "M"}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{mechanic?.name || "Technician"}</h3>
              <p className="text-xs text-zinc-400">Mobile Service Fleet Master Record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading || !mechanic ? (
          <div className="py-16 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto" />
            <p className="text-xs text-zinc-400 mt-2">Loading technician profile...</p>
          </div>
        ) : (
          <div className="space-y-5 text-xs">
            {/* Top Stat Ribbon */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Status</span>
                <div className="mt-1 font-bold text-emerald-400">{mechanic.status}</div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Rating</span>
                <div className="mt-1 font-bold text-amber-400 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>{mechanic.rating} ★</span>
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Jobs Done</span>
                <div className="mt-1 font-bold text-white">{mechanic.jobsCompleted}</div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Reviews</span>
                <div className="mt-1 font-bold text-zinc-300">{mechanic.totalReviews}</div>
              </div>
            </div>

            {/* Quick Status Toggler (for ops) */}
            {role !== "VIEWER" && (
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 flex items-center justify-between">
                <span className="font-semibold text-zinc-300">Update Fleet Status:</span>
                <div className="flex items-center gap-1.5">
                  {(["AVAILABLE", "BUSY", "ON_BREAK", "OFFLINE"] as MechanicStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      disabled={statusUpdating || mechanic.status === st}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                        mechanic.status === st
                          ? "bg-blue-600 text-white"
                          : "border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      } disabled:opacity-50`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contact & Equipment Info */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-2">
              <h4 className="font-semibold text-white">Contact & Mobile Rig</h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-zinc-300">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{mechanic.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{mechanic.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{mechanic.vehicleType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{mechanic.address}</span>
                </div>
              </div>
            </div>

            {/* Completed Work History */}
            <div>
              <h4 className="font-semibold text-white mb-2">Recent Completed Work Orders</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {mechanic.history && mechanic.history.length > 0 ? (
                  mechanic.history.map((h: any) => (
                    <div
                      key={h.id}
                      onClick={() => {
                        setSelectedBookingId(h.id);
                        onClose();
                      }}
                      className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 hover:border-zinc-700 hover:bg-zinc-900 cursor-pointer transition"
                    >
                      <div>
                        <div className="font-semibold text-zinc-200">
                          {h.id} · {h.service?.name}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          Customer: {h.customer?.name} · {formatDate(h.scheduledAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-400">{formatCurrency(h.amount)}</div>
                        <div className="text-[10px] text-amber-400">{h.rating ? `${h.rating}★` : "Completed"}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-center py-4">No recent history recorded.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
