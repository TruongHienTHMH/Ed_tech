/**
 * Database Seeder Interfaces (Laravel-style architecture)
 */

export interface Seeder<T = unknown> {
  run(): Promise<T | T[]> | T | T[];
}

export interface DatabaseSnapshot {
  courses: import("@/lib/cms/types").Course[];
  curriculum: import("@/lib/cms/types").CurriculumModule[];
  packages: import("@/lib/cms/types").PackagePricing[];
  projects: import("@/lib/cms/types").StudentProject[];
  mentors: import("@/lib/cms/types").Mentor[];
  testimonials: import("@/lib/cms/types").Testimonial[];
  faqs: import("@/lib/cms/types").FAQ[];
  blogs: import("@/lib/cms/types").BlogPost[];
  promotions: import("@/lib/cms/types").Promotion[];
  settings: import("@/lib/cms/types").SystemSettings;
  trustMetrics: import("@/lib/cms/types").TrustMetric[];
}
