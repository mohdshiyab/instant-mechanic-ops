"use client";

import React from "react";
import { CustomersView } from "@/components/customers/CustomersView";
import { Users } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Customer Profiles & Fleet Garage</h1>
            <p className="text-xs text-zinc-400">
              Registered customers, verified vehicles, lifetime spend, and service history
            </p>
          </div>
        </div>
      </div>

      <CustomersView />
    </div>
  );
}
