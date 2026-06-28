export const CATEGORY_LABELS: Record<string, string> = {
  PRIVATE: 'Приватні простори',
  COMMERCIAL: 'Комерційні приміщення',
  ARCHITECTURE: 'Архітектура та будівництво',
};

export const CATEGORY_ORDER = ['PRIVATE', 'COMMERCIAL', 'ARCHITECTURE'] as const;

export const LEAD_TYPE_LABELS: Record<string, string> = {
  ESTIMATE: 'Прорахунок проєкту',
  CONSULT: 'Консультація',
  GENERAL: 'Форма в футері',
};

export const LEAD_STATUS_LABELS: Record<string, string> = {
  new:       'Новий',
  qualified: 'Бриф зібрано',
  kp_sent:   'КП надіслано',
  kp_viewed: 'КП переглянуто',
  meeting:   'Зустріч',
  contract:  'Договір',
  postponed: 'Відкладено',
  lost:      'Відмова',
  not_client:'Не клієнт',
};

export const LEAD_LOST_REASONS = ['дорого', 'знайшли інших', 'передумали', 'не відповів', 'інше'] as const;

export const FUNNEL_STAGES = ['new', 'qualified', 'kp_sent', 'kp_viewed', 'meeting', 'contract'] as const;

export const CLIENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Очікує підтвердження',
  APPROVED: 'Підтверджено',
  REJECTED: 'Відхилено',
};

export const CLIENT_PROJECT_TYPE_LABELS: Record<string, string> = {
  PRIVATE: 'Приватний інтер\'єр',
  COMMERCIAL: 'Комерційний простір',
  ARCHITECTURE: 'Архітектура',
};

// Fallback contacts used before SiteSettings is filled in the admin.
export const DEFAULT_SETTINGS = {
  phone: '+380 98 949 86 48',
  email: 'bureaux.ivan@gmail.com',
  telegram: '',
  instagram: '',
  facebook: '',
  behance: '',
  address: 'Україна, Київ',
  coordinates: "50°27′16″ пн.ш. 30°31′25″ сх.д.",
  itemXUrl: 'https://itemx.art',
  heroImage: null,
};
