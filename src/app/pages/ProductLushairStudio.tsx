import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Check, Star, Sparkles, Wifi, Monitor, Layers, ChevronRight,
  ShoppingCart, Phone, Maximize2, Palette, Building2, Settings
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import lushairStudioWifiScreen from '@/assets/products/lushair-studio-wifi-screen.png';
import lushairStudioPlugIn from '@/assets/products/lushair-studio-plug-in.png';
import lushairStudioWifiMirror from '@/assets/products/lushair-studio-wifi-mirror.png';

type StudioVariant = 'wifi-screen' | 'plugin-screen' | 'wifi-mirror';

const variants: {
  id: StudioVariant;
  label: string;
  subLabel: string;
  icon: React.ElementType;
  price: number;
  shopId: string;
  image: string;
  badge?: string;
  color: string;
  desc: string;
}[] = [
  {
    id: 'wifi-screen',
    label: 'Wi‑Fi screen',
    subLabel: 'Wireless freedom with built-in display',
    icon: Wifi,
    price: 1899,
    shopId: 'lushair-studio-wifi-screen',
    image: lushairStudioWifiScreen,
    badge: 'Most Flexible',
    color: 'indigo',
    desc: 'Go cord-free anywhere in the salon while streaming live to a crisp integrated screen. Perfect for mobile consultations.',
  },
  {
    id: 'plugin-screen',
    label: 'Wired screen',
    subLabel: '11" display for unmatched clarity',
    icon: Monitor,
    price: 1699,
    shopId: 'lushair-studio-plugin',
    image: lushairStudioPlugIn,
    badge: 'Best Clarity',
    color: 'purple',
    desc: 'A dedicated 11" high-resolution display delivers the sharpest scalp imagery available — built for the serious professional.',
  },
  {
    id: 'wifi-mirror',
    label: 'Wi‑Fi mirror',
    subLabel: 'Salon-grade aesthetics meet precision',
    icon: Maximize2,
    price: 2099,
    shopId: 'lushair-studio-mirror',
    image: lushairStudioWifiMirror,
    badge: 'Most Elegant',
    color: 'violet',
    desc: 'Transform your consultation space. The mirror design lets clients view their own analysis in real time — an experience they\'ll talk about.',
  },
];

const features = [
  {
    icon: Layers,
    title: '200× Optical Magnification',
    desc: 'Optional 200X LED camera reveals follicle detail invisible to the naked eye — the definitive professional tool.',
  },
  {
    icon: Sparkles,
    title: 'Tri-Spectral Imaging',
    desc: 'White, UV, and polarised light — the complete picture of scalp health in every consultation.',
  },
  {
    icon: Settings,
    title: 'AI Auto-Focus',
    desc: 'Precision auto-focus ensures every frame is perfectly sharp, every single time.',
  },
  {
    icon: Wifi,
    title: 'Wireless / Wired / Standalone',
    desc: 'Three connectivity modes adapt to your salon layout, equipment, and workflow.',
  },
  {
    icon: Palette,
    title: 'Custom Branding',
    desc: 'White-label your Studio with your salon\'s colours and logo. Minimum 1,000 units. Mould fee applies.',
  },
  {
    icon: Building2,
    title: 'Enterprise Ready',
    desc: 'Fleet management, API integration, and dedicated account support for multi-location operators.',
  },
];

const studioProducts = {
  'wifi-screen': {
    id: 'lushair-studio-wifi-screen',
    name: 'Lushair Studio (WiFi + Screen)',
    nameKey: 'shop.products.lushairStudioWifiScreen.name',
    price: 1899,
    image: lushairStudioWifiScreen,
    category: 'device' as const,
    description: 'Three-spectrum, auto focus, optional 200X LED camera. WiFi connectivity with integrated screen.',
    descKey: 'shop.products.lushairStudioWifiScreen.desc',
    stock: 15,
  },
  'plugin-screen': {
    id: 'lushair-studio-plugin',
    name: 'Lushair Studio (Plug-in Screen)',
    nameKey: 'shop.products.lushairStudioPlugIn.name',
    price: 1699,
    image: lushairStudioPlugIn,
    category: 'device' as const,
    description: 'Professional grade with plug-in screen. Three-spectrum analysis with 200X magnification option.',
    descKey: 'shop.products.lushairStudioPlugIn.desc',
    stock: 10,
  },
  'wifi-mirror': {
    id: 'lushair-studio-mirror',
    name: 'Lushair Studio (WiFi Mirror)',
    nameKey: 'shop.products.lushairStudioMirror.name',
    price: 2099,
    image: lushairStudioWifiMirror,
    category: 'device' as const,
    description: 'Premium mirror design with WiFi. Three-spectrum analysis meets elegant salon aesthetics.',
    descKey: 'shop.products.lushairStudioMirror.desc',
    stock: 8,
  },
};

export default function ProductLushairStudio() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState<StudioVariant>('plugin-screen');
  const [qty, setQty] = useState(1);

  const active = variants.find((v) => v.id === selectedVariant)!;
  const activeProduct = studioProducts[selectedVariant];

  const handleAddToCart = () => {
    addToCart(activeProduct, qty);
  };

  const handleBuyNow = () => {
    addToCart(activeProduct, qty);
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
          <span className="text-gray-900 font-medium">Lushair Studio</span>
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
            <div className="relative bg-slate-50 rounded-3xl p-12 aspect-square flex items-center justify-center overflow-hidden">
              {/* Glow blobs */}
              <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-indigo-300/30 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-violet-300/30 rounded-full blur-2xl" />
              <motion.img
                key={active.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={active.image}
                alt={`Lushair Studio ${active.label}`}
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
              />
              {active.badge && (
                <div className="absolute top-6 right-6 bg-purple-700 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                  {active.badge}
                </div>
              )}
            </div>
            {/* Trust bar */}
            <div className="mt-6 flex items-center justify-center gap-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-current" />
                ))}
                <span className="text-sm text-gray-600 ml-1">4.9</span>
              </div>
              <div className="text-sm text-gray-500">Professional grade</div>
              <div className="text-sm text-gray-500">2-year warranty</div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Tag */}
            <div className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold mb-4">
              Professional Series
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-3 tracking-tight">
              Lushair<span className="text-indigo-600"> Studio</span>
            </h1>
            <p className="text-xl text-gray-500 mb-2 font-medium">Professional power. Designed for those who care professionally.</p>
            <p className="text-gray-600 mb-8 leading-relaxed max-w-lg">
              Transform your salon into a scalp health destination. From wireless portability to 11" display
              precision — Studio adapts to your practice, not the other way around.
            </p>

            {/* Variant Selector */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Choose your configuration</p>
              <div className="space-y-3">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedVariant === v.id
                        ? `border-${v.color}-500 bg-${v.color}-50`
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selectedVariant === v.id ? `bg-${v.color}-100` : 'bg-gray-100'
                    }`}>
                      <v.icon size={18} className={selectedVariant === v.id ? `text-${v.color}-600` : 'text-gray-500'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${selectedVariant === v.id ? `text-${v.color}-700` : 'text-gray-900'}`}>
                          {v.label}
                        </span>
                        {v.badge && (
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            selectedVariant === v.id ? `bg-${v.color}-200 text-${v.color}-800` : 'bg-gray-100 text-gray-600'
                          }`}>
                            {v.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{v.subLabel}</p>
                    </div>
                    <div className={`font-black text-sm flex-shrink-0 ${selectedVariant === v.id ? `text-${v.color}-700` : 'text-gray-700'}`}>
                      ${v.price.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Key features checklist */}
            <div className="space-y-2.5 mb-6">
              {[
                '200× optical magnification (optional)',
                'Wireless, wired, or standalone modes',
                'Tri-spectral AI analysis',
                'Custom branding (1,000+ units)',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700 text-sm">{f}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <motion.span
                  key={active.price}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-black text-indigo-600"
                >
                  Starting at ${activeProduct.price.toLocaleString()}
                </motion.span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Free shipping · 30-day returns · 24-month warranty</p>
            </div>

            {/* Quantity + CTA */}
            <div className="flex items-center gap-4 mb-4">
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
                className="flex-1 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Buy Now
              </button>
              <Link
                to="/hardware"
                className="flex-1 py-4 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all font-bold flex items-center justify-center gap-2"
              >
                Schedule Demo
              </Link>
            </div>

            <div className="flex gap-3 mt-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
              >
                Add to Cart
              </button>
              <Link
                to="/hardware"
                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium flex items-center justify-center gap-1"
              >
                <Phone size={14} />
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Variant Detail Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            key={selectedVariant}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-${active.color}-100 flex items-center justify-center`}>
                <active.icon size={22} className={`text-${active.color}-600`} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Studio {active.label}</h3>
                <p className="text-gray-500 text-sm">{active.subLabel}</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed max-w-2xl">{active.desc}</p>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-black text-gray-900 mb-4">Everything a professional needs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Studio is built for salons, clinics, and brands that demand the best — and want to show it.
          </p>
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
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
                <f.icon size={22} className="text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Custom Branding CTA */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold mb-4 border border-indigo-500/30">
                White Label Program
              </div>
              <h2 className="text-3xl font-black text-white mb-4">Make it yours.</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Order 1,000+ units and Studio becomes your brand. Custom exterior, your logo,
                your colours — all backed by Lushair's clinical-level technology. Mould tooling fee applies.
              </p>
              <div className="space-y-3">
                {[
                  'Custom exterior design & branding',
                  'Your logo on device and app UI',
                  'Dedicated account & support team',
                  'API integration for your platform',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-indigo-400">1K+</div>
                  <div className="text-gray-400 text-xs mt-1">Minimum units</div>
                </div>
                <div className="text-center border-x border-white/10">
                  <div className="text-3xl font-black text-indigo-400">12</div>
                  <div className="text-gray-400 text-xs mt-1">Wk lead time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-indigo-400">24/7</div>
                  <div className="text-gray-400 text-xs mt-1">Enterprise support</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm text-center mb-6">
                Ready to put your brand on the world's most advanced scalp analysis device?
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/hardware"
                  className="block text-center py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                >
                  Schedule a Demo
                </Link>
                <Link
                  to="/hardware"
                  className="block text-center py-3 border border-white/20 text-gray-300 rounded-xl font-semibold hover:bg-white/5 transition-all text-sm"
                >
                  Contact Sales Team
                </Link>
              </div>
            </motion.div>
          </div>
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
            <h2 className="text-4xl font-black text-white mb-4">The professional standard. Now in your salon.</h2>
            <p className="text-indigo-100 mb-8">
              Lushair Studio — built for those who care professionally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBuyNow}
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg"
              >
                Buy Now — From $1,290
              </button>
              <Link
                to="/hardware"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compare CTA */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-500 mb-4">Explore the full Lushair range</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products/one"
            className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all font-semibold"
          >
            ← Lushair One
          </Link>
          <Link
            to="/products/pro"
            className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all font-semibold"
          >
            ← Lushair Pro
          </Link>
        </div>
      </section>
    </div>
  );
}
