import { motion } from 'motion/react';
import { Users, BarChart3, ShoppingCart, Calendar, TrendingUp, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function SaasPlatform() {
  const { t } = useLanguage();

  const featureKeys = ['customer', 'analytics', 'recommendations', 'appointments', 'tracking', 'inventory'];
  const featureIcons = [
    <Users className="text-purple-600" size={32} />,
    <BarChart3 className="text-blue-600" size={32} />,
    <ShoppingCart className="text-green-600" size={32} />,
    <Calendar className="text-orange-600" size={32} />,
    <TrendingUp className="text-red-600" size={32} />,
    <Check className="text-teal-600" size={32} />,
  ];

  const planKeys = ['starter', 'growth', 'professional', 'business', 'enterprise', 'flagship'];
  const planPrices = [199, 299, 499, 999, 1999, 2999];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users size={16} />
              <span>{t('saas.badge')}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{t('saas.title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('saas.subtitle')}</p>
          </motion.div>
        </div>

        {/* Demo Preview */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('saas.demo.title')}</h2>
            <p className="text-gray-600">{t('saas.demo.subtitle')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">L</span>
                </div>
                <span className="font-semibold">{t('saas.demo.header')}</span>
              </div>
              <div className="text-sm">{t('saas.demo.demoAccount')}</div>
            </div>
            <div className="grid lg:grid-cols-2 gap-6 p-6">
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="text-purple-600" size={24} />
                  <h3 className="text-lg font-bold text-gray-900">{t('saas.demo.customerManagement')}</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                      <span className="text-purple-700 font-semibold">SJ</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Sarah J.</div>
                      <div className="text-sm text-gray-500">{t('saas.demo.lastVisit')}: 2026-01-10</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm text-gray-700 mb-2">{t('saas.demo.healthTrend')}</div>
                    <div className="flex items-end space-x-1 h-20">
                      {[65, 68, 72, 74, 78].map((value, index) => (
                        <div key={index} className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t" style={{ height: `${value}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900">{t('saas.demo.recommendedProducts')}</div>
                    <div className="flex items-center justify-between bg-white rounded px-3 py-2">
                      <span className="text-sm text-gray-700">Oil-Control Shampoo X</span>
                      <span className="text-sm font-semibold text-purple-600">$45</span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded px-3 py-2">
                      <span className="text-sm text-gray-700">Scalp Serum Y</span>
                      <span className="text-sm font-semibold text-purple-600">$68</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">{t('saas.demo.viewReport')}</button>
                  <button className="flex-1 px-4 py-2 bg-white border border-purple-600 text-purple-600 rounded-lg text-sm font-medium">{t('saas.demo.scheduleFollowup')}</button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart3 className="text-blue-600" size={24} />
                  <h3 className="text-lg font-bold text-gray-900">{t('saas.demo.analytics')}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                    <div className="text-sm text-purple-700 mb-1">{t('saas.demo.todayStats')}</div>
                    <div className="text-3xl font-bold text-purple-600">23</div>
                    <div className="text-xs text-purple-600">{t('saas.demo.scansPerformed')}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                    <div className="text-sm text-green-700 mb-1">{t('saas.demo.recommendations')}</div>
                    <div className="text-3xl font-bold text-green-600">$1,240</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                    <div className="text-sm text-blue-700 mb-1">{t('saas.demo.conversionRate')}</div>
                    <div className="text-3xl font-bold text-blue-600">78%</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                    <div className="text-sm text-orange-700 mb-1">{t('saas.demo.newCustomers')}</div>
                    <div className="text-3xl font-bold text-orange-600">5</div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-900 mb-3">{t('saas.demo.topProducts')}</div>
                  <div className="space-y-2">
                    {[{ name: 'Oil-Control Shampoo', sales: 85 }, { name: 'Hair Mask', sales: 72 }, { name: 'Scalp Serum', sales: 68 }].map((product, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{product.name}</span>
                          <span className="text-gray-900 font-semibold">{product.sales}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full" style={{ width: `${product.sales}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 border-t border-gray-200 text-center">
              <button className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold inline-flex items-center">{t('saas.demo.launchDemo')}</button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {featureKeys.map((key, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{featureIcons[index]}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t(`saas.features.${key}.title`)}</h3>
              <p className="text-gray-600">{t(`saas.features.${key}.desc`)}</p>
            </motion.div>
          ))}
        </div>

        {/* Pricing Plans */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('saas.pricing.title')}</h2>
            <p className="text-lg text-gray-600">{t('saas.pricing.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
            {planKeys.map((key, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all relative ${key === 'growth' ? 'ring-2 ring-purple-600' : ''}`}
              >
                {key === 'growth' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-semibold">{t('saas.pricing.growth.popular')}</div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t(`saas.pricing.${key}.name`)}</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-1">${planPrices[index]}</div>
                  <div className="text-sm text-gray-500">{t('saas.pricing.month')}</div>
                  <div className="text-sm text-gray-600 mt-2">{t(`saas.pricing.${key}.users`)}</div>
                </div>
                <ul className="space-y-3 mb-6">
                  {[1, 2, 3, 4].map((fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2">
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-sm text-gray-700">{t(`saas.pricing.${key}.feature${fIdx}`)}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${key === 'growth' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {index < 3 ? t('saas.pricing.startTrial') : t('saas.pricing.contactSales')}
                </button>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">{t('saas.pricing.includes')}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
              <span>{t('saas.pricing.include1')}</span>
              <span>{t('saas.pricing.include2')}</span>
              <span>{t('saas.pricing.include3')}</span>
              <span>{t('saas.pricing.include4')}</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{t('saas.cta.title')}</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">{t('saas.cta.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold">{t('saas.cta.startTrial')}</button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold">{t('saas.cta.bookDemo')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
