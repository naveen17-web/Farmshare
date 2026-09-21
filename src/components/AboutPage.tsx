import React from 'react';
import { Tractor, Wheat, ShieldCheck, Users, TrendingUp, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Our Purpose & Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-3">
          Democratizing Agricultural Mechanization
        </h1>
        <p className="text-stone-600 text-base mt-3 leading-relaxed">
          Over 80% of farmers in India cultivate small or marginal landholdings where buying expensive machinery like tractors (₹7–10 Lakhs) and combine harvesters (₹25–35 Lakhs) leads to heavy indebtedness or manual labor inefficiency.
        </p>
      </div>

      {/* Grid Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
            <Tractor className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 text-base mb-2">Eliminating Capital Debt</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            By shifting from equipment ownership to flexible hourly and daily rentals, farmers pay only for the exact field hours needed during critical sowing and harvesting windows.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 text-base mb-2">Empowering Equipment Owners</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Farmers and rural entrepreneurs who already own machinery can monetize downtime, recovering machinery loans faster and building sustainable rental businesses.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 text-base mb-2">Verified Trust & Safety</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            FarmShare provides admin verification for equipment owners, double-booking prevention, automated billing calculations, and transparent mutual ratings.
          </p>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">12,500+</p>
            <p className="text-xs text-emerald-200 mt-1 uppercase font-semibold">Acres Mechanized</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">450+</p>
            <p className="text-xs text-emerald-200 mt-1 uppercase font-semibold">Machinery Listings</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">₹42 Lakhs+</p>
            <p className="text-xs text-emerald-200 mt-1 uppercase font-semibold">Farmer Savings</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">4.8 / 5</p>
            <p className="text-xs text-emerald-200 mt-1 uppercase font-semibold">Average Fleet Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};
