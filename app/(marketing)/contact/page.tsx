'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function ContactPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    role: 'ASHA Worker / Health Worker',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1.5 rounded-full text-xs font-bold">
          <span>Get in Touch</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2C2418] tracking-tight">
          Contact the Swastha Setu Team
        </h1>
        <p className="text-lg text-[#6B6355] leading-relaxed">
          Questions about field deployment, facility data integration, or academic research collaboration? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Info Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white border border-[#E5DCC8] rounded-3xl p-8 space-y-6 shadow-xs">
            <h3 className="text-xl font-bold text-[#2C2418]">Contact Information</h3>
            
            <div className="space-y-4 text-sm text-[#6B6355]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F6E56]/10 text-[#0F6E56] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#2C2418] block">Email Support</span>
                  <span>contact@swasthasetu.org</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D85A30]/10 text-[#D85A30] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#2C2418] block">Public Health Project Cell</span>
                  <span>+91 800 555 7388</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#BA7517]/10 text-[#BA7517] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#2C2418] block">Academic Initiative</span>
                  <span>Rural Health Innovation Lab, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 bg-white border border-[#E5DCC8] rounded-3xl p-8 sm:p-10 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#2C2418]">Thank You!</h3>
              <p className="text-sm text-[#6B6355] max-w-md mx-auto">
                Your message has been submitted to the Swastha Setu team. We will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-[#0F6E56] text-white font-bold text-xs px-6 py-2.5 rounded-xl mt-4"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-2xl font-bold text-[#2C2418]">Send a Message</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C2418] uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-[#FAF6EE] border border-[#E5DCC8] rounded-xl px-4 py-3 text-sm text-[#2C2418] focus:outline-none focus:border-[#0F6E56]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C2418] uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh@example.com"
                    className="w-full bg-[#FAF6EE] border border-[#E5DCC8] rounded-xl px-4 py-3 text-sm text-[#2C2418] focus:outline-none focus:border-[#0F6E56]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C2418] uppercase tracking-wider mb-1.5">
                    Organization / District
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. Chittoor District NGO"
                    className="w-full bg-[#FAF6EE] border border-[#E5DCC8] rounded-xl px-4 py-3 text-sm text-[#2C2418] focus:outline-none focus:border-[#0F6E56]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C2418] uppercase tracking-wider mb-1.5">
                    Role Category
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-[#FAF6EE] border border-[#E5DCC8] rounded-xl px-4 py-3 text-sm text-[#2C2418] focus:outline-none focus:border-[#0F6E56]"
                  >
                    <option>ASHA Worker / Health Worker</option>
                    <option>NGO Representative</option>
                    <option>Health Department Official</option>
                    <option>Academic / Researcher</option>
                    <option>General User / Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C2418] uppercase tracking-wider mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you or collaborate?"
                  className="w-full bg-[#FAF6EE] border border-[#E5DCC8] rounded-xl px-4 py-3 text-sm text-[#2C2418] focus:outline-none focus:border-[#0F6E56]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#D85A30] hover:bg-[#C24C24] text-white font-bold text-base py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
