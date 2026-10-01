import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserCheck, 
  UserPlus, 
  AlertTriangle,
  Building2,
  Calendar,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import EventCard from '../components/EventCard';

export default function HodDashboard({ onSelectEvent }) {
  const { 
    activeDepartment, 
    events, 
    coordinators, 
    approveEvent, 
    rejectEvent, 
    approveCoordinator 
  } = usePortal();

  const [activeSubTab, setActiveSubTab] = useState('verification'); // 'verification' | 'published' | 'coordinators'
  const [remarkInput, setRemarkInput] = useState('');
  const [selectedVerifyEvent, setSelectedVerifyEvent] = useState(null);

  // Filter events strictly for this HOD's department
  const deptEvents = events.filter(e => e.departmentId === activeDepartment.id);
  const pendingEvents = deptEvents.filter(e => e.status === 'pending_verification');
  const publishedEvents = deptEvents.filter(e => e.status === 'published');
  
  // Department Coordinators
  const deptCoordinators = coordinators.filter(c => c.departmentId === activeDepartment.id);

  const handleApprove = (eventId) => {
    approveEvent(eventId, remarkInput || `Approved by HOD ${activeDepartment.hodName}`);
    setSelectedVerifyEvent(null);
    setRemarkInput('');
  };

  const handleReject = (eventId) => {
    rejectEvent(eventId, remarkInput || 'Changes requested. Please update schedule/venue.');
    setSelectedVerifyEvent(null);
    setRemarkInput('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top HOD Banner */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden border-indigo-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> Department Head Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              {activeDepartment.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              HOD: <strong className="text-white">{activeDepartment.hodName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold text-xs px-3.5 py-2 rounded-xl">
              Portal Code: {activeDepartment.shortName}
            </span>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveSubTab('verification')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'verification'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Verification Queue</span>
          {pendingEvents.length > 0 && (
            <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
              {pendingEvents.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('published')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'published'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Live Department Events ({publishedEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('coordinators')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'coordinators'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Coordinators Management ({deptCoordinators.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: Verification Queue */}
      {activeSubTab === 'verification' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-heading">Event Verification & Approval Queue</h2>
            <span className="text-xs text-amber-400 font-medium">
              Only verified events are visible to students for slot booking.
            </span>
          </div>

          {pendingEvents.length === 0 ? (
            <div className="glass-panel p-12 text-center text-gray-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-white mb-1">Queue Clean</h3>
              <p className="text-xs">No pending event verification requests for {activeDepartment.shortName}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingEvents.map((evt) => (
                <div key={evt.id} className="glass-panel p-6 border-amber-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md">
                      Awaiting Verification
                    </span>
                    <span className="text-xs text-gray-400">Submitted: {new Date(evt.submittedAt || Date.now()).toLocaleDateString()}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white font-heading">{evt.title}</h3>
                    <p className="text-xs text-cyan-400 mt-0.5">Category: {evt.category} • Coordinator: {evt.coordinatorName}</p>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl space-y-1 text-xs text-gray-300">
                    <div><strong>Date & Time:</strong> {evt.date} ({evt.time})</div>
                    <div><strong>Venue:</strong> {evt.venue}</div>
                    <div><strong>Seat Capacity:</strong> {evt.totalSlots} Slots</div>
                  </div>

                  <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Verification Remark Input */}
                  <div className="pt-2 border-t border-white/10 space-y-3">
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">HOD Remark / Approval Note:</label>
                      <input
                        type="text"
                        placeholder="Add remark e.g., 'Approved. Lab keys reserved.'"
                        value={selectedVerifyEvent?.id === evt.id ? remarkInput : ''}
                        onChange={(e) => {
                          setSelectedVerifyEvent(evt);
                          setRemarkInput(e.target.value);
                        }}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(evt.id)}
                        className="btn-success flex-1 text-xs justify-center py-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Publish</span>
                      </button>
                      <button
                        onClick={() => handleReject(evt.id)}
                        className="btn-danger text-xs justify-center py-2 px-4"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: Published Events */}
      {activeSubTab === 'published' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white font-heading">Published Events for {activeDepartment.shortName}</h2>
          
          {publishedEvents.length === 0 ? (
            <div className="glass-panel p-12 text-center text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30 text-indigo-400" />
              <p className="text-sm">No published events currently live for this department.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedEvents.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  onSelectEvent={onSelectEvent}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: Department Coordinators */}
      {activeSubTab === 'coordinators' && (
        <div className="glass-panel p-6 space-y-6 border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white font-heading">Department Coordinators</h2>
              <p className="text-xs text-gray-400">Authorize faculty & student coordinators for {activeDepartment.name}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-white/5 uppercase text-gray-400 font-semibold border-b border-white/10">
                <tr>
                  <th className="p-3">Coordinator Name</th>
                  <th className="p-3">Email Contact</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Authorization Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {deptCoordinators.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white">{c.name}</td>
                    <td className="p-3">{c.email}</td>
                    <td className="p-3">{c.phone || '+91 98765 00000'}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        c.status === 'Approved' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {c.status !== 'Approved' && (
                        <button
                          onClick={() => approveCoordinator(c.id)}
                          className="btn-success text-[11px] py-1 px-3"
                        >
                          Authorize
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
