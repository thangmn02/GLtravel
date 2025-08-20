import { z, defineCollection } from 'astro:content';

// Location collection schema
const locations = defineCollection({
  type: 'content',
  schema: z.object({
    // Basic information
    title: z.string(),
    titleVi: z.string(),
    
    // Coordinates
    lat: z.number(),
    lng: z.number(),
    
    // Descriptions
    excerpt: z.string(),
    excerptVi: z.string(),
    
    // Categories and metadata
    category: z.enum(['nature', 'culture', 'history', 'waterfall', 'mountain', 'religious']),
    tags: z.array(z.string()).optional(),
    
    // Images
    image: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    
    // Practical information
    openingHours: z.string().optional(),
    entryFee: z.string().optional(),
    bestTime: z.string().optional(),
    
    // SEO
    keywords: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
  })
});

export const collections = {
  locations
};
