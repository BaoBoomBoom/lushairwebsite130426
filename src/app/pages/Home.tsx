import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Sparkles,
  Shield,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  Star,
  Code,
  Building2,
  ShoppingCart,
  Scan,
  Activity,
  Ruler,
  Smartphone,
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'consumers' | 'business'>('consumers');
  const { t } = useLanguage();

  const titleSerif = t('home.hero.titleSerif');
  const titleSans = t('home.hero.titleSans');
  const useZipHeadline = !titleSerif.startsWith('home.hero');
  const subShort = t('home.hero.subtitleShort');
  const heroSub = !subShort.startsWith('home.hero') ? subShort : t('home.hero.subtitle');
  const valueBody = t('home.hero.valueBody');
  const showValueBox = !valueBody.startsWith('home.hero');
  const shopLabel = t('home.hero.shopDevices');
  const showShopCta = !shopLabel.startsWith('home.hero');

  const accent = '#7622ff';

  const precisionCards = [
    { icon: Scan, titleKey: 'home.precision.card1Title', descKey: 'home.precision.card1Desc', color: 'text-violet-400' },
    { icon: Activity, titleKey: 'home.precision.card2Title', descKey: 'home.precision.card2Desc', color: 'text-rose-400' },
    { icon: Ruler, titleKey: 'home.precision.card3Title', descKey: 'home.precision.card3Desc', color: 'text-teal-400' },
  ] as const;

  return (
    <div className="pt-16">
      {/* Hero — dark clinical + grid (balanced with light sections below) */}
      <section className="relative overflow-hidden bg-[#0A0A0A] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-950/40 via-transparent to-[#0A0A0A]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-violet-200">
                <Sparkles size={16} className="text-[#b388ff]" />
                <span>{t('home.hero.badge')}</span>
              </div>

              <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
                {useZipHeadline ? (
                  <>
                    <span className="font-serif font-normal text-[#F4F4F9]">{titleSerif}</span>
                    <br />
                    <span className="font-sans tracking-tight text-white">{titleSans}</span>
                  </>
                ) : (
                  <>
                    <span className="text-white">{t('home.hero.title')}</span>
                    <br />
                    <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
                      {t('home.hero.titleHighlight')}
                    </span>
                  </>
                )}
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-[#F4F4F9]/75 whitespace-pre-line">
                {heroSub}
              </p>

              {showValueBox && (
                <div
                  className="max-w-md border border-[#7622ff]/40 bg-[#7622ff]/10 p-4 rounded-lg"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#7622ff]" />
                    <span className="text-sm font-medium text-[#c9a6ff]">{t('home.hero.valueTag')}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#F4F4F9]/80">{valueBody}</p>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/try-free"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#7622ff] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:bg-[#6520d9]"
                >
                  <Sparkles size={18} />
                  {t('home.hero.tryFree')}
                  <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
                </Link>
                {showShopCta && (
                  <Link
                    to="/shop"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#7622ff]/80 bg-transparent px-7 py-3.5 text-sm font-semibold text-[#e8d9ff] transition hover:bg-[#7622ff]/15"
                  >
                    <ShoppingCart size={18} />
                    {shopLabel}
                  </Link>
                )}
                <Link
                  to="/hardware"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Building2 size={18} />
                  {t('home.hero.forBusiness')}
                </Link>
              </div>

              <p className="text-xs text-[#F4F4F9]/45">{t('home.hero.webBased')}</p>
            </motion.div>

            {/* Visual — photo + HUD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-neutral-100 to-white p-3 shadow-2xl shadow-black/40 sm:p-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#7622ff]/10 to-transparent pointer-events-none" />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1732203191374-6c8304b55d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJlYXV0aWZ1bCUyMGhhaXIlMjBzY2FscCUyMGhlYWx0aHxlbnwxfHx8fDE3NzU2MzIwMjh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt=""
                  className="relative z-0 h-[min(420px,55vh)] w-full rounded-lg object-cover sm:h-[480px]"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* Precision strip — reference TechnicalGallery, kept airy */}
      <section className="border-b border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {t('home.precision.title')}
            </h2>
            <p className="mt-3 text-base text-gray-600 sm:text-lg">{t('home.precision.subtitle')}</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {precisionCards.map((card, index) => (
              <motion.div
                key={card.titleKey}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-slate-50/80 shadow-sm transition hover:border-violet-200 hover:shadow-md"
              >
                <div className="relative flex h-36 items-center justify-center bg-[#0A0A0A]">
                  <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage: `linear-gradient(rgba(118,34,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(118,34,255,0.35) 1px, transparent 1px)`,
                      backgroundSize: '16px 16px',
                    }}
                  />
                  <card.icon className={`relative z-10 h-10 w-10 ${card.color}`} strokeWidth={1.5} />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-gray-900">{t(card.titleKey)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{t(card.descKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props Tabs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.tabs.title')}</h2>
            <p className="text-lg text-gray-600">{t('home.tabs.subtitle')}</p>
          </div>

          {/* Tabs — minimal pill switcher */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-full border border-gray-200/80 bg-gray-100/80 p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('consumers')}
                className={`rounded-full px-7 py-2.5 text-sm font-semibold transition-all duration-200 sm:px-10 sm:py-3 sm:text-[15px] ${
                  activeTab === 'consumers'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {t('home.tabs.consumers')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('business')}
                className={`rounded-full px-7 py-2.5 text-sm font-semibold transition-all duration-200 sm:px-10 sm:py-3 sm:text-[15px] ${
                  activeTab === 'business'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {t('home.tabs.business')}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'consumers' ? (
              <div>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 mb-10">
                  <Link
                    to="/app"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
                  >
                    <Smartphone size={18} className="text-violet-600" />
                    {t('home.consumers.ctas.downloadApp')}
                  </Link>
                  <Link
                    to="/shop"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
                  >
                    <ShoppingCart size={18} className="text-violet-600" />
                    {t('home.consumers.ctas.buyDevices')}
                  </Link>
                  <Link
                    to="/try-free"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7622ff] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#6520d9]"
                  >
                    <Sparkles size={18} />
                    {t('home.consumers.ctas.freeAnalysis')}
                  </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                      <Shield className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('home.consumers.medical.title')}</h3>
                    <p className="text-gray-600 mb-4">{t('home.consumers.medical.desc')}</p>
                    <p className="text-xs text-gray-500 mb-4">{t('home.consumers.medical.note')}</p>
                    <Link to="/try-free" className="text-purple-600 font-semibold flex items-center hover:underline">
                      {t('home.consumers.ctas.freeAnalysis')} <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <TrendingUp className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('home.consumers.tracking.title')}</h3>
                    <p className="text-gray-600 mb-4">{t('home.consumers.tracking.desc')}</p>
                    <Link to="/app" className="text-blue-600 font-semibold flex items-center hover:underline">
                      {t('home.consumers.ctas.downloadApp')} <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                      <Sparkles className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('home.consumers.personalized.title')}</h3>
                    <p className="text-gray-600 mb-4">{t('home.consumers.personalized.desc')}</p>
                    <Link to="/shop" className="text-green-600 font-semibold flex items-center hover:underline">
                      {t('home.consumers.ctas.buyDevices')} <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                      <Zap className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('home.business.hardware.title')}</h3>
                    <p className="text-gray-600 mb-4">{t('home.business.hardware.desc')}</p>
                    <Link to="/hardware" className="text-purple-600 font-semibold flex items-center hover:underline">
                      {t('home.business.hardware.cta')} <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-300 ring-2 ring-blue-100 shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        {t('home.business.api.badge')}
                      </span>
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <Shield className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('home.business.api.title')}</h3>
                    <p className="text-gray-600 mb-4">{t('home.business.api.desc')}</p>
                    <Link
                      to="/api"
                      className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      {t('home.business.api.cta')} <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-emerald-300 ring-2 ring-emerald-100 shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {t('home.business.saas.badge')}
                      </span>
                    </div>
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                      <Users className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('home.business.saas.title')}</h3>
                    <p className="text-gray-600 mb-4">{t('home.business.saas.desc')}</p>
                    <Link
                      to="/saas"
                      className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-sm"
                    >
                      {t('home.business.saas.cta')} <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-gradient-to-r from-slate-50 to-purple-50/40 p-6 md:p-8">
                  <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    {t('home.business.apiSaasStrip.title')}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Link
                      to="/api"
                      className="group flex items-start gap-4 rounded-xl bg-white border-2 border-blue-200 p-5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <Code size={22} />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="font-bold text-gray-900 text-lg">{t('home.business.apiSaas.apiTitle')}</div>
                        <p className="text-sm text-gray-600 mt-1">{t('home.business.apiSaas.apiBlurb')}</p>
                        <span className="mt-2 inline-flex items-center text-sm font-semibold text-blue-600 group-hover:underline">
                          {t('home.business.apiSaas.apiCta')} <ArrowRight size={14} className="ml-1" />
                        </span>
                      </div>
                    </Link>
                    <Link
                      to="/saas"
                      className="group flex items-start gap-4 rounded-xl bg-white border-2 border-emerald-200 p-5 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                        <Building2 size={22} />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="font-bold text-gray-900 text-lg">{t('home.business.apiSaas.saasTitle')}</div>
                        <p className="text-sm text-gray-600 mt-1">{t('home.business.apiSaas.saasBlurb')}</p>
                        <span className="mt-2 inline-flex items-center text-sm font-semibold text-emerald-700 group-hover:underline">
                          {t('home.business.apiSaas.saasCta')} <ArrowRight size={14} className="ml-1" />
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.stats.title')}</h2>
            <p className="text-lg text-gray-600">{t('home.stats.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
              <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">{t('home.stats.users')}</div>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">1,000+</div>
              <div className="text-gray-600">{t('home.stats.businesses')}</div>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
              <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">{t('home.stats.satisfaction')}</div>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
              <div className="text-4xl font-bold text-orange-600 mb-2">50M+</div>
              <div className="text-gray-600">{t('home.stats.analyses')}</div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            {['user1', 'user2', 'user3'].map((user, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{t(`home.testimonials.${user}.content`)}</p>
                <div>
                  <div className="font-semibold text-gray-900">{t(`home.testimonials.${user}.name`)}</div>
                  <div className="text-sm text-gray-500">{t(`home.testimonials.${user}.role`)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              {t('home.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/try-free"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg font-semibold"
              >
                <Sparkles className="mr-2" size={20} />
                {t('home.cta.tryFree')}
              </Link>
              <Link
                to="/hardware"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl hover:bg-white/10 transition-all duration-200 font-semibold"
              >
                {t('home.cta.learnBusiness')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}