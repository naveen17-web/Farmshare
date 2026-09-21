import React from 'react';
import { Tractor, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (mode?: 'login' | 'register-farmer' | 'register-owner') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAuth }) => {
  const { supportCenter } = useApp();
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
                <Tractor className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Farm<span className="text-emerald-400">Share</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              India's dedicated agricultural equipment rental network. Providing affordable, reliable tractors, harvesters, rotavators, and implements directly from equipment owners to farmers.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Double-Booking Protected Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore Equipment
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('equipment')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  All Equipment Fleet
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('equipment')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Tractors & 4WD Machines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('equipment')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Combine Harvesters
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('equipment')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Rotavators & Cultivators
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('equipment')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Boom Sprayers & Seed Drills
                </button>
              </li>
            </ul>
          </div>

          {/* Portals & Roles */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Roles & Workflows
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  How FarmShare Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('register-farmer')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Register as Farmer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('register-owner')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  List Machinery as Owner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  About Our Mission
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Kisan Helpdesk & Grievances
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Support Center
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{supportCenter.tollFree}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{supportCenter.supportEmail}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  {supportCenter.address}, {supportCenter.villageOrCity}, {supportCenter.state}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 text-center sm:flex sm:justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} FarmShare Agritech Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center justify-center gap-1">
            Empowering Indian Farmers & Equipment Owners with Smart Mechanization
          </p>
        </div>
      </div>
    </footer>
  );
};
