import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Star, Check, ArrowRight, Phone, Bell } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart, Product } from '../contexts/CartContext';
import { LUSHAIR_ONE_PRODUCT_IMAGE_URL } from '../../constants/productImages';
import { CALENDLY_BOOK_CALL_URL } from '../../constants/calendly';
import lushairProImg from '@/assets/products/lushair-pro.png';
import lushairStudioWifiScreen from '@/assets/products/lushair-studio-wifi-screen.png';
import lushairStudioPlugIn from '@/assets/products/lushair-studio-plug-in.png';
import lushairStudioWifiMirror from '@/assets/products/lushair-studio-wifi-mirror.png';

type PurchaseMode = 'buy' | 'coming_soon' | 'book_call';

const products: (Product & {
  series: 'one' | 'pro' | 'studio';
  features: string[];
  accentColor: string;
  badgeText?: string;
  detailPath: string;
  purchaseMode: PurchaseMode;
  /** Other Studio SKUs to show on consult-only cards */
  siblingLabels?: string[];
})[] = [
  {
    id: 'lushair-one',
    name: 'Lushair One',
    nameKey: 'shop.products.lushairOne.name',
    price: 99,
    image: LUSHAIR_ONE_PRODUCT_IMAGE_URL,
    category: 'device',
    description: 'Single-spectrum with manual focus. Most popular among users with hair loss concerns.',
    descKey: 'shop.products.lushairOne.desc',
    stock: 50,
    series: 'one',
    features: ['Single-spectrum imaging', 'Manual focus control', '20MP medical-grade sensor'],
    accentColor: 'purple',
    badgeText: 'In stock — ships now',
    detailPath: '/products/one',
    purchaseMode: 'buy',
  },
  {
    id: 'lushair-pro',
    name: 'Lushair Pro',
    nameKey: 'shop.products.lushairPro.name',
    price: 199,
    image: lushairProImg,
    category: 'device',
    description: 'Three-spectrum with auto focus. Perfect for users with scalp concerns and premium hair care needs.',
    descKey: 'shop.products.lushairPro.desc',
    stock: 0,
    series: 'pro',
    features: ['Tri-spectral imaging (White/UV/Polarised)', 'AI-powered auto-focus', 'Clinical-level insights'],
    accentColor: 'blue',
    badgeText: 'Coming soon',
    detailPath: '/products/pro',
    purchaseMode: 'coming_soon',
  },
  {
    id: 'lushair-studio-wifi-screen',
    name: 'Lushair Studio (WiFi + Screen)',
    nameKey: 'shop.products.lushairStudioWifiScreen.name',
    price: 1899,
    image: lushairStudioWifiScreen,
    category: 'device',
    description: 'Three-spectrum, auto focus, optional 200X LED camera. WiFi connectivity with integrated screen.',
    descKey: 'shop.products.lushairStudioWifiScreen.desc',
    stock: 0,
    series: 'studio',
    features: ['200X LED magnification', 'WiFi integrated screen', 'Tri-spectral auto-focus'],
    accentColor: 'indigo',
    badgeText: 'Consult to order',
    detailPath: '/products/studio',
    purchaseMode: 'book_call',
    siblingLabels: ['Plug-in Screen', 'WiFi Mirror'],
  },
  {
    id: 'lushair-studio-plugin',
    name: 'Lushair Studio (Plug-in Screen)',
    nameKey: 'shop.products.lushairStudioPlugIn.name',
    price: 1699,
    image: lushairStudioPlugIn,
    category: 'device',
    description: 'Professional grade with plug-in screen. Three-spectrum analysis with 200X magnification option.',
    descKey: 'shop.products.lushairStudioPlugIn.desc',
    stock: 0,
    series: 'studio',
    features: ['200X LED magnification', '11" plug-in screen', 'Professional grade'],
    accentColor: 'indigo',
    badgeText: 'Consult to order',
    detailPath: '/products/studio',
    purchaseMode: 'book_call',
    siblingLabels: ['WiFi + Screen', 'WiFi Mirror'],
  },
  {
    id: 'lushair-studio-mirror',
    name: 'Lushair Studio (WiFi Mirror)',
    nameKey: 'shop.products.lushairStudioMirror.name',
    price: 2099,
    image: lushairStudioWifiMirror,
    category: 'device',
    description: 'Premium mirror design with WiFi. Three-spectrum analysis meets elegant salon aesthetics.',
    descKey: 'shop.products.lushairStudioMirror.desc',
    stock: 0,
    series: 'studio',
    features: ['200X LED magnification', 'WiFi mirror display', 'Salon-grade aesthetics'],
    accentColor: 'violet',
    badgeText: 'Consult to order',
    detailPath: '/products/studio',
    purchaseMode: 'book_call',
    siblingLabels: ['WiFi + Screen', 'Plug-in Screen'],
  },
];

type TabType = 'all' | 'one' | 'pro' | 'studio';

const accentClasses: Record<string, { bg: string; text: string; border: string; btn: string; light: string }> = {
  purple: {
    bg: 'bg-purple-600',
    text: 'text-purple-600',
    border: 'border-purple-600',
    btn: 'bg-purple-600 hover:bg-purple-700',
    light: 'bg-purple-50',
  },
  blue: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-600',
    btn: 'bg-blue-600 hover:bg-blue-700',
    light: 'bg-blue-50',
  },
  indigo: {
    bg: 'bg-indigo-600',
    text: 'text-indigo-600',
    border: 'border-indigo-600',
    btn: 'bg-indigo-600 hover:bg-indigo-700',
    light: 'bg-indigo-50',
  },
  violet: {
    bg: 'bg-violet-600',
    text: 'text-violet-600',
    border: 'border-violet-600',
    btn: 'bg-violet-600 hover:bg-violet-700',
    light: 'bg-violet-50',
  },
};

const tabs: { id: TabType; label: string; sublabel: string }[] = [
  { id: 'all', label: 'All', sublabel: 'Full range' },
  { id: 'one', label: 'One', sublabel: 'From $99' },
  { id: 'pro', label: 'Pro', sublabel: '$199' },
  { id: 'studio', label: 'Studio', sublabel: 'From $1,699' },
];

export default function Shop() {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredProducts =
    activeTab === 'all'
      ? products
      : products.filter((p) => p.series === activeTab);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4"
          >
            <ShoppingCart size={16} className="mr-2" />
            {t('shop.badge')}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            {t('shop.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t('shop.subtitle')}
          </motion.p>
        </div>

        {/* Tabs: One / Pro / Studio */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gray-900 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10 flex flex-col items-center">
                  <span className="font-bold text-sm">{tab.label}</span>
                  <span className={`text-xs mt-0.5 ${activeTab === tab.id ? 'text-gray-400' : 'text-gray-400'}`}>
                    {tab.sublabel}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product, index) => {
              const accent = accentClasses[product.accentColor];
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 8 }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Product Image */}
                  <div className={`relative aspect-[4/3] overflow-hidden bg-gray-50`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-6"
                    />
                    {product.purchaseMode === 'buy' && product.stock > 0 && product.stock < 12 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Low Stock
                      </div>
                    )}
                    {product.badgeText && (
                      <div className={`absolute top-3 right-3 ${accent.bg} text-white px-3 py-1 rounded-full text-xs font-semibold shadow`}>
                        {product.badgeText}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-2">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">
                        {product.name}
                      </h3>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} className="text-yellow-400 fill-current" />
                      ))}
                      <span className="text-xs text-gray-500 ml-2">(4.9)</span>
                    </div>

                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                      {t(product.descKey)}
                    </p>

                    {/* Key Features */}
                    <div className="mb-4 space-y-1.5">
                      {product.features.map((feat) => (
                        <div key={feat} className="flex items-center text-xs text-gray-600 gap-2">
                          <Check size={12} className={`${accent.text} flex-shrink-0`} strokeWidth={3} />
                          {feat}
                        </div>
                      ))}
                    </div>

                    {product.purchaseMode === 'book_call' && product.siblingLabels && (
                      <div className="mb-4 rounded-lg bg-slate-50 border border-slate-100 p-3">
                        <div className="text-xs font-semibold text-gray-700 mb-1.5">{t('shop.otherStudioModels')}</div>
                        <ul className="text-xs text-gray-600 space-y-0.5 list-disc list-inside">
                          {product.siblingLabels.map((label) => (
                            <li key={label}>Lushair Studio ({label})</li>
                          ))}
                        </ul>
                        <p className="text-xs text-gray-500 mt-2">{t('shop.bookCallSubtitle')}</p>
                      </div>
                    )}

                    {/* Price and Actions */}
                    <div className="pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <div className={`text-2xl font-black ${accent.text}`}>
                            From ${product.price.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {product.purchaseMode === 'buy'
                              ? `${t('shop.inStock')}: ${product.stock}`
                              : product.purchaseMode === 'coming_soon'
                                ? t('shop.comingSoon')
                                : t('shop.bookCall')}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {product.purchaseMode === 'buy' && (
                          <>
                            <button
                              onClick={() => addToCart(product)}
                              disabled={product.stock === 0}
                              className={`flex-1 py-2.5 ${accent.btn} text-white rounded-lg transition-colors font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-1.5`}
                            >
                              <ShoppingCart size={14} />
                              {t('shop.addToCart')}
                            </button>
                            <Link
                              to={product.detailPath}
                              className={`px-3 py-2.5 border-2 ${accent.border} ${accent.text} rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center justify-center`}
                            >
                              <ArrowRight size={14} />
                            </Link>
                          </>
                        )}
                        {product.purchaseMode === 'coming_soon' && (
                          <>
                            <button
                              type="button"
                              disabled
                              className="flex-1 py-2.5 bg-gray-200 text-gray-600 rounded-lg font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-1.5"
                            >
                              <Bell size={14} />
                              {t('shop.comingSoon')}
                            </button>
                            <Link
                              to={product.detailPath}
                              className={`px-3 py-2.5 border-2 ${accent.border} ${accent.text} rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center justify-center`}
                            >
                              <ArrowRight size={14} />
                            </Link>
                          </>
                        )}
                        {product.purchaseMode === 'book_call' && (
                          <>
                            <a
                              href={CALENDLY_BOOK_CALL_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex-1 py-2.5 ${accent.btn} text-white rounded-lg transition-colors font-semibold text-sm flex items-center justify-center gap-1.5`}
                            >
                              <Phone size={14} />
                              {t('shop.bookCall')}
                            </a>
                            <Link
                              to={product.detailPath}
                              className={`px-3 py-2.5 border-2 ${accent.border} ${accent.text} rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center justify-center`}
                            >
                              <ArrowRight size={14} />
                            </Link>
                          </>
                        )}
                      </div>

                      <Link
                        to={product.detailPath}
                        className={`mt-2 block text-center text-xs ${accent.text} hover:underline font-medium`}
                      >
                        View full details →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Info Banner */}
        <div className="mt-16 bg-purple-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">{t('shop.banner.title')}</h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">{t('shop.banner.subtitle')}</p>
          <a
            href={CALENDLY_BOOK_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 mb-8 px-6 py-3 rounded-xl bg-white text-purple-800 font-semibold text-sm hover:bg-purple-50 transition-colors"
          >
            <Phone size={18} />
            {t('shop.bookCall')}
          </a>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center">
              <Check className="mr-2" size={20} />
              <span>{t('shop.banner.feature1')}</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2" size={20} />
              <span>{t('shop.banner.feature2')}</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2" size={20} />
              <span>{t('shop.banner.feature3')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
