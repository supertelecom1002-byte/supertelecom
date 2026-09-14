import React from "react";
import { HeroSection } from "@/components/HeroSection";

export { HeroSection };

export const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <HeroSection />
    </div>
  );
};

export default Index;
