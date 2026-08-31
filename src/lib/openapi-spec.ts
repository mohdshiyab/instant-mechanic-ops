export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Instant Mechanic Operations API",
    version: "1.0.0",
    description:
      "Enterprise REST API for Instant Mechanic Live Operations Platform. Manages bookings, fleet dispatch, mechanics GPS tracking, analytics, and real-time operations.",
    contact: {
      name: "Instant Mechanic Engineering",
      email: "dev@instantmechanic.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Development Server",
    },
    {
      url: "https://instant-mechanic-ops.vercel.app",
      description: "Production Cloud Server",
    },
  ],
  tags: [
    { name: "Dashboard", description: "Operational KPIs, metrics and real-time feeds" },
    { name: "Bookings", description: "Vehicle service booking lifecycle and dispatch" },
    { name: "Mechanics", description: "Technician fleet management and live GPS coordinates" },
    { name: "Customers", description: "Customer directory and vehicle registry" },
    { name: "Analytics", description: "Business intelligence and revenue reporting" },
    { name: "Simulation", description: "Real-time operations simulation engine" },
    { name: "Health", description: "System diagnostics and database connectivity" },
  ],
  paths: {
    "/api/dashboard": {
      get: {
        tags: ["Dashboard"],
        summary: "Get Operational Overview Metrics",
        description: "Returns top-level KPIs including total bookings, revenue, active mechanics, today's counts, and recent activity logs.",
        responses: {
          "200": {
            description: "Successful response",
          },
        },
      },
    },
    "/api/bookings": {
      get: {
        tags: ["Bookings"],
        summary: "List Bookings (Paginated, Filtered, Sorted)",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["ALL", "PENDING", "ASSIGNED", "EN_ROUTE", "IN_PROGRESS", "COMPLETED", "CANCELLED"] } },
          { name: "priority", in: "query", schema: { type: "string", enum: ["ALL", "STANDARD", "HIGH", "EMERGENCY"] } },
          { name: "sortBy", in: "query", schema: { type: "string", default: "scheduledAt" } },
          { name: "sortOrder", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "desc" } },
        ],
        responses: {
          "200": { description: "Paginated list of bookings" },
        },
      },
      post: {
        tags: ["Bookings"],
        summary: "Create New Booking",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["customerId", "vehicleId", "serviceId", "address"],
                properties: {
                  customerId: { type: "string" },
                  vehicleId: { type: "string" },
                  serviceId: { type: "string" },
                  mechanicId: { type: "string" },
                  priority: { type: "string", enum: ["STANDARD", "HIGH", "EMERGENCY"] },
                  address: { type: "string" },
                  amount: { type: "number" },
                  paymentMethod: { type: "string", enum: ["CARD", "APPLE_PAY", "CASH", "INSURANCE"] },
                  notes: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Booking created successfully" },
        },
      },
    },
    "/api/bookings/{id}": {
      get: {
        tags: ["Bookings"],
        summary: "Get Booking Details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Full booking object with customer, vehicle, mechanic, and timeline" },
          "404": { description: "Booking not found" },
        },
      },
      patch: {
        tags: ["Bookings"],
        summary: "Update Booking Status / Mechanic",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["PENDING", "ASSIGNED", "EN_ROUTE", "IN_PROGRESS", "COMPLETED", "CANCELLED"] },
                  mechanicId: { type: "string" },
                  note: { type: "string" },
                  rating: { type: "number" },
                  review: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Booking status updated" },
        },
      },
    },
    "/api/mechanics": {
      get: {
        tags: ["Mechanics"],
        summary: "List Mechanics Fleet",
        parameters: [
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "List of mechanics with active job and GPS coordinates" },
        },
      },
    },
    "/api/customers": {
      get: {
        tags: ["Customers"],
        summary: "List Registered Customers",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Customer list with vehicle profiles and lifetime spend" },
        },
      },
    },
    "/api/analytics": {
      get: {
        tags: ["Analytics"],
        summary: "Get Deep Analytics & Trends",
        parameters: [{ name: "days", in: "query", schema: { type: "integer", default: 30 } }],
        responses: {
          "200": { description: "Revenue over time, booking statuses, service breakdown, and hourly heatmap" },
        },
      },
    },
    "/api/simulation": {
      post: {
        tags: ["Simulation"],
        summary: "Trigger Simulation Action",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  action: { type: "string", enum: ["tick", "emergency", "reset"] },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Simulation action performed" },
        },
      },
    },
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "System Health & Uptime Check",
        responses: {
          "200": { description: "System status, uptime, and database latency" },
        },
      },
    },
  },
};
