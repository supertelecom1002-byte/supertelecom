import { Phone, MessageCircle, MapPin, AlertTriangle, ShieldAlert, CheckCircle2, Clock, Wrench } from "lucide-react";

// Reusable Direct Answer Box for AI Citation, AEO, & High-Intent Local Conversion
export interface ServiceAnswerBlockProps {
  question: string;
  answer: string;
  symptoms: string[];
  turnaround: string;
  diagnosticSteps?: string[];
  diyWarning?: string;
  limitations?: string;
}

export const ServiceAnswerBlock = ({
  question,
  answer,
  symptoms,
  turnaround,
  diagnosticSteps,
  diyWarning = "Avoid charging or powering on devices with suspected short circuits or liquid ingress. DIY prying with metal tools risks puncturing lithium batteries and thermal runaway.",
  limitations = "Severe PCB substrate fractures or catastrophic delamination on core AP chips may be deemed non-viable if replacement costs exceed device market valuation.",
}: ServiceAnswerBlockProps) => (
  <section
    itemScope
    itemType="https://schema.org/Question"
    className="my-8 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md backdrop-blur"
  >
    <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
      <Wrench className="h-3.5 w-3.5" />
      <span>Bench Answer &amp; Engineering Summary</span>
    </div>

    <h2 itemProp="name" className="mt-2 text-xl font-bold text-white">
      {question}
    </h2>

    <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer" className="mt-3">
      <p itemProp="text" className="text-sm leading-relaxed text-slate-300">
        {answer}
      </p>
    </div>

    <div className="mt-6 grid grid-cols-1 gap-5 border-t border-slate-800 pt-5 md:grid-cols-2 text-xs text-slate-400">
      {/* Symptoms / Indicators */}
      <div>
        <span className="font-semibold text-cyan-400 flex items-center gap-1.5 mb-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
          Common Symptoms &amp; Fault Indicators:
        </span>
        <ul className="list-disc pl-4 space-y-1 text-slate-300">
          {symptoms.map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      </div>

      {/* Turnaround & Laboratory Verification */}
      <div>
        <span className="font-semibold text-cyan-400 flex items-center gap-1.5 mb-2">
          <Clock className="h-3.5 w-3.5 text-cyan-400" />
          Turnaround, Pricing &amp; Verification:
        </span>
        <p className="text-slate-300">{turnaround}</p>
        <p className="mt-2 font-mono text-[11px] text-slate-400">
          Super Telecom Workshop: Barganda Road, Near Shivam Clinic, Giridih
        </p>
        <p className="mt-0.5 font-mono text-[11px] text-cyan-400">
          Hours: Monday – Sunday · 10:00 AM – 9:30 PM
        </p>
      </div>

      {/* Diagnostic Steps if available */}
      {diagnosticSteps && diagnosticSteps.length > 0 && (
        <div className="md:col-span-2 pt-2 border-t border-slate-800/60">
          <span className="font-semibold text-slate-300 block mb-1.5">Bench Diagnostic Protocol:</span>
          <div className="grid gap-2 sm:grid-cols-3">
            {diagnosticSteps.map((step, idx) => (
              <div key={idx} className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800 text-[11px] text-slate-300">
                <span className="text-cyan-400 font-bold block mb-0.5">Step {idx + 1}:</span>
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk / DIY Warning */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-amber-300/90">
        <span className="font-semibold flex items-center gap-1.5 mb-1 text-amber-400">
          <AlertTriangle className="h-3.5 w-3.5" /> Delay / DIY Risk Warning:
        </span>
        <p>{diyWarning}</p>
      </div>

      {/* Repair Limitations */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 text-[11px] text-slate-400">
        <span className="font-semibold flex items-center gap-1.5 mb-1 text-slate-300">
          <ShieldAlert className="h-3.5 w-3.5 text-cyan-400" /> Technical Limitations:
        </span>
        <p>{limitations}</p>
      </div>
    </div>

    {/* Direct High Intent Actions */}
    <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
      <a
        href="tel:+918002903643"
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg text-xs transition"
      >
        <Phone className="h-3.5 w-3.5" /> Call +91 80029 03643
      </a>
      <a
        href="https://wa.me/918002903643?text=Hello%20Super%20Telecom,%20I%20need%20a%20repair%20quote"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs transition"
      >
        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Direct Inquiry
      </a>
      <a
        href="https://maps.google.com/?q=Barganda+Road+Near+Shivam+Clinic+Giridih"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-xs transition"
      >
        <MapPin className="h-3.5 w-3.5" /> Directions to Shop
      </a>
    </div>
  </section>
);

export default ServiceAnswerBlock;
