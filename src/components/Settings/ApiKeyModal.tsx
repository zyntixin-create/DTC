import React, { useState, useEffect } from 'react';
import { useTransit, isGoogleMapsKeyValid } from '../../context/TransitContext';
import { X, Key, ShieldCheck, AlertCircle, ExternalLink, RefreshCw, MapPin, Globe } from 'lucide-react';

export const ApiKeyModal: React.FC = () => {
  const {
    apiKeyModalOpen,
    setApiKeyModalOpen,
    otdApiKey,
    setOtdApiKey,
    googleMapsApiKey,
    setGoogleMapsApiKey,
    mapEngine,
    setMapEngine,
    realtimeStatus,
    refreshRealtime,
  } = useTransit();

  const [inputVal, setInputVal] = useState(otdApiKey || 'J4OzF11ovF04gixSVVezxcLl8MYGcV4f');
  const [googleKeyInput, setGoogleKeyInput] = useState(
    googleMapsApiKey || 'cb1_3yv6_1_2b7e1f1b7826e935e3854df5'
  );
  const [selectedEngine, setSelectedEngine] = useState<'google' | 'leaflet'>(mapEngine);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    if (apiKeyModalOpen) {
      setInputVal(otdApiKey || 'J4OzF11ovF04gixSVVezxcLl8MYGcV4f');
      setGoogleKeyInput(googleMapsApiKey || 'cb1_3yv6_1_2b7e1f1b7826e935e3854df5');
      setSelectedEngine(mapEngine);
    }
  }, [apiKeyModalOpen, otdApiKey, googleMapsApiKey, mapEngine]);

  if (!apiKeyModalOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setOtdApiKey(inputVal.trim());
    setGoogleMapsApiKey(googleKeyInput.trim());
    setMapEngine(selectedEngine);
    await refreshRealtime();
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleClear = async () => {
    setInputVal('');
    setOtdApiKey('');
    await refreshRealtime();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-[#E5EAF0] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header with Deep Blue */}
        <div className="bg-[#063B73] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0756A8] text-white flex items-center justify-center border border-white/20">
              <Key className="w-5 h-5 text-[#F47B20]" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">API & Map Engine Settings</h2>
              <p className="text-xs text-blue-200">Google Maps Platform & Delhi OTD</p>
            </div>
          </div>
          <button
            onClick={() => setApiKeyModalOpen(false)}
            className="text-blue-200 hover:text-white p-1 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              realtimeStatus.available
                ? 'bg-[#FFF1E6] border-[#F47B20]/40 text-[#172033]'
                : 'bg-[#F6F8FB] border-[#E5EAF0] text-[#172033]'
            }`}
          >
            <AlertCircle
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                realtimeStatus.available ? 'text-[#0756A8]' : 'text-[#F47B20]'
              }`}
            />
            <div className="text-xs leading-relaxed space-y-1">
              <div className="font-bold text-sm">
                {realtimeStatus.available ? 'Real-Time Tracking Active' : 'Live Bus Location Unavailable'}
              </div>
              <p className="text-[#64748B]">{realtimeStatus.message}</p>
              <p className="text-[11px] text-[#64748B]">
                Official OTD real-time vehicle-position API queries live DTC & DIMTS GPS fleet telemetry.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            {/* Preferred Map Engine */}
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-2">
                Primary Map Provider
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedEngine('google')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                    selectedEngine === 'google'
                      ? 'border-[#0756A8] bg-[#EBF1F7] text-[#0756A8] font-bold shadow-xs'
                      : 'border-[#E5EAF0] bg-[#F6F8FB] hover:border-slate-300 text-[#172033]'
                  }`}
                >
                  <Globe className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold">Google Maps</div>
                    <div className="text-[10px] text-[#64748B] font-normal">
                      Vector, Satellite & Terrain
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedEngine('leaflet')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                    selectedEngine === 'leaflet'
                      ? 'border-[#0756A8] bg-[#EBF1F7] text-[#0756A8] font-bold shadow-xs'
                      : 'border-[#E5EAF0] bg-[#F6F8FB] hover:border-slate-300 text-[#172033]'
                  }`}
                >
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold">Open Transit Map</div>
                    <div className="text-[10px] text-[#64748B] font-normal">
                      Carto & OSM Vector Tiles
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Google Maps API Key Field */}
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Google Maps API Key</span>
                {isGoogleMapsKeyValid(googleKeyInput) ? (
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Valid Format (AIza...)
                  </span>
                ) : (
                  <span className="text-[10px] font-normal text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Requires Google Cloud Key (AIza...)
                  </span>
                )}
              </label>
              <input
                type="password"
                value={googleKeyInput}
                onChange={(e) => setGoogleKeyInput(e.target.value)}
                placeholder="Enter Google Maps API key (AIzaSy...)"
                className="w-full px-4 py-2.5 bg-[#F6F8FB] border border-[#E5EAF0] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0756A8] focus:bg-white transition"
              />
              <p className="text-[11px] text-[#64748B] mt-1.5">
                Official Google Maps Platform keys begin with <code className="text-[#0756A8] bg-slate-100 px-1 py-0.5 rounded text-[10px]">AIza...</code> (from Google Cloud Console).
              </p>
            </div>

            {/* Delhi OTD API Key Field */}
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Delhi OTD API Key</span>
                <span className="text-[10px] font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Configured
                </span>
              </label>
              <input
                type="password"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter authorized OTD API key..."
                className="w-full px-4 py-2.5 bg-[#F6F8FB] border border-[#E5EAF0] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0756A8] focus:bg-white transition"
              />
              <p className="text-[11px] text-[#64748B] mt-1.5">
                Stored in your environment and used to query Delhi Open Transit Data live feeds.
              </p>
            </div>

            {savedMsg && (
              <div className="text-xs text-[#0756A8] bg-[#F6F8FB] p-2.5 rounded-lg border border-[#0756A8]/30 flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#0756A8]" /> Settings updated successfully!
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 px-4 bg-[#0756A8] hover:bg-[#063B73] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer min-h-[44px]"
              >
                {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                Save & Apply Settings
              </button>
              {otdApiKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2.5 border border-[#E5EAF0] hover:bg-[#F6F8FB] text-[#172033] font-semibold text-xs rounded-xl transition cursor-pointer min-h-[44px]"
                >
                  Clear OTD Key
                </button>
              )}
            </div>
          </form>

          {/* Info & Attribution */}
          <div className="pt-3 border-t border-[#E5EAF0] text-xs text-[#64748B] space-y-2">
            <div className="flex items-center justify-between">
              <span>Delhi Open Transit Data portal:</span>
              <a
                href="https://otd.delhi.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="text-[#0756A8] font-bold hover:underline inline-flex items-center gap-1"
              >
                otd.delhi.gov.in <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Google Maps integration uses the modern @vis.gl/react-google-maps SDK with AdvancedMarkerElement and Cloud styling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
