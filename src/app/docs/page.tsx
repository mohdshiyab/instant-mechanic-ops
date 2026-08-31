"use client";

import React, { useState } from "react";
import { openApiSpec } from "@/lib/openapi-spec";
import {
  FileCode2,
  Download,
  Copy,
  Check,
  Send,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Shield,
  Layers,
} from "lucide-react";

export default function ApiDocsPage() {
  const [copied, setCopied] = useState(false);
  const [expandedEndpoints, setExpandedEndpoints] = useState<Record<string, boolean>>({
    "/api/dashboard-get": true,
    "/api/bookings-get": true,
  });
  const [responseOutputs, setResponseOutputs] = useState<Record<string, any>>({});
  const [loadingEndpoints, setLoadingEndpoints] = useState<Record<string, boolean>>({});

  const toggleEndpoint = (key: string) => {
    setExpandedEndpoints((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopySpec = () => {
    navigator.clipboard.writeText(JSON.stringify(openApiSpec, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSpec = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(openApiSpec, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "instant_mechanic_openapi_spec.json");
    dlAnchorElem.click();
  };

  const handleExecuteRequest = async (path: string, method: string) => {
    const key = `${path}-${method.toLowerCase()}`;
    setLoadingEndpoints((prev) => ({ ...prev, [key]: true }));
    try {
      let url = path;
      if (path === "/api/bookings/{id}") url = "/api/bookings/BK-1042";
      if (path === "/api/mechanics/{id}") url = "/api/mechanics";

      const res = await fetch(url, { method: method.toUpperCase() });
      const data = await res.json();
      setResponseOutputs((prev) => ({ ...prev, [key]: { status: res.status, data } }));
    } catch (err: any) {
      setResponseOutputs((prev) => ({ ...prev, [key]: { status: 500, error: err.message } }));
    } finally {
      setLoadingEndpoints((prev) => ({ ...prev, [key]: false }));
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "POST":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "PATCH":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "DELETE":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800/90 bg-gradient-to-r from-[#0e172a] via-[#101e38] to-[#0e172a] p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileCode2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">OpenAPI 3.1 & REST API Specification</h1>
              <p className="text-xs text-zinc-400">
                Interactive documentation for Instant Mechanic live operations endpoints
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySpec}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white transition"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Copied JSON" : "Copy OpenAPI Spec"}</span>
          </button>

          <button
            onClick={handleDownloadSpec}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span>Download Spec</span>
          </button>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-4">
        {Object.entries(openApiSpec.paths).map(([path, methods]) =>
          Object.entries(methods).map(([method, spec]: [string, any]) => {
            const endpointKey = `${path}-${method.toLowerCase()}`;
            const isExpanded = expandedEndpoints[endpointKey];
            const output = responseOutputs[endpointKey];
            const isLoading = loadingEndpoints[endpointKey];

            return (
              <div
                key={endpointKey}
                className="overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/60 shadow-lg shadow-black/20 transition hover:border-zinc-700"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleEndpoint(endpointKey)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/30 transition"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider border ${getMethodBadge(
                        method
                      )}`}
                    >
                      {method}
                    </span>
                    <span className="font-mono text-sm font-semibold text-white">{path}</span>
                    <span className="hidden text-xs text-zinc-400 md:inline font-medium">
                      — {spec.summary}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 font-semibold">
                      {spec.tags?.[0] || "API"}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-zinc-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Endpoint Body */}
                {isExpanded && (
                  <div className="border-t border-zinc-800 p-5 space-y-4 text-xs bg-zinc-950/40">
                    <p className="text-zinc-300 leading-relaxed">{spec.description}</p>

                    {/* Parameters if any */}
                    {spec.parameters && spec.parameters.length > 0 && (
                      <div>
                        <h4 className="font-bold text-zinc-200 mb-2 uppercase tracking-wider text-[11px]">
                          Query Parameters
                        </h4>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-x-auto">
                          <table className="w-full text-left text-xs text-zinc-300">
                            <thead className="border-b border-zinc-800 bg-zinc-950/60 text-[10px] uppercase text-zinc-400">
                              <tr>
                                <th className="px-3 py-2">Parameter</th>
                                <th className="px-3 py-2">In</th>
                                <th className="px-3 py-2">Type</th>
                                <th className="px-3 py-2">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                              {spec.parameters.map((p: any) => (
                                <tr key={p.name}>
                                  <td className="px-3 py-2 font-mono font-semibold text-blue-400">
                                    {p.name}
                                  </td>
                                  <td className="px-3 py-2 text-zinc-400">{p.in}</td>
                                  <td className="px-3 py-2 font-mono text-amber-300">
                                    {p.schema?.type || "string"}
                                  </td>
                                  <td className="px-3 py-2 text-zinc-400">
                                    {p.schema?.enum ? `Enum: [${p.schema.enum.join(", ")}]` : "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Live Try It Out Button */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => handleExecuteRequest(path, method)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 transition active:scale-95 disabled:opacity-50"
                      >
                        <Send className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                        <span>{isLoading ? "Executing API..." : "Try Live Endpoint"}</span>
                      </button>
                    </div>

                    {/* Live Execution Output */}
                    {output && (
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-zinc-300">HTTP Response</span>
                          <span
                            className={`rounded px-2 py-0.5 font-mono font-bold ${
                              output.status >= 200 && output.status < 300
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            Status: {output.status}
                          </span>
                        </div>
                        <pre className="max-h-60 overflow-y-auto rounded-lg bg-[#080d1a] p-3 font-mono text-[11px] text-cyan-300">
                          {JSON.stringify(output.data || output.error, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
