import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Building2, 
  ShieldCheck, 
  Ticket, 
  CheckCircle2,
  Tag,
  Share2
} from 'lucide-react';
import TicketModal from './TicketModal';
import confetti from 'canvas-confetti';

export default function EventDetailModal({ event, onClose }) {
  const { currentRole, bookSlot, studentProfile, bookings } = usePortal();
  const [selectedSlot, setSelectedSlot] = useState(event?.timeSlots?.[0] || event?.time || '');
  const [generatedTicket, setGeneratedTicket] = useState(null);

  if (!event) return null;

  const isFull = event.bookedSlots >= event.totalSlots;
  const isAlreadyBooked = bookings.some(
    b => b.eventId === event.id && b.studentEmail === studentProfile.email && b.status === 'Confirmed'
  );

  const existingBooking = bookings.find(
    b => b.eventId === event.id && b.studentEmail === studentProfile.email && b.status === 'Confirmed'
  );

  const handleBookSlot = () => {
    const res = bookSlot(event.id, selectedSlot);
    if (res.success) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setGeneratedTicket(res.booking);
    } else {
      if (res.booking) {
        setGeneratedTicket(res.booking);
      } else {
        alert(res.message);
      }
    }
  };

  return (
    <>
      <div className="modal-overlay animate-fade-in">
        <div className="glass-panel w-full max-w-3xl p-0 relative overflow-hidden border-cyan-500/40 max-h-[90vh] overflow-y-auto">
          
          {/* Header Banner */}
          <div className="relative h-64 sm:h-80 w-full bg-slate-900">
            <img 
              src={event.bannerUrl} 
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1322] via-[#0d1322]/40 to-black/60" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 p-2 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-cyan-500/90 text-slate-950 font-bold text-xs px-3 py-1 rounded-lg">
                  {event.departmentName}
                </span>
                <span className="bg-indigo-600/90 text-white font-bold text-xs px-3 py-1 rounded-lg">
                  {event.category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-8 space-y-6 text-xs text-gray-300">
            
            {/* Meta Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-[11px] text-gray-400 block">Date & Time</span>
                  <strong className="text-white text-xs block">{event.date}</strong>
                  <span className="text-gray-400 text-[10px]">{event.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-[11px] text-gray-400 block">Venue Location</span>
                  <strong className="text-white text-xs block truncate">{event.venue}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[11px] text-gray-400 block">Slot Availability</span>
                  <strong className="text-white text-xs block">
                    {event.bookedSlots} / {event.totalSlots} Booked
                  </strong>
                  <span className="text-cyan-400 text-[10px]">
                    {event.totalSlots - event.bookedSlots} Seats Remaining
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-white font-heading mb-2">Event Description</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                {event.description}
              </p>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-cyan-400" />
                {event.tags.map((t, idx) => (
                  <span key={idx} className="bg-white/5 border border-white/10 text-cyan-300 px-2.5 py-1 rounded-md text-[11px]">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Coordinator Info & HOD Remark */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                <span className="text-[11px] text-gray-400 block">Organizer & Coordinator</span>
                <strong className="text-white text-xs block">{event.coordinatorName}</strong>
                <span className="text-cyan-400 text-[11px]">{event.coordinatorEmail}</span>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                <span className="text-[11px] text-gray-400 block">HOD Verification Status</span>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{event.hodRemark || 'Verified & Approved by HOD'}</span>
                </div>
              </div>
            </div>

            {/* Time Slot Selector & Booking Button (Student Role) */}
            {currentRole === 'student' && event.status === 'published' && (
              <div className="pt-4 border-t border-white/10 space-y-4">
                {event.timeSlots && event.timeSlots.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-white mb-2">Select Your Session Slot:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {event.timeSlots.map((ts, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedSlot(ts)}
                          className={`p-3 rounded-xl text-xs text-left border transition ${
                            selectedSlot === ts
                              ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {ts}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isAlreadyBooked ? (
                  <button
                    onClick={() => setGeneratedTicket(existingBooking)}
                    className="w-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Slot Already Reserved • View Digital Entry Pass</span>
                  </button>
                ) : (
                  <button
                    disabled={isFull}
                    onClick={handleBookSlot}
                    className="w-full btn-primary justify-center text-xs py-3"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Confirm & Reserve My Slot</span>
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {generatedTicket && (
        <TicketModal booking={generatedTicket} onClose={() => setGeneratedTicket(null)} />
      )}
    </>
  );
}
