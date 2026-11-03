import React from "react";
import { MessageCircle, Phone, HelpCircle } from "lucide-react";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";

interface RepairConsultationActionProps {
  serviceName?: string;
  brand?: string;
  model?: string;
  issue?: string;
  className?: string;
  compact?: boolean;
  buttonSize?: "sm" | "md" | "lg";
  layout?: "row" | "column";
  noteText?: string;
}

export function buildConsultationWhatsAppUrl(details: {
  serviceName?: string;
  brand?: string;
  model?: string;
  issue?: string;
}): string {
  const parts: string[] = [];
  if (details.brand && details.model) {
    parts.push(`${details.brand} ${details.model}`);
  } else if (details.brand) {
    parts.push(details.brand);
  }

  const topic = details.issue || details.serviceName || "phone repair";
  const devicePart = parts.length > 0 ? ` for my ${parts.join(" ")}` : "";
  const message = `Hello Super Telecom, I need consultation for ${topic}${devicePart}. Please share details and availability.`;

  return `https://wa.me/${BUSINESS_MASTER.phoneDigits}?text=${encodeURIComponent(message)}`;
}

export const RepairConsultationAction: React.FC<RepairConsultationActionProps> = ({
  serviceName,
  brand,
  model,
  issue,
  className = "",
  compact = false,
  buttonSize = "md",
  layout = "row",
  noteText = "Physical inspection required for accurate fault diagnosis",
}) => {
  const whatsappUrl = buildConsultationWhatsAppUrl({ serviceName, brand, model, issue });
  const phoneCallUrl = BUSINESS_MASTER.phoneCallHref;

  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base font-semibold",
  }[buttonSize];

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <div
        className={`flex ${
          layout === "column" ? "flex-col" : "flex-wrap items-center"
        } gap-2.5`}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-medium transition-all shadow-md ${sizeClasses}`}
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span>WHATSAPP ENQUIRY</span>
        </a>

        <a
          href={phoneCallUrl}
          className={`inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white border border-slate-700 font-medium transition-all shadow-sm ${sizeClasses}`}
        >
          <Phone className="h-4 w-4 shrink-0 text-cyan-400" />
          <span>CALL NOW</span>
        </a>
      </div>

      {!compact && noteText && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <HelpCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>{noteText}</span>
        </p>
      )}
    </div>
  );
};

export default RepairConsultationAction;
