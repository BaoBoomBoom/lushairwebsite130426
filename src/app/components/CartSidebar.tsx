import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { DEFAULT_SHIPPING_USD } from '../../constants/checkout';

export default function CartSidebar() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, isCartOpen, setIsCartOpen } = useCart();
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <ShoppingBag className="text-purple-600 mr-3" size={24} />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t('cart.title')}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {getTotalItems()} {t('cart.items')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={64} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-6">{t('cart.empty')}</p>
                  <Link
                    to="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    {t('cart.continueShopping')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 bg-gray-50 rounded-xl p-4"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                          {t(item.nameKey)}
                        </h3>
                        <p className="text-purple-600 font-bold mb-2">
                          ${item.price}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-md bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-7 h-7 rounded-md bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="self-start p-1 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                      >
                        <X size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {/* Subtotal */}
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">{t('cart.subtotal')}</span>
                  <span className="font-semibold">${getTotalPrice()}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">{t('cart.shipping')}</span>
                  <span className="font-semibold text-gray-900">
                    {t('cart.shippingFlat')}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6 text-lg border-t border-gray-200 pt-4">
                  <span className="font-bold text-gray-900">{t('cart.total')}</span>
                  <span className="font-bold text-purple-600">
                    ${getTotalPrice() + DEFAULT_SHIPPING_USD}
                  </span>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full px-6 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-bold text-center flex items-center justify-center group"
                >
                  {t('cart.checkout')}
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="block text-center text-purple-600 hover:text-purple-700 font-semibold mt-3"
                >
                  {t('cart.continueShopping')}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
