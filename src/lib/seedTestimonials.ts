import { positioningTestimonials } from './testimonialsSeed';

/**
 * Seeds the database with positioning-aligned testimonials
 * Call this function once to populate your testimonials
 */
export async function seedTestimonials() {
  try {
    const testimonialEntityConfig = {
      name: 'Testimonial',
      orderBy: 'created_at DESC',
      properties: {
        quote: { type: 'string', description: 'User testimonial quote' },
        authorName: { type: 'string', description: 'Name of the person giving the testimonial' },
        authorTitle: { type: 'string', description: 'Job title of the author' },
        company: { type: 'string', description: 'Company name' },
        industry: {
          type: 'string',
          enum: [
            'Technology',
            'Finance',
            'Healthcare',
            'Education',
            'Retail',
            'Manufacturing',
            'Consulting',
            'Real_Estate',
            'Marketing',
            'Other',
          ],
        },
        rating: { type: 'integer', description: 'Star rating 1-5' },
        isAnonymous: { type: 'string', default: 'false' },
        isPublished: { type: 'string', default: 'true' },
        isFeatured: { type: 'string', default: 'false' },
        avatar: { type: 'string', description: 'Avatar image URL' },
        location: { type: 'string', description: 'User location' },
      },
      required: ['quote', 'authorName', 'rating'],
    };

    // Check if testimonials already exist
    const response = await fetch('/api/entities?entityType=Testimonial');
    const existingTestimonials = await response.json();

    if (existingTestimonials.length > 0) {
      console.log('Testimonials already seeded');
      return;
    }

    // Seed each testimonial
    for (const testimonial of positioningTestimonials) {
      await fetch('/api/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: 'Testimonial',
          data: testimonial,
        }),
      });
    }

    console.log(`Successfully seeded ${positioningTestimonials.length} testimonials`);
  } catch (error) {
    console.error('Error seeding testimonials:', error);
  }
}

/**
 * Usage in your App component:
 *
 * useEffect(() => {
 *   seedTestimonials();
 * }, []);
 */
