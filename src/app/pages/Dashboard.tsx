import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  Camera,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Settings,
  Bell,
  Download,
  Building2,
  User,
  Code,
  Package,
  Phone,
  Leaf,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const mockHistoryData = [
  { date: '2026-01-10', score: 78 },
  { date: '2025-12-15', score: 74 },
  { date: '2025-11-20', score: 72 },
  { date: '2025-10-25', score: 68 },
  { date: '2025-09-30', score: 65 },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'ingredients'>('overview');
  const [accountType, setAccountType] = useState<'consumer' | 'business'>('consumer');
  const { t } = useLanguage();

  const mockMetrics = [
    { name: t('dashboard.overview.hairDensity'), current: 78, previous: 75, trend: 'up' },
    { name: t('dashboard.overview.scalpHealth'), current: 72, previous: 76, trend: 'down' },
    { name: t('dashboard.overview.oilLevel'), current: 68, previous: 68, trend: 'stable' },
    { name: t('dashboard.overview.hairDamage'), current: 65, previous: 70, trend: 'down' },
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {accountType === 'consumer' ? t('dashboard.welcome') : t('dashboard.businessWelcome')}
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
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Link
              to="/api"
              className="group rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 hover:border-blue-300 transition-colors"
            >
              <Code className="text-blue-600 mb-3" size={28} />
              <div className="font-bold text-gray-900 text-lg mb-1">{t('dashboard.businessCardApi')}</div>
              <div className="text-sm text-blue-700 font-semibold group-hover:underline">{t('common.learnMore')} →</div>
            </Link>
            <Link
              to="/saas"
              className="group rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 hover:border-emerald-300 transition-colors"
            >
              <Building2 className="text-emerald-600 mb-3" size={28} />
              <div className="font-bold text-gray-900 text-lg mb-1">{t('dashboard.businessCardSaas')}</div>
              <div className="text-sm text-emerald-700 font-semibold group-hover:underline">{t('common.learnMore')} →</div>
            </Link>
            <Link
              to="/hardware"
              className="group rounded-2xl border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 hover:border-purple-300 transition-colors"
            >
              <Package className="text-purple-600 mb-3" size={28} />
              <div className="font-bold text-gray-900 text-lg mb-1">{t('dashboard.businessCardHardware')}</div>
              <div className="text-sm text-purple-700 font-semibold group-hover:underline">{t('common.learnMore')} →</div>
            </Link>
            <a
              href="mailto:sales@lushair.ai?subject=Lushair%20%E2%80%94%20business%20account"
              className="group rounded-2xl border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6 hover:border-orange-300 transition-colors"
            >
              <Phone className="text-orange-600 mb-3" size={28} />
              <div className="font-bold text-gray-900 text-lg mb-1">{t('dashboard.businessCardContact')}</div>
              <div className="text-sm text-orange-700 font-semibold">{t('common.contactUs')} →</div>
            </a>
            <div className="md:col-span-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-600">
              {t('dashboard.businessRep')}
            </div>
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
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
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
                      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-purple-50/40"
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

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
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
