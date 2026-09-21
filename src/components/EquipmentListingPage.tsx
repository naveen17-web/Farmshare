import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  Tractor,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Filter,
} from 'lucide-react';
import { EquipmentCategory } from '../types';

interface EquipmentListingPageProps {
  initialCategory?: string;
  onNavigate: (view: string, extraData?: any) => void;
}

const CATEGORIES: ('All' | EquipmentCategory)[] = [
  'All',
  'Tractors',
  'Harvesters',
  'Rotavators',
  'Cultivators',
  'Seeders',
  'Sprayers',
  'Threshers',
  'Ploughs',
];

export const EquipmentListingPage: React.FC<EquipmentListingPageProps> = ({
  initialCategory,
  onNavigate,
}) => {
  const { equipment, currentUser } = useApp();

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceType, setPriceType] = useState<'hourly' | 'daily'>('hourly');
  const [maxHourlyPrice, setMaxHourlyPrice] = useState<number>(2000);
  const [maxDailyPrice, setMaxDailyPrice] = useState<number>(15000);
  const [minRating, setMinRating] = useState<number>(0);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating-desc'>('popular');

  // Filter logic: Only APPROVED equipment visible to public/farmers
  const filteredEquipment = useMemo(() => {
    return equipment
      .filter((item) => {
        // Approval check: Only APPROVED equipment should be visible to farmers & guests
        if (currentUser?.role !== 'ADMIN' && item.approvalStatus !== 'APPROVED') {
          return false;
        }

        // Search term matching name, brand, model, description, location
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matches =
            item.name.toLowerCase().includes(q) ||
            item.brand.toLowerCase().includes(q) ||
            item.model.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.location.toLowerCase().includes(q) ||
            item.district.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Category
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }

        // Location
        if (locationFilter.trim()) {
          const loc = locationFilter.toLowerCase();
          const matchesLoc =
            item.location.toLowerCase().includes(loc) ||
            item.district.toLowerCase().includes(loc) ||
            item.state.toLowerCase().includes(loc);
          if (!matchesLoc) return false;
        }

        // Price
        if (priceType === 'hourly' && item.hourlyPrice > maxHourlyPrice) {
          return false;
        }
        if (priceType === 'daily' && item.dailyPrice > maxDailyPrice) {
          return false;
        }

        // Rating
        if (minRating > 0 && item.rating < minRating) {
          return false;
        }

        // Availability status
        if (availabilityFilter !== 'ALL' && item.availabilityStatus !== availabilityFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          return priceType === 'hourly'
            ? a.hourlyPrice - b.hourlyPrice
            : a.dailyPrice - b.dailyPrice;
        }
        if (sortBy === 'price-desc') {
          return priceType === 'hourly'
            ? b.hourlyPrice - a.hourlyPrice
            : b.dailyPrice - a.dailyPrice;
        }
        if (sortBy === 'rating-desc') {
          return b.rating - a.rating;
        }
        return b.reviewCount - a.reviewCount; // Popular
      });
  }, [
    equipment,
    currentUser,
    searchTerm,
    selectedCategory,
    locationFilter,
    priceType,
    maxHourlyPrice,
    maxDailyPrice,
    minRating,
    availabilityFilter,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setLocationFilter('');
    setMaxHourlyPrice(2000);
    setMaxDailyPrice(15000);
    setMinRating(0);
    setAvailabilityFilter('ALL');
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Agricultural Equipment Fleet
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-1">
          Search and rent verified tractors, implements, and harvesters with automated pricing and availability verification.
        </p>
      </div>

      {/* Main Search & Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-equipment-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by equipment name, brand (e.g. John Deere, Mahindra, Shaktiman)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Location Input */}
          <div className="md:col-span-3 relative">
            <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-location-input"
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="District or Village (e.g. Ludhiana, Hisar)"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3">
            <select
              id="select-sort-by"
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
            >
              <option value="popular">Sort: Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-3 border-t border-stone-100 no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid with Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                Refine Fleet
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Price Type Switch */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Rental Price Mode
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-xl">
                <button
                  onClick={() => setPriceType('hourly')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    priceType === 'hourly'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Hourly Rate
                </button>
                <button
                  onClick={() => setPriceType('daily')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    priceType === 'daily'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Daily Rate
                </button>
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
                <span>Max {priceType === 'hourly' ? 'Hourly' : 'Daily'} Price</span>
                <span className="text-emerald-700 font-bold">
                  ₹{priceType === 'hourly' ? maxHourlyPrice : maxDailyPrice}
                </span>
              </div>
              <input
                type="range"
                min={priceType === 'hourly' ? 100 : 1000}
                max={priceType === 'hourly' ? 2000 : 15000}
                step={priceType === 'hourly' ? 50 : 500}
                value={priceType === 'hourly' ? maxHourlyPrice : maxDailyPrice}
                onChange={(e) =>
                  priceType === 'hourly'
                    ? setMaxHourlyPrice(Number(e.target.value))
                    : setMaxDailyPrice(Number(e.target.value))
                }
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-600 mt-1">
                <span>₹{priceType === 'hourly' ? '100/hr' : '1,000/day'}</span>
                <span>₹{priceType === 'hourly' ? '2,000+/hr' : '15,000+/day'}</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Minimum Rating
              </label>
              <div className="space-y-1.5">
                {[0, 4.5, 4.0, 3.5].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars)}
                    className={`w-full px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                      minRating === stars
                        ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-300'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {stars === 0 ? (
                        'All Ratings'
                      ) : (
                        <>
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{stars} Stars & Above</span>
                        </>
                      )}
                    </span>
                    {minRating === stars && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Availability Status
              </label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:ring-2 focus:ring-emerald-600"
              >
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">Available Now</option>
                <option value="BOOKED">Currently Booked</option>
                <option value="MAINTENANCE">Under Maintenance</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Equipment Results Grid */}
        <main className="lg:col-span-9">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-stone-600">
              Showing <strong className="text-stone-900">{filteredEquipment.length}</strong> matching equipment
            </span>
          </div>

          {filteredEquipment.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center">
              <Tractor className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bold text-stone-800 text-base">No Equipment Found</h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto mt-1">
                Try loosening your filters, choosing a different category, or widening your price range.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEquipment.map((item) => (
                <div
                  key={item.id}
                  id={`equipment-card-${item.id}`}
                  className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col group"
                >
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-emerald-800/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      {item.category}
                    </span>

                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                        item.availabilityStatus === 'AVAILABLE'
                          ? 'bg-emerald-600 text-white'
                          : item.availabilityStatus === 'BOOKED'
                          ? 'bg-blue-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {item.availabilityStatus}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-emerald-800">
                          {item.brand} • {item.model}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-stone-700 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{item.rating > 0 ? item.rating : 'New'}</span>
                          {item.reviewCount > 0 && (
                            <span className="text-[10px] text-stone-600">({item.reviewCount})</span>
                          )}
                        </div>
                      </div>

                      <h3 className="font-bold text-stone-900 text-sm line-clamp-1 group-hover:text-emerald-700 transition">
                        {item.name}
                      </h3>

                      <div className="flex items-center gap-1 text-xs text-stone-600 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{item.location}</span>
                      </div>

                      <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-stone-100">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <span className="text-[10px] text-stone-600 block uppercase">Hourly</span>
                          <span className="text-sm font-bold text-stone-900">₹{item.hourlyPrice}</span>
                          <span className="text-[10px] text-stone-600">/hr</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-stone-600 block uppercase">Daily</span>
                          <span className="text-base font-extrabold text-emerald-700">₹{item.dailyPrice}</span>
                          <span className="text-[10px] text-stone-600">/day</span>
                        </div>
                      </div>

                      <button
                        id={`btn-view-details-${item.id}`}
                        onClick={() => onNavigate('equipment-detail', { equipmentId: item.id })}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>View Details & Book</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
