import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Check, Loader2, Mail, Download, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import {
  postSelfieByImageUrl,
  uploadSelfieAndGetUrl,
  pickAnalysisPayload,
} from '../../lib/postSelfieAnalysis';
import {
  HAIR_ANALYSIS_API_DOCS,
} from '../../config/api';

const IOS_APP_URL =
  'https://apps.apple.com/us/app/lushair-hair-care-assistant/id6499344143';
const ANDROID_APP_URL =
  'https://play.google.com/store/apps/details?id=com.lushair.jh_camera&pcampaignid=web_share';

type AnalysisStep = 'upload' | 'questionnaire' | 'analyzing' | 'results';
type UploadSlot = 'front' | 'right' | 'left' | 'top';

type UploadState = {
  file: File | null;
  preview: string | null;
  uploadedUrl: string | null;
  uploading: boolean;
  error: string | null;
};

const uploadRequirements: Array<{ key: UploadSlot; title: string; hint: string }> = [
  {
    key: 'front',
    title: 'Front selfie (head tilting down 30°)',
    hint: 'Required for analysis API',
  },
  {
    key: 'right',
    title: 'Right-side selfie (head tilting down 30°)',
    hint: 'Required upload',
  },
  {
    key: 'left',
    title: 'Left-side selfie (head tilting down 30°)',
    hint: 'Required upload',
  },
  {
    key: 'top',
    title: 'Top of head (fully tilting down)',
    hint: 'Required upload',
  },
];

const emptyUploadState = (): UploadState => ({
  file: null,
  preview: null,
  uploadedUrl: null,
  uploading: false,
  error: null,
});

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function pickFromPayload(payload: Record<string, unknown> | null, keys: string[]): unknown {
  if (!payload) return null;
  for (const key of keys) {
    if (key in payload) return payload[key];
  }
  return null;
}

function toDisplayText(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim()) return value;
  const n = asNumber(value);
  if (n !== null) return String(n);
  return fallback;
}

function translatePositionToEnglish(value: string): string {
  const v = value.trim();
  if (!v) return v;
  const lower = v.toLowerCase();
  if (lower.includes('frontal') || lower.includes('temple') || /前额|额角|m区/.test(v)) {
    return 'Frontal / Temples';
  }
  if (lower.includes('crown') || lower.includes('vertex') || /头顶|顶部|冠部/.test(v)) {
    return 'Crown (Vertex)';
  }
  if (lower.includes('mid') || /中部|中区/.test(v)) {
    return 'Mid-scalp';
  }
  if (lower.includes('diffuse') || /弥漫|整体/.test(v)) {
    return 'Diffuse';
  }
  if (/后枕|后部/.test(v)) return 'Occipital';
  return v;
}

function translateStageToEnglish(value: string): string {
  const v = value.trim();
  if (!v) return v;
  const lower = v.toLowerCase();
  const romanMap: Record<string, string> = {
    i: 'I',
    ii: 'II',
    iii: 'III',
    iv: 'IV',
    v: 'V',
    vi: 'VI',
    vii: 'VII',
  };
  const romanMatch = lower.match(/\b(vii|vi|iv|v|iii|ii|i)\b/);
  if (romanMatch) return `Norwood ${romanMap[romanMatch[1]]}`;
  const numMatch = lower.match(/\b([1-7])\b/);
  if (numMatch) return `Norwood ${numMatch[1]}`;
  const cnMap: Record<string, string> = {
    一: '1',
    二: '2',
    三: '3',
    四: '4',
    五: '5',
    六: '6',
    七: '7',
  };
  const cnMatch = v.match(/[一二三四五六七]/);
  if (cnMatch) return `Norwood ${cnMap[cnMatch[0]]}`;
  if (/早期|轻度/.test(v)) return 'Early stage';
  if (/中期|中度/.test(v)) return 'Moderate stage';
  if (/晚期|重度/.test(v)) return 'Advanced stage';
  return v;
}

function getHealthStatusByScore(score: number): string {
  if (score > 80) return 'Good';
  if (score >= 65) return 'Fair';
  if (score >= 50) return 'Needs Attention';
  return 'Poor';
}

function buildHexPoints(scores: number[], center: number, radius: number): string {
  return scores
    .map((score, i) => {
      const angle = -Math.PI / 2 + (i * Math.PI) / 3;
      const r = (Math.max(0, Math.min(100, score)) / 100) * radius;
      const x = center + Math.cos(angle) * r;
      const y = center + Math.sin(angle) * r;
      return `${x},${y}`;
    })
    .join(' ');
}

export default function TryFreeAnalysis() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('upload');
  const [uploads, setUploads] = useState<Record<UploadSlot, UploadState>>({
    front: emptyUploadState(),
    right: emptyUploadState(),
    left: emptyUploadState(),
    top: emptyUploadState(),
  });
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    concerns: [] as string[],
    scalpHealthSurvey: 3,
    hairDensitySurvey: 3,
    follicleHealthSurvey: 3,
    email: '',
  });
  const [progress, setProgress] = useState(0);
  const [apiPayload, setApiPayload] = useState<Record<string, unknown> | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const isUploadStepComplete = uploadRequirements.every((item) => Boolean(uploads[item.key].uploadedUrl));
  const isAnyUploading = uploadRequirements.some((item) => uploads[item.key].uploading);
  const frontPreview = uploads.front.preview;
  const frontImageUrl = uploads.front.uploadedUrl;

  const handleImageUpload = async (slot: UploadSlot, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setApiError(null);
    setUploads((prev) => ({
      ...prev,
      [slot]: {
        file,
        preview: previewUrl,
        uploadedUrl: null,
        uploading: true,
        error: null,
      },
    }));

    const uploadResult = await uploadSelfieAndGetUrl(file);
    setUploads((prev) => ({
      ...prev,
      [slot]: {
        ...prev[slot],
        uploading: false,
        uploadedUrl: uploadResult.ok && uploadResult.imageUrl ? uploadResult.imageUrl : null,
        error: uploadResult.ok && uploadResult.imageUrl ? null : uploadResult.error || t('tryFree.results.apiFailed'),
      },
    }));
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
    if (!isUploadStepComplete) {
      setApiError('Please upload all 4 required images before starting analysis.');
      return;
    }
    setApiError(null);
    if (!frontImageUrl) {
      setApiError(
        'Front selfie upload is missing. Please upload the front selfie (head tilting down 30°).'
      );
      return;
    }
    setCurrentStep('analyzing');
    setProgress(10);
    setApiPayload(null);

    const tick = setInterval(() => {
      setProgress((p) => (p < 92 ? p + Math.random() * 12 : p));
    }, 280);

    // Upload all 4 images first, but selfieNetApi uses front selfie URL only.
    const result = await postSelfieByImageUrl(frontImageUrl, formData.gender);

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

  const surveyScoreOptions = [1, 2, 3, 4, 5];
  const surveyToPercent = (v: number) => Math.round((v / 5) * 100);

  const apiScalpScore = asNumber(
    pickFromPayload(apiPayload, ['scalpHealthScore', 'scalp_health_score', 'scalpScore'])
  );
  const apiDensityScore = asNumber(
    pickFromPayload(apiPayload, ['hairDensityScore', 'hair_density_score', 'densityScore'])
  );
  const apiFollicleScore = asNumber(
    pickFromPayload(apiPayload, ['follicleHealthScore', 'follicle_health_score', 'follicleScore'])
  );
  const apiSebumScore = asNumber(pickFromPayload(apiPayload, ['sebumScore', 'sebum_score', 'oilScore']));
  const apiRednessScore = asNumber(
    pickFromPayload(apiPayload, ['rednessScore', 'redness_score', 'inflammationScore'])
  );
  const apiKeratinScore = asNumber(
    pickFromPayload(apiPayload, ['keratinocyteScore', 'keratinocyte_score', 'dandruffScore'])
  );

  const radarScores = [
    apiScalpScore ?? surveyToPercent(formData.scalpHealthSurvey),
    apiDensityScore ?? surveyToPercent(formData.hairDensitySurvey),
    apiFollicleScore ?? surveyToPercent(formData.follicleHealthSurvey),
    apiSebumScore ?? 72,
    apiRednessScore ?? 65,
    apiKeratinScore ?? 68,
  ];

  const radarLabels = [
    t('tryFree.results.radarScalpHealth'),
    t('tryFree.results.radarHairDensity'),
    t('tryFree.results.radarFollicleHealth'),
    t('tryFree.results.radarSebumBalance'),
    t('tryFree.results.radarRednessControl'),
    t('tryFree.results.radarKeratinSignal'),
  ];
  const radarCenter = 110;
  const radarRadius = 82;
  const radarPolygon = buildHexPoints(radarScores, radarCenter, radarRadius);
  const overallScore = Math.round(radarScores.reduce((sum, score) => sum + score, 0) / radarScores.length);

  const hairLossPosition = toDisplayText(
    pickFromPayload(apiPayload, [
      'POSITION',
      'hairLossPosition',
      'hair_loss_position',
      'lossPosition',
      'baldingArea',
      '脱发位置',
    ]),
    t('tryFree.results.pendingApiResult')
  );
  const hairLossStage = toDisplayText(
    pickFromPayload(apiPayload, [
      'STAGE',
      'hairLossStage',
      'hair_loss_stage',
      'stage',
      'alopeciaStage',
      '脱发阶段',
    ]),
    t('tryFree.results.pendingApiResult')
  );
  const hairLossPositionEn =
    hairLossPosition === t('tryFree.results.pendingApiResult')
      ? hairLossPosition
      : translatePositionToEnglish(hairLossPosition);
  const hairLossStageEn =
    hairLossStage === t('tryFree.results.pendingApiResult')
      ? hairLossStage
      : translateStageToEnglish(hairLossStage);
  const healthStatus = getHealthStatusByScore(overallScore);

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
              <div className="grid gap-4 md:grid-cols-2">
                {uploadRequirements.map((item) => {
                  const slot = uploads[item.key];
                  const inputId = `image-upload-${item.key}`;
                  return (
                    <div key={item.key} className="border-2 border-dashed border-gray-300 rounded-xl p-5 hover:border-purple-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(item.key, e)}
                        className="hidden"
                        id={inputId}
                      />
                      <label htmlFor={inputId} className="cursor-pointer block">
                        {slot.preview ? (
                          <img src={slot.preview} alt={item.title} className="w-full h-36 rounded-lg object-cover mb-3" />
                        ) : (
                          <div className="h-36 rounded-lg bg-gray-50 flex items-center justify-center mb-3">
                            <Upload className="text-gray-400" size={36} />
                          </div>
                        )}
                        <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.hint}</p>
                        <div className="mt-2 text-xs">
                          {slot.uploading && <span className="text-purple-700">Uploading...</span>}
                          {!slot.uploading && slot.uploadedUrl && (
                            <span className="text-green-700 inline-flex items-center gap-1">
                              <Check size={14} />
                              Uploaded
                            </span>
                          )}
                          {!slot.uploading && slot.error && <span className="text-amber-700">{slot.error}</span>}
                        </div>
                      </label>
                    </div>
                  );
                })}
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

              <div className="mt-8">
                <button
                  onClick={() => setCurrentStep('questionnaire')}
                  disabled={!isUploadStepComplete || isAnyUploading}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Questionnaire */}
          {currentStep === 'questionnaire' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tryFree.questionnaire.title')}</h2>

              {frontPreview && (
                <div className="mb-6">
                  <img
                    src={frontPreview}
                    alt="Front uploaded"
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

                <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">
                    {t('tryFree.questionnaire.quickAssessment')}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('tryFree.questionnaire.scalpHealth')}</label>
                      <select
                        value={formData.scalpHealthSurvey}
                        onChange={(e) =>
                          setFormData({ ...formData, scalpHealthSurvey: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      >
                        {surveyScoreOptions.map((score) => (
                          <option key={score} value={score}>
                            {score} / 5
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('tryFree.questionnaire.hairDensityScore')}</label>
                      <select
                        value={formData.hairDensitySurvey}
                        onChange={(e) =>
                          setFormData({ ...formData, hairDensitySurvey: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      >
                        {surveyScoreOptions.map((score) => (
                          <option key={score} value={score}>
                            {score} / 5
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('tryFree.questionnaire.follicleHealth')}</label>
                      <select
                        value={formData.follicleHealthSurvey}
                        onChange={(e) =>
                          setFormData({ ...formData, follicleHealthSurvey: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                      >
                        {surveyScoreOptions.map((score) => (
                          <option key={score} value={score}>
                            {score} / 5
                          </option>
                        ))}
                      </select>
                    </div>
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
                  disabled={!formData.age || !formData.gender || isAnyUploading || !isUploadStepComplete}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnyUploading ? 'Uploading images...' : t('tryFree.questionnaire.analyze')}
                </button>
              </div>

              {apiError && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {apiError}
                </div>
              )}
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

              <div className="rounded-2xl border border-slate-200 bg-white p-4 mb-6">
                <div className="grid gap-4 sm:grid-cols-2 mb-3">
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                    <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                      {t('tryFree.results.hairLossPosition')}
                    </div>
                    <div className="text-lg font-bold text-gray-900">{hairLossPositionEn}</div>
                  </div>
                  <div className="rounded-xl border border-fuchsia-100 bg-fuchsia-50/60 p-4">
                    <div className="text-xs font-semibold text-fuchsia-600 uppercase tracking-wide mb-1">
                      {t('tryFree.results.hairLossStage')}
                    </div>
                    <div className="text-lg font-bold text-gray-900">{hairLossStageEn}</div>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <a
                    href={HAIR_ANALYSIS_API_DOCS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-purple-700 text-sm font-semibold hover:underline"
                  >
                    {t('tryFree.results.apiDocs')}
                    <ExternalLink size={14} />
                  </a>
                  <span className="text-xs text-gray-500">based on the Norwood Scale</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mb-8">
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-purple-600 mb-2">{overallScore}/100</div>
                  <div className="text-lg text-gray-700">Hair Health Status: {healthStatus}</div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[260px_1fr] items-center">
                  <div className="mx-auto">
                    <svg width="220" height="220" viewBox="0 0 220 220" role="img" aria-label="Hair health radar chart">
                      {[1, 2, 3, 4].map((level) => {
                        const r = (radarRadius / 4) * level;
                        const grid = buildHexPoints([100, 100, 100, 100, 100, 100], radarCenter, r);
                        return (
                          <polygon
                            key={level}
                            points={grid}
                            fill="none"
                            stroke="#d8b4fe"
                            strokeWidth="1"
                            opacity={0.7}
                          />
                        );
                      })}
                      {radarLabels.map((_, i) => {
                        const angle = -Math.PI / 2 + (i * Math.PI) / 3;
                        const x = radarCenter + Math.cos(angle) * radarRadius;
                        const y = radarCenter + Math.sin(angle) * radarRadius;
                        return (
                          <line
                            key={i}
                            x1={radarCenter}
                            y1={radarCenter}
                            x2={x}
                            y2={y}
                            stroke="#c4b5fd"
                            strokeWidth="1"
                          />
                        );
                      })}
                      <polygon
                        points={radarPolygon}
                        fill="rgba(118,34,255,0.35)"
                        stroke="#7622ff"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {radarLabels.map((label, idx) => (
                      <div key={label} className="rounded-lg border border-white/80 bg-white/70 px-3 py-2">
                        <div className="text-xs text-gray-500">{label}</div>
                        <div className="text-sm font-semibold text-gray-900">{radarScores[idx]}/100</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-right text-xs text-gray-500">based on the Norwood Scale</div>
              </div>

              {apiError && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {apiError}
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

                    <div className="mb-3 grid gap-2">
                      <a
                        href={IOS_APP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold block"
                      >
                        {t('tryFree.results.downloadApp')} (iOS)
                      </a>
                      <a
                        href={ANDROID_APP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold block"
                      >
                        {t('tryFree.results.downloadApp')} (Android)
                      </a>
                    </div>

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
