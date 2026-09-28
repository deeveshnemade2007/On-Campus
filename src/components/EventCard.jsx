import React from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Clock3, 
  AlertCircle,
  Ticket,
  ChevronRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function EventCard({ event, onSelectEvent, onBookClick, onVerifyClick }) {
  const { currentRole, activeDepartmentId, bookings, studentProfile } = usePortal();

  const isFull = event.bookedSlots >= event.totalSlots;
  const percentageBooked = Math.min(100, Math.round((event.bookedSlots / event.totalSlots) * 100));
  const slotsLeft = Math.max(0, event.totalSlots - event.bookedSlots);

  // Check if current logged in student has booked this event
  const isBookedByStudent = bookings.some(
    b => b.eventId === event.id && b.studentEmail === studentProfile.email && b.status === 'Confirmed'
  );

  const getStatusBadge = () => {
    switch (event.status) {
      case 'published':
        return (
          <span className="badge-status-published px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Published & Live
          </span>
        );
      case 'pending_verification':
        return (
          <span className="badge-status-pending px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1">
            <Clock3 className="w-3 h-3" /> Pending HOD Approval
          </span>
        );
      case 'rejected':
        return (
          <span className="badge-status-rejected px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Revision Requested
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-panel glass-panel-interactive overflow-hidden flex flex-col justify-between group">
      
      {/* Top Media Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img 
          src={event.bannerUrl} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="bg-slate-950/80 backdrop-blur-md border border-white/20 text-cyan-300 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg">
            {event.departmentName?.split(' ')[0] || 'DEPT'}
          </span>
          {getStatusBadge()}
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-indigo-600/90 text-white font-bold text-xs px-2.5 py-1 rounded-md shadow-md">
            {event.category}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 
            onClick={() => onSelectEvent(event)}
            className="text-base sm:text-lg font-bold text-white font-heading hover:text-cyan-400 transition cursor-pointer line-clamp-2 mb-2"
          >
            {event.title}
          </h3>

          {/* Quick Meta */}
          <div className="space-y-1.5 text-xs text-gray-300 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{event.date} • {event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
            {event.description}
          </p>
        </div>

        {/* Slot Progress Bar */}
        <div className="bg-white/5 p-3 rounded-xl border border-white/5 mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-gray-300 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Slot Occupancy:
            </span>
            <span className={`font-bold ${isFull ? 'text-rose-400' : 'text-cyan-400'}`}>
              {event.bookedSlots} / {event.totalSlots} {isFull ? '(FULL)' : `(${slotsLeft} left)`}
            </span>
          </div>

          <div className="slot-progress-bg">
            <div 
              className={`slot-progress-fill ${
                isFull 
                  ? 'bg-rose-500' 
                  : percentageBooked > 75 
                  ? 'bg-amber-500' 
                  : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
              }`}
              style={{ width: `${percentageBooked}%` }}
            />
          </div>
        </div>

        {/* Action Button Row */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
          
          {/* HOD View Action */}
          {currentRole === 'hod' && event.status === 'pending_verification' && (
            <button
              onClick={() => onVerifyClick(event)}
              className="w-full btn-primary justify-center text-xs bg-gradient-to-r from-amber-600 to-orange-600"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Verify & Review Request</span>
            </button>
          )}

          {/* Student View Action */}
          {currentRole === 'student' && event.status === 'published' && (
            isBookedByStudent ? (
              <button
                onClick={() => onSelectEvent(event)}
                className="w-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Ticket className="w-4 h-4" />
                <span>Slot Booked • View Ticket</span>
              </button>
            ) : (
              <button
                disabled={isFull}
                onClick={() => onBookClick(event)}
                className={`w-full text-xs font-semibold rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 transition ${
                  isFull
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                    : 'btn-primary'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>{isFull ? 'Slots Filled' : 'Book Your Slot'}</span>
              </button>
            )
          )}

          {/* Coordinator / Director View */}
          {(currentRole === 'director' || currentRole === 'coordinator' || (currentRole === 'hod' && event.status === 'published')) && (
            <button
              onClick={() => onSelectEvent(event)}
              className="w-full btn-secondary text-xs justify-center py-2 hover:bg-white/10"
            >
              <span>Manage & Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
