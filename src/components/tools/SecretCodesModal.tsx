import React, { useState } from "react";
import { Phone, Copy, Check, Search, X, Hash, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";

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
      title: "CIT Hardware Diagnostic Test",
      description: "Official Xiaomi/Redmi/Poco hardware diagnostic center for all on-board components.",
      category: "diagnostic",
    },
    {
      code: "*#*#4636#*#*",
      title: "Radio & Network Band Info",
      description: "Cellular tower signal, Wi-Fi latency diagnostics, and detailed battery health.",
      category: "network",
    },
    {
      code: "*#*#64663#*#*",
      title: "Factory Quality Check (QC)",
      description: "Touch digitizer sensitivity matrix and multi-touch capability verification.",
      category: "diagnostic",
    },
    {
      code: "*#06#",
      title: "IMEI & MEID Verification",
      description: "Authenticates Indian BIS regulation and hardware serial numbers.",
      category: "network",
    },
  ],
  vivo_oppo: [
    {
      code: "*#558#",
      title: "Vivo Factory Engineering Mode",
      description: "Comprehensive QA test suite for optical in-display fingerprint, speakers, and cameras.",
      category: "diagnostic",
    },
    {
      code: "*#899#",
      title: "Oppo / Realme After-Sales Engineer Mode",
      description: "Main board sensor inspection, charging current readout, and LCD calibration.",
      category: "diagnostic",
    },
    {
      code: "*#*#4636#*#*",
      title: "Advanced Radio & Phone Status",
      description: "5G NR radio toggle, VoLTE status and IMS registration checks.",
      category: "network",
    },
    {
      code: "*#1234#",
      title: "Funtouch / ColorOS Version Details",
      description: "Software release hash and modem baseband verification.",
      category: "system",
    },
  ],
};

const BRANDS = [
  { id: "samsung", label: "Samsung" },
  { id: "apple", label: "Apple iPhone" },
  { id: "oneplus", label: "OnePlus" },
  { id: "xiaomi", label: "Xiaomi / Poco" },
  { id: "vivo_oppo", label: "Vivo / Oppo" },
];

export const SecretCodesModal: React.FC<SecretCodesModalProps> = ({ isOpen, onClose }) => {
  const { triggerVibration } = useHardwarePermissions();
  const [selectedBrand, setSelectedBrand] = useState("samsung");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCodes = BRAND_CODES[selectedBrand] || [];
  const filteredCodes = currentCodes.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (code: string) => {
    triggerVibration(30);
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      toast.success(`Copied ${code} to clipboard`);
      setTimeout(() => setCopiedCode(null), 2000);
    }).catch(() => {
      toast.error("Failed to copy code");
    });
  };

  const handleDial = (code: string) => {
    triggerVibration(40);
    // Encode # properly for tel: URI
    const encoded = code.replace(/#/g, "%23");
    window.location.href = `tel:${encoded}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between flex-none">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Hash className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800">
                  Engineer Dials
                </span>
              </div>
              <h3 className="font-bold text-base text-white mt-0.5">
                Secret Hardware Dial Directory
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Brand Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar flex-none">
          {BRANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                triggerVibration(25);
                setSelectedBrand(b.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                selectedBrand === b.id
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-none">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${selectedBrand} dial codes...`}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Codes List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar min-h-[260px]">
          {filteredCodes.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No matching dial codes found.
            </div>
          ) : (
            filteredCodes.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-black text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2.5 py-1 rounded-xl">
                    {item.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.code)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
                      title="Copy Code"
                    >
                      {copiedCode === item.code ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span className="hidden sm:inline text-[11px]">Copy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDial(item.code)}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
                    >
                      <Phone className="h-3 w-3" />
                      <span className="text-[11px]">Tap to Dial</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between flex-none">
          <span>Tested on Android 10-15 &amp; iOS 15-18</span>
          <span className="text-cyan-400 font-mono">Barganda Lab Archive</span>
        </div>
      </div>
    </div>
  );
};

export default SecretCodesModal;
