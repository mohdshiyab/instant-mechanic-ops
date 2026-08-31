import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SERVICES = [
  {
    code: "EMERGENCY_ROADSIDE",
    name: "Emergency Breakdown & Roadside Assist",
    category: "Emergency",
    description: "Rapid mobile dispatch for battery failure, flat tire, engine stalls, and towing assessment.",
    basePrice: 120.0,
    estimatedDurationMin: 45,
    icon: "AlertTriangle",
  },
  {
    code: "FULL_OIL_SERVICE",
    name: "Full Synthetic Oil & Filter Service",
    category: "Maintenance",
    description: "Premium synthetic engine oil replacement, OEM filter change, and 30-point health check.",
    basePrice: 145.0,
    estimatedDurationMin: 60,
    icon: "Droplet",
  },
  {
    code: "BRAKE_SYSTEM_OVERHAUL",
    name: "Brake Pad & Rotor Replacement",
    category: "Brakes",
    description: "Ceramic brake pad installation, rotor inspection/resurfacing, and fluid flush.",
    basePrice: 280.0,
    estimatedDurationMin: 90,
    icon: "ShieldAlert",
  },
  {
    code: "ENGINE_DIAGNOSTICS",
    name: "Comprehensive OBD-II Diagnostic Scan",
    category: "Diagnostics",
    description: "Full electronic control unit scanning, live sensor diagnostics, and failure code analysis.",
    basePrice: 95.0,
    estimatedDurationMin: 40,
    icon: "Cpu",
  },
  {
    code: "BATTERY_REPLACEMENT",
    name: "AGM / Lithium Battery Replacement",
    category: "Electrical",
    description: "On-site battery testing, heavy-duty battery installation, and alternator charging test.",
    basePrice: 220.0,
    estimatedDurationMin: 35,
    icon: "Zap",
  },
  {
    code: "AC_RECHARGE_REPAIR",
    name: "AC Climate Control Diagnostic & Gas Recharge",
    category: "Climate",
    description: "R134a/R1234yf vacuum test, UV dye leak inspection, and refrigerant recharge.",
    basePrice: 175.0,
    estimatedDurationMin: 60,
    icon: "Wind",
  },
  {
    code: "TIRE_FIT_BALANCE",
    name: "Mobile Tire Replacement & Wheel Balance",
    category: "Tires",
    description: "On-site tire mounting, dynamic digital wheel balancing, and tire pressure monitoring calibration.",
    basePrice: 210.0,
    estimatedDurationMin: 50,
    icon: "CircleDot",
  },
  {
    code: "SUSPENSION_CHECK",
    name: "Suspension, Struts & Steering Overhaul",
    category: "Suspension",
    description: "Shock absorber replacement, sway bar links, and front-end steering alignment check.",
    basePrice: 380.0,
    estimatedDurationMin: 120,
    icon: "Wrench",
  },
];

const MECHANIC_DATA = [
  { name: "Marcus Vance", email: "marcus.v@instantmechanic.com", phone: "+1 (555) 201-9841", rating: 4.96, jobsCompleted: 284, status: "AVAILABLE", lat: 40.7580, lng: -73.9855, address: "Midtown Manhattan, NY", specialties: ["Brakes", "Engine Diagnostics", "EV Systems"], vehicleType: "Mercedes Sprinter Van (Mobile Workshop 01)" },
  { name: "Elena Rostova", email: "elena.r@instantmechanic.com", phone: "+1 (555) 342-8812", rating: 4.92, jobsCompleted: 312, status: "EN_ROUTE", lat: 40.7484, lng: -73.9857, address: "Empire District, NY", specialties: ["Emergency Breakdown", "Electrical", "Diagnostics"], vehicleType: "Ford Transit Custom (Rapid Response 02)" },
  { name: "Devon Brooks", email: "devon.b@instantmechanic.com", phone: "+1 (555) 489-1190", rating: 4.88, jobsCompleted: 195, status: "BUSY", lat: 40.7128, lng: -74.0060, address: "Financial District, NY", specialties: ["Suspension", "Brakes", "Tires"], vehicleType: "RAM ProMaster 2500" },
  { name: "Sarah Jenkins", email: "sarah.j@instantmechanic.com", phone: "+1 (555) 612-4433", rating: 4.98, jobsCompleted: 420, status: "AVAILABLE", lat: 40.7829, lng: -73.9654, address: "Upper East Side, NY", specialties: ["Full Maintenance", "Oil Service", "Diagnostics"], vehicleType: "Volkswagen Crafter EV" },
  { name: "Tariq Al-Mansoor", email: "tariq.m@instantmechanic.com", phone: "+1 (555) 773-9021", rating: 4.85, jobsCompleted: 167, status: "AVAILABLE", lat: 40.7282, lng: -73.7949, address: "Flushing, Queens, NY", specialties: ["Air Conditioning", "Tire Fitting", "Electrical"], vehicleType: "Nissan NV200 Mobile Rig" },
  { name: "Chloe Dupont", email: "chloe.d@instantmechanic.com", phone: "+1 (555) 901-3329", rating: 4.95, jobsCompleted: 248, status: "EN_ROUTE", lat: 40.6782, lng: -73.9442, address: "Crown Heights, Brooklyn, NY", specialties: ["Emergency Breakdown", "Batteries", "Brakes"], vehicleType: "BMW F850GS Emergency Moto" },
  { name: "Liam O'Connor", email: "liam.oc@instantmechanic.com", phone: "+1 (555) 843-2219", rating: 4.89, jobsCompleted: 210, status: "BUSY", lat: 40.7061, lng: -73.9969, address: "DUMBO, Brooklyn, NY", specialties: ["Engine Diagnostics", "Brakes", "Suspension"], vehicleType: "Ford Transit 350 Heavy" },
  { name: "Aisha Patel", email: "aisha.p@instantmechanic.com", phone: "+1 (555) 431-7788", rating: 4.97, jobsCompleted: 350, status: "AVAILABLE", lat: 40.7614, lng: -73.8311, address: "Astoria, Queens, NY", specialties: ["EV Diagnostics", "High Voltage", "Maintenance"], vehicleType: "Rivian EDV 500 Service Van" },
  { name: "Mateo Rodriguez", email: "mateo.r@instantmechanic.com", phone: "+1 (555) 554-1290", rating: 4.79, jobsCompleted: 142, status: "ON_BREAK", lat: 40.8448, lng: -73.8648, address: "Pelham Bay, Bronx, NY", specialties: ["Tire Services", "Oil Change", "Batteries"], vehicleType: "Chevy Express 2500" },
  { name: "Kenji Takahashi", email: "kenji.t@instantmechanic.com", phone: "+1 (555) 672-8833", rating: 4.94, jobsCompleted: 290, status: "AVAILABLE", lat: 40.7306, lng: -73.9352, address: "Long Island City, NY", specialties: ["Diagnostics", "Performance Tuning", "Brakes"], vehicleType: "Toyota HiAce Custom" },
  { name: "Hannah Schmidt", email: "hannah.s@instantmechanic.com", phone: "+1 (555) 234-9912", rating: 4.91, jobsCompleted: 180, status: "AVAILABLE", lat: 40.7505, lng: -73.9934, address: "Hudson Yards, NY", specialties: ["Climate Control", "Electrical", "Diagnostics"], vehicleType: "Mercedes Metris Service Unit" },
  { name: "Julian Thorne", email: "julian.t@instantmechanic.com", phone: "+1 (555) 890-4411", rating: 4.86, jobsCompleted: 160, status: "EN_ROUTE", lat: 40.7223, lng: -73.9874, address: "Lower East Side, NY", specialties: ["Emergency Roadside", "Tires", "Batteries"], vehicleType: "Honda Africa Twin Quick-Response" },
  { name: "Priya Sharma", email: "priya.s@instantmechanic.com", phone: "+1 (555) 321-7766", rating: 4.93, jobsCompleted: 225, status: "BUSY", lat: 40.7711, lng: -73.9742, address: "Lincoln Center, NY", specialties: ["Brake Overhaul", "Full Oil Service", "Steering"], vehicleType: "Ford Transit Connect" },
  { name: "Carlos Morales", email: "carlos.m@instantmechanic.com", phone: "+1 (555) 765-4321", rating: 4.82, jobsCompleted: 135, status: "AVAILABLE", lat: 40.6928, lng: -73.9903, address: "Brooklyn Heights, NY", specialties: ["Suspension", "Tires", "Oil Change"], vehicleType: "GMC Savana 3500" },
  { name: "Fatima Zahra", email: "fatima.z@instantmechanic.com", phone: "+1 (555) 998-1122", rating: 4.99, jobsCompleted: 390, status: "AVAILABLE", lat: 40.7549, lng: -73.9840, address: "Times Square District, NY", specialties: ["Master Diagnostic", "EV Powertrain", "Brakes"], vehicleType: "Mercedes eSprinter Workshop" },
  { name: "David Kim", email: "david.k@instantmechanic.com", phone: "+1 (555) 443-8877", rating: 4.87, jobsCompleted: 175, status: "OFFLINE", lat: 40.7180, lng: -73.9580, address: "Williamsburg, Brooklyn, NY", specialties: ["Tire Services", "Batteries", "Maintenance"], vehicleType: "Ram ProMaster City" },
  { name: "Zoe Washington", email: "zoe.w@instantmechanic.com", phone: "+1 (555) 556-9900", rating: 4.90, jobsCompleted: 205, status: "AVAILABLE", lat: 40.7410, lng: -73.9897, address: "Flatiron District, NY", specialties: ["Emergency Breakdown", "Diagnostics", "AC"], vehicleType: "Ford E-Transit Van" },
  { name: "Arthur Pendelton", email: "arthur.p@instantmechanic.com", phone: "+1 (555) 778-3344", rating: 4.84, jobsCompleted: 155, status: "BUSY", lat: 40.7891, lng: -73.9510, address: "Harlem, NY", specialties: ["Suspension", "Brakes", "Heavy Mechanical"], vehicleType: "Freightliner Sprinter 4x4" },
  { name: "Nadia Belkacem", email: "nadia.b@instantmechanic.com", phone: "+1 (555) 667-2211", rating: 4.96, jobsCompleted: 310, status: "AVAILABLE", lat: 40.7638, lng: -73.9729, address: "Midtown East, NY", specialties: ["Brakes", "Full Synthetic Oil", "Electrical"], vehicleType: "Mercedes Vito Service Edition" },
  { name: "Samir Ghaffar", email: "samir.g@instantmechanic.com", phone: "+1 (555) 334-5566", rating: 4.88, jobsCompleted: 188, status: "EN_ROUTE", lat: 40.7020, lng: -73.9880, address: "Red Hook, Brooklyn, NY", specialties: ["Roadside Assist", "Batteries", "Tires"], vehicleType: "Ford Transit High Roof" },
  { name: "Lucas Silva", email: "lucas.s@instantmechanic.com", phone: "+1 (555) 887-4455", rating: 4.91, jobsCompleted: 215, status: "AVAILABLE", lat: 40.7420, lng: -74.0048, address: "Chelsea, NY", specialties: ["Performance Diagnostics", "Brakes", "Oil"], vehicleType: "Volkswagen Transporter 4Motion" },
  { name: "Grace Liu", email: "grace.l@instantmechanic.com", phone: "+1 (555) 229-8833", rating: 4.95, jobsCompleted: 260, status: "AVAILABLE", lat: 40.7150, lng: -73.9970, address: "Chinatown, NY", specialties: ["EV High Voltage", "Diagnostics", "Climate"], vehicleType: "Tesla Model Y Mobile Service Rig" },
  { name: "Dmitri Volkov", email: "dmitri.v@instantmechanic.com", phone: "+1 (555) 441-9988", rating: 4.83, jobsCompleted: 145, status: "ON_BREAK", lat: 40.8116, lng: -73.9465, address: "Morningside, NY", specialties: ["Brakes", "Suspension", "Exhaust"], vehicleType: "Ford Super Duty Mobile Rig" },
  { name: "Amara Okafor", email: "amara.o@instantmechanic.com", phone: "+1 (555) 772-1144", rating: 4.97, jobsCompleted: 335, status: "AVAILABLE", lat: 40.7350, lng: -73.9910, address: "Union Square, NY", specialties: ["Emergency Breakdown", "Electrical", "Diagnostics"], vehicleType: "Mercedes Sprinter Rapid Tech" },
  { name: "Travis Sterling", email: "travis.s@instantmechanic.com", phone: "+1 (555) 991-6677", rating: 4.89, jobsCompleted: 198, status: "AVAILABLE", lat: 40.7680, lng: -73.9815, address: "Columbus Circle, NY", specialties: ["Oil Change", "Brake Overhaul", "Tires"], vehicleType: "Chevy Silverado Service Box" },
];

const CUSTOMER_NAMES = [
  { name: "Alexander Wright", email: "alex.wright@apextech.io", phone: "+1 (555) 101-2030", address: "450 Lexington Ave", city: "New York, NY", vehicle: { make: "Tesla", model: "Model 3 Long Range", year: 2023, plate: "EV-882-NY", vin: "5YJ3E1EB9PF884102", color: "Pearl White", fuel: "Electric" } },
  { name: "Sophia Martinez", email: "sophia.m@stellarcorp.com", phone: "+1 (555) 202-3040", address: "787 7th Ave", city: "New York, NY", vehicle: { make: "BMW", model: "M340i xDrive", year: 2022, plate: "NY-M340-X", vin: "WBA5R7C58NF729184", color: "Portimao Blue", fuel: "Gasoline" } },
  { name: "Benjamin Clark", email: "bclark@manhattanlaw.com", phone: "+1 (555) 303-4050", address: "200 West St", city: "New York, NY", vehicle: { make: "Audi", model: "Q7 55 TFSI", year: 2021, plate: "Q7-991-LUX", vin: "WA1VAAF75MD019845", color: "Daytona Gray", fuel: "Gasoline" } },
  { name: "Emma Johnson", email: "emma.j@creativestudio.net", phone: "+1 (555) 404-5060", address: "55 Water St", city: "Brooklyn, NY", vehicle: { make: "Ford", model: "F-150 Lightning", year: 2023, plate: "EV-TRK-77", vin: "1FT6W1EV8PW109482", color: "Antimatter Blue", fuel: "Electric" } },
  { name: "Lucas Moreau", email: "lucas.moreau@fintechhub.com", phone: "+1 (555) 505-6070", address: "1301 Ave of the Americas", city: "New York, NY", vehicle: { make: "Porsche", model: "Macan GTS", year: 2022, plate: "PC-911-GTS", vin: "WP1AB2AY5NLA83921", color: "Carmine Red", fuel: "Gasoline" } },
  { name: "Olivia Taylor", email: "olivia.taylor@medhealth.org", phone: "+1 (555) 606-7080", address: "525 E 68th St", city: "New York, NY", vehicle: { make: "Mercedes-Benz", model: "C300 4MATIC", year: 2023, plate: "MB-300-NY", vin: "W1KWF8DB4PR293847", color: "Obsidian Black", fuel: "Gasoline" } },
  { name: "Daniel Chen", email: "daniel.chen@quantumv.com", phone: "+1 (555) 707-8090", address: "375 Hudson St", city: "New York, NY", vehicle: { make: "Toyota", model: "RAV4 Prime", year: 2023, plate: "RAV-772-HYB", vin: "JTMAB3FV8PD049281", color: "Silver Sky", fuel: "Plug-in Hybrid" } },
  { name: "Mia Rossi", email: "mia.rossi@voguemedia.com", phone: "+1 (555) 808-9101", address: "1 World Trade Center", city: "New York, NY", vehicle: { make: "Volvo", model: "XC90 Recharge", year: 2022, plate: "VOL-994-EV", vin: "YV4BR00U4N1629483", color: "Crystal White", fuel: "Plug-in Hybrid" } },
  { name: "Ethan Davis", email: "ethan.d@brooklyndesign.co", phone: "+1 (555) 909-1212", address: "250 Bedford Ave", city: "Brooklyn, NY", vehicle: { make: "Honda", model: "Civic Type R", year: 2023, plate: "CTR-881-FL5", vin: "JHMFL5G45PX001928", color: "Championship White", fuel: "Gasoline" } },
  { name: "Isabella Garcia", email: "isabella.g@globalconsult.com", phone: "+1 (555) 111-2233", address: "666 5th Ave", city: "New York, NY", vehicle: { make: "Lexus", model: "RX 500h F Sport", year: 2023, plate: "LEX-500-FS", vin: "2T2BCMGA8PC019482", color: "Copper Crest", fuel: "Hybrid" } },
  { name: "William Miller", email: "wmiller@hudsonholdings.com", phone: "+1 (555) 222-3344", address: "10 Hudson Yards", city: "New York, NY", vehicle: { make: "Land Rover", model: "Defender 110", year: 2022, plate: "DEF-110-V8", vin: "SALWR2V84NA729183", color: "Pangea Green", fuel: "Gasoline" } },
  { name: "Ava Patel", email: "ava.patel@biotechlab.io", phone: "+1 (555) 333-4455", address: "430 E 29th St", city: "New York, NY", vehicle: { make: "Hyundai", model: "Ioniq 5 Limited", year: 2023, plate: "ION-552-EV", vin: "KM8KRDAE9PU194827", color: "Cyber Gray", fuel: "Electric" } },
  { name: "James Wilson", email: "jwilson@logisticsplus.com", phone: "+1 (555) 444-5566", address: "100 Commercial St", city: "Brooklyn, NY", vehicle: { make: "Chevrolet", model: "Tahoe High Country", year: 2022, plate: "THO-991-HC", vin: "1GNSKCKD4NR194829", color: "Summit White", fuel: "Gasoline" } },
  { name: "Charlotte Lee", email: "clee@venturescap.com", phone: "+1 (555) 555-6677", address: "245 Park Ave", city: "New York, NY", vehicle: { make: "Genesis", model: "GV70 Electrified", year: 2023, plate: "GEN-770-EV", vin: "KMUHB4EB9PU019482", color: "Uyuni White", fuel: "Electric" } },
  { name: "Mason Thompson", email: "m.thompson@archgroup.com", phone: "+1 (555) 666-7788", address: "114 5th Ave", city: "New York, NY", vehicle: { make: "Subaru", model: "Outback Wilderness", year: 2023, plate: "SUB-884-WLD", vin: "4S4BTAPC5P3291847", color: "Geyser Blue", fuel: "Gasoline" } },
  { name: "Amelia White", email: "amelia.white@luxuryre.com", phone: "+1 (555) 777-8899", address: "590 Madison Ave", city: "New York, NY", vehicle: { make: "Mercedes-Benz", model: "G63 AMG", year: 2022, plate: "G63-999-NY", vin: "W1N463276NX392817", color: "G Manufaktur Platinum Magno", fuel: "Gasoline" } },
  { name: "Henry Harris", email: "hharris@capitalinvest.com", phone: "+1 (555) 888-9900", address: "390 Park Ave", city: "New York, NY", vehicle: { make: "Tesla", model: "Model S Plaid", year: 2023, plate: "PLD-102-EV", vin: "5YJSA1E63PF928371", color: "Solid Black", fuel: "Electric" } },
  { name: "Harper Martin", email: "harper.m@soundwave.fm", phone: "+1 (555) 999-0011", address: "350 5th Ave", city: "New York, NY", vehicle: { make: "Volkswagen", model: "Golf R", year: 2023, plate: "GLF-007-R", vin: "WVWZZZCD8PW019284", color: "Lapiz Blue", fuel: "Gasoline" } },
  { name: "Sebastian Jackson", email: "sjackson@greenenergysol.com", phone: "+1 (555) 123-4567", address: "180 Maiden Lane", city: "New York, NY", vehicle: { make: "Rivian", model: "R1T Adventure", year: 2023, plate: "RIV-101-AD", vin: "7FCTGAAA3NN019482", color: "Rivian Blue", fuel: "Electric" } },
  { name: "Evelyn King", email: "evelyn.king@apparelco.com", phone: "+1 (555) 234-5678", address: "568 Broadway", city: "New York, NY", vehicle: { make: "Mazda", model: "CX-90 PHEV", year: 2024, plate: "MZD-992-PH", vin: "JM3KKAD45R1019482", color: "Artisan Red", fuel: "Plug-in Hybrid" } },
  { name: "Jack Wright", email: "jack.w@cloudscale.net", phone: "+1 (555) 345-6789", address: "111 8th Ave", city: "New York, NY", vehicle: { make: "BMW", model: "i4 M50", year: 2023, plate: "BMW-50-EV", vin: "WBY33AW08PF019284", color: "Frozen Portimao Blue", fuel: "Electric" } },
  { name: "Ella Scott", email: "ella.scott@designlab.org", phone: "+1 (555) 456-7890", address: "85 Delancey St", city: "New York, NY", vehicle: { make: "Mini", model: "Cooper SE", year: 2023, plate: "MNI-221-EV", vin: "WMWXP3C08P2019482", color: "British Racing Green", fuel: "Electric" } },
  { name: "Noah Green", email: "ngreen@urbanlogistics.com", phone: "+1 (555) 567-8901", address: "300 Cadman Plaza W", city: "Brooklyn, NY", vehicle: { make: "Ford", model: "Explorer ST", year: 2022, plate: "EXP-884-ST", vin: "1FM5K8GC8NGA19482", color: "Agate Black", fuel: "Gasoline" } },
  { name: "Aria Baker", email: "aria.baker@pulseanalytics.ai", phone: "+1 (555) 678-9012", address: "200 Varick St", city: "New York, NY", vehicle: { make: "Audi", model: "RS6 Avant", year: 2023, plate: "RS6-AVN-NY", vin: "WAUZZZF27PN019284", color: "Nardo Gray", fuel: "Gasoline" } },
  { name: "Logan Adams", email: "ladams@cyberdefend.com", phone: "+1 (555) 789-0123", address: "60 Wall St", city: "New York, NY", vehicle: { make: "Cadillac", model: "Escalade-V", year: 2023, plate: "CAD-999-V", vin: "1GYS4HKR2PR019482", color: "Black Raven", fuel: "Gasoline" } },
  { name: "Chloe Nelson", email: "chloe.n@streamlinepr.com", phone: "+1 (555) 890-1234", address: "230 Park Ave", city: "New York, NY", vehicle: { make: "Jeep", model: "Grand Cherokee 4xe", year: 2023, plate: "JEP-442-XE", vin: "1C4RJYE69P8019482", color: "Hydro Blue", fuel: "Plug-in Hybrid" } },
  { name: "Ryan Carter", email: "ryan.c@vertexfin.com", phone: "+1 (555) 901-2345", address: "277 Park Ave", city: "New York, NY", vehicle: { make: "Tesla", model: "Model X Long Range", year: 2023, plate: "TMX-771-EV", vin: "5YJXCAE27PF019482", color: "Ultra Red", fuel: "Electric" } },
  { name: "Layla Mitchell", email: "layla.m@urbanretail.com", phone: "+1 (555) 012-3456", address: "550 5th Ave", city: "New York, NY", vehicle: { make: "Alfa Romeo", model: "Giulia Quadrifoglio", year: 2022, plate: "ALF-505-QV", vin: "ZARFAEAV7N7019482", color: "Rosso Competizione", fuel: "Gasoline" } },
  { name: "Gabriel Perez", email: "gperez@metrotower.com", phone: "+1 (555) 123-9876", address: "30 Rockefeller Plaza", city: "New York, NY", vehicle: { make: "Toyota", model: "Tundra TRD Pro", year: 2023, plate: "TRD-882-NY", vin: "5TFMC5DB9PX019482", color: "Solar Octane", fuel: "Hybrid" } },
  { name: "Zoe Roberts", email: "zoe.roberts@fashionhouse.com", phone: "+1 (555) 234-8765", address: "401 Broadway", city: "New York, NY", vehicle: { make: "Porsche", model: "Taycan 4S", year: 2023, plate: "TYC-441-EV", vin: "WP0AA2Y16PSA01948", color: "Frozen Blue Metallic", fuel: "Electric" } },
];

export async function main() {
  console.log("🚀 Starting database seeding for Instant Mechanic...");

  // 1. Clean existing records
  await prisma.activityLog.deleteMany();
  await prisma.bookingTimeline.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.mechanic.deleteMany();
  await prisma.service.deleteMany();

  console.log("🧹 Cleaned existing database tables.");

  // 2. Insert Services
  const createdServices = [];
  for (const s of SERVICES) {
    const service = await prisma.service.create({
      data: s,
    });
    createdServices.push(service);
  }
  console.log(`✅ Seeded ${createdServices.length} service categories.`);

  // 3. Insert Mechanics
  const createdMechanics = [];
  for (const m of MECHANIC_DATA) {
    const mechanic = await prisma.mechanic.create({
      data: {
        name: m.name,
        email: m.email,
        phone: m.phone,
        rating: m.rating,
        totalReviews: Math.floor(m.jobsCompleted * 0.85),
        jobsCompleted: m.jobsCompleted,
        status: m.status,
        latitude: m.lat,
        longitude: m.lng,
        address: m.address,
        specialties: JSON.stringify(m.specialties),
        vehicleType: m.vehicleType,
      },
    });
    createdMechanics.push(mechanic);
  }
  console.log(`✅ Seeded ${createdMechanics.length} fleet mechanics with live GPS.`);

  // 4. Insert Customers & Vehicles
  const createdCustomers: { id: string; name: string; vehicleId: string; address: string }[] = [];
  
  // Extend customer list to 60 by adding variations
  const extendedCustomers = [...CUSTOMER_NAMES];
  for (let i = 1; i <= 30; i++) {
    const base = CUSTOMER_NAMES[i % CUSTOMER_NAMES.length];
    extendedCustomers.push({
      name: `${base.name} Jr.`,
      email: `user${i}.${base.email}`,
      phone: `+1 (555) ${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000 + Math.random() * 8999)}`,
      address: `${100 + i * 15} Broadway`,
      city: "New York, NY",
      vehicle: {
        make: base.vehicle.make,
        model: `${base.vehicle.model} (Fleet ${i})`,
        year: 2021 + (i % 4),
        plate: `NY-${Math.floor(1000 + Math.random() * 9000)}-${i}`,
        vin: `1VIN${Math.floor(1000000000000 + Math.random() * 8999999999999)}`,
        color: base.vehicle.color,
        fuel: base.vehicle.fuel,
      }
    });
  }

  for (const c of extendedCustomers) {
    const customer = await prisma.customer.create({
      data: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        city: c.city,
        totalSpent: 0,
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        customerId: customer.id,
        make: c.vehicle.make,
        model: c.vehicle.model,
        year: c.vehicle.year,
        licensePlate: c.vehicle.plate,
        vin: c.vehicle.vin,
        color: c.vehicle.color,
        fuelType: c.vehicle.fuel,
        mileage: Math.floor(5000 + Math.random() * 85000),
      },
    });

    createdCustomers.push({
      id: customer.id,
      name: customer.name,
      vehicleId: vehicle.id,
      address: c.address,
    });
  }
  console.log(`✅ Seeded ${createdCustomers.length} registered customers & linked vehicles.`);

  // 5. Generate 600+ realistic bookings over the last 90 days
  console.log("⏳ Generating 620+ historical & live operational bookings...");

  const now = new Date();
  const paymentMethods = ["CARD", "APPLE_PAY", "CASH", "INSURANCE"];
  const totalBookingsCount = 625;

  let totalRevenueAccumulator = 0;
  const customerSpendMap: Record<string, number> = {};

  for (let i = 1; i <= totalBookingsCount; i++) {
    const bookingId = `BK-${1000 + i}`;
    const customer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
    const service = createdServices[Math.floor(Math.random() * createdServices.length)];
    const mechanic = createdMechanics[Math.floor(Math.random() * createdMechanics.length)];

    // Pricing calculation with minor parts variance
    const partsVariance = Math.floor(Math.random() * 80) - 20;
    const amount = Math.max(49, service.basePrice + partsVariance);

    // Distribution: Recent bookings vs past 90 days
    // Last 15 bookings are "TODAY / LIVE" (Pending, Assigned, En Route, In Progress)
    let status = "COMPLETED";
    let priority = "STANDARD";
    let scheduledDate: Date;
    let completedDate: Date | null = null;
    let paymentStatus = "PAID";
    let rating: number | null = 5;
    let review: string | null = "Super prompt technician, fixed everything on my driveway!";

    if (service.code === "EMERGENCY_ROADSIDE") {
      priority = Math.random() > 0.3 ? "EMERGENCY" : "HIGH";
    }

    if (i > totalBookingsCount - 25) {
      // Very recent / Today / Live operations
      const minutesAgo = (totalBookingsCount - i) * 18;
      scheduledDate = new Date(now.getTime() - minutesAgo * 60 * 1000);

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
        rating = 5;
      }
    } else {
      // Past historical bookings
      const daysAgo = Math.floor(Math.random() * 88) + 1;
      const hour = 8 + Math.floor(Math.random() * 11);
      const minute = Math.floor(Math.random() * 60);
      scheduledDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      scheduledDate.setHours(hour, minute, 0, 0);

      const cancelDice = Math.random();
      if (cancelDice < 0.04) {
        status = "CANCELLED";
        paymentStatus = "REFUNDED";
        rating = null;
        review = "Cancelled by user - appointment rescheduled.";
      } else {
        status = "COMPLETED";
        completedDate = new Date(scheduledDate.getTime() + service.estimatedDurationMin * 60 * 1000);
        rating = Math.random() > 0.15 ? 5 : 4;
        review = rating === 5 ? "Flawless service, mechanic arrived early." : "Good job, solved the problem.";
      }
    }

    // Coordinates near Manhattan / Brooklyn with slight jitter
    const latJitter = (Math.random() - 0.5) * 0.08;
    const lngJitter = (Math.random() - 0.5) * 0.08;
    const bookingLat = 40.75 + latJitter;
    const bookingLng = -73.98 + lngJitter;

    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

    const booking = await prisma.booking.create({
      data: {
        id: bookingId,
        customerId: customer.id,
        vehicleId: customer.vehicleId,
        mechanicId: status === "PENDING" ? null : mechanic.id,
        serviceId: service.id,
        status: status,
        priority: priority,
        scheduledAt: scheduledDate,
        completedAt: completedDate,
        address: `${customer.address}, Bay #${Math.floor(1 + Math.random() * 4)}`,
        latitude: bookingLat,
        longitude: bookingLng,
        amount: amount,
        paymentStatus: paymentStatus,
        paymentMethod: paymentMethod,
        notes: `Customer requested contactless drop-off. Priority: ${priority}.`,
        rating: rating,
        review: review,
        estimatedDurationMin: service.estimatedDurationMin,
        createdAt: scheduledDate,
        updatedAt: completedDate || scheduledDate,
      },
    });

    // Create realistic timeline entries
    await prisma.bookingTimeline.create({
      data: {
        bookingId: booking.id,
        status: "PENDING",
        note: "Booking request received via mobile app / dispatch center.",
        timestamp: scheduledDate,
      },
    });

    if (status !== "PENDING") {
      await prisma.bookingTimeline.create({
        data: {
          bookingId: booking.id,
          status: "ASSIGNED",
          note: `Mechanic ${mechanic.name} assigned to work order.`,
          timestamp: new Date(scheduledDate.getTime() + 3 * 60 * 1000),
        },
      });
    }

    if (status === "EN_ROUTE" || status === "IN_PROGRESS" || status === "COMPLETED") {
      await prisma.bookingTimeline.create({
        data: {
          bookingId: booking.id,
          status: "EN_ROUTE",
          note: `${mechanic.name} is en route via ${mechanic.vehicleType}.`,
          timestamp: new Date(scheduledDate.getTime() + 10 * 60 * 1000),
        },
      });
    }

    if (status === "IN_PROGRESS" || status === "COMPLETED") {
      await prisma.bookingTimeline.create({
        data: {
          bookingId: booking.id,
          status: "IN_PROGRESS",
          note: `Diagnostic & repair work started on vehicle.`,
          timestamp: new Date(scheduledDate.getTime() + 25 * 60 * 1000),
        },
      });
    }

    if (status === "COMPLETED") {
      await prisma.bookingTimeline.create({
        data: {
          bookingId: booking.id,
          status: "COMPLETED",
          note: `Service completed successfully. Multi-point inspection passed.`,
          timestamp: completedDate || new Date(scheduledDate.getTime() + 60 * 60 * 1000),
        },
      });

      totalRevenueAccumulator += amount;
      customerSpendMap[customer.id] = (customerSpendMap[customer.id] || 0) + amount;
    }
  }

  // Update customer total spends
  for (const [customerId, spend] of Object.entries(customerSpendMap)) {
    await prisma.customer.update({
      where: { id: customerId },
      data: { totalSpent: spend },
    });
  }

  // 6. Insert initial Activity Logs
  const recentActivities = [
    { type: "EMERGENCY_DISPATCH", title: "Emergency Breakdown Dispatched", description: "Elena Rostova dispatched to BMW M340i on FDR Drive." },
    { type: "STATUS_CHANGED", title: "Job Completed", description: "Marcus Vance marked Brake Pad Replacement as COMPLETED." },
    { type: "BOOKING_CREATED", title: "New Service Booking", description: "Customer Sophia Martinez booked Full Synthetic Oil Service." },
    { type: "PAYMENT_RECEIVED", title: "Payment Processed", description: "$280.00 settled via Apple Pay for BK-1612." },
    { type: "MECHANIC_ASSIGNED", title: "Technician Dispatched", description: "Aisha Patel assigned to Tesla Model 3 High Voltage scan." },
  ];

  for (const act of recentActivities) {
    await prisma.activityLog.create({
      data: act,
    });
  }

  console.log(`🎉 Seeding complete!`);
  console.log(`📊 Generated ${totalBookingsCount} bookings across 90 days.`);
  console.log(`💰 Total historical revenue tracked: $${totalRevenueAccumulator.toLocaleString()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
