
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md border-b border-slate-200">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">Clutter-to-Clarity</h1>
            <p className="text-sm text-slate-500 hidden sm:block">AI-Powered Inventory & Item Finder</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
