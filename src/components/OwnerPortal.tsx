import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Tractor,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  User,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Layers,
  Image as ImageIcon,
  MapPin,
  Building2,
} from 'lucide-react';
import { Equipment, EquipmentCategory, EquipmentAvailability } from '../types';

interface OwnerPortalProps {
  initialSubTab?: 'dashboard' | 'equipment' | 'add-equipment' | 'requests' | 'active' | 'history' | 'earnings' | 'profile';
  onNavigate: (view: string, extraData?: any) => void;
}

const CATEGORIES: EquipmentCategory[] = [
  'Tractors',
  'Harvesters',
  'Rotavators',
  'Cultivators',
  'Seeders',
  'Sprayers',
  'Threshers',
  'Ploughs',
  'Other Machinery',
];

export const OwnerPortal: React.FC<OwnerPortalProps> = ({
  initialSubTab = 'dashboard',
  onNavigate,
}) => {
  const {
    currentUser,
    equipment,
    bookings,
    payments,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    setEquipmentAvailability,
    acceptBooking,
    rejectBooking,
    confirmReturn,
    updateUserProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'equipment' | 'requests' | 'active' | 'history' | 'earnings' | 'profile'
  >(initialSubTab === 'add-equipment' ? 'equipment' : initialSubTab);

  // Filter for this owner
  const myEquipment = useMemo(() => {
    if (!currentUser) return [];
    return equipment.filter((e) => e.ownerId === currentUser.id);
  }, [equipment, currentUser]);

  const myBookings = useMemo(() => {
    if (!currentUser) return [];
    return bookings.filter((b) => b.ownerId === currentUser.id);
  }, [bookings, currentUser]);

  const pendingRequests = useMemo(() => {
    return myBookings.filter((b) => b.bookingStatus === 'PENDING');
  }, [myBookings]);

  const activeRentals = useMemo(() => {
    return myBookings.filter((b) => b.bookingStatus === 'ACTIVE');
  }, [myBookings]);

  const returnedAwaitingConfirmation = useMemo(() => {
    return myBookings.filter((b) => b.bookingStatus === 'RETURNED');
  }, [myBookings]);

  const completedRentals = useMemo(() => {
    return myBookings.filter((b) => b.bookingStatus === 'COMPLETED');
  }, [myBookings]);

  // Total Earnings calculation (all payments made for this owner's bookings)
  const myEarnings = useMemo(() => {
    const ownerBookingIds = myBookings.map((b) => b.id);
    return payments
      .filter((p) => ownerBookingIds.includes(p.bookingId) && p.paymentStatus === 'SUCCESS')
      .reduce((sum, p) => sum + p.amount, 0);
  }, [myBookings, payments]);

  // Add / Edit Equipment Modal State
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [editingEquipmentId, setEditingEquipmentId] = useState<number | null>(null);
  const [locationModalEquipment, setLocationModalEquipment] = useState<Equipment | null>(null);
  const [quickLocationForm, setQuickLocationForm] = useState({
    location: '',
    village: '',
    district: '',
    state: '',
  });
  const [equipmentForm, setEquipmentForm] = useState({
    name: '',
    category: 'Tractors' as EquipmentCategory,
    brand: '',
    model: '',
    year: 2023,
    description: '',
    hourlyPrice: 400,
    dailyPrice: 2800,
    location: currentUser?.address || 'GT Road, Mandi',
    village: currentUser?.village || 'Doraha',
    district: currentUser?.district || 'Ludhiana',
    state: currentUser?.state || 'Punjab',
    image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80',
    horsepower: '50 HP',
    fuelType: 'Diesel',
    availabilityStatus: 'AVAILABLE' as EquipmentAvailability,
  });

  // Profile update state
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.fullName || '',
    businessName: currentUser?.businessName || '',
    mobile: currentUser?.mobile || '',
    address: currentUser?.address || '',
    village: currentUser?.village || '',
    district: currentUser?.district || '',
    state: currentUser?.state || '',
  });
  const [profileUpdated, setProfileUpdated] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      setProfileForm({
        fullName: currentUser.fullName || '',
        businessName: currentUser.businessName || '',
        mobile: currentUser.mobile || '',
        address: currentUser.address || '',
        village: currentUser.village || '',
        district: currentUser.district || '',
        state: currentUser.state || '',
      });
    }
  }, [
    currentUser?.id,
    currentUser?.fullName,
    currentUser?.businessName,
    currentUser?.mobile,
    currentUser?.address,
    currentUser?.village,
    currentUser?.district,
    currentUser?.state,
  ]);

  const openAddModal = () => {
    setEditingEquipmentId(null);
    setEquipmentForm({
      name: '',
      category: 'Tractors',
      brand: '',
      model: '',
      year: 2023,
      description: '',
      hourlyPrice: 400,
      dailyPrice: 2800,
      location: `${currentUser?.village || 'Doraha'}, ${currentUser?.district || 'Ludhiana'}`,
      village: currentUser?.village || 'Doraha',
      district: currentUser?.district || 'Ludhiana',
      state: currentUser?.state || 'Punjab',
      image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80',
      horsepower: '50 HP',
      fuelType: 'Diesel',
      availabilityStatus: 'AVAILABLE',
    });
    setEquipmentModalOpen(true);
  };

  const openEditModal = (eq: Equipment) => {
    setEditingEquipmentId(eq.id);
    setEquipmentForm({
      name: eq.name,
      category: eq.category,
      brand: eq.brand,
      model: eq.model,
      year: eq.year,
      description: eq.description,
      hourlyPrice: eq.hourlyPrice,
      dailyPrice: eq.dailyPrice,
      location: eq.location,
      village: eq.village,
      district: eq.district,
      state: eq.state,
      image: eq.image,
      horsepower: eq.horsepower || '50 HP',
      fuelType: eq.fuelType || 'Diesel',
      availabilityStatus: eq.availabilityStatus,
    });
    setEquipmentModalOpen(true);
  };

  const handleSaveEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (editingEquipmentId) {
      updateEquipment(editingEquipmentId, equipmentForm);
    } else {
      addEquipment({
        ownerId: currentUser.id,
        ownerName: currentUser.businessName || currentUser.fullName,
        ownerPhone: currentUser.mobile,
        ...equipmentForm,
      });
    }
    setEquipmentModalOpen(false);
  };

  const handleDeleteEquipment = (id: number) => {
    if (confirm('Are you sure you want to remove this equipment from FarmShare?')) {
      deleteEquipment(id);
    }
  };

  const openLocationModal = (eq: Equipment) => {
    setLocationModalEquipment(eq);
    setQuickLocationForm({
      location: eq.location || '',
      village: eq.village || currentUser?.village || '',
      district: eq.district || currentUser?.district || '',
      state: eq.state || currentUser?.state || '',
    });
  };

  const handleSaveQuickLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationModalEquipment) return;
    const computedLocation = quickLocationForm.location.trim() || `${quickLocationForm.village}, ${quickLocationForm.district}`;
    updateEquipment(locationModalEquipment.id, {
      location: computedLocation,
      village: quickLocationForm.village.trim(),
      district: quickLocationForm.district.trim(),
      state: quickLocationForm.state.trim(),
    });
    setLocationModalEquipment(null);
  };

  const fillLocationFromProfile = () => {
    if (!currentUser) return;
    const yardLoc = currentUser.address
      ? `${currentUser.address}, ${currentUser.village || ''}`.trim().replace(/^,\s*|,\s*$/g, '')
      : `${currentUser.village || ''}, ${currentUser.district || ''}`.trim().replace(/^,\s*|,\s*$/g, '');
    
    setEquipmentForm((prev) => ({
      ...prev,
      village: currentUser.village || prev.village,
      district: currentUser.district || prev.district,
      state: currentUser.state || prev.state,
      location: yardLoc || prev.location,
    }));
  };

  const handleConfirmReturnAction = (bookingId: number) => {
    const res = confirmReturn(bookingId);
    alert(res.message);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateUserProfile(currentUser.id, profileForm);
    setProfileUpdated(true);
    setTimeout(() => setProfileUpdated(false), 2000);
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-stone-200 text-center">
        <h2 className="text-xl font-bold text-stone-900">Sign in Required</h2>
        <p className="text-xs text-stone-600 mt-2">Please log in as an Equipment Owner to view this portal.</p>
      </div>
    );
  }

  const isPendingVerification = currentUser.verificationStatus === 'PENDING';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
            <span>🚜 Equipment Owner Hub</span>
            <span>•</span>
            <span>{currentUser.businessName || currentUser.fullName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Owner Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Manage your machinery inventory, review farmer booking requests, confirm returns, and track earnings.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Equipment</span>
        </button>
      </div>

      {/* Notice if Verification is Pending */}
      {isPendingVerification && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Account Verification: Pending Admin Review</h4>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              Your equipment owner profile is currently pending verification. You can list machinery, but listings require admin review before becoming publicly visible to farmers. <em>(You can test admin approval immediately using the quick switcher at the top ribbon!)</em>
            </p>
          </div>
        </div>
      )}

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 pb-2 mb-8 no-scrollbar">
        {[
          { key: 'dashboard', label: 'Overview' },
          { key: 'equipment', label: `My Equipment (${myEquipment.length})` },
          { key: 'requests', label: `Booking Requests (${pendingRequests.length})` },
          { key: 'active', label: `Active Rentals (${activeRentals.length + returnedAwaitingConfirmation.length})` },
          { key: 'history', label: `Rental History (${completedRentals.length})` },
          { key: 'earnings', label: `Earnings (₹${myEarnings.toLocaleString()})` },
          { key: 'profile', label: 'Owner Profile' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === tab.key
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Total Equipment Fleet
              </span>
              <p className="text-3xl font-black text-stone-900 mt-1">{myEquipment.length}</p>
              <p className="text-[11px] text-stone-600 mt-1">Listed under your account</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                Pending Requests
              </span>
              <p className="text-3xl font-black text-amber-600 mt-1">{pendingRequests.length}</p>
              <p className="text-[11px] text-stone-600 mt-1">Awaiting your approval</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                In-Field Active Rentals
              </span>
              <p className="text-3xl font-black text-emerald-700 mt-1">{activeRentals.length}</p>
              <p className="text-[11px] text-stone-600 mt-1">Currently operating</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Total Earnings
              </span>
              <p className="text-3xl font-black text-stone-900 mt-1">
                ₹{myEarnings.toLocaleString()}
              </p>
              <p className="text-[11px] text-stone-600 mt-1">From completed rentals</p>
            </div>
          </div>

          {/* Pending Return Inspections Notice */}
          {returnedAwaitingConfirmation.length > 0 && (
            <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-300 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2.5 py-0.5 rounded-full inline-block mb-1">
                    RETURN ACTION NEEDED
                  </span>
                  <h3 className="text-base font-bold text-stone-900">
                    Farmer has marked equipment as RETURNED
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {returnedAwaitingConfirmation[0].equipmentName} was returned by{' '}
                    <strong>{returnedAwaitingConfirmation[0].farmerName}</strong>. Inspect machinery and confirm return to finalize booking.
                  </p>
                </div>
                <button
                  onClick={() => handleConfirmReturnAction(returnedAwaitingConfirmation[0].id)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer shrink-0"
                >
                  Confirm Equipment Return
                </button>
              </div>
            </div>
          )}

          {/* Pending Booking Requests Widget */}
          {pendingRequests.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-stone-900 text-base">New Booking Inquiries</h3>
                <span className="text-xs text-amber-700 font-semibold">{pendingRequests.length} pending</span>
              </div>

              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{req.equipmentName}</h4>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Farmer: <strong>{req.farmerName}</strong> ({req.farmerPhone}) • {req.farmerVillage}
                      </p>
                      <p className="text-xs text-stone-600">
                        Requested Window: {req.startDate} ({req.startTime}) to {req.endDate} ({req.endTime}) •{' '}
                        {req.duration} {req.rentalType === 'HOURLY' ? 'Hours' : 'Days'}
                      </p>
                      <p className="text-xs font-bold text-emerald-800 mt-1">
                        Calculated Payout: ₹{req.totalAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => acceptBooking(req.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Request</span>
                      </button>
                      <button
                        onClick={() => rejectBooking(req.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 font-semibold text-xs rounded-xl cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Equipment List Preview */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-stone-900 text-base">Your Active Equipment Inventory</h3>
              <button
                onClick={() => setActiveTab('equipment')}
                className="text-xs font-semibold text-amber-700 hover:underline"
              >
                Manage All Fleet →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {myEquipment.slice(0, 3).map((eq) => (
                <div key={eq.id} className="p-3 border border-stone-200 rounded-2xl flex items-center gap-3">
                  <img src={eq.image} alt={eq.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-900 text-xs truncate">{eq.name}</h4>
                    <p className="text-[11px] text-stone-600">₹{eq.hourlyPrice}/hr • ₹{eq.dailyPrice}/day</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {eq.availabilityStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: My Equipment Management */}
      {activeTab === 'equipment' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Machinery Fleet</h3>
              <p className="text-xs text-stone-600">Add, edit, change pricing, and toggle availability</p>
            </div>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Equipment</span>
            </button>
          </div>

          {myEquipment.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
              <Tractor className="w-12 h-12 text-stone-300 mx-auto mb-2" />
              <p className="font-bold text-stone-800 text-sm">No Equipment Listed Yet</p>
              <p className="text-xs text-stone-600 mt-1">List your tractor or implement to start earning rental income.</p>
              <button
                onClick={openAddModal}
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold"
              >
                List Your First Machine
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEquipment.map((eq) => (
                <div
                  key={eq.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-stone-100">
                      <img src={eq.image} alt={eq.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-stone-900/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {eq.category}
                      </span>
                      <span
                        className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          eq.approvalStatus === 'APPROVED'
                            ? 'bg-emerald-600 text-white'
                            : eq.approvalStatus === 'PENDING'
                            ? 'bg-amber-500 text-stone-950'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {eq.approvalStatus}
                      </span>
                    </div>

                    <div className="p-4">
                      <h4 className="font-bold text-stone-900 text-sm line-clamp-1">{eq.name}</h4>
                      <p className="text-xs text-stone-600 mt-0.5">
                        {eq.brand} {eq.model} • {eq.year}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-1.5 bg-stone-50 px-2 py-1 rounded-lg border border-stone-200/60">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate font-medium text-[11px]" title={`${eq.location || eq.village}, ${eq.district}, ${eq.state}`}>
                          {eq.location ? eq.location : `${eq.village}, ${eq.district} (${eq.state})`}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 mt-2 line-clamp-2">{eq.description}</p>

                      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-stone-600 block text-[10px]">Hourly</span>
                          <span className="font-bold text-stone-900">₹{eq.hourlyPrice}/hr</span>
                        </div>
                        <div className="text-right">
                          <span className="text-stone-600 block text-[10px]">Daily</span>
                          <span className="font-bold text-emerald-700">₹{eq.dailyPrice}/day</span>
                        </div>
                      </div>

                      {/* Availability Status Dropdown */}
                      <div className="mt-3">
                        <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                          Current Availability
                        </label>
                        <select
                          value={eq.availabilityStatus}
                          onChange={(e: any) => setEquipmentAvailability(eq.id, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-stone-50"
                        >
                          <option value="AVAILABLE">AVAILABLE (Open for bookings)</option>
                          <option value="BOOKED">BOOKED (In use)</option>
                          <option value="MAINTENANCE">MAINTENANCE (Servicing)</option>
                          <option value="INACTIVE">INACTIVE (Hidden)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditModal(eq)}
                      className="flex-1 py-1.5 px-2.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => openLocationModal(eq)}
                      className="py-1.5 px-2.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      title="Update machinery yard & village location"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Location</span>
                    </button>
                    <button
                      onClick={() => handleDeleteEquipment(eq.id)}
                      className="py-1.5 px-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      title="Delete equipment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Booking Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-stone-900">Incoming Booking Requests</h3>
          {pendingRequests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
              <Clock className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="font-bold text-stone-800 text-sm">No Pending Booking Requests</p>
              <p className="text-xs text-stone-600 mt-1">When farmers book your equipment, requests will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full inline-block mb-1">
                      PENDING OWNER APPROVAL
                    </span>
                    <h4 className="text-base font-bold text-stone-900">{req.equipmentName}</h4>
                    <p className="text-xs text-stone-600 mt-1">
                      Farmer: <strong>{req.farmerName}</strong> • Mobile: {req.farmerPhone} • Village: {req.farmerVillage}
                    </p>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Requested Rental: {req.startDate} ({req.startTime}) to {req.endDate} ({req.endTime}) •{' '}
                      {req.duration} {req.rentalType === 'HOURLY' ? 'Hours' : 'Days'}
                    </p>
                    <p className="text-sm font-extrabold text-emerald-800 mt-1">
                      Total Rental Earnings: ₹{req.totalAmount.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => acceptBooking(req.id)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Booking</span>
                    </button>
                    <button
                      onClick={() => rejectBooking(req.id)}
                      className="px-4 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 font-semibold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Active Rentals & Returns */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-stone-900">Active Field Operations & Return Confirmations</h3>

          {/* Pending Confirmations first */}
          {returnedAwaitingConfirmation.length > 0 && (
            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                Returned by Farmer (Awaiting Your Return Inspection)
              </h4>
              {returnedAwaitingConfirmation.map((b) => (
                <div
                  key={b.id}
                  className="bg-blue-50/70 border-2 border-blue-300 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2.5 py-0.5 rounded-full inline-block mb-1">
                      READY TO CONFIRM
                    </span>
                    <h4 className="text-base font-bold text-stone-900">{b.equipmentName}</h4>
                    <p className="text-xs text-stone-600 mt-1">
                      Returned by: <strong>{b.farmerName}</strong> ({b.farmerPhone})
                    </p>
                    <p className="text-xs text-stone-600">
                      Returned at: {b.returnRequestedDate || 'Recently'}
                    </p>
                  </div>

                  <button
                    onClick={() => handleConfirmReturnAction(b.id)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Confirm Equipment Return & Complete Rental
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Currently Active in field */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Currently Deployed in Field
            </h4>
            {activeRentals.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
                <p className="text-xs text-stone-600 italic">No machines currently operating in field.</p>
              </div>
            ) : (
              activeRentals.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-5 rounded-2xl border-2 border-emerald-300 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-1">
                      ACTIVE RENTAL
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm">{b.equipmentName}</h4>
                    <p className="text-xs text-stone-600">
                      Farmer: <strong>{b.farmerName}</strong> • {b.farmerPhone}
                    </p>
                    <p className="text-xs text-stone-600">
                      Window: {b.startDate} to {b.endDate} ({b.duration} {b.rentalType === 'HOURLY' ? 'hrs' : 'days'})
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    Paid ₹{b.totalAmount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Rental History */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-stone-900">Completed Rental History</h3>
          {completedRentals.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
              <Tractor className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="font-bold text-stone-800 text-sm">No Completed Rentals Yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Equipment</th>
                    <th className="py-3 px-4">Farmer</th>
                    <th className="py-3 px-4">Rental Window</th>
                    <th className="py-3 px-4">Revenue Earned</th>
                    <th className="py-3 px-4">Completed On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {completedRentals.map((b) => (
                    <tr key={b.id}>
                      <td className="py-3 px-4 font-mono font-bold">#{b.id}</td>
                      <td className="py-3 px-4 font-medium text-stone-900">{b.equipmentName}</td>
                      <td className="py-3 px-4">{b.farmerName}</td>
                      <td className="py-3 px-4 text-stone-600">
                        {b.startDate} to {b.endDate}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">
                        ₹{b.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-stone-600">{b.returnConfirmedDate || 'Confirmed'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Earnings */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
            <h3 className="text-lg font-bold text-stone-900 mb-1">Financial Earnings Summary</h3>
            <p className="text-xs text-stone-600 mb-6">Track revenue generated from your rented machinery fleet.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block">Total Net Revenue</span>
                <p className="text-3xl font-black text-emerald-900 mt-1">₹{myEarnings.toLocaleString()}</p>
                <p className="text-[11px] text-emerald-700 mt-1">Settled automatically</p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[11px] font-bold text-stone-600 uppercase block">Completed Sessions</span>
                <p className="text-3xl font-black text-stone-900 mt-1">{completedRentals.length}</p>
                <p className="text-[11px] text-stone-600 mt-1">Successful returns confirmed</p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[11px] font-bold text-stone-600 uppercase block">Average Ticket Size</span>
                <p className="text-3xl font-black text-stone-900 mt-1">
                  ₹{completedRentals.length > 0 ? Math.round(myEarnings / completedRentals.length).toLocaleString() : 0}
                </p>
                <p className="text-[11px] text-stone-600 mt-1">Per rental booking</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Owner & Yard Profile</h3>
              <p className="text-xs text-stone-600">Business registration and address details</p>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                currentUser.verificationStatus === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Verification: {currentUser.verificationStatus || 'PENDING'}
            </span>
          </div>

          {profileUpdated && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Owner profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Business / Brand Name</label>
              <input
                type="text"
                value={profileForm.businessName}
                onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={profileForm.mobile}
                  onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Yard / Shop Address</label>
              <input
                type="text"
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Village</label>
                <input
                  type="text"
                  value={profileForm.village}
                  onChange={(e) => setProfileForm({ ...profileForm, village: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">District</label>
                <input
                  type="text"
                  value={profileForm.district}
                  onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">State</label>
                <input
                  type="text"
                  value={profileForm.state}
                  onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              Update Owner Details
            </button>
          </form>
        </div>
      )}

      {/* Add / Edit Equipment Modal */}
      {equipmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="bg-amber-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tractor className="w-5 h-5" />
                <h3 className="font-bold text-sm">
                  {editingEquipmentId ? 'Edit Agricultural Equipment' : 'Add New Agricultural Equipment'}
                </h3>
              </div>
              <button
                onClick={() => setEquipmentModalOpen(false)}
                className="text-amber-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEquipment} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Equipment Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={equipmentForm.name}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                  placeholder="e.g. John Deere 5310 55HP 4WD Tractor"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category *</label>
                  <select
                    value={equipmentForm.category}
                    onChange={(e: any) => setEquipmentForm({ ...equipmentForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-600"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={equipmentForm.brand}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, brand: e.target.value })}
                    placeholder="e.g. John Deere, Mahindra, Shaktiman"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    value={equipmentForm.model}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, model: e.target.value })}
                    placeholder="5310 GearPro"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    value={equipmentForm.year}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Power / Specs</label>
                  <input
                    type="text"
                    value={equipmentForm.horsepower}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, horsepower: e.target.value })}
                    placeholder="55 HP"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              {/* Equipment Location & Yard Station */}
              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      Machinery Station & Location
                    </span>
                  </div>
                  {currentUser && (
                    <button
                      type="button"
                      onClick={fillLocationFromProfile}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs transition flex items-center gap-1 cursor-pointer"
                      title="Fill village, district, state, and address from your registered profile"
                    >
                      <span>📍 Use My Profile Location</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-emerald-800 leading-tight">
                  Farmers search and filter equipment by proximity. Specify the exact yard, village, or farm where this machinery is stationed for pickup or delivery.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Village / Town *</label>
                    <input
                      type="text"
                      required
                      value={equipmentForm.village}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, village: e.target.value })}
                      placeholder="e.g. Doraha"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">District *</label>
                    <input
                      type="text"
                      required
                      value={equipmentForm.district}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, district: e.target.value })}
                      placeholder="e.g. Ludhiana"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={equipmentForm.state}
                      onChange={(e) => setEquipmentForm({ ...equipmentForm, state: e.target.value })}
                      placeholder="e.g. Punjab"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Yard / Pickup Landmark / Station Address
                  </label>
                  <input
                    type="text"
                    value={equipmentForm.location}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, location: e.target.value })}
                    placeholder="e.g. Kisan Workshop Yard #3, GT Road or Farm Depot, Main Canal"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    Farmers will see: <strong>{equipmentForm.location || `${equipmentForm.village || 'Village'}, ${equipmentForm.district || 'District'}`} ({equipmentForm.state || 'State'})</strong>
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Hourly Rental Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={equipmentForm.hourlyPrice}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, hourlyPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-800 mb-1">Daily Rental Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={equipmentForm.dailyPrice}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, dailyPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Equipment Image URL *</label>
                <input
                  type="url"
                  required
                  value={equipmentForm.image}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEquipmentForm({
                        ...equipmentForm,
                        image:
                          'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80',
                      })
                    }
                    className="text-[10px] text-stone-600 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded"
                  >
                    Preset: Tractor
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEquipmentForm({
                        ...equipmentForm,
                        image:
                          'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80',
                      })
                    }
                    className="text-[10px] text-stone-600 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded"
                  >
                    Preset: Harvester
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEquipmentForm({
                        ...equipmentForm,
                        image:
                          'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&w=1000&q=80',
                      })
                    }
                    className="text-[10px] text-stone-600 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded"
                  >
                    Preset: Rotavator
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={equipmentForm.description}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, description: e.target.value })}
                  placeholder="Describe machinery condition, attachments included (trolley, canopy, extra blades), operator assistance, etc."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEquipmentModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  {editingEquipmentId ? 'Save Modifications' : 'Submit Equipment Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Location Update Modal */}
      {locationModalEquipment && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Update Machinery Yard Location</h3>
                  <p className="text-xs text-stone-500 truncate max-w-[240px] font-medium">{locationModalEquipment.name}</p>
                </div>
              </div>
              <button
                onClick={() => setLocationModalEquipment(null)}
                className="text-stone-400 hover:text-stone-700 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Stationed this equipment at a different depot, yard, or farm? Update the location below so local farmers in that cluster can immediately discover and book it.
            </p>

            <form onSubmit={handleSaveQuickLocation} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Village / Town *</label>
                  <input
                    type="text"
                    required
                    value={quickLocationForm.village}
                    onChange={(e) => setQuickLocationForm({ ...quickLocationForm, village: e.target.value })}
                    placeholder="e.g. Doraha"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={quickLocationForm.district}
                    onChange={(e) => setQuickLocationForm({ ...quickLocationForm, district: e.target.value })}
                    placeholder="e.g. Ludhiana"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={quickLocationForm.state}
                  onChange={(e) => setQuickLocationForm({ ...quickLocationForm, state: e.target.value })}
                  placeholder="e.g. Punjab"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Yard Station / Pickup Address Landmark
                </label>
                <input
                  type="text"
                  value={quickLocationForm.location}
                  onChange={(e) => setQuickLocationForm({ ...quickLocationForm, location: e.target.value })}
                  placeholder="e.g. Kisan Workshop Yard #3, GT Road"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Preview: <strong>{quickLocationForm.location || `${quickLocationForm.village}, ${quickLocationForm.district}`} ({quickLocationForm.state})</strong>
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLocationModalEquipment(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Station Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
