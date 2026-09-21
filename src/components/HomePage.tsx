import React from 'react';
import { useApp } from '../context/AppContext';
import { AgriculturalHeroBackground } from './AgriculturalHeroBackground';
import {
  Tractor,
  CalendarCheck2,
  CreditCard,
  Gauge,
  RotateCcw,
  CheckCircle2,
  Star,
  MapPin,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  Wheat,
} from 'lucide-react';
import { EquipmentCategory } from '../types';

interface HomePageProps {
  onNavigate: (view: string, extraData?: any) => void;
  onOpenAuth: (mode?: 'login' | 'register-farmer' | 'register-owner') => void;
}

const CATEGORIES: { name: EquipmentCategory; icon: string; count: string; desc: string }[] = [
  { name: 'Tractors', icon: '🚜', count: '45+ Units', desc: '35 HP to 90 HP utility & 4WD tractors' },
  { name: 'Harvesters', icon: '🌾', count: '18+ Units', desc: 'Multi-crop self-propelled combine harvesters' },
  { name: 'Rotavators', icon: '⚙️', count: '32+ Units', desc: '5ft to 8ft secondary tillage implements' },
  { name: 'Cultivators', icon: '🌱', count: '28+ Units', desc: 'Rigid & spring-loaded heavy duty tynes' },
  { name: 'Seeders', icon: '🌻', count: '22+ Units', desc: 'Automatic seed-cum-fertilizer drills' },
  { name: 'Sprayers', icon: '💧', count: '19+ Units', desc: 'Boom & tractor mounted high-pressure sprayers' },
  { name: 'Threshers', icon: '🌽', count: '14+ Units', desc: 'Paddy, wheat, and multi-crop threshers' },
  { name: 'Ploughs', icon: '⛰️', count: '26+ Units', desc: 'Hydraulic reversible and disc ploughs' },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenAuth }) => {
  const { equipment, currentUser } = useApp();

  // Featured approved equipment
  const featuredEquipment = equipment
    .filter((e) => e.approvalStatus === 'APPROVED' && e.availabilityStatus === 'AVAILABLE')
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-stone-50/50">
      {/* Hero Section with Live Animated Agricultural Technology Background */}
      <section className="relative overflow-hidden bg-[#041b12] text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 min-h-[620px] sm:min-h-[680px] flex items-center">
        {/* Live Animated "Agriculture meets Technology" Background */}
        <AgriculturalHeroBackground />
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Side: FarmShare Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>SMART AGRICULTURE RENTAL PLATFORM</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-white">
                Rent Faster.{' '}
                <span className="text-emerald-400 drop-shadow-[0_0_24px_rgba(52,211,153,0.45)]">
                  Farm Smarter.
                </span>{' '}
                Grow Better.
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/85 font-normal leading-relaxed max-w-xl">
                Access the agricultural equipment you need, exactly when you need it. Rent trusted machinery by the hour or day.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
                <button
                  id="hero-btn-find-equipment"
                  onClick={() => onNavigate('equipment')}
                  className="px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-base shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 cursor-pointer hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Find Equipment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-btn-list-equipment"
                  onClick={() => {
                    if (currentUser?.role === 'OWNER') {
                      onNavigate('owner-equipment');
                    } else {
                      onOpenAuth('register-owner');
                    }
                  }}
                  className="px-7 py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-400/40 text-emerald-100 font-bold text-base shadow-md transition flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md hover:border-emerald-300 hover:text-white"
                >
                  <span>List Your Equipment</span>
                  <Tractor className="w-4 h-4 text-emerald-400" />
                </button>
              </div>

              {/* Value Props Checklist */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-emerald-800/40 text-left">
                <div>
                  <p className="text-2xl font-black text-emerald-400">100%</p>
                  <p className="text-xs text-emerald-200/80 font-medium">Verified Machinery</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-400">0%</p>
                  <p className="text-xs text-emerald-200/80 font-medium">Double-Book Guarantee</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-400">₹0</p>
                  <p className="text-xs text-emerald-200/80 font-medium">Upfront Machinery Cost</p>
                </div>
              </div>
            </div>

            {/* Right Side: High-tech smart agriculture IoT visual context */}
            <div className="lg:col-span-5 hidden lg:flex flex-col justify-between items-end h-full min-h-[400px] pointer-events-none">
              {/* Connected Ag-IoT Network Pill */}
              <div className="bg-[#072d1f]/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-400/35 shadow-xl shadow-black/25 flex items-center gap-3 text-white pointer-events-auto">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <div className="text-left">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Connected Ag-IoT Network</p>
                  <p className="text-xs font-medium text-emerald-100/90">180+ Active Machinery Units</p>
                </div>
              </div>

              {/* Inspection Verified Telemetry Badge */}
              <div className="bg-[#072d1f]/85 backdrop-blur-md px-4 py-3 rounded-2xl border border-emerald-400/35 shadow-xl shadow-black/25 flex items-center gap-3 text-white pointer-events-auto max-w-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Inspection Verified</p>
                  <p className="text-xs font-semibold text-white">Inspected & Field-Ready</p>
                  <p className="text-[11px] text-emerald-200/70">Engine, PTO & Hydraulic Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Equipment Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Machinery Fleet
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-2">
            Popular Equipment Categories
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Choose from a wide variety of specialized farm equipment ready for deployment in your district.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              id={`cat-card-${cat.name.toLowerCase()}`}
              onClick={() => onNavigate('equipment', { category: cat.name })}
              className="bg-white p-5 rounded-2xl border border-stone-200/80 hover:border-emerald-500 hover:shadow-md transition cursor-pointer group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 flex items-center justify-center text-2xl transition duration-200">
                <span>{cat.icon}</span>
              </div>
              <h3 className="font-bold text-stone-900 text-base mt-3 group-hover:text-emerald-700 transition">
                {cat.name}
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">{cat.desc}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-700">{cat.count}</span>
                <span className="text-stone-600 group-hover:translate-x-1 group-hover:text-emerald-600 transition font-bold">
                  Browse →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How FarmShare Works */}
      <section className="bg-emerald-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-500/20">
              Simple 5-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              How FarmShare Works
            </h2>
            <p className="text-emerald-200 text-sm sm:text-base mt-2">
              From discovering machines in your local village to safe return and ratings, our process is transparent and automated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Find Equipment',
                desc: 'Search tractors, rotavators, or harvesters by district, price, and category.',
                icon: Tractor,
              },
              {
                step: '02',
                title: 'Check Availability',
                desc: 'Our real-time engine validates dates and blocks overlapping double bookings.',
                icon: CalendarCheck2,
              },
              {
                step: '03',
                title: 'Book & Pay',
                desc: 'Get owner confirmation and make a demo instant payment via UPI, Card, or Wallet.',
                icon: CreditCard,
              },
              {
                step: '04',
                title: 'Use Equipment',
                desc: 'The machine is deployed to your farm for the selected hourly or daily window.',
                icon: Gauge,
              },
              {
                step: '05',
                title: 'Return & Review',
                desc: 'Return equipment, owner confirms completion, and you rate your experience.',
                icon: RotateCcw,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-emerald-900/60 border border-emerald-700/40 p-6 rounded-2xl relative flex flex-col justify-between hover:bg-emerald-900 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black text-emerald-400/40">{item.step}</span>
                    </div>
                    <h4 className="font-bold text-white text-base mb-2">{item.title}</h4>
                    <p className="text-xs text-emerald-200/90 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Equipment Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Available Immediately
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-2">
              Featured Agricultural Equipment
            </h2>
          </div>
          <button
            onClick={() => onNavigate('equipment')}
            className="mt-4 sm:mt-0 text-emerald-700 hover:text-emerald-800 font-bold text-sm flex items-center gap-1 cursor-pointer"
          >
            <span>View All Equipment ({equipment.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredEquipment.map((item) => (
            <div
              key={item.id}
              id={`equipment-card-${item.id}`}
              className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 bg-emerald-800/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {item.category}
                </span>
                <span className="absolute top-3 right-3 bg-white/95 text-stone-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{item.rating > 0 ? item.rating : 'New'}</span>
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
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
                      <span className="text-xs text-stone-600 block">Hourly</span>
                      <span className="text-sm font-bold text-stone-900">₹{item.hourlyPrice}</span>
                      <span className="text-[10px] text-stone-600">/hr</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-600 block">Daily</span>
                      <span className="text-base font-extrabold text-emerald-700">₹{item.dailyPrice}</span>
                      <span className="text-[10px] text-stone-600">/day</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('equipment-detail', { equipmentId: item.id })}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs cursor-pointer"
                  >
                    View Details & Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Role Benefits Split CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* For Farmers */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-8 rounded-3xl border border-emerald-200 relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-white px-3 py-1 rounded-full shadow-xs">
              For Cultivators & Farmers
            </span>
            <h3 className="text-2xl font-bold text-stone-900 mt-4">
              Mechanize Your Farm at Fraction of Cost
            </h3>
            <p className="text-stone-600 text-sm mt-2 leading-relaxed">
              Don't spend lakhs on idle machines. Rent tractors, rotavators, seed drills, and sprayers whenever seasonal cultivation requires it.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-stone-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Hourly & daily flexibility
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Automatic price calculator & demo payments
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Guaranteed availability checks
              </li>
            </ul>
            <button
              onClick={() => onNavigate('equipment')}
              className="mt-6 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition cursor-pointer"
            >
              Browse Equipment Fleet →
            </button>
          </div>

          {/* For Equipment Owners */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 p-8 rounded-3xl border border-amber-200 relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-white px-3 py-1 rounded-full shadow-xs">
              For Agricultural Equipment Owners
            </span>
            <h3 className="text-2xl font-bold text-stone-900 mt-4">
              Turn Idle Machinery Into Steady Income
            </h3>
            <p className="text-stone-600 text-sm mt-2 leading-relaxed">
              Equip your local agrarian community while generating significant monthly earnings. You control rental acceptance, rates, and schedule.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-stone-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700" /> Review and accept/reject booking requests
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700" /> Set custom hourly and daily pricing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700" /> Return verification & damage inspection
              </li>
            </ul>
            <button
              onClick={() => {
                if (currentUser?.role === 'OWNER') {
                  onNavigate('owner-equipment');
                } else {
                  onOpenAuth('register-owner');
                }
              }}
              className="mt-6 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm transition cursor-pointer"
            >
              List Machinery on FarmShare →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
