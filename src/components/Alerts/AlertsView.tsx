import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { AlertCircle } from 'lucide-react';

export const AlertsView: React.FC = () => {
  const { selectRouteById } = useTransit();

  const alerts = [
    {
      id: 'up-1',
      type: 'Route Diversion',
      routeNumber: '740',
      title: 'Ashram Chowk Drainage Work Diversion',
      timeAgo: 'Updated 10 min ago',
      description: 'Buses towards Sarai Kale Khan are diverted via Ring Road bypass. Expect 10-15 minute delays during peak transit hours.',
    },
    {
      id: 'up-2',
      type: 'Terminal Update',
      routeNumber: '721',
      title: 'Anand Vihar Platform Bay Shift',
      timeAgo: 'Updated 45 min ago',
      description: 'City bus bays for route 721 have temporarily shifted to Bay 5 adjacent to the Pink Line Metro concourse.',
    },
    {
      id: 'up-3',
      type: 'Road Maintenance',
      routeNumber: '502',
      title: 'Dhaula Kuan ARSD Underpass Restriction',
      timeAgo: 'Updated 2 hours ago',
      description: 'Single lane restriction in effect for scheduled culvert repairs. Normal speeds resumed on main carriageway.',
    },
  ];

  return (
    <div className="max-w-[640px] mx-auto pb-12">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Service Alerts
        </h1>
        <p className="text-xs text-gray-500">
          Active route diversions, terminal changes, and notices
        </p>
      </div>

      <div className="divide-y divide-gray-100 border-t border-b border-gray-100 bg-white">
        {alerts.map((a) => (
          <div key={a.id} className="py-4 px-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                Bus {a.routeNumber}
              </span>
              <span className="text-xs font-semibold text-gray-500">
                {a.type} • {a.timeAgo}
              </span>
            </div>
            <div className="text-sm font-semibold text-gray-900 pt-0.5">
              {a.title}
            </div>
            <div className="text-xs text-gray-600 leading-relaxed">
              {a.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
