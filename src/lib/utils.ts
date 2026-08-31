import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { BookingStatus, MechanicStatus, PriorityLevel } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "N/A";
  return format(d, "MMM dd, yyyy · hh:mm a");
}

export function formatShortDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "N/A";
  return format(d, "MMM dd, yyyy");
}

export function formatTimeAgo(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "N/A";
  return formatDistanceToNow(d, { addSuffix: true });
}

export function getStatusBadge(status: BookingStatus | string) {
  switch (status) {
    case "COMPLETED":
      return {
        label: "Completed",
        bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        dot: "bg-emerald-500",
      };
    case "IN_PROGRESS":
      return {
        label: "In Progress",
        bg: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
        dot: "bg-cyan-500 animate-pulse",
      };
    case "EN_ROUTE":
      return {
        label: "En Route",
        bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        dot: "bg-indigo-400 animate-pulse",
      };
    case "ASSIGNED":
      return {
        label: "Assigned",
        bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        dot: "bg-amber-400",
      };
    case "PENDING":
      return {
        label: "Pending",
        bg: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        dot: "bg-orange-400 animate-ping",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        bg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        dot: "bg-rose-400",
      };
    default:
      return {
        label: status,
        bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
        dot: "bg-zinc-400",
      };
  }
}

export function getMechanicStatusBadge(status: MechanicStatus | string) {
  switch (status) {
    case "AVAILABLE":
      return {
        label: "Available",
        bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        dot: "bg-emerald-400",
      };
    case "EN_ROUTE":
      return {
        label: "En Route",
        bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        dot: "bg-indigo-400 animate-pulse",
      };
    case "BUSY":
      return {
        label: "On Job",
        bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        dot: "bg-cyan-400",
      };
    case "ON_BREAK":
      return {
        label: "On Break",
        bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        dot: "bg-amber-400",
      };
    case "OFFLINE":
      return {
        label: "Offline",
        bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
        dot: "bg-zinc-400",
      };
    default:
      return {
        label: status,
        bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
        dot: "bg-zinc-400",
      };
  }
}

export function getPriorityBadge(priority: PriorityLevel | string) {
  switch (priority) {
    case "EMERGENCY":
      return {
        label: "Emergency",
        bg: "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse",
      };
    case "HIGH":
      return {
        label: "High Priority",
        bg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      };
    default:
      return {
        label: "Standard",
        bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      };
  }
}
