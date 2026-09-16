import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { DailyUpdatesSection } from "@/components/DailyUpdatesSection";

export { HeroSection, DailyUpdatesSection };

export const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <HeroSection />
      <DailyUpdatesSection />
    </div>
  );
};

export default Index;
