import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Smartphone, MessageCircle, RefreshCw, ArrowLeft, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AppIntro() {
  const { t } = useLanguage();

  const extraBullets = ['extra1', 'extra2', 'extra3'] as const;

  const features = [
    { icon: RefreshCw, titleKey: 'appIntro.feature1Title', descKey: 'appIntro.feature1Desc' },
    { icon: MessageCircle, titleKey: 'appIntro.feature2Title', descKey: 'appIntro.feature2Desc' },
    { icon: Smartphone, titleKey: 'appIntro.feature3Title', descKey: 'appIntro.feature3Desc' },
  ] as const;

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          to="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8 text-sm font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          {t('appIntro.backHome')}
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-800 mb-6">
            <Sparkles size={16} />
            {t('appIntro.badge')}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('appIntro.title')}</h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl">{t('appIntro.subtitle')}</p>

          <div className="grid gap-4 md:grid-cols-3 mb-12">
            {features.map(({ icon: Icon, titleKey, descKey }) => (
              <div
                key={titleKey}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white">
                  <Icon size={20} />
                </div>
                <h2 className="font-bold text-gray-900 mb-2">{t(titleKey)}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-8 mb-12">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t('appIntro.extraLead')}</h2>
            <ul className="space-y-3 text-sm text-gray-700 leading-relaxed list-disc list-inside">
              {extraBullets.map((k) => (
                <li key={k}>{t(`appIntro.${k}`)}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white/80 p-8 text-center">
            <p className="text-sm text-gray-500 mb-6">{t('appIntro.storesNote')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/try-free"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
              >
                {t('appIntro.tryWeb')}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
