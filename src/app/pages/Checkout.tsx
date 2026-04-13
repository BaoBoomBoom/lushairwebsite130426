import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, CreditCard, MapPin, User, Phone, Mail, Check, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { DEFAULT_SHIPPING_USD } from '../../constants/checkout';

export default function Checkout() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'info') {
      setStep('payment');
    } else if (step === 'payment') {
      // Simulate payment processing
      setTimeout(() => {
        setStep('success');
        clearCart();
      }, 1500);
    }
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('checkout.emptyCart')}
          </h2>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            {t('checkout.backToShop')}
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="text-green-600" size={40} />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('checkout.success.title')}
          </h1>
          <p className="text-gray-600 mb-8">{t('checkout.success.message')}</p>
          <div className="bg-white rounded-xl p-6 mb-6 text-left">
            <div className="text-sm text-gray-600 mb-2">
              {t('checkout.success.orderNumber')}
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-4">
              #LH{Math.floor(Math.random() * 1000000)}
            </div>
            <div className="text-sm text-gray-600">
              {t('checkout.success.emailSent')}
            </div>
          </div>
          <div className="flex gap-4">
            <Link
              to="/shop"
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-center"
            >
              {t('checkout.success.continueShopping')}
            </Link>
            <Link
              to="/dashboard"
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-center"
            >
              {t('checkout.success.viewOrders')}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/shop"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            {t('checkout.backToShop')}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">{t('checkout.title')}</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step === 'info' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'
              }`}
            >
              {step === 'info' ? '1' : <Check size={20} />}
            </div>
            <div
              className={`w-24 h-1 mx-2 ${
                step === 'payment' || step === 'success' ? 'bg-green-600' : 'bg-gray-200'
              }`}
            />
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step === 'payment'
                  ? 'bg-purple-600 text-white'
                  : step === 'success'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step === 'success' ? <Check size={20} /> : '2'}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.form
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {step === 'info' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('checkout.shippingInfo')}
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User size={16} className="inline mr-2" />
                        {t('checkout.form.fullName')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder={t('checkout.form.fullNamePlaceholder')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone size={16} className="inline mr-2" />
                        {t('checkout.form.phone')}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder={t('checkout.form.phonePlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="inline mr-2" />
                      {t('checkout.form.email')}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder={t('checkout.form.emailPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="inline mr-2" />
                      {t('checkout.form.address')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder={t('checkout.form.addressPlaceholder')}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('checkout.form.city')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder={t('checkout.form.cityPlaceholder')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('checkout.form.postalCode')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) =>
                          setFormData({ ...formData, postalCode: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder={t('checkout.form.postalCodePlaceholder')}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-bold"
                  >
                    {t('checkout.continueToPayment')}
                  </button>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('checkout.paymentMethod')}
                  </h2>

                  <div className="space-y-3">
                    {['card', 'alipay', 'wechat'].map((method) => (
                      <label
                        key={method}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.paymentMethod === method
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={formData.paymentMethod === method}
                          onChange={(e) =>
                            setFormData({ ...formData, paymentMethod: e.target.value })
                          }
                          className="mr-3"
                        />
                        <CreditCard size={20} className="mr-3 text-gray-600" />
                        <span className="font-semibold">
                          {t(`checkout.payment.${method}`)}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep('info')}
                      className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                    >
                      {t('checkout.back')}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-bold"
                    >
                      {t('checkout.placeOrder')}
                    </button>
                  </div>
                </div>
              )}
            </motion.form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('checkout.orderSummary')}
              </h3>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {t(item.nameKey)}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t('checkout.quantity')}: {item.quantity}
                      </p>
                      <p className="text-purple-600 font-bold">${item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>{t('checkout.subtotal')}</span>
                  <span>${getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('checkout.shipping')}</span>
                  <span className="text-gray-900">{t('checkout.shippingAmount')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>{t('checkout.total')}</span>
                  <span className="text-purple-600">${getTotalPrice() + DEFAULT_SHIPPING_USD}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
