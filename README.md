# 🚗 Instant Mechanic — Live Vehicle Service Operations Dashboard

[![CI Pipeline](https://github.com/instant-mechanic/instant-mechanic-ops/actions/workflows/ci.yml/badge.svg)](https://github.com/instant-mechanic/instant-mechanic-ops/actions)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://www.prisma.io/)
[![OpenAPI 3.1](https://img.shields.io/badge/OpenAPI-3.1-6BA539?logo=openapi-initiative)](https://swagger.io/)

> **A mission-critical, full-stack Live Operations Platform designed for on-demand vehicle service dispatching, real-time fleet GPS tracking, automated lifecycle state management, and deep business intelligence analytics.**

---

## 📑 Table of Contents
1. [Project Overview](#-1-project-overview)
2. [Key Capabilities & Features](#-2-key-capabilities--features)
3. [System Architecture](#-3-system-architecture)
4. [Tech Stack](#-4-tech-stack)
5. [Database & Seed Data Model](#-5-database--seed-data-model)
6. [API Endpoints & Documentation](#-6-api-endpoints--documentation)
7. [Live Operations & Real-Time Simulation](#-7-live-operations--real-time-simulation)
8. [Local Setup & Development](#-8-local-setup--development)
9. [Environment Variables](#-9-environment-variables)
10. [Deployment Guide (Vercel & AWS EC2 / Docker)](#-10-deployment-guide)
11. [Automated Testing & CI/CD](#-11-automated-testing--cicd)
12. [AI Usage Disclosure](#-12-ai-usage-disclosure)
13. [Interview & Technical Defense Guide](#-13-interview--technical-defense-guide)

---

## 🌟 1. Project Overview

**Instant Mechanic** is an on-demand vehicle repair and maintenance platform providing mobile mechanic dispatch directly to customers' driveways, workplaces, or roadside breakdown locations.

This **Live Operations Dashboard** was engineered from the ground up as a production-ready SaaS control center for the operations and dispatch team. It gives dispatchers 360-degree real-time visibility into incoming work orders, technician availability, live GPS coordinates, telemetry, turnaround metrics, and revenue recognition.

### Why It Was Built
- **Zero Page-Reload Live State**: Built with Server-Sent Events (SSE) and an automated simulation engine to broadcast live changes (`Pending` → `Assigned` → `En Route` → `In Progress` → `Completed`) directly into the UI.
- **Fleet Telemetry & GPS Radar**: Interactive OpenStreetMap / Leaflet radar visualizing 25 mobile workshop units with real-time routing lines to active breakdown spots.
- **Decision-Grade Business Intelligence**: Actionable KPI metric cards, revenue growth trajectories, category demand breakdowns, and hourly dispatch volume heatmaps.
- **Robust Role Simulation**: Seamless switching between **Admin**, **Operations Dispatcher**, and **Auditor / Read-Only** personas.

---

## ⚡ 2. Key Capabilities & Features

### 📊 Operations Overview & Live KPI Grid
- **8 Core Real-Time Metrics**:
  - `Total Bookings` (with 30-day delta trends)
  - `Today's Bookings` (live operational count)
  - `Completed Bookings` (success resolution rate)
  - `Pending Bookings` (backlog monitoring with overload alerts)
  - `Active Mechanics` (fleet utilization %)
  - `Total Revenue` (daily & gross settlements)
  - `New Customers` (acquisition tracking)
  - `Average Response Time` (target < 20 mins benchmark)
- **Live Dispatch Stream**: Real-time ticker logging all dispatches, emergency breakdowns, state transitions, and payment settlements.

### 📋 Enterprise Work Orders & Bookings Management
- **High-Performance Data Table**:
  - Multi-term search across Booking ID, customer name, vehicle plate, model, and address.
  - Multi-criteria filtering by Status, Priority (`Standard`, `High`, `🚨 Emergency`), Service Category, and Assigned Technician.
  - Multi-column sorting (Date, Amount, Status, ID) and custom pagination (10, 25, 50, 100).
  - Quick inline status advancement buttons.
  - **One-Click CSV Export**: Downloads complete or filtered dataset as a spreadsheet.
- **Work Order Dossier / Detail Drawer**:
  - Full chronological timeline audit log.
  - Verified customer profile and vehicle specs (Make, Model, Year, Plate, VIN, Fuel type).
  - Technician reassignment dropdown.
  - Status mutation action buttons.
  - Printable customer work order receipt & invoice.

### 🗺️ Mechanics Fleet & Live GPS Radar
- **Interactive OpenStreetMap Leaflet Radar**:
  - GPS pins for all 25 technicians color-coded by availability (`Available`, `En Route`, `On Job`, `On Break`, `Offline`).
  - Active breakdown incident markers with pulsing radar wave animations.
  - Animated route vectors connecting en-route mechanics to customer locations.
  - Telemetry side panel with real-time fleet breakdown counts.
- **Mechanic Profile Dossier**:
  - Rating stars, total jobs completed, specialties, mobile workshop rig specs, and customer reviews.

### 👥 Customer Directory & Garage
- Customer profiles with verified owned vehicles, total lifetime spend, and service history.

### 📈 Business Intelligence & Financial Analytics
- Interactive **Recharts** visualizations:
  - 30-Day Revenue Trajectory Area Chart.
  - Lifecycle Status Distribution Donut Chart.
  - Service Category Demand Bar Chart.
  - 24-Hour Peak Dispatch Heatmap.
  - Top Mechanic CSAT & Performance Leaderboard.

### 🕹️ Live Operations Simulation Controller
- Sticky control bar at the top of the interface:
  - **Play / Pause** live dispatch engine.
  - **Speed Multipliers**: `10s (Realistic)`, `3s (Fast)`, `1s (Turbo)`.
  - **"Simulate Breakdown"**: Injects critical roadside breakdown incident in real time.
  - **"Reset Seed DB"**: Restores clean initial database state on demand.

### 📖 Interactive OpenAPI 3.1 & Swagger Documentation
- Built-in interactive API explorer accessible at `/docs`.
- Includes live **"Try Endpoint"** execution tester with status codes and JSON outputs.
- One-click OpenAPI 3.1 JSON export.

---

## 🏗️ 3. System Architecture

```mermaid
flowchart TD
    subgraph Browser ["Client Layer (Next.js 15 React 19 UI)"]
        UI[SaaS Dashboard & Controls]
        LiveStream[SSE Event Stream Listener]
        Map[Leaflet Fleet GPS Radar]
        Charts[Recharts Analytics BI]
        Table[Bookings & Invoicing Table]
        Swagger[Interactive OpenAPI UI /docs]
    end

    subgraph API ["Next.js App Router API Layer"]
        R_Dash["/api/dashboard"]
        R_Book["/api/bookings & /api/bookings/:id"]
        R_Mech["/api/mechanics & /api/mechanics/:id"]
        R_Cust["/api/customers & /api/customers/:id"]
        R_Anal["/api/analytics"]
        R_Evt["/api/events (SSE Streaming Response)"]
        R_Sim["/api/simulation"]
        R_Health["/api/health"]
    end

    subgraph Core ["Backend Services & Business Logic"]
        Zod[Zod Schema Validation]
        DashSvc[DashboardService]
        BookSvc[BookingService]
        MechSvc[MechanicService]
        CustSvc[CustomerService]
        AnalSvc[AnalyticsService]
        SimEngine[SimulationEngine]
        SSEHub[In-Memory SSE Broadcast Hub]
    end

    subgraph Persistence ["Data & Storage Layer"]
        Prisma[Prisma ORM Client]
        Database[(SQLite / PostgreSQL DB)]
        SeedEngine[Seed Engine: 625 Bookings, 60 Customers, 25 Mechanics]
    end

    UI --> API
    LiveStream <--> |Server-Sent Events| R_Evt
    API --> Zod --> Core
    Core --> Prisma --> Database
    Core --> SSEHub --> R_Evt
```

---

## 🛠️ 4. Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 15 (App Router)](https://nextjs.org/), [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & Design System** | [Tailwind CSS 3.4](https://tailwindcss.com/), Radix UI Primitives, Lucide Icons, Custom Neon Cyberpunk theme |
| **Data Visualization** | [Recharts 2.15](https://recharts.org/) (Area, Donut, Bar, Heatmaps) |
| **Mapping & GIS** | [Leaflet 1.9](https://leafletjs.com/), OpenStreetMap CartoDB Tiles |
| **Backend & APIs** | Next.js API Routes (Node.js runtime), RESTful Architecture, [Zod 3.24](https://zod.dev/) validation |
| **Real-Time Telemetry** | Server-Sent Events (SSE) Stream, Web Audio API Sound Synthesizer |
| **Database & ORM** | [Prisma ORM 5.22](https://www.prisma.io/), SQLite (Zero-config local) / PostgreSQL (Cloud) |
| **API Specification** | OpenAPI 3.1.0 Interactive Explorer (`/docs`) |
| **Testing** | [Vitest 2.1](https://vitest.dev/), Testing Library |
| **Container & CI/CD** | Multi-stage `Dockerfile`, `docker-compose.yml`, GitHub Actions CI |

---

## 🗄️ 5. Database & Seed Data Model

The data layer is structured cleanly with relational integrity in Prisma:

- **Customer**: `id`, `name`, `email`, `phone`, `address`, `city`, `totalSpent`, `createdAt`
- **Vehicle**: `id`, `customerId`, `make`, `model`, `year`, `licensePlate`, `vin`, `color`, `fuelType`, `mileage`
- **Mechanic**: `id`, `name`, `email`, `phone`, `rating`, `jobsCompleted`, `status`, `latitude`, `longitude`, `address`, `specialties`, `vehicleType`
- **Service**: `id`, `code`, `name`, `category`, `description`, `basePrice`, `estimatedDurationMin`, `icon`
- **Booking**: `id` (`BK-1001`+), `customerId`, `vehicleId`, `mechanicId`, `serviceId`, `status`, `priority`, `scheduledAt`, `completedAt`, `amount`, `paymentStatus`, `paymentMethod`, `notes`, `rating`, `review`
- **BookingTimeline**: `id`, `bookingId`, `status`, `note`, `timestamp`
- **ActivityLog**: `id`, `type`, `title`, `description`, `metadata`, `createdAt`

### Realistic Seed Engine
Running `npm run db:seed` provisions:
- **8 Distinct Service Categories** (Emergency Roadside, Synthetic Oil Change, Ceramic Brake Overhaul, OBD-II Diagnostics, High-Voltage Battery Replacement, AC Recharge, Mobile Tire Fit & Balance, Suspension Overhaul).
- **25 Mobile Fleet Technicians** with realistic GPS coordinates across the metropolitan area, ratings (4.7 to 4.99★), vehicle rig configurations, and specialties.
- **60 Customers & Vehicles** with real VINs, license plates, and multi-vehicle garage profiles.
- **625 Realistic Bookings** spanning the last 90 days to today with authentic price distributions, timeline logs, and status breakdowns.

---

## 📡 6. API Endpoints & Documentation

All endpoints follow standard REST conventions and return structured JSON responses with `success: boolean`, `data: any`, and `pagination?: object`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Returns 8 operational KPIs, trend deltas, and live activity stream |
| `GET` | `/api/bookings` | Paginated, filtered, and sorted booking work orders |
| `POST` | `/api/bookings` | Registers and dispatches a new service booking |
| `GET` | `/api/bookings/:id` | Full booking dossier with customer, vehicle, mechanic, and timeline |
| `PATCH` | `/api/bookings/:id` | Updates status (`ASSIGNED`, `EN_ROUTE`, `IN_PROGRESS`, `COMPLETED`), reassigns mechanic |
| `GET` | `/api/mechanics` | Fleet directory with active jobs and GPS coordinates |
| `GET` | `/api/mechanics/:id`| Mechanic profile with job history and rating breakdown |
| `PATCH`| `/api/mechanics/:id`| Updates technician status and GPS coordinates |
| `GET` | `/api/customers` | Customer list with lifetime spend and vehicles |
| `GET` | `/api/customers/:id`| Customer profile and service history |
| `GET` | `/api/analytics` | Deep analytics (revenue trends, status donut, service demand, hourly heatmap) |
| `GET` | `/api/events` | Server-Sent Events (SSE) real-time event stream |
| `POST`| `/api/simulation` | Controls simulation engine (`tick`, `emergency`, `reset`) |
| `GET` | `/api/health` | System health check, uptime, and database latency |
| `GET` | `/api/openapi.json` | OpenAPI 3.1 JSON specification |

---

## 🔄 7. Live Operations & Real-Time Simulation

The dashboard behaves like an authentic live dispatch operations system:

```mermaid
sequenceDiagram
    autonumber
    actor Dispatcher as Operations Dispatcher
    participant UI as Next.js Dashboard UI
    participant SSE as Server-Sent Events (/api/events)
    participant Sim as Simulation Engine (/api/simulation)
    participant DB as SQLite / PostgreSQL Database

    Note over UI,SSE: Real-time Event Stream Connected
    Sim->>DB: Advance State (e.g. EN_ROUTE -> IN_PROGRESS)
    DB-->>Sim: Record Updated & Timeline Saved
    Sim->>SSE: Broadcast EVENT: BOOKING_UPDATED
    SSE-->>UI: Push payload over SSE stream
    UI->>UI: Update Metrics & Play Audio Ping (No Page Reload)
    UI->>UI: Animate Mechanic GPS Marker on Fleet Radar
```

### State Machine
$$\text{Pending} \longrightarrow \text{Assigned} \longrightarrow \text{En Route (GPS updates)} \longrightarrow \text{In Progress} \longrightarrow \text{Completed / Paid}$$

---

## 🚀 8. Local Setup & Development

### Prerequisites
- Node.js 18+ or 20+ (Node v20/v24 recommended)
- npm 9+ or yarn / pnpm

### Quick Start (3 Steps)

1. **Navigate to the project directory**:
   ```bash
   cd instant-mechanic-ops
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Initialize Database & Realistic Seed Data (625+ Bookings)**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Launch the Development Server**:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## ⚙️ 9. Environment Variables

Create a `.env` file in the root directory:

```env
# Database connection (SQLite for local, or PostgreSQL URL for production)
DATABASE_URL="file:./dev.db"

# Public Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"
```

For PostgreSQL deployments (e.g. Supabase, Neon, AWS RDS):
```env
DATABASE_URL="postgresql://username:password@hostname:5432/instant_mechanic?schema=public"
```

---

## ☁️ 10. Deployment Guide

### A. Deploy to Vercel (Recommended Frontend & Serverless)
1. Push your repository to **GitHub**.
2. Connect the repository in the **Vercel Dashboard**.
3. Set the Environment Variable:
   - `DATABASE_URL`: Your PostgreSQL / Supabase connection string.
4. Click **Deploy**. Vercel will automatically build the Next.js App Router application and deploy globally on edge network.

### B. Deploy to AWS EC2 / Docker (Production Backend Container)
1. **Build the Docker Container**:
   ```bash
   docker build -t instant-mechanic-ops .
   ```
2. **Run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```
3. The platform will be live at `http://<your-ec2-ip>:3000` with health check running at `/api/health`.

---

## 🧪 11. Automated Testing & CI/CD

Run the automated test suite:
```bash
npm test
```

### What is tested:
- **`src/tests/utils.test.ts`**: Formatting helpers, currency calculations, date parsers, and status badge color maps.
- **`src/tests/booking.test.ts`**: Zod validation schemas for booking creation, lifecycle state transitions, and query filter parameters.

---

## 🤖 12. AI Usage Disclosure

In compliance with the assignment instructions (Section 6 & Section 9):

- **Tools Used**: Antigravity AI, Gemini 3.7 Flash, Claude 3.5 Sonnet.
- **What AI was used for**:
  - Scaffolding relational Prisma schema and seed data generation algorithms.
  - Designing TypeScript interfaces and Zod validator schemas.
  - Generating initial chart layout scaffolding for Recharts and Leaflet map integration.
  - Generating OpenAPI 3.1 specification schema.
- **What was personally engineered, customized & verified**:
  - Architecture design: layered Next.js 15 App Router architecture (`services`, `validators`, `db`).
  - Real-time Server-Sent Events (SSE) broadcast hub and Web Audio synthesizer for zero-asset audio alerts.
  - Lifecycle state machine and custom simulation progression engine.
  - Interactive Leaflet GPS map markers with pulsing radar keyframe CSS and dynamic route polylines.
  - Role simulation switcher (`Admin`, `Operations`, `Viewer`).

---

## 🧠 13. Interview & Technical Defense Guide

During technical review, here is why each key architectural decision was made:

1. **Why Server-Sent Events (SSE) instead of raw WebSockets?**
   - *Answer*: Operations dashboards primarily receive unidirectional server-to-client telemetry streams (status updates, new incoming orders, GPS ticks). SSE runs natively over standard HTTP/2, requires zero third-party socket server dependencies, handles auto-reconnection out of the box, and bypasses enterprise firewall socket blocking.

2. **How does the system scale to 100,000+ bookings?**
   - *Answer*: Database indexes on `Booking(status, scheduledAt)` and `Booking(customerId)`. API queries are strictly paginated with database-level `skip` and `take`. For high-throughput analytics, queries aggregate over indexed date ranges, and Redis can be introduced as a cache layer for `/api/dashboard` and `/api/analytics`.

3. **How is state consistency maintained during concurrent status changes?**
   - *Answer*: The `BookingService.updateBookingStatus` method executes atomic Prisma database mutations and automatically records an immutable `BookingTimeline` audit entry inside the same lifecycle flow before broadcasting via the SSE hub.

---

**Built with pride for the Instant Mechanic Operations Team.** 🚀
