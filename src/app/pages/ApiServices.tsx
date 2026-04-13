import { useState } from 'react';
import { motion } from 'motion/react';
import { Code, Key, Zap, Check, Copy, Eye, EyeOff, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type PricingTier = 'basic' | 'standard' | 'professional';

export default function ApiServices() {
  const [selectedTier, setSelectedTier] = useState<PricingTier>('standard');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['hairDensity', 'scalpHealth']);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const { t } = useLanguage();

  const pricingPlans = {
    basic: { name: t('api.plans.basic.name'), price: 1999, qps: 50, calls: t('api.plans.basic.calls'), support: t('api.plans.basic.support'), sla: t('api.plans.basic.sla') },
    standard: { name: t('api.plans.standard.name'), price: 4999, qps: 200, calls: t('api.plans.standard.calls'), support: t('api.plans.standard.support'), sla: t('api.plans.standard.sla') },
    professional: { name: t('api.plans.professional.name'), price: 12999, qps: 1000, calls: t('api.plans.professional.calls'), support: t('api.plans.professional.support'), sla: t('api.plans.professional.sla') },
  };

  const metricKeys = ['hairDensity', 'scalpHealth', 'sebum', 'follicle', 'hairLoss', 'dandruff', 'damage', 'recommendations'];

  const calculateTotalPrice = () => {
    return pricingPlans[selectedTier].price * selectedMetrics.length;
  };

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  const handleTestApi = () => {
    setTimeout(() => {
      setApiResponse({
        hair_density: { score: 72, follicles_per_cm2: 185, status: 'normal' },
        scalp_health: { score: 68, sebum_level: 'high', inflammation: 'mild' },
      });
    }, 1500);
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Code size={16} />
              <span>{t('api.badge')}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{t('api.title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('api.subtitle')}</p>
          </motion.div>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {(Object.entries(pricingPlans) as [PricingTier, typeof pricingPlans.basic][]).map(([key, plan], idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
              onClick={() => setSelectedTier(key)}
              className={`bg-white rounded-2xl p-8 cursor-pointer transition-all border-2 relative ${
                selectedTier === key ? 'border-purple-600 shadow-xl scale-105' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {key === 'standard' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                  {t('api.plans.standard.recommended')}
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-purple-600 mb-1">${plan.price.toLocaleString()}</div>
                <div className="text-sm text-gray-500">{t('api.plans.basic.perMetric')}</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start space-x-2"><Zap className="text-purple-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{plan.qps} {t('api.plans.basic.qps')}</span></li>
                <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{plan.calls}</span></li>
                <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{plan.support}</span></li>
                <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{plan.sla}</span></li>
              </ul>
              <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${selectedTier === key ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {selectedTier === key ? t('api.plans.selected') : t('api.plans.select')}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Available Metrics */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('api.metrics.title')}</h2>
          <p className="text-gray-600 mb-6">{t('api.metrics.subtitle')}</p>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {metricKeys.map((key) => (
              <button
                key={key}
                onClick={() => handleMetricToggle(key)}
                className={`flex items-center justify-between px-6 py-4 rounded-xl border-2 transition-all ${
                  selectedMetrics.includes(key) ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium text-gray-900">{t(`api.metrics.${key}`)}</span>
                {selectedMetrics.includes(key) && <Check className="text-purple-600" size={20} />}
              </button>
            ))}
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600 mb-1">{t('api.metrics.selected').replace('{count}', String(selectedMetrics.length))}</div>
                <div className="text-3xl font-bold text-gray-900">{t('api.metrics.totalPrice').replace('{price}', calculateTotalPrice().toLocaleString())}</div>
              </div>
              <button className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">{t('api.metrics.startTrial')}</button>
            </div>
            <p className="text-sm text-gray-500 mt-4">{t('api.metrics.trialNote')}</p>
          </div>
        </div>

        {/* API Documentation Preview */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 mb-16 text-white">
          <h2 className="text-2xl font-bold mb-6">{t('api.docs.title')}</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-3">{t('api.docs.authentication')}</h3>
              <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="text-gray-400 mb-2">{t('api.docs.authComment')}</div>
                <div><span className="text-green-400">Authorization:</span> <span className="text-yellow-300">"Bearer YOUR_API_KEY"</span></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-3">{t('api.docs.endpoint')}</h3>
              <p className="text-gray-400 mb-3">{t('api.docs.endpointDesc')}</p>
              <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{`curl -X POST https://api.lushair.ai/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image": "base64_encoded_image",
    "metrics": ["hair_density", "scalp_health"],
    "user_metadata": {
      "age": 28,
      "gender": "female"
    }
  }'`}</pre>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-3">{t('api.docs.responseExample')}</h3>
              <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{`{
  "hair_density": {
    "score": 72,
    "follicles_per_cm2": 185,
    "status": "normal"
  },
  "scalp_health": {
    "score": 68,
    "sebum_level": "high",
    "inflammation": "mild"
  }
}`}</pre>
              </div>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-semibold">{t('api.docs.viewFullDocs')}</button>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">{t('api.docs.getApiKey')}</button>
          </div>
        </div>

        {/* Interactive API Playground */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('api.playground.title')}</h2>
          <p className="text-gray-600 mb-6">{t('api.playground.subtitle')}</p>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('api.playground.apiKey')}</label>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input type={showApiKey ? 'text' : 'password'} value="sk-test-xxxxxxxxxxxx" readOnly className="w-full px-4 py-3 rounded-lg border border-gray-300 font-mono text-sm" />
                  <button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"><Copy size={18} /></button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('api.playground.uploadImage')}</label>
              <input type="file" accept="image/*" className="w-full px-4 py-3 rounded-lg border border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('api.playground.selectMetrics')}</label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center space-x-2"><input type="checkbox" defaultChecked className="rounded" /><span className="text-sm text-gray-700">{t('api.playground.hairDensity')}</span></label>
                <label className="flex items-center space-x-2"><input type="checkbox" defaultChecked className="rounded" /><span className="text-sm text-gray-700">{t('api.playground.scalpHealth')}</span></label>
              </div>
            </div>
            <button onClick={handleTestApi} className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center">
              <Send className="mr-2" size={20} />{t('api.playground.sendRequest')}
            </button>
            {apiResponse && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 rounded-lg p-4 text-white font-mono text-sm overflow-x-auto">
                <div className="text-green-400 mb-2">{t('api.playground.responseComment')}</div>
                <pre className="text-gray-300">{JSON.stringify(apiResponse, null, 2)}</pre>
              </motion.div>
            )}
          </div>
        </div>

        {/* API Keys Management */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('api.keys.title')}</h2>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center">
              <Key className="mr-2" size={18} />{t('api.keys.createNew')}
            </button>
          </div>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-mono text-lg font-semibold text-gray-900 mb-1">sk-prod-1a2b3c********</div>
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">{t('api.keys.production')}</span>
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700"><Copy size={18} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><div className="text-gray-500">{t('api.keys.created')}</div><div className="text-gray-900 font-medium">2026-01-15</div></div>
                <div><div className="text-gray-500">{t('api.keys.lastUsed')}</div><div className="text-gray-900 font-medium">2h ago</div></div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-700">{t('api.keys.requestsToday')}</span>
                  <span className="font-semibold text-gray-900">2,847 / 100,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="w-[3%] h-full bg-purple-600 rounded-full" /></div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-mono text-lg font-semibold text-gray-900 mb-1">sk-test-4d5e6f********</div>
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">{t('api.keys.testing')}</span>
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700"><Copy size={18} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><div className="text-gray-500">{t('api.keys.created')}</div><div className="text-gray-900 font-medium">2026-01-10</div></div>
                <div><div className="text-gray-500">{t('api.keys.lastUsed')}</div><div className="text-gray-900 font-medium">{t('api.keys.neverUsed')}</div></div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-orange-600">{t('api.keys.testLimit')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
