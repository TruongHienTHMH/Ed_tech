/**
 * Unified Seeder Data matching Figma Desktop Design (Node 12:682 & Node 12:1277)
 * Conforms 100% to the 12 Normalized Google Sheets CMS Tabs Schema
 *
 * NOTE: Raw data is now managed via the Laravel-style DatabaseSeeder architecture in @/database/seeders/
 */

import { DatabaseSeeder } from "@/database/seeders/DatabaseSeeder";

const snapshot = DatabaseSeeder.getSnapshot();

export const seedCourses = snapshot.courses;
export const seedCurriculum = snapshot.curriculum;
export const seedPackages = snapshot.packages;
export const seedStudentProjects = snapshot.projects;
export const seedMentor = snapshot.mentors[0];
export const seedTestimonials = snapshot.testimonials;
export const seedFaqs = snapshot.faqs;
export const seedFAQs = snapshot.faqs;
export const seedBlogPosts = snapshot.blogs;
export const seedPromotions = snapshot.promotions;
export const seedSettings = snapshot.settings;
export const seedTrustMetrics = snapshot.trustMetrics;

export default snapshot;
