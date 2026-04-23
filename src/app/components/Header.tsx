import { Link, useLocation } from 'react-router';
import { Menu, X, Globe, ShoppingCart, Building2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useLanguage, LANGUAGES, Language } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

const TRY_FREE_URL = 'https://www.lushair.ai/try-free';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { getTotalItems, setIsCartOpen } = useCart();

  const isActive = (path: string) => location.pathname === path;

  const businessPaths = ['/hardware', '/api', '/saas', '/implementation'] as const;
  const isBusinessSection = businessPaths.some(
    (p) => location.pathname === p || location.pathname.startsWith(`${p}/`)
  );

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setLanguageMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/lushair-logo1.png" alt="Lushair logo" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-gray-900">Lushair.ai</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/try-free"
              className={`text-sm font-medium transition-colors ${
                isActive('/try-free') ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              {t('nav.tryFree')}
            </Link>
            <Link
              to="/shop"
              className={`text-sm font-medium transition-colors ${
                isActive('/shop') ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              {t('nav.shop')}
            </Link>
            <div className="relative group">
              <button
                type="button"
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-all ${
                  isBusinessSection
                    ? 'border-purple-500 bg-purple-50 text-purple-800 shadow-sm ring-1 ring-purple-200/60'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-purple-300 hover:bg-purple-50/80'
                }`}
              >
                <Building2 size={16} className={isBusinessSection ? 'text-purple-600' : 'text-gray-500 group-hover:text-purple-600'} />
                {t('nav.business')}
                <ChevronDown size={14} className="opacity-60" aria-hidden />
              </button>
              <div className="absolute top-full left-0 z-50 mt-2 w-56 min-w-max rounded-xl border border-gray-100 bg-white py-1 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="/hardware"
                  className="block px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-purple-50 hover:text-purple-700 transition-colors rounded-t-xl"
                >
                  {t('nav.hardware')}
                </Link>
                <Link
                  to="/api"
                  className="block px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  {t('nav.api')}
                </Link>
                <Link
                  to="/saas"
                  className="block px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  {t('nav.saas')}
                </Link>
                <Link
                  to="/implementation"
                  className="block px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-purple-50 hover:text-purple-700 transition-colors rounded-b-xl"
                >
                  {t('nav.implementation')}
                </Link>
              </div>
            </div>
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors ${
                isActive('/dashboard') ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              {t('nav.dashboard')}
            </Link>
          </nav>

          {/* CTA Button & Language Selector */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Shopping Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors rounded-lg hover:bg-gray-50"
            >
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors rounded-lg hover:bg-gray-50"
              >
                <Globe size={18} />
                <span className="text-sm">{LANGUAGES[language].flag}</span>
              </button>
              
              {languageMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setLanguageMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                          language === lang
                            ? 'bg-purple-50 text-purple-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{LANGUAGES[lang].flag}</span>
                        <span>{LANGUAGES[lang].name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                  Sign in
                </button>
              </SignInButton>
              <a
                href={TRY_FREE_URL}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                {t('nav.getStarted')}
              </a>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-purple-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/try-free"
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.tryFree')}
              </Link>
              <Link
                to="/shop"
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.shop')}
              </Link>
              <div className="rounded-xl border border-purple-100 bg-purple-50/50 px-3 py-2 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-purple-700">
                  <Building2 size={14} />
                  {t('nav.business')}
                </div>
                <Link
                  to="/hardware"
                  className="block text-sm font-medium text-gray-800 hover:text-purple-600 transition-colors pl-1 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.hardware')}
                </Link>
                <Link
                  to="/api"
                  className="block text-sm font-medium text-gray-800 hover:text-purple-600 transition-colors pl-1 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.api')}
                </Link>
                <Link
                  to="/saas"
                  className="block text-sm font-medium text-gray-800 hover:text-purple-600 transition-colors pl-1 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.saas')}
                </Link>
                <Link
                  to="/implementation"
                  className="block text-sm font-medium text-gray-800 hover:text-purple-600 transition-colors pl-1 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.implementation')}
                </Link>
              </div>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.dashboard')}
              </Link>

              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-xs font-semibold text-gray-500 mb-2 px-2">{t('common.language')}</div>
                <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        handleLanguageChange(lang);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        language === lang
                          ? 'bg-purple-50 text-purple-600 border border-purple-200'
                          : 'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      <span>{LANGUAGES[lang].flag}</span>
                      <span className="truncate">{LANGUAGES[lang].name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors text-left">
                    Sign in
                  </button>
                </SignInButton>
                <a
                  href={TRY_FREE_URL}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium text-center"
                >
                  {t('nav.getStarted')}
                </a>
              </SignedOut>
              <SignedIn>
                <div className="pt-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}