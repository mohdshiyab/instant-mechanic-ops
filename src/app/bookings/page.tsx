"use client";

import React from "react";
import { BookingsTable } from "@/components/bookings/BookingsTable";
import { useApp } from "@/lib/context";
import { CalendarCheck, PlusCircle } from "lucide-react";

export default function BookingsPage() {
  const { setIsCreateBookingOpen, role } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Work Orders & Booking Queue</h1>
            <p className="text-xs text-zinc-400">
              Manage dispatch assignments, vehicle telemetry, customer invoicing, and status lifecycles
            </p>
          </div>
        </div>

        {role !== "VIEWER" && (
          <button
            onClick={() => setIsCreateBookingOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-500/25 transition active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Booking</span>
          </button>
        )}
      </div>

      <BookingsTable />
    </div>
  );
}
