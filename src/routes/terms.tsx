import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  AlertTriangle,
  Database,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  ChevronRight,
  ShieldAlert,
  Scale,
  DollarSign,
  HelpCircle,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP = "918002903643";

const TITLE = "Terms of Service & Repair Conditions | Super Telecom Giridih";
const DESC =
  "Official Terms of Service, liability conditions, data backup policy, and bench repair guidelines for Super Telecom customers in Giridih, Jharkhand.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      {
        name: "keywords",
        content:
          "Super Telecom Terms of Service, Mobile Repair Conditions Giridih, Repair Liability Policy, Data Backup Responsibility, Unclaimed Phone Policy Giridih",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/terms` },
      { property: "og:site_name", content: "Super Telecom" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/terms` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Terms of Service", item: `${SITE_URL}/terms` },
          ],
        }),
      },
    ],
  }),
  component: TermsPage,
});

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-background text-foreground transition-colors duration-200">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <BrandLogo size="md" to="/" />

          <div className="flex items-center gap-2.5">
            <a
              href={`tel:${PHONE}`}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border/70 px-3 py-1.5 text-xs font-semibold hover:bg-accent transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>{PHONE_DISPLAY}</span>
            </a>

            <a
              href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20have%20a%20question%20about%20terms`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">WhatsApp</span>
            </a>

            <Link
              to="/"
              className="inline-flex items-center gap-1 rounded-xl bg-secondary hover:bg-muted text-foreground border border-border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <span>← Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Terms of Service</span>
        </nav>

        {/* Hero Banner */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 text-cyan-900 dark:text-cyan-300 text-xs font-mono font-bold tracking-tight">
            <Scale className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>FAIR TRADE LAB STANDARDS &bull; GIRIDIH</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Terms of Service &amp; Repair Liability Conditions
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Please review these conditions carefully before submitting a device to Super Telecom for physical hardware, micro-soldering, screen restoration, or software servicing.
          </p>
        </div>

        {/* 4 Core Lab Conditions */}
        <div className="space-y-6 mb-12">
          {/* Clause 1 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                <Database className="h-5 w-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                1. Customer Data &amp; Backup Responsibility
              </h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-1 sm:pl-12">
              <p>
                Customers are strongly advised to create a full backup of all contacts, photos, WhatsApp chats, messages, and files prior to submitting any device for chip-level or motherboard servicing.
              </p>
              <p>
                While our bench technicians make every reasonable technical effort to preserve device data during hardware operations, <strong>Super Telecom shall not be held liable for any loss, corruption, or unrecoverability of data</strong> caused by underlying NAND flash decay, operating system bootloops, factory firmware flashing, or micro-soldering heat dissipation.
              </p>
            </div>
          </div>

          {/* Clause 2 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                2. Pre-Existing Board Trauma &amp; Water Damage (Best-Effort Protocol)
              </h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-1 sm:pl-12">
              <p>
                Devices suffering from extensive liquid submersion (water, tea, beverage, oil) or severe vehicular impact frequently harbor latent corrosion, hairline board trace cracks, and multi-rail short-circuits.
              </p>
              <p>
                All water-damaged, submerged, or dead devices are accepted on a <strong>Technical Best-Effort Basis</strong>. During ultrasonic cleaning, short clearing, or component heating, pre-damaged internal semiconductors may occasionally cease functioning entirely due to pre-existing oxidation. Super Telecom will not be responsible for latent progressive decay inherent to flooded motherboards.
              </p>
            </div>
          </div>

          {/* Clause 3 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                3. Unclaimed Devices &amp; Collection Policy (45-Day Limit)
              </h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-1 sm:pl-12">
              <p>
                Once a device has been serviced or diagnosed and the customer is notified that it is <strong>"Ready for Pickup"</strong> (via Phone Call, SMS, WhatsApp, or Online Job Sheet status):
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Customers must collect their repaired handset within <strong>45 days</strong> of initial completion notification.</li>
                <li>Devices remaining unclaimed after 45 days may incur a nominal storage fee of ₹20/day to cover inventory storage and insurance.</li>
                <li>Devices left unclaimed beyond <strong>90 days</strong> without prior written arrangement may be recycled or safely disposed of to defray bench part expenses in accordance with local commercial trade regulations in Jharkhand.</li>
              </ul>
            </div>
          </div>

          {/* Clause 4 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                <DollarSign className="h-5 w-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                4. Transparent Estimates &amp; Free Diagnosis Guarantee
              </h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-1 sm:pl-12">
              <p>
                We maintain an absolute <strong>Zero Hidden Charges</strong> code of ethics:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Initial microscope inspection and quotation are completely <strong>FREE</strong>.</li>
                <li>You pay only after you approve the written estimate and your device is successfully serviced.</li>
                <li>If a board is deemed non-repairable or if you decline our repair estimate, your device is reassembled and returned to you with zero diagnostic fee.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 5: Bench Warranty Reference */}
        <section className="rounded-3xl p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 mb-10">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Warranty Coverage Terms
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            All serviced components (screens, batteries, charging boards, ICs) are protected under our official 
            <strong> 90-Day Lab Warranty</strong>. For specific coverage boundaries, exclusions, and tamper-seal rules, please consult our dedicated policy:
          </p>
          <Link
            to="/warranty"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            <span>Read 90-Day Lab Warranty Policy</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </section>

        {/* Bottom Contact */}
        <section className="rounded-3xl p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950 border border-cyan-500/30 text-white space-y-3 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-cyan-400" />
            Need Clarification on Repair Terms?
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Speak directly with our head bench technician at our Barganda Road lab in Giridih.
          </p>
          <div className="flex flex-wrap gap-3 pt-1 text-xs">
            <a
              href={`tel:${PHONE}`}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold flex items-center gap-1.5"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Lab Desk: {PHONE_DISPLAY}</span>
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20have%20a%20question%20about%20terms`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <SiteFooter />
    </div>
  );
}
