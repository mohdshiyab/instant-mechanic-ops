"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MechanicType, BookingType } from "@/lib/types";
import { getMechanicStatusBadge } from "@/lib/utils";
import { useApp } from "@/lib/context";
import {
  Search,
  Map as MapIcon,
  LayoutGrid,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle2,
  Car,
  Eye,
  Radio,
  Sparkles,
} from "lucide-react";
import { LiveFleetMap } from "./LiveFleetMap";
import { MechanicDetailModal } from "./MechanicDetailModal";

export function MechanicFleetView() {
  const { setSelectedBookingId, refreshKey, role } = useApp();

  const [mechanics, setMechanics] = useState<MechanicType[]>([]);
  const [activeBookings, setActiveBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"map" | "grid">("map");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedMechanicId, setSelectedMechanicId] = useState<string | null>(null);

  const fetchMechanics = useCallback(async () => {
    setLoading(true);
    try {
      const [mRes, bRes] = await Promise.all([
        fetch(`/api/mechanics?status=${statusFilter}&search=${encodeURIComponent(search)}`),
        fetch(`/api/bookings?limit=50`),
      ]);
      const mData = await mRes.json();
      const bData = await bRes.json();
      if (mData.success) setMechanics(mData.data);
      if (bData.success) setActiveBookings(bData.data);
    } catch (err) {
      console.error("Failed to load mechanics fleet:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchMechanics();
  }, [fetchMechanics, refreshKey]);

  return (
    <div className="space-y-4">
      {/* Top Header & View Toggle */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search mechanics by name, skill, territory, vehicle rig..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* View Mode & Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs font-medium text-zinc-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="EN_ROUTE">En Route</option>
            <option value="BUSY">On Job</option>
            <option value="ON_BREAK">On Break</option>
            <option value="OFFLINE">Offline</option>
          </select>

          <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950 p-1">
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition ${
                viewMode === "map"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <MapIcon className="h-3.5 w-3.5" />
              <span>Live GPS Map</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Fleet Cards ({mechanics.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === "map" ? (
        <LiveFleetMap
          mechanics={mechanics}
          bookings={activeBookings}
          onSelectMechanic={(id) => setSelectedMechanicId(id)}
          onSelectBooking={(id) => setSelectedBookingId(id)}
        />
      ) : (
        /* Grid of Fleet Cards */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5"
              />
            ))
          ) : mechanics.length === 0 ? (
            <div className="col-span-full py-16 text-center text-zinc-500">
              No mechanics found matching your filters.
            </div>
          ) : (
            mechanics.map((mech) => {
              const badge = getMechanicStatusBadge(mech.status);
              const specialtiesList = Array.isArray(mech.specialties)
                ? mech.specialties
                : typeof mech.specialties === "string"
                ? JSON.parse(mech.specialties)
                : [];

              return (
                <div
                  key={mech.id}
                  onClick={() => setSelectedMechanicId(mech.id)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 shadow-lg shadow-black/20 transition hover:border-zinc-700/80 hover:bg-zinc-800/30 cursor-pointer"
                >
                  <div>
                    {/* Top Row: Name & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-sm">
                          {mech.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm group-hover:text-blue-300 transition">
                            {mech.name}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold mt-0.5">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span>{mech.rating}</span>
                            <span className="text-zinc-500">({mech.totalReviews} reviews)</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${badge.bg}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                        {badge.label}
                      </span>
                    </div>

                    {/* Vehicle Rig & Address */}
                    <div className="mt-4 space-y-1.5 text-xs text-zinc-400">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Car className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="truncate">{mech.vehicleType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="truncate">{mech.address}</span>
                      </div>
                    </div>

                    {/* Specialties Badges */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {specialtiesList.slice(0, 3).map((spec: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-300 border border-zinc-700/40"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer: Completed Jobs & Action */}
                  <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-3 text-xs">
                    <span className="text-zinc-400">
                      Completed: <b className="text-zinc-200">{mech.jobsCompleted}</b> jobs
                    </span>
                    <button className="flex items-center gap-1 font-semibold text-blue-400 group-hover:text-blue-300 transition">
                      <span>Dossier</span>
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Mechanic Detail Modal */}
      {selectedMechanicId && (
        <MechanicDetailModal
          mechanicId={selectedMechanicId}
          onClose={() => setSelectedMechanicId(null)}
        />
      )}
    </div>
  );
}
