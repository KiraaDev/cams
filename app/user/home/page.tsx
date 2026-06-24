import SignOutButton from '@/components/auth/sign-out-button';
import React from 'react';

// Mock data for the dashboard
const userProfile = {
  name: "Gomer Gaufo",
  barangay: "Barangay 56, Taysan",
  idNumber: "CAMS-2026-0892"
};

const stats = [
  { label: "Active Applications", value: "2", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Received Assistance", value: "5", color: "text-green-600", bg: "bg-green-50" },
  { label: "Pending Reviews", value: "1", color: "text-amber-600", bg: "bg-amber-50" },
];

const upcomingDistributions = [
  {
    id: 1,
    program: "Quarterly Rice Subsidies",
    date: "June 28, 2026",
    time: "8:00 AM - 12:00 PM",
    location: "Barangay 56 Covered Court",
    status: "Confirmed"
  },
  {
    id: 2,
    program: "Educational Financial Aid",
    date: "July 05, 2026",
    time: "1:00 PM - 4:00 PM",
    location: "Municipal Hall Lobby",
    status: "Requirements Needed"
  }
];

const availablePrograms = [
  {
    id: "P1",
    title: "Emergency Livelihood Support",
    description: "Financial and tool assistance for local micro-retailers and displaced workers.",
    deadline: "July 10, 2026",
    category: "Financial"
  },
  {
    id: "P2",
    title: "Health & Wellness Medical Mission",
    description: "Free maintenance medicine distribution and general check-ups for residents.",
    deadline: "Ongoing",
    category: "Healthcare"
  }
];

export default function UserHomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            C
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">CAMS</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{userProfile.name}</p>
            <p className="text-xs text-slate-500">{userProfile.barangay}</p>
          </div>
          <div className="h-10 w-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold border border-indigo-200">
            GG
          </div>
          <SignOutButton />
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-md">
          <span className="text-xs font-semibold tracking-wider bg-indigo-500/50 px-3 py-1 rounded-full uppercase">
            Beneficiary Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold mt-3 tracking-tight">
            Welcome back, {userProfile.name.split(' ')[0]}!
          </h1>
          <p className="text-indigo-100 mt-2 max-w-xl text-sm sm:text-base">
            Track your ongoing benefit applications, explore new community initiatives, and view distribution schedules seamlessly.
          </p>
          <div className="mt-4 pt-4 border-t border-indigo-500/40 flex flex-wrap gap-4 text-xs text-indigo-100">
            <p><strong>Household ID:</strong> {userProfile.idNumber}</p>
            <p><strong>Registered Area:</strong> {userProfile.barangay}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-sm font-medium text-slate-500">{stat.label}</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${stat.bg} ${stat.color}`}>
                  Updated
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Dynamic content split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Middle: Available Programs & Applications */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Section: Available Assistance Programs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Open Assistance Programs</h2>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">
                  View All Programs &rarr;
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availablePrograms.map((program) => (
                  <div key={program.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-indigo-300 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                          {program.category}
                        </span>
                        <span className="text-xs text-slate-400">ID: {program.id}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                        {program.description}
                      </p>
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs">
                        <p className="text-slate-400">Apply Before:</p>
                        <p className="font-semibold text-slate-700">{program.deadline}</p>
                      </div>
                      <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold transition">
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Side: Tracking & Schedules */}
          <div className="space-y-8">
            
            {/* Section: Upcoming Distributions */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4">Distribution Schedule</h2>
              <div className="space-y-4">
                {upcomingDistributions.map((dist) => (
                  <div key={dist.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    {/* Status bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${
                      dist.status === 'Confirmed' ? 'bg-green-500' : 'bg-amber-500'
                    }`} />
                    
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold text-slate-900 max-w-[70%]">{dist.program}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        dist.status === 'Confirmed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {dist.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 mt-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-900">Date:</span>
                        <span>{dist.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-900">Time:</span>
                        <span>{dist.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-900">Venue:</span>
                        <span className="truncate">{dist.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Support / Transparency Box */}
            <div className="bg-slate-900 text-slate-100 p-5 rounded-xl shadow-sm">
              <h3 className="text-sm font-bold text-white mb-2">Need Assistance or Found an Issue?</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                CAMS is dedicated to fair, clear, and efficient community aid. Reach out directly to your Barangay help desk if you run into any application issues.
              </p>
              <button className="w-full bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 py-2 rounded-lg text-xs font-semibold transition">
                Contact Barangay Desk
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}