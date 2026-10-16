import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Mic,
  Camera,
  Compass,
  BatteryCharging,
  Database,
  ChevronRight,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL } from "@/data/site";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";

const PHONE = BUSINESS_MASTER.phoneRaw;
const PHONE_DISPLAY = BUSINESS_MASTER.phoneDisplay;
const WHATSAPP = BUSINESS_MASTER.whatsappNumber;
const EMAIL = BUSINESS_MASTER.email;

const TITLE = "Privacy Policy & Hardware Permissions | Super Telecom Giridih";
const DESC =
  "Official Privacy Policy and Hardware Permissions disclosure for Super Telecom. Zero personal data logging, 100% client-side hardware testing, and strict customer device privacy.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      {
        name: "keywords",
        content:
          "Super Telecom Privacy Policy, Hardware Permissions, Android PWA Privacy, Mobile Repair Data Privacy Giridih, Client Side Diagnostics",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/privacy` },
      { property: "og:site_name", content: "Super Telecom" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${SITE_URL}/privacy` },
          ],
        }),
      },
    ],
  }),
  component: PrivacyPage,
});

export default function PrivacyPage() {
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
              href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20have%20a%20privacy%20question`}
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
          <span className="text-foreground font-medium">Privacy Policy</span>
        </nav>

        {/* Hero Banner */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 text-cyan-900 dark:text-cyan-300 text-xs font-mono font-bold tracking-tight">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>PWA &amp; STORE COMPLIANCE STANDARD</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Privacy Policy &amp; Permissions Disclosure
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Effective Date: October 2026 &bull; Super Telecom Hardware Lab, Barganda Road, Giridih.
            Your privacy and customer device integrity are strictly protected under our client-side zero-storage architecture.
          </p>
        </div>

        {/* Core Principles Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-10">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-sm">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
              <EyeOff className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">Zero Personal Data Storage</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Diagnostic test scores, audio frequencies, IMEI checksums, and touch swipes are processed strictly in browser memory.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-sm">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-fit">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">Customer Bench Privacy</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When servicing devices in our physical lab, our technicians adhere to a strict Zero Snooping and Zero Data Copying guarantee.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-sm">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit">
              <Database className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">Encrypted Cloud Auth</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Only optional customer booking requests and job sheet lookup IDs pass through Supabase row-level security.
            </p>
          </div>
        </div>

        {/* Section 1: Hardware Permissions Disclosure */}
        <section className="space-y-4 mb-10">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <FileText className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Detailed Hardware Permissions Disclosure
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            The Super Telecom application and PWA request access to specific hardware APIs solely to execute client-side diagnostics. Here is exactly how each permission is handled:
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">
                <Mic className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  AudioContext &amp; Microphone (`getUserMedia`)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Used solely for the <strong>165Hz Sonic Speaker Dust Ejector</strong> (generating acoustic oscillation pulses) and the <strong>4-Second Mic Loopback Test</strong> (allowing you to hear if your microphone sounds muffled or distorted). 
                  <strong className="text-emerald-600 dark:text-emerald-400 block mt-1">
                    NO audio is ever recorded to disk, saved remotely, or transmitted to any server. Audio buffers exist solely in temporary RAM and are cleared immediately upon closing the tool.
                  </strong>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                <Camera className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Camera / Torch Flashlight (`MediaTrackCapabilities.torch`)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Used exclusively to toggle the physical rear LED flash for the <strong>Hardware Torch, 10Hz Strobe, and SOS Signal</strong> test. The video feed is never recorded, captured, or uploaded. If camera permission is denied, the tool falls back to a high-brightness white screen canvas.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                <Compass className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Device Motion &amp; Orientation (`DeviceMotionEvent / DeviceOrientationEvent`)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Used purely to power the <strong>3D Gyroscope Spirit Level</strong> and the <strong>Anti-Theft Motion Detector</strong>. Roll, pitch, and yaw metrics are computed in real-time in the browser to detect phone drop damage and movement alarms. No location or biometric tracking occurs.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <BatteryCharging className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Battery Status API (`navigator.getBattery`)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Queries battery level and charging state to alert you when reaching the optimal 85% charging threshold to prevent lithium degradation, and to trigger the anti-theft siren if the power cord is disconnected.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Third-Party Services & Authentication */}
        <section className="space-y-3 mb-10">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Database className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Third-Party Infrastructure &amp; Authentication
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Our cloud infrastructure leverages trusted, enterprise-grade providers:
          </p>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Supabase (PostgreSQL &amp; Auth):</strong> We use Supabase with strict Row-Level Security (RLS) to manage anonymous job sheet queries and optional customer repair bookings. Customer phone numbers provided for repair follow-ups are used solely for WhatsApp/SMS notifications and never shared or sold to marketing aggregators.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Cloudflare &amp; GitHub Pages:</strong> Edge caching and SSL/TLS encryption for rapid asset delivery in Jharkhand and across India.
              </span>
            </li>
          </ul>
        </section>

        {/* Section 3: Customer Device Data Guarantee */}
        <section className="space-y-3 mb-10">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Lock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. Bench Service Customer Data Privacy Guarantee
            </h2>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p>
              When you deposit your smartphone, tablet, or laptop at our physical Barganda Road workshop for hardware service:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You are never required to share your screen lock pattern or PIN code unless software testing is explicitly requested by you.</li>
              <li>Our technicians never access personal photo galleries, messages, banking apps, or files.</li>
              <li>Post-repair hardware checks (touch digitizer, cameras, speakers, charging) are performed using guest test modes or our offline diagnostic tools.</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Contact & Data Protection Officer */}
        <section className="rounded-3xl p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950 border border-cyan-500/30 text-white space-y-3 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="h-4 w-4 text-cyan-400" />
            Official Privacy &amp; Data Contact
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            If you have any questions or privacy concerns regarding Super Telecom mobile tools or hardware bench servicing:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="space-y-1">
              <span className="text-[10px] text-cyan-400 font-mono block">Direct Privacy Email</span>
              <a href={`mailto:${EMAIL}`} className="font-bold hover:underline text-white block">
                {EMAIL}
              </a>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-cyan-400 font-mono block">Physical Workshop Address</span>
              <span className="text-slate-300 block">
                {BUSINESS_MASTER.fullAddress}
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <SiteFooter />
    </div>
  );
}
