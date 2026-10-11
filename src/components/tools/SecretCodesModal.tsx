import React, { useState } from "react";
import { Phone, Copy, Check, Search, X, Hash, Sparkles } from "lucide-react";

interface SecretCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SecretCodeItem {
  code: string;
  title: string;
  description: string;
  category: "diagnostic" | "battery" | "network" | "system";
}

const BRAND_CODES: Record<string, SecretCodeItem[]> = {
  samsung: [
    {
      code: "*#0*#",
      title: "General Hardware Diagnostic Mode",
      description: "Tests RGB display, touch digitizer, vibration, sub-speakers, sensors and cameras.",
      category: "diagnostic",
    },
    {
      code: "*#0228#",
      title: "Battery Status & Voltage Readout",
      description: "Shows raw mV voltage, fuel-gauge ADC temperature and battery resistance levels.",
      category: "battery",
    },
    {
      code: "*#9900#",
      title: "SysDump & Storage Recovery",
      description: "Allows dumping logcat, clearing kernel logs, and deleting silent temp files to free space.",
      category: "system",
    },
    {
      code: "*#1234#",
      title: "Firmware Version & CSC Check",
      description: "Displays PDA, CSC, and modem AP versions for official updates verification.",
      category: "system",
    },
    {
      code: "*#06#",
      title: "Universal IMEI & Serial Number",
      description: "Verifies authentic hardware IMEI 1, IMEI 2 and barcode checksum.",
      category: "network",
    },
  ],
  apple: [
    {
      code: "*3001#12345#*",
      title: "Field Test Mode",
      description: "Displays exact dBm cellular tower signal strength, LTE/5G bands and carrier bandwidth.",
      category: "network",
    },
    {
      code: "*#06#",
      title: "IMEI & EID Display",
      description: "Checks dual IMEI and eSIM digital identifier for blacklist & carrier lock verification.",
      category: "network",
    },
    {
      code: "*#21#",
      title: "Call Forwarding Interrogation",
      description: "Checks if your voice calls, SMS or data are being secretly redirected to another phone.",
      category: "network",
    },
    {
      code: "*#62#",
      title: "Unreachable Routing Query",
      description: "Identifies destination number when phone has no signal or is switched off.",
      category: "network",
    },
  ],
  oneplus: [
    {
      code: "*#899#",
      title: "Engineer Factory Test Menu",
      description: "Full factory assembly line testing for display, fast charging, cameras and vibration.",
      category: "diagnostic",
    },
    {
      code: "*#*#4636#*#*",
      title: "Testing Menu & Battery Info",
      description: "Detailed cellular radio switch, 5G band forcing, ping test and app usage stats.",
      category: "network",
    },
    {
      code: "*#1234#",
      title: "ColorOS / OxygenOS Build Version",
      description: "Reveals exact kernel patch and regional ROM specifications.",
      category: "system",
    },
    {
      code: "*#808#",
      title: "Manual Hardware Component Test",
      description: "Individual testing for fingerprint sensor calibration, gyro, light and compass.",
      category: "diagnostic",
    },
  ],
  xiaomi: [
    {
      code: "*#*#6484#*#*",
      title: "CIT Hardware Test Menu",
      description: "Xiaomi official 32-step engineering diagnostic test for screen, mic, flash & buttons.",
      category: "diagnostic",
    },
    {
      code: "*#*#4636#*#*",
      title: "Phone Information & WiFi Metric",
      description: "Radio control, VoLTE toggle, NR/LTE network preference and network stats.",
      category: "network",
    },
    {
      code: "*#*#284#*#*",
      title: "Instant Bug & Diagnostic Report",
      description: "Generates compressed system diagnostic dump in /MIUI/debug_log for deep troubleshooting.",
      category: "system",
    },
    {
      code: "*#*#564548#*#*",
      title: "MIUI / HyperOS Version Info",
      description: "Direct view of software build details, security patch level, and regional code.",
      category: "system",
    },
  ],
  vivo_oppo: [
    {
      code: "*#899#",
      title: "Aftersales Engineering Mode",
      description: "Official service center diagnostic utility for touch, display, speaker & sensor tests.",
      category: "diagnostic",
    },
    {
      code: "*#558#",
      title: "Vivo Factory Test App",
      description: "Dedicated production test interface for aging, RF calibration, and board health.",
      category: "diagnostic",
    },
    {
      code: "*#*#4838#*#*",
      title: "Testing & Battery Health Status",
      description: "Phone info, battery temperature and live WiFi state machine analytics.",
      category: "battery",
    },
    {
      code: "*#6776#",
      title: "Software Full Version Check",
      description: "Displays complete software release tree, baseband version, and master build date.",
      category: "system",
    },
  ],
  realme: [
    {
      code: "*#899#",
      title: "Realme Engineering Mode",
      description: "Manual test suite for optical in-display fingerprint, AMOLED matrix, and cameras.",
      category: "diagnostic",
    },
    {
      code: "*#808#",
      title: "Automated Hardware Test Suite",
      description: "Automated pass/fail sequence for microphone, earpiece, NFC, and vibration motor.",
      category: "diagnostic",
    },
    {
      code: "*#6776#",
      title: "Realme UI Version Information",
      description: "Comprehensive software build details, security patch date, and hardware variant.",
      category: "system",
    },
  ],
};

export const SecretCodesModal: React.FC<SecretCodesModalProps> = ({ isOpen, onClose }) => {
  const [selectedBrand, setSelectedBrand] = useState("samsung");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const codes = BRAND_CODES[selectedBrand] || [];
  const filtered = codes.filter(
    (c) =>
      c.code.includes(searchQuery) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 1500);
      });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative text-white max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between flex-none">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Hash className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Secret Hardware Dial Codes</h3>
              <p className="text-xs text-slate-400">Tested Engineering &amp; Diagnostic Menus</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Brand Tabs */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 flex-none">
          {[
            { id: "samsung", label: "Samsung" },
            { id: "apple", label: "Apple iPhone" },
            { id: "oneplus", label: "OnePlus" },
            { id: "xiaomi", label: "Xiaomi / Redmi" },
            { id: "vivo_oppo", label: "Vivo / Oppo" },
            { id: "realme", label: "Realme" },
          ].map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBrand(b.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedBrand === b.id
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-none">
          <Search className="h-4 w-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code or test (e.g. battery, touch, IMEI)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Code List (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No dial codes found matching "{searchQuery}"
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.code}
                className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-base font-black text-cyan-400 tracking-wider">
                      {item.code}
                    </span>
                    <h4 className="font-bold text-xs text-white mt-0.5">{item.title}</h4>
                  </div>

                  <div className="flex items-center gap-1.5 flex-none">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.code)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1 transition-all active:scale-95"
                      title="Copy Code"
                    >
                      {copiedCode === item.code ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-[10px] text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`tel:${encodeURIComponent(item.code)}`}
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 transition-all active:scale-95"
                      title="Dial in Phone App"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="flex-none pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 text-center">
          Open default Phone app and dial exactly as shown. Some codes execute instantly without pressing call.
        </div>
      </div>
    </div>
  );
};

export default SecretCodesModal;
