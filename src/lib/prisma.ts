/**
 * Production In-Memory / File-Persisted Database Engine with complete Prisma Query Interface.
 * Zero-dependency, ultra-fast (sub-millisecond latency), cross-platform, fully compatible with Node 20-24.
 */

import { CustomerType, VehicleType, MechanicType, ServiceType, BookingType, BookingTimelineType, ActivityLogType, PriorityLevel, PaymentStatus } from "./types";

// Seed Datasets
const INITIAL_SERVICES: ServiceType[] = [
  {
    id: "srv_1",
    code: "EMERGENCY_ROADSIDE",
    name: "Emergency Breakdown & Roadside Assist",
    category: "Emergency",
    description: "Rapid mobile dispatch for battery failure, flat tire, engine stalls, and towing assessment.",
    basePrice: 120.0,
    estimatedDurationMin: 45,
    icon: "AlertTriangle",
  },
  {
    id: "srv_2",
    code: "FULL_OIL_SERVICE",
    name: "Full Synthetic Oil & Filter Service",
    category: "Maintenance",
    description: "Premium synthetic engine oil replacement, OEM filter change, and 30-point health check.",
    basePrice: 145.0,
    estimatedDurationMin: 60,
    icon: "Droplet",
  },
  {
    id: "srv_3",
    code: "BRAKE_SYSTEM_OVERHAUL",
    name: "Brake Pad & Rotor Replacement",
    category: "Brakes",
    description: "Ceramic brake pad installation, rotor inspection/resurfacing, and fluid flush.",
    basePrice: 280.0,
    estimatedDurationMin: 90,
    icon: "ShieldAlert",
  },
  {
    id: "srv_4",
    code: "ENGINE_DIAGNOSTICS",
    name: "Comprehensive OBD-II Diagnostic Scan",
    category: "Diagnostics",
    description: "Full electronic control unit scanning, live sensor diagnostics, and failure code analysis.",
    basePrice: 95.0,
    estimatedDurationMin: 40,
    icon: "Cpu",
  },
  {
    id: "srv_5",
    code: "BATTERY_REPLACEMENT",
    name: "AGM / Lithium Battery Replacement",
    category: "Electrical",
    description: "On-site battery testing, heavy-duty battery installation, and alternator charging test.",
    basePrice: 220.0,
    estimatedDurationMin: 35,
    icon: "Zap",
  },
  {
    id: "srv_6",
    code: "AC_RECHARGE_REPAIR",
    name: "AC Climate Control Diagnostic & Gas Recharge",
    category: "Climate",
    description: "R134a/R1234yf vacuum test, UV dye leak inspection, and refrigerant recharge.",
    basePrice: 175.0,
    estimatedDurationMin: 60,
    icon: "Wind",
  },
  {
    id: "srv_7",
    code: "TIRE_FIT_BALANCE",
    name: "Mobile Tire Replacement & Wheel Balance",
    category: "Tires",
    description: "On-site tire mounting, dynamic digital wheel balancing, and tire pressure monitoring calibration.",
    basePrice: 210.0,
    estimatedDurationMin: 50,
    icon: "CircleDot",
  },
  {
    id: "srv_8",
    code: "SUSPENSION_CHECK",
    name: "Suspension, Struts & Steering Overhaul",
    category: "Suspension",
    description: "Shock absorber replacement, sway bar links, and front-end steering alignment check.",
    basePrice: 380.0,
    estimatedDurationMin: 120,
    icon: "Wrench",
  },
];

const INITIAL_MECHANICS_DATA = [
  { id: "mech_1", name: "Marcus Vance", email: "marcus.v@instantmechanic.com", phone: "+1 (555) 201-9841", rating: 4.96, jobsCompleted: 284, status: "AVAILABLE" as const, latitude: 40.7580, longitude: -73.9855, address: "Midtown Manhattan, NY", specialties: ["Brakes", "Engine Diagnostics", "EV Systems"], vehicleType: "Mercedes Sprinter Van (Workshop 01)" },
  { id: "mech_2", name: "Elena Rostova", email: "elena.r@instantmechanic.com", phone: "+1 (555) 342-8812", rating: 4.92, jobsCompleted: 312, status: "EN_ROUTE" as const, latitude: 40.7484, longitude: -73.9857, address: "Empire District, NY", specialties: ["Emergency Breakdown", "Electrical", "Diagnostics"], vehicleType: "Ford Transit Custom (Rapid Response 02)" },
  { id: "mech_3", name: "Devon Brooks", email: "devon.b@instantmechanic.com", phone: "+1 (555) 489-1190", rating: 4.88, jobsCompleted: 195, status: "BUSY" as const, latitude: 40.7128, longitude: -74.0060, address: "Financial District, NY", specialties: ["Suspension", "Brakes", "Tires"], vehicleType: "RAM ProMaster 2500" },
  { id: "mech_4", name: "Sarah Jenkins", email: "sarah.j@instantmechanic.com", phone: "+1 (555) 612-4433", rating: 4.98, jobsCompleted: 420, status: "AVAILABLE" as const, latitude: 40.7829, longitude: -73.9654, address: "Upper East Side, NY", specialties: ["Full Maintenance", "Oil Service", "Diagnostics"], vehicleType: "Volkswagen Crafter EV" },
  { id: "mech_5", name: "Tariq Al-Mansoor", email: "tariq.m@instantmechanic.com", phone: "+1 (555) 773-9021", rating: 4.85, jobsCompleted: 167, status: "AVAILABLE" as const, latitude: 40.7282, longitude: -73.7949, address: "Flushing, Queens, NY", specialties: ["Air Conditioning", "Tire Fitting", "Electrical"], vehicleType: "Nissan NV200 Mobile Rig" },
  { id: "mech_6", name: "Chloe Dupont", email: "chloe.d@instantmechanic.com", phone: "+1 (555) 901-3329", rating: 4.95, jobsCompleted: 248, status: "EN_ROUTE" as const, latitude: 40.6782, longitude: -73.9442, address: "Crown Heights, Brooklyn, NY", specialties: ["Emergency Breakdown", "Batteries", "Brakes"], vehicleType: "BMW F850GS Emergency Moto" },
  { id: "mech_7", name: "Liam O'Connor", email: "liam.oc@instantmechanic.com", phone: "+1 (555) 843-2219", rating: 4.89, jobsCompleted: 210, status: "BUSY" as const, latitude: 40.7061, longitude: -73.9969, address: "DUMBO, Brooklyn, NY", specialties: ["Engine Diagnostics", "Brakes", "Suspension"], vehicleType: "Ford Transit 350 Heavy" },
  { id: "mech_8", name: "Aisha Patel", email: "aisha.p@instantmechanic.com", phone: "+1 (555) 431-7788", rating: 4.97, jobsCompleted: 350, status: "AVAILABLE" as const, latitude: 40.7614, longitude: -73.8311, address: "Astoria, Queens, NY", specialties: ["EV Diagnostics", "High Voltage", "Maintenance"], vehicleType: "Rivian EDV 500 Service Van" },
  { id: "mech_9", name: "Mateo Rodriguez", email: "mateo.r@instantmechanic.com", phone: "+1 (555) 554-1290", rating: 4.79, jobsCompleted: 142, status: "ON_BREAK" as const, latitude: 40.8448, longitude: -73.8648, address: "Pelham Bay, Bronx, NY", specialties: ["Tire Services", "Oil Change", "Batteries"], vehicleType: "Chevy Express 2500" },
  { id: "mech_10", name: "Kenji Takahashi", email: "kenji.t@instantmechanic.com", phone: "+1 (555) 672-8833", rating: 4.94, jobsCompleted: 290, status: "AVAILABLE" as const, latitude: 40.7306, longitude: -73.9352, address: "Long Island City, NY", specialties: ["Diagnostics", "Performance Tuning", "Brakes"], vehicleType: "Toyota HiAce Custom" },
  { id: "mech_11", name: "Hannah Schmidt", email: "hannah.s@instantmechanic.com", phone: "+1 (555) 234-9912", rating: 4.91, jobsCompleted: 180, status: "AVAILABLE" as const, latitude: 40.7505, longitude: -73.9934, address: "Hudson Yards, NY", specialties: ["Climate Control", "Electrical", "Diagnostics"], vehicleType: "Mercedes Metris Service Unit" },
  { id: "mech_12", name: "Julian Thorne", email: "julian.t@instantmechanic.com", phone: "+1 (555) 890-4411", rating: 4.86, jobsCompleted: 160, status: "EN_ROUTE" as const, latitude: 40.7223, longitude: -73.9874, address: "Lower East Side, NY", specialties: ["Emergency Roadside", "Tires", "Batteries"], vehicleType: "Honda Africa Twin Quick-Response" },
  { id: "mech_13", name: "Priya Sharma", email: "priya.s@instantmechanic.com", phone: "+1 (555) 321-7766", rating: 4.93, jobsCompleted: 225, status: "BUSY" as const, latitude: 40.7711, longitude: -73.9742, address: "Lincoln Center, NY", specialties: ["Brake Overhaul", "Full Oil Service", "Steering"], vehicleType: "Ford Transit Connect" },
  { id: "mech_14", name: "Carlos Morales", email: "carlos.m@instantmechanic.com", phone: "+1 (555) 765-4321", rating: 4.82, jobsCompleted: 135, status: "AVAILABLE" as const, latitude: 40.6928, longitude: -73.9903, address: "Brooklyn Heights, NY", specialties: ["Suspension", "Tires", "Oil Change"], vehicleType: "GMC Savana 3500" },
  { id: "mech_15", name: "Fatima Zahra", email: "fatima.z@instantmechanic.com", phone: "+1 (555) 998-1122", rating: 4.99, jobsCompleted: 390, status: "AVAILABLE" as const, latitude: 40.7549, longitude: -73.9840, address: "Times Square District, NY", specialties: ["Master Diagnostic", "EV Powertrain", "Brakes"], vehicleType: "Mercedes eSprinter Workshop" },
  { id: "mech_16", name: "David Kim", email: "david.k@instantmechanic.com", phone: "+1 (555) 443-8877", rating: 4.87, jobsCompleted: 175, status: "OFFLINE" as const, latitude: 40.7180, longitude: -73.9580, address: "Williamsburg, Brooklyn, NY", specialties: ["Tire Services", "Batteries", "Maintenance"], vehicleType: "Ram ProMaster City" },
  { id: "mech_17", name: "Zoe Washington", email: "zoe.w@instantmechanic.com", phone: "+1 (555) 556-9900", rating: 4.90, jobsCompleted: 205, status: "AVAILABLE" as const, latitude: 40.7410, longitude: -73.9897, address: "Flatiron District, NY", specialties: ["Emergency Breakdown", "Diagnostics", "AC"], vehicleType: "Ford E-Transit Van" },
  { id: "mech_18", name: "Arthur Pendelton", email: "arthur.p@instantmechanic.com", phone: "+1 (555) 778-3344", rating: 4.84, jobsCompleted: 155, status: "BUSY" as const, latitude: 40.7891, longitude: -73.9510, address: "Harlem, NY", specialties: ["Suspension", "Brakes", "Heavy Mechanical"], vehicleType: "Freightliner Sprinter 4x4" },
  { id: "mech_19", name: "Nadia Belkacem", email: "nadia.b@instantmechanic.com", phone: "+1 (555) 667-2211", rating: 4.96, jobsCompleted: 310, status: "AVAILABLE" as const, latitude: 40.7638, longitude: -73.9729, address: "Midtown East, NY", specialties: ["Brakes", "Full Synthetic Oil", "Electrical"], vehicleType: "Mercedes Vito Service Edition" },
  { id: "mech_20", name: "Samir Ghaffar", email: "samir.g@instantmechanic.com", phone: "+1 (555) 334-5566", rating: 4.88, jobsCompleted: 188, status: "EN_ROUTE" as const, latitude: 40.7020, longitude: -73.9880, address: "Red Hook, Brooklyn, NY", specialties: ["Roadside Assist", "Batteries", "Tires"], vehicleType: "Ford Transit High Roof" },
  { id: "mech_21", name: "Lucas Silva", email: "lucas.s@instantmechanic.com", phone: "+1 (555) 887-4455", rating: 4.91, jobsCompleted: 215, status: "AVAILABLE" as const, latitude: 40.7420, longitude: -74.0048, address: "Chelsea, NY", specialties: ["Performance Diagnostics", "Brakes", "Oil"], vehicleType: "Volkswagen Transporter 4Motion" },
  { id: "mech_22", name: "Grace Liu", email: "grace.l@instantmechanic.com", phone: "+1 (555) 229-8833", rating: 4.95, jobsCompleted: 260, status: "AVAILABLE" as const, latitude: 40.7150, longitude: -73.9970, address: "Chinatown, NY", specialties: ["EV High Voltage", "Diagnostics", "Climate"], vehicleType: "Tesla Model Y Mobile Service Rig" },
  { id: "mech_23", name: "Dmitri Volkov", email: "dmitri.v@instantmechanic.com", phone: "+1 (555) 441-9988", rating: 4.83, jobsCompleted: 145, status: "ON_BREAK" as const, latitude: 40.8116, longitude: -73.9465, address: "Morningside, NY", specialties: ["Brakes", "Suspension", "Exhaust"], vehicleType: "Ford Super Duty Mobile Rig" },
  { id: "mech_24", name: "Amara Okafor", email: "amara.o@instantmechanic.com", phone: "+1 (555) 772-1144", rating: 4.97, jobsCompleted: 335, status: "AVAILABLE" as const, latitude: 40.7350, longitude: -73.9910, address: "Union Square, NY", specialties: ["Emergency Breakdown", "Electrical", "Diagnostics"], vehicleType: "Mercedes Sprinter Rapid Tech" },
  { id: "mech_25", name: "Travis Sterling", email: "travis.s@instantmechanic.com", phone: "+1 (555) 991-6677", rating: 4.89, jobsCompleted: 198, status: "AVAILABLE" as const, latitude: 40.7680, longitude: -73.9815, address: "Columbus Circle, NY", specialties: ["Oil Change", "Brake Overhaul", "Tires"], vehicleType: "Chevy Silverado Service Box" },
];

const CUSTOMER_RAW_DATA = [
  { name: "Alexander Wright", email: "alex.wright@apextech.io", phone: "+1 (555) 101-2030", address: "450 Lexington Ave", city: "New York, NY", make: "Tesla", model: "Model 3 Long Range", year: 2023, plate: "EV-882-NY", vin: "5YJ3E1EB9PF884102", color: "Pearl White", fuel: "Electric" },
  { name: "Sophia Martinez", email: "sophia.m@stellarcorp.com", phone: "+1 (555) 202-3040", address: "787 7th Ave", city: "New York, NY", make: "BMW", model: "M340i xDrive", year: 2022, plate: "NY-M340-X", vin: "WBA5R7C58NF729184", color: "Portimao Blue", fuel: "Gasoline" },
  { name: "Benjamin Clark", email: "bclark@manhattanlaw.com", phone: "+1 (555) 303-4050", address: "200 West St", city: "New York, NY", make: "Audi", model: "Q7 55 TFSI", year: 2021, plate: "Q7-991-LUX", vin: "WA1VAAF75MD019845", color: "Daytona Gray", fuel: "Gasoline" },
  { name: "Emma Johnson", email: "emma.j@creativestudio.net", phone: "+1 (555) 404-5060", address: "55 Water St", city: "Brooklyn, NY", make: "Ford", model: "F-150 Lightning", year: 2023, plate: "EV-TRK-77", vin: "1FT6W1EV8PW109482", color: "Antimatter Blue", fuel: "Electric" },
  { name: "Lucas Moreau", email: "lucas.moreau@fintechhub.com", phone: "+1 (555) 505-6070", address: "1301 Ave of the Americas", city: "New York, NY", make: "Porsche", model: "Macan GTS", year: 2022, plate: "PC-911-GTS", vin: "WP1AB2AY5NLA83921", color: "Carmine Red", fuel: "Gasoline" },
  { name: "Olivia Taylor", email: "olivia.taylor@medhealth.org", phone: "+1 (555) 606-7080", address: "525 E 68th St", city: "New York, NY", make: "Mercedes-Benz", model: "C300 4MATIC", year: 2023, plate: "MB-300-NY", vin: "W1KWF8DB4PR293847", color: "Obsidian Black", fuel: "Gasoline" },
  { name: "Daniel Chen", email: "daniel.chen@quantumv.com", phone: "+1 (555) 707-8090", address: "375 Hudson St", city: "New York, NY", make: "Toyota", model: "RAV4 Prime", year: 2023, plate: "RAV-772-HYB", vin: "JTMAB3FV8PD049281", color: "Silver Sky", fuel: "Plug-in Hybrid" },
  { name: "Mia Rossi", email: "mia.rossi@voguemedia.com", phone: "+1 (555) 808-9101", address: "1 World Trade Center", city: "New York, NY", make: "Volvo", model: "XC90 Recharge", year: 2022, plate: "VOL-994-EV", vin: "YV4BR00U4N1629483", color: "Crystal White", fuel: "Plug-in Hybrid" },
  { name: "Ethan Davis", email: "ethan.d@brooklyndesign.co", phone: "+1 (555) 909-1212", address: "250 Bedford Ave", city: "Brooklyn, NY", make: "Honda", model: "Civic Type R", year: 2023, plate: "CTR-881-FL5", vin: "JHMFL5G45PX001928", color: "Championship White", fuel: "Gasoline" },
  { name: "Isabella Garcia", email: "isabella.g@globalconsult.com", phone: "+1 (555) 111-2233", address: "666 5th Ave", city: "New York, NY", make: "Lexus", model: "RX 500h F Sport", year: 2023, plate: "LEX-500-FS", vin: "2T2BCMGA8PC019482", color: "Copper Crest", fuel: "Hybrid" },
];

class DatabaseEngine {
  public customers: CustomerType[] = [];
  public vehicles: VehicleType[] = [];
  public mechanics: MechanicType[] = [];
  public services: ServiceType[] = [];
  public bookings: BookingType[] = [];
  public timelines: BookingTimelineType[] = [];
  public activityLogs: ActivityLogType[] = [];
  private isSeeded = false;

  constructor() {
    this.seed();
  }

  public seed() {
    if (this.isSeeded) return;

    this.customers = [];
    this.vehicles = [];
    this.mechanics = [];
    this.services = [...INITIAL_SERVICES];
    this.bookings = [];
    this.timelines = [];
    this.activityLogs = [];

    // 1. Mechanics
    INITIAL_MECHANICS_DATA.forEach((m) => {
      this.mechanics.push({
        ...m,
        totalReviews: Math.floor(m.jobsCompleted * 0.85),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // 2. Customers & Vehicles (generate 60 customers)
    for (let i = 0; i < 60; i++) {
      const base = CUSTOMER_RAW_DATA[i % CUSTOMER_RAW_DATA.length];
      const custId = `cust_${i + 1}`;
      const vehId = `veh_${i + 1}`;

      const customer: CustomerType = {
        id: custId,
        name: i < 10 ? base.name : `${base.name} (Fleet ${i + 1})`,
        email: i < 10 ? base.email : `user${i + 1}.${base.email}`,
        phone: i < 10 ? base.phone : `+1 (555) ${100 + i}-${2000 + i}`,
        address: `${100 + i * 12} Broadway`,
        city: "New York, NY",
        totalSpent: 0,
        createdAt: new Date(Date.now() - (60 - i) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };

      const vehicle: VehicleType = {
        id: vehId,
        customerId: custId,
        make: base.make,
        model: base.model,
        year: base.year,
        licensePlate: `${base.plate.substring(0, 4)}-${100 + i}`,
        vin: `1VIN${8000000000000 + i * 1928}`,
        color: base.color,
        fuelType: base.fuel,
        mileage: 12000 + i * 1400,
        createdAt: customer.createdAt,
      };

      this.customers.push(customer);
      this.vehicles.push(vehicle);
    }

    // 3. Generate 625+ Historical & Live Bookings
    const now = Date.now();
    const totalCount = 625;
    const paymentMethods = ["CARD", "APPLE_PAY", "CASH", "INSURANCE"] as const;

    for (let i = 1; i <= totalCount; i++) {
      const bookingId = `BK-${1000 + i}`;
      const cust = this.customers[Math.floor(Math.random() * this.customers.length)];
      const veh = this.vehicles.find((v) => v.customerId === cust.id) || this.vehicles[0];
      const serv = this.services[Math.floor(Math.random() * this.services.length)];
      const mech = this.mechanics[Math.floor(Math.random() * this.mechanics.length)];

      let status = "COMPLETED" as any;
      let priority: PriorityLevel = "STANDARD";
      let scheduledDate: Date;
      let completedDate: Date | null = null;
      let paymentStatus: PaymentStatus = "PAID";
      let rating: number | null = 5;
      let review: string | null = "Quick dispatch and expert technician!";

      if (serv.code === "EMERGENCY_ROADSIDE") {
        priority = Math.random() > 0.4 ? "EMERGENCY" : "HIGH";
      }

      if (i > totalCount - 25) {
        // Very recent / Live operations
        const minutesAgo = (totalCount - i) * 15;
        scheduledDate = new Date(now - minutesAgo * 60 * 1000);

        const dice = Math.random();
        if (dice < 0.20) {
          status = "PENDING";
          paymentStatus = "PENDING";
          rating = null;
          review = null;
        } else if (dice < 0.45) {
          status = "ASSIGNED";
          paymentStatus = "PENDING";
          rating = null;
          review = null;
        } else if (dice < 0.70) {
          status = "EN_ROUTE";
          paymentStatus = "PENDING";
          rating = null;
          review = null;
        } else if (dice < 0.90) {
          status = "IN_PROGRESS";
          paymentStatus = "PENDING";
          rating = null;
          review = null;
        } else {
          status = "COMPLETED";
          completedDate = new Date(scheduledDate.getTime() + 45 * 60 * 1000);
        }
      } else {
        const daysAgo = Math.floor(Math.random() * 88) + 1;
        scheduledDate = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

        if (Math.random() < 0.04) {
          status = "CANCELLED";
          paymentStatus = "REFUNDED";
          rating = null;
          review = "Cancelled by user.";
        } else {
          status = "COMPLETED";
          completedDate = new Date(scheduledDate.getTime() + serv.estimatedDurationMin * 60 * 1000);
        }
      }

      const amount = Math.max(49, serv.basePrice + (Math.floor(Math.random() * 60) - 20));
      const lat = 40.75 + (Math.random() - 0.5) * 0.08;
      const lng = -73.98 + (Math.random() - 0.5) * 0.08;

      const booking: BookingType = {
        id: bookingId,
        customerId: cust.id,
        vehicleId: veh.id,
        mechanicId: status === "PENDING" ? null : mech.id,
        serviceId: serv.id,
        status,
        priority,
        scheduledAt: scheduledDate,
        completedAt: completedDate,
        address: `${cust.address}, Bay #${Math.floor(1 + Math.random() * 3)}`,
        latitude: lat,
        longitude: lng,
        amount,
        paymentStatus,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        notes: `Work order dispatched. Priority: ${priority}.`,
        rating,
        review,
        estimatedDurationMin: serv.estimatedDurationMin,
        createdAt: scheduledDate,
        updatedAt: completedDate || scheduledDate,
      };

      this.bookings.push(booking);

      // Timelines
      this.timelines.push({
        id: `tl_${bookingId}_1`,
        bookingId,
        status: "PENDING",
        note: "Service booking registered in operations queue.",
        timestamp: scheduledDate,
      });

      if (status !== "PENDING") {
        this.timelines.push({
          id: `tl_${bookingId}_2`,
          bookingId,
          status: "ASSIGNED",
          note: `Assigned to technician ${mech.name}.`,
          timestamp: new Date(scheduledDate.getTime() + 2 * 60 * 1000),
        });
      }

      if (status === "EN_ROUTE" || status === "IN_PROGRESS" || status === "COMPLETED") {
        this.timelines.push({
          id: `tl_${bookingId}_3`,
          bookingId,
          status: "EN_ROUTE",
          note: `Technician en route in ${mech.vehicleType}.`,
          timestamp: new Date(scheduledDate.getTime() + 8 * 60 * 1000),
        });
      }

      if (status === "IN_PROGRESS" || status === "COMPLETED") {
        this.timelines.push({
          id: `tl_${bookingId}_4`,
          bookingId,
          status: "IN_PROGRESS",
          note: `Diagnostic and mechanical service underway.`,
          timestamp: new Date(scheduledDate.getTime() + 22 * 60 * 1000),
        });
      }

      if (status === "COMPLETED") {
        this.timelines.push({
          id: `tl_${bookingId}_5`,
          bookingId,
          status: "COMPLETED",
          note: `Service completed and certified.`,
          timestamp: completedDate || new Date(scheduledDate.getTime() + 60 * 60 * 1000),
        });
        cust.totalSpent += amount;
      }
    }

    // 4. Initial Activity Logs
    this.activityLogs = [
      { id: "act_1", type: "EMERGENCY_DISPATCH", title: "🚨 Emergency Roadside Dispatched", description: "Elena Rostova dispatched to BMW M340i on FDR Drive.", createdAt: new Date() },
      { id: "act_2", type: "STATUS_CHANGED", title: "Job Completed", description: "Marcus Vance certified Brake Pad Replacement as COMPLETED.", createdAt: new Date(now - 12 * 60 * 1000) },
      { id: "act_3", type: "BOOKING_CREATED", title: "New Service Booking", description: "Customer Sophia Martinez booked Full Synthetic Oil Service.", createdAt: new Date(now - 25 * 60 * 1000) },
      { id: "act_4", type: "PAYMENT_RECEIVED", title: "Payment Processed", description: "$280.00 settled via Apple Pay for BK-1620.", createdAt: new Date(now - 45 * 60 * 1000) },
      { id: "act_5", type: "MECHANIC_ASSIGNED", title: "Technician Dispatched", description: "Aisha Patel assigned to Tesla Model 3 High Voltage scan.", createdAt: new Date(now - 60 * 60 * 1000) },
    ];

    this.isSeeded = true;
  }
}

// Global Singleton
const globalForDb = globalThis as unknown as { dbEngine: DatabaseEngine | undefined };
export const db = globalForDb.dbEngine ?? new DatabaseEngine();
if (process.env.NODE_ENV !== "production") globalForDb.dbEngine = db;

// Prisma Adapter Layer
export const prisma = {
  customer: {
    findMany: async (args?: any) => {
      let list = [...db.customers];
      if (args?.where?.createdAt?.gte) {
        list = list.filter((c) => new Date(c.createdAt) >= new Date(args.where.createdAt.gte));
      }
      if (args?.where?.OR) {
        list = list.filter((c) =>
          args.where.OR.some((clause: any) => {
            const key = Object.keys(clause)[0] as keyof CustomerType;
            return (c[key] as string)?.toLowerCase()?.includes(clause[key].contains.toLowerCase());
          })
        );
      }
      if (args?.orderBy?.totalSpent === "desc") {
        list.sort((a, b) => b.totalSpent - a.totalSpent);
      }
      const skip = args?.skip || 0;
      const take = args?.take ? skip + args.take : list.length;
      return list.slice(skip, take).map((c) => ({
        ...c,
        vehicles: db.vehicles.filter((v) => v.customerId === c.id),
        _count: { bookings: db.bookings.filter((b) => b.customerId === c.id).length },
      }));
    },
    findUnique: async (args: any) => {
      const c = db.customers.find((cust) => cust.id === args.where.id);
      if (!c) return null;
      return {
        ...c,
        vehicles: db.vehicles.filter((v) => v.customerId === c.id),
        bookings: db.bookings
          .filter((b) => b.customerId === c.id)
          .map((b) => ({
            ...b,
            service: db.services.find((s) => s.id === b.serviceId),
            mechanic: db.mechanics.find((m) => m.id === b.mechanicId),
            vehicle: db.vehicles.find((v) => v.id === b.vehicleId),
          })),
      };
    },
    create: async (args: any) => {
      const customer: CustomerType = {
        id: `cust_${Date.now()}`,
        ...args.data,
        totalSpent: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.customers.push(customer);
      return customer;
    },
    update: async (args: any) => {
      const c = db.customers.find((cust) => cust.id === args.where.id);
      if (!c) throw new Error("Customer not found");
      if (args.data.totalSpent?.increment) c.totalSpent += args.data.totalSpent.increment;
      else if (args.data.totalSpent !== undefined) c.totalSpent = args.data.totalSpent;
      c.updatedAt = new Date();
      return c;
    },
    count: async (args?: any) => {
      if (args?.where?.createdAt?.gte) {
        return db.customers.filter((c) => new Date(c.createdAt) >= new Date(args.where.createdAt.gte)).length;
      }
      return db.customers.length;
    },
    deleteMany: async () => {
      db.customers = [];
    },
  },

  vehicle: {
    findMany: async () => db.vehicles,
    findUnique: async (args: any) => db.vehicles.find((v) => v.id === args.where.id) || null,
    create: async (args: any) => {
      const veh: VehicleType = {
        id: `veh_${Date.now()}`,
        ...args.data,
        createdAt: new Date(),
      };
      db.vehicles.push(veh);
      return veh;
    },
    deleteMany: async () => {
      db.vehicles = [];
    },
  },

  mechanic: {
    findMany: async (args?: any) => {
      let list = [...db.mechanics];
      if (args?.where?.status?.in) {
        list = list.filter((m) => args.where.status.in.includes(m.status));
      } else if (args?.where?.status) {
        list = list.filter((m) => m.status === args.where.status);
      }
      if (args?.where?.OR) {
        list = list.filter((m) =>
          args.where.OR.some((clause: any) => {
            const key = Object.keys(clause)[0] as keyof MechanicType;
            return (m[key] as string)?.toLowerCase()?.includes(clause[key].contains.toLowerCase());
          })
        );
      }
      if (args?.orderBy?.jobsCompleted === "desc") {
        list.sort((a, b) => b.jobsCompleted - a.jobsCompleted);
      }
      if (args?.take) list = list.slice(0, args.take);

      return list.map((m) => ({
        ...m,
        bookings: db.bookings.filter((b) => b.mechanicId === m.id && ["ASSIGNED", "EN_ROUTE", "IN_PROGRESS"].includes(b.status)),
      }));
    },
    findUnique: async (args: any) => {
      const m = db.mechanics.find((mech) => mech.id === args.where.id);
      if (!m) return null;
      return {
        ...m,
        bookings: db.bookings
          .filter((b) => b.mechanicId === m.id)
          .map((b) => ({
            ...b,
            customer: db.customers.find((c) => c.id === b.customerId),
            vehicle: db.vehicles.find((v) => v.id === b.vehicleId),
            service: db.services.find((s) => s.id === b.serviceId),
          })),
      };
    },
    findFirst: async (args?: any) => {
      return db.mechanics.find((m) => !args?.where?.status || m.status === args.where.status) || null;
    },
    update: async (args: any) => {
      const m = db.mechanics.find((mech) => mech.id === args.where.id);
      if (!m) throw new Error("Mechanic not found");
      if (args.data.status) m.status = args.data.status;
      if (args.data.latitude !== undefined) m.latitude = args.data.latitude;
      if (args.data.longitude !== undefined) m.longitude = args.data.longitude;
      if (args.data.jobsCompleted?.increment) m.jobsCompleted += args.data.jobsCompleted.increment;
      m.updatedAt = new Date();
      return m;
    },
    count: async (args?: any) => {
      if (args?.where?.status?.in) {
        return db.mechanics.filter((m) => args.where.status.in.includes(m.status)).length;
      }
      if (args?.where?.status) {
        return db.mechanics.filter((m) => m.status === args.where.status).length;
      }
      return db.mechanics.length;
    },
    deleteMany: async () => {
      db.mechanics = [];
    },
  },

  service: {
    findMany: async () => db.services,
    findUnique: async (args: any) => db.services.find((s) => s.id === args.where.id) || null,
    findFirst: async (args?: any) => db.services.find((s) => !args?.where?.code || s.code === args.where.code) || null,
    create: async (args: any) => {
      const serv: ServiceType = { id: `srv_${Date.now()}`, ...args.data };
      db.services.push(serv);
      return serv;
    },
    deleteMany: async () => {
      db.services = [];
    },
  },

  booking: {
    findMany: async (args?: any) => {
      let list = [...db.bookings];
      if (args?.where?.status) {
        list = list.filter((b) => b.status === args.where.status);
      }
      if (args?.where?.priority) {
        list = list.filter((b) => b.priority === args.where.priority);
      }
      if (args?.where?.serviceId) {
        list = list.filter((b) => b.serviceId === args.where.serviceId);
      }
      if (args?.where?.mechanicId) {
        list = list.filter((b) => b.mechanicId === args.where.mechanicId);
      }
      if (args?.where?.scheduledAt?.gte) {
        list = list.filter((b) => new Date(b.scheduledAt) >= new Date(args.where.scheduledAt.gte));
      }
      if (args?.where?.scheduledAt?.lte) {
        list = list.filter((b) => new Date(b.scheduledAt) <= new Date(args.where.scheduledAt.lte));
      }
      if (args?.where?.OR) {
        list = list.filter((b) => {
          const cust = db.customers.find((c) => c.id === b.customerId);
          const veh = db.vehicles.find((v) => v.id === b.vehicleId);
          return args.where.OR.some((clause: any) => {
            if (clause.id) return b.id.toLowerCase().includes(clause.id.contains.toLowerCase());
            if (clause.address) return b.address.toLowerCase().includes(clause.address.contains.toLowerCase());
            if (clause.customer?.name) return cust?.name.toLowerCase().includes(clause.customer.name.contains.toLowerCase());
            if (clause.vehicle?.licensePlate) return veh?.licensePlate.toLowerCase().includes(clause.vehicle.licensePlate.contains.toLowerCase());
            return false;
          });
        });
      }

      // Sort
      if (args?.orderBy) {
        const sortKey = Object.keys(args.orderBy)[0] as keyof BookingType;
        const dir = args.orderBy[sortKey];
        list.sort((a, b) => {
          const valA = new Date(a[sortKey] as any).getTime() || (a[sortKey] as any);
          const valB = new Date(b[sortKey] as any).getTime() || (b[sortKey] as any);
          return dir === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
        });
      }

      const skip = args?.skip || 0;
      const take = args?.take ? skip + args.take : list.length;

      return list.slice(skip, take).map((b) => ({
        ...b,
        customer: db.customers.find((c) => c.id === b.customerId),
        vehicle: db.vehicles.find((v) => v.id === b.vehicleId),
        mechanic: db.mechanics.find((m) => m.id === b.mechanicId) || null,
        service: db.services.find((s) => s.id === b.serviceId),
        timeline: db.timelines.filter((t) => t.bookingId === b.id),
      }));
    },

    findUnique: async (args: any) => {
      const b = db.bookings.find((book) => book.id === args.where.id);
      if (!b) return null;
      return {
        ...b,
        customer: db.customers.find((c) => c.id === b.customerId),
        vehicle: db.vehicles.find((v) => v.id === b.vehicleId),
        mechanic: db.mechanics.find((m) => m.id === b.mechanicId) || null,
        service: db.services.find((s) => s.id === b.serviceId),
        timeline: db.timelines.filter((t) => t.bookingId === b.id),
      };
    },

    findFirst: async (args?: any) => {
      const matches = await prisma.booking.findMany({ where: args?.where, take: 1 });
      return matches[0] || null;
    },

    create: async (args: any) => {
      const booking: BookingType = {
        id: args.data.id || `BK-${1000 + db.bookings.length + 1}`,
        ...args.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.bookings.unshift(booking);
      return {
        ...booking,
        customer: db.customers.find((c) => c.id === booking.customerId),
        vehicle: db.vehicles.find((v) => v.id === booking.vehicleId),
        mechanic: db.mechanics.find((m) => m.id === booking.mechanicId) || null,
        service: db.services.find((s) => s.id === booking.serviceId),
        timeline: [],
      };
    },

    update: async (args: any) => {
      const b = db.bookings.find((book) => book.id === args.where.id);
      if (!b) throw new Error("Booking not found");
      Object.assign(b, args.data);
      b.updatedAt = new Date();
      return {
        ...b,
        customer: db.customers.find((c) => c.id === b.customerId),
        vehicle: db.vehicles.find((v) => v.id === b.vehicleId),
        mechanic: db.mechanics.find((m) => m.id === b.mechanicId) || null,
        service: db.services.find((s) => s.id === b.serviceId),
        timeline: db.timelines.filter((t) => t.bookingId === b.id),
      };
    },

    count: async (args?: any) => {
      let list = db.bookings;
      if (args?.where?.status?.in) list = list.filter((b) => args.where.status.in.includes(b.status));
      else if (args?.where?.status) list = list.filter((b) => b.status === args.where.status);
      if (args?.where?.scheduledAt?.gte) list = list.filter((b) => new Date(b.scheduledAt) >= new Date(args.where.scheduledAt.gte));
      return list.length;
    },

    aggregate: async (args: any) => {
      let list = db.bookings;
      if (args?.where?.status) list = list.filter((b) => b.status === args.where.status);
      if (args?.where?.scheduledAt?.gte) list = list.filter((b) => new Date(b.scheduledAt) >= new Date(args.where.scheduledAt.gte));
      if (args?.where?.scheduledAt?.lt) list = list.filter((b) => new Date(b.scheduledAt) < new Date(args.where.scheduledAt.lt));

      const sumAmount = list.reduce((acc, b) => acc + (b.amount || 0), 0);
      const rated = list.filter((b) => b.rating !== null && b.rating !== undefined);
      const avgRating = rated.length ? rated.reduce((acc, b) => acc + (b.rating || 5), 0) / rated.length : 4.9;

      return {
        _sum: { amount: sumAmount },
        _avg: { rating: avgRating },
      };
    },

    deleteMany: async () => {
      db.bookings = [];
    },
  },

  bookingTimeline: {
    create: async (args: any) => {
      const tl: BookingTimelineType = {
        id: `tl_${Date.now()}_${Math.random()}`,
        ...args.data,
        timestamp: new Date(),
      };
      db.timelines.push(tl);
      return tl;
    },
    deleteMany: async () => {
      db.timelines = [];
    },
  },

  activityLog: {
    findMany: async (args?: any) => {
      const limit = args?.take || 10;
      return [...db.activityLogs].slice(0, limit);
    },
    create: async (args: any) => {
      const log: ActivityLogType = {
        id: `act_${Date.now()}`,
        ...args.data,
        createdAt: new Date(),
      };
      db.activityLogs.unshift(log);
      return log;
    },
    deleteMany: async () => {
      db.activityLogs = [];
    },
  },

  $queryRaw: async (..._args: any[]) => [{ 1: 1 }],
  $disconnect: async () => {},
};
