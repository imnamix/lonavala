import { Hero } from "@/components/home/Hero";
import { StateLeadership } from "@/components/home/StateLeadership";
import { CouncilOverview } from "@/components/home/CouncilOverview";
import { QuickServices } from "@/components/home/QuickServices";
import { TourismHighlights } from "@/components/home/TourismHighlights";
import { NoticeBoard } from "@/components/home/NoticeBoard";
import { OngoingProjectsSection } from "@/components/home/OngoingProjectsSection";
import { EmergencyContactsSection } from "@/components/home/EmergencyContactsSection";
import { StatisticsSection } from "@/components/shared/StatisticsSection";
import { MobileAppPromotion } from "@/components/home/MobileAppPromotion";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. State & Regional Leadership (Maharashtra CM, 2 DCMs & Lonavala MLA) */}
      <StateLeadership />

      {/* 3. Council Overview (Civic Leadership) */}
      <CouncilOverview />

      {/* 4. Quick Citizen Services (8 icon cards) */}
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

      {/* <NewsletterSection /> */}
    </div>
  );
}
