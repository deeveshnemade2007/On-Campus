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

  // ── Events: stored in localStorage so coordinator edits persist on same device
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('oncampus_events_v3');
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

  // ── Student Accounts: registration + approval system
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('oncampus_students_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // ── Currently logged-in student profile (set on login)
  const [studentProfile, setStudentProfile] = useState(() => {
    const saved = localStorage.getItem('oncampus_student_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // ── Director remarks
  const [directorRemarks, setDirectorRemarks] = useState(() => {
    const saved = localStorage.getItem('oncampus_director_remarks');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => { localStorage.setItem('oncampus_auth', isAuthenticated ? 'true' : 'false'); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem('oncampus_role', currentRole); }, [currentRole]);
  useEffect(() => { localStorage.setItem('oncampus_dept', activeDepartmentId); }, [activeDepartmentId]);
  useEffect(() => { localStorage.setItem('oncampus_events_v3', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('oncampus_coordinators_v2', JSON.stringify(coordinators)); }, [coordinators]);
  useEffect(() => { localStorage.setItem('oncampus_bookings_v2', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('oncampus_students_v1', JSON.stringify(students)); }, [students]);
  useEffect(() => {
    if (studentProfile) localStorage.setItem('oncampus_student_profile', JSON.stringify(studentProfile));
    else localStorage.removeItem('oncampus_student_profile');
  }, [studentProfile]);
  useEffect(() => { localStorage.setItem('oncampus_director_remarks', JSON.stringify(directorRemarks)); }, [directorRemarks]);

  const activeDepartment = DEPARTMENTS.find(d => d.id === activeDepartmentId) || DEPARTMENTS[0];

  // ─────────────────────────────────────────────
  // STUDENT REGISTRATION
  // ─────────────────────────────────────────────
  const registerStudent = (formData) => {
    // Check email format: name.surname@nmiet.edu.in
    const emailRegex = /^[a-z]+\.[a-z]+@nmiet\.edu\.in$/i;
    if (!emailRegex.test(formData.email)) {
      return { success: false, message: 'Email must be in format: name.surname@nmiet.edu.in' };
    }
    // Check PRN uniqueness
    const existingPRN = students.find(s => s.prn === formData.prn);
    if (existingPRN) {
      return { success: false, message: 'A student with this PRN is already registered.' };
    }
    // Check email uniqueness
    const existingEmail = students.find(s => s.email.toLowerCase() === formData.email.toLowerCase());
    if (existingEmail) {
      return { success: false, message: 'This email is already registered.' };
    }

    const student = {
      id: 'stu-' + Date.now().toString().slice(-8),
      name: formData.name,
      surname: formData.surname,
      email: formData.email.toLowerCase(),
      prn: formData.prn,
      departmentId: formData.departmentId,
      password: formData.password, // In production: hashed — here stored plain for demo
      status: 'pending', // 'pending' | 'approved' | 'rejected'
      registeredAt: new Date().toISOString(),
      approvedAt: null,
      rejectedReason: '',
    };
    setStudents(prev => [student, ...prev]);
    return { success: true, student };
  };

  // Coordinator approves a student registration
  const approveStudent = (studentId) => {
    setStudents(prev => prev.map(s =>
      s.id === studentId
        ? { ...s, status: 'approved', approvedAt: new Date().toISOString() }
        : s
    ));
  };

  // Coordinator rejects a student registration
  const rejectStudent = (studentId, reason = 'Application rejected by coordinator.') => {
    setStudents(prev => prev.map(s =>
      s.id === studentId
        ? { ...s, status: 'rejected', rejectedReason: reason }
        : s
    ));
  };

  // Student login — checks approved students list
  const loginStudent = (email, password) => {
    const student = students.find(
      s => s.email.toLowerCase() === email.toLowerCase() && s.password === password
    );
    if (!student) return { success: false, message: 'Invalid email or password.' };
    if (student.status === 'pending') {
      return { success: false, message: 'Your registration is pending coordinator approval. Please wait.' };
    }
    if (student.status === 'rejected') {
      return { success: false, message: `Your registration was rejected. Reason: ${student.rejectedReason || 'Contact your coordinator.'}` };
    }
    // approved
    setStudentProfile({
      id: student.id,
      name: `${student.name} ${student.surname}`,
      prn: student.prn,
      email: student.email,
      departmentId: student.departmentId,
    });
    return { success: true, student };
  };

  // ─────────────────────────────────────────────
  // EVENT MANAGEMENT
  // ─────────────────────────────────────────────

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

  // 2. Edit/Update Event (Coordinator or HOD)
  const updateEvent = (eventId, updatedData, byHod = false) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      const tags = typeof updatedData.tagsStr === 'string'
        ? updatedData.tagsStr.split(',').map(t => t.trim()).filter(Boolean)
        : (updatedData.tags || e.tags);

      if (byHod) {
        // HOD edits: keep status as-is, just update fields
        return {
          ...e,
          ...updatedData,
          tags,
          timeSlots: updatedData.time ? [updatedData.time] : e.timeSlots,
          totalSlots: parseInt(updatedData.totalSlots, 10) || e.totalSlots,
        };
      } else {
        // Coordinator edits: re-submit for HOD approval if was published/rejected
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
      }
    }));
  };

  // 3. Delete Event (Coordinator)
  const deleteEvent = (eventId) => {
    setBookings(prev => prev.map(b =>
      b.eventId === eventId ? { ...b, status: 'Cancelled' } : b
    ));
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  // 4. Approve Event (HOD)
  const approveEvent = (eventId, remark = '') => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          status: 'published',
          hodRemark: remark || `Approved by HOD ${activeDepartment.hodName}.`,
          verifiedAt: new Date().toISOString()
        };
      }
      return e;
    }));
  };

  // 5. Reject Event (HOD)
  const rejectEvent = (eventId, remark = 'Changes requested. Please update schedule/venue.') => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, status: 'rejected', hodRemark: remark, verifiedAt: new Date().toISOString() };
      }
      return e;
    }));
  };

  // 6. Book Slot (Student)
  const bookSlot = (eventId, selectedTimeSlot) => {
    if (!studentProfile) return { success: false, message: 'You must be logged in as a student.' };
    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) return { success: false, message: 'Event not found' };

    if (targetEvent.bookedSlots >= targetEvent.totalSlots) {
      return { success: false, message: 'All slots for this event are fully booked!' };
    }

    const existing = bookings.find(b =>
      b.eventId === eventId && b.studentEmail === studentProfile.email && b.status === 'Confirmed'
    );
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

  // 9. Director Remark on an event
  const addDirectorRemark = (eventId, remark) => {
    setDirectorRemarks(prev => ({
      ...prev,
      [eventId]: { text: remark, addedAt: new Date().toISOString() }
    }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setStudentProfile(null);
  };

  return (
    <PortalContext.Provider value={{
      isAuthenticated, setIsAuthenticated, logout,
      currentRole, setCurrentRole,
      activeDepartmentId, setActiveDepartmentId,
      activeDepartment,
      departments: DEPARTMENTS,
      events, coordinators, bookings,
      students, registerStudent, approveStudent, rejectStudent, loginStudent,
      studentProfile, setStudentProfile,
      addEvent, updateEvent, deleteEvent,
      approveEvent, rejectEvent,
      bookSlot, cancelBooking,
      approveCoordinator,
      directorRemarks, addDirectorRemark,
      collegeInfo: COLLEGE_INFO
    }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => useContext(PortalContext);
