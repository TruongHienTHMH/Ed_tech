import { CourseSeeder } from "./CourseSeeder";
import { CurriculumSeeder } from "./CurriculumSeeder";
import { MentorSeeder } from "./MentorSeeder";
import { PackageSeeder } from "./PackageSeeder";
import { ProjectSeeder } from "./ProjectSeeder";
import { TestimonialSeeder } from "./TestimonialSeeder";
import { FaqSeeder } from "./FaqSeeder";
import { BlogSeeder } from "./BlogSeeder";
import { PromotionSeeder } from "./PromotionSeeder";
import { SettingSeeder } from "./SettingSeeder";
import { DatabaseSnapshot } from "./types";

/**
 * Main DatabaseSeeder (Laravel-style coordinator)
 * Coordinates and runs domain-specific seeders to populate or export complete CMS dataset.
 */
export class DatabaseSeeder {
  /**
   * Generates a complete, type-safe in-memory snapshot of all 12 CMS domains
   */
  public static getSnapshot(): DatabaseSnapshot {
    const courseSeeder = new CourseSeeder();
    const curriculumSeeder = new CurriculumSeeder();
    const mentorSeeder = new MentorSeeder();
    const packageSeeder = new PackageSeeder();
    const projectSeeder = new ProjectSeeder();
    const testimonialSeeder = new TestimonialSeeder();
    const faqSeeder = new FaqSeeder();
    const blogSeeder = new BlogSeeder();
    const promotionSeeder = new PromotionSeeder();
    const settingSeeder = new SettingSeeder();

    return {
      courses: courseSeeder.run(),
      curriculum: curriculumSeeder.run(),
      packages: packageSeeder.run(),
      projects: projectSeeder.run(),
      mentors: mentorSeeder.run(),
      testimonials: testimonialSeeder.run(),
      faqs: faqSeeder.run(),
      blogs: blogSeeder.run(),
      promotions: promotionSeeder.run(),
      settings: settingSeeder.run(),
      trustMetrics: settingSeeder.getTrustMetrics(),
    };
  }

  /**
   * Run all registered seeders sequentially
   */
  public static async run(): Promise<DatabaseSnapshot> {
    console.log("🌱 [DatabaseSeeder] Seeding database records...");
    const snapshot = this.getSnapshot();
    console.log(`✅ [DatabaseSeeder] Loaded:
      - ${snapshot.courses.length} Courses
      - ${snapshot.curriculum.length} Curriculum Modules
      - ${snapshot.packages.length} Packages
      - ${snapshot.mentors.length} Mentors
      - ${snapshot.testimonials.length} Testimonials
      - ${snapshot.projects.length} Student Projects
      - ${snapshot.faqs.length} FAQs
      - ${snapshot.promotions.length} Promotions
    `);
    return snapshot;
  }
}
