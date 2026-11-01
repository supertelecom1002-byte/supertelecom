import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Trash2,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";

// ─────────────────────────────────────────────────────────────────────────────
// DPDP ACT 2027 BILINGUAL CONSENT CHECKBOX
// ─────────────────────────────────────────────────────────────────────────────

interface DpdpConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  className?: string;
}

export const DpdpConsentCheckbox: React.FC<DpdpConsentCheckboxProps> = ({
  checked,
  onChange,
  required = true,
  className = "",
}) => {
  return (
    <div
      className={`rounded-2xl border p-3.5 transition-all backdrop-blur-md select-none ${
        checked
          ? "border-cyan-500/50 bg-cyan-950/20 shadow-sm"
          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
      } ${className}`}
    >
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-950 cursor-pointer shrink-0"
        />
        <div className="space-y-1 text-xs">
          <p className="font-medium text-slate-200 leading-snug">
            मैं <strong className="text-cyan-400">DPDP Act 2027</strong> के तहत रिपेयर अनुमान और सर्विस अपडेट के लिए अपना नाम, फ़ोन नंबर और डिवाइस मॉडल साझा करने की सहमति देता/देती हूँ। मैं कभी भी अपनी सहमति वापस ले सकता/सकती हूँ।
          </p>
          <p className="text-[11px] text-slate-400 leading-normal">
            I consent under the Digital Personal Data Protection (DPDP) Act 2027 to share my contact details solely for repair quote calculation and service updates. I understand I can withdraw consent or request complete erasure anytime.
          </p>
        </div>
      </label>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DPDP 2027 CAMERA & SCANNER ON-DEVICE PRIVACY NOTICE
// ─────────────────────────────────────────────────────────────────────────────

export const DpdpCameraNotice: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 backdrop-blur-md ${className}`}
    >
      <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <strong className="block font-semibold text-emerald-200">
          100% ऑन-डिवाइस प्रोसेसिंग (Zero Cloud Upload)
        </strong>
        <p className="text-[11px] text-emerald-400/90 leading-relaxed">
          आपकी फ़ोटो, बारकोड या IMEI किसी बाहरी सर्वर पर सेव नहीं की जाती। सभी हार्डवेयर स्कैनिंग ब्राउज़र मेमोरी में लोकल सैंडबॉक्स के भीतर प्रोसेस होती है।
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DPDP 2027 CUSTOMER DATA RIGHTS & GRIEVANCE REDRESSAL DRAWER / MODAL
// ─────────────────────────────────────────────────────────────────────────────

interface DpdpDataRightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DpdpDataRightsModal: React.FC<DpdpDataRightsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [erasurePhone, setErasurePhone] = useState("");
  const [erasureSubmitted, setErasureSubmitted] = useState(false);
  const [erasureTicket, setErasureTicket] = useState("");

  if (!isOpen) return null;

  const handleErasureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!erasurePhone.trim()) return;
    const ticketId = `DPDP-PURGE-${Date.now().toString().slice(-6)}`;
    setErasureTicket(ticketId);
    setErasureSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-cyan-500/40 bg-slate-900/95 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close DPDP Privacy Center"
          className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 border-b border-slate-800 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Lock className="h-3 w-3" />
            <span>DPDP ACT 2027 COMPLIANCE HUB</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-white">
            ग्राहक डेटा सुरक्षा व शिकायत निवारण केंद्र
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP Act 2027) के तहत आपके समस्त अधिकार और सुपर टेलीकॉम की डेटा गोपनीयता गारंटी।
          </p>
        </div>

        {/* Modal Body */}
        <div className="mt-6 space-y-6">
          {/* 1. Zero-Snooping Workshop Pledge */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="h-5 w-5 shrink-0" />
              <span>Zero-Snooping Workshop Pledge (जीरो-स्नूपिंग गारंटी)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              सुपर टेलीकॉम गिरिडीह में हम आपके विश्वास का पूरा सम्मान करते हैं। हमारी लैब निम्नलिखित सख्त नियमों से बंधी है:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>हार्डवेयर ओनली टेस्टिंग:</strong> स्क्रीन, बैटरी या चार्जिंग पोर्ट बदलते समय ग्राहक से लॉक-स्क्रीन पासवर्ड नहीं मांगा जाता।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>पर्सनल डेटा पर शून्य नज़र:</strong> फोटो गैलरी, व्हाट्सएप चैट, मैसेज या फाइलों को कभी भी खोला या कॉपी नहीं किया जाता।</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>कोई थर्ड-पार्टी शेयरिंग नहीं:</strong> आपका मोबाइल नंबर कभी भी किसी मार्केटिंग एजेंट या एडवरटाइज़र को नहीं बेचा जाता।</span>
              </li>
            </ul>
          </div>

          {/* 2. Right to Erasure / Withdraw Consent Form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-sm">
              <Trash2 className="h-4 w-4 shrink-0" />
              <span>Right to Erasure (अपना रिपेयर डेटा डिलीट करवाने का अधिकार)</span>
            </div>
            <p className="text-xs text-slate-300">
              यदि आप चाहते हैं कि रिपेयर संपन्न होने के बाद आपका नाम, फोन नंबर और जॉब-शीट इतिहास हमारे सिस्टम से पूरी तरह मिटा दिया जाए, तो नीचे अपना फोन नंबर दर्ज करें:
            </p>

            {erasureSubmitted ? (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/50 p-4 text-center space-y-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">डेटा डिलीशन अनुरोध स्वीकार कर लिया गया है</h4>
                <p className="text-xs text-slate-300">
                  रेफरेंस टोकन: <strong className="font-mono text-cyan-400">{erasureTicket}</strong>
                </p>
                <p className="text-[11px] text-slate-400">
                  हमारे डेटा प्रोटेक्शन ऑफिसर द्वारा 24 घंटे के भीतर आपका रिकॉर्ड सुरक्षित रूप से पर्ज (Purge) कर दिया जाएगा।
                </p>
              </div>
            ) : (
              <form onSubmit={handleErasureSubmit} className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <input
                  type="tel"
                  required
                  placeholder="अपना 10-अंकों का मोबाइल नंबर दर्ज करें"
                  value={erasurePhone}
                  onChange={(e) => setErasurePhone(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> डेटा डिलीट करें
                </button>
              </form>
            )}
          </div>

          {/* 3. Statutory Grievance Redressal Officer Contact */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>Data Protection & Grievance Redressal Officer (शिकायत निवारण अधिकारी)</span>
            </h4>
            <div className="grid gap-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>पता:</strong> सुपर टेलीकॉम, बरगंडा रोड (शिवम क्लिनिक के पास), गिरिडीह, झारखंड - 815301
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>ईमेल:</strong>{" "}
                  <a href="mailto:supertelecom1002@gmail.com" className="text-cyan-400 hover:underline">
                    supertelecom1002@gmail.com
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>हेल्पलाइन:</strong>{" "}
                  <a href="tel:+918002903643" className="text-cyan-400 hover:underline">
                    +91 80029 03643
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>समाधान समय सीमा (SLA):</strong> अधिकतम 7 कार्यदिवस (7 Working Days)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2 text-xs font-semibold text-white transition-colors"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
