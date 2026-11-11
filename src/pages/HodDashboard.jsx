import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  AlertTriangle,
  Building2,
  Calendar,
  Pencil,
} from 'lucide-react';
import CreateEventModal from '../components/CreateEventModal';

export default function HodDashboard() {
  const {
    activeDepartment,
    events,
    coordinators,
    approveEvent,
    rejectEvent,
    approveCoordinator,
    updateEvent,
  } = usePortal();

  const [activeSubTab, setActiveSubTab] = useState('verification');
  const [remarkInput, setRemarkInput] = useState('');
  const [selectedVerifyEvent, setSelectedVerifyEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const deptEvents      = events.filter(e => e.departmentId === activeDepartment.id);
  const pendingEvents   = deptEvents.filter(e => e.status === 'pending_verification');
  const publishedEvents = deptEvents.filter(e => e.status === 'published');
  const rejectedEvents  = deptEvents.filter(e => e.status === 'rejected');

  const deptCoordinators = coordinators.filter(c => c.departmentId === activeDepartment.id);

  const handleApprove = (eventId) => {
    approveEvent(eventId, remarkInput || `Approved by HOD ${activeDepartment.hodName}.`);
    setSelectedVerifyEvent(null);
    setRemarkInput('');
  };

  const handleReject = (eventId) => {
    rejectEvent(eventId, remarkInput || 'Changes requested. Please update schedule/venue.');
    setSelectedVerifyEvent(null);
    setRemarkInput('');
  };

  // HOD edit: keeps status as-is (byHod = true)
  const handleHodEdit = (eventId, updatedData) => {
    updateEvent(eventId, updatedData, true);
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

      {/* Sub Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {[
          { key: 'verification', label: 'Verification Queue', icon: Clock, badge: pendingEvents.length },
          { key: 'published',    label: `Live Events (${publishedEvents.length})`, icon: CheckCircle2 },
          { key: 'rejected',     label: `Rejected (${rejectedEvents.length})`, icon: XCircle },
          { key: 'coordinators', label: `Coordinators (${deptCoordinators.length})`, icon: UserCheck },
        ].map(({ key, label, icon: Icon, badge }) => (
          <button
            key={key}
            onClick={() => setActiveSubTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === key
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {badge > 0 && (
              <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Verification Queue ── */}
      {activeSubTab === 'verification' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-heading">Event Verification & Approval Queue</h2>
            <span className="text-xs text-amber-400 font-medium">Only verified events are visible to students.</span>
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
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{new Date(evt.submittedAt || Date.now()).toLocaleDateString()}</span>
                      <button
                        onClick={() => setEditingEvent(evt)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/40 transition font-semibold"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                    </div>
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

                  <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">{evt.description}</p>

                  <div className="pt-2 border-t border-white/10 space-y-3">
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">HOD Remark / Approval Note:</label>
                      <input
                        type="text"
                        placeholder="Add remark e.g., 'Approved. Lab keys reserved.'"
                        value={selectedVerifyEvent?.id === evt.id ? remarkInput : ''}
                        onChange={(e) => { setSelectedVerifyEvent(evt); setRemarkInput(e.target.value); }}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleApprove(evt.id)} className="btn-success flex-1 text-xs justify-center py-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Publish</span>
                      </button>
                      <button onClick={() => handleReject(evt.id)} className="btn-danger text-xs justify-center py-2 px-4">
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

      {/* ── Published Events (with Edit) ── */}
      {activeSubTab === 'published' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white font-heading">Published Events for {activeDepartment.shortName}</h2>
          {publishedEvents.length === 0 ? (
            <div className="glass-panel p-12 text-center text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30 text-indigo-400" />
              <p className="text-sm">No published events currently live for this department.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {publishedEvents.map((evt) => (
                <div key={evt.id} className="glass-panel p-5 border-emerald-500/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 inline mr-1" />Published
                        </span>
                        <span className="text-[10px] text-gray-400">{evt.category}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white font-heading">{evt.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{evt.date} · {evt.venue} · {evt.totalSlots} slots</p>
                      {evt.hodRemark && (
                        <p className="text-xs text-emerald-400 mt-1"><strong>Remark:</strong> {evt.hodRemark}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingEvent(evt)}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/40 font-semibold transition shrink-0"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Rejected Events (with Edit to re-submit) ── */}
      {activeSubTab === 'rejected' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white font-heading">Rejected Events</h2>
          {rejectedEvents.length === 0 ? (
            <div className="glass-panel p-12 text-center text-gray-400">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-400" />
              <p className="text-sm">No rejected events for this department.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rejectedEvents.map((evt) => (
                <div key={evt.id} className="glass-panel p-5 border-red-500/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                        Rejected
                      </span>
                      <h3 className="text-sm font-bold text-white font-heading">{evt.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{evt.date} · {evt.venue}</p>
                      {evt.hodRemark && (
                        <p className="text-xs text-red-300 mt-1 flex items-start gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span><strong>Rejection Reason:</strong> {evt.hodRemark}</span>
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingEvent(evt)}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/40 font-semibold transition shrink-0"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit & Re-evaluate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Department Coordinators ── */}
      {activeSubTab === 'coordinators' && (
        <div className="glass-panel p-6 space-y-6 border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">Department Coordinators</h2>
            <p className="text-xs text-gray-400">Authorize faculty & student coordinators for {activeDepartment.name}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-white/5 uppercase text-gray-400 font-semibold border-b border-white/10">
                <tr>
                  <th className="p-3">Coordinator Name</th>
                  <th className="p-3">Email Contact</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {deptCoordinators.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">No coordinators registered for this department.</td>
                  </tr>
                ) : deptCoordinators.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white">{c.name}</td>
                    <td className="p-3">{c.email}</td>
                    <td className="p-3">{c.phone || '—'}</td>
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
                        <button onClick={() => approveCoordinator(c.id)} className="btn-success text-[11px] py-1 px-3">
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

      {/* ── HOD Edit Event Modal ── */}
      {editingEvent && (
        <CreateEventModal
          existingEvent={editingEvent}
          byHod={true}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
}
