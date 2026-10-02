import React from 'react';
import { GtfsStopTime } from '../../types/transit';
import { useTransit } from '../../context/TransitContext';
import { Train } from 'lucide-react';

interface RouteStopTimelineProps {
  stops: GtfsStopTime[];
  routeNumber: string;
  routeName: string;
  onViewStopOnMap?: (stop: GtfsStopTime) => void;
}

export const RouteStopTimeline: React.FC<RouteStopTimelineProps> = ({
  stops,
  routeNumber,
}) => {
  const { selectStopById } = useTransit();

  if (!stops || stops.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 text-xs">
        No stops found for this route.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
        ROUTE STOPS ({stops.length})
      </div>

      <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
        {stops.map((stopItem, index) => {
          const isFirst = index === 0;
          const isLast = index === stops.length - 1;
          const numStr = String(index + 1).padStart(2, '0');
          const metro = (stopItem as any).metroConnection;

          return (
            <div
              key={`${stopItem.stop_id}-${index}`}
              onClick={() => selectStopById(stopItem.stop_id)}
              className="py-3 px-1 flex items-center justify-between hover:bg-gray-50 cursor-pointer min-h-[44px] transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* 01 Numbered row */}
                <span className="text-xs font-mono font-semibold text-gray-400 w-6 tabular-nums">
                  {numStr}
                </span>

                {/* Dot indicator: Orange for start/end, Gray for intermediate */}
                <div className="w-3 flex items-center justify-center">
                  {isFirst || isLast ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-600 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
                  )}
                </div>

                {/* Stop name */}
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {stopItem.stop_name}
                  </div>
                  {metro && (
                    <div className="text-[11px] text-orange-600 flex items-center gap-1 mt-0.5">
                      <Train className="w-3 h-3" />
                      <span>Metro: {metro.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Terminal Label if start or end */}
              {isFirst && (
                <span className="text-[11px] font-semibold text-orange-600 px-2 py-0.5 rounded bg-orange-50">
                  Start
                </span>
              )}
              {isLast && (
                <span className="text-[11px] font-semibold text-orange-600 px-2 py-0.5 rounded bg-orange-50">
                  End
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
