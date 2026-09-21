import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Tractor,
  Calendar,
  Clock,
  CreditCard,
  RotateCcw,
  Star,
  CheckCircle2,
  AlertCircle,
  XCircle,
  DollarSign,
  User,
  Search,
  ChevronRight,
  ShieldCheck,
  Receipt,
  QrCode,
  Wallet,
} from 'lucide-react';
import { Booking, PaymentMethod, RentalType } from '../types';

interface FarmerPortalProps {
  initialSubTab?: 'dashboard' | 'bookings' | 'active' | 'payments' | 'reviews' | 'profile';
  onNavigate: (view: string, extraData?: any) => void;
}

export const FarmerPortal: React.FC<FarmerPortalProps> = ({
  initialSubTab = 'dashboard',
  onNavigate,
}) => {
  const {
    currentUser,
    bookings,
    payments,
    reviews,
    cancelBooking,
    processPayment,
    requestReturn,
    addReview,
    hasFarmerReviewedBooking,
    updateUserProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'bookings' | 'active' | 'payments' | 'reviews' | 'profile'
  >(initialSubTab);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Filter bookings for current farmer
  const farmerBookings = useMemo(() => {
    if (!currentUser) return [];
    return bookings.filter((b) => b.farmerId === currentUser.id);
  }, [bookings, currentUser]);

  const activeRentals = useMemo(() => {
    return farmerBookings.filter((b) => b.bookingStatus === 'ACTIVE');
  }, [farmerBookings]);

  const pendingApproval = useMemo(() => {
    return farmerBookings.filter((b) => b.bookingStatus === 'PENDING');
  }, [farmerBookings]);

  const readyToPay = useMemo(() => {
    return farmerBookings.filter((b) => b.bookingStatus === 'ACCEPTED');
  }, [farmerBookings]);

  const farmerPayments = useMemo(() => {
    if (!currentUser) return [];
    return payments.filter((p) => p.farmerId === currentUser.id);
  }, [payments, currentUser]);

  const farmerReviews = useMemo(() => {
    if (!currentUser) return [];
    return reviews.filter((r) => r.farmerId === currentUser.id);
  }, [reviews, currentUser]);

  // Payment Modal State
  const [paymentTargetBooking, setPaymentTargetBooking] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<any | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Review Modal State
  const [reviewTargetBooking, setReviewTargetBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.fullName || '',
    mobile: currentUser?.mobile || '',
    village: currentUser?.village || '',
    district: currentUser?.district || '',
    state: currentUser?.state || '',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      setProfileForm({
        fullName: currentUser.fullName || '',
        mobile: currentUser.mobile || '',
        village: currentUser.village || '',
        district: currentUser.district || '',
        state: currentUser.state || '',
      });
    }
  }, [currentUser?.id, currentUser?.fullName, currentUser?.mobile, currentUser?.village, currentUser?.district, currentUser?.state]);

  const handlePayNow = (booking: Booking) => {
    setPaymentTargetBooking(booking);
    setPaymentSuccessReceipt(null);
  };

  const handleConfirmPayment = () => {
    if (!paymentTargetBooking) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      const res = processPayment(paymentTargetBooking.id, paymentMethod);
      setIsProcessingPayment(false);
      if (res.success && res.payment) {
        setPaymentSuccessReceipt(res.payment);
      }
    }, 600);
  };

  const handleReturnEquipment = (bookingId: number) => {
    if (confirm('Are you sure you want to mark this equipment for return? The owner will verify and confirm.')) {
      requestReturn(bookingId);
    }
  };

  const handleCancel = (bookingId: number) => {
    if (confirm('Do you want to cancel this booking request?')) {
      cancelBooking(bookingId);
    }
  };

  const handleOpenReview = (booking: Booking) => {
    setReviewTargetBooking(booking);
    setReviewRating(5);
    setReviewComment('');
    setReviewFeedback(null);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTargetBooking) return;
    const res = addReview({
      bookingId: reviewTargetBooking.id,
      equipmentId: reviewTargetBooking.equipmentId,
      rating: reviewRating,
      comment: reviewComment,
    });
    if (res.success) {
      setReviewFeedback(res.message);
      setTimeout(() => {
        setReviewTargetBooking(null);
      }, 1200);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateUserProfile(currentUser.id, profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-stone-200 text-center">
        <h2 className="text-xl font-bold text-stone-900">Sign in Required</h2>
        <p className="text-xs text-stone-600 mt-2">Please log in as a Farmer to access this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold mb-2">
            <span>🌾 Farmer Portal</span>
            <span>•</span>
            <span>{currentUser.village || 'Kheda'}, {currentUser.district || 'Anand'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {currentUser.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 mt-1">
            Manage your equipment bookings, active field rentals, demo payments, and machinery reviews.
          </p>
        </div>

        <button
          onClick={() => onNavigate('equipment')}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Find Machinery</span>
        </button>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 pb-2 mb-8 no-scrollbar">
        {[
          { key: 'dashboard', label: 'Farmer Dashboard' },
          { key: 'bookings', label: `My Bookings (${farmerBookings.length})` },
          { key: 'active', label: `Active Rentals (${activeRentals.length})` },
          { key: 'payments', label: `Payment History (${farmerPayments.length})` },
          { key: 'reviews', label: `My Reviews (${farmerReviews.length})` },
          { key: 'profile', label: 'Farmer Profile' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === tab.key
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Farmer Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Active In-Field Rentals
              </span>
              <p className="text-3xl font-black text-emerald-700 mt-1">{activeRentals.length}</p>
              <p className="text-[11px] text-stone-600 mt-1">Currently operating</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Total Bookings
              </span>
              <p className="text-3xl font-black text-stone-900 mt-1">{farmerBookings.length}</p>
              <p className="text-[11px] text-stone-600 mt-1">Across all seasons</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                Awaiting Payment
              </span>
              <p className="text-3xl font-black text-amber-600 mt-1">{readyToPay.length}</p>
              <p className="text-[11px] text-stone-600 mt-1">Owner confirmed requests</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Total Rental Spend
              </span>
              <p className="text-3xl font-black text-stone-900 mt-1">
                ₹
                {farmerPayments
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}
              </p>
              <p className="text-[11px] text-stone-600 mt-1">Processed via demo payment</p>
            </div>
          </div>

          {/* Spotlight: Active Rental Return Trigger */}
          {activeRentals.length > 0 && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 mb-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    Currently In Use
                  </span>
                  <h3 className="text-lg font-bold text-stone-900">
                    {activeRentals[0].equipmentName}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Rental Duration: {activeRentals[0].duration}{' '}
                    {activeRentals[0].rentalType === 'HOURLY' ? 'Hours' : 'Days'} • From{' '}
                    {activeRentals[0].startDate} ({activeRentals[0].startTime}) to{' '}
                    {activeRentals[0].endDate} ({activeRentals[0].endTime})
                  </p>
                </div>

                <button
                  onClick={() => handleReturnEquipment(activeRentals[0].id)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Return Equipment</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Needed: Ready to Pay Bookings */}
          {readyToPay.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-700" />
                <span>Action Needed: Owner Accepted Bookings (Pending Payment)</span>
              </h3>
              <div className="space-y-3">
                {readyToPay.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white p-4 rounded-xl border border-amber-200 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{b.equipmentName}</h4>
                      <p className="text-xs text-stone-600">
                        Total Amount: <strong className="text-emerald-800">₹{b.totalAmount}</strong> •{' '}
                        {b.startDate} to {b.endDate}
                      </p>
                    </div>
                    <button
                      onClick={() => handlePayNow(b)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      Make Demo Payment (₹{b.totalAmount})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Recent Bookings */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 text-base mb-4">Recent Equipment Bookings</h3>
            {farmerBookings.length === 0 ? (
              <p className="text-xs text-stone-600 italic">
                You have not placed any machinery bookings yet. Browse the catalog to rent equipment!
              </p>
            ) : (
              <div className="divide-y divide-stone-100">
                {farmerBookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-stone-900">{b.equipmentName}</p>
                      <span className="text-stone-600 text-[11px]">
                        {b.startDate} • {b.rentalType} ({b.duration}{' '}
                        {b.rentalType === 'HOURLY' ? 'hrs' : 'days'})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-stone-900">₹{b.totalAmount}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.bookingStatus === 'COMPLETED'
                            ? 'bg-stone-100 text-stone-700'
                            : b.bookingStatus === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.bookingStatus === 'ACCEPTED'
                            ? 'bg-amber-100 text-amber-800'
                            : b.bookingStatus === 'RETURNED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: My Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900">All Equipment Bookings</h3>
            <button
              onClick={() => onNavigate('equipment')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              + Rent Another Machine
            </button>
          </div>

          {farmerBookings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
              <Tractor className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="font-bold text-stone-800 text-sm">No Bookings Yet</p>
              <p className="text-xs text-stone-600 mt-1">
                Explore our catalog to find tractors, harvesters, and rotavators ready for booking.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {farmerBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={b.equipmentImage}
                      alt={b.equipmentName}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-100 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-stone-900 text-sm">{b.equipmentName}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.bookingStatus === 'COMPLETED'
                              ? 'bg-stone-100 text-stone-700'
                              : b.bookingStatus === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.bookingStatus === 'ACCEPTED'
                              ? 'bg-amber-100 text-amber-800'
                              : b.bookingStatus === 'RETURNED'
                              ? 'bg-blue-100 text-blue-800'
                              : b.bookingStatus === 'REJECTED' || b.bookingStatus === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        Owner: <strong>{b.ownerName}</strong> ({b.ownerPhone})
                      </p>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Dates: {b.startDate} ({b.startTime}) to {b.endDate} ({b.endTime}) • {b.duration}{' '}
                        {b.rentalType === 'HOURLY' ? 'Hours' : 'Days'}
                      </p>
                      <p className="text-xs font-bold text-emerald-700 mt-1">
                        Total Amount: ₹{b.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions depending on booking status */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                    {b.bookingStatus === 'ACCEPTED' && (
                      <button
                        onClick={() => handlePayNow(b)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs cursor-pointer"
                      >
                        Pay Now (₹{b.totalAmount})
                      </button>
                    )}

                    {b.bookingStatus === 'ACTIVE' && (
                      <button
                        onClick={() => handleReturnEquipment(b.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Return Equipment</span>
                      </button>
                    )}

                    {b.bookingStatus === 'RETURNED' && (
                      <span className="text-xs text-blue-700 font-medium bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                        Awaiting Owner Return Confirmation
                      </span>
                    )}

                    {b.bookingStatus === 'COMPLETED' && (
                      <div>
                        {hasFarmerReviewedBooking(b.id) ? (
                          <span className="text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl">
                            ✓ Review Submitted
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenReview(b)}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 fill-stone-950" />
                            <span>Rate & Review</span>
                          </button>
                        )}
                      </div>
                    )}

                    {['PENDING', 'ACCEPTED'].includes(b.bookingStatus) && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Active Rentals */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-stone-900">Active In-Field Rentals</h3>
          {activeRentals.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
              <Tractor className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="font-bold text-stone-800 text-sm">No Active Rentals In Progress</p>
              <p className="text-xs text-stone-600 mt-1">
                Accepted bookings switch to Active after demo payment is completed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeRentals.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border-2 border-emerald-300 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-1">
                      ACTIVE DEPLOYMENT
                    </span>
                    <h4 className="text-base font-bold text-stone-900">{b.equipmentName}</h4>
                    <p className="text-xs text-stone-600 mt-1">
                      Custody Period: {b.startDate} to {b.endDate} ({b.duration}{' '}
                      {b.rentalType === 'HOURLY' ? 'Hours' : 'Days'})
                    </p>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Equipment Owner: <strong>{b.ownerName}</strong> ({b.ownerPhone})
                    </p>
                  </div>

                  <button
                    onClick={() => handleReturnEquipment(b.id)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Return Equipment to Owner</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Payment History */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-stone-900">Rental Payment History</h3>
          {farmerPayments.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
              <Receipt className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="font-bold text-stone-800 text-sm">No Payment Transactions</p>
              <p className="text-xs text-stone-600 mt-1">Payments made for accepted bookings appear here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Equipment</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {farmerPayments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">{p.transactionId}</td>
                      <td className="py-3 px-4 font-medium">{p.equipmentName}</td>
                      <td className="py-3 px-4">
                        <span className="bg-stone-100 px-2 py-0.5 rounded font-semibold text-[11px]">
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-emerald-700">
                        ₹{p.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-stone-600">{p.paymentDate}</td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          SUCCESS
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-stone-900">Your Equipment Reviews</h3>
          {farmerReviews.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
              <Star className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="font-bold text-stone-800 text-sm">No Reviews Submitted Yet</p>
              <p className="text-xs text-stone-600 mt-1">
                Completed equipment rentals unlock reviews to help fellow farmers.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {farmerReviews.map((r) => (
                <div key={r.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-stone-900 text-sm">{r.equipmentName}</h4>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-stone-800 ml-1">{r.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed italic">"{r.comment}"</p>
                  <span className="text-[10px] text-stone-600 mt-2 block">Submitted on {r.createdAt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
          <h3 className="text-lg font-bold text-stone-900 mb-1">Farmer Profile Settings</h3>
          <p className="text-xs text-stone-600 mb-6">Keep your village and mobile contacts updated for machinery delivery.</p>

          {profileSaved && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={profileForm.mobile}
                  onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Village</label>
                <input
                  type="text"
                  value={profileForm.village}
                  onChange={(e) => setProfileForm({ ...profileForm, village: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">District</label>
                <input
                  type="text"
                  value={profileForm.district}
                  onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">State</label>
                <input
                  type="text"
                  value={profileForm.state}
                  onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Demo Payment Modal */}
      {paymentTargetBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <h3 className="font-bold text-sm">FarmShare Demo Payment Gateway</h3>
              </div>
              <button
                onClick={() => setPaymentTargetBooking(null)}
                className="text-emerald-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {paymentSuccessReceipt ? (
                <div className="text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-extrabold text-stone-900">Payment Successful</h4>
                  <p className="text-xs text-stone-600">Equipment rental has transitioned to ACTIVE status!</p>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left text-xs space-y-2 mt-4">
                    <div className="flex justify-between">
                      <span className="text-stone-600">Booking ID:</span>
                      <span className="font-mono font-bold text-stone-900">#{paymentSuccessReceipt.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Transaction ID:</span>
                      <span className="font-mono font-bold text-stone-900">{paymentSuccessReceipt.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Amount Paid:</span>
                      <span className="font-bold text-emerald-700">₹{paymentSuccessReceipt.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Payment Status:</span>
                      <span className="font-bold text-emerald-800">SUCCESS</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setPaymentTargetBooking(null);
                      setActiveTab('active');
                    }}
                    className="w-full mt-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                  >
                    Go to Active Rentals
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                    <p className="text-stone-600">Equipment: <strong>{paymentTargetBooking.equipmentName}</strong></p>
                    <p className="text-stone-600">Period: {paymentTargetBooking.startDate} to {paymentTargetBooking.endDate}</p>
                    <p className="text-emerald-800 font-bold mt-1 text-sm">
                      Total Payable: ₹{paymentTargetBooking.totalAmount.toLocaleString()}
                    </p>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Select Demo Payment Method
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', icon: QrCode },
                        { id: 'CARD', label: 'Credit / Debit Card (Kisan RuPay / Visa)', icon: CreditCard },
                        { id: 'DEMO WALLET', label: 'FarmShare Kisan Wallet', icon: Wallet },
                      ].map((m) => {
                        const Icon = m.icon;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setPaymentMethod(m.id as any)}
                            className={`w-full p-3 rounded-xl border text-xs flex items-center justify-between transition cursor-pointer ${
                              paymentMethod === m.id
                                ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-900'
                                : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4 text-emerald-700" />
                              <span>{m.label}</span>
                            </div>
                            {paymentMethod === m.id && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    disabled={isProcessingPayment}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessingPayment ? (
                      <span>Processing Demo Transaction...</span>
                    ) : (
                      <span>Authorize Payment of ₹{paymentTargetBooking.totalAmount}</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {reviewTargetBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-amber-500 text-stone-950 p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-stone-950" />
                <h3 className="font-bold text-sm">Review & Rate Machinery</h3>
              </div>
              <button
                onClick={() => setReviewTargetBooking(null)}
                className="text-stone-900 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
              <div>
                <h4 className="font-bold text-stone-900 text-sm">{reviewTargetBooking.equipmentName}</h4>
                <p className="text-xs text-stone-600">Owner: {reviewTargetBooking.ownerName}</p>
              </div>

              {/* Star Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-2xl cursor-pointer hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-700 ml-2">{reviewRating} out of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Feedback / Field Experience
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How was the tractor's fuel efficiency, implement condition, and owner support?"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {reviewFeedback && (
                <p className="text-xs text-emerald-700 font-semibold">{reviewFeedback}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
