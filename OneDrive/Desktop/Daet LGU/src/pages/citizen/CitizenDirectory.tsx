import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Phone,
  MapPin,
  User,
  Building2,
  Mail,
} from 'lucide-react';

interface Official {
  name: string;
  position: string;
  contact: string;
  email?: string;
}

interface BarangayInfo {
  name: string;
  captain: string;
  address: string;
  contact: string;
  population: string;
  officials: Official[];
}

const BARANGAY_DATA: BarangayInfo[] = [
  {
    name: 'Alawihao',
    captain: 'Kap. Jose Garcia',
    address: 'Barangay Hall, Alawihao, Daet',
    contact: '(054) 721-XXXX',
    population: '8,234',
    officials: [
      { name: 'Jose Garcia', position: 'Barangay Captain', contact: '0917-XXX-1001' },
      { name: 'Maria Reyes', position: 'Secretary', contact: '0918-XXX-1002' },
      { name: 'Pedro Santos', position: 'Treasurer', contact: '0919-XXX-1003' },
      { name: 'Ana Dela Cruz', position: 'Kagawad - Peace & Order', contact: '0920-XXX-1004' },
      { name: 'Roberto Mendoza', position: 'Kagawad - Health', contact: '0921-XXX-1005' },
      { name: 'Carmen Villanueva', position: 'Kagawad - Education', contact: '0922-XXX-1006' },
      { name: 'Luis Ramos', position: 'SK Chairman', contact: '0923-XXX-1007' },
    ],
  },
  {
    name: 'Awitan',
    captain: 'Kap. Roberto Mendoza',
    address: 'Barangay Hall, Awitan, Daet',
    contact: '(054) 721-XXXX',
    population: '5,120',
    officials: [
      { name: 'Roberto Mendoza', position: 'Barangay Captain', contact: '0917-XXX-2001' },
      { name: 'Elena Torres', position: 'Secretary', contact: '0918-XXX-2002' },
      { name: 'Miguel Castro', position: 'Treasurer', contact: '0919-XXX-2003' },
    ],
  },
  {
    name: 'Bagasbas',
    captain: 'Kap. Linda Santos',
    address: 'Barangay Hall, Bagasbas, Daet',
    contact: '(054) 721-XXXX',
    population: '12,456',
    officials: [
      { name: 'Linda Santos', position: 'Barangay Captain', contact: '0917-XXX-3001' },
      { name: 'Fernando Cruz', position: 'Secretary', contact: '0918-XXX-3002' },
      { name: 'Gloria Reyes', position: 'Treasurer', contact: '0919-XXX-3003' },
    ],
  },
  {
    name: 'Bibirao',
    captain: 'Kap. Antonio Ramos',
    address: 'Barangay Hall, Bibirao, Daet',
    contact: '(054) 721-XXXX',
    population: '3,890',
    officials: [
      { name: 'Antonio Ramos', position: 'Barangay Captain', contact: '0917-XXX-4001' },
      { name: 'Rosa Garcia', position: 'Secretary', contact: '0918-XXX-4002' },
    ],
  },
  {
    name: 'Borabod',
    captain: 'Kap. Ricardo Pascual',
    address: 'Barangay Hall, Borabod, Daet',
    contact: '(054) 721-XXXX',
    population: '9,780',
    officials: [
      { name: 'Ricardo Pascual', position: 'Barangay Captain', contact: '0917-XXX-5001' },
      { name: 'Luz Dela Cruz', position: 'Secretary', contact: '0918-XXX-5002' },
      { name: 'Carlos Bautista', position: 'Treasurer', contact: '0919-XXX-5003' },
    ],
  },
  {
    name: 'Calasgasan',
    captain: 'Kap. Ernesto Villanueva',
    address: 'Barangay Hall, Calasgasan, Daet',
    contact: '(054) 721-XXXX',
    population: '6,340',
    officials: [
      { name: 'Ernesto Villanueva', position: 'Barangay Captain', contact: '0917-XXX-6001' },
      { name: 'Teresa Lopez', position: 'Secretary', contact: '0918-XXX-6002' },
    ],
  },
  {
    name: 'Camambugan',
    captain: 'Kap. Felipe Torres',
    address: 'Barangay Hall, Camambugan, Daet',
    contact: '(054) 721-XXXX',
    population: '4,560',
    officials: [
      { name: 'Felipe Torres', position: 'Barangay Captain', contact: '0917-XXX-7001' },
      { name: 'Josefa Mendoza', position: 'Secretary', contact: '0918-XXX-7002' },
    ],
  },
  {
    name: 'Cobangbang',
    captain: 'Kap. Dolores Reyes',
    address: 'Barangay Hall, Cobangbang, Daet',
    contact: '(054) 721-XXXX',
    population: '7,890',
    officials: [
      { name: 'Dolores Reyes', position: 'Barangay Captain', contact: '0917-XXX-8001' },
      { name: 'Ramon Santos', position: 'Secretary', contact: '0918-XXX-8002' },
      { name: 'Nelia Garcia', position: 'Treasurer', contact: '0919-XXX-8003' },
    ],
  },
  {
    name: 'Dogongan',
    captain: 'Kap. Manuel Cruz',
    address: 'Barangay Hall, Dogongan, Daet',
    contact: '(054) 721-XXXX',
    population: '3,210',
    officials: [
      { name: 'Manuel Cruz', position: 'Barangay Captain', contact: '0917-XXX-9001' },
      { name: 'Cristina Bautista', position: 'Secretary', contact: '0918-XXX-9002' },
    ],
  },
  {
    name: 'Gahonon',
    captain: 'Kap. Sergio Dela Cruz',
    address: 'Barangay Hall, Gahonon, Daet',
    contact: '(054) 721-XXXX',
    population: '4,100',
    officials: [
      { name: 'Sergio Dela Cruz', position: 'Barangay Captain', contact: '0917-XXX-0001' },
      { name: 'Evelyn Ramos', position: 'Secretary', contact: '0918-XXX-0002' },
    ],
  },
  {
    name: 'Lag-on',
    captain: 'Kap. Rosario Pascual',
    address: 'Barangay Hall, Lag-on, Daet',
    contact: '(054) 721-XXXX',
    population: '11,230',
    officials: [
      { name: 'Rosario Pascual', position: 'Barangay Captain', contact: '0917-XXX-1101' },
      { name: 'Gabriel Santos', position: 'Secretary', contact: '0918-XXX-1102' },
      { name: 'Lourdes Mendoza', position: 'Treasurer', contact: '0919-XXX-1103' },
    ],
  },
  {
    name: 'Mancruz',
    captain: 'Kap. Isidro Lopez',
    address: 'Barangay Hall, Mancruz, Daet',
    contact: '(054) 721-XXXX',
    population: '2,890',
    officials: [
      { name: 'Isidro Lopez', position: 'Barangay Captain', contact: '0917-XXX-1201' },
      { name: 'Victoria Reyes', position: 'Secretary', contact: '0918-XXX-1202' },
    ],
  },
  {
    name: 'Pamorangon',
    captain: 'Kap. Beatriz Garcia',
    address: 'Barangay Hall, Pamorangon, Daet',
    contact: '(054) 721-XXXX',
    population: '5,670',
    officials: [
      { name: 'Beatriz Garcia', position: 'Barangay Captain', contact: '0917-XXX-1301' },
      { name: 'Alfredo Torres', position: 'Secretary', contact: '0918-XXX-1302' },
    ],
  },
  {
    name: 'San Isidro',
    captain: 'Kap. Danilo Villanueva',
    address: 'Barangay Hall, San Isidro, Daet',
    contact: '(054) 721-XXXX',
    population: '6,780',
    officials: [
      { name: 'Danilo Villanueva', position: 'Barangay Captain', contact: '0917-XXX-1401' },
      { name: 'Remedios Cruz', position: 'Secretary', contact: '0918-XXX-1402' },
      { name: 'Juanito Ramos', position: 'Treasurer', contact: '0919-XXX-1403' },
    ],
  },
];

export default function CitizenDirectory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = BARANGAY_DATA.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.captain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button onClick={() => navigate('/citizen-hub')} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900">Barangay Directory</h1>
            <p className="text-xs text-gray-500">{BARANGAY_DATA.length} barangays</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search barangay or captain..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>

        {/* Barangay list */}
        <div className="space-y-3">
          {filtered.map(brgy => {
            const isExpanded = expanded === brgy.name;
            return (
              <div key={brgy.name} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <button onClick={() => setExpanded(isExpanded ? null : brgy.name)}
                  className="flex w-full items-center gap-3 p-4 text-left">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 font-bold text-sm">
                    {brgy.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{brgy.name}</p>
                    <p className="text-xs text-gray-500">{brgy.captain}</p>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" />{brgy.population} residents</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{brgy.contact}</span>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
                    <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {brgy.address}
                    </div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Officials</p>
                    <div className="space-y-2">
                      {brgy.officials.map((o, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg bg-white border border-gray-100 px-3 py-2">
                          <div>
                            <p className="text-xs font-medium text-gray-900">{o.name}</p>
                            <p className="text-[11px] text-gray-500">{o.position}</p>
                          </div>
                          <a href={`tel:${o.contact.replace(/[^0-9+]/g, '')}`}
                            className="flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700 hover:bg-green-100">
                            <Phone className="h-3 w-3" />
                            {o.contact}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Building2 className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-500">No barangay found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
