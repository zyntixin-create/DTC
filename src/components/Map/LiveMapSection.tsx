import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { DelhiMap } from './DelhiMap';
import { Map as MapIcon, ChevronDown, ChevronUp } from 'lucide-react';

export const LiveMapSection: React.FC = () => {
  const { buses, selectedBus, setSelectedBus } = useTransit();
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <section className="max-w-[640px] lg:max-w-[1140px] mx-auto mb-8">
      {/* Header with simple [ Show Map ] / [ Hide Map ] button */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Delhi Transit Map
          </h2>
          <p className="text-xs text-gray-500">
            Explore routes, stops, and live vehicle positions
          </p>
        </div>

        {/* Primary toggle button */}
        <button
          onClick={() => setMapOpen(!mapOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 hover:border-orange-500 text-gray-800 hover:text-orange-600 transition-colors cursor-pointer min-h-[40px]"
        >
          <MapIcon className="w-4 h-4 text-orange-600" />
          <span>{mapOpen ? 'Hide Map' : 'Show Map'}</span>
          {mapOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Toggleable full-width Map */}
      {mapOpen && (
        <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs">
          <div className="h-[340px] sm:h-[420px] w-full relative">
            <DelhiMap heightClass="h-full w-full" onBusClick={(bus) => setSelectedBus(bus)} />
          </div>
          {selectedBus && (
            <div className="p-3 bg-white border-t border-gray-200 flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900">
                Selected: Bus {selectedBus.busNumber} ({selectedBus.origin} → {selectedBus.destination})
              </span>
              <span className="text-orange-600 font-semibold">{selectedBus.status} • ~{selectedBus.etaMin}m ETA</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
