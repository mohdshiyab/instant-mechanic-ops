"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Wrench,
  Users,
  BarChart3,
  FileCode2,
  Radio,
  Sparkles,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Live Overview",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Bookings & Orders",
      href: "/bookings",
      icon: CalendarCheck,
    },
    {
      label: "Mechanics Fleet & Map",
      href: "/mechanics",
      icon: Wrench,
    },
    {
      label: "Customers",
      href: "/customers",
      icon: Users,
    },
    {
      label: "Analytics & BI",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      label: "API Docs (Swagger)",
      href: "/docs",
      icon: FileCode2,
    },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-800/80 bg-[#0c111e] md:flex md:flex-col">
      {/* Navigation section */}
      <div className="flex-1 space-y-1.5 p-4">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
          Operations Hub
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/20"
                  : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
              }`}
            >
              <Icon
                className={`h-4 w-4 transition ${
                  isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Operations Telemetry Footer Card */}
      <div className="p-4">
        <div className="rounded-xl border border-blue-900/40 bg-gradient-to-br from-blue-950/40 to-indigo-950/30 p-3.5 text-xs text-zinc-300">
          <div className="flex items-center gap-2 font-semibold text-blue-400">
            <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span>Instant Dispatch v2.0</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
            Live telematics connected. 25 mobile workshop units online in NY Metro territory.
          </p>
        </div>
      </div>
    </aside>
  );
}
