import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Users,
  Tractor,
  Calendar,
  CreditCard,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Trash2,
  Eye,
  MessageSquare,
  Star,
  Check,
  AlertCircle,
  Clock,
  ShieldCheck,
  Edit3,
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Save,
} from 'lucide-react';
import { UserRole, BookingStatus, EquipmentApproval } from '../types';

interface AdminPortalProps {
  initialSubTab?: 'stats' | 'users' | 'owners' | 'equipment' | 'bookings' | 'payments' | 'reviews' | 'complaints' | 'support-center';
  onNavigate: (view: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  initialSubTab = 'stats',
  onNavigate,
}) => {
  const {
    currentUser,
    users,
    equipment,
    bookings,
    payments,
    reviews,
    complaints,
    approveOwner,
    rejectOwner,
    toggleUserStatus,
    deleteUser,
    updateUserProfile,
    approveEquipment,
    rejectEquipment,
    deleteEquipment,
    deleteReview,
    updateComplaintStatus,
    supportCenter,
    updateSupportCenter,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'stats' | 'users' | 'owners' | 'equipment' | 'bookings' | 'payments' | 'reviews' | 'complaints' | 'support-center'
  >(initialSubTab);

  // User search & filters
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Equipment filter
  const [equipmentStatusFilter, setEquipmentStatusFilter] = useState<string>('ALL');

  // Booking status filter
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('ALL');

  // Complaint reply modal / view
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // User Edit Modal state
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editUserForm, setEditUserForm] = useState({
    fullName: '',
    businessName: '',
    mobile: '',
    village: '',
    district: '',
    state: '',
  });

  const handleOpenEditUser = (u: any) => {
    setEditingUser(u);
    setEditUserForm({
      fullName: u.fullName || '',
      businessName: u.businessName || '',
      mobile: u.mobile || '',
      village: u.village || '',
      district: u.district || '',
      state: u.state || '',
    });
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUserProfile(editingUser.id, editUserForm);
    setEditingUser(null);
  };

  // Regional Hub Presets
  const REGIONAL_HUB_PRESETS = [
    {
      name: 'Punjab Central Hub (Ludhiana HQ)',
      centerName: 'Central Agritech Operations & Kisan Helpdesk',
      branchCode: 'FARM-PB-HQ01',
      address: 'Agritech Innovation Hub, GT Road, Near Grain Market',
      villageOrCity: 'Ludhiana',
      district: 'Ludhiana',
      state: 'Punjab',
      pincode: '141001',
      helplinePhone: '+91 98765 43210',
      tollFree: '1800-419-FARM (1800-419-3276)',
      supportEmail: 'support@farmshare.com',
      adminEmail: 'admin@farmshare.com',
      operatingHours: 'Mon - Sat: 6:00 AM to 9:00 PM',
      mapEmbedQuery: 'Agritech Innovation Hub, GT Road, Ludhiana, Punjab 141001',
    },
    {
      name: 'Haryana Agri Hub (Karnal)',
      centerName: 'FarmShare Haryana Regional Operations & Farmer Center',
      branchCode: 'FARM-HR-02',
      address: 'National Highway 44, Agronomy Complex',
      villageOrCity: 'Karnal',
      district: 'Karnal',
      state: 'Haryana',
      pincode: '132001',
      helplinePhone: '+91 98222 33445',
      tollFree: '1800-419-3276',
      supportEmail: 'haryana.support@farmshare.com',
      adminEmail: 'admin@farmshare.com',
      operatingHours: 'Mon - Sun: 6:00 AM to 8:30 PM',
      mapEmbedQuery: 'Karnal, Haryana 132001',
    },
    {
      name: 'Western UP Hub (Meerut)',
      centerName: 'FarmShare Sugarcane & Grain Mechanization Center',
      branchCode: 'FARM-UP-03',
      address: 'Delhi-Dehradun Bypass, Krishi Vigyan Road',
      villageOrCity: 'Partapur',
      district: 'Meerut',
      state: 'Uttar Pradesh',
      pincode: '250103',
      helplinePhone: '+91 98333 44556',
      tollFree: '1800-419-3276',
      supportEmail: 'up.support@farmshare.com',
      adminEmail: 'admin@farmshare.com',
      operatingHours: 'Mon - Sat: 6:00 AM to 9:00 PM',
      mapEmbedQuery: 'Krishi Vigyan Kendra, Meerut, Uttar Pradesh',
    },
    {
      name: 'Maharashtra Agro Cluster (Nashik)',
      centerName: 'FarmShare Western Horticulture & Machinery Depot',
      branchCode: 'FARM-MH-04',
      address: 'MIDC Ambad Agricultural Park, Trimbak Road',
      villageOrCity: 'Nashik',
      district: 'Nashik',
      state: 'Maharashtra',
      pincode: '422010',
      helplinePhone: '+91 98444 55667',
      tollFree: '1800-419-3276',
      supportEmail: 'mh.support@farmshare.com',
      adminEmail: 'admin@farmshare.com',
      operatingHours: 'Mon - Sat: 6:30 AM to 8:30 PM',
      mapEmbedQuery: 'Ambad MIDC, Nashik, Maharashtra',
    },
  ];

  // Support Center Configuration State
  const [supportCenterForm, setSupportCenterForm] = useState({
    centerName: supportCenter.centerName,
    branchCode: supportCenter.branchCode || 'FARM-NORTH-01',
    address: supportCenter.address,
    villageOrCity: supportCenter.villageOrCity,
    district: supportCenter.district,
    state: supportCenter.state,
    pincode: supportCenter.pincode,
    helplinePhone: supportCenter.helplinePhone,
    tollFree: supportCenter.tollFree,
    supportEmail: supportCenter.supportEmail,
    adminEmail: supportCenter.adminEmail,
    operatingHours: supportCenter.operatingHours,
    emergencySupportPhone: supportCenter.emergencySupportPhone || '',
    mapEmbedQuery: supportCenter.mapEmbedQuery || '',
  });

  const [supportSavedNotification, setSupportSavedNotification] = useState(false);

  React.useEffect(() => {
    setSupportCenterForm({
      centerName: supportCenter.centerName,
      branchCode: supportCenter.branchCode || 'FARM-NORTH-01',
      address: supportCenter.address,
      villageOrCity: supportCenter.villageOrCity,
      district: supportCenter.district,
      state: supportCenter.state,
      pincode: supportCenter.pincode,
      helplinePhone: supportCenter.helplinePhone,
      tollFree: supportCenter.tollFree,
      supportEmail: supportCenter.supportEmail,
      adminEmail: supportCenter.adminEmail,
      operatingHours: supportCenter.operatingHours,
      emergencySupportPhone: supportCenter.emergencySupportPhone || '',
      mapEmbedQuery: supportCenter.mapEmbedQuery || '',
    });
  }, [supportCenter]);

  const handleSaveSupportCenter = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupportCenter(supportCenterForm);
    setSupportSavedNotification(true);
    setTimeout(() => setSupportSavedNotification(false), 4000);
  };

  const handleApplyHubPreset = (preset: (typeof REGIONAL_HUB_PRESETS)[0]) => {
    setSupportCenterForm((prev) => ({
      ...prev,
      centerName: preset.centerName,
      branchCode: preset.branchCode,
      address: preset.address,
      villageOrCity: preset.villageOrCity,
      district: preset.district,
      state: preset.state,
      pincode: preset.pincode,
      helplinePhone: preset.helplinePhone,
      tollFree: preset.tollFree,
      supportEmail: preset.supportEmail,
      adminEmail: preset.adminEmail,
      operatingHours: preset.operatingHours,
      mapEmbedQuery: preset.mapEmbedQuery,
    }));
  };

  const equipmentByLocation = useMemo(() => {
    const counts: Record<string, { state: string; district: string; count: number; available: number }> = {};
    equipment.forEach((eq) => {
      const state = eq.state || 'Unknown';
      const district = eq.district || 'Unknown';
      const key = `${state}__${district}`;
      if (!counts[key]) {
        counts[key] = {
          state,
          district,
          count: 0,
          available: 0,
        };
      }
      counts[key].count += 1;
      if (eq.availabilityStatus === 'AVAILABLE') {
        counts[key].available += 1;
      }
    });
    return Object.values(counts).sort((a, b) => b.count - a.count);
  }, [equipment]);

  // Platform Metrics
  const farmersCount = useMemo(() => users.filter((u) => u.role === 'FARMER').length, [users]);
  const ownersCount = useMemo(() => users.filter((u) => u.role === 'OWNER').length, [users]);
  const pendingOwners = useMemo(
    () => users.filter((u) => u.role === 'OWNER' && u.verificationStatus === 'PENDING'),
    [users]
  );
  const activeRentalsCount = useMemo(
    () => bookings.filter((b) => b.bookingStatus === 'ACTIVE').length,
    [bookings]
  );
  const totalRevenue = useMemo(
    () =>
      payments
        .filter((p) => p.paymentStatus === 'SUCCESS')
        .reduce((sum, p) => sum + p.amount, 0),
    [payments]
  );
  const platformCommission = Math.round(totalRevenue * 0.1); // 10% platform take-rate

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
      const q = userSearchQuery.toLowerCase();
      const matchSearch =
        !q ||
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.mobile.includes(q);
      return matchRole && matchSearch;
    });
  }, [users, userRoleFilter, userSearchQuery]);

  // Filtered Equipment
  const filteredEquipment = useMemo(() => {
    return equipment.filter((eq) => {
      if (equipmentStatusFilter === 'ALL') return true;
      return eq.approvalStatus === equipmentStatusFilter;
    });
  }, [equipment, equipmentStatusFilter]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (bookingStatusFilter === 'ALL') return true;
      return b.bookingStatus === bookingStatusFilter;
    });
  }, [bookings, bookingStatusFilter]);

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-stone-200 text-center">
        <Shield className="w-12 h-12 text-stone-300 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-stone-900">Admin Authentication Required</h2>
        <p className="text-xs text-stone-600 mt-2">
          Only authorized platform administrators can view this dashboard. Please switch to the Admin profile above.
        </p>
      </div>
    );
  }

  const handleUpdateComplaint = (id: number, status: any) => {
    let note = adminNoteInput;
    if (!note && status === 'RESOLVED') {
      note = 'Resolved and verified by FarmShare grievance redressal committee.';
    } else if (!note && status === 'IN_PROGRESS') {
      note = 'Assigned to agricultural field support representative; investigation in progress.';
    }
    updateComplaintStatus(id, status, note || undefined);
    setSelectedComplaint(null);
    setAdminNoteInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>FarmShare Master Control Panel</span>
            <span>•</span>
            <span>{currentUser.fullName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Platform Administration
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Oversee farmers, equipment owners, fleet verification, transactions, bookings, and customer tickets.
          </p>
        </div>

        {pendingOwners.length > 0 && (
          <div className="bg-amber-500 text-stone-950 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{pendingOwners.length} Owner(s) Pending Approval</span>
          </div>
        )}
      </div>

      {/* Admin Subtabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 pb-2 mb-8 no-scrollbar">
        {[
          { key: 'stats', label: 'Platform Metrics' },
          { key: 'owners', label: `Owner Verification (${pendingOwners.length})` },
          { key: 'users', label: `Users (${users.length})` },
          { key: 'equipment', label: `Equipment Fleet (${equipment.length})` },
          { key: 'support-center', label: 'Support Center & Hub Location' },
          { key: 'bookings', label: `Bookings (${bookings.length})` },
          { key: 'payments', label: `Payment Reports (${payments.length})` },
          { key: 'reviews', label: `Reviews (${reviews.length})` },
          { key: 'complaints', label: `Grievances (${complaints.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === tab.key
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Platform Metrics */}
      {activeTab === 'stats' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Total Farmers
              </span>
              <p className="text-3xl font-black text-stone-900 mt-1">{farmersCount}</p>
              <p className="text-[11px] text-stone-600 mt-1">Registered cultivators</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Total Equipment Owners
              </span>
              <p className="text-3xl font-black text-stone-900 mt-1">{ownersCount}</p>
              <p className="text-[11px] text-stone-600 mt-1">
                {pendingOwners.length} awaiting verification
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Listed Machinery
              </span>
              <p className="text-3xl font-black text-emerald-700 mt-1">{equipment.length}</p>
              <p className="text-[11px] text-stone-600 mt-1">Tractors, harvesters, rotavators</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Active Rentals
              </span>
              <p className="text-3xl font-black text-emerald-700 mt-1">{activeRentalsCount}</p>
              <p className="text-[11px] text-stone-600 mt-1">In field right now</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-900 text-white p-6 rounded-3xl">
              <span className="text-xs uppercase font-bold text-emerald-300 block">Gross Rental Volume</span>
              <p className="text-3xl sm:text-4xl font-black mt-2">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-emerald-200/80 mt-1">Total payments processed through FarmShare</p>
            </div>

            <div className="bg-stone-900 text-white p-6 rounded-3xl">
              <span className="text-xs uppercase font-bold text-amber-300 block">Platform Commission (10%)</span>
              <p className="text-3xl sm:text-4xl font-black text-amber-400 mt-2">
                ₹{platformCommission.toLocaleString()}
              </p>
              <p className="text-xs text-stone-400 mt-1">Net platform revenue after owner payouts</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <span className="text-xs uppercase font-bold text-stone-600 block">Owner Payouts (90%)</span>
              <p className="text-3xl sm:text-4xl font-black text-stone-900 mt-2">
                ₹{(totalRevenue - platformCommission).toLocaleString()}
              </p>
              <p className="text-xs text-stone-600 mt-1">Disbursed to equipment owners</p>
            </div>
          </div>

          {/* Quick Pending Items */}
          {pendingOwners.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-stone-900 text-base">Owners Awaiting Verification</h3>
                <button
                  onClick={() => setActiveTab('owners')}
                  className="text-xs font-semibold text-emerald-700 hover:underline"
                >
                  Review All ({pendingOwners.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {pendingOwners.map((owner) => (
                  <div
                    key={owner.id}
                    className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">
                        {owner.businessName || owner.fullName}
                      </h4>
                      <p className="text-xs text-stone-600">
                        {owner.email} • {owner.mobile} • {owner.village}, {owner.district}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approveOwner(owner.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectOwner(owner.id)}
                        className="px-3 py-1.5 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Owner Verification */}
      {activeTab === 'owners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Owner Verification Queue</h3>
              <p className="text-xs text-stone-600">
                Owners initially register with 'PENDING' verification status to protect platform security.
              </p>
            </div>
          </div>

          {users.filter((u) => u.role === 'OWNER').length === 0 ? (
            <p className="text-xs text-stone-600">No owner accounts registered.</p>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Business / Owner</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4">Verification Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {users
                    .filter((u) => u.role === 'OWNER')
                    .map((o) => (
                      <tr key={o.id}>
                        <td className="py-3 px-4">
                          <p className="font-bold text-stone-900">{o.businessName || o.fullName}</p>
                          <span className="text-[11px] text-stone-600">Contact: {o.fullName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <p>{o.mobile}</p>
                          <span className="text-stone-600">{o.email}</span>
                        </td>
                        <td className="py-3 px-4">
                          {o.village}, {o.district}, {o.state}
                        </td>
                        <td className="py-3 px-4 text-stone-600">{o.createdAt}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              o.verificationStatus === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : o.verificationStatus === 'PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {o.verificationStatus || 'PENDING'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {o.verificationStatus !== 'APPROVED' && (
                              <button
                                onClick={() => approveOwner(o.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {o.verificationStatus !== 'REJECTED' && (
                              <button
                                onClick={() => rejectOwner(o.id)}
                                className="px-2.5 py-1 border border-red-300 text-red-600 hover:bg-red-50 rounded text-[11px] font-semibold cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-stone-900">User Management</h3>

            {/* Filter & Search Controls */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white"
              >
                <option value="ALL">All Roles</option>
                <option value="FARMER">Farmers Only</option>
                <option value="OWNER">Owners Only</option>
                <option value="ADMIN">Admins Only</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 px-4">
                      <p className="font-bold text-stone-900">{u.fullName}</p>
                      <span className="text-[11px] text-stone-600">{u.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'OWNER'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">{u.mobile}</td>
                    <td className="py-3 px-4">
                      {u.village || u.city || '—'}, {u.district || u.state || '—'}
                    </td>
                    <td className="py-3 px-4">
                      {(() => {
                        const isUserActive = u.status === 'ACTIVE' || u.isActive === true;
                        return (
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                              isUserActive
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isUserActive ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                            {isUserActive ? 'ACTIVE' : 'DEACTIVATED'}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditUser(u)}
                          className="text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 p-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 transition"
                          title={`Edit details for ${u.fullName}`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1 ${
                              u.status === 'ACTIVE' || u.isActive === true
                                ? 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                            }`}
                            title={u.status === 'ACTIVE' || u.isActive === true ? 'Deactivate this user' : 'Activate this user'}
                          >
                            {u.status === 'ACTIVE' || u.isActive === true ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => {
                              if (confirm(`Delete user ${u.fullName}?`)) deleteUser(u.id);
                            }}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 cursor-pointer"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Equipment Fleet */}
      {activeTab === 'equipment' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900">Equipment Fleet Moderation</h3>
            <select
              value={equipmentStatusFilter}
              onChange={(e) => setEquipmentStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white"
            >
              <option value="ALL">All Approvals</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending Approval</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Equipment</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Pricing</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredEquipment.map((eq) => (
                  <tr key={eq.id}>
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={eq.image} alt={eq.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-stone-900">{eq.name}</p>
                        <span className="text-[10px] text-stone-600">
                          {eq.brand} {eq.model} • {eq.year}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{eq.category}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-stone-900">{eq.ownerName}</p>
                      <span className="text-stone-600">{eq.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      ₹{eq.hourlyPrice}/hr • ₹{eq.dailyPrice}/day
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          eq.approvalStatus === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : eq.approvalStatus === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {eq.approvalStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {eq.approvalStatus !== 'APPROVED' && (
                          <button
                            onClick={() => approveEquipment(eq.id)}
                            className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {eq.approvalStatus !== 'REJECTED' && (
                          <button
                            onClick={() => rejectEquipment(eq.id)}
                            className="px-2 py-1 border border-red-300 text-red-600 hover:bg-red-50 rounded text-[10px] font-semibold cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm(`Delete listing ${eq.name}?`)) deleteEquipment(eq.id);
                          }}
                          className="p-1 text-stone-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900">All Platform Bookings</h3>
            <select
              value={bookingStatusFilter}
              onChange={(e) => setBookingStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="PAID">PAID</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="RETURNED">RETURNED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Equipment</th>
                  <th className="py-3 px-4">Farmer</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Rental Window</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="py-3 px-4 font-mono font-bold">#{b.id}</td>
                    <td className="py-3 px-4 font-medium text-stone-900">{b.equipmentName}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold">{b.farmerName}</p>
                      <span className="text-stone-600">{b.farmerPhone}</span>
                    </td>
                    <td className="py-3 px-4">{b.ownerName}</td>
                    <td className="py-3 px-4 text-stone-600">
                      {b.startDate} ({b.startTime}) to {b.endDate} ({b.endTime})
                      <span className="block text-[10px] text-stone-600">
                        {b.duration} {b.rentalType === 'HOURLY' ? 'Hours' : 'Days'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-700">₹{b.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          b.bookingStatus === 'COMPLETED'
                            ? 'bg-stone-100 text-stone-700'
                            : b.bookingStatus === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.bookingStatus === 'ACCEPTED'
                            ? 'bg-amber-100 text-amber-800'
                            : b.bookingStatus === 'RETURNED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Payments & Commissions */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900">Payment Audit & Revenue Share</h3>
            <span className="text-xs text-stone-600">Standard Platform Fee: 10%</span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Txn ID</th>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Equipment</th>
                  <th className="py-3 px-4">Farmer</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Gross Amount</th>
                  <th className="py-3 px-4">Platform (10%)</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {payments.map((p) => {
                  const commission = Math.round(p.amount * 0.1);
                  return (
                    <tr key={p.id}>
                      <td className="py-3 px-4 font-mono font-bold">{p.transactionId}</td>
                      <td className="py-3 px-4 font-mono">#{p.bookingId}</td>
                      <td className="py-3 px-4">{p.equipmentName}</td>
                      <td className="py-3 px-4">{p.farmerName}</td>
                      <td className="py-3 px-4">
                        <span className="bg-stone-100 px-2 py-0.5 rounded text-[10px] font-bold">
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">₹{p.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">₹{commission.toLocaleString()}</td>
                      <td className="py-3 px-4 text-stone-600">{p.paymentDate}</td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          {p.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Reviews Moderation */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-stone-900">Equipment Reviews & Ratings</h3>
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
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
                      <span className="text-xs font-bold text-stone-800">{r.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    Submitted by: <strong>{r.farmerName}</strong> • {r.createdAt}
                  </p>
                  <p className="text-xs text-stone-700 mt-2 bg-stone-50 p-3 rounded-xl border border-stone-100 italic">
                    "{r.comment}"
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Delete this review?')) deleteReview(r.id);
                  }}
                  className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Delete inappropriate review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Complaints & Grievances */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-stone-900">Grievance & Support Tickets</h3>
          <div className="space-y-4">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold bg-stone-100 px-2 py-0.5 rounded">
                      #{c.ticketNumber || `TKT-${c.id}`}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {c.status}
                    </span>
                    <span className="text-[11px] text-stone-600">{c.createdAt}</span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-sm">{c.subject}</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Sender: <strong>{c.userName}</strong> ({c.userEmail}) • Role: {c.userRole}
                  </p>
                  <p className="text-xs text-stone-700 mt-2 bg-stone-50 p-3 rounded-xl border border-stone-100">
                    {c.message}
                  </p>

                  {c.adminNotes && (
                    <p className="text-xs text-emerald-800 mt-2 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-medium">
                      <strong>Admin Resolution Note:</strong> {c.adminNotes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateComplaint(c.id, 'IN_PROGRESS')}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-lg cursor-pointer"
                    >
                      Mark In Progress
                    </button>
                    <button
                      onClick={() => handleUpdateComplaint(c.id, 'RESOLVED')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Support Center & Hub Location */}
      {activeTab === 'support-center' && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xs">
            <div className="max-w-2xl relative z-10">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Building2 className="w-4 h-4" />
                <span>Central Operations & Helpdesk Management</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Support Center Location & Helpline Hub
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
                Configure the central support center address, regional hub details, toll-free Kisan helpline, and operational hours. Changes made here immediately reflect on the public Contact page and platform Footer.
              </p>
            </div>
          </div>

          {/* Save Notification Toast */}
          {supportSavedNotification && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5 text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">Support Center Details Updated</h4>
                  <p className="text-xs text-emerald-700">All changes have been saved and synchronized across the platform.</p>
                </div>
              </div>
              <button
                onClick={() => setSupportSavedNotification(false)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Quick Hub Presets Bar */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Quick Regional Hub Presets
                </h3>
                <p className="text-[11px] text-stone-500">
                  Switch the headquarters or regional support center with one click:
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {REGIONAL_HUB_PRESETS.map((preset) => (
                <button
                  key={preset.branchCode}
                  type="button"
                  onClick={() => handleApplyHubPreset(preset)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 text-stone-700 hover:text-emerald-900 text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: Form + Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-base font-bold text-stone-900">Support Center Parameters</h3>
                </div>
                <span className="text-[11px] text-stone-400 font-mono">
                  {supportCenterForm.branchCode || 'HQ-01'}
                </span>
              </div>

              <form onSubmit={handleSaveSupportCenter} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Support Center / Hub Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={supportCenterForm.centerName}
                    onChange={(e) => setSupportCenterForm({ ...supportCenterForm, centerName: e.target.value })}
                    placeholder="e.g. Central Agritech Operations & Kisan Helpdesk"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Branch / Hub Code</label>
                    <input
                      type="text"
                      value={supportCenterForm.branchCode}
                      onChange={(e) => setSupportCenterForm({ ...supportCenterForm, branchCode: e.target.value })}
                      placeholder="e.g. FARM-PB-HQ01"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">PIN / Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={supportCenterForm.pincode}
                      onChange={(e) => setSupportCenterForm({ ...supportCenterForm, pincode: e.target.value })}
                      placeholder="e.g. 141001"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Street Address / Landmark / Building *
                  </label>
                  <input
                    type="text"
                    required
                    value={supportCenterForm.address}
                    onChange={(e) => setSupportCenterForm({ ...supportCenterForm, address: e.target.value })}
                    placeholder="e.g. Agritech Innovation Hub, GT Road, Near Grain Market"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">City / Village *</label>
                    <input
                      type="text"
                      required
                      value={supportCenterForm.villageOrCity}
                      onChange={(e) => setSupportCenterForm({ ...supportCenterForm, villageOrCity: e.target.value })}
                      placeholder="e.g. Ludhiana"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">District *</label>
                    <input
                      type="text"
                      required
                      value={supportCenterForm.district}
                      onChange={(e) => setSupportCenterForm({ ...supportCenterForm, district: e.target.value })}
                      placeholder="e.g. Ludhiana"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={supportCenterForm.state}
                      onChange={(e) => setSupportCenterForm({ ...supportCenterForm, state: e.target.value })}
                      placeholder="e.g. Punjab"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Toll-Free Kisan Helpline *
                    </label>
                    <input
                      type="text"
                      required
                      value={supportCenterForm.tollFree}
                      onChange={(e) => setSupportCenterForm({ ...supportCenterForm, tollFree: e.target.value })}
                      placeholder="1800-419-FARM (1800-419-3276)"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Direct Support Mobile / Phone
                    </label>
                    <input
                      type="text"
                      value={supportCenterForm.helplinePhone}
                      onChange={(e) => setSupportCenterForm({ ...supportCenterForm, helplinePhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Support Inquiries Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={supportCenterForm.supportEmail}
                      onChange={(e) => setSupportCenterForm({ ...supportCenterForm, supportEmail: e.target.value })}
                      placeholder="support@farmshare.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Admin / Escalations Email
                    </label>
                    <input
                      type="email"
                      value={supportCenterForm.adminEmail}
                      onChange={(e) => setSupportCenterForm({ ...supportCenterForm, adminEmail: e.target.value })}
                      placeholder="admin@farmshare.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Operating Hours *
                    </label>
                    <input
                      type="text"
                      required
                      value={supportCenterForm.operatingHours}
                      onChange={(e) => setSupportCenterForm({ ...supportCenterForm, operatingHours: e.target.value })}
                      placeholder="Mon - Sat: 6:00 AM to 9:00 PM"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Google Maps Location Query
                    </label>
                    <input
                      type="text"
                      value={supportCenterForm.mapEmbedQuery}
                      onChange={(e) => setSupportCenterForm({ ...supportCenterForm, mapEmbedQuery: e.target.value })}
                      placeholder="e.g. Agritech Innovation Hub, GT Road, Ludhiana"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSupportCenterForm({
                        centerName: supportCenter.centerName,
                        branchCode: supportCenter.branchCode || 'FARM-NORTH-01',
                        address: supportCenter.address,
                        villageOrCity: supportCenter.villageOrCity,
                        district: supportCenter.district,
                        state: supportCenter.state,
                        pincode: supportCenter.pincode,
                        helplinePhone: supportCenter.helplinePhone,
                        tollFree: supportCenter.tollFree,
                        supportEmail: supportCenter.supportEmail,
                        adminEmail: supportCenter.adminEmail,
                        operatingHours: supportCenter.operatingHours,
                        emergencySupportPhone: supportCenter.emergencySupportPhone || '',
                        mapEmbedQuery: supportCenter.mapEmbedQuery || '',
                      })
                    }
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold cursor-pointer"
                  >
                    Reset Unsaved
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Support Center Location</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Live Public Preview & Equipment Fleet Proximity */}
            <div className="lg:col-span-5 space-y-6">
              {/* Public Preview Card */}
              <div className="bg-white p-6 rounded-3xl border-2 border-emerald-300 shadow-xs relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                    LIVE PUBLIC PREVIEW
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Kisan Helpdesk Card
                  </span>
                </div>

                <h4 className="text-base font-bold text-stone-900 leading-snug">
                  {supportCenterForm.centerName || 'FarmShare Support Center'}
                </h4>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-800">
                        {supportCenterForm.address || 'Address'}
                      </p>
                      <p className="text-stone-600">
                        {supportCenterForm.villageOrCity || 'City'}, {supportCenterForm.district || 'District'}, {supportCenterForm.state || 'State'} - {supportCenterForm.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-800">{supportCenterForm.tollFree}</p>
                      <p className="text-[11px] text-stone-500">{supportCenterForm.operatingHours}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-stone-700">{supportCenterForm.supportEmail}</p>
                      {supportCenterForm.adminEmail && (
                        <p className="text-stone-500 text-[11px]">{supportCenterForm.adminEmail}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    Directions Query: {supportCenterForm.district}, {supportCenterForm.state}
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      supportCenterForm.mapEmbedQuery || `${supportCenterForm.address}, ${supportCenterForm.villageOrCity}, ${supportCenterForm.state}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Machinery Fleet Location Distribution */}
              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Tractor className="w-4 h-4 text-amber-700" />
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Fleet Station Distribution
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-stone-600">
                    {equipment.length} Units Total
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mb-3 leading-relaxed">
                  Geographic distribution of equipment stationed by owners across districts:
                </p>

                <div className="space-y-2">
                  {equipmentByLocation.map((item, idx) => {
                    const isHubDistrict =
                      item.district.toLowerCase() === supportCenterForm.district.toLowerCase();
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                          isHubDistrict
                            ? 'bg-emerald-50 border-emerald-300'
                            : 'bg-white border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin
                            className={`w-3.5 h-3.5 ${
                              isHubDistrict ? 'text-emerald-600' : 'text-stone-400'
                            }`}
                          />
                          <div>
                            <span className="font-semibold text-stone-900">
                              {item.district}, {item.state}
                            </span>
                            {isHubDistrict && (
                              <span className="ml-2 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Support Center District
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-stone-900">{item.count} machinery</span>
                          <span className="block text-[10px] text-stone-500">
                            {item.available} available
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Edit {editingUser.role === 'OWNER' ? 'Equipment Owner' : editingUser.role === 'FARMER' ? 'Farmer' : 'Admin'} Profile
                </h3>
                <p className="text-xs text-stone-500">Update contact and display names across the platform</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editUserForm.fullName}
                  onChange={(e) => setEditUserForm({ ...editUserForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  placeholder="e.g. Ramesh Patel"
                />
              </div>

              {editingUser.role === 'OWNER' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Business / Brand Name</label>
                  <input
                    type="text"
                    value={editUserForm.businessName}
                    onChange={(e) => setEditUserForm({ ...editUserForm, businessName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-600 outline-none"
                    placeholder="e.g. Balwinder Agro Rentals"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={editUserForm.mobile}
                  onChange={(e) => setEditUserForm({ ...editUserForm, mobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Village</label>
                  <input
                    type="text"
                    value={editUserForm.village}
                    onChange={(e) => setEditUserForm({ ...editUserForm, village: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">District</label>
                  <input
                    type="text"
                    value={editUserForm.district}
                    onChange={(e) => setEditUserForm({ ...editUserForm, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">State</label>
                  <input
                    type="text"
                    value={editUserForm.state}
                    onChange={(e) => setEditUserForm({ ...editUserForm, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
