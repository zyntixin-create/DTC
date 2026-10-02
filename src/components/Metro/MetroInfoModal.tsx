import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { Train, X, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

interface MetroHub {
  name: string;
  lines: string;
  query: string;
  busConnections: string[];
}

const METRO_HUBS: MetroHub[] = [
  {
    name: 'Kashmere Gate ISBT & Metro',
    lines: 'Red, Yellow & Violet Lines (Triple Interchange)',
    query: 'Kashmere Gate',
    busConnections: ['108', '473', '901', 'TMS'],
  },
  {
    name: 'Anand Vihar ISBT & Metro',
    lines: 'Blue & Pink Lines',
    query: 'Anand Vihar',
    busConnections: ['740', '721', '543', '212'],
  },
  {
    name: 'Rajiv Chowk / Connaught Place',
    lines: 'Blue & Yellow Lines',
    query: 'Connaught Place',
    busConnections: ['740', '502', '620', '990'],
  },
  {
    name: 'Dhaula Kuan & South Campus',
    lines: 'Airport Express & Pink Line (Durgabai Deshmukh)',
    query: 'Dhaula Kuan',
    busConnections: ['502', '529', '588A', '711', 'TMS'],
  },
  {
    name: 'Hauz Khas Junction',
    lines: 'Yellow & Magenta Lines',
    query: 'Hauz Khas',
    busConnections: ['502', '511', '520'],
  },
  {
    name: 'Central Secretariat',
    lines: 'Yellow & Violet Lines',
    query: 'Central Secretariat',
    busConnections: ['522', '540', '620'],
  },
];

export const MetroInfoModal: React.FC = () => {
  const { metroModalOpen, setMetroModalOpen, selectStopById, setActiveTab } = useTransit();

  if (!metroModalOpen) return null;

  const handleHubClick = (query: string) => {
    setActiveTab('stops');
    setMetroModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="p-4 bg-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Train className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm">Delhi Metro & DTC Multi-Modal Interchanges</h3>
          </div>
          <button
            onClick={() => setMetroModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-900 leading-relaxed">
            DTC operates arterial and feeder bus networks intersecting major Delhi Metro lines across NCR.
            Seamless multi-modal tickets can be used via the <strong>One Delhi Common Mobility Card</strong> and National Common Mobility Card (NCMC).
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Key Multi-Modal Hubs ({METRO_HUBS.length})
            </h4>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {METRO_HUBS.map((hub) => (
                <div key={hub.name} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{hub.name}</div>
                    <div className="text-[11px] text-indigo-700 font-semibold mt-0.5">
                      Metro Lines: {hub.lines}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Key Connecting Buses: {hub.busConnections.join(', ')}
                    </div>
                  </div>

                  <button
                    onClick={() => handleHubClick(hub.query)}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    <span>View Stops</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
