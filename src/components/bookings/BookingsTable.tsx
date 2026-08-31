"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BookingType, BookingStatus } from "@/lib/types";
import {
  formatCurrency,
  formatDate,
  formatTimeAgo,
  getStatusBadge,
  getPriorityBadge,
} from "@/lib/utils";
import { useApp } from "@/lib/context";
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  User,
  Car,
  Clock,
  Sparkles,
} from "lucide-react";

export function BookingsTable() {
  const { setSelectedBookingId, refreshKey, role } = useApp();

  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters & Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("scheduledAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (priorityFilter !== "ALL") params.set("priority", priorityFilter);

      const res = await fetch(`/api/bookings?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setBookings(json.data);
        setTotal(json.pagination.total);
        setTotalPages(json.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter, priorityFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings, refreshKey]);

  // Export to CSV
  const handleExportCSV = () => {
    if (bookings.length === 0) return;

    const headers = [
      "Booking ID",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Vehicle Make & Model",
      "License Plate",
      "Service",
      "Assigned Mechanic",
      "Status",
      "Priority",
      "Amount ($)",
      "Payment Method",
      "Scheduled Date",
      "Address",
    ];

    const rows = bookings.map((b) => [
      b.id,
      `"${b.customer?.name || ""}"`,
      b.customer?.email || "",
      `"${b.customer?.phone || ""}"`,
      `"${b.vehicle ? `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}` : ""}"`,
      b.vehicle?.licensePlate || "",
      `"${b.service?.name || ""}"`,
      `"${b.mechanic?.name || "Unassigned"}"`,
      b.status,
      b.priority,
      b.amount.toFixed(2),
      b.paymentMethod,
      new Date(b.scheduledAt).toISOString(),
      `"${b.address || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `instant_mechanic_bookings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQuickStatusAdvance = async (b: BookingType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (role === "VIEWER") return;

    let nextStatus: BookingStatus = "COMPLETED";
    if (b.status === "PENDING") nextStatus = "ASSIGNED";
    else if (b.status === "ASSIGNED") nextStatus = "EN_ROUTE";
    else if (b.status === "EN_ROUTE") nextStatus = "IN_PROGRESS";
    else if (b.status === "IN_PROGRESS") nextStatus = "COMPLETED";

    try {
      await fetch(`/api/bookings/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Control / Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by ID, customer name, plate, vehicle..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs font-medium text-zinc-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="EN_ROUTE">En Route</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs font-medium text-zinc-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="STANDARD">Standard</option>
            <option value="HIGH">High Priority</option>
            <option value="EMERGENCY">🚨 Emergency</option>
          </select>

          {/* Sort By */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [col, dir] = e.target.value.split("-");
              setSortBy(col);
              setSortOrder(dir as "asc" | "desc");
            }}
            className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs font-medium text-zinc-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="scheduledAt-desc">Newest First</option>
            <option value="scheduledAt-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white transition active:scale-95"
            title="Download CSV of current results"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/60 shadow-xl shadow-black/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-4 py-3.5">Booking ID</th>
                <th className="px-4 py-3.5">Customer & Vehicle</th>
                <th className="px-4 py-3.5">Service</th>
                <th className="px-4 py-3.5">Technician</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Date / Time</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={8} className="px-4 py-4">
                      <div className="h-6 w-full rounded bg-zinc-800/40" />
                    </td>
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                    No bookings found matching your search or filters.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const statusBadge = getStatusBadge(booking.status);
                  const priorityBadge = getPriorityBadge(booking.priority);

                  return (
                    <tr
                      key={booking.id}
                      onClick={() => setSelectedBookingId(booking.id)}
                      className="group cursor-pointer transition hover:bg-blue-600/5 hover:text-white"
                    >
                      {/* Booking ID & Priority */}
                      <td className="px-4 py-3.5 font-semibold text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{booking.id}</span>
                          {booking.priority !== "STANDARD" && (
                            <span
                              className={`rounded px-1.5 py-0.5 text-[9px] font-bold border ${priorityBadge.bg}`}
                            >
                              {priorityBadge.label}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Customer & Vehicle */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-100 group-hover:text-blue-300 transition">
                            {booking.customer?.name || "Guest Customer"}
                          </span>
                          <span className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                            <Car className="h-3 w-3 text-zinc-500" />
                            {booking.vehicle
                              ? `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`
                              : "Vehicle details"}
                            {booking.vehicle && (
                              <span className="rounded bg-zinc-800 px-1 py-0.2 text-[10px] text-zinc-300 font-mono">
                                {booking.vehicle.licensePlate}
                              </span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <span className="font-medium text-zinc-200 line-clamp-1">
                          {booking.service?.name || "Vehicle Service"}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {booking.service?.category} · ~{booking.estimatedDurationMin}m
                        </span>
                      </td>

                      {/* Technician */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {booking.mechanic ? (
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-[11px] font-bold text-indigo-400 border border-indigo-500/30">
                              {booking.mechanic.name.charAt(0)}
                            </div>
                            <span className="font-medium text-zinc-200">
                              {booking.mechanic.name}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${statusBadge.bg}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusBadge.dot}`} />
                          {statusBadge.label}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5 font-semibold text-zinc-100 whitespace-nowrap">
                        {formatCurrency(booking.amount)}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-zinc-200">
                            {formatDate(booking.scheduledAt)}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {formatTimeAgo(booking.scheduledAt)}
                          </span>
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {role !== "VIEWER" && booking.status !== "COMPLETED" && booking.status !== "CANCELLED" && (
                            <button
                              onClick={(e) => handleQuickStatusAdvance(booking, e)}
                              className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-[10px] font-semibold text-blue-400 hover:bg-blue-500/20 transition"
                              title="Advance to next operational status"
                            >
                              Advance
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedBookingId(booking.id)}
                            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                            title="Inspect details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-zinc-800 px-4 py-3 text-xs text-zinc-400 sm:flex-row">
          <div>
            Showing <b className="text-zinc-200">{bookings.length > 0 ? (page - 1) * limit + 1 : 0}</b> to{" "}
            <b className="text-zinc-200">{Math.min(page * limit, total)}</b> of{" "}
            <b className="text-zinc-200">{total}</b> entries
          </div>

          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-300 focus:outline-none"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>

            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-2 font-medium text-zinc-200">
              Page {page} of {totalPages || 1}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
