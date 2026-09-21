export type UserRole = 'FARMER' | 'OWNER' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'PENDING';

export type EquipmentCategory =
  | 'Tractors'
  | 'Harvesters'
  | 'Rotavators'
  | 'Cultivators'
  | 'Seeders'
  | 'Sprayers'
  | 'Threshers'
  | 'Ploughs'
  | 'Other Machinery';

export type EquipmentAvailability = 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' | 'INACTIVE';
export type EquipmentApproval = 'PENDING' | 'APPROVED' | 'REJECTED';

export type RentalType = 'HOURLY' | 'DAILY';

export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'PAID'
  | 'ACTIVE'
  | 'RETURNED'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentMethod = 'UPI' | 'CARD' | 'DEMO WALLET';
export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface User {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  role: UserRole;
  status: UserStatus;
  isActive?: boolean;
  createdAt: string;
  village?: string;
  district?: string;
  state?: string;
  address?: string;
  businessName?: string;
  verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Equipment {
  id: number;
  ownerId: number;
  ownerName: string;
  ownerPhone: string;
  name: string;
  category: EquipmentCategory;
  brand: string;
  model: string;
  year: number;
  description: string;
  hourlyPrice: number;
  dailyPrice: number;
  location: string;
  village: string;
  district: string;
  state: string;
  image: string;
  availabilityStatus: EquipmentAvailability;
  approvalStatus: EquipmentApproval;
  rating: number;
  reviewCount: number;
  horsepower?: string;
  fuelType?: string;
  createdAt: string;
}

export interface Booking {
  id: number;
  equipmentId: number;
  equipmentName: string;
  equipmentImage: string;
  equipmentCategory: EquipmentCategory;
  ownerId: number;
  ownerName: string;
  ownerPhone: string;
  farmerId: number;
  farmerName: string;
  farmerPhone: string;
  farmerVillage: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endDate: string; // YYYY-MM-DD
  endTime: string; // HH:mm
  rentalType: RentalType;
  duration: number; // hours or days
  hourlyPrice: number;
  dailyPrice: number;
  totalAmount: number;
  bookingStatus: BookingStatus;
  createdAt: string;
  rejectionReason?: string;
  paymentId?: number;
  returnRequestedDate?: string;
  returnConfirmedDate?: string;
}

export interface Payment {
  id: number;
  bookingId: number;
  farmerId: number;
  farmerName: string;
  equipmentName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  paymentStatus: PaymentStatus;
  paymentDate: string;
}

export interface Review {
  id: number;
  bookingId: number;
  farmerId: number;
  farmerName: string;
  equipmentId: number;
  equipmentName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Complaint {
  id: number;
  ticketNumber?: string;
  userId: number;
  userName: string;
  userRole: UserRole;
  userEmail: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  adminNotes?: string;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  category: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  priceType: 'hourly' | 'daily';
  availability: string;
  minRating: number;
  sortBy: 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';
}

export interface SupportCenterConfig {
  centerName: string;
  branchCode?: string;
  address: string;
  villageOrCity: string;
  district: string;
  state: string;
  pincode: string;
  helplinePhone: string;
  tollFree: string;
  supportEmail: string;
  adminEmail: string;
  operatingHours: string;
  emergencySupportPhone?: string;
  mapEmbedQuery?: string;
  lastUpdated?: string;
}

