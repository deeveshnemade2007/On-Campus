import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Crown, 
  Building2, 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Search, 
  Layers,
  Sparkles,
  BarChart3,
  Award
} from 'lucide-react';
import EventCard from '../components/EventCard';

export default function DirectorDashboard({ onSelectEvent }) {
  const { events, departments, coordinators, bookings } = usePortal();
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate high level metrics
  const totalEvents = events.length;
  const publishedEvents = events.filter(e => e.status === 'published').length;
  const pendingEvents = events.filter(e => e.status === 'pending_verification').length;
  const totalSlotsBooked = events.reduce((acc, curr) => acc + (curr.bookedSlots || 0), 0);
  const totalSlotsAvailable = events.reduce((acc, curr) => acc + (curr.totalSlots || 0), 0);
  const occupancyPercentage = totalSlotsAvailable > 0 ? Math.round((totalSlotsBooked / totalSlotsAvailable) * 100) : 0;

  // Filter events
  const filteredEvents = events.filter(e => {
    const matchesDept = selectedDeptFilter === 'all' || e.departmentId === selectedDeptFilter;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

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

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 flex items-center gap-4 border-cyan-500/30">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xl border border-cyan-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-medium">Departments Monitored</span>
            <strong className="text-2xl font-extrabold text-white font-heading">8 Portals</strong>
            <span className="text-[11px] text-cyan-400 block">100% Operational</span>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center gap-4 border-indigo-500/30">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xl border border-indigo-500/30">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-medium">Total College Events</span>
            <strong className="text-2xl font-extrabold text-white font-heading">{totalEvents}</strong>
            <span className="text-[11px] text-emerald-400 block">{publishedEvents} Live Published</span>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center gap-4 border-purple-500/30">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xl border border-purple-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-medium">Total Student Bookings</span>
            <strong className="text-2xl font-extrabold text-white font-heading">{totalSlotsBooked}</strong>
            <span className="text-[11px] text-purple-300 block">{occupancyPercentage}% Total Occupancy</span>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center gap-4 border-amber-500/30">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-medium">HOD Review Queue</span>
            <strong className="text-2xl font-extrabold text-amber-300 font-heading">{pendingEvents}</strong>
            <span className="text-[11px] text-gray-400 block">Awaiting Verification</span>
          </div>
        </div>

      </div>

      {/* 8 Department Breakdown Leaderboard */}
      <div className="glass-panel p-6 border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Department Activity & Progress Matrix
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Real-time status of all 8 engineering department portals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept) => {
            const deptEvents = events.filter(e => e.departmentId === dept.id);
            const deptBookings = deptEvents.reduce((acc, curr) => acc + curr.bookedSlots, 0);
            const deptPublished = deptEvents.filter(e => e.status === 'published').length;

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
                    {deptPublished} Events Live
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
                    <span className="text-cyan-300 font-bold">{deptBookings}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cross-Department Events Feed Filter & Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <h2 className="text-xl font-bold text-white font-heading">Audit College Events List</h2>
            <p className="text-xs text-gray-400">Inspecting all events submitted across departments</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Bar */}
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

            {/* Dept Filter */}
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

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="glass-panel p-12 text-center text-gray-400">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-cyan-400" />
            <p className="text-sm font-semibold">No events matching filter standard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelectEvent={onSelectEvent}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
