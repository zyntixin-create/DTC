import React from 'react';
import { useTransit } from '../context/TransitContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setAboutModalOpen, setAdminModalOpen } = useTransit();

  return (
    <footer className="bg-white text-gray-500 text-xs border-t border-gray-200 mt-12 py-8 pb-24 lg:pb-8">
      <div className="max-w-[1140px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-orange-600 text-sm">Delhi Yatra</span>
            <span>•</span>
            <span>Delhi DTC & Metro Transit Planner</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap justify-center">
            <button
              onClick={() => setActiveTab('routes')}
              className="hover:text-orange-600 cursor-pointer"
            >
              Bus Routes
            </button>
            <button
              onClick={() => setActiveTab('stops')}
              className="hover:text-orange-600 cursor-pointer"
            >
              Bus Stops
            </button>
            <button
              onClick={() => setActiveTab('metro')}
              className="hover:text-orange-600 cursor-pointer"
            >
              Delhi Metro
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className="hover:text-orange-600 cursor-pointer"
            >
              Journey Planner
            </button>
            <button
              onClick={() => setAboutModalOpen(true)}
              className="hover:text-orange-600 cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => setAdminModalOpen(true)}
              className="hover:text-orange-600 cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="mt-4 text-[11px] text-gray-400 text-center sm:text-left">
          Data sourced from official Delhi Open Transit Data (OTD). Independent transport planning guide.
        </div>
      </div>
    </footer>
  );
};
