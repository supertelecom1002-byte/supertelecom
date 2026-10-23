import React, { useState } from "react";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";
import {
  Smartphone,
  Zap,
  BatteryCharging,
  PlugZap,
  Droplets,
  Camera,
  Volume2,
  ShieldAlert,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Phone,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from "lucide-react";

interface FaultItem {
  id: string;
  hindiTitle: string;
  englishTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  symptoms: string[];
  solution: string;
  startingPrice: string;
  duration: string;
  warranty: string;
  accentColor: string;
  badge: string;
}

const FAULTS: FaultItem[] = [
  {
    id: "screen",
    hindiTitle: "टूटी स्क्रीन या टच काम न करना",
    englishTitle: "Broken Display & Touch Screen Issue",
    icon: Smartphone,
    symptoms: [
      "डिस्प्ले में हरी या सफेद लाइन (Green Lines)",
      "काले धब्बे (Black Ink Spots) फैलना",
      "टच अपने आप चलना (Ghost Touch)",
      "स्क्रीन का शीशा टूट जाना लेकिन डिस्प्ले दिखना",
    ],
    solution: "Grade-A AMOLED / Original Service Pack डिस्प्ले रिप्लेसमेंट विथ जीरो-टच OCA लैमिनेशन।",
    startingPrice: "₹899 से शुरू",
    duration: "45–90 मिनट",
    warranty: "90 Days Warranty",
    accentColor: "from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-400",
    badge: "Most Common",
  },
  {
    id: "dead-phone",
    hindiTitle: "फोन ऑन नहीं हो रहा / डेड फोन",
    englishTitle: "Dead Phone & Motherboard IC Fault",
    icon: Zap,
    symptoms: [
      "पावर बटन दबाने पर कोई रिस्पॉन्स न होना",
      "सिर्फ लोगो (Logo) पर फोन अटक जाना (Bootloop)",
      "चार्जिंग लगाने पर भी कोई लाइट न जलना",
      "फोन का अत्यधिक गर्म होना",
    ],
    solution: "45X ट्राइनोकुलर माइक्रोस्कोप से शार्ट-सर्किट डिटेक्शन और पावर IC / CPU माइक्रो-सोल्डरिंग।",
    startingPrice: "₹799 से शुरू",
    duration: "2–4 घंटे",
    warranty: "60–90 Days Warranty",
    accentColor: "from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400",
    badge: "Chip-Level",
  },
  {
    id: "battery",
    hindiTitle: "बैटरी जल्दी खत्म होना या फूलना",
    englishTitle: "Battery Drain, Heating & Swelling",
    icon: BatteryCharging,
    symptoms: [
      "100% से अचानक 30% पर बैटरी गिर जाना",
      "फोन का पिछला ढक्कन (Back Panel) ऊपर उठना",
      "दिन में 3-4 बार चार्ज करना पड़ना",
      "सामान्य उपयोग में भी फोन का गर्म होना",
    ],
    solution: "100% Brand-New 0-Cycle लिथियम-आयन पॉलीमर बैटरी विथ ओरिजिनल NTC थर्मल सेंसर।",
    startingPrice: "₹699 से शुरू",
    duration: "30–45 मिनट",
    warranty: "6 Months Warranty",
    accentColor: "from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400",
    badge: "100% Safe",
  },
  {
    id: "charging",
    hindiTitle: "चार्जिंग पिन ढीला या स्लो चार्जिंग",
    englishTitle: "Loose Charging Jack & Slow Charging",
    icon: PlugZap,
    symptoms: [
      "केबल को किसी खास एंगल पर दबाने से ही चार्ज होना",
      "चार्जिंग शो करना लेकिन पर्सेंटेज न बढ़ना (Fake Charging)",
      "बार-बार Moisture Detected की चेतावनी आना",
      "फास्ट चार्जिंग सपोर्ट न करना",
    ],
    solution: "24-Pin Gold-Plated Type-C / Lightning सॉकेट रिप्लेसमेंट विथ ESD सर्ज प्रोटेक्शन।",
    startingPrice: "₹349 से शुरू",
    duration: "30 मिनट",
    warranty: "90 Days Warranty",
    accentColor: "from-sky-500/20 to-indigo-500/10 border-sky-500/40 text-sky-400",
    badge: "Instant Fix",
  },
  {
    id: "water-damage",
    hindiTitle: "पानी या चाय में फोन गिर जाना",
    englishTitle: "Liquid Ingress & Water Damage",
    icon: Droplets,
    symptoms: [
      "कैमरा लेंस के अंदर भाप (Moisture) जमना",
      "डिस्प्ले में रंगीन धब्बे या स्क्रीन ब्लैंक होना",
      "स्पीकर से चर-चर की आवाज आना",
      "पानी में गिरने के बाद फोन का बंद हो जाना",
    ],
    solution: "अल्ट्रासोनिक केमिकल डी-ऑक्सीडेशन क्लीनिंग और थर्मल कैमरा इंस्पेक्शन।",
    startingPrice: "₹599 से शुरू",
    duration: "Same-Day",
    warranty: "Lab Tested",
    accentColor: "from-blue-500/20 to-cyan-500/10 border-blue-500/40 text-blue-400",
    badge: "Emergency",
  },
  {
    id: "camera",
    hindiTitle: "कैमरा धुंधला या लेंस शीशा टूटना",
    englishTitle: "Blurry Camera, OIS Shaking & Lens Crack",
    icon: Camera,
    symptoms: [
      "फोटो खींचते समय कैमरा का कांपना (Vibrating / Buzzing)",
      "तस्वीरें धुंधली (Blurry) आना और फोकस न होना",
      "कैमरे के ऊपर का लेंस ग्लास टूट जाना",
      "कैमरा ऐप खोलने पर ब्लैक स्क्रीन दिखना",
    ],
    solution: "सैफायर लेंस ग्लास रिप्लेसमेंट और क्लीनरूम डस्ट-फ्री कैमरा मॉड्यूल अलाइनमेंट।",
    startingPrice: "₹499 से शुरू",
    duration: "45 मिनट",
    warranty: "90 Days Warranty",
    accentColor: "from-purple-500/20 to-pink-500/10 border-purple-500/40 text-purple-400",
    badge: "Cleanroom",
  },
  {
    id: "sound",
    hindiTitle: "माइक या स्पीकर से आवाज़ न आना",
    englishTitle: "No Sound, Muffled Mic & Earpiece Low",
    icon: Volume2,
    symptoms: [
      "कॉल के दौरान सामने वाले को आपकी आवाज न जाना",
      "कान वाले स्पीकर (Earpiece) की आवाज बहुत धीमी होना",
      "गाने या रिंगटोन में चर-चर की आवाज आना",
      "हेडफोन जैक में ईयरफोन काम न करना",
    ],
    solution: "हाई-फिडेलिटी स्टीरियो स्पीकर / नॉइज़-कैंसलिंग MEMS माइक रिप्लेसमेंट।",
    startingPrice: "₹299 से शुरू",
    duration: "30 मिनट",
    warranty: "90 Days Warranty",
    accentColor: "from-rose-500/20 to-red-500/10 border-rose-500/40 text-rose-400",
    badge: "Sound Restored",
  },
  {
    id: "body",
    hindiTitle: "बैक ग्लास टूटा या बॉडी डैमेज",
    englishTitle: "Cracked Back Glass & Frame Bend",
    icon: ShieldAlert,
    symptoms: [
      "फोन का पिछला ग्लास टूट कर हाथ में चुभना",
      "फोन का फ्रेम मुड़ जाना (Bent Chassis)",
      "पावर या वॉल्यूम बटन दबने पर क्लिक न होना",
      "सिम ट्रे (SIM Tray) का अंदर फंस जाना",
    ],
    solution: "लेज़र कट बैक पैनल रिप्लेसमेंट और टाइटेनियम/एल्युमिनियम फ्रेम अलाइनमेंट।",
    startingPrice: "₹499 से शुरू",
    duration: "1 घंटा",
    warranty: "OEM Finish",
    accentColor: "from-slate-500/20 to-zinc-500/10 border-slate-500/40 text-slate-300",
    badge: "Factory Look",
  },
];

const VisualFaultFinder: React.FC = () => {
  const [selectedFaultId, setSelectedFaultId] = useState<string>("screen");

  const activeFault = FAULTS.find((f) => f.id === selectedFaultId) || FAULTS[0];

  return (
    <section id="fault-finder" className="py-12 sm:py-20 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(14,165,233,0.12),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Visual Fault Finder</span>
            <span className="text-slate-600">•</span>
            <span className="text-white">अपनी समस्या चुनें</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">
            आपके फोन में क्या खराबी है?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            नीचे दिए गए कार्ड्स में से अपनी समस्या चुनें। हम आपको तुरंत सटीक अनुमानित खर्च, समय और वारंटी की पूरी जानकारी देंगे।
          </p>
        </div>

        {/* 8-Card Interactive Grid */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {FAULTS.map((fault) => {
            const Icon = fault.icon || Smartphone;
            const isSelected = selectedFaultId === fault.id;

            return (
              <button
                key={fault.id}
                type="button"
                onClick={() => setSelectedFaultId(fault.id)}
                className={`relative flex flex-col justify-between text-left p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/20 -translate-y-1.5 ring-2 ring-cyan-400/40"
                    : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90 hover:-translate-y-1"
                }`}
              >
                {/* Badge */}
                <div className="flex items-center justify-between w-full mb-3">
                  <div
                    className={`h-11 w-11 rounded-2xl flex items-center justify-center border ${
                      isSelected
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md"
                        : "bg-slate-800/80 text-cyan-400 border-slate-700/60"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? "bg-cyan-950 text-cyan-300 border-cyan-500/50"
                        : "bg-slate-800/60 text-slate-400 border-slate-700/40"
                    }`}
                  >
                    {fault.badge}
                  </span>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <h3 className="font-bold text-xs sm:text-sm text-white leading-tight">
                    {fault.hindiTitle}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1 font-medium">
                    {fault.englishTitle}
                  </p>
                </div>

                {/* Price pill */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300">{fault.startingPrice}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3 text-cyan-400" /> {fault.duration}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Fault Deep-Dive Solution Banner */}
        <div className="mt-8 rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-slate-900/95 to-slate-950 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: Solution & Diagnostics (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold">
                  {activeFault.badge}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> {activeFault.warranty}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" /> {activeFault.duration} में तैयार
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {activeFault.hindiTitle}
                </h3>
                <p className="text-xs sm:text-sm text-cyan-400 font-medium">
                  {activeFault.englishTitle}
                </p>
              </div>

              {/* Problem Symptoms Box */}
              <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                  पहचान के लक्षण (Common Symptoms):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {activeFault.symptoms.map((symptom, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engineer Solution */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">हमारा समाधान: </strong>
                {activeFault.solution}
              </p>
            </div>

            {/* Right Column: Pricing & Direct Action CTA (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-slate-950 border border-slate-800/90 text-center lg:text-left space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  पारदर्शी अनुमानित खर्च (Transparent Estimate)
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {activeFault.startingPrice}
                </div>
                <p className="text-[11px] text-slate-400">
                  *अंतिम मूल्य डिवाइस मॉडल और पार्ट ग्रेड पर निर्भर करता है।
                </p>
              </div>

              <div className="space-y-2.5">
                <a
                  href={`https://wa.me/${BUSINESS_MASTER?.whatsappRaw || BUSINESS_MASTER?.whatsappNumber || BUSINESS_MASTER?.contact?.whatsappRaw || "918002903643"}?text=${encodeURIComponent(
                    `Namaste Super Telecom! Mera phone repair karwana hai. Problem: ${activeFault.hindiTitle} (${activeFault.englishTitle}). Kripya estimate aur availability batayein.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp पर बात करें / Estimate लें
                </a>

                <a
                  href={BUSINESS_MASTER.phoneCallHref}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-xs sm:text-sm hover:bg-slate-800 transition-colors"
                >
                  <Phone className="h-4 w-4 text-cyan-400" /> डायरेक्ट कॉल: {BUSINESS_MASTER.phoneDisplay}
                </a>
              </div>

              <div className="pt-2 border-t border-slate-900 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                <span>गिरिडीह लैब: बरगंडा रोड, शिवम क्लीनिक के पास</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { VisualFaultFinder };
export default VisualFaultFinder;
