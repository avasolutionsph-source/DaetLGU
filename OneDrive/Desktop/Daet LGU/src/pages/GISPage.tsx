import { useState } from 'react';
import {
  Map,
  MapPin,
  Layers,
  Navigation,
  ZoomIn,
  ZoomOut,
  Building2,
  Home,
  HardHat,
  AlertTriangle,
  Shield,
  Compass,
  Flame,
  Droplets,
  Mountain,
  Eye,
  EyeOff,
  Info,
  BarChart3,
  Users,
  Maximize2,
  Crosshair,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

interface LayerConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  count: number;
  color: string;
  enabled: boolean;
}

interface RiskZone {
  type: string;
  icon: React.ElementType;
  severity: 'High' | 'Moderate' | 'Low';
  color: string;
  bgColor: string;
  borderColor: string;
  barangays: string[];
}

interface MapPinData {
  id: number;
  top: string;
  left: string;
  color: string;
  label: string;
  type: string;
}

const MOCK_PINS: MapPinData[] = [
  { id: 1, top: '20%', left: '30%', color: 'text-blue-500', label: 'Municipal Hall', type: 'government' },
  { id: 2, top: '35%', left: '55%', color: 'text-red-500', label: 'Daet Public Market', type: 'business' },
  { id: 3, top: '50%', left: '40%', color: 'text-green-500', label: 'Daet Central School', type: 'infrastructure' },
  { id: 4, top: '25%', left: '70%', color: 'text-amber-500', label: 'Flood Monitoring Station', type: 'risk' },
  { id: 5, top: '60%', left: '25%', color: 'text-purple-500', label: 'Health Center', type: 'government' },
  { id: 6, top: '45%', left: '65%', color: 'text-blue-500', label: 'Bagasbas Beach Resort', type: 'business' },
  { id: 7, top: '70%', left: '50%', color: 'text-red-500', label: 'Fire Station', type: 'emergency' },
  { id: 8, top: '30%', left: '15%', color: 'text-green-500', label: 'Brgy. Borabod Hall', type: 'government' },
  { id: 9, top: '55%', left: '80%', color: 'text-amber-500', label: 'Evacuation Center', type: 'emergency' },
  { id: 10, top: '75%', left: '35%', color: 'text-purple-500', label: 'Water Treatment Plant', type: 'infrastructure' },
];

const RISK_ZONES: RiskZone[] = [
  {
    type: 'Flood-Prone Areas',
    icon: Droplets,
    severity: 'High',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    barangays: ['Borabod', 'Lag-on', 'Gahonon', 'Mancruz'],
  },
  {
    type: 'Landslide-Prone Areas',
    icon: Mountain,
    severity: 'Moderate',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    barangays: ['Bagasbas', 'Calasgasan', 'Pamorangon'],
  },
  {
    type: 'Fire-Prone Areas',
    icon: Flame,
    severity: 'High',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    barangays: ['Poblacion', 'Alawihao', 'Bibirao'],
  },
];

const BARANGAY_DENSITY = [
  { name: 'Poblacion', properties: 542, businesses: 218, density: 92 },
  { name: 'Borabod', properties: 487, businesses: 156, density: 78 },
  { name: 'Alawihao', properties: 398, businesses: 134, density: 71 },
  { name: 'Bagasbas', properties: 362, businesses: 189, density: 85 },
  { name: 'Calasgasan', properties: 321, businesses: 97, density: 58 },
  { name: 'Gahonon', properties: 285, businesses: 78, density: 45 },
  { name: 'Lag-on', properties: 267, businesses: 65, density: 40 },
  { name: 'Mancruz', properties: 245, businesses: 54, density: 35 },
];

const EMERGENCY_SUMMARY = [
  { area: 'Borabod Riverside', type: 'Flood', incidents: 24, lastIncident: '2 days ago', severity: 'Critical' },
  { area: 'Poblacion Market Area', type: 'Fire', incidents: 12, lastIncident: '1 week ago', severity: 'High' },
  { area: 'Bagasbas Coastal', type: 'Storm Surge', incidents: 8, lastIncident: '3 weeks ago', severity: 'Moderate' },
  { area: 'Calasgasan Hillside', type: 'Landslide', incidents: 5, lastIncident: '1 month ago', severity: 'Moderate' },
];

export default function GISPage() {
  const [layers, setLayers] = useState<LayerConfig[]>([
    { id: 'properties', label: 'Properties', icon: Home, count: 3842, color: 'bg-blue-500', enabled: true },
    { id: 'businesses', label: 'Businesses', icon: Building2, count: 1247, color: 'bg-emerald-500', enabled: true },
    { id: 'infrastructure', label: 'Infrastructure Projects', icon: HardHat, count: 24, color: 'bg-purple-500', enabled: true },
    { id: 'risk', label: 'Risk Areas', icon: AlertTriangle, count: 8, color: 'bg-red-500', enabled: false },
    { id: 'barangay', label: 'Barangay Boundaries', icon: Map, count: 25, color: 'bg-amber-500', enabled: true },
    { id: 'emergency', label: 'Emergency Zones', icon: Shield, count: 6, color: 'bg-orange-500', enabled: false },
  ]);

  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [selectedPin, setSelectedPin] = useState<MapPinData | null>(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [coordinates] = useState({ lat: '14.1122° N', lng: '122.9553° E' });

  const toggleLayer = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l))
    );
  };

  const severityColors: Record<string, string> = {
    Critical: 'bg-red-100 text-red-800',
    High: 'bg-orange-100 text-orange-800',
    Moderate: 'bg-amber-100 text-amber-800',
    Low: 'bg-green-100 text-green-800',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="GIS Mapping System"
        subtitle="Interactive geographic information system for Municipality of Daet"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'GIS Mapping' },
        ]}
        actions={
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
          >
            <Layers className="w-4 h-4" />
            Toggle Layers
          </button>
        }
      />

      {/* Main Map Section */}
      <div className="flex gap-4">
        {/* Map Area */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div
              className="relative h-[500px] bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 overflow-hidden"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 30% 40%, rgba(16,185,129,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(6,182,212,0.15) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(59,130,246,0.1) 0%, transparent 40%)',
              }}
            >
              {/* Grid overlay to simulate map */}
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute w-full border-t border-gray-400"
                    style={{ top: `${(i + 1) * 5}%` }}
                  />
                ))}
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute h-full border-l border-gray-400"
                    style={{ left: `${(i + 1) * 5}%` }}
                  />
                ))}
              </div>

              {/* Simulated roads */}
              <div className="absolute top-[30%] left-0 right-0 h-1 bg-gray-300/40 rotate-3" />
              <div className="absolute top-0 bottom-0 left-[45%] w-1 bg-gray-300/40 -rotate-2" />
              <div className="absolute top-[60%] left-[10%] right-[20%] h-0.5 bg-gray-300/30 -rotate-1" />
              <div className="absolute top-[15%] bottom-[30%] left-[70%] w-0.5 bg-gray-300/30 rotate-2" />

              {/* Water body simulation */}
              <div className="absolute top-[5%] right-0 w-[30%] h-[40%] bg-blue-200/30 rounded-bl-[60px]" />
              <div className="absolute bottom-0 right-0 w-[20%] h-[25%] bg-blue-200/25 rounded-tl-[40px]" />

              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-white/50">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-emerald-600" />
                    <span className="text-lg font-semibold text-gray-800">
                      Municipality of Daet — Interactive Map
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Camarines Norte, Philippines
                  </p>
                </div>
              </div>

              {/* Map Pins */}
              {MOCK_PINS.map((pin) => (
                <button
                  key={pin.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 hover:scale-125 z-10 ${
                    selectedPin?.id === pin.id ? 'scale-125' : ''
                  }`}
                  style={{ top: pin.top, left: pin.left }}
                  onClick={() => setSelectedPin(pin)}
                  title={pin.label}
                >
                  <MapPin
                    className={`w-6 h-6 ${pin.color} drop-shadow-md`}
                    fill="currentColor"
                    strokeWidth={1.5}
                    stroke="white"
                  />
                  {selectedPin?.id === pin.id && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg">
                      {pin.label}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}
                </button>
              ))}

              {/* Zoom Controls */}
              <div className="absolute top-4 left-4 flex flex-col gap-1">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 1, 20))}
                  className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <ZoomIn className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 1, 1))}
                  className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <ZoomOut className="w-4 h-4 text-gray-700" />
                </button>
                <button className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 mt-1">
                  <Maximize2 className="w-4 h-4 text-gray-700" />
                </button>
                <button className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200">
                  <Crosshair className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* Zoom Level Indicator */}
              <div className="absolute top-4 left-16 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm text-xs font-medium text-gray-600 border border-gray-200">
                Zoom: {zoomLevel}x
              </div>

              {/* Coordinates Display */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-mono">
                    {coordinates.lat}, {coordinates.lng}
                  </span>
                </div>
              </div>

              {/* Scale bar */}
              <div className="absolute bottom-4 right-4 flex items-end gap-1">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 mb-0.5">500m</span>
                  <div className="w-16 h-1 bg-gray-800 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layer Toggle Sidebar */}
        {showLayerPanel && (
          <div className="w-80 space-y-4 flex-shrink-0">
            {/* Layer Toggles */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-500" />
                Map Layers
              </h3>
              <div className="space-y-3">
                {layers.map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <div
                      key={layer.id}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            layer.enabled ? layer.color : 'bg-gray-200'
                          } transition-colors`}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{layer.label}</p>
                          <p className="text-xs text-gray-400">{layer.count.toLocaleString()} items</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleLayer(layer.id)}
                        className={`relative w-10 h-5.5 rounded-full transition-colors ${
                          layer.enabled ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${
                            layer.enabled ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map Legend */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-500" />
                Map Legend
              </h3>
              <div className="space-y-2">
                {[
                  { color: 'bg-blue-500', label: 'Government Buildings' },
                  { color: 'bg-red-500', label: 'Commercial / Business' },
                  { color: 'bg-green-500', label: 'Educational Facilities' },
                  { color: 'bg-amber-500', label: 'Monitoring Stations' },
                  { color: 'bg-purple-500', label: 'Health Facilities' },
                  { color: 'bg-orange-500', label: 'Emergency Services' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Pin Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                {selectedPin ? 'Selected Location' : 'Overview'}
              </h3>
              {selectedPin ? (
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">{selectedPin.label}</p>
                    <p className="text-xs text-gray-500 capitalize mt-0.5">Type: {selectedPin.type}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Latitude</p>
                      <p className="text-xs font-mono text-gray-700 mt-0.5">14.1122°</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Longitude</p>
                      <p className="text-xs font-mono text-gray-700 mt-0.5">122.955°</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <p className="text-xs text-blue-700">
                      This location is mapped and verified. Last survey: March 2026.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPin(null)}
                    className="w-full text-xs text-gray-500 hover:text-gray-700 py-1"
                  >
                    Clear selection
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total Pins</span>
                    <span className="font-medium text-gray-900">{MOCK_PINS.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Active Layers</span>
                    <span className="font-medium text-gray-900">
                      {layers.filter((l) => l.enabled).length}/{layers.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Last Updated</span>
                    <span className="font-medium text-gray-900">Today</span>
                  </div>
                  <p className="text-xs text-gray-400 pt-1">
                    Click on a map pin to view location details.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Mapped Properties', value: '3,842', icon: Home, color: 'blue', change: '+124 this month' },
          { title: 'Mapped Businesses', value: '1,247', icon: Building2, color: 'emerald', change: '+38 this month' },
          { title: 'Infrastructure Sites', value: '24', icon: HardHat, color: 'purple', change: '3 ongoing' },
          { title: 'Risk Zones', value: '8', icon: AlertTriangle, color: 'red', change: '2 critical' },
        ].map((stat) => {
          const Icon = stat.icon;
          const colorStyles: Record<string, { bg: string; icon: string; ring: string }> = {
            blue: { bg: 'bg-blue-50', icon: 'text-blue-600', ring: 'ring-blue-100' },
            emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', ring: 'ring-emerald-100' },
            purple: { bg: 'bg-purple-50', icon: 'text-purple-600', ring: 'ring-purple-100' },
            red: { bg: 'bg-red-50', icon: 'text-red-600', ring: 'ring-red-100' },
          };
          const c = colorStyles[stat.color];
          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-2">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${c.icon}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Zone Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Risk Zone Assessment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RISK_ZONES.map((zone) => {
            const ZoneIcon = zone.icon;
            return (
              <div
                key={zone.type}
                className={`rounded-2xl border ${zone.borderColor} ${zone.bgColor} p-5`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center`}>
                    <ZoneIcon className={`w-5 h-5 ${zone.color}`} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${zone.color}`}>{zone.type}</h3>
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mt-0.5 ${
                        zone.severity === 'High'
                          ? 'bg-red-200/60 text-red-800'
                          : zone.severity === 'Moderate'
                          ? 'bg-amber-200/60 text-amber-800'
                          : 'bg-green-200/60 text-green-800'
                      }`}
                    >
                      {zone.severity} Risk
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-gray-600 mb-2">Affected Barangays:</p>
                  {zone.barangays.map((brgy) => (
                    <div
                      key={brgy}
                      className="flex items-center gap-2 text-xs text-gray-700 bg-white/60 rounded-lg px-3 py-1.5"
                    >
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {brgy}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Property / Business Density */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Property &amp; Business Density by Barangay
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-5 font-semibold text-gray-600">Barangay</th>
                  <th className="text-right py-3 px-5 font-semibold text-gray-600">Properties</th>
                  <th className="text-right py-3 px-5 font-semibold text-gray-600">Businesses</th>
                  <th className="text-left py-3 px-5 font-semibold text-gray-600">Density</th>
                </tr>
              </thead>
              <tbody>
                {BARANGAY_DENSITY.map((brgy, idx) => (
                  <tr
                    key={brgy.name}
                    className={`border-b border-gray-50 ${idx % 2 === 0 ? '' : 'bg-gray-50/30'}`}
                  >
                    <td className="py-3 px-5 font-medium text-gray-900">{brgy.name}</td>
                    <td className="py-3 px-5 text-right text-gray-700">{brgy.properties.toLocaleString()}</td>
                    <td className="py-3 px-5 text-right text-gray-700">{brgy.businesses.toLocaleString()}</td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                            style={{ width: `${brgy.density}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-500 w-8 text-right">
                          {brgy.density}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Emergency-Prone Area Summary */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-orange-500" />
          Emergency-Prone Area Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EMERGENCY_SUMMARY.map((area) => (
            <div
              key={area.area}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{area.area}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Type: {area.type}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${severityColors[area.severity]}`}
                >
                  {area.severity}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Incidents (YTD)</p>
                  <p className="font-bold text-gray-900 text-lg">{area.incidents}</p>
                </div>
                <div className="h-8 w-px bg-gray-100" />
                <div>
                  <p className="text-gray-400 text-xs">Last Incident</p>
                  <p className="font-medium text-gray-700">{area.lastIncident}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Placeholder Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-500" />
          Spatial Heatmap Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Population Density Heatmap */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Population Density</h3>
              <p className="text-xs text-gray-400 mt-0.5">Residents per hectare</p>
            </div>
            <div className="h-48 relative bg-gradient-to-br from-green-100 via-yellow-100 via-60% to-red-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Population Heatmap</p>
                  <p className="text-xs text-gray-400">Highest density: Poblacion</p>
                </div>
              </div>
              {/* Color scale */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                <span className="text-[10px] text-gray-500">Low</span>
                <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-green-300 via-yellow-300 to-red-400" />
                <span className="text-[10px] text-gray-500">High</span>
              </div>
            </div>
          </div>

          {/* Business Activity Heatmap */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Business Activity</h3>
              <p className="text-xs text-gray-400 mt-0.5">Revenue generation intensity</p>
            </div>
            <div className="h-48 relative bg-gradient-to-br from-blue-50 via-indigo-100 via-60% to-purple-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Business Heatmap</p>
                  <p className="text-xs text-gray-400">Highest activity: Bagasbas</p>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                <span className="text-[10px] text-gray-500">Low</span>
                <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-500" />
                <span className="text-[10px] text-gray-500">High</span>
              </div>
            </div>
          </div>

          {/* Risk Intensity Heatmap */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Risk Intensity</h3>
              <p className="text-xs text-gray-400 mt-0.5">Natural hazard exposure level</p>
            </div>
            <div className="h-48 relative bg-gradient-to-br from-emerald-50 via-amber-100 via-60% to-red-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Risk Heatmap</p>
                  <p className="text-xs text-gray-400">Highest risk: Borabod riverside</p>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                <span className="text-[10px] text-gray-500">Safe</span>
                <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-emerald-300 via-amber-300 to-red-500" />
                <span className="text-[10px] text-gray-500">Critical</span>
              </div>
            </div>
          </div>

          {/* Infrastructure Coverage Heatmap */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Infrastructure Coverage</h3>
              <p className="text-xs text-gray-400 mt-0.5">Road, water, power coverage</p>
            </div>
            <div className="h-48 relative bg-gradient-to-br from-gray-100 via-teal-100 via-60% to-cyan-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <HardHat className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Infrastructure Heatmap</p>
                  <p className="text-xs text-gray-400">Best coverage: Poblacion area</p>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                <span className="text-[10px] text-gray-500">Sparse</span>
                <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-gray-300 via-teal-300 to-cyan-500" />
                <span className="text-[10px] text-gray-500">Full</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
