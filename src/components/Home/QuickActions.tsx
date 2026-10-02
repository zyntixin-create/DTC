import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { Route as RouteIcon, MapPin, Train, Compass } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const { setActiveTab, setLocationModalOpen, t } = useTransit();

  const actions = [
    {
      id: 'routes',
      label: 'Bus Routes',
      icon: RouteIcon,
      onClick: () => setActiveTab('routes')
    },
    {
      id: 'stops',
      label: 'Bus Stops',
      icon: MapPin,
      onClick: () => setActiveTab('stops')
    },
    {
      id: 'metro',
      label: 'Metro',
      icon: Train,
      onClick: () => setActiveTab('metro')
    },
    {
      id: 'nearby',
      label: 'Nearby',
      icon: Compass,
      onClick: () => setLocationModalOpen(true)
    },
  ];

  return (
    <div className="max-w-[640px] mx-auto mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.onClick}
              className="flex items-center justify-center gap-2 p-2.5 bg-white border border-gray-200/90 hover:border-orange-500 rounded-xl text-gray-800 hover:text-orange-600 shadow-2xs hover:shadow-xs transition-all cursor-pointer min-h-[46px]"
            >
              <Icon className="w-4 h-4 text-orange-600 shrink-0 stroke-[2.2]" />
              <span className="text-xs sm:text-sm font-bold tracking-tight">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
