"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/context";
import { BookingType, BookingStatus, MechanicType } from "@/lib/types";
import {
  formatCurrency,
  formatDate,
  getStatusBadge,
  getPriorityBadge,
  getMechanicStatusBadge,
} from "@/lib/utils";
import {
  X,
  User,
  Car,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  Printer,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export function BookingDetailDrawer() {
  const { selectedBookingId, setSelectedBookingId, triggerRefresh, role } = useApp();

  const [booking, setBooking] = useState<BookingType | null>(null);
  const [mechanics, setMechanics] = useState<MechanicType[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedMechanicToAssign, setSelectedMechanicToAssign] = useState("");
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    if (!selectedBookingId) {
      setBooking(null);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const [bRes, mRes] = await Promise.all([
          fetch(`/api/bookings/${selectedBookingId}`),
          fetch(`/api/mechanics`),
        ]);
        const bData = await bRes.json();
        const mData = await mRes.json();
        if (bData.success) setBooking(bData.data);
        if (mData.success) setMechanics(mData.data);
      } catch (err) {
        console.error("Failed to load booking detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [selectedBookingId]);

  if (!selectedBookingId) return null;

  const handleUpdateStatus = async (status: BookingStatus) => {
    if (!booking) return;
    setActionLoading(true);
    try {
      const payload: any = { status };
      if (selectedMechanicToAssign) {
        payload.mechanicId = selectedMechanicToAssign;
      }
      if (noteInput.trim()) {
        payload.note = noteInput.trim();
      }

      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setBooking(data.data);
        setNoteInput("");
        triggerRefresh();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const statusBadge = booking ? getStatusBadge(booking.status) : null;
  const priorityBadge = booking ? getPriorityBadge(booking.priority) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-16">
        <div className="w-screen max-w-2xl border-l border-zinc-800 bg-[#0e1628] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 p-5 bg-zinc-950/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold text-sm">
                IM
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-lg">{booking?.id || "Loading..."}</h3>
                  {priorityBadge && (
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold border ${priorityBadge.bg}`}
                    >
                      {priorityBadge.label}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400">Work Order & Telematics Dossier</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white transition"
              >
                <Printer className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Print Receipt</span>
              </button>
              <button
                onClick={() => setSelectedBookingId(null)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {loading || !booking ? (
              <div className="space-y-4 py-12 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto" />
                <p className="text-xs text-zinc-400">Fetching live work order telemetry...</p>
              </div>
            ) : (
              <>
                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4">
                  <div>
                    <span className="text-[11px] text-zinc-400">Current Lifecycle Status</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${statusBadge?.bg}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${statusBadge?.dot}`} />
                        {statusBadge?.label}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-zinc-400">Service Fee (Total)</span>
                    <div className="mt-0.5 text-lg font-bold text-emerald-400">
                      {formatCurrency(booking.amount)}
                    </div>
                  </div>
                </div>

                {/* Operations Control Action Buttons */}
                {role !== "VIEWER" && (
                  <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                        Operational Dispatch Control
                      </h4>
                      <span className="text-[10px] text-zinc-400">Instant State Mutation</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs font-semibold">
                      <button
                        onClick={() => handleUpdateStatus("ASSIGNED")}
                        disabled={actionLoading || booking.status === "ASSIGNED"}
                        className="rounded-lg bg-amber-600/80 py-2 text-white hover:bg-amber-500 disabled:opacity-40 transition"
                      >
                        Assign Tech
                      </button>
                      <button
                        onClick={() => handleUpdateStatus("EN_ROUTE")}
                        disabled={actionLoading || booking.status === "EN_ROUTE"}
                        className="rounded-lg bg-indigo-600/80 py-2 text-white hover:bg-indigo-500 disabled:opacity-40 transition"
                      >
                        Send En Route
                      </button>
                      <button
                        onClick={() => handleUpdateStatus("IN_PROGRESS")}
                        disabled={actionLoading || booking.status === "IN_PROGRESS"}
                        className="rounded-lg bg-cyan-600/80 py-2 text-white hover:bg-cyan-500 disabled:opacity-40 transition"
                      >
                        Start Work
                      </button>
                      <button
                        onClick={() => handleUpdateStatus("COMPLETED")}
                        disabled={actionLoading || booking.status === "COMPLETED"}
                        className="rounded-lg bg-emerald-600/80 py-2 text-white hover:bg-emerald-500 disabled:opacity-40 transition"
                      >
                        Complete Order
                      </button>
                    </div>

                    {/* Reassign mechanic picker if unassigned or needed */}
                    <div className="flex items-center gap-2 pt-2 border-t border-blue-900/30">
                      <label className="text-xs text-zinc-300 font-medium whitespace-nowrap">
                        Assign Technician:
                      </label>
                      <select
                        value={selectedMechanicToAssign || booking.mechanicId || ""}
                        onChange={(e) => setSelectedMechanicToAssign(e.target.value)}
                        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Choose technician...</option>
                        {mechanics.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.status} · {m.rating}★)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Customer & Vehicle Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Customer Card */}
                  <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/50 p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                      <User className="h-4 w-4 text-blue-400" />
                      <span>Customer Profile</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {booking.customer?.name}
                    </div>
                    <div className="space-y-1 text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{booking.customer?.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{booking.customer?.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{booking.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Card */}
                  <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/50 p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                      <Car className="h-4 w-4 text-cyan-400" />
                      <span>Vehicle Information</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {booking.vehicle?.year} {booking.vehicle?.make} {booking.vehicle?.model}
                    </div>
                    <div className="space-y-1 text-xs text-zinc-400">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">License Plate:</span>
                        <span className="font-mono font-bold text-zinc-200">
                          {booking.vehicle?.licensePlate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">VIN:</span>
                        <span className="font-mono text-zinc-300">{booking.vehicle?.vin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Fuel / Power:</span>
                        <span className="text-zinc-300">{booking.vehicle?.fuelType}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Technician Card */}
                <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/50 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                      <Wrench className="h-4 w-4 text-indigo-400" />
                      <span>Assigned Mobile Technician</span>
                    </div>
                    {booking.mechanic && (
                      <span className="text-xs font-bold text-amber-400">
                        {booking.mechanic.rating} ★ ({booking.mechanic.jobsCompleted} jobs)
                      </span>
                    )}
                  </div>

                  {booking.mechanic ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{booking.mechanic.name}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">
                          {booking.mechanic.vehicleType} · {booking.mechanic.phone}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                          getMechanicStatusBadge(booking.mechanic.status).bg
                        }`}
                      >
                        {booking.mechanic.status}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-amber-400 py-1">
                      No technician currently assigned. Use the control panel above to dispatch a technician.
                    </div>
                  )}
                </div>

                {/* Service Details & Invoice Breakdown */}
                <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/50 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <span>Work Order & Pricing Breakdown</span>
                  </div>

                  <div className="divide-y divide-zinc-800 text-xs">
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-zinc-200">{booking.service?.name}</span>
                      <span className="text-zinc-200">
                        {formatCurrency(booking.service?.basePrice || 100)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-zinc-400">Mobile On-Site Dispatch & Environmental Fee</span>
                      <span className="text-zinc-400">
                        {formatCurrency(Math.max(0, booking.amount - (booking.service?.basePrice || 0)))}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 font-bold text-sm text-white">
                      <span>Total Amount Settled</span>
                      <span className="text-emerald-400">{formatCurrency(booking.amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Timeline History */}
                <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/50 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    <span>Dispatch Audit Timeline</span>
                  </div>

                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                    {booking.timeline && booking.timeline.length > 0 ? (
                      booking.timeline.map((t, idx) => (
                        <div key={t.id || idx} className="relative">
                          <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-[#0e1628]" />
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-zinc-200">{t.status}</span>
                              <span className="text-[10px] text-zinc-500">{formatDate(t.timestamp)}</span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-0.5">{t.note}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-zinc-500">No timeline entries yet.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
