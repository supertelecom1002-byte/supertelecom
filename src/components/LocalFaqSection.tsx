import React, { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Phone,
  Sparkles,
  MapPin,
  Clock,
  Wrench,
  CheckCircle2,
} from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export const LOCAL_AEO_FAQS: FaqItem[] = [
  {
    question: "Where is Super Telecom located in Giridih?",
    answer:
      "Super Telecom is located on Barganda Road, right near Shivam Clinic, Giridih, Jharkhand (815301). We are easily accessible from all parts of Giridih city.",
    category: "Location",
  },
  {
    question: "How long does mobile screen replacement take at Super Telecom?",
    answer:
      "Most screen replacements for iPhone, Samsung, Realme, Vivo, and OnePlus take just 30 to 45 minutes with warranty. We test touch response, color accuracy, and brightness before handover.",
    category: "Display Repairs",
  },
  {
    question: "Do you repair water-damaged or dead smartphones?",
    answer:
      "Yes, we specialize in chip-level micro-soldering, motherboard IC replacement, and short-circuit fixes for all major brands. Our lab is equipped with precision ultrasonic cleaners and BGA rework stations.",
    category: "Motherboard / Dead Phones",
  },
  {
    question: "What are the shop timings and contact number?",
    answer:
      "We are open Monday to Sunday from 10:00 AM to 9:30 PM. Call or WhatsApp +91 80029 03643 for immediate repair quotes or store directions.",
    category: "Timings & Contact",
  },
  {
    question: "Is diagnosis and inspection free at Super Telecom Giridih?",
    answer:
      "Yes. We offer free on-the-spot physical and electrical diagnosis. We identify the exact problem and provide a transparent, upfront price quote before starting any work.",
    category: "Pricing & Warranty",
  },
  {
    question: "Do you provide warranty on repaired phones and replaced parts?",
    answer:
      "Yes, all display replacements, batteries, and motherboard repairs are backed by a warranty ranging from 30 to 90 days. If any manufacturing defect arises, we rectify it promptly.",
    category: "Warranty",
  },
];

export const LocalFaqSection: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]); // Keep first two open by default for rich indexability

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section
      id="giridih-faq"
      aria-label="Super Telecom Local Giridih FAQ"
      className="py-20 md:py-28 bg-slate-950 text-slate-100 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Voice Search &amp; Direct Answer Hub
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions in Giridih
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Direct answers regarding location, repair turnaround, pricing, and warranty at Super Telecom Barganda Road.
          </p>
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-4">
          {LOCAL_AEO_FAQS.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className={`rounded-3xl border transition-all overflow-hidden ${
                  isOpen
                    ? "bg-slate-900/90 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 select-none focus:outline-none"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="p-1.5 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 mt-0.5 flex-none">
                      <HelpCircle className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {faq.question}
                      </h3>
                      {faq.category && (
                        <span className="text-[10px] font-mono uppercase text-slate-400 mt-1 block">
                          {faq.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className={`p-2 rounded-xl bg-slate-800 text-slate-300 transition-transform duration-300 flex-none ${
                      isOpen ? "rotate-180 bg-cyan-500 text-slate-950" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-800/80 animate-fade-down">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Contact Bar */}
        <div className="mt-10 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-white">Have a question not listed here?</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Speak directly with our chief technician on Barganda Road, Giridih.
            </p>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-3 flex-none">
            <a
              href="https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20I%20have%20a%20question%20about%20mobile%20repair"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-[1.02]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Ask on WhatsApp</span>
            </a>
            <a
              href="tel:+918002903643"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              <Phone className="h-4 w-4 text-cyan-400" />
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalFaqSection;
