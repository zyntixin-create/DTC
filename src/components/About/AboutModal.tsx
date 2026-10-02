import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { Info, X, Shield, ExternalLink, Check } from 'lucide-react';

export const AboutModal: React.FC = () => {
  const { aboutModalOpen, setAboutModalOpen, meta } = useTransit();

  if (!aboutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-base text-gray-900">About Delhi Yatra</h3>
          </div>
          <button
            onClick={() => setAboutModalOpen(false)}
            className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs text-gray-600 leading-relaxed bg-white">
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-orange-600" />
              <span>Official Open Transit Data (OTD) Source</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Route and stop data sourced from official Delhi Open Transit Data (OTD). Covers {meta?.routesCount || '2,900+'} bus routes, {meta?.stopsCount || '6,300+'} stops, and Delhi Metro lines.
            </p>
          </div>

          <p className="text-gray-700">
            <strong>Delhi Yatra</strong> is a clean, simple, mobile-first public transport route planner for Delhi NCR commuters.
          </p>

          <div className="space-y-2 pt-1">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span>Search any bus number (e.g. 623, 534, 729) to see full ordered stops and reverse journey.</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span>Journey Planner provides direct bus connections and verified 1-transfer connecting trips.</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span>Integration between DTC / Cluster bus stops and Delhi Metro interchange stations.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
