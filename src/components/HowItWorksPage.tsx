import React from 'react';
import {
  Tractor,
  CalendarCheck2,
  CreditCard,
  Gauge,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (mode?: 'login' | 'register-farmer' | 'register-owner') => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Platform Architecture & Operations
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-3">
          How FarmShare Works
        </h1>
        <p className="text-stone-600 text-base mt-2">
          A seamless, peer-to-peer agricultural equipment sharing workflow designed specifically for Indian farming cycles.
        </p>
      </div>

      {/* 5 Step Lifecycle */}
      <div className="space-y-8 max-w-4xl mx-auto">
        {[
          {
            step: '01',
            title: '1. Discover Equipment Near Your Village',
            desc: 'Search our fleet of verified tractors, combine harvesters, rotavators, seed drills, and sprayers located within your district. View detailed technical specs, HP, daily/hourly prices, and past farmer reviews.',
            icon: Tractor,
          },
          {
            step: '02',
            title: '2. Check Real-Time Availability (Anti-Double Booking)',
            desc: 'Choose whether you require hourly or daily rental. Select start and end timestamps. Our database engine checks existing reservations to ensure zero overlap. If another farmer has reserved that window, the system alerts you immediately.',
            icon: CalendarCheck2,
          },
          {
            step: '03',
            title: '3. Request Confirmation & Demo Payment',
            desc: 'The equipment owner reviews your booking request and approves it based on machinery readiness. Once approved, you make an instant mock payment via UPI (GPay/PhonePe), Credit/Debit Card, or Kisan Demo Wallet to activate your rental.',
            icon: CreditCard,
          },
          {
            step: '04',
            title: '4. Operate Equipment in Field',
            desc: 'The machine is deployed to your farm on time. Complete your plowing, sowing, pesticide spraying, or harvesting with commercial-grade implements without paying huge machinery purchase debt.',
            icon: Gauge,
          },
          {
            step: '05',
            title: '5. Return & Community Review',
            desc: 'Once your field operation completes, mark "Return Equipment". The owner inspects the machine and confirms return. Both parties exchange ratings and reviews to build agrarian trust.',
            icon: RotateCcw,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start gap-6 hover:border-emerald-500 transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-md shadow-emerald-600/20">
                <Icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
                  <span className="text-xl font-black text-emerald-600/30">{item.step}</span>
                </div>
                <p className="text-stone-600 text-sm mt-2 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Grid: Hourly vs Daily */}
      <div className="mt-16 bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">Hourly vs. Daily Rental Guide</h2>
        <p className="text-emerald-200 text-sm text-center max-w-xl mx-auto mb-8">
          FarmShare offers flexible calculation modes tailored to seasonal workload:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-emerald-900/60 p-6 rounded-2xl border border-emerald-700/50">
            <h4 className="font-bold text-emerald-300 text-lg mb-2">⏱️ Hourly Rental</h4>
            <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
              Best for short, precision tasks such as 5-acre rotavator preparation, spraying, or stubble management.
            </p>
            <ul className="text-xs space-y-2 text-emerald-200">
              <li className="flex items-center gap-2">✓ Calculated automatically: Hours × Hourly Rate</li>
              <li className="flex items-center gap-2">✓ Ideal for 2 to 8 hour fieldwork</li>
              <li className="flex items-center gap-2">✓ Minimal idle expenditure</li>
            </ul>
          </div>

          <div className="bg-emerald-900/60 p-6 rounded-2xl border border-emerald-700/50">
            <h4 className="font-bold text-emerald-300 text-lg mb-2">📅 Daily Rental</h4>
            <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
              Best for multi-day operations like extensive combine harvesting, deep monsoon plowing, or multi-field sowing.
            </p>
            <ul className="text-xs space-y-2 text-emerald-200">
              <li className="flex items-center gap-2">✓ Calculated automatically: Days × Daily Rate</li>
              <li className="flex items-center gap-2">✓ Cost-effective volume discounts over hourly</li>
              <li className="flex items-center gap-2">✓ 24-hour equipment custody</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('equipment')}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm shadow-md transition cursor-pointer"
          >
            Explore Available Equipment Fleet
          </button>
        </div>
      </div>
    </div>
  );
};
