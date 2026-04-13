import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Check, Loader2, Mail, Download, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { postSelfieAnalysis, pickAnalysisPayload } from '../../lib/postSelfieAnalysis';
import { HAIR_ANALYSIS_API_DOCS, selfieApiUrl, trichoscopeApiUrl } from '../../config/api';

type AnalysisStep = 'upload' | 'questionnaire' | 'analyzing' | 'results';

export default function TryFreeAnalysis() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    concerns: [] as string[],
    email: '',
  });
  const [progress, setProgress] = useState(0);
  const [apiPayload, setApiPayload] = useState<Record<string, unknown> | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setCurrentStep('questionnaire');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConcernToggle = (concern: string) => {
    setFormData((prev) => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter((c) => c !== concern)
        : [...prev.concerns, concern],
    }));
  };

  const startAnalysis = async () => {
    if (!uploadedImage) return;
    setCurrentStep('analyzing');
    setProgress(10);
    setApiError(null);
    setApiPayload(null);

    const tick = setInterval(() => {
      setProgress((p) => (p < 92 ? p + Math.random() * 12 : p));
    }, 280);

    const result = await postSelfieAnalysis(uploadedImage, {
      age: formData.age,
      gender: formData.gender,
    });

    clearInterval(tick);
    setProgress(100);

    if (!result.ok || result.error) {
      setApiError(result.error || t('tryFree.results.apiFailed'));
    }

    const picked = pickAnalysisPayload(result.body);
    if (picked && Object.keys(picked).length > 0) {
      setApiPayload(picked);
    }

    setTimeout(() => setCurrentStep('results'), 400);
  };

  const concerns = [
    { key: 'hairLoss', label: t('tryFree.questionnaire.hairLoss') },
    { key: 'dandruff', label: t('tryFree.questionnaire.dandruff') },
    { key: 'oily', label: t('tryFree.questionnaire.oily') },
    { key: 'dry', label: t('tryFree.questionnaire.dry') },
    { key: 'thinning', label: t('tryFree.questionnaire.thinning') },
    { key: 'damage', label: t('tryFree.questionnaire.damage') },
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            {t('tryFree.backHome')}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('tryFree.title')}</h1>
          <p className="text-xl text-gray-600">{t('tryFree.subtitle')}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[
              { step: 'upload', label: t('tryFree.steps.upload') },
              { step: 'questionnaire', label: t('tryFree.steps.questionnaire') },
              { step: 'analyzing', label: t('tryFree.steps.analyzing') },
              { step: 'results', label: t('tryFree.steps.results') },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep === item.step
                      ? 'bg-purple-600 text-white'
                      : index <
                        ['upload', 'questionnaire', 'analyzing', 'results'].indexOf(currentStep)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index <
                  ['upload', 'questionnaire', 'analyzing', 'results'].indexOf(currentStep) ? (
                    <Check size={20} />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      index <
                      ['upload', 'questionnaire', 'analyzing', 'results'].indexOf(currentStep)
                        ? 'bg-green-600'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Step 1: Upload */}
          {currentStep === 'upload' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tryFree.upload.title')}</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    {t('tryFree.upload.dragDrop')}
                  </p>
                  <p className="text-sm text-gray-500">{t('tryFree.upload.formats')}</p>
                </label>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="flex items-start space-x-2">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm text-gray-600">{t('tryFree.upload.tip1')}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm text-gray-600">{t('tryFree.upload.tip2')}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm text-gray-600">{t('tryFree.upload.tip3')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Questionnaire */}
          {currentStep === 'questionnaire' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tryFree.questionnaire.title')}</h2>

              {uploadedImage && (
                <div className="mb-6">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-32 h-32 rounded-lg object-cover mx-auto"
                  />
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('tryFree.questionnaire.age')}
                  </label>
                  <select
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="">{t('tryFree.questionnaire.selectAge')}</option>
                    <option value="18-25">18-25</option>
                    <option value="26-35">26-35</option>
                    <option value="36-45">36-45</option>
                    <option value="46-55">46-55</option>
                    <option value="56+">56+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('tryFree.questionnaire.gender')}</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="">{t('tryFree.questionnaire.selectGender')}</option>
                    <option value="female">{t('tryFree.questionnaire.female')}</option>
                    <option value="male">{t('tryFree.questionnaire.male')}</option>
                    <option value="other">{t('tryFree.questionnaire.other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('tryFree.questionnaire.concerns')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {concerns.map((concern) => (
                      <button
                        key={concern.key}
                        onClick={() => handleConcernToggle(concern.key)}
                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                          formData.concerns.includes(concern.key)
                            ? 'border-purple-600 bg-purple-50 text-purple-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {concern.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex space-x-4">
                <button
                  onClick={() => setCurrentStep('upload')}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  {t('tryFree.questionnaire.previous')}
                </button>
                <button
                  onClick={startAnalysis}
                  disabled={!formData.age || !formData.gender}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('tryFree.questionnaire.analyze')}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Analyzing */}
          {currentStep === 'analyzing' && (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-6"
              >
                <Loader2 className="text-purple-600" size={64} />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('tryFree.analyzing.title')}</h2>

              <div className="max-w-md mx-auto mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">{Math.round(progress)}%</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: progress > 20 ? 1 : 0 }}>
                  {t('tryFree.analyzing.detecting')}
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: progress > 40 ? 1 : 0 }}>
                  {t('tryFree.analyzing.density')}
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: progress > 60 ? 1 : 0 }}>
                  {t('tryFree.analyzing.oil')}
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: progress > 80 ? 1 : 0 }}>
                  {t('tryFree.analyzing.generating')}
                </motion.p>
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {currentStep === 'results' && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Check className="text-green-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('tryFree.results.complete')}</h2>
                <p className="text-gray-600">{t('tryFree.results.yourScore')}</p>
              </div>

              {/* Score Display */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mb-8">
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-purple-600 mb-2">72/100</div>
                  <div className="text-lg text-gray-700">{t('tryFree.results.healthStatus')}</div>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">{t('tryFree.results.sebum')}</span>
                      <span className="font-semibold text-orange-600">{t('tryFree.results.high')}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="w-[75%] h-full bg-orange-500 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">{t('tryFree.results.density')}</span>
                      <span className="font-semibold text-green-600">{t('tryFree.results.normal')}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="w-[80%] h-full bg-green-500 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">{t('tryFree.results.scalp')}</span>
                      <span className="font-semibold text-yellow-600">{t('tryFree.results.mild')}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="w-[65%] h-full bg-yellow-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {apiError && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {apiError}
                </div>
              )}

              <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700 leading-relaxed">
                <p className="mb-2">{t('tryFree.results.apiSelfieHint')}</p>
                <p className="mb-2">{t('tryFree.results.apiTrichoscopeHint')}</p>
                <p className="mb-2">{t('tryFree.results.apiFieldHint')}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-slate-600">
                  <span>POST {selfieApiUrl()}</span>
                  <span>POST {trichoscopeApiUrl()}</span>
                </div>
                <a
                  href={HAIR_ANALYSIS_API_DOCS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-purple-700 font-semibold hover:underline"
                >
                  {t('tryFree.results.apiDocs')}
                  <ExternalLink size={14} />
                </a>
              </div>

              {apiPayload && Object.keys(apiPayload).length > 0 && (
                <div className="bg-white border border-purple-200 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-gray-900 mb-4">{t('tryFree.results.apiMetricsTitle')}</h3>
                  <dl className="grid sm:grid-cols-2 gap-3 text-sm">
                    {Object.entries(apiPayload).map(([key, val]) => (
                      <div key={key} className="flex justify-between gap-4 border-b border-gray-100 pb-2">
                        <dt className="text-gray-600 capitalize">
                          {key.replace(/_/g, ' ')}
                        </dt>
                        <dd className="font-mono text-gray-900 text-right shrink-0">
                          {typeof val === 'number' ? val.toLocaleString() : String(val)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Key Findings */}
              <div className="bg-white border-2 border-purple-100 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-gray-900 mb-4">{t('tryFree.results.findings')}</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">!</span>
                    <span className="text-gray-700">{t('tryFree.results.finding1')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{t('tryFree.results.finding2')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-500 mt-1">!</span>
                    <span className="text-gray-700">{t('tryFree.results.finding3')}</span>
                  </li>
                </ul>
              </div>

              {/* Blurred Detailed Report */}
              <div className="relative">
                <div className="filter blur-sm opacity-50 pointer-events-none">
                  <div className="bg-gray-100 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">{t('tryFree.results.detailedReport')}</h3>
                    <div className="space-y-4">
                      <div className="h-20 bg-gray-200 rounded" />
                      <div className="h-20 bg-gray-200 rounded" />
                      <div className="h-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>

                {/* Overlay CTA */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
                    <Download className="mx-auto mb-4 text-purple-600" size={48} />
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {t('tryFree.results.getFullReport')}
                    </h3>

                    <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold mb-3">
                      {t('tryFree.results.downloadApp')}
                    </button>

                    <div className="text-sm text-gray-600">{t('tryFree.results.haveAccount')} <Link to="/dashboard" className="text-purple-600 hover:underline">{t('tryFree.results.signIn')}</Link></div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-3">{t('tryFree.results.emailResults')}</p>
                      <div className="flex space-x-2">
                        <input
                          type="email"
                          placeholder={t('tryFree.results.emailPlaceholder')}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm"
                        />
                        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center">
                          <Mail size={16} className="mr-1" />
                          {t('tryFree.results.send')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
