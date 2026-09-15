// Reusable Direct Answer Box for AI Citation & High Intent Conversion
export const ServiceAnswerBlock = ({
  question,
  answer,
  symptoms,
  turnaround,
}: {
  question: string;
  answer: string;
  symptoms: string[];
  turnaround: string;
}) => (
  <section className="my-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
    <h2 className="text-xl font-bold text-white mb-2">{question}</h2>
    <p className="text-slate-300 leading-relaxed text-sm mb-4">{answer}</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
      <div>
        <span className="font-semibold text-cyan-400 block mb-1">Common Indicators:</span>
        <ul className="list-disc pl-4 space-y-1">
          {symptoms.map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      </div>
      <div>
        <span className="font-semibold text-cyan-400 block mb-1">Turnaround & Verification:</span>
        <p>{turnaround}</p>
        <p className="mt-2 font-mono text-slate-400">
          Location: Barganda Road, Near Shivam Clinic, Giridih
        </p>
      </div>
    </div>

    {/* Direct Conversion Actions */}
    <div className="flex flex-wrap gap-3 mt-6">
      <a
        href="tel:+918002903643"
        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg text-xs transition"
      >
        Call +91 80029 03643
      </a>
      <a
        href="https://wa.me/918002903643?text=Hello%20Super%20Telecom,%20I%20need%20a%20repair%20quote"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs transition"
      >
        WhatsApp Inquiry
      </a>
      <a
        href="https://maps.google.com/?q=Barganda+Road+Near+Shivam+Clinic+Giridih"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-xs transition"
      >
        Directions to Shop
      </a>
    </div>
  </section>
);

export default ServiceAnswerBlock;
