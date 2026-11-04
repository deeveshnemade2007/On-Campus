import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEPARTMENTS, INITIAL_EVENTS, INITIAL_COORDINATORS, INITIAL_STUDENT_BOOKINGS, COLLEGE_INFO } from '../data/mockData';

const PortalContext = createContext();

export const PortalProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('oncampus_auth') === 'true';
  });

  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('oncampus_role') || 'student';
  });

  const [activeDepartmentId, setActiveDepartmentId] = useState(() => {
    return localStorage.getItem('oncampus_dept') || 'ce';
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('oncampus_events_v2');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [coordinators, setCoordinators] = useState(() => {
    const saved = localStorage.getItem('oncampus_coordinators_v2');
    return saved ? JSON.parse(saved) : INITIAL_COORDINATORS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('oncampus_bookings_v2');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_BOOKINGS;
  });

  const [studentProfile, setStudentProfile] = useState({
    name: 'Student User',
    prn: '2024NMIET01948',
    email: 'student@nmiet.edu.in',
    departmentId: 'ce'
  });

  useEffect(() => { localStorage.setItem('oncampus_auth', isAuthenticated ? 'true' : 'false'); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem('oncampus_role', currentRole); }, [currentRole]);
  useEffect(() => { localStorage.setItem('oncampus_dept', activeDepartmentId); }, [activeDepartmentId]);
  useEffect(() => { localStorage.setItem('oncampus_events_v2', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('oncampus_coordinators_v2', JSON.stringify(coordinators)); }, [coordinators]);
  useEffect(() => { localStorage.setItem('oncampus_bookings_v2', JSON.stringify(bookings)); }, [bookings]);

  const activeDepartment = DEPARTMENTS.find(d => d.id === activeDepartmentId) || DEPARTMENTS[0];

  // 1. Add Event (Coordinator)
  const addEvent = (newEventData) => {
    const dept = DEPARTMENTS.find(d => d.id === newEventData.departmentId);
    const event = {
      id: 'evt-' + Date.now().toString().slice(-6),
      ...newEventData,
      departmentName: dept ? dept.name : 'Engineering',
      bookedSlots: 0,
      status: 'pending_verification',
      submittedAt: new Date().toISOString(),
      hodRemark: '',
      verifiedAt: null
    };
    setEvents(prev => [event, ...prev]);
    return event;
  };

  // 2. Edit/Update Event (Coordinator) — re-submits for HOD approval if was published/rejected
  const updateEvent = (eventId, updatedData) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      const tags = typeof updatedData.tagsStr === 'string'
        ? updatedData.tagsStr.split(',').map(t => t.trim()).filter(Boolean)
        : (updatedData.tags || e.tags);
      const wasPublishedOrRejected = e.status === 'published' || e.status === 'rejected';
      return {
        ...e,
        ...updatedData,
        tags,
        timeSlots: updatedData.time ? [updatedData.time] : e.timeSlots,
        totalSlots: parseInt(updatedData.totalSlots, 10) || e.totalSlots,
        status: wasPublishedOrRejected ? 'pending_verification' : e.status,
        hodRemark: wasPublishedOrRejected ? '' : e.hodRemark,
        verifiedAt: wasPublishedOrRejected ? null : e.verifiedAt,
        submittedAt: wasPublishedOrRejected ? new Date().toISOString() : e.submittedAt,
      };
    }));
  };

  // 3. Delete Event (Coordinator) — also cancels all associated bookings
  const deleteEvent = (eventId) => {
    setBookings(prev => prev.map(b =>
      b.eventId === eventId ? { ...b, status: 'Cancelled' } : b
    ));
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  // 4. Approve Event (HOD)
  const approveEvent = (eventId, remark = `Approved by HOD ${activeDepartment.hodName}.`) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, status: 'published', hodRemark: remark, verifiedAt: new Date().toISOString() };
      }
      return e;
    }));
  };

  // 5. Reject Event (HOD)
  const rejectEvent = (eventId, remark = 'Requires changes.') => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, status: 'rejected', hodRemark: remark, verifiedAt: new Date().toISOString() };
      }
      return e;
    }));
  };

  // 6. Book Slot (Student)
  const bookSlot = (eventId, selectedTimeSlot) => {
    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) return { success: false, message: 'Event not found' };

    if (targetEvent.bookedSlots >= targetEvent.totalSlots) {
      return { success: false, message: 'All slots for this event are fully booked!' };
    }

    const existing = bookings.find(b => b.eventId === eventId && b.studentEmail === studentProfile.email && b.status === 'Confirmed');
    if (existing) {
      return { success: false, message: 'You have already booked a slot for this event!', booking: existing };
    }

    const bookingId = 'BKG-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: bookingId,
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      departmentName: targetEvent.departmentName,
      studentName: studentProfile.name,
      prn: studentProfile.prn,
      studentEmail: studentProfile.email,
      timeSlot: selectedTimeSlot || targetEvent.timeSlots?.[0] || targetEvent.time,
      bookedAt: new Date().toISOString(),
      status: 'Confirmed',
      qrValue: `NMIET-${bookingId}-${studentProfile.prn}-${targetEvent.id}`
    };

    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, bookedSlots: e.bookedSlots + 1 } : e));
    setBookings(prev => [newBooking, ...prev]);
    return { success: true, booking: newBooking };
  };

  // 7. Cancel Booking (Student)
  const cancelBooking = (bookingId) => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (!targetBooking) return;

    setEvents(prev => prev.map(e => {
      if (e.id === targetBooking.eventId && e.bookedSlots > 0) {
        return { ...e, bookedSlots: e.bookedSlots - 1 };
      }
      return e;
    }));

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
  };

  // 8. Approve Coordinator (HOD)
  const approveCoordinator = (coordId) => {
    setCoordinators(prev => prev.map(c => c.id === coordId ? { ...c, status: 'Approved' } : c));
  };

  const logout = () => { setIsAuthenticated(false); };

  const resetDemoData = () => {
    localStorage.removeItem('oncampus_events_v2');
    localStorage.removeItem('oncampus_coordinators_v2');
    localStorage.removeItem('oncampus_bookings_v2');
    setEvents([]);
    setCoordinators([]);
    setBookings([]);
  };

  return (
    <PortalContext.Provider value={{
      isAuthenticated, setIsAuthenticated, logout,
      currentRole, setCurrentRole,
      activeDepartmentId, setActiveDepartmentId,
      activeDepartment,
      departments: DEPARTMENTS,
      events, coordinators, bookings,
      studentProfile, setStudentProfile,
      addEvent, updateEvent, deleteEvent,
      approveEvent, rejectEvent,
      bookSlot, cancelBooking,
      approveCoordinator,
      resetDemoData,
      collegeInfo: COLLEGE_INFO
    }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => useContext(PortalContext);
