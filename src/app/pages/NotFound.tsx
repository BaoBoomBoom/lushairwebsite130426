import { Link } from 'react-router';
import { Home, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-purple-600 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('notFound.title')}</h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('notFound.subtitle')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold"
          >
            <Home className="mr-2" size={20} />
            {t('notFound.backHome')}
          </Link>
          <Link
            to="/try-free"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-semibold"
          >
            <Search className="mr-2" size={20} />
            {t('notFound.tryFree')}
          </Link>
        </div>

        <div className="mt-12 pt-12 border-t border-gray-200">
          <p className="text-gray-600 mb-4">{t('notFound.mightWant')}</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/hardware" className="text-purple-600 hover:underline">
              {t('notFound.hardware')}
            </Link>
            <Link to="/api" className="text-purple-600 hover:underline">
              {t('notFound.api')}
            </Link>
            <Link to="/saas" className="text-purple-600 hover:underline">
              {t('notFound.saas')}
            </Link>
            <Link to="/implementation" className="text-purple-600 hover:underline">
              {t('notFound.implementation')}
            </Link>
            <Link to="/dashboard" className="text-purple-600 hover:underline">
              {t('notFound.dashboard')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
