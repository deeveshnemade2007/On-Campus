import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Calendar, 
  Sparkles, 
  Ticket, 
  CheckCircle2, 
  Building2,
  Clock,
  Layers,
  Flame
} from 'lucide-react';
import EventCard from '../components/EventCard';
import TicketModal from '../components/TicketModal';
import confetti from 'canvas-confetti';

export default function StudentPortal({ activeTab, setActiveTab, onSelectEvent }) {
  const { 
    events, 
    departments, 
    bookings, 
    bookSlot, 
    studentProfile 
  } = usePortal();

  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTicket, setActiveTicket] = useState(null);

  // Filter only published events for student viewing
  const publishedEvents = events.filter(e => e.status === 'published');

  const filteredEvents = publishedEvents.filter(e => {
    const matchesDept = selectedDept === 'all' || e.departmentId === selectedDept;
    const matchesCategory = selectedCategory === 'all' || e.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesCategory && matchesSearch;
  });

  const categories = ['all', 'Workshop', 'Hackathon', 'Seminar', 'Competition', 'Exhibition'];

  const handleBookSlotClick = (event) => {
    const res = bookSlot(event.id);
    if (res.success) {
      // Trigger festive celebration confetti on successful booking
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setActiveTicket(res.booking);
    } else {
      if (res.booking) {
        setActiveTicket(res.booking);
      } else {
        alert(res.message);
      }
    }
  };

  // Student's personal bookings list
  const myConfirmedBookings = bookings.filter(b => b.studentEmail === studentProfile.email);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Student Navigation Mode */}
      {activeTab === 'my-bookings' ? (
        
        /* MY BOOKINGS TAB */
        <div className="space-y-6">
          <div className="glass-panel p-6 border-cyan-500/30 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Ticket className="w-4 h-4" /> Student Pass Wallet
              </div>
              <h1 className="text-2xl font-bold text-white font-heading">My Booked Event Slots</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Registered student: <strong className="text-white">{studentProfile.name}</strong> ({studentProfile.prn})
              </p>
            </div>

            <button
              onClick={() => setActiveTab('explore')}
              className="btn-secondary text-xs"
            >
              Back to All Events
            </button>
          </div>

          {myConfirmedBookings.length === 0 ? (
            <div className="glass-panel p-12 text-center text-gray-400">
              <Ticket className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-30" />
              <h3 className="text-base font-bold text-white mb-1">No Bookings Yet</h3>
              <p className="text-xs mb-4">You haven't reserved slots for any upcoming college events.</p>
              <button onClick={() => setActiveTab('explore')} className="btn-primary text-xs mx-auto">
                Explore Events & Book Slot
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myConfirmedBookings.map((b) => (
                <div 
                  key={b.id} 
                  className={`glass-panel p-6 border transition hover:border-cyan-400/50 flex flex-col justify-between ${
                    b.status === 'Confirmed' ? 'border-cyan-500/30' : 'border-rose-500/30 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-cyan-400 font-bold">{b.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-heading mb-1">{b.eventTitle}</h3>
                    <p className="text-xs text-gray-400 mb-3">{b.departmentName}</p>

                    <div className="bg-white/5 p-3 rounded-xl text-xs space-y-1 text-gray-300 mb-4">
                      <div><strong>Reserved Slot:</strong> {b.timeSlot}</div>
                      <div><strong>Student PRN:</strong> {b.prn}</div>
                    </div>
                  </div>

                  {b.status === 'Confirmed' && (
                    <button
                      onClick={() => setActiveTicket(b)}
                      className="btn-primary text-xs justify-center w-full py-2.5"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>View Digital Pass & QR</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      ) : (

        /* EXPLORE ALL EVENTS TAB */
        <>
          {/* Top Hero Banner */}
          <div className="glass-panel p-6 sm:p-10 relative overflow-hidden border-cyan-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/40">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" /> On Campus Student Hub
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading leading-tight">
                Discover College Events & Reserve Your Slot
              </h1>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                Explore hackathons, technical masterclasses, robotics competitions, and seminars held across all 8 engineering departments. Instant slot booking with digital venue entry pass.
              </p>
            </div>
          </div>

          {/* Department Filter Tabs (8 Portals) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" /> Filter by Department (8 Engineering Departments)
              </span>
              <span className="text-xs text-cyan-400 font-medium">
                {filteredEvents.length} Events Available
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedDept('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                  selectedDept === 'all'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                }`}
              >
                All 8 Departments
              </button>

              {departments.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDept(d.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
                    selectedDept === d.id
                      ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400 font-extrabold shadow-md'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="text-cyan-400">{d.shortName}</span>
                  <span className="opacity-80 font-normal">{d.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search event title, topics, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="glass-panel p-12 text-center text-gray-400">
              <Calendar className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-30" />
              <h3 className="text-base font-bold text-white mb-1">No Events Found</h3>
              <p className="text-xs">Try clearing search keywords or department filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  onSelectEvent={onSelectEvent}
                  onBookClick={() => handleBookSlotClick(evt)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Digital Pass Ticket Modal */}
      {activeTicket && (
        <TicketModal 
          booking={activeTicket} 
          onClose={() => setActiveTicket(null)} 
        />
      )}

    </div>
  );
}
