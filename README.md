Yes bro 😄 You mean **one single block**, not multiple separate code sections.

Copy everything below **as one single block** into your GitHub `README.md`:

````markdown
# 🚗 Instant Mechanic — Live Operations SaaS Platform

[![Live Application](https://img.shields.io/badge/Live_App-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://instant-mechanic-ops-dmz3.vercel.app/)
[![API Docs](https://img.shields.io/badge/API_Docs-Swagger_UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://instant-mechanic-ops-dmz3.vercel.app/docs)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mohdshiyab/instant-mechanic-ops)
[![Tests](https://img.shields.io/badge/Tests-10%2F10_Passing-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)](https://github.com/mohdshiyab/instant-mechanic-ops)

A production-grade, full-stack **Live Vehicle Service Operations Dashboard** built for **Instant Mechanic** to manage real-time fleet dispatching, roadside emergency handling, mechanic GPS telemetry tracking, work order lifecycles, and financial business intelligence.

---

## 📋 Submission Overview

- **Candidate Name:** Mohammad Shiyabuddeen
- **GitHub Repository:** https://github.com/mohdshiyab/instant-mechanic-ops
- **Live Vercel Application:** https://instant-mechanic-ops-dmz3.vercel.app/
- **Live Backend API:** https://instant-mechanic-ops-dmz3.vercel.app/api/dashboard
- **Interactive Swagger / OpenAPI 3.1:** https://instant-mechanic-ops-dmz3.vercel.app/docs
- **Health Check & Telemetry:** https://instant-mechanic-ops-dmz3.vercel.app/api/health

---

## 🌟 Key Features

### 📊 Operations Overview & Live KPI Grid

The dashboard provides real-time visibility into core operational metrics:

- Total Bookings — 625+ records with 30-day percentage deltas
- Today's Bookings — Live daily operational count
- Completed Bookings — 94%+ resolution rate
- Pending Bookings — Backlog queue monitoring
- Active Mechanics — Fleet utilization across 25 mobile workshop units
- Total Revenue — Daily and gross revenue settlements
- New Customers — Customer acquisition tracking
- Average Response Time — SLA benchmark target of less than 20 minutes
- CSAT — 4.9★ benchmark

### 📡 Live Dispatch Stream

Real-time activity ticker recording:

- Technician dispatches
- Emergency breakdowns
- Booking state transitions
- Payment receipts
- Operational events

---

## 📋 Work Orders & Bookings Management

### High-Performance Data Table

Features include:

- Multi-field search
  - Booking ID
  - Customer name
  - Vehicle plate
  - Vehicle model
  - Address
- Status filtering
  - Pending
  - Assigned
  - En Route
  - In Progress
  - Completed
  - Cancelled
- Priority filtering
  - Standard
  - High
  - 🚨 Emergency
- Sorting by date, price, status, and ID
- Pagination with 10, 25, 50, and 100 records
- Inline booking status updates
- One-click CSV export

### Interactive Work Order Dossier

Each work order provides:

- Chronological audit timeline
- Customer profile
- Vehicle information
- Technician assignment
- Booking status
- Service information
- Printable invoice/work order

Vehicle information includes:

- Make
- Model
- Year
- License Plate
- VIN
- Fuel Type

---

## 🛰️ Mechanics Fleet & Live GPS Radar

Built with **Leaflet + OpenStreetMap**.

The live fleet radar tracks 25 technicians/mobile workshop units.

### Technician Statuses

- Available
- En Route
- On Job
- On Break
- Offline

### Live Radar Features

- Real-time GPS positions
- Technician status indicators
- Emergency incident markers
- Pulsing emergency animations
- Dynamic route polylines
- Customer destination tracking
- Fleet telemetry panel

### Fleet Cards

Technician profiles include:

- Ratings
- Completed jobs
- Specializations
- Mobile workshop specifications
- Customer reviews
- Current operational status

---

## 👥 Registered Customers & Fleet Garage

Customer management provides a centralized directory of customers and their vehicles.

Supported vehicle examples include:

- Tesla
- BMW
- Audi
- Ford
- Porsche
- Honda

Customer profiles include:

- Customer details
- Verified vehicles
- Lifetime spending
- Total bookings
- Vehicle information
- Service history

---

## 📈 Business Intelligence & Financial Analytics

Interactive analytics are built using **Recharts**.

Available visualizations include:

- 30-Day Revenue Trajectory
- Lifecycle Status Distribution
- Service Category Demand
- 24-Hour Peak Dispatch Heatmap
- Top Mechanic CSAT & Performance Leaderboard

---

## 🚨 Live Operations Simulation Controller

The platform includes a real-time operations simulation engine.

### Simulation Features

- Play / Pause simulation
- Speed multipliers:
  - 10s — Realistic
  - 3s — Fast
  - 1s — Turbo
- 🚨 Simulate Breakdown
- 🔄 Reset Seed DB

### Simulate Breakdown

The emergency simulation injects a roadside breakdown into the live system and automatically processes the operational workflow.

---

## 📚 Interactive OpenAPI 3.1 & Swagger Documentation

Interactive API documentation is available at:

https://instant-mechanic-ops-dmz3.vercel.app/docs

Features include:

- API endpoint explorer
- Try Endpoint execution
- HTTP status codes
- JSON response previews
- OpenAPI 3.1 specification
- Interactive API testing

OpenAPI JSON:

https://instant-mechanic-ops-dmz3.vercel.app/api/openapi.json

---

## 🏗️ System Architecture

```mermaid
flowchart TB

    subgraph Client["Next.js 15 Client Layer"]
        UI["Operational Dashboard UI"]
        SSE_C["SSE Event Listener"]
        Leaflet["Leaflet GPS Radar"]
        Charts["Recharts BI Visualizations"]
        Simulator["Live Simulator Controller"]
    end

    subgraph Server["Next.js App Router"]
        Dashboard["/api/dashboard"]
        Bookings["/api/bookings"]
        Mechanics["/api/mechanics"]
        Customers["/api/customers"]
        Analytics["/api/analytics"]
        Events["/api/events"]
        Simulation["/api/simulation"]
        Health["/api/health"]
        Docs["/api/openapi.json"]
    end

    subgraph Logic["Services & Engine Layer"]
        BookingService["Booking State Machine"]
        MechanicService["Mechanic Telemetry"]
        SimulationEngine["Simulation Engine"]
        SSEHub["SSE Broadcast Hub"]
    end

    subgraph Data["Data Layer"]
        Prisma["Prisma ORM"]
        Database[("625+ Bookings<br/>60 Customers<br/>25 Mechanics")]
    end

    UI -->|REST| Server
    Simulator -->|POST| Simulation
    Simulation --> SimulationEngine
    SimulationEngine --> BookingService
    BookingService --> SSEHub
    SSEHub -->|SSE Stream| SSE_C
    SSE_C --> UI
    SSE_C --> Leaflet
    Server --> Logic
    Logic --> Prisma
    Prisma --> Database
````

---

## 🛠️ Tech Stack

| Layer              | Technology                                  |
| ------------------ | ------------------------------------------- |
| Framework          | Next.js 15, React 19, TypeScript            |
| Frontend           | React, Next.js, Tailwind CSS                |
| UI                 | Lucide React, clsx, tailwind-merge          |
| Mapping            | Leaflet, OpenStreetMap, CartoDB Dark Matter |
| Data Visualization | Recharts                                    |
| Real-Time          | Server-Sent Events, Web Audio API           |
| Validation         | Zod                                         |
| ORM                | Prisma                                      |
| Testing            | Vitest                                      |
| Containerization   | Docker, Docker Compose                      |
| CI/CD              | GitHub Actions                              |
| Deployment         | Vercel                                      |

---

## 🚀 Quick Start

### Clone the Repository

```bash
git clone https://github.com/mohdshiyab/instant-mechanic-ops.git
cd instant-mechanic-ops
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open:

[http://localhost:3000](http://localhost:3000)

---

## 🧪 Running Tests

Run the automated test suite:

```bash
npm test
```

Expected result:

```text
✓ src/tests/booking.test.ts (5 tests)
✓ src/tests/utils.test.ts (5 tests)

Test Files  2 passed (2)
Tests       10 passed (10)
```

---

## 🐳 Docker Deployment

Run using Docker Compose:

```bash
docker-compose up --build
```

The application will be available at:

[http://localhost:3000](http://localhost:3000)

---

## 🔌 API Endpoints

| Endpoint              | Purpose                   |
| --------------------- | ------------------------- |
| `/api/dashboard`      | Dashboard metrics         |
| `/api/bookings`       | Booking management        |
| `/api/bookings/[id]`  | Individual booking        |
| `/api/mechanics`      | Mechanic management       |
| `/api/mechanics/[id]` | Individual mechanic       |
| `/api/customers`      | Customer management       |
| `/api/customers/[id]` | Individual customer       |
| `/api/analytics`      | Business analytics        |
| `/api/events`         | Server-Sent Events stream |
| `/api/simulation`     | Operations simulation     |
| `/api/health`         | Health check              |
| `/api/openapi.json`   | OpenAPI specification     |
| `/docs`               | Swagger UI                |

---

## 🔄 Booking State Machine

The booking lifecycle follows:

```text
Pending
   ↓
Assigned
   ↓
En Route
   ↓
In Progress
   ↓
Completed
```

Additional state:

```text
Cancelled
```

---

## 🚨 Simulate Breakdown Workflow

```text
Simulate Breakdown
        ↓
Create Emergency Incident
        ↓
Identify Available Technician
        ↓
Assign Technician
        ↓
Technician → En Route
        ↓
Generate Route
        ↓
Update GPS Radar
        ↓
Technician → In Progress
        ↓
Complete Service
        ↓
Settle Revenue
        ↓
Broadcast Final State
```

The complete workflow is reflected in the dashboard without requiring a page refresh.

---

## 📡 Real-Time SSE Architecture

The platform uses **Server-Sent Events (SSE)** for real-time operational updates.

```text
Server
  │
  │ Booking State Change
  ↓
SSE Broadcast Hub
  │
  │ text/event-stream
  ↓
Client SSE Listener
  │
  ├── Dashboard
  ├── Booking Table
  ├── Activity Ticker
  ├── Fleet Radar
  └── Analytics
```

---

## 🤖 AI Usage Disclosure

### AI Tools Used

* Antigravity AI
* Gemini 3.7 Flash
* Claude 3.5 Sonnet

### AI-Assisted Areas

AI tools were used for:

* Prisma schema layout assistance
* Boilerplate acceleration
* Mock seed dataset generation
* Development assistance

### Personally Engineered

Core functionality personally engineered includes:

* Real-time Server-Sent Events architecture
* Business state machine
* Operations simulation engine
* Leaflet GPS radar
* Custom map markers
* Dynamic route polylines
* Web Audio API sound synthesizer
* Work order dossier drawer
* API routing
* Interactive OpenAPI documentation
* Real-time operational workflows

---

## 🌟 What I Am Most Proud Of

The **Interactive Live Operations Simulation Engine** and the **"🚨 Simulate Breakdown"** feature.

It coordinates the entire operational flow in real time:

1. Injects a roadside emergency.
2. Identifies an available technician.
3. Dispatches the technician.
4. Updates the technician's operational state.
5. Plots the route on the live GPS radar.
6. Animates the route and incident marker.
7. Triggers audio notifications.
8. Updates the live activity ticker.
9. Progresses the booking through its state machine.
10. Settles revenue after job completion.

This demonstrates the implementation of a complete real-time operational workflow rather than a static dashboard.

---

## 📊 Seeded Dataset

The application includes realistic seeded operational data:

| Entity             | Quantity |
| ------------------ | -------: |
| Bookings           |     625+ |
| Customers          |       60 |
| Mechanics          |       25 |
| Service Categories |        8 |
| Historical Period  |  90 Days |

---

## 🔗 Live Links

**Live Application:**
[https://instant-mechanic-ops-dmz3.vercel.app/](https://instant-mechanic-ops-dmz3.vercel.app/)

**Swagger / OpenAPI:**
[https://instant-mechanic-ops-dmz3.vercel.app/docs](https://instant-mechanic-ops-dmz3.vercel.app/docs)

**Dashboard API:**
[https://instant-mechanic-ops-dmz3.vercel.app/api/dashboard](https://instant-mechanic-ops-dmz3.vercel.app/api/dashboard)

**Health Check:**
[https://instant-mechanic-ops-dmz3.vercel.app/api/health](https://instant-mechanic-ops-dmz3.vercel.app/api/health)

**GitHub Repository:**
[https://github.com/mohdshiyab/instant-mechanic-ops](https://github.com/mohdshiyab/instant-mechanic-ops)

---

## 👨‍💻 Author

### Mohammad Shiyabuddeen

**Full Stack Software Developer | AI & Modern Web Applications**

**Portfolio:**
[https://www.shiyab.vercel.app](https://www.shiyab.vercel.app)

**LinkedIn:**
[https://www.linkedin.com/in/mohammad-shiyabuddeen-4b183724b](https://www.linkedin.com/in/mohammad-shiyabuddeen-4b183724b)

**GitHub:**
[https://github.com/mohdshiyab](https://github.com/mohdshiyab)

---

## 📅 Submission Information

**Candidate:** Mohammad Shiyabuddeen

**Application:** Full Stack Developer Internship — Instant Mechanic

**Submission Date:** August 2026

---

## ⭐ Thank You

Thank you for taking the time to review this project.

I look forward to discussing the architecture, engineering decisions, real-time systems, and implementation details behind the platform.

```

**This is one single block**. Copy from the first `# 🚗 Instant Mechanic` all the way to the final line and paste it into `README.md`.
```
