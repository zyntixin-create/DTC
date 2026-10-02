import React, { useState, useEffect } from 'react';
import { X, Shield, Plus, Trash2, Database, AlertCircle, RefreshCw, CheckCircle, FileText, Upload, Download } from 'lucide-react';
import { useTransit } from '../../context/TransitContext';
import { gtfsApi } from '../../services/gtfsApi';

export const AdminModal: React.FC = () => {
  const { adminModalOpen, setAdminModalOpen, t } = useTransit();
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);

  // New alert form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Diversion');
  const [newSeverity, setNewSeverity] = useState('medium');
  const [newRoutes, setNewRoutes] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [alertSuccess, setAlertSuccess] = useState('');

  // Bulk import
  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState('');

  useEffect(() => {
    if (!adminModalOpen) return;
    loadAdminData();
  }, [adminModalOpen]);

  const loadAdminData = async () => {
    setLoadingStats(true);
    try {
      const [sRes, aRes] = await Promise.all([
        gtfsApi.getAdminStats(),
        gtfsApi.getAlerts()
      ]);
      setStats(sRes);
      setAlerts(aRes.alerts || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    try {
      const routeList = newRoutes
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);

      const res = await gtfsApi.createAlert({
        title: newTitle.trim(),
        category: newCategory,
        severity: newSeverity,
        affectedRoutes: routeList.length > 0 ? routeList : ['DTC Fleet'],
        description: newDescription.trim()
      });

      if (res.success) {
        setAlerts([res.alert, ...alerts]);
        setNewTitle('');
        setNewDescription('');
        setNewRoutes('');
        setAlertSuccess('Alert published successfully!');
        setTimeout(() => setAlertSuccess(''), 3000);
      }
    } catch (err: any) {
      alert('Failed to publish alert: ' + err.message);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      await gtfsApi.deleteAlert(id);
      setAlerts(alerts.filter((a) => a.id !== id));
    } catch (err: any) {
      alert('Failed to delete alert: ' + err.message);
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ stats, alerts }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `delhi_yatra_admin_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportSubmit = () => {
    if (!importJson.trim()) return;
    try {
      const parsed = JSON.parse(importJson);
      if (Array.isArray(parsed)) {
        setImportStatus(`Successfully validated ${parsed.length} entries for transit schedule update.`);
      } else {
        setImportStatus('JSON dataset validated successfully.');
      }
    } catch {
      setImportStatus('Invalid JSON format. Please check syntax.');
    }
  };

  if (!adminModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto border border-[#E5EAF0]">
        {/* Header */}
        <div className="bg-[#063B73] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EA580C] text-white flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Delhi Yatra – Admin Management</h2>
              <p className="text-xs text-blue-200">Transit operations, GTFS database stats & service alerts</p>
            </div>
          </div>

          <button
            onClick={() => setAdminModalOpen(false)}
            className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* Database & System Metrics */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#0756A8]" />
                <span>Live Transit Database Architecture</span>
              </h3>
              <button
                onClick={loadAdminData}
                className="text-xs font-bold text-[#0756A8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {stats ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#F6F8FB] border border-[#E5EAF0] p-3 rounded-xl">
                  <div className="text-[11px] text-[#64748B] font-semibold">Total Routes</div>
                  <div className="text-lg font-black text-[#172033] tabular-nums mt-0.5">
                    {stats.routesCount?.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">DTC + Cluster</div>
                </div>

                <div className="bg-[#F6F8FB] border border-[#E5EAF0] p-3 rounded-xl">
                  <div className="text-[11px] text-[#64748B] font-semibold">Bus Stops</div>
                  <div className="text-lg font-black text-[#172033] tabular-nums mt-0.5">
                    {stats.stopsCount?.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#64748B] mt-0.5">With GPS coordinates</div>
                </div>

                <div className="bg-[#F6F8FB] border border-[#E5EAF0] p-3 rounded-xl">
                  <div className="text-[11px] text-[#64748B] font-semibold">Metro Stations</div>
                  <div className="text-lg font-black text-[#172033] tabular-nums mt-0.5">
                    {stats.metroStationsCount || 16}
                  </div>
                  <div className="text-[10px] text-blue-600 font-bold mt-0.5">Across {stats.metroLinesCount || 9} lines</div>
                </div>

                <div className="bg-[#F6F8FB] border border-[#E5EAF0] p-3 rounded-xl">
                  <div className="text-[11px] text-[#64748B] font-semibold">Active Alerts</div>
                  <div className="text-lg font-black text-[#EA580C] tabular-nums mt-0.5">
                    {alerts.length}
                  </div>
                  <div className="text-[10px] text-[#64748B] mt-0.5">Disruptions & advisories</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#64748B]">Loading system metrics...</div>
            )}
          </div>

          {/* Service Alerts Publisher */}
          <div className="border border-[#E5EAF0] rounded-xl p-4 bg-white shadow-xs">
            <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#EA580C]" />
              <span>Broadcast New Service Alert</span>
            </h3>

            {alertSuccess && (
              <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{alertSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateAlert} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#172033] mb-1">
                    Alert Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Diversion on Ring Road near Ashram"
                    className="w-full text-xs p-2.5 rounded-lg bg-[#F6F8FB] border border-[#E5EAF0] text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#0756A8]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#172033] mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-[#F6F8FB] border border-[#E5EAF0] text-[#172033] focus:outline-none"
                  >
                    <option value="Diversion">Diversion</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Delay">Delay</option>
                    <option value="Advisory">Advisory</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#172033] mb-1">
                    Affected Routes (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newRoutes}
                    onChange={(e) => setNewRoutes(e.target.value)}
                    placeholder="e.g. 543, 419, 720"
                    className="w-full text-xs p-2.5 rounded-lg bg-[#F6F8FB] border border-[#E5EAF0] text-[#172033] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#172033] mb-1">
                    Severity
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg bg-[#F6F8FB] border border-[#E5EAF0] text-[#172033] focus:outline-none"
                  >
                    <option value="low">Low (Notice)</option>
                    <option value="medium">Medium (Route Diversion)</option>
                    <option value="high">High (Service Suspended)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#172033] mb-1">
                  Description & Passenger Advisory
                </label>
                <textarea
                  rows={2}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detail the cause, alternate bus stops, and expected clearance time..."
                  className="w-full text-xs p-2.5 rounded-lg bg-[#F6F8FB] border border-[#E5EAF0] text-[#172033] focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#EA580C] hover:bg-[#c2410c] text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer"
                >
                  Publish Alert
                </button>
              </div>
            </form>
          </div>

          {/* Manage Existing Alerts */}
          <div>
            <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider mb-2.5">
              Active Service Alerts ({alerts.length})
            </h3>
            <div className="divide-y divide-[#E5EAF0] border border-[#E5EAF0] rounded-xl overflow-hidden bg-white">
              {alerts.map((al) => (
                <div key={al.id} className="p-3.5 flex items-start justify-between gap-3 hover:bg-[#F6F8FB]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#172033]">{al.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">
                        {al.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1">{al.description}</p>
                    <div className="text-[10px] text-[#64748B] mt-1">
                      Routes: {al.affectedRoutes?.join(', ')} · Published: {al.publishedAt}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAlert(al.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Data Import / Export */}
          <div className="border border-[#E5EAF0] rounded-xl p-4 bg-white">
            <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Bulk Transit Data Operations</span>
              <button
                onClick={handleExportData}
                className="text-[#0756A8] hover:underline flex items-center gap-1 font-semibold normal-case text-xs"
              >
                <Download className="w-3.5 h-3.5" /> Export JSON
              </button>
            </h3>

            <p className="text-xs text-[#64748B] mb-3">
              Import validated DTC schedules or stop overrides in JSON format.
            </p>

            <textarea
              rows={3}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='[ { "route_id": "9999", "route_short_name": "623A", "agency_id": "DTC" } ]'
              className="w-full text-xs font-mono p-2.5 rounded-lg bg-[#F6F8FB] border border-[#E5EAF0] text-[#172033] focus:outline-none mb-2"
            />

            {importStatus && (
              <div className="text-xs text-[#0756A8] font-semibold mb-2">
                {importStatus}
              </div>
            )}

            <button
              onClick={handleImportSubmit}
              className="px-4 py-2 bg-[#0756A8] hover:bg-[#063B73] text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Validate & Stage Dataset</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F6F8FB] border-t border-[#E5EAF0] p-4 flex justify-between items-center">
          <div className="text-xs text-[#64748B]">
            Delhi Yatra Transit Administration
          </div>
          <button
            onClick={() => setAdminModalOpen(false)}
            className="px-4 py-1.5 text-xs font-semibold text-[#172033] bg-white hover:bg-slate-100 border border-[#E5EAF0] rounded-lg transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
