Features:
Create events
Edit event details
Submit events for HOD verification
Publish approved events
Update event information
Add event date and time
Set maximum participants
Manage available slots
View registered students
Monitor bookings
Manage event announcements
Important Rule

A coordinator cannot directly publish an event.

The event must first be:

Created → Submitted → Verified by HOD → Approved → Published

4. 🎓 Student Portal

The Student Portal is designed for normal college students.

Features:
Student registration/login
View department updates
View college events
View club activities
View upcoming functions
View event details
Enroll in events
Book event slots
View booking status
View registered events
Receive event announcements
Student Flow
Student Login
      ↓
Explore Events
      ↓
Select Event
      ↓
View Event Details
      ↓
Check Available Slots
      ↓
Book Slot
      ↓
Booking Confirmation
📅 Event & Slot Booking System

One of the main features of On Campus is the event slot booking system.

Each event can have:

Event Name
Department
Event Description
Event Date
Start Time
End Time
Venue
Coordinator
Maximum Capacity
Available Slots
Registration Deadline
Event Status
Example
-----------------------------------------
       TECHNICAL WORKSHOP
-----------------------------------------

Department: Electronics & Computer Engineering

Date: 15 October 2026
Time: 10:00 AM - 12:00 PM
Venue: Seminar Hall

Total Slots: 100
Available Slots: 63

[ BOOK SLOT ]
-----------------------------------------

Once all slots are booked:

        ❌ SLOTS FULL

Students cannot register once the maximum capacity has been reached.

🔐 Role-Based Access Control

The platform uses role-based access.

Role	View Updates	Manage Department	Create Event	Verify Event	Book Event
Director	✅	❌	❌	❌	❌
HOD	✅	✅	❌	✅	❌
Coordinator	✅	Limited	✅	❌	❌
Student	✅	❌	❌	❌	✅
🏢 Department-Level Access

Each department operates independently.

                    ON CAMPUS
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    Director           HODs         Students
                        │
        ┌───────────────┼───────────────┐
        │       │       │       │       │
       HOD     HOD     HOD     ...     HOD
        │
   Department Portal
        │
   Coordinator
        │
     Events
        │
     Students
        │
   Slot Booking
🔄 Complete Event Management Workflow
                  Coordinator
                       │
                       ▼
               Create New Event
                       │
                       ▼
                Submit to HOD
                       │
                       ▼
                 HOD Verification
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
           APPROVED           REJECTED
              │                 │
              ▼                 ▼
         Publish Event       Edit Event
              │
              ▼
         Student Portal
              │
              ▼
        Students View Event
              │
              ▼
          Enroll / Book
              │
              ▼
       Booking Confirmation
🌟 Key Features
👨‍💼 Director
College-wide monitoring
Department progress
Club activity monitoring
Event overview
Activity dashboard
👨‍🏫 HOD
Department management
Coordinator management
Event verification
Event approval/rejection
Student registration monitoring
👨‍💻 Coordinator
Event creation
Event updates
Event management
Slot management
Student registration tracking
🎓 Student
Event discovery
Department updates
Event registration
Slot booking
Booking history
📢 Updates & Announcements

Each department can publish updates related to:

Workshops
Seminars
Expert Sessions
Technical Events
Cultural Events
Competitions
Club Activities
Functions
Industrial Visits
Hackathons
Department Announcements

Students can view these updates from their Student Portal.

📊 Dashboard

Different users receive different dashboards.

Director Dashboard
-------------------------------------
          DIRECTOR DASHBOARD
-------------------------------------

Departments             8

Active Events           12

Upcoming Events         18

Active Clubs            15

Total Registrations     850

Department Progress
-------------------------------------
Computer Engineering       ████████
CSE                        ███████
CSE AI                     ██████
AI & DS                    ████████
Mechanical                 █████
E&TC                       ███████
IT                         ██████
E&CE                       ████████
-------------------------------------
HOD Dashboard

Displays information related only to the HOD's department.

Department Events
Pending Approvals
Approved Events
Rejected Events
Coordinators
Student Registrations
Slot Bookings
Department Updates
Coordinator Dashboard
My Events
Pending Verification
Approved Events
Rejected Events
Total Registrations
Available Slots
Student Dashboard
Upcoming Events
My Registrations
My Bookings
Department Updates
Club Activities
Available Events
🛡️ Security & Access Control

The platform should implement secure authentication and authorization.

Important security features include:

Role-based authentication
Secure login
Password protection
Department-level authorization
Protected dashboards
Session management
Input validation
Event approval workflow
Prevention of unauthorized department access

For example:

Computer Engineering HOD
          ↓
Can Access
          ↓
Computer Engineering Portal

          ❌

Cannot Access
          ↓
Mechanical Engineering Portal
          ↓
IT Portal
          ↓
CSE Portal
🧩 Proposed System Architecture
                         ON CAMPUS
                             │
              ┌──────────────┼──────────────┐
              │              │              │
          Director          HOD        Coordinator
              │              │              │
              └──────────────┼──────────────┘
                             │
                        Backend API
                             │
              ┌──────────────┼──────────────┐
              │              │              │
          Authentication   Events       Bookings
              │              │              │
              └──────────────┼──────────────┘
                             │
                         Database
                             │
                         Students
🛠️ Suggested Technology Stack
Frontend
React.js
HTML5
CSS3
JavaScript
Tailwind CSS / Bootstrap
Backend
Node.js
Express.js
Database
PostgreSQL / MySQL / MongoDB
Authentication
JWT Authentication
Role-Based Access Control (RBAC)
Deployment
Vercel – Frontend
Render / Railway – Backend
Neon / PostgreSQL – Database
📁 Suggested Project Structure
On-Campus/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── dashboards/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── README.md
├── package.json
└── .gitignore
🔑 Access Hierarchy
                    DIRECTOR
                       │
              Overall Monitoring
                       │
        ┌──────────────┴──────────────┐
        │                             │
       HODs                         Clubs
        │
 ┌──────┼──────┬──────┬──────┐
 │      │      │      │      │
 HOD   HOD    HOD    ...    HOD
 │
 Department Portal
 │
 Coordinator
 │
 Events & Updates
 │
 Students
 │
 Slot Booking
🎯 Project Goals

The major goals of On Campus are:

Create a centralized college information platform.
Digitize department event management.
Reduce manual event registration.
Provide an online slot booking system.
Improve communication between departments and students.
Provide controlled access to department portals.
Make event approval transparent.
Help students discover activities happening across the college.
Help management monitor department and club activities.
🚀 Future Enhancements

Future versions of On Campus can include:

📱 Mobile Application
🔔 Push Notifications
📧 Email Notifications
📲 SMS Notifications
🎫 Digital Event Pass
📊 Advanced Analytics
📈 Department Performance Reports
📅 Calendar Integration
🧾 Automatic Certificates
📷 QR Code Event Attendance
🔔 Real-Time Notifications
🏆 Event Feedback & Ratings
📊 Student Participation Analytics
🤖 AI-based Event Recommendations
💡 Why On Campus?

Traditional college event management often depends on:

Notice boards
WhatsApp groups
Manual registrations
Paper-based forms
Separate department announcements

On Campus brings these activities together into one centralized platform.

Departments
     +
Clubs
     +
Events
     +
Announcements
     +
Slot Booking
     +
Student Participation
     ↓
   ON CAMPUS
👨‍💻 Project Information

Project Name: On Campus

Project Type: College Management & Event Management Platform

Primary Users:

Director
HOD
Coordinator
Students

Department Portals: 8

Authentication Portals: 4

Core Modules:

Authentication
Department Management
Event Management
Event Verification
Announcements
Student Registration
Slot Booking
Dashboard
Role-Based Access Control
📌 Conclusion

On Campus is a centralized digital platform designed to simplify communication, event management, department activities, and student participation within a college.

With separate portals for 8 departments and dedicated access for Director, HOD, Coordinator, and Students, the platform provides a structured workflow where events can be created, verified, published, and booked online.

The goal is to create a single digital campus environment where students never miss important college activities and administrators can efficiently manage and monitor departmental events.

⭐ On Campus
One Platform. Every Department. Every Event. One Campus.