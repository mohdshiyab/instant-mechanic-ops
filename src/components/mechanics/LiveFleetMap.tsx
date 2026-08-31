"use client";

import React, { useEffect, useRef, useState } from "react";
import { MechanicType, BookingType } from "@/lib/types";
import { formatCurrency, getMechanicStatusBadge } from "@/lib/utils";
import { MapPin, Navigation, Wrench, AlertTriangle, Radio, Phone, ShieldCheck } from "lucide-react";

interface LiveFleetMapProps {
  mechanics: MechanicType[];
  bookings?: BookingType[];
  onSelectMechanic?: (id: string) => void;
  onSelectBooking?: (id: string) => void;
}

export function LiveFleetMap({
  mechanics,
  bookings = [],
  onSelectMechanic,
  onSelectBooking,
}: LiveFleetMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [mapReady, setMapReady] = useState(false);

  // Initialize Leaflet Map dynamically
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Center around NYC Metro (or average coordinates)
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [40.7505, -73.9850],
          zoom: 12,
          zoomControl: true,
        });

        // Dark-themed OpenStreetMap tiles (CartoDB Dark Matter)
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
            maxZoom: 19,
          }
        ).addTo(map);

        mapInstanceRef.current = map;
        setMapReady(true);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when mechanics or filter changes
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const updateMarkers = async () => {
      const L = (await import("leaflet")).default;
      const map = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const filteredMechanics =
        statusFilter === "ALL"
          ? mechanics
          : mechanics.filter((m) => m.status === statusFilter);

      // 1. Add Mechanic Markers
      filteredMechanics.forEach((mech) => {
        const isEnRoute = mech.status === "EN_ROUTE";
        const isBusy = mech.status === "BUSY";
        const isAvailable = mech.status === "AVAILABLE";

        const markerColor = isAvailable
          ? "#10b981"
          : isEnRoute
          ? "#6366f1"
          : isBusy
          ? "#06b6d4"
          : "#71717a";

        const customIcon = L.divIcon({
          className: "custom-map-pin",
          html: `
            <div style="
              background-color: ${markerColor};
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 4px 10px rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 13px;
              font-weight: bold;
              ${isEnRoute ? "animation: radar-pulse 1.5s infinite;" : ""}
            ">
              🔧
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([mech.latitude, mech.longitude], { icon: customIcon }).addTo(map);

        const popupContent = `
          <div style="min-width: 190px; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <b style="font-size: 13px; color: #f8fafc;">${mech.name}</b>
              <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${markerColor}22; color: ${markerColor};">${mech.status}</span>
            </div>
            <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 4px;">
              🚗 ${mech.vehicleType}
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">
              ⭐ ${mech.rating} Rating · ${mech.jobsCompleted} Completed
            </div>
            <div style="font-size: 10px; color: #64748b;">
              📍 ${mech.address}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on("click", () => {
          if (onSelectMechanic) onSelectMechanic(mech.id);
        });

        markersRef.current.push(marker);

        // If En Route and has active booking, draw route line to customer location
        if (mech.activeBooking && mech.activeBooking.latitude && mech.activeBooking.longitude) {
          const polyline = L.polyline(
            [
              [mech.latitude, mech.longitude],
              [mech.activeBooking.latitude, mech.activeBooking.longitude],
            ],
            {
              color: "#6366f1",
              weight: 3,
              opacity: 0.8,
              dashArray: "6, 8",
            }
          ).addTo(map);
          markersRef.current.push(polyline);
        }
      });

      // 2. Add Active Breakdown Locations
      bookings
        .filter((b) => ["PENDING", "ASSIGNED", "EN_ROUTE", "IN_PROGRESS"].includes(b.status))
        .forEach((booking) => {
          const isEmergency = booking.priority === "EMERGENCY";

          const incidentIcon = L.divIcon({
            className: "incident-map-pin",
            html: `
              <div style="
                background-color: ${isEmergency ? "#ef4444" : "#f59e0b"};
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 0 12px ${isEmergency ? "rgba(239,68,68,0.8)" : "rgba(245,158,11,0.5)"};
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 13px;
                font-weight: bold;
                ${isEmergency ? "animation: radar-pulse 1.2s infinite;" : ""}
              ">
                ${isEmergency ? "🚨" : "📍"}
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const incMarker = L.marker([booking.latitude, booking.longitude], {
            icon: incidentIcon,
          }).addTo(map);

          const popupContent = `
            <div style="min-width: 190px; padding: 4px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <b style="font-size: 13px; color: #f8fafc;">${booking.id}</b>
                <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${isEmergency ? "#ef4444" : "#f59e0b"}22; color: ${isEmergency ? "#ef4444" : "#f59e0b"};">${booking.priority}</span>
              </div>
              <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 2px;">
                👤 ${booking.customer?.name || "Customer"}
              </div>
              <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">
                🔧 ${booking.service?.name || "Service"}
              </div>
              <div style="font-size: 10px; color: #64748b;">
                📍 ${booking.address}
              </div>
            </div>
          `;

          incMarker.bindPopup(popupContent);
          incMarker.on("click", () => {
            if (onSelectBooking) onSelectBooking(booking.id);
          });

          markersRef.current.push(incMarker);
        });
    };

    updateMarkers();
  }, [mapReady, mechanics, bookings, statusFilter, onSelectMechanic, onSelectBooking]);

  const availableCount = mechanics.filter((m) => m.status === "AVAILABLE").length;
  const enRouteCount = mechanics.filter((m) => m.status === "EN_ROUTE").length;
  const busyCount = mechanics.filter((m) => m.status === "BUSY").length;

  return (
    <div className="relative h-[650px] w-full overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-950 shadow-xl shadow-black/40">
      {/* Map Element */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Floating Telemetry & Filter Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-900/90 p-2 backdrop-blur-md shadow-lg text-xs">
        <div className="flex items-center gap-1.5 px-2 font-bold text-white border-r border-zinc-700 pr-3">
          <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span>Fleet Radar</span>
        </div>

        <button
          onClick={() => setStatusFilter("ALL")}
          className={`rounded-lg px-2.5 py-1 font-medium transition ${
            statusFilter === "ALL" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          All ({mechanics.length})
        </button>

        <button
          onClick={() => setStatusFilter("AVAILABLE")}
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition ${
            statusFilter === "AVAILABLE"
              ? "bg-emerald-600 text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Available ({availableCount})
        </button>

        <button
          onClick={() => setStatusFilter("EN_ROUTE")}
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition ${
            statusFilter === "EN_ROUTE"
              ? "bg-indigo-600 text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          En Route ({enRouteCount})
        </button>

        <button
          onClick={() => setStatusFilter("BUSY")}
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition ${
            statusFilter === "BUSY" ? "bg-cyan-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          On Job ({busyCount})
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 right-4 z-20 rounded-xl border border-zinc-700/80 bg-zinc-900/90 p-3 backdrop-blur-md shadow-lg text-[11px] space-y-1.5">
        <div className="font-bold text-zinc-200 mb-1">Radar Legend</div>
        <div className="flex items-center gap-2 text-zinc-300">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span>Available Unit</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span>En Route with Live Route</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
          <span>🚨 Emergency Breakdown Pin</span>
        </div>
      </div>
    </div>
  );
}
