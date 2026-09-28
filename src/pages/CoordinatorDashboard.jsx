import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  UserCheck, 
  Plus, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import CreateEventModal from '../components/CreateEventModal';
import EventCard from '../components/EventCard';

export default function CoordinatorDashboard({ onSelectEvent }) {
  const { activeDepartment, events, bookings } = usePortal();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEventRoster, setSelectedEventRoster] = useState(null);

  // Events belonging to coordinator's department
  const coordEvents = events.filter(e => e.departmentId === activeDepartment.id);

  // Registered students for this department's events
  const deptEventIds = coordEvents.map(e => e.id);
  const deptBookings = bookings.filter(b => deptEventIds.includes(b.eventId) && b.status === 'Confirmed');

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Coordinator Banner */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden border-cyan-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
              <UserCheck className="w-4 h-4" /> Coordinator Command Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              {activeDepartment.name} Events
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Author upcoming workshops, seminars, & competitions. Submissions require HOD approval before student slot booking opens.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary text-xs py-3 px-5 shadow-xl shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Propose New Event</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 flex items-center justify-between border-cyan-500/20">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Department Events</span>
            <strong className="text-2xl font-extrabold text-white font-heading">{coordEvents.length}</strong>
          </div>
          <Calendar className="w-8 h-8 text-cyan-400 opacity-60" />
        </div>

        <div className="glass-panel p-4 flex items-center justify-between border-emerald-500/20">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Total Registered Attendees</span>
            <strong className="text-2xl font-extrabold text-emerald-300 font-heading">{deptBookings.length}</strong>
          </div>
          <Users className="w-8 h-8 text-emerald-400 opacity-60" />
        </div>

        <div className="glass-panel p-4 flex items-center justify-between border-amber-500/20">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Pending HOD Review</span>
            <strong className="text-2xl font-extrabold text-amber-300 font-heading">
              {coordEvents.filter(e => e.status === 'pending_verification').length}
            </strong>
          </div>
          <Clock className="w-8 h-8 text-amber-400 opacity-60" />
        </div>
      </div>

      {/* Events Management List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-heading">Department Events Dashboard</h2>
          <span className="text-xs text-gray-400">Click any event card to view options</span>
        </div>

        {coordEvents.length === 0 ? (
          <div className="glass-panel p-12 text-center text-gray-400">
            <Calendar className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-30" />
            <h3 className="text-base font-bold text-white mb-1">No Events Found</h3>
            <p className="text-xs mb-4">You haven't proposed any events for {activeDepartment.shortName} yet.</p>
            <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary text-xs mx-auto">
              <Plus className="w-4 h-4" /> Propose First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coordEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                onSelectEvent={() => setSelectedEventRoster(evt)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Roster Modal / Bottom Sheet */}
      {selectedEventRoster && (
        <div className="glass-panel p-6 border-cyan-500/40 space-y-4 mt-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Registered Attendee Roster</span>
              <h3 className="text-lg font-bold text-white font-heading">{selectedEventRoster.title}</h3>
            </div>

            <button
              onClick={() => setSelectedEventRoster(null)}
              className="btn-secondary text-xs"
            >
              Close Roster
            </button>
          </div>

          {/* Attendee table */}
          {bookings.filter(b => b.eventId === selectedEventRoster.id && b.status === 'Confirmed').length === 0 ? (
            <p className="text-xs text-gray-400 py-4">No student registrations recorded yet for this event.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-white/5 uppercase text-gray-400 font-semibold border-b border-white/10">
                  <tr>
                    <th className="p-3">Pass ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">PRN</th>
                    <th className="p-3">Time Slot</th>
                    <th className="p-3">Booking Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings
                    .filter(b => b.eventId === selectedEventRoster.id && b.status === 'Confirmed')
                    .map((b) => (
                      <tr key={b.id} className="hover:bg-white/5">
                        <td className="p-3 font-mono font-bold text-cyan-400">{b.id}</td>
                        <td className="p-3 font-semibold text-white">{b.studentName}</td>
                        <td className="p-3 font-mono">{b.prn}</td>
                        <td className="p-3">{b.timeSlot}</td>
                        <td className="p-3 text-gray-400">{new Date(b.bookedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Trigger */}
      {isCreateModalOpen && (
        <CreateEventModal 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      )}

    </div>
  );
}
