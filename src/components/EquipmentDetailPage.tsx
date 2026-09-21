import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Tractor,
  AlertTriangle,
  CheckCircle2,
  Phone,
  User,
  Info,
  ChevronRight,
} from 'lucide-react';
import { RentalType } from '../types';

interface EquipmentDetailPageProps {
  equipmentId: number;
  onNavigate: (view: string, extraData?: any) => void;
  onOpenAuth: (mode?: 'login' | 'register-farmer') => void;
}

export const EquipmentDetailPage: React.FC<EquipmentDetailPageProps> = ({
  equipmentId,
  onNavigate,
  onOpenAuth,
}) => {
  const {
    equipment,
    currentUser,
    users,
    switchUser,
    reviews,
    bookings,
    checkEquipmentAvailability,
    calculatePrice,
    createBooking,
  } = useApp();

  const item = equipment.find((e) => e.id === equipmentId);

  // Booking Form State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultStartDate = tomorrow.toISOString().split('T')[0];

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  const defaultEndDate = dayAfter.toISOString().split('T')[0];

  const [rentalType, setRentalType] = useState<RentalType>('DAILY');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [startTime, setStartTime] = useState('08:00');
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [endTime, setEndTime] = useState('18:00');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter reviews for this equipment
  const equipmentReviews = useMemo(() => {
    return reviews.filter((r) => r.equipmentId === equipmentId);
  }, [reviews, equipmentId]);

  // Existing active/pending bookings for this equipment to show scheduled blocks
  const scheduledBookings = useMemo(() => {
    return bookings.filter(
      (b) =>
        b.equipmentId === equipmentId &&
        ['PENDING', 'ACCEPTED', 'PAID', 'ACTIVE'].includes(b.bookingStatus)
    );
  }, [bookings, equipmentId]);

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-stone-900">Equipment Not Found</h2>
        <p className="text-stone-600 text-sm mt-2">The machinery listing requested is unavailable or has been archived.</p>
        <button
          onClick={() => onNavigate('equipment')}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Equipment Fleet
        </button>
      </div>
    );
  }

  // Calculate live dynamic price & availability check
  const availabilityResult = checkEquipmentAvailability(
    item.id,
    startDate,
    startTime,
    endDate,
    endTime
  );

  const priceResult = calculatePrice(
    item,
    rentalType,
    startDate,
    startTime,
    endDate,
    endTime
  );

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!currentUser) {
      onOpenAuth('login');
      return;
    }

    if (currentUser.role !== 'FARMER') {
      const farmerUser = users.find((u) => u.role === 'FARMER');
      if (farmerUser) {
        switchUser(farmerUser.id);
        setFeedback({
          type: 'success',
          message: `Switched account to Farmer (${farmerUser.fullName}). Click confirm to complete your booking!`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: 'Only accounts with the FARMER role can book equipment. Please switch or register as Farmer.',
        });
      }
      return;
    }

    if (currentUser.status === 'BLOCKED') {
      setFeedback({
        type: 'error',
        message: 'Your account is deactivated. Please contact platform admin or switch to another demo farmer profile.',
      });
      return;
    }

    setIsSubmitting(true);
    const res = createBooking({
      equipmentId: item.id,
      rentalType,
      startDate,
      startTime,
      endDate,
      endTime,
    });

    setIsSubmitting(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        onNavigate('farmer-bookings');
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        id="btn-back-to-equipment"
        onClick={() => onNavigate('equipment')}
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-emerald-700 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Equipment Catalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image, Details & Reviews */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Media Card */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="relative h-72 sm:h-96 w-full bg-stone-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-emerald-800/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  {item.category}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full shadow-xs ${
                    item.availabilityStatus === 'AVAILABLE'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {item.availabilityStatus}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
                  {item.brand} • Model {item.model} • Year {item.year}
                </span>
                <div className="flex items-center gap-1 text-sm font-bold text-stone-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{item.rating > 0 ? item.rating : 'New'}</span>
                  <span className="text-xs text-stone-600 font-normal">
                    ({item.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {item.name}
              </h1>

              <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {item.location}, {item.village}, {item.district}, {item.state}
                </span>
              </div>

              <p className="text-sm text-stone-700 mt-4 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>

              {/* Technical Specifications Grid */}
              <div className="mt-6 pt-6 border-t border-stone-100">
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                  Machinery Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <span className="text-stone-600 block text-[11px]">Category</span>
                    <span className="font-bold text-stone-900">{item.category}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <span className="text-stone-600 block text-[11px]">Power Rating</span>
                    <span className="font-bold text-stone-900">{item.horsepower || 'Heavy Duty'}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <span className="text-stone-600 block text-[11px]">Drive / Fuel</span>
                    <span className="font-bold text-stone-900">{item.fuelType || 'Diesel'}</span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <span className="text-stone-600 block text-[11px]">Manufacturing Year</span>
                    <span className="font-bold text-stone-900">{item.year}</span>
                  </div>
                </div>
              </div>

              {/* Owner Information Banner */}
              <div className="mt-6 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                      Equipment Owner
                    </span>
                    <h4 className="text-sm font-bold text-stone-900">{item.ownerName}</h4>
                    <p className="text-xs text-stone-600">{item.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Partner
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews & Ratings Section */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Farmer Reviews & Ratings</h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Real feedback from verified cultivators who used this equipment
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-extrabold text-stone-900 text-sm">{item.rating}</span>
                <span className="text-xs text-stone-600">/ 5.0</span>
              </div>
            </div>

            {equipmentReviews.length === 0 ? (
              <p className="text-xs text-stone-600 italic">
                No reviews yet for this equipment. Be the first farmer to review after completing your rental!
              </p>
            ) : (
              <div className="space-y-4">
                {equipmentReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center">
                          {rev.farmerName.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-stone-900">{rev.farmerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        ))}
                        <span className="text-[10px] text-stone-600 ml-1">{rev.createdAt}</span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Booking Calculator Card */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-lg">
            <div className="pb-4 mb-4 border-b border-stone-100">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                Rental Pricing
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <div>
                  <span className="text-2xl font-black text-stone-900">₹{item.hourlyPrice}</span>
                  <span className="text-xs text-stone-600 font-medium"> / hour</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-700">₹{item.dailyPrice}</span>
                  <span className="text-xs text-stone-600 font-medium"> / day</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Rental Type Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  1. Select Rental Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRentalType('HOURLY')}
                    className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                      rentalType === 'HOURLY'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Hourly Rental
                  </button>
                  <button
                    type="button"
                    onClick={() => setRentalType('DAILY')}
                    className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                      rentalType === 'DAILY'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Daily Rental
                  </button>
                </div>
              </div>

              {/* Start Date & Time */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Start Date
                  </label>
                  <input
                    id="input-booking-start-date"
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Start Time
                  </label>
                  <input
                    id="input-booking-start-time"
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* End Date & Time */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    End Date
                  </label>
                  <input
                    id="input-booking-end-date"
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    End Time
                  </label>
                  <input
                    id="input-booking-end-time"
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Double-Booking & Conflict Real-time Notification */}
              {!availabilityResult.available ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Equipment is not available for the selected time.</strong>
                    <span>{availabilityResult.message}</span>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>No scheduling conflicts detected. Equipment is available!</span>
                </div>
              )}

              {/* Server-Side Calculated Total Breakdown */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span>Rental Mode:</span>
                  <span className="font-semibold text-stone-900">{rentalType}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span>Calculated Duration:</span>
                  <span className="font-semibold text-stone-900">
                    {priceResult.duration} {rentalType === 'HOURLY' ? 'Hour(s)' : 'Day(s)'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span>Base Rate:</span>
                  <span className="font-semibold text-stone-900">
                    ₹{rentalType === 'HOURLY' ? item.hourlyPrice : item.dailyPrice} / {rentalType === 'HOURLY' ? 'hr' : 'day'}
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 uppercase">Estimated Total Amount</span>
                  <span className="text-xl font-extrabold text-emerald-700">
                    ₹{priceResult.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Feedback messages */}
              {feedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-red-50 text-red-900 border border-red-200'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                id="btn-confirm-booking"
                type="submit"
                disabled={!availabilityResult.available || isSubmitting}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                  availabilityResult.available && !isSubmitting
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                <span>
                  {currentUser
                    ? currentUser.role === 'FARMER'
                      ? 'Confirm & Create Booking Request'
                      : 'Switch to Farmer to Book'
                    : 'Login to Book Equipment'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            {/* Scheduled slots hint */}
            {scheduledBookings.length > 0 && (
              <div className="mt-5 pt-4 border-t border-stone-100">
                <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Currently Reserved Dates:
                </p>
                <div className="space-y-1">
                  {scheduledBookings.map((b) => (
                    <div
                      key={b.id}
                      className="text-[11px] bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md flex justify-between"
                    >
                      <span>
                        {b.startDate} ({b.startTime}) to {b.endDate} ({b.endTime})
                      </span>
                      <span className="font-semibold text-emerald-800 uppercase">{b.bookingStatus}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
