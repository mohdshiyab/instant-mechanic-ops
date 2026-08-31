"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/context";
import { CustomerType, MechanicType, ServiceType } from "@/lib/types";
import { X, PlusCircle, AlertTriangle, Car, Wrench, DollarSign, MapPin } from "lucide-react";

export function CreateBookingModal() {
  const { isCreateBookingOpen, setIsCreateBookingOpen, triggerRefresh, setSelectedBookingId } =
    useApp();

  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [mechanics, setMechanics] = useState<MechanicType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedMechanicId, setSelectedMechanicId] = useState("");
  const [priority, setPriority] = useState<"STANDARD" | "HIGH" | "EMERGENCY">("STANDARD");
  const [address, setAddress] = useState("350 5th Ave, New York, NY");
  const [amount, setAmount] = useState<number>(150);
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isCreateBookingOpen) return;

    const loadFormData = async () => {
      setLoading(true);
      try {
        const [cRes, mRes, aRes] = await Promise.all([
          fetch("/api/customers?limit=50"),
          fetch("/api/mechanics"),
          fetch("/api/analytics"),
        ]);
        const cData = await cRes.json();
        const mData = await mRes.json();

        if (cData.success && cData.data.length > 0) {
          setCustomers(cData.data);
          setSelectedCustomerId(cData.data[0].id);
          if (cData.data[0].vehicles?.length > 0) {
            setSelectedVehicleId(cData.data[0].vehicles[0].id);
          }
        }
        if (mData.success) {
          setMechanics(mData.data);
        }
      } catch (err) {
        console.error("Failed to load create booking dependencies:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFormData();
  }, [isCreateBookingOpen]);

  // When customer changes, pick first vehicle
  const handleCustomerChange = (custId: string) => {
    setSelectedCustomerId(custId);
    const found = customers.find((c) => c.id === custId);
    if (found && found.vehicles && found.vehicles.length > 0) {
      setSelectedVehicleId(found.vehicles[0].id);
      setAddress(found.address || "Manhattan, NY");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedVehicleId) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          vehicleId: selectedVehicleId,
          serviceId: selectedServiceId || "FULL_OIL_SERVICE",
          mechanicId: selectedMechanicId || null,
          priority,
          address,
          amount: Number(amount),
          paymentMethod,
          notes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsCreateBookingOpen(false);
        triggerRefresh();
        setSelectedBookingId(json.data.id);
      }
    } catch (err) {
      console.error("Failed to submit booking:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isCreateBookingOpen) return null;

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-[#0e1628] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Create Vehicle Service Order</h3>
              <p className="text-xs text-zinc-400">Manual dispatch & work order registration</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateBookingOpen(false)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Customer Selection */}
          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">Registered Customer</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => handleCustomerChange(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Selection */}
          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">Vehicle</label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              {currentCustomer?.vehicles?.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.year} {v.make} {v.model} - [{v.licensePlate}]
                </option>
              ))}
            </select>
          </div>

          {/* Priority & Service Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Priority Tier</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="STANDARD">Standard Service</option>
                <option value="HIGH">High Priority</option>
                <option value="EMERGENCY">🚨 Emergency Roadside</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Assign Technician</label>
              <select
                value={selectedMechanicId}
                onChange={(e) => setSelectedMechanicId(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Leave Unassigned (Pending Queue)</option>
                {mechanics.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.status} · {m.rating}★)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address & Amount */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-zinc-300 mb-1.5">Service Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1.5">Fee Amount ($)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={20}
                required
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">Dispatch Instructions / Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Park in driveway bay, customer requested key under mat."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsCreateBookingOpen(false)}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-500/25 transition disabled:opacity-50"
            >
              {submitting ? "Dispatching..." : "Create & Dispatch Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
