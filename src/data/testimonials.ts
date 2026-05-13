export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Operations Director",
    company: "TechFlow Solutions",
    quote: "Lift Metric transformed how we evaluate new implementations. The ROI calculator saved us from a costly mistake and helped us identify a solution that paid for itself in just 3 months. The sensitivity analysis feature is absolutely game-changing.",
    rating: 5,
    avatar: "/images/testimonial_avatar_1.png"
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Founder & CEO",
    company: "GrowthStart Inc",
    quote: "As a startup founder, every dollar counts. Lift Metric gave me the confidence to pitch our automation project to investors with rock-solid numbers. We secured funding and the implementation exceeded our projected ROI by 40%. Couldn't have done it without this tool.",
    rating: 5,
    avatar: "/images/testimonial_avatar_2.png"
  },
  {
    id: 3,
    name: "Dr. Patricia Rodriguez",
    role: "VP of Strategy",
    company: "Enterprise Global Corp",
    quote: "After 25 years in business strategy, I can confidently say Lift Metric is the most intuitive and powerful ROI tool I've used. It helped our team evaluate a $2M implementation project and present findings to the board with crystal clarity. Absolutely worth every penny.",
    rating: 5,
    avatar: "/images/testimonial_avatar_5.png"
  }
];
