import React from "react";
import { AIVideoGenerator } from "@/components/AIVideoGenerator";

export { AIVideoGenerator };

export const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AIVideoGenerator />
    </div>
  );
};

export default Index;
