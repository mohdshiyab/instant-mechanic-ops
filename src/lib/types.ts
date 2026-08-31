export type BookingStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'EN_ROUTE'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type PriorityLevel = 'STANDARD' | 'HIGH' | 'EMERGENCY';

export type PaymentStatus = 'PAID' | 'PENDING' | 'REFUNDED';

export type PaymentMethod = 'CARD' | 'APPLE_PAY' | 'CASH' | 'INSURANCE';

export type MechanicStatus =
  | 'AVAILABLE'
  | 'BUSY'
  | 'EN_ROUTE'
  | 'ON_BREAK'
  | 'OFFLINE';

export type UserRole = 'ADMIN' | 'OPERATIONS' | 'VIEWER';

export interface CustomerType {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string | null;
  address: string;
  city: string;
  totalSpent: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  vehicles?: VehicleType[];
  bookings?: BookingType[];
}

export interface VehicleType {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
  fuelType: string;
  mileage: number;
  createdAt?: string | Date;
  customer?: CustomerType;
}

export interface MechanicType {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string | null;
  rating: number;
  totalReviews: number;
  jobsCompleted: number;
  status: MechanicStatus;
  latitude: number;
  longitude: number;
  address: string;
  specialties: string[] | string;
  vehicleType: string;
  currentBookingId?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  bookings?: BookingType[];
  activeBooking?: BookingType | null;
  history?: BookingType[];
}

export interface ServiceType {
  id: string;
  name: string;
  category: string;
  code: string;
  description: string;
  basePrice: number;
  estimatedDurationMin: number;
  icon: string;
}

export interface BookingTimelineType {
  id: string;
  bookingId: string;
  status: BookingStatus;
  note: string;
  timestamp: string | Date;
}

export interface BookingType {
  id: string;
  customerId: string;
  vehicleId: string;
  mechanicId?: string | null;
  serviceId: string;
  status: BookingStatus;
  priority: PriorityLevel;
  scheduledAt: string | Date;
  completedAt?: string | Date | null;
  address: string;
  latitude: number;
  longitude: number;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string | null;
  rating?: number | null;
  review?: string | null;
  estimatedDurationMin: number;
  createdAt: string | Date;
  updatedAt: string | Date;

  customer?: CustomerType;
  vehicle?: VehicleType;
  mechanic?: MechanicType | null;
  service?: ServiceType;
  timeline?: BookingTimelineType[];
}

export interface ActivityLogType {
  id: string;
  type: string;
  title: string;
  description: string;
  metadata?: string | null;
  createdAt: string | Date;
}

export interface DashboardMetrics {
  totalBookings: number;
  todayBookings: number;
  completedBookings: number;
  pendingBookings: number;
  inProgressBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  todayRevenue: number;
  activeMechanics: number;
  totalMechanics: number;
  newCustomers: number;
  totalCustomers: number;
  averageRating: number;
  avgResponseTimeMin: number;
  trends: {
    bookingsDelta: number;
    revenueDelta: number;
    completedDelta: number;
    customersDelta: number;
  };
}

export interface AnalyticsData {
  revenueOverTime: { date: string; revenue: number; bookings: number }[];
  bookingsByStatus: { status: BookingStatus; count: number; percentage: number; color: string }[];
  serviceBreakdown: { category: string; count: number; revenue: number; percentage: number }[];
  hourlyActivity: { hour: string; bookings: number; dispatches: number }[];
  mechanicPerformance: { name: string; jobsCompleted: number; rating: number; status: MechanicStatus }[];
}

export interface SSEEventPayload {
  type: 'BOOKING_CREATED' | 'BOOKING_UPDATED' | 'MECHANIC_STATUS_CHANGED' | 'EMERGENCY_DISPATCH' | 'METRICS_UPDATED' | 'SIMULATION_TICK';
  timestamp: string;
  data: any;
}
