import { BUSINESS_MASTER, SERVICES_MASTER_CATALOG, REPAIR_PRICE_DISCLAIMER } from "@/config/superTelecomConfig";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  date: string;
  excerpt: string;
  // Simple HTML body — kept minimal for SEO focus, no external assets
  html: string;
}

export const POSTS: BlogPost[] = [
  {
    slug: "best-mobile-repair-shop-in-giridih",
    title: "How to Find the Best Mobile Repair Shop in Giridih (2026 Guide)",
    description: "A local Giridih guide to picking a trustworthy mobile repair shop — warranty, genuine parts, chip-level capability, transparent pricing and more.",
    keywords: "best mobile repair shop giridih, phone repair giridih, mobile repair near me",
    date: "2026-03-01",
    excerpt: "Warranty, genuine parts and chip-level capability — here's how Giridih customers can pick the right repair shop the first time.",
    html: `
      <p>Choosing where to repair your phone in Giridih can feel confusing — every lane on Barganda Road has a signboard promising “fast repair”. This guide breaks down what actually matters when you hand over your device to a technician.</p>
      <h2>1. Look for written warranty on every repair</h2>
      <p>A good <strong>mobile repair shop in Giridih</strong> gives you a printed bill and formal warranty — backed in writing. Verbal promises don't count. At <strong>Super Telecom</strong>, our screen, battery, charging port, and motherboard repairs are protected under our official lab warranty.</p>
      <h2>2. Ask if they do chip-level (motherboard) repair in-house</h2>
      <p>Most shops in Giridih only swap modular parts. Complex faults — no-power, short-circuits, charging IC issues, no-network, water damage — require <strong>chip-level motherboard diagnosis</strong> under a microscope. Super Telecom maintains a dedicated ESD workstation with trinocular microscope right on Barganda Road.</p>
      <h2>3. Know your part grades: Compatible vs OEM-Grade</h2>
      <p>Reputable repair labs explain the distinction between Compatible Aftermarket screens, OEM-Grade parts, and Original Service Packs before bench installation so you can choose the right balance of price and performance.</p>
      <h2>4. Transparent, itemised pricing</h2>
      <p>Before service begins, you should receive a clear written estimate. Super Telecom provides free microscope inspection and transparent quotes; you pay only after approving the estimate and receiving verified repair results.</p>
      <h2>5. Proven local experience in Giridih</h2>
      <p>${BUSINESS_MASTER.experienceClaim}. Established experience and direct local technician accountability ensure reliable craftsmanship for your smartphones.</p>
      <h2>Visit Super Telecom in Giridih</h2>
      <p>${BUSINESS_MASTER.fullAddress}. Open ${BUSINESS_MASTER.hours.fullDisplay}. Call <a href="${BUSINESS_MASTER.phoneCallHref}">${BUSINESS_MASTER.phoneDisplay}</a> or WhatsApp our lab desk anytime.</p>
    `,
  },
  {
    slug: "iphone-vs-android-repair-cost-giridih",
    title: "iPhone vs. Android Repair Cost in Giridih — 2026 Price Guide",
    description: "How much does it cost to repair an iPhone or Android phone in Giridih? Realistic ranges for screen, battery, charging port, motherboard and water damage.",
    keywords: "iphone repair cost giridih, android repair price giridih, mobile repair price",
    date: "2026-02-14",
    excerpt: "Real 2026 Giridih price ranges for iPhone and Android — screen, battery, charging port, motherboard and water-damage repairs, side by side.",
    html: `
      <p>Repair prices vary depending on device tier, brand, and part grade. Below are the standard 2026 reference ranges at <strong>Super Telecom, Barganda Road, Giridih</strong>:</p>
      <h2>Screen Replacement Reference Ranges</h2>
      <ul>
        <li><strong>Android Compatible LCD:</strong> ₹899 – ₹2,999</li>
        <li><strong>Android AMOLED / Curved OLED:</strong> ₹2,499 – ₹9,999</li>
        <li><strong>iPhone Display & OLED (iPhone 8 to 15 Pro Max):</strong> ₹3,500 – ₹15,000</li>
      </ul>
      <h2>Battery Replacement</h2>
      <ul>
        <li><strong>Android High-Capacity Battery:</strong> ₹699 – ₹2,499</li>
        <li><strong>iPhone OEM-Grade Battery:</strong> ₹1,499 – ₹4,500</li>
      </ul>
      <h2>Charging Port & Sub-Board Repair</h2>
      <p>₹349 – ₹1,299 for Android Type-C / Micro-USB; ₹799 – ₹2,499 for iPhone Lightning / Type-C flex assemblies.</p>
      <h2>Motherboard / Chip-Level Soldering</h2>
      <p>₹799 – ₹4,999 depending on fault complexity (Power IC, Charging IC, Audio Codec, Network baseband).</p>
      <h2>Water Damage Chemical Recovery</h2>
      <p>₹499 – ₹1,999 for ultrasonic chemical de-oxidation and rail short clearing.</p>
      <p><em>${REPAIR_PRICE_DISCLAIMER}</em></p>
      <p>Get a free microscope inspection and exact quote at Super Telecom in Giridih. Call <a href="${BUSINESS_MASTER.phoneCallHref}">${BUSINESS_MASTER.phoneDisplay}</a>.</p>
    `,
  },
  {
    slug: "phone-not-charging-what-to-do-giridih",
    title: "Phone Not Charging? 6 Fixes Before Visiting a Repair Shop in Giridih",
    description: "Charging port loose, phone not charging or charging slowly? Try these 6 safe checks first — and know when to bring the phone to Super Telecom Giridih.",
    keywords: "phone not charging giridih, charging port repair giridih, mobile not charging fix",
    date: "2026-01-20",
    excerpt: "Loose cable, slow charging, dead port — try these 6 safe checks before booking a charging-port repair in Giridih.",
    html: `
      <p>Before booking a <strong>charging port repair in Giridih</strong>, run through these six safe checks. Minor lint blockage and faulty cables account for many charging issues.</p>
      <h2>1. Try a different certified cable and adapter</h2>
      <p>Charging cables undergo frequent bending stress. Always test with a known-working certified cable and high-quality power adapter first.</p>
      <h2>2. Inspect the port safely — Never use metal needles</h2>
      <p>Pocket lint and dust can prevent the cable plug from seating fully. If cleaning the port yourself, use a dry, soft ESD brush or wooden toothpick with the phone powered completely off. <strong>Never use metallic safety pins, sewing needles, or conductive metal wire</strong>, as these can easily bend delicate gold pins, short-circuit the 5V/9V VBUS power rail, or damage the internal charging controller.</p>
      <h2>3. Restart your smartphone</h2>
      <p>A software freeze in background battery management services can temporarily halt power negotiation. A clean device reboot resolves minor OS telemetry locks.</p>
      <h2>4. Test wireless charging (if supported)</h2>
      <p>If wireless charging activates normally but cable charging fails, the issue is isolated to the physical USB socket or sub-board rather than the battery cell.</p>
      <h2>5. Check for battery expansion</h2>
      <p>If you notice the back cover lifting or the screen bulging along the frame, immediately unplug the charger. Swollen lithium batteries require professional laboratory disposal and replacement.</p>
      <h2>6. Safe mode charging check</h2>
      <p>Boot into Safe Mode. If the device charges reliably without third-party apps running, an application is draining power faster than it can charge.</p>
      <h2>Still not charging? Visit Super Telecom in Giridih</h2>
      <p>We provide free microscope inspection at our Barganda Road lab. Port cleaning or micro-soldered socket replacement is typically completed within 30–60 minutes. <a href="${BUSINESS_MASTER.phoneCallHref}">Call ${BUSINESS_MASTER.phoneDisplay}</a> or drop in at ${BUSINESS_MASTER.streetAddress}, Giridih.</p>
    `,
  },
];
