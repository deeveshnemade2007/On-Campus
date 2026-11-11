import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  Crown,
  Building2,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  BarChart3,
  Award,
  MessageSquare,
  X,
  Send,
  Info,
} from 'lucide-react';

export default function DirectorDashboard() {
  const { events, departments, bookings, directorRemarks, addDirectorRemark } = usePortal();

  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [remarkEventId, setRemarkEventId] = useState(null);
  const [remarkText, setRemarkText] = useState('');
  const [detailEvent, setDetailEvent] = useState(null);

  const totalEvents          = events.length;
  const publishedCount       = events.filter(e => e.status === 'published').length;
  const pendingCount         = events.filter(e => e.status === 'pending_verification').length;
  const totalSlotsBooked     = events.reduce((acc, curr) => acc + (curr.bookedSlots || 0), 0);
  const totalSlotsAvailable  = events.reduce((acc, curr) => acc + (curr.totalSlots || 0), 0);
  const occupancyPct         = totalSlotsAvailable > 0 ? Math.round((totalSlotsBooked / totalSlotsAvailable) * 100) : 0;

  const filteredEvents = events.filter(e => {
    const matchesDept   = selectedDeptFilter === 'all' || e.departmentId === selectedDeptFilter;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleSaveRemark = () => {
    if (remarkEventId && remarkText.trim()) {
      addDirectorRemark(remarkEventId, remarkText.trim());
      setRemarkEventId(null);
      setRemarkText('');
    }
  };

  const statusBadge = (status) => {
    if (status === 'published')   return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">Live</span>;
    if (status === 'rejected')    return <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">Rejected</span>;
    return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">Pending</span>;
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden border-amber-500/30">
        <div className="absolute -right-10 -bottom-10 opacity-10 text-amber-400">
          <Crown className="w-80 h-80" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Crown className="w-4 h-4" /> College Executive Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Director Overview & Department Progress
          </h1>
          <p className="text-sm text-gray-300 mt-2 leading-relaxed">
            Monitor real-time event analytics, slot booking utilization, and department performance metrics across all 8 engineering departments.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 flex items-center gap-4 border-cyan-500/30">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-medium">Departments Monitored</span>
            <strong className="text-2xl font-extrabold text-white font-heading">8 Portals</strong>
            <span className="text-[11px] text-cyan-400 block">100% Operational</span>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center gap-4 border-indigo-500/30">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-medium">Total College Events</span>
            <strong className="text-2xl font-extrabold text-white font-heading">{totalEvents}</strong>
            <span className="text-[11px] text-emerald-400 block">{publishedCount} Live Published</span>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center gap-4 border-purple-500/30">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-medium">Total Student Bookings</span>
            <strong className="text-2xl font-extrabold text-white font-heading">{totalSlotsBooked}</strong>
            <span className="text-[11px] text-purple-300 block">{occupancyPct}% Total Occupancy</span>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center gap-4 border-amber-500/30">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-medium">HOD Review Queue</span>
            <strong className="text-2xl font-extrabold text-amber-300 font-heading">{pendingCount}</strong>
            <span className="text-[11px] text-gray-400 block">Awaiting Verification</span>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="glass-panel p-6 border-white/10">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> Department Activity & Progress Matrix
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Real-time status of all 8 engineering department portals</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept) => {
            const deptEvts    = events.filter(e => e.departmentId === dept.id);
            const deptBooked  = deptEvts.reduce((acc, curr) => acc + curr.bookedSlots, 0);
            const deptPublish = deptEvts.filter(e => e.status === 'published').length;
            return (
              <div
                key={dept.id}
                onClick={() => setSelectedDeptFilter(dept.id)}
                className={`p-4 rounded-xl border transition cursor-pointer ${
                  selectedDeptFilter === dept.id
                    ? 'bg-white/15 border-cyan-400/60 shadow-lg shadow-cyan-500/10'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-cyan-400 font-heading">{dept.shortName}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/10 text-gray-300">
                    {deptPublish} Live
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white truncate mb-2">{dept.name}</h4>
                <div className="text-[11px] text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>HOD:</span>
                    <span className="text-gray-200">{dept.hodName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Slots Reserved:</span>
                    <span className="text-cyan-300 font-bold">{deptBooked}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Events Audit List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">Audit College Events List</h2>
            <p className="text-xs text-gray-400">View details & post Director remarks on any event</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search event title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-400"
              />
            </div>
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="all">All 8 Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.shortName} - {d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="glass-panel p-12 text-center text-gray-400">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-cyan-400" />
            <p className="text-sm font-semibold">No events matching filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((evt) => {
              const dirRemark = directorRemarks?.[evt.id];
              const isDetailOpen = detailEvent?.id === evt.id;
              return (
                <div key={evt.id} className="glass-panel border-white/10 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {statusBadge(evt.status)}
                        <span className="text-[10px] text-gray-400 border border-white/10 rounded-full px-2 py-0.5">{evt.departmentName}</span>
                        <span className="text-[10px] text-gray-500">{evt.category}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white font-heading truncate">{evt.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {evt.date} · {evt.venue} ·
                        <span className="text-cyan-400 font-semibold ml-1">{evt.bookedSlots}/{evt.totalSlots} slots</span>
                      </p>
                      {dirRemark && (
                        <p className="text-xs text-amber-300 mt-1 flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          <span><strong>Director Remark:</strong> {dirRemark.text}</span>
                        </p>
                      )}
                    </div>

                    {/* Action Buttons: Details + Remark only */}
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button
                        onClick={() => setDetailEvent(isDetailOpen ? null : evt)}
                        className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-colors font-semibold ${
                          isDetailOpen
                            ? 'bg-indigo-500/30 text-indigo-200 border-indigo-500/50'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        <Info className="w-3.5 h-3.5" /> Details
                      </button>
                      <button
                        onClick={() => { setRemarkEventId(evt.id); setRemarkText(dirRemark?.text || ''); }}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition-colors font-semibold"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> {dirRemark ? 'Edit Remark' : 'Add Remark'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isDetailOpen && (
                    <div className="border-t border-white/10 px-4 py-4 text-xs text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-gray-500 uppercase tracking-wider text-[10px]">Description</span>
                        <p className="mt-1 text-gray-200 leading-relaxed">{evt.description || '—'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 uppercase tracking-wider text-[10px]">Coordinator</span>
                        <p className="mt-1">{evt.coordinatorName || '—'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 uppercase tracking-wider text-[10px]">Time Slots</span>
                        <p className="mt-1">{evt.timeSlots?.join(', ') || evt.time || '—'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 uppercase tracking-wider text-[10px]">HOD Remark</span>
                        <p className={`mt-1 ${evt.status === 'rejected' ? 'text-red-300' : 'text-emerald-300'}`}>
                          {evt.hodRemark || '—'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 uppercase tracking-wider text-[10px]">Tags</span>
                        <p className="mt-1">{evt.tags?.join(', ') || '—'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 uppercase tracking-wider text-[10px]">Submitted</span>
                        <p className="mt-1">{evt.submittedAt ? new Date(evt.submittedAt).toLocaleString() : '—'}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Director Remark Dialog ── */}
      {remarkEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel p-6 max-w-md w-full border-amber-500/40 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-heading">Director Remark</h3>
              </div>
              <button onClick={() => setRemarkEventId(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Post an official Director remark on this event. It will be visible in the event audit log.
            </p>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Remark:</label>
              <textarea
                rows={3}
                placeholder="e.g. Great initiative by the CE department. Ensure proper security arrangements."
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setRemarkEventId(null)} className="btn-secondary text-xs">Cancel</button>
              <button
                onClick={handleSaveRemark}
                disabled={!remarkText.trim()}
                className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" /> Save Remark
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
