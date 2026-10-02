import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { AlertCircle, ChevronRight } from 'lucide-react';

export const ServiceAlertsSection: React.FC = () => {
  const { setActiveTab } = useTransit();

  const alerts = [
    {
      id: 'up-1',
      route: '740',
      title: 'Ashram Chowk Underpass Diversion',
      detail: 'Buses operating via Ring Road bypass due to stormwater repairs.'
    },
    {
      id: 'up-2',
      route: '721',
      title: 'Anand Vihar ISBT Bay Shift',
      detail: 'Departures shifted to Platform 5 near Metro Pink Line.'
    }
  ];

  return (
    <section className="max-w-[640px] mx-auto mb-8">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          Service Alerts
        </h2>
        <button
          onClick={() => setActiveTab('alerts')}
          className="text-xs text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
        >
          View all →
        </button>
      </div>

      <div className="divide-y divide-gray-100 border-t border-b border-gray-100 bg-white">
        {alerts.map((a) => (
          <div
            key={a.id}
            onClick={() => setActiveTab('alerts')}
            className="py-3 px-1 flex items-start justify-between hover:bg-gray-50 cursor-pointer min-h-[44px] transition-colors"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <span>{a.title}</span>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded">
                    Bus {a.route}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{a.detail}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
          </div>
        ))}
      </div>
    </section>
  );
};
