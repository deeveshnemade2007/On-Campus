import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Sparkles, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

export default function CreateEventModal({ onClose, onSuccess }) {
  const { addEvent, activeDepartmentId, activeDepartment, departments } = usePortal();

  const [formData, setFormData] = useState({
    title: '',
    departmentId: activeDepartmentId,
    category: 'Workshop',
    date: '',
    time: '10:00 AM - 01:00 PM',
    venue: '',
    description: '',
    bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    totalSlots: 60,
    coordinatorName: 'Department Coordinator',
    coordinatorEmail: 'coordinator@college.edu',
    tagsStr: 'Technology, Engineering, Workshop'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tags = formData.tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    const created = addEvent({
      ...formData,
      totalSlots: parseInt(formData.totalSlots, 10) || 50,
      tags,
      timeSlots: [formData.time]
    });

    setIsSubmitting(false);
    if (onSuccess) onSuccess(created);
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="glass-panel w-full max-w-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto border-cyan-500/30">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Coordinator Authoring
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">Propose Department Event</h2>
          <p className="text-xs text-gray-400 mt-1">
            Fill in the event details. Once submitted, your proposal will enter the HOD Verification Queue for approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Department & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Target Department Portal</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full bg-slate-900/90 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-cyan-400"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.shortName} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Event Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900/90 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-cyan-400"
              >
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Seminar">Seminar</option>
                <option value="Competition">Competition</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Guest Lecture">Guest Lecture</option>
              </select>
            </div>
          </div>

          {/* Event Title */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Event Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Advanced Embedded Microcontroller Hackathon 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-900/90 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          {/* Date, Time, Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-900/90 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Time Slot *</label>
              <input
                type="text"
                required
                placeholder="10:00 AM - 01:00 PM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-slate-900/90 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Total Seat Slots *</label>
              <input
                type="number"
                min="5"
                max="500"
                required
                value={formData.totalSlots}
                onChange={(e) => setFormData({ ...formData, totalSlots: e.target.value })}
                className="w-full bg-slate-900/90 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Venue Location *</label>
            <input
              type="text"
              required
              placeholder="e.g. Block B, Lab 204 / Main Auditorium"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full bg-slate-900/90 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          {/* Banner URL & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Image Banner URL</label>
              <input
                type="url"
                value={formData.bannerUrl}
                onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                className="w-full bg-slate-900/90 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Tags (Comma separated)</label>
              <input
                type="text"
                value={formData.tagsStr}
                onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
                className="w-full bg-slate-900/90 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Event Description & Requirements *</label>
            <textarea
              required
              rows={3}
              placeholder="Detail the agenda, prerequisite tools, cash prizes, or lab guidelines for attending students..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900/90 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-2.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary py-2.5"
            >
              <Plus className="w-4 h-4" />
              <span>Submit for HOD Verification</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
