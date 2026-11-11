import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  UserCheck,
  Plus,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Pencil,
  Trash2,
  ListChecks,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  UserPlus,
  Hash,
  BookOpen,
} from 'lucide-react';
import CreateEventModal from '../components/CreateEventModal';

// Status badge helper
function StatusBadge({ status }) {
  const map = {
    pending_verification: { label: 'Pending HOD Review', color: 'bg-amber-500/20 text-amber-300 border border-amber-500/40' },
    published:            { label: 'Published / Live',   color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
    rejected:             { label: 'Rejected by HOD',    color: 'bg-red-500/20 text-red-300 border border-red-500/40' },
  };
  const cfg = map[status] || { label: status, color: 'bg-white/10 text-gray-300' };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.color}`}>
      {status === 'published'            && <CheckCircle2 className="w-3 h-3" />}
      {status === 'rejected'             && <XCircle className="w-3 h-3" />}
      {status === 'pending_verification' && <Clock className="w-3 h-3" />}
      {cfg.label}
    </span>
  );
}

export default function CoordinatorDashboard() {
  const {
    activeDepartment,
    events,
    bookings,
    deleteEvent,
    students,
    approveStudent,
    rejectStudent,
  } = usePortal();

  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'students'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent]           = useState(null);
  const [selectedEventRoster, setSelectedEventRoster] = useState(null);
  const [expandedEventId, setExpandedEventId]     = useState(null);
  const [deleteConfirm, setDeleteConfirm]         = useState(null);
  const [rejectStudentId, setRejectStudentId]     = useState(null);
  const [rejectReason, setRejectReason]           = useState('');

  // Events belonging to this coordinator's department
  const coordEvents = events.filter(e => e.departmentId === activeDepartment.id);
  const deptEventIds = coordEvents.map(e => e.id);
  const deptBookings = bookings.filter(b => deptEventIds.includes(b.eventId) && b.status === 'Confirmed');

  // Students for this department
  const deptStudents = students.filter(s => s.departmentId === activeDepartment.id);
  const pendingStudents  = deptStudents.filter(s => s.status === 'pending');
  const approvedStudents = deptStudents.filter(s => s.status === 'approved');
  const rejectedStudents = deptStudents.filter(s => s.status === 'rejected');

  const getBookedCount = (eventId) =>
    bookings.filter(b => b.eventId === eventId && b.status === 'Confirmed').length;

  const handleDeleteRequest = (evt) => {
    setDeleteConfirm({ id: evt.id, title: evt.title, bookedCount: getBookedCount(evt.id) });
  };

  const handleDeleteConfirmed = () => {
    if (deleteConfirm) {
      deleteEvent(deleteConfirm.id);
      if (selectedEventRoster?.id === deleteConfirm.id) setSelectedEventRoster(null);
      setDeleteConfirm(null);
    }
  };

  const handleRejectStudent = () => {
    if (rejectStudentId) {
      rejectStudent(rejectStudentId, rejectReason || 'Application rejected by coordinator.');
      setRejectStudentId(null);
      setRejectReason('');
    }
  };

  const toggleExpand = (id) => setExpandedEventId(prev => prev === id ? null : id);

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
              {activeDepartment.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Manage events and approve student registrations for your department.
            </p>
          </div>
          {activeTab === 'events' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary text-xs py-3 px-5 shadow-xl shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Propose New Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'events'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Events ({coordEvents.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'students'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Student Approvals</span>
          {pendingStudents.length > 0 && (
            <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
              {pendingStudents.length}
            </span>
          )}
        </button>
      </div>

      {/* ══════════ EVENTS TAB ══════════ */}
      {activeTab === 'events' && (
        <>
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

          {/* Events List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white font-heading">Manage Events</h2>
              <span className="text-xs text-gray-400">{coordEvents.length} event{coordEvents.length !== 1 ? 's' : ''} in {activeDepartment.shortName}</span>
            </div>

            {coordEvents.length === 0 ? (
              <div className="glass-panel p-12 text-center text-gray-400">
                <Calendar className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-30" />
                <h3 className="text-base font-bold text-white mb-1">No Events Yet</h3>
                <p className="text-xs mb-4">You haven't proposed any events for {activeDepartment.shortName} yet.</p>
                <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary text-xs mx-auto">
                  <Plus className="w-4 h-4" /> Propose First Event
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {coordEvents.map((evt) => {
                  const bookedCount  = getBookedCount(evt.id);
                  const isExpanded   = expandedEventId === evt.id;
                  const isRosterOpen = selectedEventRoster?.id === evt.id;

                  return (
                    <div key={evt.id} className="glass-panel border-white/10 overflow-hidden">
                      {/* Event Row Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <StatusBadge status={evt.status} />
                            {evt.category && (
                              <span className="text-[10px] text-gray-400 border border-white/10 rounded-full px-2 py-0.5">{evt.category}</span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-white font-heading truncate">{evt.title}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {evt.date} &nbsp;·&nbsp; {evt.venue} &nbsp;·&nbsp;
                            <span className="text-cyan-400 font-semibold">{bookedCount}/{evt.totalSlots} seats booked</span>
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 shrink-0">
                          <button
                            onClick={() => setEditingEvent(evt)}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/40 transition-colors font-semibold"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEventRoster(isRosterOpen ? null : evt);
                              setExpandedEventId(null);
                            }}
                            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-colors font-semibold ${
                              isRosterOpen
                                ? 'bg-emerald-500/30 text-emerald-200 border-emerald-500/50'
                                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-emerald-500/40'}`}
                          >
                            <ListChecks className="w-3.5 h-3.5" />
                            Roster {bookedCount > 0 && `(${bookedCount})`}
                          </button>
                          <button
                            onClick={() => toggleExpand(evt.id)}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 transition-colors font-semibold"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            Details
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(evt)}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40 transition-colors font-semibold"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>

                      {/* HOD Remark */}
                      {evt.hodRemark && (
                        <div className={`px-4 pb-3 text-xs flex items-start gap-2 ${evt.status === 'rejected' ? 'text-red-300' : 'text-emerald-300'}`}>
                          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span><strong>HOD Remark:</strong> {evt.hodRemark}</span>
                        </div>
                      )}

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-white/10 px-4 py-4 text-xs text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <span className="text-gray-500 uppercase tracking-wider text-[10px]">Description</span>
                            <p className="mt-1 text-gray-200">{evt.description || '—'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 uppercase tracking-wider text-[10px]">Time Slots</span>
                            <p className="mt-1">{evt.timeSlots?.join(', ') || evt.time || '—'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 uppercase tracking-wider text-[10px]">Tags</span>
                            <p className="mt-1">{evt.tags?.join(', ') || '—'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 uppercase tracking-wider text-[10px]">Submitted At</span>
                            <p className="mt-1">{evt.submittedAt ? new Date(evt.submittedAt).toLocaleString() : '—'}</p>
                          </div>
                        </div>
                      )}

                      {/* Attendee Roster */}
                      {isRosterOpen && (
                        <div className="border-t border-cyan-500/20 px-4 py-4">
                          <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Registered Attendee Roster</span>
                          {bookedCount === 0 ? (
                            <p className="text-xs text-gray-400 mt-3">No student registrations recorded yet for this event.</p>
                          ) : (
                            <div className="overflow-x-auto mt-3">
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
                                    .filter(b => b.eventId === evt.id && b.status === 'Confirmed')
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ══════════ STUDENT APPROVALS TAB ══════════ */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-4 flex items-center justify-between border-amber-500/20">
              <div>
                <span className="text-xs text-gray-400 block">Pending Approvals</span>
                <strong className="text-2xl font-extrabold text-amber-300 font-heading">{pendingStudents.length}</strong>
              </div>
              <Clock className="w-8 h-8 text-amber-400 opacity-60" />
            </div>
            <div className="glass-panel p-4 flex items-center justify-between border-emerald-500/20">
              <div>
                <span className="text-xs text-gray-400 block">Approved Students</span>
                <strong className="text-2xl font-extrabold text-emerald-300 font-heading">{approvedStudents.length}</strong>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-60" />
            </div>
            <div className="glass-panel p-4 flex items-center justify-between border-red-500/20">
              <div>
                <span className="text-xs text-gray-400 block">Rejected</span>
                <strong className="text-2xl font-extrabold text-red-300 font-heading">{rejectedStudents.length}</strong>
              </div>
              <XCircle className="w-8 h-8 text-red-400 opacity-60" />
            </div>
          </div>

          {/* Pending Requests */}
          <div>
            <h2 className="text-lg font-bold text-white font-heading mb-3 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-400" /> Pending Student Registrations
            </h2>
            {pendingStudents.length === 0 ? (
              <div className="glass-panel p-8 text-center text-gray-400">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-60" />
                <p className="text-sm font-semibold text-white">No pending registrations</p>
                <p className="text-xs">All student requests for {activeDepartment.shortName} have been processed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingStudents.map((s) => (
                  <div key={s.id} className="glass-panel p-5 border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">Pending Approval</span>
                      <span className="text-xs text-gray-500">{new Date(s.registeredAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{s.name} {s.surname}</h3>
                      <p className="text-xs text-cyan-400 font-mono mt-0.5">{s.email}</p>
                    </div>
                    <div className="text-xs text-gray-300 space-y-1 bg-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-2"><Hash className="w-3.5 h-3.5 text-gray-500" /> PRN: <strong className="text-white font-mono">{s.prn}</strong></div>
                      <div className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-gray-500" /> Branch: <strong className="text-white">{activeDepartment.shortName}</strong></div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveStudent(s.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 font-bold transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => setRejectStudentId(s.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40 font-bold transition"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Students Table */}
          {approvedStudents.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white font-heading mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Approved Students ({approvedStudents.length})
              </h2>
              <div className="glass-panel overflow-hidden border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-white/5 uppercase text-gray-400 font-semibold border-b border-white/10">
                      <tr>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">PRN</th>
                        <th className="p-3">Approved On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {approvedStudents.map(s => (
                        <tr key={s.id} className="hover:bg-white/5">
                          <td className="p-3 font-semibold text-white">{s.name} {s.surname}</td>
                          <td className="p-3 font-mono text-cyan-400">{s.email}</td>
                          <td className="p-3 font-mono">{s.prn}</td>
                          <td className="p-3 text-gray-400">{s.approvedAt ? new Date(s.approvedAt).toLocaleDateString() : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Delete Confirmation Dialog ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel p-6 max-w-sm w-full border-red-500/40 space-y-4">
            <div className="flex items-start gap-3">
              <Trash2 className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-white font-heading">Delete Event?</h3>
                <p className="text-xs text-gray-300 mt-1">
                  <strong className="text-white">"{deleteConfirm.title}"</strong> will be permanently removed.
                </p>
                {deleteConfirm.bookedCount > 0 && (
                  <div className="mt-3 flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>This event has <strong>{deleteConfirm.bookedCount} confirmed booking{deleteConfirm.bookedCount !== 1 ? 's' : ''}</strong>. All bookings will be cancelled automatically.</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary text-xs">Cancel</button>
              <button
                onClick={handleDeleteConfirmed}
                className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Yes, Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Student Dialog ── */}
      {rejectStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel p-6 max-w-sm w-full border-red-500/40 space-y-4">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" /> Reject Student Registration
            </h3>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Reason for rejection (optional):</label>
              <input
                type="text"
                placeholder="e.g. PRN does not match college records"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-red-400"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setRejectStudentId(null); setRejectReason(''); }} className="btn-secondary text-xs">Cancel</button>
              <button
                onClick={handleRejectStudent}
                className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" /> Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Event Modal ── */}
      {isCreateModalOpen && (
        <CreateEventModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      {/* ── Edit Event Modal ── */}
      {editingEvent && (
        <CreateEventModal
          existingEvent={editingEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
}
