import { Hero } from "@/components/home/Hero";
import { QuickServices } from "@/components/home/QuickServices";
import { CouncilOverview } from "@/components/home/CouncilOverview";
import { TourismHighlights } from "@/components/home/TourismHighlights";
import { NoticeBoard } from "@/components/home/NoticeBoard";
import { OngoingProjectsSection } from "@/components/home/OngoingProjectsSection";
import { EmergencyContactsSection } from "@/components/home/EmergencyContactsSection";
import { StatisticsSection } from "@/components/shared/StatisticsSection";
import { MobileAppPromotion } from "@/components/home/MobileAppPromotion";
import { FaqSection } from "@/components/home/FaqSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <Hero />

      {/* 3. Council Overview */}
      <CouncilOverview />
      {/* 2. Quick Citizen Services (8 icon cards) */}
      <QuickServices />


      {/* 4. Tourism Highlights */}
      <TourismHighlights />

      {/* 5, 6, 7. Important Notices, Latest News & Events */}
      <NoticeBoard />

      {/* 8. Ongoing Projects */}
      <OngoingProjectsSection />

      {/* 9. Emergency Contacts */}
      <EmergencyContactsSection />

      {/* 10. Citizen Statistics */}
      <StatisticsSection />

      {/* 11. Mobile App Promotion */}
      <MobileAppPromotion />

      {/* 12. FAQ & Newsletter */}
      <FaqSection />
      <NewsletterSection />
    </div>
  );
}
