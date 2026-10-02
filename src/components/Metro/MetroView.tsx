import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { DELHI_METRO_LINES, DELHI_METRO_STATIONS } from '../../data/delhiMetroData';
import { Train, Search, ChevronRight } from 'lucide-react';

export const MetroView: React.FC = () => {
  const { openMetroStation, language } = useTransit();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLine, setSelectedLine] = useState('all');

  const filteredStations = DELHI_METRO_STATIONS.filter((st) => {
    const matchesLine = selectedLine === 'all' || st.lineIds.includes(selectedLine);
    const matchesSearch =
      !searchQuery.trim() ||
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.nameHindi.includes(searchQuery) ||
      st.lines.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLine && matchesSearch;
  });

  return (
    <div className="max-w-[640px] mx-auto pb-12">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Delhi Metro Network
        </h1>
        <p className="text-xs text-gray-500">
          Interchanges, connecting DTC bus routes, and first/last trains
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search metro station or line..."
          className="w-full pl-11 pr-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 min-h-[44px]"
        />
      </div>

      {/* Line filter horizontal scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 text-xs">
        <button
          onClick={() => setSelectedLine('all')}
          className={`px-3 py-1.5 rounded-lg border whitespace-nowrap cursor-pointer min-h-[36px] ${
            selectedLine === 'all'
              ? 'bg-orange-50 border-orange-500 text-orange-600 font-bold'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          All Lines
        </button>
        {DELHI_METRO_LINES.map((line) => (
          <button
            key={line.id}
            onClick={() => setSelectedLine(line.id)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap cursor-pointer min-h-[36px] ${
              selectedLine === line.id
                ? 'bg-orange-50 border-orange-500 text-orange-600 font-bold'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            {line.name}
          </button>
        ))}
      </div>

      {/* Stations List */}
      <div className="divide-y divide-gray-100 border-t border-b border-gray-100 bg-white">
        {filteredStations.map((st) => (
          <div
            key={st.id}
            onClick={() => openMetroStation(st.id)}
            className="py-3.5 px-1 flex items-center justify-between hover:bg-gray-50 cursor-pointer min-h-[44px] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Train className="w-5 h-5 text-orange-600 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {language === 'hi' ? st.nameHindi : st.name}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  {st.lines.join(' · ')}
                  {st.isInterchange && (
                    <span className="text-orange-600 font-semibold ml-2">• Interchange</span>
                  )}
                </div>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};
