"use client";

import React, { useState, useEffect } from "react";
import { CustomerType } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useApp } from "@/lib/context";
import {
  Search,
  Users,
  Car,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  MapPin,
  X,
  Eye,
  ShieldCheck,
} from "lucide-react";

export function CustomersView() {
  const { setSelectedBookingId, refreshKey } = useApp();

  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerDetail, setCustomerDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/customers?search=${encodeURIComponent(search)}&limit=50`);
        const json = await res.json();
        if (json.success) setCustomers(json.data);
      } catch (err) {
        console.error("Failed to load customers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [search, refreshKey]);

  useEffect(() => {
    if (!selectedCustomerId) {
      setCustomerDetail(null);
      return;
    }

    const fetchCustomerDetail = async () => {
      setDetailLoading(true);
      try {
        const res = await fetch(`/api/customers/${selectedCustomerId}`);
        const json = await res.json();
        if (json.success) setCustomerDetail(json.data);
      } catch (err) {
        console.error("Failed to load customer detail:", err);
      } finally {
        setDetailLoading(false);
      }
    };

    fetchCustomerDetail();
  }, [selectedCustomerId]);

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <span className="text-xs text-zinc-400 font-medium">
          Total Registered: <b className="text-zinc-200">{customers.length}</b>
        </span>
      </div>

      {/* Customers Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/60 shadow-xl shadow-black/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Contact Details</th>
                <th className="px-4 py-3.5">Registered Vehicles</th>
                <th className="px-4 py-3.5">Total Bookings</th>
                <th className="px-4 py-3.5">Lifetime Spend</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-6 w-full rounded bg-zinc-800/40" />
                    </td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((c: any) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomerId(c.id)}
                    className="group cursor-pointer transition hover:bg-blue-600/5 hover:text-white"
                  >
                    {/* Name */}
                    <td className="px-4 py-3.5 font-semibold text-white whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-100 group-hover:text-blue-300 transition">
                            {c.name}
                          </div>
                          <div className="text-[10px] text-zinc-500">{c.city}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5">
                        <div className="text-zinc-200">{c.email}</div>
                        <div className="text-[11px] text-zinc-400">{c.phone}</div>
                      </div>
                    </td>

                    {/* Vehicles */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {c.vehicles?.map((v: any) => (
                          <span
                            key={v.id}
                            className="inline-flex items-center gap-1 rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-200 border border-zinc-700/50"
                          >
                            <Car className="h-3 w-3 text-zinc-400" />
                            {v.year} {v.make} {v.model}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Bookings Count */}
                    <td className="px-4 py-3.5 whitespace-nowrap font-medium text-zinc-200">
                      {c._count?.bookings || 0} bookings
                    </td>

                    {/* Total Spend */}
                    <td className="px-4 py-3.5 font-bold text-emerald-400 whitespace-nowrap">
                      {formatCurrency(c.totalSpent || 0)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomerId(c.id);
                        }}
                        className="rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Drawer / Modal */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-[#0e1628] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                  {customerDetail?.name?.charAt(0) || "C"}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{customerDetail?.name}</h3>
                  <p className="text-xs text-zinc-400">{customerDetail?.email} · {customerDetail?.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailLoading || !customerDetail ? (
              <div className="py-12 text-center text-xs text-zinc-400">Loading customer file...</div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Vehicle Fleet */}
                <div>
                  <h4 className="font-semibold text-white mb-2">Registered Vehicles & Garage</h4>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {customerDetail.vehicles?.map((v: any) => (
                      <div
                        key={v.id}
                        className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 space-y-1"
                      >
                        <div className="font-semibold text-white">
                          {v.year} {v.make} {v.model}
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Plate: <b className="text-zinc-200 font-mono">{v.licensePlate}</b></span>
                          <span>{v.fuelType}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">VIN: {v.vin}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking History */}
                <div>
                  <h4 className="font-semibold text-white mb-2">Service Booking History</h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {customerDetail.bookings?.map((b: any) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          setSelectedBookingId(b.id);
                          setSelectedCustomerId(null);
                        }}
                        className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 hover:border-zinc-700 hover:bg-zinc-900 cursor-pointer transition"
                      >
                        <div>
                          <div className="font-semibold text-zinc-200">
                            {b.id} · {b.service?.name}
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            {formatDate(b.scheduledAt)} · Tech: {b.mechanic?.name || "Unassigned"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-emerald-400">{formatCurrency(b.amount)}</div>
                          <div className="text-[10px] text-zinc-400 font-semibold">{b.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
