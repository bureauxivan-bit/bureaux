export type Settings = {
  phone?: string | null; email?: string | null; telegram?: string | null;
  instagram?: string | null; facebook?: string | null; behance?: string | null;
  address?: string | null; coordinates?: string | null; itemXUrl?: string | null;
  heroImage?: string | null;
};

export type LeadType = 'ESTIMATE' | 'CONSULT' | 'GENERAL';
