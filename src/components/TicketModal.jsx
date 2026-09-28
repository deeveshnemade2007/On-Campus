import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePortal } from '../context/PortalContext';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  UserCheck, 
  Trash2,
  Share2,
  Sparkles
} from 'lucide-react';

export default function TicketModal({ booking, onClose }) {
  const { cancelBooking } = usePortal();

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this booking? Your slot will be freed up for other students.')) {
      cancelBooking(booking.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="glass-panel w-full max-w-xl p-0 relative overflow-hidden border-cyan-500/40 shadow-2xl">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-cyan-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Official Digital Entry Pass
          </div>
          <h2 className="text-xl font-extrabold font-heading">{booking.eventTitle}</h2>
          <p className="text-xs text-white/80 mt-1">{booking.departmentName}</p>
        </div>

        {/* Printable Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6 ticket-printable bg-[#0d1322] text-white">
          
          {/* Status Badge */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs text-gray-400 font-medium block">Booking Reference</span>
              <span className="text-lg font-bold font-mono text-cyan-400">{booking.id}</span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {booking.status}
            </span>
          </div>

          {/* Student Info & Venue Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-gray-400 block mb-1">Attendee Name</span>
              <strong className="text-white text-sm block truncate">{booking.studentName}</strong>
              <span className="text-cyan-400 font-mono text-[11px]">PRN: {booking.prn}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-gray-400 block mb-1">Reserved Time Slot</span>
              <strong className="text-white text-sm block truncate">{booking.timeSlot}</strong>
              <span className="text-gray-400 text-[11px]">Booked on: {new Date(booking.bookedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* QR Code & Scan Instructions */}
          <div className="bg-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl text-slate-900">
            <div className="flex-1 space-y-1">
              <h4 className="font-extrabold text-base text-slate-900 font-heading">Gate Verification QR</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Present this QR pass at the entrance. The coordinator will scan it to verify your slot reservation.
              </p>
              <div className="pt-2 text-[10px] text-slate-500 font-mono break-all">
                Hash: {booking.qrValue}
              </div>
            </div>

            <div className="p-3 bg-slate-100 rounded-xl border border-slate-300 shrink-0">
              <QRCodeSVG 
                value={booking.qrValue} 
                size={130} 
                bgColor="#ffffff" 
                fgColor="#0f172a"
                level="H"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            {booking.status === 'Confirmed' && (
              <button
                onClick={handleCancel}
                className="w-full sm:w-auto text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 className="w-4 h-4" /> Cancel Booking
              </button>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handlePrint}
                className="btn-primary w-full sm:w-auto text-xs justify-center py-2.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Pass / Save PDF</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
