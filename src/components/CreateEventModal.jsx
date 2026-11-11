import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { X, Plus, Sparkles, Pencil, AlertTriangle } from 'lucide-react';

export default function CreateEventModal({ onClose, onSuccess, existingEvent = null, byHod = false }) {
  const { addEvent, updateEvent, activeDepartmentId, departments } = usePortal();
  const isEditing = !!existingEvent;

  const [formData, setFormData] = useState({
    title: existingEvent?.title || '',
    departmentId: existingEvent?.departmentId || activeDepartmentId,
    category: existingEvent?.category || 'Workshop',
    date: existingEvent?.date || '',
    time: existingEvent?.time || existingEvent?.timeSlots?.[0] || '10:00 AM - 01:00 PM',
    venue: existingEvent?.venue || '',
    description: existingEvent?.description || '',
    bannerUrl: existingEvent?.bannerUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    totalSlots: existingEvent?.totalSlots || 60,
    coordinatorName: existingEvent?.coordinatorName || 'Department Coordinator',
    coordinatorEmail: existingEvent?.coordinatorEmail || 'coordinator@nmiet.edu.in',
    tagsStr: existingEvent?.tags?.join(', ') || 'Technology, Engineering, Workshop'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isEditing) {
      updateEvent(existingEvent.id, formData, byHod);
    } else {
      const created = addEvent({
        ...formData,
        totalSlots: parseInt(formData.totalSlots, 10) || 50,
        timeSlots: [formData.time]
      });
      if (onSuccess) onSuccess(created);
    }

    setIsSubmitting(false);
    onClose();
  };

  const inputClass = "w-full bg-slate-900/90 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-cyan-400 text-xs";

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="glass-panel w-full max-w-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto border-cyan-500/30">

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            {isEditing ? <Pencil className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {isEditing ? 'Edit Event' : 'Coordinator Authoring'}
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">
            {isEditing ? 'Edit Event Details' : 'Propose Department Event'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isEditing
              ? 'Update the event details. If the event was already published or rejected, it will be re-submitted to the HOD Verification Queue.'
              : 'Fill in the event details. Once submitted, your proposal will enter the HOD Verification Queue for approval.'}
          </p>

          {/* Warning for published events being edited by coordinator */}
          {isEditing && !byHod && (existingEvent.status === 'published' || existingEvent.status === 'rejected') && (
            <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Editing a <strong className="capitalize">{existingEvent.status}</strong> event will reset its status to <strong>Pending HOD Verification</strong>. The HOD must re-approve before it goes live again.</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">

          {/* Department & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Target Department Portal</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className={inputClass}
                disabled={isEditing}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.shortName} - {d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Event Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={inputClass}
              >
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Seminar">Seminar</option>
                <option value="Competition">Competition</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Guest Lecture">Guest Lecture</option>
                <option value="Industrial Visit">Industrial Visit</option>
                <option value="Cultural">Cultural</option>
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
              className={inputClass}
            />
          </div>

          {/* Date, Time, Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={inputClass}
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
                className={inputClass}
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
                className={inputClass}
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
              className={inputClass}
            />
          </div>

          {/* Coordinator Name */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Coordinator Name</label>
            <input
              type="text"
              placeholder="e.g. Prof. Rahul Patil"
              value={formData.coordinatorName}
              onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Banner URL & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Banner Image URL</label>
              <input
                type="url"
                value={formData.bannerUrl}
                onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tagsStr}
                onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Event Description & Requirements *</label>
            <textarea
              required
              rows={4}
              placeholder="Describe the agenda, prerequisites, prizes, lab guidelines..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary py-2.5 text-xs">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary py-2.5 text-xs">
              {isEditing ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isEditing ? 'Save Changes & Resubmit' : 'Submit for HOD Verification'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
