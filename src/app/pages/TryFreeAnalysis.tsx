import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Check, Loader2, Download, ArrowLeft, ExternalLink } from 'lucide-react';
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
type ReferencePattern = 'top' | 'frontal' | 'women';
type QuizQuestion = { id: string; prompt: string; options: string[]; multi?: boolean };
type QuizSection = { title: string; questions: QuizQuestion[] };
type QuizQuestionWithSection = QuizQuestion & { sectionTitle: string };

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

const quizSections: QuizSection[] = [
  {
    title: 'Section 1: Perception & Awareness',
    questions: [
      { id: 'q1', prompt: 'How do you currently feel about your hair condition?', options: ['Very satisfied', 'Generally okay, but haven’t looked closely', 'Slightly concerned', 'Very concerned'] },
      { id: 'q2', prompt: 'Have you noticed any changes in your hair over the past 6–12 months?', options: ['Yes, clearly', 'Slight changes', 'No noticeable changes', 'Not sure'] },
      { id: 'q3', prompt: 'Which of the following changes have you noticed? (Select all that apply)', multi: true, options: ['Receding hairline', 'Widening part', 'Increased shedding', 'Hair feels thinner or finer', 'Hair volume has decreased', 'None of the above'] },
      { id: 'q4', prompt: 'Where are you most concerned about hair changes?', options: ['Hairline', 'Crown / top of head', 'Overall thinning', 'Not sure'] },
    ],
  },
  {
    title: 'Section 2: Scalp Condition & Habits',
    questions: [
      { id: 'q5', prompt: 'How would you describe your scalp condition?', options: ['Oily', 'Dry', 'Flaky', 'Sensitive / irritated', 'Not sure'] },
      { id: 'q6', prompt: 'How often do you experience scalp discomfort (itching, irritation, tightness)?', options: ['Frequently', 'Occasionally', 'Rarely', 'Never'] },
      { id: 'q7', prompt: 'How often do you wash your hair?', options: ['Every day', 'Every other day', 'Every 2–3 days', 'Irregular / varies'] },
      { id: 'q8', prompt: 'How quickly does your scalp get oily after washing?', options: ['Same day', 'Next day', 'After 2–3 days', 'Not sure'] },
    ],
  },
  {
    title: 'Section 3: Hair Changes & Tracking',
    questions: [
      { id: 'q9', prompt: 'How would you describe your hair thickness compared to before?', options: ['Thicker', 'About the same', 'Slightly thinner', 'Much thinner'] },
      { id: 'q10', prompt: 'Have you noticed more hair shedding recently?', options: ['Yes, significantly more', 'Slightly more', 'About the same', 'Not sure'] },
      { id: 'q11', prompt: 'Have you ever examined your scalp or hair follicles up close?', options: ['Yes, with a device or tool', 'Yes, going to Hair Salon/ Spa', 'Yes, casually (mirror / camera)', 'No', 'Not sure'] },
      { id: 'q12', prompt: 'Have you ever taken close-up photos of your scalp or hairline?', options: ['Yes, regularly', 'Occasionally', 'Once or twice', 'Never'] },
      { id: 'q13', prompt: 'How do you usually assess your hair health?', options: ['Mirror', 'Photos', 'Shedding amount', 'I don’t really know'] },
      { id: 'q14', prompt: 'How confident are you in your understanding of your scalp condition?', options: ['Very confident', 'Somewhat confident', 'Not very confident', 'Not confident at all'] },
    ],
  },
  {
    title: 'Section 4: Behavior & Pain Points',
    questions: [
      { id: 'q15', prompt: 'Have you tried any hair or scalp treatments?', options: ['Medical / dermatologist treatments', 'Hair growth products', 'Scalp care products', 'No'] },
      { id: 'q16', prompt: 'How confident are you that your current routine is effective?', options: ['Very confident', 'Somewhat confident', 'Not very confident', 'Not confident at all'] },
      { id: 'q17', prompt: 'Have you ever felt unsure whether your hair products are actually working?', options: ['Yes, often', 'Sometimes', 'Rarely', 'Never'] },
      { id: 'q18', prompt: 'What frustrates you most about managing your hair health? (Select all that apply)', multi: true, options: ['Not seeing clear results', 'Not knowing what’s actually happening', 'Trying products without certainty', 'Lack of reliable information'] },
    ],
  },
  {
    title: 'Section 5: Device Mindset & Conversion',
    questions: [
      { id: 'q19', prompt: 'What would make you trust a hair/scalp analysis the most?', options: ['Visual proof (scalp / follicle images)', 'Data tracking over time', 'Professional / clinical insights', 'Personal experience only'] },
      { id: 'q20', prompt: 'How likely are you to use a device that helps monitor hair growth and scalp health?', options: ['Very likely', 'Likely', 'Not sure', 'Unlikely'] },
    ],
  },
];

const flattenedQuizQuestions: QuizQuestionWithSection[] = quizSections.flatMap((section) =>
  section.questions.map((question) => ({ ...question, sectionTitle: section.title }))
);

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

/**
 * Pixel grid on `public/hair-loss-type-stage-reference.jpg` (1024×598).
 * Calibrated from image edges: gutter ~181px, header ~76px, 4 pattern rows × 7 class columns.
 */
const NORWOOD_CHART = {
  width: 1024,
  height: 598,
  headerHeight: 76,
  patternColumnWidth: 181,
  rows: 4,
  classColumns: 7,
} as const;

const REFERENCE_CHART_SRC = '/hair-loss-type-stage-reference.jpg';

function pickReferencePattern(position: string, gender: string): { pattern: ReferencePattern; row: number; label: string } {
  if (gender === 'female') {
    return { pattern: 'women', row: 4, label: "Women's pattern" };
  }
  const lower = position.toLowerCase();
  if (lower.includes('crown') || lower.includes('vertex')) {
    return { pattern: 'top', row: 3, label: 'Crown pattern' };
  }
  if (lower.includes('frontal') || lower.includes('temple')) {
    return { pattern: 'frontal', row: 2, label: 'Frontal pattern' };
  }
  return { pattern: 'top', row: 1, label: 'Top-of-head pattern' };
}

function getReferenceCell(row: number, stageClass: number) {
  const classWidth = (NORWOOD_CHART.width - NORWOOD_CHART.patternColumnWidth) / NORWOOD_CHART.classColumns;
  const rowHeight = (NORWOOD_CHART.height - NORWOOD_CHART.headerHeight) / NORWOOD_CHART.rows;
  const safeClass = Math.max(1, Math.min(7, stageClass));
  const safeRow = Math.max(1, Math.min(NORWOOD_CHART.rows, row));
  return {
    x: NORWOOD_CHART.patternColumnWidth + (safeClass - 1) * classWidth,
    y: NORWOOD_CHART.headerHeight + (safeRow - 1) * rowHeight,
    width: classWidth,
    height: rowHeight,
  };
}

function extractStageNumber(value: string): string | null {
  const v = value.trim();
  if (!v) return null;

  const digit = v.match(/\b([1-7])\b/);
  if (digit) return digit[1];

  const lower = v.toLowerCase();
  const romanToNumber: Record<string, string> = {
    i: '1',
    ii: '2',
    iii: '3',
    iv: '4',
    v: '5',
    vi: '6',
    vii: '7',
  };
  const roman = lower.match(/\b(vii|vi|iv|v|iii|ii|i)\b/);
  if (roman) return romanToNumber[roman[1]];

  const cnToNumber: Record<string, string> = {
    一: '1',
    二: '2',
    三: '3',
    四: '4',
    五: '5',
    六: '6',
    七: '7',
  };
  const cn = v.match(/[一二三四五六七]/);
  if (cn) return cnToNumber[cn[0]];

  return null;
}

function getLifestyleAdvice(
  score: number,
  concerns: string[],
  sebumScore: number | null,
  rednessScore: number | null
): string[] {
  const tips: string[] = [];

  if (score >= 80) {
    tips.push('Maintain your current routine and keep a consistent weekly scalp-check habit.');
  } else if (score >= 65) {
    tips.push('Improve sleep consistency and reduce heat styling frequency for the next 4 weeks.');
  } else {
    tips.push('Prioritize recovery: 7-8 hours of sleep, lower stress load, and avoid aggressive styling.');
  }

  if (concerns.includes('hairLoss') || concerns.includes('thinning')) {
    tips.push('Add 5-10 minutes of daily scalp massage and track shedding patterns weekly.');
  }

  if ((sebumScore !== null && sebumScore > 70) || concerns.includes('oily')) {
    tips.push('Use a gentle oil-control scalp cleanser and avoid heavy leave-in products near roots.');
  } else if ((rednessScore !== null && rednessScore > 70) || concerns.includes('dry')) {
    tips.push('Lower wash-water temperature and use soothing scalp hydration 2-3 times per week.');
  } else {
    tips.push('Balance nutrition with enough protein, iron-rich foods, and hydration each day.');
  }

  return tips.slice(0, 3);
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
    email: '',
  });
  const [progress, setProgress] = useState(0);
  const [apiPayload, setApiPayload] = useState<Record<string, unknown> | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | string[]>>({});
  const [quizStepIndex, setQuizStepIndex] = useState(0);
  const [referenceViewPhase, setReferenceViewPhase] = useState<'full' | 'focus'>('focus');
  const referenceHoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isUploadStepComplete = uploadRequirements.every((item) => Boolean(uploads[item.key].uploadedUrl));
  const isAnyUploading = uploadRequirements.some((item) => uploads[item.key].uploading);
  const frontPreview = uploads.front.preview;
  const frontImageUrl = uploads.front.uploadedUrl;
  const isQuizComplete = quizSections.every((section) =>
    section.questions.every((question) => {
      const answer = quizAnswers[question.id];
      if (question.multi) return Array.isArray(answer) && answer.length > 0;
      return typeof answer === 'string' && answer.trim().length > 0;
    })
  );

  const setSingleQuizAnswer = (id: string, value: string) => {
    setQuizAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const toggleMultiQuizAnswer = (id: string, value: string) => {
    setQuizAnswers((prev) => {
      const current = prev[id];
      const list = Array.isArray(current) ? current : [];
      const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
      return { ...prev, [id]: next };
    });
  };

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
    if (!isQuizComplete) {
      setApiError('Please complete all quiz questions before starting analysis.');
      return;
    }
    if (!formData.email.trim()) {
      setApiError('Please enter your email before viewing analysis results.');
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

  const questionFlow = [
    {
      id: 'age',
      sectionTitle: 'Basic Profile',
      prompt: t('tryFree.questionnaire.age'),
      type: 'single' as const,
      options: ['18-25', '26-35', '36-45', '46-55', '56+'],
    },
    {
      id: 'gender',
      sectionTitle: 'Basic Profile',
      prompt: t('tryFree.questionnaire.gender'),
      type: 'single' as const,
      options: ['female', 'male'],
    },
    {
      id: 'concerns',
      sectionTitle: 'Basic Profile',
      prompt: t('tryFree.questionnaire.concerns'),
      type: 'multi' as const,
      options: concerns.map((c) => c.key),
    },
    ...flattenedQuizQuestions.map((q) => ({
      id: q.id,
      sectionTitle: q.sectionTitle,
      prompt: q.prompt,
      type: (q.multi ? 'multi' : 'single') as 'single' | 'multi',
      options: q.options,
      fromQuiz: true,
    })),
    {
      id: 'email',
      sectionTitle: 'Contact',
      prompt: 'Email (required before results)',
      type: 'email' as const,
      options: [],
    },
  ];

  const currentFlowItem = questionFlow[Math.min(quizStepIndex, questionFlow.length - 1)];
  const quizProgressPercent = Math.round(((quizStepIndex + 1) / questionFlow.length) * 100);

  const getOptionLabel = (itemId: string, option: string) => {
    if (itemId === 'gender') return option === 'female' ? t('tryFree.questionnaire.female') : t('tryFree.questionnaire.male');
    if (itemId === 'concerns') return concerns.find((c) => c.key === option)?.label || option;
    if (itemId.endsWith('Survey')) return `${option} / 5`;
    return option;
  };

  const isFlowItemAnswered = (item: (typeof questionFlow)[number]) => {
    if (item.id === 'age') return Boolean(formData.age);
    if (item.id === 'gender') return Boolean(formData.gender);
    if (item.id === 'email') return Boolean(formData.email.trim());
    if (item.id === 'concerns') return formData.concerns.length > 0;
    const answer = quizAnswers[item.id];
    if (item.type === 'multi') return Array.isArray(answer) && answer.length > 0;
    return typeof answer === 'string' && answer.trim().length > 0;
  };

  const saveFlowAnswer = (item: (typeof questionFlow)[number], value: string) => {
    if (item.id === 'age') {
      setFormData((prev) => ({ ...prev, age: value }));
      return;
    }
    if (item.id === 'gender') {
      setFormData((prev) => ({ ...prev, gender: value }));
      return;
    }
    if (item.id === 'email') {
      setFormData((prev) => ({ ...prev, email: value }));
      return;
    }
    if (item.id === 'concerns') {
      handleConcernToggle(value);
      return;
    }
    if (item.type === 'multi') {
      toggleMultiQuizAnswer(item.id, value);
      return;
    }
    setSingleQuizAnswer(item.id, value);
  };

  const getFlowSelectionState = (item: (typeof questionFlow)[number], option: string) => {
    if (item.id === 'age') return formData.age === option;
    if (item.id === 'gender') return formData.gender === option;
    if (item.id === 'concerns') return formData.concerns.includes(option);
    const answer = quizAnswers[item.id];
    if (item.type === 'multi') return Array.isArray(answer) && answer.includes(option);
    return answer === option;
  };

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

  const quizSingle = (id: string) => {
    const v = quizAnswers[id];
    return typeof v === 'string' ? v : '';
  };
  const quizMulti = (id: string) => {
    const v = quizAnswers[id];
    return Array.isArray(v) ? v : [];
  };

  const quizScalpScore = (() => {
    const scalpType = quizSingle('q5');
    const discomfort = quizSingle('q6');
    const oilySpeed = quizSingle('q8');
    let score = 72;
    if (scalpType === 'Sensitive / irritated' || scalpType === 'Flaky') score -= 14;
    if (scalpType === 'Dry' || scalpType === 'Oily') score -= 8;
    if (discomfort === 'Frequently') score -= 14;
    else if (discomfort === 'Occasionally') score -= 8;
    else if (discomfort === 'Rarely') score -= 3;
    if (oilySpeed === 'Same day') score -= 10;
    else if (oilySpeed === 'Next day') score -= 6;
    return Math.max(20, Math.min(95, score));
  })();

  const quizDensityScore = (() => {
    const thickness = quizSingle('q9');
    const shedding = quizSingle('q10');
    const changes = quizMulti('q3');
    let score = 74;
    if (thickness === 'Much thinner') score -= 18;
    else if (thickness === 'Slightly thinner') score -= 10;
    if (shedding === 'Yes, significantly more') score -= 16;
    else if (shedding === 'Slightly more') score -= 8;
    const densityFlags = ['Hair feels thinner or finer', 'Hair volume has decreased', 'Increased shedding'];
    score -= Math.min(12, changes.filter((item) => densityFlags.includes(item)).length * 4);
    return Math.max(20, Math.min(95, score));
  })();

  const quizFollicleScore = (() => {
    const closeExam = quizSingle('q11');
    const photos = quizSingle('q12');
    const confidence = quizSingle('q14');
    let score = 70;
    if (closeExam === 'Yes, with a device or tool') score += 10;
    else if (closeExam === 'Yes, casually (mirror / camera)') score += 4;
    else if (closeExam === 'No') score -= 6;
    if (photos === 'Yes, regularly') score += 8;
    else if (photos === 'Occasionally') score += 4;
    else if (photos === 'Never') score -= 5;
    if (confidence === 'Very confident') score += 6;
    else if (confidence === 'Somewhat confident') score += 2;
    else if (confidence === 'Not confident at all') score -= 8;
    return Math.max(20, Math.min(95, score));
  })();

  const radarScores = [
    apiScalpScore ?? quizScalpScore,
    apiDensityScore ?? quizDensityScore,
    apiFollicleScore ?? quizFollicleScore,
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
  const stageNumber = hairLossStage === t('tryFree.results.pendingApiResult')
    ? null
    : extractStageNumber(hairLossStage);
  const hairLossStageCardValue = hairLossStage === t('tryFree.results.pendingApiResult')
    ? hairLossStage
    : stageNumber ?? hairLossStageEn;
  const lifestyleTips = getLifestyleAdvice(
    overallScore,
    formData.concerns,
    apiSebumScore,
    apiRednessScore
  );
  const hairlineY = stageNumber ? Math.min(44, 28 + Number(stageNumber) * 2) : 32;
  const hairlinePath = `M18 ${hairlineY} C34 ${hairlineY - 9},66 ${hairlineY - 9},82 ${hairlineY}`;
  const referencePattern = pickReferencePattern(hairLossPositionEn, formData.gender);
  const referenceStage = Math.max(1, Math.min(7, Number(stageNumber || '1')));
  const referenceCell = getReferenceCell(referencePattern.row, referenceStage);

  useEffect(() => {
    return () => {
      if (referenceHoverTimeoutRef.current) clearTimeout(referenceHoverTimeoutRef.current);
    };
  }, []);

  const triggerReferenceHoverPreview = () => {
    if (referenceHoverTimeoutRef.current) clearTimeout(referenceHoverTimeoutRef.current);
    setReferenceViewPhase('full');
    referenceHoverTimeoutRef.current = setTimeout(() => {
      setReferenceViewPhase('focus');
    }, 1200);
  };

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
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
                          <img
                            src={slot.preview}
                            alt={item.title}
                            className="w-full h-40 rounded-lg object-contain bg-gray-50 mb-3"
                          />
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
                  onClick={() => {
                    setQuizStepIndex(0);
                    setCurrentStep('questionnaire');
                  }}
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
                    className="w-40 h-40 rounded-lg object-contain bg-gray-50 mx-auto"
                  />
                </div>
              )}

              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>{currentFlowItem.sectionTitle}</span>
                  <span>
                    {quizStepIndex + 1}/{questionFlow.length}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-700"
                    animate={{ width: `${quizProgressPercent}%` }}
                    transition={{ duration: 0.25 }}
                  />
                </div>
              </div>

              <motion.div
                key={currentFlowItem.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-gray-200 bg-gray-50/60 p-5"
              >
                <div className="text-lg font-semibold text-gray-900 mb-4">{currentFlowItem.prompt}</div>
                {currentFlowItem.type === 'email' ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => saveFlowAnswer(currentFlowItem, e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
                  />
                ) : (
                  <div className="grid gap-2">
                    {currentFlowItem.options.map((option) => {
                      const selected = getFlowSelectionState(currentFlowItem, option);
                      return (
                        <label
                          key={option}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                            selected
                              ? 'border-purple-500 bg-purple-50 text-purple-800'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <input
                            type={currentFlowItem.type === 'multi' ? 'checkbox' : 'radio'}
                            name={currentFlowItem.id}
                            checked={selected}
                            onChange={() => saveFlowAnswer(currentFlowItem, option)}
                          />
                          <span>{getOptionLabel(currentFlowItem.id, option)}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              <div className="mt-8 flex space-x-4">
                <button
                  onClick={() => {
                    if (quizStepIndex === 0) {
                      setCurrentStep('upload');
                      return;
                    }
                    setQuizStepIndex((prev) => Math.max(0, prev - 1));
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  {t('tryFree.questionnaire.previous')}
                </button>
                <button
                  onClick={() => {
                    if (!isFlowItemAnswered(currentFlowItem)) return;
                    if (quizStepIndex < questionFlow.length - 1) {
                      setQuizStepIndex((prev) => prev + 1);
                      return;
                    }
                    startAnalysis();
                  }}
                  disabled={!isFlowItemAnswered(currentFlowItem) || isAnyUploading || !isUploadStepComplete}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {quizStepIndex < questionFlow.length - 1
                    ? 'Next Question'
                    : isAnyUploading
                    ? 'Uploading images...'
                    : t('tryFree.questionnaire.analyze')}
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
            <div className="py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('tryFree.analyzing.title')}</h2>

              {frontPreview && (
                <div className="max-w-md mx-auto mb-8">
                  <div className="relative w-full aspect-[9/16] max-h-[70vh] rounded-2xl overflow-hidden border border-purple-200 bg-black/5 shadow-lg">
                    <img
                      src={frontPreview}
                      alt="AI analysis target"
                      className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                    />

                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 bg-purple-900/10" />

                      <motion.div
                        className="absolute left-0 right-0 h-1.5 bg-purple-300/50"
                        animate={{ y: ['0%', '6400%', '0%'] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
                      />

                      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-25">
                        {Array.from({ length: 36 }).map((_, idx) => (
                          <div key={idx} className="border border-white/20" />
                        ))}
                      </div>

                      {[
                        { left: '23%', top: '28%' },
                        { left: '54%', top: '22%' },
                        { left: '39%', top: '48%' },
                        { left: '62%', top: '56%' },
                      ].map((point, idx) => (
                        <motion.div
                          key={idx}
                          className="absolute"
                          style={{ left: point.left, top: point.top }}
                          initial={{ scale: 0.6, opacity: 0.4 }}
                          animate={{ scale: [0.6, 1.6, 0.6], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.8, repeat: Infinity, delay: idx * 0.25, ease: 'easeInOut' }}
                        >
                          <div className="w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_0_4px_rgba(34,211,238,0.25)]" />
                        </motion.div>
                      ))}

                      <motion.div
                        className="absolute -inset-20 rounded-full bg-purple-500/10 blur-3xl"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="max-w-md mx-auto mb-6">
                <div className="flex items-center justify-center gap-2 mb-3 text-purple-700">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 size={18} />
                  </motion.span>
                  <span className="text-sm font-semibold tracking-wide">AI Vision Pipeline Running</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-purple-700"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">{Math.round(progress)}%</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600 text-center">
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
              <div className="text-center mb-20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Check className="text-green-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('tryFree.results.complete')}</h2>
                <p className="text-gray-600">{t('tryFree.results.yourScore')}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 mb-20">
                <div className="grid gap-6 sm:grid-cols-2 mb-4">
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
                    <div className="text-lg font-bold text-gray-900">{hairLossStageCardValue}</div>
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

              {frontPreview && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-24">
                  <div className="grid gap-12 lg:grid-cols-2 lg:items-stretch">
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold text-gray-800 mb-3">AI Hairline Annotation</div>
                      <div className="h-[22rem] sm:h-[26rem] lg:h-[30rem] rounded-xl overflow-hidden border border-slate-200 bg-gray-50 flex items-start justify-center pt-2">
                        <div className="relative h-full aspect-[9/16]">
                          <img
                            src={frontPreview}
                            alt="Annotated front selfie"
                            className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                          />
                          <svg
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                          >
                            <motion.path
                              d={hairlinePath}
                              stroke="#7c3aed"
                              strokeWidth="1.6"
                              fill="none"
                              strokeLinecap="round"
                              initial={{ pathLength: 0, opacity: 0.35 }}
                              animate={{ pathLength: 1, opacity: 1 }}
                              transition={{ duration: 1.2, ease: 'easeOut' }}
                            />
                            <motion.circle
                              cx="18"
                              cy={hairlineY}
                              r="1.8"
                              fill="#7c3aed"
                              animate={{ scale: [1, 1.35, 1] }}
                              transition={{ duration: 1.4, repeat: Infinity }}
                            />
                            <motion.circle
                              cx="82"
                              cy={hairlineY}
                              r="1.8"
                              fill="#7c3aed"
                              animate={{ scale: [1, 1.35, 1] }}
                              transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
                            />
                          </svg>
                          <div className="absolute top-3 left-3 text-xs bg-white/85 text-purple-700 px-2 py-1 rounded-md">
                            Estimated hairline
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold text-gray-800 mb-3">Hair Loss Type &amp; Stage Reference</div>
                      <div
                        className="h-[22rem] sm:h-[26rem] lg:h-[30rem] rounded-xl overflow-hidden border border-slate-200 bg-gray-50 flex items-start justify-center pt-2"
                        onMouseEnter={triggerReferenceHoverPreview}
                        onMouseLeave={() => {
                          if (referenceHoverTimeoutRef.current) clearTimeout(referenceHoverTimeoutRef.current);
                          setReferenceViewPhase('focus');
                        }}
                      >
                        <div
                          className="relative w-full"
                          style={{ aspectRatio: `${NORWOOD_CHART.width} / ${NORWOOD_CHART.height}` }}
                        >
                          <motion.div
                            className="absolute inset-0"
                            animate={{ opacity: referenceViewPhase === 'full' ? 1 : 0 }}
                            transition={{ duration: 0.45, ease: 'easeInOut' }}
                          >
                            <img
                              src={REFERENCE_CHART_SRC}
                              alt="Hair loss stage and type reference"
                              className="w-full h-full object-contain"
                              style={{
                                aspectRatio: `${NORWOOD_CHART.width} / ${NORWOOD_CHART.height}`,
                              }}
                            />
                            <motion.div
                              className="absolute border-2 border-purple-500 rounded-md bg-purple-500/15 shadow-[0_0_0_2px_rgba(124,58,237,0.2)]"
                              style={{
                                left: `${(referenceCell.x / NORWOOD_CHART.width) * 100}%`,
                                top: `${(referenceCell.y / NORWOOD_CHART.height) * 100}%`,
                                width: `${(referenceCell.width / NORWOOD_CHART.width) * 100}%`,
                                height: `${(referenceCell.height / NORWOOD_CHART.height) * 100}%`,
                              }}
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                            />
                          </motion.div>

                          <motion.div
                            className="absolute inset-0 overflow-hidden"
                            animate={{ opacity: referenceViewPhase === 'focus' ? 1 : 0 }}
                            transition={{ duration: 0.45, ease: 'easeInOut' }}
                          >
                            <img
                              src={REFERENCE_CHART_SRC}
                              alt="Focused hair loss reference"
                              className="absolute max-w-none"
                              style={{
                                width: `${(NORWOOD_CHART.width / referenceCell.width) * 100}%`,
                                height: `${(NORWOOD_CHART.height / referenceCell.height) * 100}%`,
                                left: `-${(referenceCell.x / referenceCell.width) * 100}%`,
                                top: `-${(referenceCell.y / referenceCell.height) * 100}%`,
                              }}
                            />
                            <div className="absolute top-2 left-2 text-[11px] bg-white/85 text-purple-700 px-2 py-1 rounded">
                              Focused match
                            </div>
                          </motion.div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        {referencePattern.label} · Class {referenceStage}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-purple-50 rounded-2xl p-8 mb-24">
                <div className="text-center mb-10">
                  <div className="text-6xl font-bold text-purple-600 mb-2">{overallScore}/100</div>
                  <div className="text-lg text-gray-700">Hair Health Status: {healthStatus}</div>
                </div>

                <div className="grid gap-10 lg:grid-cols-[260px_1fr] items-center">
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

                  <div className="grid gap-3 sm:grid-cols-2">
                    {radarLabels.map((label, idx) => (
                      <div key={label} className="rounded-lg border border-white/80 bg-white/70 px-3 py-2">
                        <div className="text-xs text-gray-500">{label}</div>
                        <div className="text-sm font-semibold text-gray-900">{radarScores[idx]}/100</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-8 text-right text-xs text-gray-500">based on the Norwood Scale</div>
                <div className="mt-8 rounded-xl bg-white/75 border border-white p-4">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Lifestyle advice</div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {lifestyleTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {apiError && (
                <div className="mb-12 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {apiError}
                </div>
              )}

              {/* Key Findings */}
              <div className="bg-white border-2 border-purple-100 rounded-xl p-6 mb-28">
                <h3 className="font-bold text-gray-900 mb-6">{t('tryFree.results.findings')}</h3>
                <ul className="space-y-5">
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
              <div className="relative mt-20 min-h-[400px] sm:min-h-[460px]">
                <div className="filter blur-sm opacity-50 pointer-events-none">
                  <div className="bg-gray-100 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">{t('tryFree.results.detailedReport')}</h3>
                    <div className="space-y-8">
                      <div className="h-20 bg-gray-200 rounded" />
                      <div className="h-20 bg-gray-200 rounded" />
                      <div className="h-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>

                {/* Overlay CTA — sits lower so more breathing room above */}
                <div className="absolute inset-0 flex items-end justify-center pb-12 pt-28 sm:pb-16 sm:pt-36 pointer-events-none">
                  <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
                    <Download className="mx-auto mb-4 text-purple-600" size={48} />
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {t('tryFree.results.getFullReport')}
                    </h3>

                    <div className="mb-4 grid gap-3">
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
                      <Link
                        to="/shop"
                        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold block"
                      >
                        Shop Devices
                      </Link>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Continue in app for tracking, or explore devices for deeper scalp monitoring.
                    </p>
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
