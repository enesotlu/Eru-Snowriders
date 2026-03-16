import React from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function AuthLayout({ children }) {
  return (
    <div className="flex h-screen text-slate-800 font-inter overflow-hidden relative bg-[#f8fafc]">
      
      {/* Sidebar - Desktop */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative z-10">
        <TopNavbar />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
