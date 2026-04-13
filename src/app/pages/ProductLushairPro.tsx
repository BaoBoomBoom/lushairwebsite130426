import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Check, Star, Sparkles, Zap, Shield, Eye, ChevronRight, ShoppingCart, CalendarCheck, Activity } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import lushairProImg from '@/assets/products/lushair-pro.png';

const proProduct = {
  id: 'lushair-pro',
  name: 'Lushair Pro',
  nameKey: 'shop.products.lushairPro.name',
  price: 199,
  image: lushairProImg,
  category: 'device' as const,
  description: 'Three-spectrum with auto focus. Perfect for users with scalp concerns and premium hair care needs.',
  descKey: 'shop.products.lushairPro.desc',
  stock: 30,
};

const spectrums = [
  {
    name: 'White Light',
    color: 'from-yellow-200 to-amber-200',
    textColor: 'text-amber-700',
    desc: 'Reveals surface-level scalp texture, follicle distribution, and hair density patterns.',
    icon: '☀️',
  },
  {
    name: 'UV Light',
    color: 'from-violet-200 to-purple-200',
    textColor: 'text-violet-700',
    desc: 'Detects dandruff, fungal conditions, and sebum buildup invisible to standard light.',
    icon: '🔮',
  },
  {
    name: 'Polarised Light',
    color: 'from-blue-200 to-cyan-200',
    textColor: 'text-blue-700',
    desc: 'Penetrates below the surface to map sub-dermal inflammation and follicle health.',
    icon: '💠',
  },
];

const features = [
  {
    icon: Sparkles,
    title: 'Tri-Spectral Imaging',
    desc: 'White, UV, and polarised light capture every dimension of your scalp health in one session.',
    color: 'purple',
  },
  {
    icon: Activity,
    title: 'AI Auto-Focus',
    desc: 'Smart focus lock ensures perfectly sharp images every time — no manual adjustment needed.',
    color: 'blue',
  },
  {
    icon: Eye,
    title: 'Six AI Models',
    desc: 'Dandruff, sebum, follicle density, inflammation, moisture balance, and hair loss — analysed together.',
    color: 'indigo',
  },
  {
    icon: Shield,
    title: 'Clinical-Grade Insights',
    desc: 'Reports formatted for sharing directly with your dermatologist or trichologist.',
    color: 'violet',
  },
  {
    icon: Zap,
    title: 'Real-Time Analysis',
    desc: 'See live AI overlays on your scalp as you scan — instant feedback, no waiting.',
    color: 'cyan',
  },
  {
    icon: CalendarCheck,
    title: 'Progress Tracking',
    desc: 'Compare scans over weeks and months to visualise the impact of your hair care routine.',
    color: 'teal',
  },
];

const specs = [
  { label: 'Spectrum', value: 'Tri-Spectral (White / UV / Polarised)' },
  { label: 'Focus', value: 'AI Auto-Focus' },
  { label: 'Sensor', value: '20MP Medical-Grade + HDR' },
  { label: 'AI Models', value: '6 Clinical Analysis Modules' },
  { label: 'Connectivity', value: 'WiFi / Bluetooth 5.0' },
  { label: 'Compatibility', value: 'iOS & Android' },
  { label: 'Warranty', value: '18 Months' },
  { label: 'In the Box', value: 'Device, USB-C Cable, Premium Case, Calibration Cap' },
];

const reviews = [
  { name: 'Dr. Chen', rating: 5, text: 'As a trichologist I recommend Lushair Pro to all my patients. The UV spectrum findings are exceptionally accurate and save us hours of diagnostic work.' },
  { name: 'Rachel T.', rating: 5, text: 'Struggled with scalp issues for years. After 3 months using Pro, my dermatologist said my scalp health had improved dramatically. The tri-spectrum view is mind-blowing.' },
  { name: 'Marcus B.', rating: 5, text: 'Worth every cent of the upgrade from One. Auto-focus alone is a game changer, and the polarised light revealed things my consultant had never seen before.' },
];

export default function ProductLushairPro() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    addToCart(proProduct, qty);
  };

  const handleBuyNow = () => {
    addToCart(proProduct, qty);
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
          <span className="text-gray-900 font-medium">Lushair Pro</span>
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
            className="relative order-2 lg:order-1"
          >
            <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-12 aspect-square flex items-center justify-center overflow-hidden">
              {/* Glow blobs */}
              <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-indigo-300/30 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-300/30 rounded-full blur-2xl" />
              <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-blue-300/40 rounded-full blur-xl" />
              <img
                src={lushairProImg}
                alt="Lushair Pro"
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
              />
              {/* Premium badge */}
              <div className="absolute top-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                Premium
              </div>
              {/* Spectrum pills */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {['White', 'UV', 'Polarised'].map((s) => (
                  <span key={s} className="px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-700 text-xs font-semibold rounded-full shadow-sm border border-white">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            {/* Trust bar */}
            <div className="mt-6 flex items-center justify-center gap-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-current" />
                ))}
                <span className="text-sm text-gray-600 ml-1">4.9</span>
              </div>
              <div className="text-sm text-gray-500">18-month warranty</div>
              <div className="text-sm text-gray-500">Free shipping</div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            {/* Tag */}
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-4">
              Clinical-Grade Analysis
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-3 tracking-tight">
              Lushair<span className="text-blue-600"> Pro</span>
            </h1>
            <p className="text-xl text-gray-500 mb-6 font-medium">Illuminate every dimension of scalp health</p>

            <p className="text-gray-600 mb-8 leading-relaxed max-w-lg">
              Three spectrums. Six AI models. One powerful truth about your scalp.
              Whether you're battling dandruff, monitoring hair loss, or simply demanding the best —
              Lushair Pro sees what nothing else can.
            </p>

            {/* Key features checklist */}
            <div className="space-y-3 mb-8">
              {[
                'Tri-spectral imaging (White / UV / Polarised)',
                'AI-powered auto-focus',
                'Clinical-grade insights & reports',
                'Real-time analysis overlays',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700">{f}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-blue-600">$199</span>
                <span className="text-gray-400 line-through">$399</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Save 25%</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Free shipping · 30-day returns · 18-month warranty</p>
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
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Buy Now
              </button>
              <Link
                to="/try-free"
                className="flex-1 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-bold flex items-center justify-center gap-2"
              >
                See the Glow
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

      {/* Three Spectrum Section */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-black text-white mb-4">Three spectrums. Three dimensions of truth.</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Most devices see one layer. Lushair Pro sees three — revealing the full picture of your scalp health
              that standard imaging simply can't match.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {spectrums.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl mb-6`}>
                  {s.icon}
                </div>
                <h3 className="text-white font-black text-xl mb-3">{s.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                <div className={`mt-4 inline-block px-3 py-1 bg-gradient-to-r ${s.color} rounded-full text-xs font-semibold ${s.textColor}`}>
                  Spectrum {i + 1} of 3
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-4">Everything you need. Nothing you don't.</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
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

      {/* Specs + Reviews */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-gray-900 mb-4">Technical specifications</h2>
            <p className="text-gray-600 mb-10">Precision engineering. Clinical performance.</p>
            <div className="divide-y divide-gray-100">
              {specs.map((s) => (
                <div key={s.label} className="flex justify-between py-4">
                  <span className="text-gray-500 text-sm font-medium">{s.label}</span>
                  <span className="text-gray-900 text-sm font-semibold text-right max-w-[60%]">{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-gray-900 mb-4">Trusted by professionals</h2>
            <p className="text-gray-600 mb-10">From clinics to living rooms — Lushair Pro delivers.</p>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.name} className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
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
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-white mb-4">See the difference three spectrums make.</h2>
            <p className="text-blue-100 mb-8">
              Clinical-grade insights, delivered with the elegance your hair care deserves.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBuyNow}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg"
              >
                Buy Now — $199
              </button>
              <Link
                to="/try-free"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all"
              >
                See the Glow
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compare CTA */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-500 mb-4">Explore other models in the Lushair family</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products/one"
            className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all font-semibold"
          >
            ← Lushair One
          </Link>
          <Link
            to="/products/studio"
            className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all font-semibold"
          >
            Lushair Studio →
          </Link>
        </div>
      </section>
    </div>
  );
}
