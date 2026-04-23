import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Check, Star, Zap, Eye, Shield, Users, ChevronRight, ShoppingCart, Play } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LUSHAIR_ONE_PRODUCT_IMAGE_URL } from '../../constants/productImages';

const oneProduct = {
  id: 'lushair-one',
  name: 'Lushair One',
  nameKey: 'shop.products.lushairOne.name',
  price: 99,
  image: LUSHAIR_ONE_PRODUCT_IMAGE_URL,
  category: 'device' as const,
  description: 'Single-spectrum with manual focus. Most popular among users with hair loss concerns.',
  descKey: 'shop.products.lushairOne.desc',
  stock: 50,
};

const features = [
  {
    icon: Eye,
    title: 'Single-Spectrum Precision',
    desc: 'Targeted white-light imaging optimised for follicle density mapping and hair loss detection.',
    color: 'purple',
  },
  {
    icon: Zap,
    title: '20MP Medical-Grade Sensor',
    desc: 'Crystal-clear scalp imagery at clinical-level resolution — right in the palm of your hand.',
    color: 'blue',
  },
  {
    icon: Shield,
    title: 'AI-Powered Insights',
    desc: 'Six AI models analyse your scalp in seconds, delivering a personalised health report.',
    color: 'indigo',
  },
  {
    icon: Users,
    title: 'Trusted by 29,000+ Users',
    desc: 'Join a growing community of users who have transformed their hair health journey.',
    color: 'violet',
  },
];

const specs = [
  { label: 'Spectrum', value: 'Single (White Light)' },
  { label: 'Focus', value: 'Manual' },
  { label: 'Sensor', value: '20MP Medical-Grade' },
  { label: 'AI Models', value: '6 Analysis Modules' },
  { label: 'Connectivity', value: 'WiFi / Bluetooth' },
  { label: 'Compatibility', value: 'iOS & Android' },
  { label: 'Warranty', value: '12 Months' },
  { label: 'In the Box', value: 'Device, USB-C Cable, Carrying Case' },
];

const reviews = [
  { name: 'Sarah M.', rating: 5, text: 'Finally understand what\'s happening with my hair loss. The analysis is spot on — my dermatologist was impressed.' },
  { name: 'James K.', rating: 5, text: 'Easy to use, beautiful app. Tracked my progress over 3 months and saw real improvement thanks to the AI recommendations.' },
  { name: 'Priya L.', rating: 5, text: 'Worth every penny. The reports are so detailed and the device feels premium. Love it!' },
];

export default function ProductLushairOne() {
  const { addToCart, setIsCartOpen } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    addToCart(oneProduct, qty);
  };

  const handleBuyNow = () => {
    addToCart(oneProduct, qty);
    navigate('/checkout');
  };

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center text-sm text-gray-500 space-x-2">
          <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-purple-600 transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">Lushair One</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-purple-50 rounded-3xl p-12 aspect-square flex items-center justify-center overflow-hidden">
              {/* Glow blobs */}
              <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-300/30 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-300/30 rounded-full blur-2xl" />
              <img
                src={LUSHAIR_ONE_PRODUCT_IMAGE_URL}
                alt="Lushair One"
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
              />
              {/* Most Popular badge */}
              <div className="absolute top-6 right-6 bg-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-purple-600/30">
                Most Popular
              </div>
            </div>
            {/* Trust bar below image */}
            <div className="mt-6 flex items-center justify-center gap-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-current" />
                ))}
                <span className="text-sm text-gray-600 ml-1">4.9</span>
              </div>
              <div className="text-sm text-gray-500">29,000+ happy users</div>
              <div className="text-sm text-gray-500">{t('shop.flatShipping')}</div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Tag */}
            <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold mb-4">
              AI Hair Analysis Device
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-3 tracking-tight">
              Lushair<span className="text-purple-600"> One</span>
            </h1>
            <p className="text-xl text-gray-500 mb-6 font-medium">Where healthy hair begins</p>

            <p className="text-gray-600 mb-8 leading-relaxed max-w-lg">
              {t('shop.products.lushairOne.desc')}
            </p>

            {/* Key features checklist */}
            <div className="space-y-3 mb-8">
              {[
                'AI scalp scan in seconds with 16+ hair & scalp metrics',
                'Compact, portable—Wi‑Fi setup with guided multi-photo capture',
                'Personalized care suggestions from your results',
                'Use at home or on the go for a professional-grade routine',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700">{f}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-purple-600">From $99</span>
                <span className="text-gray-400 line-through">$129</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Save vs list</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {t('shop.flatShipping')} · 30-day returns · 12-month warranty
              </p>
            </div>

            {/* Quantity + CTA */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors font-bold"
                >
                  −
                </button>
                <span className="px-4 py-3 text-gray-900 font-semibold min-w-[3rem] text-center">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(10, qty + 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Buy Now
              </button>
              <Link
                to="/try-free"
                className="flex-1 py-4 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-bold flex items-center justify-center gap-2"
              >
                <Play size={18} />
                Try Free Analysis
              </Link>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full mt-3 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
            >
              Add to Cart
            </button>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-4">Built for real results</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every component of Lushair One is designed with one purpose: giving you actionable,
              medically-grounded insight about your scalp health.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-${f.color}-100 flex items-center justify-center mb-4`}>
                  <f.icon size={22} className={`text-${f.color}-600`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-gray-900 mb-4">Technical specifications</h2>
            <p className="text-gray-600 mb-10">
              Engineered to clinical-level standards, designed for everyday life.
            </p>
            <div className="divide-y divide-gray-100">
              {specs.map((s) => (
                <div key={s.label} className="flex justify-between py-4">
                  <span className="text-gray-500 text-sm font-medium">{s.label}</span>
                  <span className="text-gray-900 text-sm font-semibold text-right">{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Reviews */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-gray-900 mb-4">What users say</h2>
            <p className="text-gray-600 mb-10">
              Real stories from real people on their hair health journey.
            </p>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.name} className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {r.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{r.name}</div>
                      <div className="flex">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} size={12} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">Verified</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">"{r.text}"</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-purple-700 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-white mb-4">Ready to start your journey?</h2>
            <p className="text-purple-100 mb-8">
              Join 29,000+ users who've taken control of their hair health with Lushair One.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBuyNow}
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-lg"
              >
                Buy Now — From $99
              </button>
              <Link
                to="/try-free"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all"
              >
                Try Free Analysis
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compare CTA */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-500 mb-4">Looking for more advanced features?</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products/pro"
            className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-purple-600 hover:text-purple-600 transition-all font-semibold"
          >
            Explore Lushair Pro →
          </Link>
          <Link
            to="/products/studio"
            className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-purple-600 hover:text-purple-600 transition-all font-semibold"
          >
            Explore Lushair Studio →
          </Link>
        </div>
      </section>
    </div>
  );
}
