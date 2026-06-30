export type ServiceEntry = {
  enabled: boolean;
  rate?: number;
  price?: number | null;
  monthly?: number | null;
};

export type KpServices = {
  architecture?: ServiceEntry;
  design?: ServiceEntry;
  supervision?: ServiceEntry;
};

export const ARCH_RATE = 40;
export const DESIGN_RATE = 60;
export const SUPERVISION_DEFAULT = 800;
export const MIN_AREA = 120;
export const ARCH_MIN = MIN_AREA * ARCH_RATE;    // 4 800
export const DESIGN_MIN = MIN_AREA * DESIGN_RATE; // 7 200

export function calcServicePrice(rate: number, areaM2: number | null | undefined): number | null {
  if (!areaM2) return null;
  const min = rate === DESIGN_RATE ? DESIGN_MIN : ARCH_MIN;
  return Math.max(areaM2 * rate, min);
}

/** Normalize any KP record (old or new) into a KpServices object. */
export function deriveServices(p: {
  services?: unknown;
  service?: string | null;
  priceDesign?: number | null;
  supervisionMonthly?: number | null;
  areaM2?: number | null;
}): KpServices {
  if (p.services && typeof p.services === 'object' && !Array.isArray(p.services)) {
    return p.services as KpServices;
  }

  // Map old single-service string to new structure
  const s = p.service ?? '';
  if (!s) return {};

  if (s === 'Архпроєкт') {
    return {
      architecture: { enabled: true, rate: ARCH_RATE, price: p.priceDesign ?? null },
    };
  }
  if (s === 'Дизайн інтер\'єру') {
    return {
      design: { enabled: true, rate: DESIGN_RATE, price: p.priceDesign ?? null },
    };
  }
  if (s === 'Дизайн + супровід') {
    return {
      design: { enabled: true, rate: DESIGN_RATE, price: p.priceDesign ?? null },
      supervision: { enabled: true, monthly: p.supervisionMonthly ?? SUPERVISION_DEFAULT },
    };
  }

  // Unknown service string — return empty, admin fills manually
  return {};
}

/** Count how many services are enabled. */
export function countEnabled(services: KpServices): number {
  return [services.architecture, services.design, services.supervision]
    .filter((s) => s?.enabled).length;
}

/** True when both architecture and design are enabled. */
export function isArchDesignCombo(services: KpServices): boolean {
  return !!(services.architecture?.enabled && services.design?.enabled);
}

/** Map service string from the Maytapi bot to a KpServices object. */
export function servicesFromString(
  serviceStr: string | undefined,
  areaM2: number | null | undefined,
): KpServices {
  if (!serviceStr) return {};

  const s = serviceStr.toLowerCase();
  const hasArch = s.includes('арх') || s.includes('arch') || s.includes('проєкт') || s.includes('проект');
  const hasDesign = s.includes('дизайн') || s.includes('design') || s.includes('інтер');
  const hasSupervision = s.includes('супровід') || s.includes('supervis') || s.includes('авторськ');

  const result: KpServices = {};

  if (hasArch) {
    result.architecture = {
      enabled: true,
      rate: ARCH_RATE,
      price: calcServicePrice(ARCH_RATE, areaM2),
    };
  }
  if (hasDesign) {
    result.design = {
      enabled: true,
      rate: DESIGN_RATE,
      price: calcServicePrice(DESIGN_RATE, areaM2),
    };
  }
  if (hasSupervision) {
    result.supervision = { enabled: true, monthly: SUPERVISION_DEFAULT };
  }

  // Fallback: exact legacy strings
  if (!hasArch && !hasDesign && !hasSupervision) {
    if (serviceStr === 'Архпроєкт') {
      return { architecture: { enabled: true, rate: ARCH_RATE, price: calcServicePrice(ARCH_RATE, areaM2) } };
    }
    if (serviceStr === 'Дизайн інтер\'єру') {
      return { design: { enabled: true, rate: DESIGN_RATE, price: calcServicePrice(DESIGN_RATE, areaM2) } };
    }
    if (serviceStr === 'Дизайн + супровід') {
      return {
        design: { enabled: true, rate: DESIGN_RATE, price: calcServicePrice(DESIGN_RATE, areaM2) },
        supervision: { enabled: true, monthly: SUPERVISION_DEFAULT },
      };
    }
  }

  return result;
}
