"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { SSEEventPayload, UserRole } from "./types";

interface NotificationItem {
  id: string;
  type: "info" | "success" | "warning" | "emergency";
  title: string;
  message: string;
  timestamp: Date;
  bookingId?: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  sseConnected: boolean;
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationsAsRead: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isSimulating: boolean;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
  toggleSimulation: () => void;
  triggerEmergency: () => Promise<void>;
  selectedBookingId: string | null;
  setSelectedBookingId: (id: string | null) => void;
  selectedMechanicId: string | null;
  setSelectedMechanicId: (id: string | null) => void;
  isCreateBookingOpen: boolean;
  setIsCreateBookingOpen: (open: boolean) => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>("OPERATIONS");
  const [sseConnected, setSseConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simSpeed, setSimSpeed] = useState<number>(3000); // 3 seconds default
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedMechanicId, setSelectedMechanicId] = useState<string | null>(null);
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const simIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // Web Audio sound effects synthesizer (zero external mp3 assets required)
  const playChime = useCallback((type: "ping" | "emergency" | "success") => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "emergency") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === "success") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      // Audio context might be restricted by browser policy before first interaction
    }
  }, [soundEnabled]);

  const addNotification = useCallback(
    (item: Omit<NotificationItem, "id" | "timestamp">) => {
      const newNotif: NotificationItem = {
        ...item,
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date(),
      };

      setNotifications((prev) => [newNotif, ...prev.slice(0, 49)]);
      setUnreadCount((c) => c + 1);

      if (item.type === "emergency") {
        playChime("emergency");
      } else if (item.type === "success") {
        playChime("success");
      } else {
        playChime("ping");
      }
    },
    [playChime]
  );

  const markNotificationsAsRead = () => {
    setUnreadCount(0);
  };

  // Setup Server-Sent Events listener
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource("/api/events");

        eventSource.onopen = () => {
          setSseConnected(true);
        };

        eventSource.onmessage = (event) => {
          try {
            const payload: SSEEventPayload = JSON.parse(event.data);
            triggerRefresh();

            if (payload.type === "EMERGENCY_DISPATCH") {
              addNotification({
                type: "emergency",
                title: "🚨 Emergency Roadside Assist",
                message: `Priority emergency booking ${payload.data.id} dispatched!`,
                bookingId: payload.data.id,
              });
            } else if (payload.type === "BOOKING_CREATED") {
              addNotification({
                type: "info",
                title: "New Booking Placed",
                message: `${payload.data.customer?.name || "Customer"} booked ${payload.data.service?.name || "service"}`,
                bookingId: payload.data.id,
              });
            } else if (payload.type === "BOOKING_UPDATED") {
              const status = payload.data.status;
              const isCompleted = status === "COMPLETED";
              addNotification({
                type: isCompleted ? "success" : "info",
                title: `Booking ${payload.data.id} ${status}`,
                message: `Status updated for ${payload.data.customer?.name || "work order"}`,
                bookingId: payload.data.id,
              });
            }
          } catch (e) {
            console.error("Error parsing SSE data:", e);
          }
        };

        eventSource.onerror = () => {
          setSseConnected(false);
          eventSource?.close();
          reconnectTimeout = setTimeout(connectSSE, 4000);
        };
      } catch (err) {
        setSseConnected(false);
        reconnectTimeout = setTimeout(connectSSE, 4000);
      }
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [addNotification, triggerRefresh]);

  // Simulation execution loop
  useEffect(() => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }

    if (isSimulating) {
      simIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch("/api/simulation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "tick" }),
          });
          const data = await res.json();
          if (data.result && data.result.action !== "NO_OP") {
            triggerRefresh();
          }
        } catch (e) {
          console.error("Simulation tick error:", e);
        }
      }, simSpeed);
    }

    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, [isSimulating, simSpeed, triggerRefresh]);

  const toggleSimulation = () => {
    setIsSimulating((prev) => !prev);
  };

  const triggerEmergency = async () => {
    try {
      const res = await fetch("/api/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "emergency" }),
      });
      const data = await res.json();
      if (data.data) {
        setSelectedBookingId(data.data.id);
        triggerRefresh();
      }
    } catch (e) {
      console.error("Failed to inject emergency:", e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        sseConnected,
        notifications,
        unreadCount,
        markNotificationsAsRead,
        soundEnabled,
        setSoundEnabled,
        isSimulating,
        simSpeed,
        setSimSpeed,
        toggleSimulation,
        triggerEmergency,
        selectedBookingId,
        setSelectedBookingId,
        selectedMechanicId,
        setSelectedMechanicId,
        isCreateBookingOpen,
        setIsCreateBookingOpen,
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
