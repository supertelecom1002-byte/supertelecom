import React from "react";
import {
  Smartphone,
  BadgeCheck,
  ShieldCheck,
  Zap,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";

interface BudgetToFlagshipPromiseProps {
  context?: "home" | "services" | "brands" | "smartfinder" | "pricing";
  className?: string;
}

const PROMISE_CARDS = [
  {
    number: "01",
    icon: Smartphone,
    title: "हर बजट का फ़ोन (Budget to Flagship)",
    subtitle: "Entry Android से Flagship iPhone Pro Max तक",
    description:
      "किफ़ायती बजट Android स्मार्टफ़ोन से लेकर महँगे फ्लैगशिप iPhone Pro Max और Samsung S-Ultra तक — हर फ़ोन की खरीद, एक्सचेंज और रिपेयर एक ही छत के नीचे।",
    accent: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  },
  {
    number: "02",
    icon: BadgeCheck,
    title: "सबसे कम दाम की गारंटी (Lowest Honest Pricing)",
    subtitle: "100% पारदर्शी • बिना किसी छुपे चार्ज के",
    description:
      "कोई छुपा हुआ चार्ज नहीं; पहले मुफ़्त 5-मिनट हार्डवेयर जांच और पूरे गिरिडीह का सबसे कम व वाजिब दाम बताकर ही आपकी अनुमति से काम शुरू किया जाता है।",
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "बेस्ट क्वालिटी और असली पार्ट्स (Zero Compromise Quality)",
    subtitle: "कम दाम का मतलब लोकल पार्ट नहीं",
    description:
      "कम दाम के साथ हम देते हैं ओरिजिनल / OEM ग्रेड टेस्टेड पार्ट्स और 45X माइक्रोस्कोप चिप-लेवल फिनिशिंग, ताकि फ़ोन बिल्कुल नए जैसा चले।",
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  {
    number: "04",
    icon: Zap,
    title: "तुरंत रिपेयर और लिखित वारंटी (Express + Written Warranty)",
    subtitle: "30–60 मिनट में आपके सामने रिपेयर",
    description:
      "ज़्यादातर स्क्रीन, बैटरी और चार्जिंग रिपेयर 30–60 मिनट में आपके सामने, स्टैम्प्ड लिखित वारंटी कार्ड और 100% डेटा सुरक्षा (DPDP Act) के साथ।",
    accent: "text-sky-400 bg-sky-500/10 border-sky-500/30",
  },
] as const;

export const BudgetToFlagshipPromise: React.FC<BudgetToFlagshipPromiseProps> = ({
  context = "home",
  className = "",
}) => {
  const whatsappText =
    context === "smartfinder"
      ? "Namaste Super Telecom Giridih! Mujhe budget se flagship phone deal aur sabse kam market rate chahiye."
      : "Namaste Super Telecom Giridih! Mujhe apne phone ke liye sabse kam rate aur best quality repair jankari chahiye.";

  return (
    <section
      aria-label="Lowest Price Best Quality Budget to Flagship Promise"
      className={`py-10 sm:py-16 bg-slate-950/90 text-slate-100 relative overflow-hidden border-y border-slate-800/80 ${className}`}
    >
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[720px] rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Lowest Market Rate • Best Genuine Quality (Giridih)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-white tracking-tight leading-snug">
            सस्ता फ़ोन हो या महँगा फ्लैगशिप — सबसे कम दाम में सबसे बेस्ट काम सिर्फ़ Super Telecom पर
          </h2>

          <p className="text-xs sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Budget Android से लेकर iPhone Pro Max व Samsung Ultra तक — मुफ़्त जांच, सबसे किफ़ायती दरें, और हर रिपेयर पर लिखित वारंटी (Barganda Road, Near Shivam Clinic, Giridih)।
          </p>
        </div>

        {/* 4 Customer Promises Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {PROMISE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.number}
                className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all backdrop-blur-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`h-10 w-10 rounded-2xl border flex items-center justify-center ${card.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs font-black text-slate-500">
                      {card.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white font-display leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-[11px] font-mono text-cyan-400 mt-1 font-semibold">
                      {card.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400 font-semibold">
                  ✓ Free In-Store Inspection • Barganda Road
                </div>
              </div>
            );
          })}
        </div>

        {/* Direct Conversion Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <a
            href={`${BUSINESS_MASTER.whatsappBaseUrl}?text=${encodeURIComponent(whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <MessageCircle className="h-4 w-4" />
            <span>सबसे कम मार्केट रेट जानें (WhatsApp Quote)</span>
          </a>

          <a
            href={BUSINESS_MASTER.phoneCallHref}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-slate-800 transition-all"
          >
            <Phone className="h-4 w-4 text-cyan-400" />
            <span>सीधे कॉल करें: {BUSINESS_MASTER.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default BudgetToFlagshipPromise;
