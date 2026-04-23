import { motion } from 'motion/react';
import { Check, Clock, FileText, Factory, TestTube, Package, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CALENDLY_BOOK_CALL_URL, CALENDLY_FACTORY_VISIT_URL } from '../../constants/calendly';

export default function Implementation() {
  const { t } = useLanguage();

  const stepIcons = [
    <ArrowRight className="text-purple-600" size={32} />,
    <TestTube className="text-blue-600" size={32} />,
    <FileText className="text-green-600" size={32} />,
    <Factory className="text-orange-600" size={32} />,
    <Check className="text-teal-600" size={32} />,
    <Package className="text-red-600" size={32} />,
  ];

  const steps = [1, 2, 3, 4, 5, 6].map((num) => ({
    step: num,
    title: t(`implementation.steps.step${num}.title`),
    duration: t(`implementation.steps.step${num}.duration`),
    icon: stepIcons[num - 1],
    tasks: [1, 2, 3, ...(num === 6 ? [4] : [])].map((taskNum) => t(`implementation.steps.step${num}.task${taskNum}`)),
    cta: num <= 2 ? t(`implementation.steps.step${num}.cta`) : null,
    ctaHref: num === 1 ? CALENDLY_BOOK_CALL_URL : num === 2 ? CALENDLY_FACTORY_VISIT_URL : null,
  }));

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Clock size={16} />
              <span>{t('implementation.badge')}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{t('implementation.title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('implementation.subtitle')}</p>
          </motion.div>
        </div>

        {/* Timeline Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('implementation.overview.title')}</h2>
            <p className="text-4xl font-bold text-purple-600">{t('implementation.overview.weeks')}</p>
            <p className="text-gray-600 mt-2">{t('implementation.overview.months')}</p>
          </div>

          {/* Progress Bar */}
          <div className="relative mb-12">
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full -translate-y-1/2" />
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex flex-col items-center"
                  style={{ zIndex: 10 }}
                >
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mb-2 shadow-lg">{step.step}</div>
                  <div className="text-xs text-gray-600 text-center w-20">{step.duration}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex-shrink-0">{step.icon}</div>
                  <div>
                    <div className="text-sm text-gray-500">{t('implementation.gantt.step')} {step.step}</div>
                    <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="text-gray-400" size={16} />
                  <span className="text-sm font-medium text-gray-600">{step.duration}</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {step.tasks.map((task, tIndex) => (
                    <li key={tIndex} className="flex items-start space-x-2">
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-sm text-gray-700">{task}</span>
                    </li>
                  ))}
                </ul>
                {step.cta && step.ctaHref && (
                  <a
                    href={step.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    {step.cta}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive Gantt Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('implementation.gantt.title')}</h2>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const widths = [15, 8, 8, 12, 12, 45];
              const offsets = [0, 15, 23, 31, 43, 55];
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-32 flex-shrink-0">
                    <div className="text-sm font-medium text-gray-900">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.duration}</div>
                  </div>
                  <div className="flex-1 relative h-8">
                    <div className="absolute inset-0 bg-gray-100 rounded" />
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${widths[index]}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="absolute h-full bg-purple-600 rounded"
                      style={{ left: `${offsets[index]}%` }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                        {t('implementation.gantt.step')} {step.step}
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <a
              href={CALENDLY_BOOK_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              {t('implementation.gantt.bookCall')}
            </a>
          </div>
        </div>

        {/* Decision Tree */}
        <div className="bg-purple-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('implementation.decision.title')}</h2>
            <p className="text-gray-600">{t('implementation.decision.subtitle')}</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block bg-white rounded-xl p-6 shadow-md">
                <div className="text-lg font-semibold text-gray-900 mb-4">{t('implementation.decision.question1')}</div>
                <div className="flex space-x-4">
                  <div className="flex-1 bg-green-100 text-green-700 px-6 py-3 rounded-lg font-semibold">{t('implementation.decision.yes')}</div>
                  <div className="flex-1 bg-red-100 text-red-700 px-6 py-3 rounded-lg font-semibold">{t('implementation.decision.no')}</div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="bg-white rounded-xl p-6 shadow-md mb-4">
                  <div className="text-base font-semibold text-gray-900 mb-4">{t('implementation.decision.question2')}</div>
                  <div className="space-y-3">
                    <div className="bg-purple-50 border-2 border-purple-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-purple-600">{t('implementation.decision.apiService')}</span>
                        <Check className="text-purple-600" size={20} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{t('implementation.decision.apiPrice')}</div>
                      <div className="text-sm text-gray-600">{t('implementation.decision.apiDesc')}</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="font-semibold text-blue-600 mb-2">{t('implementation.decision.bundle')}</div>
                      <div className="text-lg font-bold text-gray-900 mb-1">{t('implementation.decision.bundlePrice')}</div>
                      <div className="text-sm text-gray-600">{t('implementation.decision.bundleDesc')}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white rounded-xl p-6 shadow-md mb-4">
                  <div className="text-base font-semibold text-gray-900 mb-4">{t('implementation.decision.question3')}</div>
                  <div className="space-y-3">
                    <div className="bg-green-50 border-2 border-green-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-green-600">{t('implementation.decision.fullPackage')}</span>
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">{t('implementation.decision.best')}</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600 mb-2">{t('implementation.decision.fullPrice')}</div>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>{t('implementation.decision.fullItem1')}</li>
                        <li>{t('implementation.decision.fullItem2')}</li>
                        <li>{t('implementation.decision.fullItem3')}</li>
                        <li>{t('implementation.decision.fullItem4')}</li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="font-semibold text-orange-600 mb-2">{t('implementation.decision.basicPackage')}</div>
                      <div className="text-lg font-bold text-gray-900 mb-2">{t('implementation.decision.basicPrice')}</div>
                      <ul className="space-y-1 text-sm text-gray-700 mb-2">
                        <li>{t('implementation.decision.basicItem1')}</li>
                        <li>{t('implementation.decision.basicItem2')}</li>
                      </ul>
                      <div className="text-xs text-orange-600 font-semibold">{t('implementation.decision.basicNote')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <a
              href={CALENDLY_BOOK_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              {t('implementation.decision.contactSales')}
            </a>
          </div>
        </div>

        {/* Case Studies */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('implementation.cases.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {['case1', 'case2', 'case3'].map((caseKey, index) => (
              <motion.div
                key={caseKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-purple-50 rounded-xl p-6 border border-purple-100"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t(`implementation.cases.${caseKey}.company`)}</h3>
                <div className="text-sm text-gray-600 mb-4">
                  <div>{t(`implementation.cases.${caseKey}.type`)} - {t(`implementation.cases.${caseKey}.locations`)}</div>
                  <div className="flex items-center mt-1">
                    <Clock className="mr-1" size={14} />
                    {t(`implementation.cases.${caseKey}.timeline`)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-gray-900 text-sm mb-2">{t('implementation.cases.keyResults')}</div>
                  {[1, 2, 3].map((rIdx) => (
                    <div key={rIdx} className="flex items-start space-x-2">
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-sm text-gray-700">{t(`implementation.cases.${caseKey}.result${rIdx}`)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
