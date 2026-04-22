import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Check, Clock, Package, Star, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type ProductTier = 'single' | 'tri' | 'tri-screen';

const pricingData = {
  single: [89, 79, 69, 59, 49],
  tri: [129, 119, 109, 89, 79],
  'tri-screen': [1290, 1190, 1090, 890, 790],
};

const volumeTiers = [
  { min: 1, max: 50, index: 0 },
  { min: 51, max: 200, index: 1 },
  { min: 201, max: 500, index: 2 },
  { min: 501, max: 1000, index: 3 },
  { min: 1001, max: 100000, index: 4 },
];

export default function WhiteLabelHardware() {
  const [selectedProduct, setSelectedProduct] = useState<ProductTier>('tri');
  const [privateMold, setPrivateMold] = useState(true);
  const [quantity, setQuantity] = useState(500);
  const { t } = useLanguage();

  const volumeLabels = ['1-50', '51-200', '201-500', '501-1000', '1000+'];

  const resolvedTierIndex = useMemo(() => {
    const idx = volumeTiers.findIndex((tier) => quantity >= tier.min && quantity <= tier.max);
    return idx >= 0 ? idx : volumeTiers.length - 1;
  }, [quantity]);

  const getUnitPrice = (tier: ProductTier) => {
    if (!privateMold && quantity <= 9) {
      if (tier === 'single') return 99;
      if (tier === 'tri') return 169;
      return 1690;
    }
    return pricingData[tier][resolvedTierIndex] || 0;
  };

  const calculatePrice = () => {
    const unitPrice = getUnitPrice(selectedProduct);
    const productTotal = unitPrice * quantity;
    const toolingFee = privateMold ? 10000 : 0;
    return { unitPrice, productTotal, toolingFee, total: productTotal + toolingFee };
  };

  const { unitPrice, productTotal, toolingFee, total } = calculatePrice();

  const priceAtTier = (tier: ProductTier) => getUnitPrice(tier);
  const minPriceMap: Record<ProductTier, number> = {
    single: 49,
    tri: 79,
    'tri-screen': 790,
  };

  const estimatedDelivery = () => {
    return quantity <= 500 ? `~1 ${t('hardware.timeline.month')}` : `~2 ${t('hardware.timeline.months')}`;
  };

  const selectedProductLabel =
    selectedProduct === 'single'
      ? t('hardware.products.single.title')
      : selectedProduct === 'tri'
      ? t('hardware.products.tri.title')
      : t('hardware.products.triScreen.title');
  const moldLabel = privateMold ? t('hardware.mold.private') : t('hardware.mold.noMold');
  const quoteBody = [
    'Hello Lushair team,',
    '',
    'I would like a custom quote for white-label hardware.',
    '',
    `Product: ${selectedProductLabel}`,
    `Mold option: ${moldLabel}`,
    `Quantity: ${quantity}`,
    `Unit price: $${unitPrice}`,
    `Product subtotal: $${productTotal.toLocaleString()}`,
    `Tooling fee: $${toolingFee.toLocaleString()}`,
    `Total estimate: $${total.toLocaleString()}`,
  ].join('\n');
  const requestQuoteHref = `mailto:support@lushair.ai?subject=${encodeURIComponent(
    `Custom Quote Request - ${selectedProductLabel}`
  )}&body=${encodeURIComponent(quoteBody)}`;
  const scheduleCallHref = 'https://calendly.com/wendyhair/30min';

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Package size={16} />
              <span>{t('hardware.badge')}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('hardware.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('hardware.subtitle')}
            </p>
            <p className="mt-4 text-sm text-gray-500 max-w-2xl mx-auto">{t('hardware.banner.volumeNote')}</p>
            <p className="mt-2 text-sm text-purple-700 font-medium">{t('hardware.banner.privateMoldNote')}</p>
          </motion.div>
        </div>

        {/* Product Comparison */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => setSelectedProduct('single')}
            className={`bg-white rounded-2xl p-8 cursor-pointer transition-all border-2 ${
              selectedProduct === 'single'
                ? 'border-purple-600 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('hardware.products.single.title')}</h3>
              <p className="text-sm text-gray-600">{t('hardware.products.single.subtitle')}</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{t('hardware.products.single.whiteLight')}</span></li>
              <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{t('hardware.products.single.sensor')}</span></li>
              <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{t('hardware.products.single.bluetooth')}</span></li>
              <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{t('hardware.products.single.appRequired')}</span></li>
            </ul>
            <div className="text-center pt-4 border-t border-gray-200">
              <div className="text-3xl font-bold text-purple-600">${minPriceMap.single}</div>
              <div className="text-sm text-gray-500">
                from · {t('hardware.pricing.perUnitWord')} · 1000+
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onClick={() => setSelectedProduct('tri')}
            className={`bg-white rounded-2xl p-8 cursor-pointer transition-all border-2 relative ${
              selectedProduct === 'tri'
                ? 'border-purple-600 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="absolute -top-3 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
              <Star size={12} className="mr-1" />
              {t('hardware.products.tri.popular')}
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('hardware.products.tri.title')}</h3>
              <p className="text-sm text-gray-600">{t('hardware.products.tri.subtitle')}</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{t('hardware.products.single.whiteLight')}</span></li>
              <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{t('hardware.products.tri.uva')}</span></li>
              <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{t('hardware.products.tri.polarized')}</span></li>
              <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{t('hardware.products.single.sensor')}</span></li>
              <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{t('hardware.products.single.bluetooth')}</span></li>
            </ul>
            <div className="text-center pt-4 border-t border-gray-200">
              <div className="text-3xl font-bold text-purple-600">${minPriceMap.tri}</div>
              <div className="text-sm text-gray-500">
                from · {t('hardware.pricing.perUnitWord')} · 1000+
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => setSelectedProduct('tri-screen')}
            className={`bg-white rounded-2xl p-8 cursor-pointer transition-all border-2 ${
              selectedProduct === 'tri-screen'
                ? 'border-purple-600 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('hardware.products.triScreen.title')}</h3>
              <p className="text-sm text-gray-600">{t('hardware.products.triScreen.subtitle')}</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{t('hardware.products.triScreen.oled')}</span></li>
              <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{t('hardware.products.triScreen.standalone')}</span></li>
              <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{t('hardware.products.triScreen.optional')}</span></li>
              <li className="flex items-start space-x-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">{t('hardware.products.triScreen.noApp')}</span></li>
            </ul>
            <div className="text-center pt-4 border-t border-gray-200">
              <div className="text-3xl font-bold text-purple-600">
                ${minPriceMap['tri-screen'].toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                from · {t('hardware.pricing.perUnitWord')} · 1000+
              </div>
            </div>
          </motion.div>
        </div>

        {/* Volume Pricing Table */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('hardware.pricing.title')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 text-gray-700 font-semibold">{t('hardware.pricing.units')}</th>
                  <th className="text-center py-4 px-4 text-gray-700 font-semibold">{t('hardware.products.single.title')}</th>
                  <th className="text-center py-4 px-4 text-gray-700 font-semibold">{t('hardware.products.tri.title')}</th>
                  <th className="text-center py-4 px-4 text-gray-700 font-semibold">{t('hardware.products.triScreen.title')}</th>
                </tr>
              </thead>
              <tbody>
                {volumeLabels.map((label, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">{label}</td>
                    <td className="py-4 px-4 text-center text-gray-700">${pricingData.single[index]}</td>
                    <td className="py-4 px-4 text-center text-gray-700">${pricingData.tri[index]}</td>
                    <td className="py-4 px-4 text-center text-gray-700">
                      ${pricingData['tri-screen'][index]}
                      {index === 4 && (
                        <div className="text-xs text-green-600 font-semibold mt-1">{t('hardware.pricing.freeBranding')}</div>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="bg-amber-50 border-b border-amber-100">
                  <td className="py-4 px-4 font-medium text-amber-900">{t('hardware.pricing.noMold1to9Label')}</td>
                  <td className="py-4 px-4 text-center text-amber-900">$99</td>
                  <td className="py-4 px-4 text-center text-amber-900">$169</td>
                  <td className="py-4 px-4 text-center text-amber-900">$1,690</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {t('hardware.pricing.noMold1to9')}
          </div>
        </div>

        {/* Pricing Calculator */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Calculator className="text-purple-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">{t('hardware.calculator.title')}</h2>
          </div>
          <div className="mb-6">
            <div className="inline-flex bg-white rounded-xl shadow-sm p-1 border border-gray-200">
              <button
                onClick={() => setPrivateMold(true)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  privateMold ? 'bg-purple-600 text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {t('hardware.mold.private')}
              </button>
              <button
                onClick={() => setPrivateMold(false)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  !privateMold ? 'bg-purple-600 text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {t('hardware.mold.noMold')}
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t('hardware.calculator.quantity')}</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-6 py-4 rounded-xl border-2 border-purple-200 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-lg font-semibold"
              />
              <input type="range" min="1" max="2000" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="w-full mt-4" />
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-700">{t('hardware.calculator.unitPrice')}</span>
                  <span className="text-2xl font-bold text-purple-600">${unitPrice}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-700">{t('hardware.calculator.productSubtotal')}</span>
                  <span className="text-xl font-bold text-gray-900">${productTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-700">{t('hardware.calculator.toolingFee')}</span>
                  <span className="text-xl font-bold text-gray-900">${toolingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-700">{t('hardware.calculator.totalCost')}</span>
                  <span className="text-3xl font-bold text-gray-900">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 flex items-center"><Clock className="mr-2" size={18} />{t('hardware.calculator.delivery')}</span>
                  <span className="font-semibold text-gray-900">{estimatedDelivery()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <a
              href={requestQuoteHref}
              className="flex-1 px-6 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold text-center"
            >
              {t('hardware.calculator.requestQuote')}
            </a>
            <a
              href={scheduleCallHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-semibold text-center"
            >
              {t('hardware.calculator.scheduleCall')}
            </a>
          </div>
        </div>

        {/* Delivery Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('hardware.timeline.title')}</h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="mr-2 text-green-600" size={20} />
                {t('hardware.timeline.gen1Stock')}
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700">1-500 {t('hardware.pricing.units')}</span>
                    <span className="font-semibold text-green-600">{t('hardware.timeline.about')}1 {t('hardware.timeline.month')}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2"><div className="w-[33%] h-full bg-green-500 rounded-full" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700">500+ {t('hardware.pricing.units')}</span>
                    <span className="font-semibold text-blue-600">{t('hardware.timeline.about')}2 {t('hardware.timeline.months')}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2"><div className="w-[66%] h-full bg-blue-500 rounded-full" /></div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="mr-2 text-purple-600" size={20} />
                {t('hardware.timeline.gen2Custom')}
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-700 mb-2">{t('hardware.timeline.tooling')}</div>
                  <div className="w-full bg-purple-200 rounded-lg p-3 text-center"><span className="font-semibold text-purple-700">15-30 {t('hardware.timeline.days')}</span></div>
                </div>
                <div>
                  <div className="text-sm text-gray-700 mb-2">{t('hardware.timeline.production')}</div>
                  <div className="w-full bg-blue-200 rounded-lg p-3 text-center"><span className="font-semibold text-blue-700">{t('hardware.timeline.about')}30 {t('hardware.timeline.days')}</span></div>
                </div>
                <div>
                  <div className="text-sm text-gray-700 mb-2">{t('hardware.timeline.shipping')}</div>
                  <div className="w-full bg-green-200 rounded-lg p-3 text-center"><span className="font-semibold text-green-700">{t('hardware.timeline.about')}30 {t('hardware.timeline.days')}</span></div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-lg font-semibold text-gray-900">{t('hardware.timeline.total')}</span>
                <p className="text-sm text-green-600 mt-2">{t('hardware.timeline.noTooling')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
