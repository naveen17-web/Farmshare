import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { currentUser, submitComplaint, supportCenter } = useApp();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const res = submitComplaint({ subject, message });
    if (res.success) {
      setSubmitted(res.message);
      setSubject('');
      setMessage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Support & Grievance Cell
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-3">
          Contact FarmShare
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-2">
          Have an inquiry about equipment availability, owner onboarding, or experiencing a rental issue? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 text-base mb-4">Support Channels</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-stone-800">Toll-Free Kisan Helpline</p>
                  <p className="text-stone-800 font-semibold">{supportCenter.tollFree}</p>
                  {supportCenter.helplinePhone && (
                    <p className="text-stone-600">Direct: {supportCenter.helplinePhone}</p>
                  )}
                  <p className="text-[10px] text-stone-500 mt-0.5">{supportCenter.operatingHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-stone-800">Email Inquiries</p>
                  <p className="text-stone-700">{supportCenter.supportEmail}</p>
                  {supportCenter.adminEmail && (
                    <p className="text-stone-500">{supportCenter.adminEmail}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-stone-800">{supportCenter.centerName}</p>
                  <p className="text-stone-600">{supportCenter.address}</p>
                  <p className="text-stone-600">
                    {supportCenter.villageOrCity}, {supportCenter.district}, {supportCenter.state} - {supportCenter.pincode}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      supportCenter.mapEmbedQuery || `${supportCenter.address}, ${supportCenter.villageOrCity}, ${supportCenter.state}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-[11px] font-bold text-emerald-700 hover:text-emerald-900 mt-1 hover:underline"
                  >
                    📍 Get Directions on Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-200">
            <h4 className="font-bold text-emerald-900 text-sm mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              Ticket Tracking
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Every complaint submitted is automatically logged into the FarmShare Admin Complaints dashboard with a unique tracking ticket for resolution within 24 hours.
            </p>
          </div>
        </div>

        {/* Complaint / Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
            <h3 className="text-lg font-bold text-stone-900 mb-1">Submit Grievance or Inquiry</h3>
            <p className="text-xs text-stone-600 mb-6">
              {currentUser
                ? `Logged in as ${currentUser.fullName} (${currentUser.role})`
                : 'You can submit as a visitor or sign in for faster resolution.'}
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-base">Ticket Submitted Successfully</h4>
                <p className="text-xs text-emerald-800">{submitted}</p>
                <button
                  onClick={() => setSubmitted(null)}
                  className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Subject / Concern Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Inquiring about seed drills in Anand district, or equipment condition issue"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Detailed Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your question, request, or issue with equipment..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Ticket to Admin</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
