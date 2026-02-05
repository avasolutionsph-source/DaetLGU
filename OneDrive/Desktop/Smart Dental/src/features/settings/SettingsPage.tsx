import { useState, useEffect } from 'react';
import {
  Building2, Stethoscope, Wrench, CreditCard, Pill,
  Plus, Pencil, Loader2, Save, Upload, ToggleLeft, ToggleRight,
} from 'lucide-react';
import type { Dentist, ServiceItem, PaymentTermOption, ClinicSettings, Drug } from '@/types/models';
import { api } from '@/lib/api';
import { formatMoney, cn } from '@/lib/utils';
import {
  Card, Tabs, Button, Input, Modal, Badge, EmptyState, Select,
  Table, Thead, Tbody, Tr, Th, Td, Avatar,
} from '@/components/ui';
import { useToast } from '@/components/ui/Toast';

// ─── Service Categories ───────────────────────────────────────────
const SERVICE_CATEGORIES = [
  'General',
  'Cosmetic',
  'Orthodontics',
  'Prosthodontics',
  'Surgery',
  'Preventive',
] as const;

// ─── Drug Form Options ───────────────────────────────────────────
const DRUG_FORMS = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Mouthwash',
  'Gargle',
  'Drops',
  'Cream',
  'Gel',
  'Other',
] as const;

// ─── SettingsPage ─────────────────────────────────────────────────

export default function SettingsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clinic');

  // Data state
  const [clinic, setClinic] = useState<ClinicSettings | null>(null);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTermOption[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>([]);

  // Form state for Clinic Profile
  const [clinicForm, setClinicForm] = useState({
    clinic_name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Modal states
  const [dentistModalOpen, setDentistModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [termModalOpen, setTermModalOpen] = useState(false);
  const [editingDentist, setEditingDentist] = useState<Dentist | null>(null);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingTerm, setEditingTerm] = useState<PaymentTermOption | null>(null);
  const [drugModalOpen, setDrugModalOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState<Drug | null>(null);

  // Dentist form
  const [dentistForm, setDentistForm] = useState({
    first_name: '',
    last_name: '',
    specialization: '',
    license_no: '',
  });

  // Service form
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'General',
    default_price: '',
    description: '',
  });

  // Payment term form
  const [termForm, setTermForm] = useState({
    name: '',
    months: '',
    description: '',
  });

  // Drug form
  const [drugForm, setDrugForm] = useState({
    generic_name: '',
    brand_name: '',
    form: 'Tablet',
    strength: '',
  });

  // ─── Load Data ──────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [c, d, s, pt, dr] = await Promise.all([
          api.getClinicSettings(),
          api.getDentists(),
          api.getServices(),
          api.getPaymentTerms(),
          api.getDrugs(),
        ]);
        if (!cancelled) {
          setClinic(c);
          setDentists(d);
          setServices(s);
          setPaymentTerms(pt);
          setDrugs(dr);
          setClinicForm({
            clinic_name: c.clinic_name,
            address: c.address,
            phone: c.phone,
            email: c.email,
          });
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // ─── Handlers ───────────────────────────────────────────────

  const handleSaveClinic = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast.success('Clinic profile saved successfully!');
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Dentist handlers
  const openAddDentist = () => {
    setEditingDentist(null);
    setDentistForm({ first_name: '', last_name: '', specialization: '', license_no: '' });
    setDentistModalOpen(true);
  };

  const openEditDentist = (d: Dentist) => {
    setEditingDentist(d);
    setDentistForm({
      first_name: d.first_name,
      last_name: d.last_name,
      specialization: d.specialization,
      license_no: d.license_no,
    });
    setDentistModalOpen(true);
  };

  const handleSaveDentist = () => {
    if (editingDentist) {
      setDentists((prev) =>
        prev.map((d) =>
          d.dentist_id === editingDentist.dentist_id
            ? { ...d, ...dentistForm }
            : d,
        ),
      );
      toast.success('Dentist updated successfully!');
    } else {
      const newDentist: Dentist = {
        dentist_id: Date.now(),
        ...dentistForm,
        photo: null,
        is_active: true,
      };
      setDentists((prev) => [...prev, newDentist]);
      toast.success('Dentist added successfully!');
    }
    setDentistModalOpen(false);
  };

  const toggleDentistActive = (id: number) => {
    setDentists((prev) =>
      prev.map((d) =>
        d.dentist_id === id ? { ...d, is_active: !d.is_active } : d,
      ),
    );
    toast.info('Dentist status updated.');
  };

  // Service handlers
  const openAddService = () => {
    setEditingService(null);
    setServiceForm({ name: '', category: 'General', default_price: '', description: '' });
    setServiceModalOpen(true);
  };

  const openEditService = (s: ServiceItem) => {
    setEditingService(s);
    setServiceForm({
      name: s.name,
      category: s.category,
      default_price: String(s.default_price_int / 100),
      description: s.description,
    });
    setServiceModalOpen(true);
  };

  const handleSaveService = () => {
    const priceInt = Math.round(parseFloat(serviceForm.default_price || '0') * 100);
    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.service_id === editingService.service_id
            ? { ...s, name: serviceForm.name, category: serviceForm.category, default_price_int: priceInt, description: serviceForm.description }
            : s,
        ),
      );
      toast.success('Service updated successfully!');
    } else {
      const newService: ServiceItem = {
        service_id: Date.now(),
        name: serviceForm.name,
        category: serviceForm.category,
        default_price_int: priceInt,
        description: serviceForm.description,
        is_active: true,
      };
      setServices((prev) => [...prev, newService]);
      toast.success('Service added successfully!');
    }
    setServiceModalOpen(false);
  };

  const toggleServiceActive = (id: number) => {
    setServices((prev) =>
      prev.map((s) =>
        s.service_id === id ? { ...s, is_active: !s.is_active } : s,
      ),
    );
    toast.info('Service status updated.');
  };

  // Payment term handlers
  const openAddTerm = () => {
    setEditingTerm(null);
    setTermForm({ name: '', months: '', description: '' });
    setTermModalOpen(true);
  };

  const openEditTerm = (t: PaymentTermOption) => {
    setEditingTerm(t);
    setTermForm({ name: t.name, months: String(t.months), description: t.description });
    setTermModalOpen(true);
  };

  const handleSaveTerm = () => {
    const months = parseInt(termForm.months || '0', 10);
    if (editingTerm) {
      setPaymentTerms((prev) =>
        prev.map((t) =>
          t.term_id === editingTerm.term_id
            ? { ...t, name: termForm.name, months, description: termForm.description }
            : t,
        ),
      );
      toast.success('Payment term updated!');
    } else {
      const newTerm: PaymentTermOption = {
        term_id: Date.now(),
        name: termForm.name,
        months,
        description: termForm.description,
      };
      setPaymentTerms((prev) => [...prev, newTerm]);
      toast.success('Payment term added!');
    }
    setTermModalOpen(false);
  };

  // Drug handlers
  const openAddDrug = () => {
    setEditingDrug(null);
    setDrugForm({ generic_name: '', brand_name: '', form: 'Tablet', strength: '' });
    setDrugModalOpen(true);
  };

  const openEditDrug = (d: Drug) => {
    setEditingDrug(d);
    setDrugForm({
      generic_name: d.generic_name,
      brand_name: d.brand_name,
      form: d.form,
      strength: d.strength,
    });
    setDrugModalOpen(true);
  };

  const handleSaveDrug = () => {
    if (editingDrug) {
      setDrugs((prev) =>
        prev.map((d) =>
          d.drug_id === editingDrug.drug_id
            ? { ...d, ...drugForm }
            : d,
        ),
      );
      toast.success('Drug updated successfully!');
    } else {
      const newDrug: Drug = {
        drug_id: Date.now(),
        generic_name: drugForm.generic_name,
        brand_name: drugForm.brand_name,
        form: drugForm.form,
        strength: drugForm.strength,
        is_active: true,
      };
      setDrugs((prev) => [...prev, newDrug]);
      toast.success('Drug added successfully!');
    }
    setDrugModalOpen(false);
  };

  const toggleDrugActive = (id: number) => {
    setDrugs((prev) =>
      prev.map((d) =>
        d.drug_id === id ? { ...d, is_active: !d.is_active } : d,
      ),
    );
    toast.info('Drug status updated.');
  };

  // ─── Tabs Config ────────────────────────────────────────────

  const tabs = [
    { key: 'clinic', label: 'Clinic Profile' },
    { key: 'dentists', label: 'Dentists', count: dentists.length },
    { key: 'services', label: 'Services', count: services.length },
    { key: 'terms', label: 'Payment Terms' },
    { key: 'drugs', label: 'Drug List', count: drugs.length },
  ];

  // ─── Loading State ──────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your clinic configuration, staff, and services.</p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {/* ═══ Tab 1: Clinic Profile ═══ */}
        {activeTab === 'clinic' && (
          <Card>
            <div className="max-w-2xl space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Clinic Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                    {logoPreview || clinic?.logo ? (
                      <img
                        src={logoPreview || clinic?.logo || ''}
                        alt="Logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                        <Upload className="h-4 w-4" />
                        Upload Logo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>

              <Input
                label="Clinic Name"
                value={clinicForm.clinic_name}
                onChange={(e) => setClinicForm((f) => ({ ...f, clinic_name: e.target.value }))}
                placeholder="Enter clinic name"
              />

              <Input
                label="Address"
                value={clinicForm.address}
                onChange={(e) => setClinicForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="Full clinic address"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Phone Number"
                  value={clinicForm.phone}
                  onChange={(e) => setClinicForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="(02) 8XXX-XXXX"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={clinicForm.email}
                  onChange={(e) => setClinicForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="clinic@email.com"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSaveClinic}
                  loading={saving}
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ═══ Tab 2: Dentists ═══ */}
        {activeTab === 'dentists' && (
          <Card
            title="Dentists"
            headerAction={
              <Button size="sm" onClick={openAddDentist} leftIcon={<Plus className="h-4 w-4" />}>
                Add Dentist
              </Button>
            }
          >
            {dentists.length === 0 ? (
              <EmptyState
                icon={Stethoscope}
                title="No dentists added"
                description="Add your dental staff to get started."
                action={
                  <Button size="sm" onClick={openAddDentist} leftIcon={<Plus className="h-4 w-4" />}>
                    Add Dentist
                  </Button>
                }
              />
            ) : (
              <Table>
                <Thead>
                  <Tr>
                    <Th>Dentist</Th>
                    <Th>Specialization</Th>
                    <Th>License No.</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dentists.map((d) => (
                    <Tr key={d.dentist_id}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={`${d.first_name} ${d.last_name}`}
                            size="sm"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              Dr. {d.first_name} {d.last_name}
                            </p>
                          </div>
                        </div>
                      </Td>
                      <Td>{d.specialization}</Td>
                      <Td className="font-mono text-xs">{d.license_no}</Td>
                      <Td>
                        <Badge variant={d.is_active ? 'success' : 'default'}>
                          {d.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </Td>
                      <Td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditDentist(d)}
                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleDentistActive(d.dentist_id)}
                            className={cn(
                              'rounded-lg p-1.5 transition',
                              d.is_active
                                ? 'text-success-600 hover:bg-success-50'
                                : 'text-gray-400 hover:bg-gray-100',
                            )}
                            title={d.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {d.is_active ? (
                              <ToggleRight className="h-5 w-5" />
                            ) : (
                              <ToggleLeft className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Card>
        )}

        {/* ═══ Tab 3: Services ═══ */}
        {activeTab === 'services' && (
          <Card
            title="Dental Services"
            headerAction={
              <Button size="sm" onClick={openAddService} leftIcon={<Plus className="h-4 w-4" />}>
                Add Service
              </Button>
            }
          >
            {services.length === 0 ? (
              <EmptyState
                icon={Wrench}
                title="No services configured"
                description="Add your dental services and pricing."
                action={
                  <Button size="sm" onClick={openAddService} leftIcon={<Plus className="h-4 w-4" />}>
                    Add Service
                  </Button>
                }
              />
            ) : (
              <Table>
                <Thead>
                  <Tr>
                    <Th>Service Name</Th>
                    <Th>Category</Th>
                    <Th>Default Price</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {services.map((s) => (
                    <Tr key={s.service_id}>
                      <Td>
                        <div>
                          <p className="font-medium text-gray-900">{s.name}</p>
                          {s.description && (
                            <p className="text-xs text-gray-500">{s.description}</p>
                          )}
                        </div>
                      </Td>
                      <Td>
                        <Badge variant="info">{s.category}</Badge>
                      </Td>
                      <Td className="font-medium">
                        {formatMoney(s.default_price_int)}
                      </Td>
                      <Td>
                        <Badge variant={s.is_active ? 'success' : 'default'}>
                          {s.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </Td>
                      <Td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditService(s)}
                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleServiceActive(s.service_id)}
                            className={cn(
                              'rounded-lg p-1.5 transition',
                              s.is_active
                                ? 'text-success-600 hover:bg-success-50'
                                : 'text-gray-400 hover:bg-gray-100',
                            )}
                            title={s.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {s.is_active ? (
                              <ToggleRight className="h-5 w-5" />
                            ) : (
                              <ToggleLeft className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Card>
        )}

        {/* ═══ Tab 4: Payment Terms ═══ */}
        {activeTab === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Payment Terms</h3>
                <p className="text-sm text-gray-500">Configure installment options for patients.</p>
              </div>
              <Button size="sm" onClick={openAddTerm} leftIcon={<Plus className="h-4 w-4" />}>
                Add Term
              </Button>
            </div>

            {paymentTerms.length === 0 ? (
              <Card>
                <EmptyState
                  icon={CreditCard}
                  title="No payment terms"
                  description="Add payment term options for your patients."
                  action={
                    <Button size="sm" onClick={openAddTerm} leftIcon={<Plus className="h-4 w-4" />}>
                      Add Term
                    </Button>
                  }
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paymentTerms.map((term) => (
                  <div
                    key={term.term_id}
                    className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary-200 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <button
                        onClick={() => openEditTerm(term)}
                        className="rounded-lg p-1.5 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">{term.name}</h4>
                    <p className="mt-0.5 text-xs text-gray-500">{term.description}</p>
                    <div className="mt-3">
                      <Badge variant={term.months === 0 ? 'success' : 'info'}>
                        {term.months === 0 ? 'One-time' : `${term.months} months`}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ Tab 5: Drug List ═══ */}
        {activeTab === 'drugs' && (
          <Card
            title="Drug List"
            headerAction={
              <Button size="sm" onClick={openAddDrug} leftIcon={<Plus className="h-4 w-4" />}>
                Add Drug
              </Button>
            }
          >
            {drugs.length === 0 ? (
              <EmptyState
                icon={Pill}
                title="No drugs added"
                description="Add drugs to your catalog to get started."
                action={
                  <Button size="sm" onClick={openAddDrug} leftIcon={<Plus className="h-4 w-4" />}>
                    Add Drug
                  </Button>
                }
              />
            ) : (
              <Table>
                <Thead>
                  <Tr>
                    <Th>Generic Name</Th>
                    <Th>Brand Name</Th>
                    <Th>Form</Th>
                    <Th>Strength</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {drugs.map((d) => (
                    <Tr key={d.drug_id}>
                      <Td>
                        <p className="font-medium text-gray-900">{d.generic_name}</p>
                      </Td>
                      <Td>{d.brand_name || <span className="text-gray-400">-</span>}</Td>
                      <Td>
                        <Badge variant="info">{d.form}</Badge>
                      </Td>
                      <Td className="font-mono text-xs">{d.strength}</Td>
                      <Td>
                        <Badge variant={d.is_active ? 'success' : 'default'}>
                          {d.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </Td>
                      <Td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditDrug(d)}
                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleDrugActive(d.drug_id)}
                            className={cn(
                              'rounded-lg p-1.5 transition',
                              d.is_active
                                ? 'text-success-600 hover:bg-success-50'
                                : 'text-gray-400 hover:bg-gray-100',
                            )}
                            title={d.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {d.is_active ? (
                              <ToggleRight className="h-5 w-5" />
                            ) : (
                              <ToggleLeft className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Card>
        )}
      </div>

      {/* ═══ MODALS ═══ */}

      {/* Dentist Modal */}
      <Modal
        isOpen={dentistModalOpen}
        onClose={() => setDentistModalOpen(false)}
        title={editingDentist ? 'Edit Dentist' : 'Add Dentist'}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setDentistModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDentist} leftIcon={<Save className="h-4 w-4" />}>
              {editingDentist ? 'Update' : 'Add'} Dentist
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={dentistForm.first_name}
              onChange={(e) => setDentistForm((f) => ({ ...f, first_name: e.target.value }))}
              placeholder="First name"
            />
            <Input
              label="Last Name"
              value={dentistForm.last_name}
              onChange={(e) => setDentistForm((f) => ({ ...f, last_name: e.target.value }))}
              placeholder="Last name"
            />
          </div>
          <Input
            label="Specialization"
            value={dentistForm.specialization}
            onChange={(e) => setDentistForm((f) => ({ ...f, specialization: e.target.value }))}
            placeholder="e.g., General Dentistry, Orthodontics"
          />
          <Input
            label="PRC License No."
            value={dentistForm.license_no}
            onChange={(e) => setDentistForm((f) => ({ ...f, license_no: e.target.value }))}
            placeholder="e.g., PRC-12345"
          />
        </div>
      </Modal>

      {/* Service Modal */}
      <Modal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add Service'}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setServiceModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveService} leftIcon={<Save className="h-4 w-4" />}>
              {editingService ? 'Update' : 'Add'} Service
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Service Name"
            value={serviceForm.name}
            onChange={(e) => setServiceForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g., Oral Prophylaxis"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
            <select
              value={serviceForm.category}
              onChange={(e) => setServiceForm((f) => ({ ...f, category: e.target.value }))}
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <Input
            label="Default Price (PHP)"
            type="number"
            value={serviceForm.default_price}
            onChange={(e) => setServiceForm((f) => ({ ...f, default_price: e.target.value }))}
            placeholder="0.00"
          />
          <Input
            label="Description"
            value={serviceForm.description}
            onChange={(e) => setServiceForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Brief description of the service"
          />
        </div>
      </Modal>

      {/* Payment Term Modal */}
      <Modal
        isOpen={termModalOpen}
        onClose={() => setTermModalOpen(false)}
        title={editingTerm ? 'Edit Payment Term' : 'Add Payment Term'}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setTermModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTerm} leftIcon={<Save className="h-4 w-4" />}>
              {editingTerm ? 'Update' : 'Add'} Term
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Term Name"
            value={termForm.name}
            onChange={(e) => setTermForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g., 6-Month Installment"
          />
          <Input
            label="Number of Months"
            type="number"
            value={termForm.months}
            onChange={(e) => setTermForm((f) => ({ ...f, months: e.target.value }))}
            placeholder="0 for full payment"
            helperText="Enter 0 for one-time full payment"
          />
          <Input
            label="Description"
            value={termForm.description}
            onChange={(e) => setTermForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Describe the payment term"
          />
        </div>
      </Modal>

      {/* Drug Modal */}
      <Modal
        isOpen={drugModalOpen}
        onClose={() => setDrugModalOpen(false)}
        title={editingDrug ? 'Edit Drug' : 'Add Drug'}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setDrugModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDrug} leftIcon={<Save className="h-4 w-4" />}>
              {editingDrug ? 'Update' : 'Add'} Drug
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Generic Name"
            value={drugForm.generic_name}
            onChange={(e) => setDrugForm((f) => ({ ...f, generic_name: e.target.value }))}
            placeholder="e.g., Amoxicillin"
          />
          <Input
            label="Brand Name"
            value={drugForm.brand_name}
            onChange={(e) => setDrugForm((f) => ({ ...f, brand_name: e.target.value }))}
            placeholder="e.g., Amoxil"
          />
          <Select
            label="Form"
            value={drugForm.form}
            onChange={(e) => setDrugForm((f) => ({ ...f, form: e.target.value }))}
            options={DRUG_FORMS.map((form) => ({ value: form, label: form }))}
          />
          <Input
            label="Strength"
            value={drugForm.strength}
            onChange={(e) => setDrugForm((f) => ({ ...f, strength: e.target.value }))}
            placeholder="e.g., 500mg"
          />
        </div>
      </Modal>
    </div>
  );
}
