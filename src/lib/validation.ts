import { z } from 'zod';

// Ukrainian phone: accepts +380XXXXXXXXX and common local formats.
const phoneRegex = /^\+?[0-9\s\-()]{9,20}$/;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Вĸажіть ім'я").max(80),
  phone: z.string().trim().regex(phoneRegex, 'Невірний номер телефону').max(20),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  type: z.enum(['ESTIMATE', 'CONSULT', 'GENERAL']).default('GENERAL'),
  // Honeypot — must stay empty. Bots fill it.
  company: z.string().max(0).optional().or(z.literal('')),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Лише латиниця, цифри та дефіс'),
  year: z.coerce.number().int().min(1990).max(2100),
  category: z.enum(['PRIVATE', 'COMMERCIAL', 'ARCHITECTURE']),
  description: z.string().optional().nullable(),
  areaM2: z.coerce.number().int().positive().optional().nullable(),
  location: z.string().optional().nullable(),
  isTop: z.coerce.boolean().optional(),
});

export const settingsSchema = z.object({
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  telegram: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  behance: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  coordinates: z.string().optional().nullable(),
  itemXUrl: z.string().optional().nullable(),
});
