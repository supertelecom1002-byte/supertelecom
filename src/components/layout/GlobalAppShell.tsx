import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { LauncherProvider } from "@/context/LauncherContext";
import { GamingModeProvider } from "@/context/GamingModeContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { VisualEditorProvider } from "@/context/VisualEditorContext";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { LiveEditorBar } from "@/components/admin/visual/LiveEditorBar";
import { FloatingAiChat } from "@/components/ai/FloatingAiChat";
import { BottomNav } from "@/components/BottomNav";
import { UpdateBanner } from "@/components/app/UpdateBanner";
import { VipPerksModal } from "@/components/auth/VipPerksModal";
import { Toaster } from "@/components/ui/sonner";

export interface GlobalAppShellProps {
  children: React.ReactNode;
}

export const GlobalAppShell: React.FC<GlobalAppShellProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <LauncherProvider>
        <GamingModeProvider>
          <AdminAuthProvider>
            <CustomerAuthProvider>
              <VisualEditorProvider>
                <SmoothScrollProvider>
                  {children}
                </SmoothScrollProvider>
                <LiveEditorBar />
                <FloatingAiChat />
                <BottomNav />
                <UpdateBanner />
                <VipPerksModal />
                <Toaster position="top-center" richColors />
              </VisualEditorProvider>
            </CustomerAuthProvider>
          </AdminAuthProvider>
        </GamingModeProvider>
      </LauncherProvider>
    </ThemeProvider>
  );
};

export default GlobalAppShell;
