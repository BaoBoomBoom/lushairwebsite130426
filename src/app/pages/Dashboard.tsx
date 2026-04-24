import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router';
import {
  Camera,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Settings,
  Bell,
  Download,
  Users,
  Building2,
  User,
  Code,
  Package,
  Phone,
  Leaf,
  BarChart3,
  DollarSign,
  ShoppingBag,
  Search,
  ChevronDown,
  Plus,
  Filter,
  ArrowUpRight,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CALENDLY_BOOK_CALL_URL } from '../../constants/calendly';
import ClerkDebug from '../components/ClerkDebug';
import OpenApiDocsButton from '../components/OpenApiDocsButton';

const mockHistoryData = [
  { date: '2026-01-10', score: 78 },
  { date: '2025-12-15', score: 74 },
  { date: '2025-11-20', score: 72 },
  { date: '2025-10-25', score: 68 },
  { date: '2025-09-30', score: 65 },
];

type BusinessTab = 'overview' | 'customers' | 'products' | 'analytics' | 'settings';
type DateRange = 'today' | 'week' | 'month' | 'year';

const businessCustomersSeed = [
  {
    id: 1,
    name: 'Sarah J.',
    phone: '+1 (323) 555-0148',
    email: 'sarahj@email.com',
    lastVisit: '2026-01-10',
    visits: 8,
    spent: 1245,
    trend: [65, 72, 68, 75, 82],
    status: 'active',
    syndrome: 'Oily Scalp',
    stage: 'Norwood 2',
    membershipBalance: 180,
  },
  {
    id: 2,
    name: 'Michael T.',
    phone: '+1 (323) 555-0185',
    email: 'michaelt@email.com',
    lastVisit: '2026-01-15',
    visits: 5,
    spent: 890,
    trend: [58, 61, 65, 68, 71],
    status: 'active',
    syndrome: 'Hair Loss Stage 1-3',
    stage: 'Norwood 3',
    membershipBalance: 120,
  },
  {
    id: 3,
    name: 'Emma L.',
    phone: '+1 (323) 555-0111',
    email: 'emmal@email.com',
    lastVisit: '2025-12-28',
    visits: 12,
    spent: 2100,
    trend: [70, 73, 71, 78, 85],
    status: 'returning',
    syndrome: 'Sensitive Scalp',
    stage: 'Female Pattern 2',
    membershipBalance: 260,
  },
];

const businessProductsSeed = [
  { id: 'p1', name: 'Oil-Control Shampoo X', sku: 'LS-1001', price: 45, percentage: 85, sales: 127, syndrome: 'Oily Scalp' },
  { id: 'p2', name: 'Hair Mask Pro', sku: 'LS-1002', price: 68, percentage: 72, sales: 98, syndrome: 'Dry Scalp' },
  { id: 'p3', name: 'Scalp Serum Y', sku: 'LS-1003', price: 52, percentage: 68, sales: 89, syndrome: 'Hair Loss Stage 1-3' },
  { id: 'p4', name: 'Anti-Dandruff Treatment', sku: 'LS-1004', price: 38, percentage: 54, sales: 67, syndrome: 'Dandruff Scalp' },
  { id: 'p5', name: 'Volumizing Conditioner', sku: 'LS-1005', price: 42, percentage: 48, sales: 58, syndrome: 'Hair Loss Stage 4-7' },
];

const syndromeMix = [
  { label: 'Sensitive Scalp', pct: 18 },
  { label: 'Oily Scalp', pct: 24 },
  { label: 'Dry Scalp', pct: 15 },
  { label: 'Keratinocyte Scalp', pct: 9 },
  { label: 'Dandruff Scalp', pct: 13 },
  { label: 'Hair Loss Stage 1-3', pct: 14 },
  { label: 'Hair Loss Stage 4-7', pct: 7 },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'ingredients'>('overview');
  const [searchParams] = useSearchParams();
  const initialAccountType: 'consumer' | 'business' =
    searchParams.get('account') === 'business' ? 'business' : 'consumer';
  const [accountType, setAccountType] = useState<'consumer' | 'business'>(initialAccountType);
  const [businessTab, setBusinessTab] = useState<BusinessTab>('overview');
  const [dateRange, setDateRange] = useState<DateRange>('today');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedSyndrome, setSelectedSyndrome] = useState('All');
  const [customers, setCustomers] = useState(businessCustomersSeed);
  const [products, setProducts] = useState(businessProductsSeed);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(businessCustomersSeed[0].id);
  const [reportGeneratedAt, setReportGeneratedAt] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string>('');
  const { t } = useLanguage();
  const { user } = useUser();
  const displayName =
    user?.firstName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress.split('@')[0] ||
    '';
  const consumerWelcome = displayName
    ? `Welcome back, ${displayName}! 👋`
    : t('dashboard.welcome');

  const mockMetrics = [
    { name: t('dashboard.overview.hairDensity'), current: 78, previous: 75, trend: 'up' },
    { name: t('dashboard.overview.scalpHealth'), current: 72, previous: 76, trend: 'down' },
    { name: t('dashboard.overview.oilLevel'), current: 68, previous: 68, trend: 'stable' },
    { name: t('dashboard.overview.hairDamage'), current: 65, previous: 70, trend: 'down' },
  ];

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) ?? customers[0] ?? null,
    [customers, selectedCustomerId]
  );

  const filteredCustomers = useMemo(() => {
    const term = customerSearch.trim().toLowerCase();
    return customers.filter((c) => {
      const matchSearch =
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term);
      const matchSyndrome = selectedSyndrome === 'All' || c.syndrome === selectedSyndrome;
      return matchSearch && matchSyndrome;
    });
  }, [customers, customerSearch, selectedSyndrome]);

  const businessStats = useMemo(() => {
    const rangeMultiplier: Record<DateRange, number> = {
      today: 1,
      week: 4.6,
      month: 18,
      year: 210,
    };
    const m = rangeMultiplier[dateRange];
    const scansBase = 23;
    const revenueBase = 1240;
    const conversionRate = 78;
    const newCustomersBase = 5;
    const totalRevenue = customers.reduce((sum, c) => sum + c.spent, 0);
    const totalVisits = customers.reduce((sum, c) => sum + c.visits, 0);
    return {
      scans: Math.round(scansBase * m),
      revenue: Math.round(revenueBase * m),
      conversionRate,
      newCustomers: Math.max(1, Math.round(newCustomersBase * m)),
      totalRevenue,
      totalVisits,
      avgSpendPerVisit: totalVisits > 0 ? Math.round(totalRevenue / totalVisits) : 0,
    };
  }, [customers, dateRange]);

  const topProducts = useMemo(() => [...products].sort((a, b) => b.percentage - a.percentage).slice(0, 5), [products]);

  const handleAddCustomer = () => {
    const id = Date.now();
    const suffix = String(id).slice(-3);
    const newCustomer = {
      id,
      name: `Walk-in ${suffix}`,
      phone: `+1 (323) 555-${suffix}`,
      email: `walkin${suffix}@demo.com`,
      lastVisit: new Date().toISOString().slice(0, 10),
      visits: 1,
      spent: 0,
      trend: [62, 64, 66, 68, 70],
      status: 'new',
      syndrome: 'Sensitive Scalp',
      stage: 'Norwood 1',
      membershipBalance: 0,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    setSelectedCustomerId(id);
    setActionMessage(`Added new customer record: ${newCustomer.name}`);
    setBusinessTab('customers');
  };

  const handleScheduleFollowUp = (id: number) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, visits: c.visits + 1, lastVisit: new Date().toISOString().slice(0, 10) } : c
      )
    );
    setActionMessage('Follow-up scheduled and visit timeline updated.');
  };

  const handleRecordPurchase = (id: number, amount: number) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, spent: c.spent + amount } : c)));
    setActionMessage(`Recorded purchase: $${amount}`);
  };

  const handleTopupMembership = (id: number, amount: number) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, membershipBalance: c.membershipBalance + amount, spent: c.spent + amount } : c))
    );
    setActionMessage(`Membership top-up added: $${amount}`);
  };

  const handleGenerateReport = () => {
    setReportGeneratedAt(new Date().toLocaleString());
    setActionMessage('Monthly business report generated.');
  };

  const handleExportCustomerCsv = () => {
    const header = ['Name', 'Phone', 'Email', 'Last Visit', 'Visits', 'Total Spent', 'Syndrome', 'Stage'];
    const rows = filteredCustomers.map((c) => [c.name, c.phone, c.email, c.lastVisit, c.visits, c.spent, c.syndrome, c.stage]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    const a = document.createElement('a');
    a.href = href;
    a.download = `lushair-customers-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setActionMessage('Customer CSV exported.');
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ClerkDebug />
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {accountType === 'consumer' ? consumerWelcome : t('dashboard.businessWelcome')}
            </h1>
            <p className="text-gray-600">
              {accountType === 'consumer' ? t('dashboard.lastScan') : t('dashboard.businessSubtitle')}
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {accountType === 'consumer' && (
              <>
                <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                  <Bell size={24} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <Settings size={24} />
                </button>
                <Link
                  to="/try-free"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center"
                >
                  <Camera className="mr-2" size={20} />
                  {t('dashboard.newScan')}
                </Link>
                <OpenApiDocsButton
                  className="px-6 py-3 border border-purple-600 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors font-semibold inline-flex items-center gap-2"
                />
              </>
            )}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('dashboard.accountType')}</p>
          <div className="inline-flex rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setAccountType('consumer')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                accountType === 'consumer' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User size={18} />
              {t('dashboard.consumer')}
            </button>
            <button
              type="button"
              onClick={() => setAccountType('business')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                accountType === 'business' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 size={18} />
              {t('dashboard.business')}
            </button>
          </div>
        </div>

        {accountType === 'business' && (
          <div className="mb-12 space-y-6">
            <div className="rounded-2xl border border-purple-100 bg-white p-4">
              <div className="flex flex-wrap gap-2">
                {(['overview', 'customers', 'products', 'analytics', 'settings'] as BusinessTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setBusinessTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                      businessTab === tab ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Lushair Store Management System</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      placeholder="Search customers..."
                      className="w-64 rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">
                    <ChevronDown size={14} className="text-gray-500" />
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value as DateRange)}
                      className="text-sm bg-transparent outline-none"
                    >
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                  <button
                    onClick={handleAddCustomer}
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    <Plus size={16} />
                    Add Customer
                  </button>
                </div>
              </div>
            </div>

            {actionMessage && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{actionMessage}</div>
            )}

            {businessTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                      <BarChart3 className="text-purple-700 mb-2" size={18} />
                      <div className="text-2xl font-bold text-gray-900">{businessStats.scans}</div>
                      <div className="text-xs text-gray-600">Scans performed</div>
                    </div>
                    <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                      <DollarSign className="text-green-700 mb-2" size={18} />
                      <div className="text-2xl font-bold text-green-700">${businessStats.revenue.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Recommendation revenue</div>
                    </div>
                    <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                      <ShoppingBag className="text-purple-700 mb-2" size={18} />
                      <div className="text-2xl font-bold text-gray-900">{businessStats.conversionRate}%</div>
                      <div className="text-xs text-gray-600">Conversion rate</div>
                    </div>
                    <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                      <Users className="text-orange-600 mb-2" size={18} />
                      <div className="text-2xl font-bold text-orange-600">{businessStats.newCustomers}</div>
                      <div className="text-xs text-gray-600">New customers</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">Customer Management</h3>
                      <button className="rounded-md p-2 hover:bg-gray-100">
                        <Filter size={16} className="text-gray-600" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {filteredCustomers.slice(0, 3).map((customer) => (
                        <div key={customer.id} className="rounded-lg border border-gray-200 p-4">
                          <div className="mb-3 flex items-start justify-between">
                            <button
                              onClick={() => {
                                setSelectedCustomerId(customer.id);
                                setBusinessTab('customers');
                              }}
                              className="text-left"
                            >
                              <div className="font-semibold text-gray-900">{customer.name}</div>
                              <div className="text-xs text-gray-500">Last visit: {customer.lastVisit}</div>
                            </button>
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 capitalize">{customer.status}</span>
                          </div>
                          <div className="mb-3 flex items-end gap-1 h-12">
                            {customer.trend.map((v, idx) => (
                              <div key={idx} className="flex-1 rounded-t bg-purple-500" style={{ height: `${v}%` }} />
                            ))}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                            <div className="rounded bg-gray-50 p-2">Visits: <span className="font-bold">{customer.visits}</span></div>
                            <div className="rounded bg-gray-50 p-2">Spent: <span className="font-bold">${customer.spent}</span></div>
                            <div className="rounded bg-gray-50 p-2">LTV: <span className="font-bold">${Math.round(customer.spent * 1.35)}</span></div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2">
                            <button
                              onClick={() => setSelectedCustomerId(customer.id)}
                              className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                            >
                              View Full Report
                            </button>
                            <button
                              onClick={() => handleScheduleFollowUp(customer.id)}
                              className="rounded-lg border border-purple-600 px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50"
                            >
                              Schedule Follow-up
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Top Selling Products</h3>
                    <div className="space-y-3">
                      {topProducts.map((product) => (
                        <div key={product.id}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="font-medium text-gray-900">{product.name}</span>
                            <span className="font-bold text-purple-700">{product.percentage}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full bg-purple-600 rounded-full" style={{ width: `${product.percentage}%` }} />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{product.sales} sales · ${product.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl bg-purple-700 p-6 text-white">
                    <h4 className="font-bold text-lg mb-4">Quick Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={handleGenerateReport}
                        className="w-full rounded-lg bg-white/15 px-4 py-3 text-left font-semibold hover:bg-white/25"
                      >
                        Generate Monthly Report
                      </button>
                      <button
                        onClick={handleExportCustomerCsv}
                        className="w-full rounded-lg bg-white/15 px-4 py-3 text-left font-semibold hover:bg-white/25"
                      >
                        Export Customer Data (CSV)
                      </button>
                      <button
                        onClick={() => setBusinessTab('products')}
                        className="w-full rounded-lg bg-white/15 px-4 py-3 text-left font-semibold hover:bg-white/25"
                      >
                        Manage Products
                      </button>
                    </div>
                  </div>

                  <a
                    href={CALENDLY_BOOK_CALL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-3 font-semibold text-purple-700 hover:bg-purple-50"
                  >
                    <Phone size={18} />
                    Contact Business Rep
                  </a>
                </div>
              </div>
            )}

            {businessTab === 'customers' && (
              <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Customer Records</h3>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedSyndrome}
                        onChange={(e) => setSelectedSyndrome(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="All">All syndromes</option>
                        {syndromeMix.map((s) => (
                          <option key={s.label} value={s.label}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        onClick={() => setSelectedCustomerId(customer.id)}
                        className={`w-full rounded-lg border p-4 text-left transition-colors ${
                          selectedCustomerId === customer.id ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{customer.name}</div>
                            <div className="text-xs text-gray-500">{customer.phone} · {customer.email}</div>
                          </div>
                          <ArrowUpRight size={16} className="text-gray-400" />
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                          {customer.syndrome} · {customer.stage} · Last visit {customer.lastVisit}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Detail</h3>
                  {selectedCustomer ? (
                    <div className="space-y-4">
                      <div className="rounded-lg bg-gray-50 p-4">
                        <div className="font-semibold text-gray-900">{selectedCustomer.name}</div>
                        <div className="text-sm text-gray-600">{selectedCustomer.phone}</div>
                        <div className="text-sm text-gray-600">{selectedCustomer.email}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded bg-gray-50 p-3">Visits: <span className="font-bold">{selectedCustomer.visits}</span></div>
                        <div className="rounded bg-gray-50 p-3">Spent: <span className="font-bold">${selectedCustomer.spent}</span></div>
                        <div className="rounded bg-gray-50 p-3">Membership: <span className="font-bold">${selectedCustomer.membershipBalance}</span></div>
                        <div className="rounded bg-gray-50 p-3">LTV: <span className="font-bold">${Math.round(selectedCustomer.spent * 1.35)}</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleRecordPurchase(selectedCustomer.id, 68)}
                          className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                        >
                          Record Purchase $68
                        </button>
                        <button
                          onClick={() => handleTopupMembership(selectedCustomer.id, 100)}
                          className="rounded-lg border border-purple-600 px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50"
                        >
                          Membership Top-up $100
                        </button>
                      </div>
                      <button
                        onClick={() => handleScheduleFollowUp(selectedCustomer.id)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Schedule Follow-up
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Select a customer to view details.</p>
                  )}
                </div>
              </div>
            )}

            {businessTab === 'products' && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Syndrome-Based Product Catalog</h3>
                  <button
                    onClick={() => {
                      const id = `p${Date.now()}`;
                      setProducts((prev) => [
                        ...prev,
                        { id, name: `New Product ${prev.length + 1}`, sku: `LS-${1000 + prev.length + 1}`, price: 49, percentage: 30, sales: 0, syndrome: 'Sensitive Scalp' },
                      ]);
                      setActionMessage('Product added to catalog.');
                    }}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    Add Product
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-gray-500">
                        <th className="py-2">Product</th>
                        <th className="py-2">SKU</th>
                        <th className="py-2">Syndrome</th>
                        <th className="py-2">Price</th>
                        <th className="py-2">Sales</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-100">
                          <td className="py-3 font-medium text-gray-900">{product.name}</td>
                          <td className="py-3 text-gray-600">{product.sku}</td>
                          <td className="py-3 text-gray-600">{product.syndrome}</td>
                          <td className="py-3 text-gray-900">${product.price}</td>
                          <td className="py-3 text-gray-900">{product.sales}</td>
                          <td className="py-3">
                            <button
                              onClick={() => {
                                setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, percentage: Math.min(100, p.percentage + 5) } : p)));
                                setActionMessage(`${product.name} recommendation priority increased.`);
                              }}
                              className="rounded border border-purple-200 px-2 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                            >
                              Prioritize
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {businessTab === 'analytics' && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Scalp Syndrome Segment Mix</h3>
                    <button
                      onClick={handleExportCustomerCsv}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Export Segment CSV
                    </button>
                  </div>
                  <div className="space-y-3">
                    {syndromeMix.map((segment) => (
                      <div key={segment.label}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-gray-700">{segment.label}</span>
                          <span className="font-semibold text-purple-700">{segment.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full bg-purple-600" style={{ width: `${segment.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Business Report</h3>
                  <div className="space-y-3 text-sm text-gray-700 mb-4">
                    <div className="rounded bg-gray-50 p-3">Total Revenue: <span className="font-bold">${businessStats.totalRevenue.toLocaleString()}</span></div>
                    <div className="rounded bg-gray-50 p-3">Total Scans: <span className="font-bold">{businessStats.scans}</span></div>
                    <div className="rounded bg-gray-50 p-3">Avg Spend / Visit: <span className="font-bold">${businessStats.avgSpendPerVisit}</span></div>
                    <div className="rounded bg-gray-50 p-3">Top Product: <span className="font-bold">{topProducts[0]?.name ?? '-'}</span></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <button
                      onClick={handleGenerateReport}
                      className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                    >
                      Generate Report
                    </button>
                    <button
                      onClick={() => setActionMessage('PDF generated and downloaded (demo action).')}
                      className="rounded-lg border border-purple-600 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={() => setActionMessage('View-only share link created for 7 days (demo action).')}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:col-span-2"
                    >
                      Create 7-day Share Link
                    </button>
                  </div>
                  {reportGeneratedAt && (
                    <div className="mt-4 rounded bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800">
                      Report generated at {reportGeneratedAt}
                    </div>
                  )}
                </div>
              </div>
            )}

            {businessTab === 'settings' && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Subscription & Billing</h3>
                  <div className="space-y-3 text-sm">
                    <div className="rounded bg-purple-50 border border-purple-100 p-3">
                      Current tier: <span className="font-bold text-purple-700">Professional ($499/year)</span>
                    </div>
                    <button className="w-full rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700">Upgrade to Enterprise</button>
                    <button className="w-full rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50">Manage Stripe Billing</button>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Integrations</h3>
                  <div className="space-y-2">
                    <Link to="/api" className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                      <span className="font-medium text-gray-900">API Keys & Webhooks</span>
                      <Code size={16} className="text-gray-500" />
            </Link>
                    <button
                      onClick={() => setActionMessage('OAuth setup flow (Google/Apple) opened (demo action).')}
                      className="w-full rounded-lg border border-gray-200 p-3 text-left font-medium text-gray-900 hover:bg-gray-50"
                    >
                      OAuth (Google / Apple)
                    </button>
                    <a
                      href={CALENDLY_BOOK_CALL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-900">Book onboarding call</span>
                      <Phone size={16} className="text-gray-500" />
                    </a>
                  </div>
                </div>
            </div>
            )}
          </div>
        )}

        {/* Tabs */}
        {accountType === 'consumer' && (
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('dashboard.tabs.overview')}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('dashboard.tabs.history')}
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'ingredients'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('dashboard.tabs.ingredients')}
          </button>
        </div>
        )}

        {/* Tab Content */}
        {accountType === 'consumer' && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Overall Score Card */}
              <div className="bg-purple-700 rounded-2xl p-8 text-white">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-purple-200 mb-2">{t('dashboard.overview.totalScore')}</div>
                    <div className="text-6xl font-bold mb-4">76/100</div>
                    <div className="flex items-center space-x-2 text-purple-100">
                      <TrendingUp size={20} />
                      <span>{t('dashboard.overview.improved')}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-purple-200 mb-4">{t('dashboard.overview.trend')}</div>
                    <div className="flex items-end space-x-2 h-32">
                      {[...mockHistoryData].reverse().map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-white/30 rounded-t-lg transition-all hover:bg-white/40"
                            style={{ height: `${data.score}%` }}
                          />
                          <div className="text-xs text-purple-200 mt-2">
                            {new Date(data.date).getMonth() + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockMetrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                  >
                    <div className="text-sm text-gray-600 mb-2">{metric.name}</div>
                    <div className="flex items-end justify-between mb-3">
                      <div className="text-3xl font-bold text-gray-900">{metric.current}</div>
                      <div
                        className={`flex items-center space-x-1 text-sm font-semibold ${
                          metric.trend === 'up'
                            ? 'text-green-600'
                            : metric.trend === 'down'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {metric.trend === 'up' && <TrendingUp size={16} />}
                        {metric.trend === 'down' && <TrendingDown size={16} />}
                        {metric.trend === 'stable' && <Minus size={16} />}
                        <span>
                          {metric.trend === 'stable'
                            ? t('dashboard.overview.stable')
                            : metric.current - metric.previous > 0
                            ? `+${metric.current - metric.previous}`
                            : metric.current - metric.previous}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-full rounded-full ${
                          metric.current >= 75
                            ? 'bg-green-500'
                            : metric.current >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${metric.current}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI Insights */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t('dashboard.overview.aiInsights')}</h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">✓</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">{t('dashboard.overview.insight1.title')}</div>
                      <div className="text-sm text-gray-700">
                        {t('dashboard.overview.insight1.desc')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">!</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">{t('dashboard.overview.insight2.title')}</div>
                      <div className="text-sm text-gray-700">
                        {t('dashboard.overview.insight2.desc')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">i</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">{t('dashboard.overview.insight3.title')}</div>
                      <div className="text-sm text-gray-700">
                        {t('dashboard.overview.insight3.desc')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t('dashboard.history.title')}</h2>

                <div className="space-y-4">
                  {[
                    { date: '2026-01-10', time: '14:30', score: 78, status: 'improved' },
                    { date: '2025-12-15', time: '10:15', score: 74, status: 'improved' },
                    { date: '2025-11-20', time: '16:45', score: 72, status: 'stable' },
                    { date: '2025-10-25', time: '11:20', score: 68, status: 'improved' },
                    { date: '2025-09-30', time: '09:30', score: 65, status: 'baseline' },
                  ].map((scan, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Camera className="text-purple-600" size={24} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {new Date(scan.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Calendar className="mr-1" size={14} />
                              {scan.time}
                            </span>
                            <span
                              className={`flex items-center font-semibold ${
                                scan.status === 'improved'
                                  ? 'text-green-600'
                                  : scan.status === 'stable'
                                  ? 'text-gray-600'
                                  : 'text-blue-600'
                              }`}
                            >
                              {scan.status === 'improved' && <TrendingUp className="mr-1" size={14} />}
                              {scan.status === 'stable' && <Minus className="mr-1" size={14} />}
                              {scan.status === 'improved'
                                ? t('dashboard.history.improved')
                                : scan.status === 'stable'
                                ? t('dashboard.overview.stable')
                                : t('dashboard.history.baseline')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">{scan.score}</div>
                          <div className="text-xs text-gray-500">{t('dashboard.history.healthScore')}</div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-purple-600">
                          <Download size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ingredients Tab */}
          {activeTab === 'ingredients' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{t('dashboard.ingredients.title')}</h2>
                  <span className="text-sm text-gray-600">{t('dashboard.ingredients.basedOn')}</span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Niacinamide', match: 95, noteKey: 'dashboard.ingredients.card1' },
                    { name: 'Panthenol (pro-vitamin B5)', match: 92, noteKey: 'dashboard.ingredients.card2' },
                    { name: 'Salicylic acid (low %)', match: 88, noteKey: 'dashboard.ingredients.card3' },
                  ].map((row, index) => (
                    <motion.div
                      key={row.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                            <Leaf size={20} />
                          </div>
                          <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {row.match}% {t('dashboard.ingredients.match')}
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{row.name}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{t(row.noteKey)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <h3 className="font-semibold text-gray-900 mb-3">{t('dashboard.ingredients.whyThese')}</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600">•</span>
                    <span>{t('dashboard.ingredients.reason1')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600">•</span>
                    <span>{t('dashboard.ingredients.reason2')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-600">•</span>
                    <span>{t('dashboard.ingredients.reason3')}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </motion.div>
        )}
      </div>
    </div>
  );
}
