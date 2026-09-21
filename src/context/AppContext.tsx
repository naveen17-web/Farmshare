import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Equipment,
  Booking,
  Payment,
  Review,
  Complaint,
  SupportCenterConfig,
  UserRole,
  RentalType,
  PaymentMethod,
  EquipmentApproval,
  EquipmentAvailability,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_EQUIPMENT,
  INITIAL_BOOKINGS,
  INITIAL_PAYMENTS,
  INITIAL_REVIEWS,
  INITIAL_COMPLAINTS,
  INITIAL_SUPPORT_CENTER,
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  equipment: Equipment[];
  bookings: Booking[];
  payments: Payment[];
  reviews: Review[];
  complaints: Complaint[];
  supportCenter: SupportCenterConfig;
  
  // Auth methods
  login: (email: string, role?: UserRole) => { success: boolean; message: string; user?: User };
  logout: () => void;
  switchUser: (userId: number) => void;
  registerFarmer: (data: {
    fullName: string;
    mobile: string;
    email: string;
    village: string;
    district: string;
    state: string;
  }) => { success: boolean; message: string; user?: User };
  registerOwner: (data: {
    fullName: string;
    businessName: string;
    mobile: string;
    email: string;
    address: string;
    village: string;
    district: string;
    state: string;
  }) => { success: boolean; message: string; user?: User };
  updateUserProfile: (userId: number, updates: Partial<User>) => void;
  
  // Equipment methods
  addEquipment: (equipmentData: Omit<Equipment, 'id' | 'rating' | 'reviewCount' | 'approvalStatus' | 'createdAt'>) => Equipment;
  updateEquipment: (id: number, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: number) => void;
  approveEquipment: (id: number) => void;
  rejectEquipment: (id: number) => void;
  setEquipmentAvailability: (id: number, status: EquipmentAvailability) => void;

  // Booking methods
  checkEquipmentAvailability: (
    equipmentId: number,
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string,
    excludeBookingId?: number
  ) => { available: boolean; conflictingBooking?: Booking; message: string };
  calculatePrice: (
    equipment: Equipment,
    rentalType: RentalType,
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string
  ) => { duration: number; totalAmount: number };
  createBooking: (bookingData: {
    equipmentId: number;
    rentalType: RentalType;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  }) => { success: boolean; message: string; booking?: Booking };
  acceptBooking: (bookingId: number) => void;
  rejectBooking: (bookingId: number, reason?: string) => void;
  cancelBooking: (bookingId: number) => { success: boolean; message: string };
  processPayment: (bookingId: number, paymentMethod: PaymentMethod) => { success: boolean; message: string; payment?: Payment };
  requestReturn: (bookingId: number) => { success: boolean; message: string };
  confirmReturn: (bookingId: number) => { success: boolean; message: string };

  // Review methods
  addReview: (data: { bookingId: number; equipmentId: number; rating: number; comment: string }) => { success: boolean; message: string };
  deleteReview: (reviewId: number) => void;
  hasFarmerReviewedBooking: (bookingId: number) => boolean;

  // Complaint methods
  submitComplaint: (data: { subject: string; message: string }) => { success: boolean; message: string };
  resolveComplaint: (complaintId: number, notes?: string) => void;
  updateComplaintStatus: (
    complaintId: number,
    status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED',
    notes?: string
  ) => void;

  // Admin methods
  approveOwner: (ownerId: number) => void;
  rejectOwner: (ownerId: number) => void;
  toggleBlockUser: (userId: number) => void;
  toggleUserStatus: (userId: number) => void;
  activateUser: (userId: number) => void;
  deactivateUser: (userId: number) => void;
  deleteUser: (userId: number) => void;
  updateSupportCenter: (updates: Partial<SupportCenterConfig>) => void;

  // Reset demo
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'farmshare_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((u: User) => ({
          ...u,
          status: u.status || 'ACTIVE',
          isActive: u.isActive !== undefined ? u.isActive : u.status === 'ACTIVE',
        }));
      } catch (e) {
        console.error('Failed to parse saved users', e);
      }
    }
    return INITIAL_USERS.map((u) => ({
      ...u,
      status: u.status || 'ACTIVE',
      isActive: u.status === 'ACTIVE',
    }));
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedId = localStorage.getItem(`${STORAGE_KEY}_currentUserId`);
    if (savedId) {
      const found = users.find((u) => u.id === Number(savedId));
      if (found && found.status !== 'BLOCKED') return found;
    }
    return null; // Public guest by default
  });

  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_equipment`);
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bookings`);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_payments`);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_reviews`);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_complaints`);
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [supportCenter, setSupportCenter] = useState<SupportCenterConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_support_center`);
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_CENTER;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_equipment`, JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bookings`, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_reviews`, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_complaints`, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_support_center`, JSON.stringify(supportCenter));
  }, [supportCenter]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_currentUserId`, String(currentUser.id));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_currentUserId`);
    }
  }, [currentUser]);

  // Auth methods
  const login = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, message: 'Invalid credentials. No account found with this email.' };
    }
    if (user.status === 'BLOCKED') {
      return { success: false, message: 'Your account has been suspended by the administrator.' };
    }
    setCurrentUser(user);
    return { success: true, message: `Welcome back, ${user.fullName}!`, user };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: number) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const registerFarmer = (data: {
    fullName: string;
    mobile: string;
    email: string;
    village: string;
    district: string;
    state: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser: User = {
      id: Date.now(),
      fullName: data.fullName.trim(),
      mobile: data.mobile.trim(),
      email: cleanEmail,
      village: data.village.trim(),
      district: data.district.trim(),
      state: data.state.trim(),
      role: 'FARMER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, message: 'Registration successful! Welcome to FarmShare.', user: newUser };
  };

  const registerOwner = (data: {
    fullName: string;
    businessName: string;
    mobile: string;
    email: string;
    address: string;
    village: string;
    district: string;
    state: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser: User = {
      id: Date.now(),
      fullName: data.fullName.trim(),
      businessName: data.businessName.trim(),
      mobile: data.mobile.trim(),
      email: cleanEmail,
      address: data.address.trim(),
      village: data.village.trim(),
      district: data.district.trim(),
      state: data.state.trim(),
      role: 'OWNER',
      status: 'ACTIVE',
      verificationStatus: 'PENDING', // Initial pending approval by Admin
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return {
      success: true,
      message: 'Owner registration received! Your verification is currently pending Admin approval.',
      user: newUser,
    };
  };

  const updateUserProfile = (userId: number, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }

    // Cascade name changes across equipment and bookings for consistency
    if (updates.fullName || updates.businessName) {
      setEquipment((prev) =>
        prev.map((eq) => {
          if (eq.ownerId === userId) {
            const newOwnerName = updates.businessName || updates.fullName || eq.ownerName;
            return { ...eq, ownerName: newOwnerName };
          }
          return eq;
        })
      );

      setBookings((prev) =>
        prev.map((b) => {
          let updated = { ...b };
          if (b.ownerId === userId && (updates.businessName || updates.fullName)) {
            updated.ownerName = updates.businessName || updates.fullName || b.ownerName;
          }
          if (b.farmerId === userId && updates.fullName) {
            updated.farmerName = updates.fullName;
          }
          return updated;
        })
      );
    }
  };

  // Equipment methods
  const addEquipment = (
    equipmentData: Omit<Equipment, 'id' | 'rating' | 'reviewCount' | 'approvalStatus' | 'createdAt'>
  ): Equipment => {
    const newEquip: Equipment = {
      ...equipmentData,
      id: Date.now(),
      rating: 0,
      reviewCount: 0,
      approvalStatus: 'PENDING', // Owner equipment requires admin approval
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEquipment((prev) => [newEquip, ...prev]);
    return newEquip;
  };

  const updateEquipment = (id: number, updates: Partial<Equipment>) => {
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, ...updates } : eq))
    );
  };

  const deleteEquipment = (id: number) => {
    setEquipment((prev) => prev.filter((eq) => eq.id !== id));
  };

  const approveEquipment = (id: number) => {
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, approvalStatus: 'APPROVED' } : eq))
    );
  };

  const rejectEquipment = (id: number) => {
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, approvalStatus: 'REJECTED' } : eq))
    );
  };

  const setEquipmentAvailability = (id: number, status: EquipmentAvailability) => {
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, availabilityStatus: status } : eq))
    );
  };

  // Double booking & Overlapping Availability Check
  const checkEquipmentAvailability = (
    equipmentId: number,
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string,
    excludeBookingId?: number
  ) => {
    const eq = equipment.find((e) => e.id === equipmentId);
    if (!eq) {
      return { available: false, message: 'Equipment not found.' };
    }
    if (eq.availabilityStatus === 'MAINTENANCE') {
      return { available: false, message: 'Equipment is currently under scheduled maintenance.' };
    }
    if (eq.availabilityStatus === 'INACTIVE') {
      return { available: false, message: 'Equipment is currently inactive.' };
    }

    const reqStart = new Date(`${startDate}T${startTime || '00:00'}:00`).getTime();
    const reqEnd = new Date(`${endDate}T${endTime || '23:59'}:00`).getTime();

    if (isNaN(reqStart) || isNaN(reqEnd) || reqEnd <= reqStart) {
      return { available: false, message: 'End date & time must be after start date & time.' };
    }

    // Active or pending bookings for this equipment
    const conflicting = bookings.find((b) => {
      if (b.equipmentId !== equipmentId) return false;
      if (excludeBookingId && b.id === excludeBookingId) return false;
      // Overlapping statuses
      if (!['PENDING', 'ACCEPTED', 'PAID', 'ACTIVE'].includes(b.bookingStatus)) {
        return false;
      }
      const bStart = new Date(`${b.startDate}T${b.startTime || '00:00'}:00`).getTime();
      const bEnd = new Date(`${b.endDate}T${b.endTime || '23:59'}:00`).getTime();

      // Overlap condition: reqStart < bEnd && reqEnd > bStart
      return reqStart < bEnd && reqEnd > bStart;
    });

    if (conflicting) {
      return {
        available: false,
        conflictingBooking: conflicting,
        message: `Equipment is not available for the selected time. An overlapping booking (${conflicting.startDate} to ${conflicting.endDate}) exists with status: ${conflicting.bookingStatus}.`,
      };
    }

    return { available: true, message: 'Equipment is available for this time slot!' };
  };

  // Automatic Server-Side Price Calculation
  const calculatePrice = (
    eq: Equipment,
    rentalType: RentalType,
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string
  ) => {
    const start = new Date(`${startDate}T${startTime || '08:00'}:00`);
    const end = new Date(`${endDate}T${endTime || '18:00'}:00`);
    const diffMs = Math.max(0, end.getTime() - start.getTime());
    const totalHours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));

    if (rentalType === 'HOURLY') {
      const duration = totalHours;
      const totalAmount = duration * eq.hourlyPrice;
      return { duration, totalAmount };
    } else {
      // DAILY rental: calculate full calendar days or 24-hour periods
      const days = Math.max(1, Math.ceil(totalHours / 24));
      const totalAmount = days * eq.dailyPrice;
      return { duration: days, totalAmount };
    }
  };

  const createBooking = (data: {
    equipmentId: number;
    rentalType: RentalType;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  }) => {
    if (!currentUser) {
      return { success: false, message: 'Please log in as a Farmer to book equipment.' };
    }
    if (currentUser.role !== 'FARMER') {
      return { success: false, message: 'Only registered farmers can create bookings.' };
    }

    const eq = equipment.find((e) => e.id === data.equipmentId);
    if (!eq) {
      return { success: false, message: 'Equipment does not exist.' };
    }
    if (eq.approvalStatus !== 'APPROVED') {
      return { success: false, message: 'This equipment is not yet approved by FarmShare Admin.' };
    }

    // Availability validation (double-booking protection)
    const availabilityCheck = checkEquipmentAvailability(
      data.equipmentId,
      data.startDate,
      data.startTime,
      data.endDate,
      data.endTime
    );

    if (!availabilityCheck.available) {
      return { success: false, message: availabilityCheck.message };
    }

    // Server-side price calculation
    const { duration, totalAmount } = calculatePrice(
      eq,
      data.rentalType,
      data.startDate,
      data.startTime,
      data.endDate,
      data.endTime
    );

    const newBooking: Booking = {
      id: Date.now(),
      equipmentId: eq.id,
      equipmentName: eq.name,
      equipmentImage: eq.image,
      equipmentCategory: eq.category,
      ownerId: eq.ownerId,
      ownerName: eq.ownerName,
      ownerPhone: eq.ownerPhone,
      farmerId: currentUser.id,
      farmerName: currentUser.fullName,
      farmerPhone: currentUser.mobile,
      farmerVillage: `${currentUser.village || 'Village'}, ${currentUser.district || 'District'}`,
      startDate: data.startDate,
      startTime: data.startTime || '08:00',
      endDate: data.endDate,
      endTime: data.endTime || '18:00',
      rentalType: data.rentalType,
      duration,
      hourlyPrice: eq.hourlyPrice,
      dailyPrice: eq.dailyPrice,
      totalAmount,
      bookingStatus: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBookings((prev) => [newBooking, ...prev]);

    return {
      success: true,
      message: 'Booking request created successfully! Awaiting owner confirmation.',
      booking: newBooking,
    };
  };

  const acceptBooking = (bookingId: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: 'ACCEPTED' } : b))
    );
  };

  const rejectBooking = (bookingId: number, reason?: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, bookingStatus: 'REJECTED', rejectionReason: reason || 'Declined by owner' }
          : b
      )
    );
  };

  const cancelBooking = (bookingId: number) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return { success: false, message: 'Booking not found.' };
    if (!['PENDING', 'ACCEPTED'].includes(target.bookingStatus)) {
      return { success: false, message: 'Only PENDING or ACCEPTED bookings can be cancelled.' };
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: 'CANCELLED' } : b))
    );
    return { success: true, message: 'Booking cancelled successfully.' };
  };

  // Demo Payment Process
  const processPayment = (bookingId: number, paymentMethod: PaymentMethod) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return { success: false, message: 'Booking not found.' };
    }
    if (booking.bookingStatus !== 'ACCEPTED') {
      return { success: false, message: 'Payment can only be made for ACCEPTED bookings.' };
    }

    const txnPrefix =
      paymentMethod === 'UPI' ? 'TXN-UPI' : paymentMethod === 'CARD' ? 'TXN-CRD' : 'TXN-WLT';
    const txnId = `${txnPrefix}-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newPayment: Payment = {
      id: Date.now(),
      bookingId: booking.id,
      farmerId: booking.farmerId,
      farmerName: booking.farmerName,
      equipmentName: booking.equipmentName,
      amount: booking.totalAmount,
      paymentMethod,
      transactionId: txnId,
      paymentStatus: 'SUCCESS',
      paymentDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Booking transitions to PAID, then automatically ACTIVE for rental period
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              bookingStatus: 'ACTIVE',
              paymentId: newPayment.id,
            }
          : b
      )
    );

    return {
      success: true,
      message: 'Demo payment successful! Equipment rental is now ACTIVE.',
      payment: newPayment,
    };
  };

  // Return Flow
  const requestReturn = (bookingId: number) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found.' };
    if (booking.bookingStatus !== 'ACTIVE') {
      return { success: false, message: 'Only active rentals can be returned.' };
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              bookingStatus: 'RETURNED',
              returnRequestedDate: timestamp,
            }
          : b
      )
    );

    return {
      success: true,
      message: 'Equipment return marked! Waiting for owner inspection & confirmation.',
    };
  };

  const confirmReturn = (bookingId: number) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found.' };
    if (booking.bookingStatus !== 'RETURNED') {
      return { success: false, message: 'Rental must be in RETURNED status for confirmation.' };
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              bookingStatus: 'COMPLETED',
              returnConfirmedDate: timestamp,
            }
          : b
      )
    );

    return {
      success: true,
      message: 'Return confirmed! Rental marked as COMPLETED. Farmer can now review.',
    };
  };

  // Review System
  const addReview = (data: {
    bookingId: number;
    equipmentId: number;
    rating: number;
    comment: string;
  }) => {
    if (!currentUser) return { success: false, message: 'Please log in to submit a review.' };
    const booking = bookings.find((b) => b.id === data.bookingId);
    if (!booking || booking.bookingStatus !== 'COMPLETED') {
      return { success: false, message: 'Reviews can only be submitted for completed rentals.' };
    }

    const newReview: Review = {
      id: Date.now(),
      bookingId: data.bookingId,
      farmerId: currentUser.id,
      farmerName: currentUser.fullName,
      equipmentId: data.equipmentId,
      equipmentName: booking.equipmentName,
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Update equipment average rating & count
    const equipReviews = updatedReviews.filter((r) => r.equipmentId === data.equipmentId);
    const avgRating =
      equipReviews.reduce((sum, r) => sum + r.rating, 0) / equipReviews.length;

    setEquipment((prev) =>
      prev.map((eq) =>
        eq.id === data.equipmentId
          ? {
              ...eq,
              rating: Number(avgRating.toFixed(1)),
              reviewCount: equipReviews.length,
            }
          : eq
      )
    );

    return { success: true, message: 'Thank you! Your review has been published.' };
  };

  const deleteReview = (reviewId: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const hasFarmerReviewedBooking = (bookingId: number) => {
    return reviews.some((r) => r.bookingId === bookingId);
  };

  // Complaint methods
  const submitComplaint = (data: { subject: string; message: string }) => {
    const user = currentUser || {
      id: 9999,
      fullName: 'Public Guest',
      role: 'FARMER' as UserRole,
      email: 'guest@farmshare.com',
    };

    const newComplaint: Complaint = {
      id: Date.now(),
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      userEmail: user.email,
      subject: data.subject,
      message: data.message,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    return {
      success: true,
      message: 'Your inquiry/complaint has been submitted. Support ticket ID: #' + (newComplaint.ticketNumber || newComplaint.id),
    };
  };

  const updateComplaintStatus = (
    complaintId: number,
    status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED',
    notes?: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status,
              ...(notes !== undefined ? { adminNotes: notes } : {}),
            }
          : c
      )
    );
  };

  const resolveComplaint = (complaintId: number, notes?: string) => {
    updateComplaintStatus(complaintId, 'RESOLVED', notes || 'Resolved by FarmShare Support');
  };

  // Admin Owner Verification & User Management
  const approveOwner = (ownerId: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === ownerId ? { ...u, verificationStatus: 'APPROVED' } : u))
    );
  };

  const rejectOwner = (ownerId: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === ownerId ? { ...u, verificationStatus: 'REJECTED' } : u))
    );
  };

  const toggleUserStatus = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
          return { ...u, status: nextStatus, isActive: nextStatus === 'ACTIVE' };
        }
        return u;
      })
    );
  };

  const activateUser = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'ACTIVE', isActive: true } : u))
    );
  };

  const deactivateUser = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'BLOCKED', isActive: false } : u))
    );
  };

  const toggleBlockUser = toggleUserStatus;

  const deleteUser = (userId: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  const updateSupportCenter = (updates: Partial<SupportCenterConfig>) => {
    setSupportCenter((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString().split('T')[0],
    }));
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS.map((u) => ({ ...u, status: u.status || 'ACTIVE', isActive: u.status === 'ACTIVE' })));
    setEquipment(INITIAL_EQUIPMENT);
    setBookings(INITIAL_BOOKINGS);
    setPayments(INITIAL_PAYMENTS);
    setReviews(INITIAL_REVIEWS);
    setComplaints(INITIAL_COMPLAINTS);
    setSupportCenter(INITIAL_SUPPORT_CENTER);
    setCurrentUser(INITIAL_USERS[1]); // Default to farmer Ramesh for immediate convenience
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        equipment,
        bookings,
        payments,
        reviews,
        complaints,
        supportCenter,
        login,
        logout,
        switchUser,
        registerFarmer,
        registerOwner,
        updateUserProfile,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        approveEquipment,
        rejectEquipment,
        setEquipmentAvailability,
        checkEquipmentAvailability,
        calculatePrice,
        createBooking,
        acceptBooking,
        rejectBooking,
        cancelBooking,
        processPayment,
        requestReturn,
        confirmReturn,
        addReview,
        deleteReview,
        hasFarmerReviewedBooking,
        submitComplaint,
        resolveComplaint,
        updateComplaintStatus,
        approveOwner,
        rejectOwner,
        toggleBlockUser,
        toggleUserStatus,
        activateUser,
        deactivateUser,
        deleteUser,
        updateSupportCenter,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
