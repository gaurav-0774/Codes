import { z } from 'zod';

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minRating: z.coerce.number().optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'rating', 'newest', 'name']).optional().default('newest'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(12),
});

export type ProductQueryInput = z.infer<typeof productQuerySchema>;
