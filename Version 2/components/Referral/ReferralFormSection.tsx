'use client'

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type FormData = {
  referrerName: string;
  organisation: string;
  role: string;
  referrerEmail: string;
  referrerPhone: string;
  parentNames: string;
  address: string;
  postcode: string;
  contactNumbers: string;
  preferredLanguage: string;
  childrenDetails: string;
  reasonFamilySupport: boolean;
  reasonReverseParenting: boolean;
  reasonTherapeuticSupport: boolean;
  reasonShortBreaks: boolean;
  reasonAuxiliaryService: string;
  concernsNeeds: string;
  desiredOutcomes: string;
  riskFactors: string;
  urgency: string;
  familyInformed: boolean;
  dataSharing: boolean;
  signatureName: string;
  signatureDate: string;
  signaturePosition: string;
  signature: string;
};

const ReferralFormSection = () => {
  const [formData, setFormData] = useState<FormData>({
    referrerName: '',
    organisation: '',
    role: '',
    referrerEmail: '',
    referrerPhone: '',
    parentNames: '',
    address: '',
    postcode: '',
    contactNumbers: '',
    preferredLanguage: '',
    childrenDetails: '',
    reasonFamilySupport: false,
    reasonReverseParenting: false,
    reasonTherapeuticSupport: false,
    reasonShortBreaks: false,
    reasonAuxiliaryService: '',
    concernsNeeds: '',
    desiredOutcomes: '',
    riskFactors: '',
    urgency: '',
    familyInformed: false,
    dataSharing: false,
    signatureName: '',
    signatureDate: '',
    signaturePosition: '',
    signature: ''
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateSelect = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateString = `${year}-${month}-${dayStr}`;
    setFormData(prev => ({ ...prev, signatureDate: dateString }));
    setShowDatePicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Referral submitted:', formData);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const changeMonth = (increment: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth);
    const days = [];
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = formData.signatureDate === 
        `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          className={`h-8 w-8 rounded-full text-xs font-medium transition-colors ${
            isSelected
              ? 'bg-primary text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-light uppercase text-primary mb-2">
            Professional Referral Form
          </h2>
          <p className="text-xs text-gray-600">
            Fill the form below or submit referrals to: <strong>info@emergefamilysupport.co.uk</strong> | Tel: <strong>+44 7508 863 433</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-primary rounded-lg p-8">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Referrer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  name="referrerName"
                  required
                  value={formData.referrerName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Organisation *</label>
                <input
                  type="text"
                  name="organisation"
                  required
                  value={formData.organisation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Role/Designation *</label>
                <input
                  type="text"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="referrerEmail"
                  required
                  value={formData.referrerEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="referrerPhone"
                  value={formData.referrerPhone}
                  onChange={handleChange}
                  placeholder="+44"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Family Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-2">Parent/Carer Name(s) *</label>
                <input
                  type="text"
                  name="parentNames"
                  required
                  value={formData.parentNames}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Postcode *</label>
                <input
                  type="text"
                  name="postcode"
                  required
                  value={formData.postcode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Contact Number(s) *</label>
                <input
                  type="text"
                  name="contactNumbers"
                  required
                  value={formData.contactNumbers}
                  onChange={handleChange}
                  placeholder="+44"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Preferred Language</label>
                <input
                  type="text"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Children/Young People</h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Name(s), Date(s) of Birth, Gender, School/Placement, EHCP (Y/N) *
              </label>
              <textarea
                name="childrenDetails"
                required
                rows={4}
                value={formData.childrenDetails}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                placeholder="Please provide details for each child/young person..."
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">4. Reason for Referral</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="reasonFamilySupport"
                  checked={formData.reasonFamilySupport}
                  onChange={handleChange}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-xs text-gray-700">Family Support</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="reasonReverseParenting"
                  checked={formData.reasonReverseParenting}
                  onChange={handleChange}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-xs text-gray-700">Reverse Parenting</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="reasonTherapeuticSupport"
                  checked={formData.reasonTherapeuticSupport}
                  onChange={handleChange}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-xs text-gray-700">Therapeutic Support</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="reasonShortBreaks"
                  checked={formData.reasonShortBreaks}
                  onChange={handleChange}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-xs text-gray-700">Short Breaks</span>
              </label>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Auxiliary Service (specify)</label>
                <input
                  type="text"
                  name="reasonAuxiliaryService"
                  value={formData.reasonAuxiliaryService}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                  placeholder="Specify auxiliary service if applicable"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">5. Summary of Concerns / Needs</h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Brief overview of presenting issues, risks, or needs — include known agencies involved *
              </label>
              <textarea
                name="concernsNeeds"
                required
                rows={4}
                value={formData.concernsNeeds}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">6. Desired Outcomes</h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                What would success look like for this family? *
              </label>
              <textarea
                name="desiredOutcomes"
                required
                rows={3}
                value={formData.desiredOutcomes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">7. Risk Factors / Safeguarding Alerts</h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Any known risks to children, parents, or staff
              </label>
              <textarea
                name="riskFactors"
                rows={3}
                value={formData.riskFactors}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">8. Preferred Start Date / Urgency</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="urgency"
                  value="standard"
                  checked={formData.urgency === 'standard'}
                  onChange={handleChange}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-xs text-gray-700">Standard (within 3 days)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="urgency"
                  value="urgent"
                  checked={formData.urgency === 'urgent'}
                  onChange={handleChange}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-xs text-gray-700">Urgent (within 24-48 hours)</span>
              </label>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">9. Consents</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="familyInformed"
                  checked={formData.familyInformed}
                  onChange={handleChange}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-xs text-gray-700">Family informed and consented to referral</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="dataSharing"
                  checked={formData.dataSharing}
                  onChange={handleChange}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-xs text-gray-700">Data sharing approved</span>
              </label>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">10. Referrer Signature</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  name="signatureName"
                  required
                  value={formData.signatureName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                />
              </div>
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="text"
                  readOnly
                  required
                  value={formatDate(formData.signatureDate)}
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs cursor-pointer"
                  placeholder="Select date"
                />
                {showDatePicker && (
                  <div className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-72">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => changeMonth(-1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-semibold">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeMonth(1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-600 h-8 flex items-center justify-center">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {renderCalendar()}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Position *</label>
                <input
                  type="text"
                  name="signaturePosition"
                  required
                  value={formData.signaturePosition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Signature *</label>
                <input
                  type="text"
                  name="signature"
                  required
                  value={formData.signature}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                  placeholder="Type your full name as signature"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary text-white px-8 py-3 text-xs uppercase rounded-full font-semibold hover:bg-primary/90 transition-colors"
            >
              Submit Referral
            </motion.button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ReferralFormSection;