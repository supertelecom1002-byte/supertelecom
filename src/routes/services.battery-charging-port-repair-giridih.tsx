import { createFileRoute } from "@tanstack/react-router";
import { BatteryChargingRepairPage } from "@/pages/services/BatteryChargingRepair";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";

const PHONE = "+918002903643";
const PAGE_URL = `${SITE_URL}/services/battery-charging-port-repair-giridih`;
const TITLE = "Mobile Battery Replacement & Charging Port Repair in Giridih | Super Telecom";
const DESCRIPTION =
  "Quick mobile battery replacement & charging port repair in Giridih. Fix fast-draining battery, phone overheating, loose charging jack, Type-C & Lightning pin. 20-min fix.";

export const Route = createFileRoute("/services/battery-charging-port-repair-giridih")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "mobile battery replacement giridih, phone charging port repair giridih, swollen battery fix giridih, type c port repair giridih, iphone battery replacement barganda road",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:site_name", content: "Super Telecom" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "geo.region", content: "IN-JH" },
      { name: "geo.placename", content: "Giridih" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "@id": `${PAGE_URL}#service`,
              serviceType: "Mobile Battery Replacement & Charging Port Repair",
              name: "Mobile Battery Replacement & Charging Port Repair in Giridih",
              description: DESCRIPTION,
              url: PAGE_URL,
              provider: {
                "@type": "MobilePhoneRepairShop",
                name: "Super Telecom",
                telephone: PHONE,
                address: {
                  "@type": "PostalAddress",
                  streetAddress: STORE_STREET_ADDRESS,
                  addressLocality: "Giridih",
                  addressRegion: "Jharkhand",
                  postalCode: "815301",
                  addressCountry: "IN",
                },
              },
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "INR",
                lowPrice: "350",
                highPrice: "2499",
                priceValidUntil: "2027-12-31",
                availability: "https://schema.org/InStock",
              },
            },
            {
              "@type": "FAQPage",
              "@id": `${PAGE_URL}#faq`,
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How long does mobile battery replacement take at Super Telecom?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Battery replacement for popular models (Xiaomi, Samsung, Realme, Vivo, iPhone) takes just 20 to 30 minutes in our shop on Barganda Road, Giridih. You can wait and watch the installation in person.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Will fast charging (VOOC/SuperVOOC/PD) work after port replacement?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. We install high-grade charging sub-boards and original pin connectors that fully support fast charging protocols, OTG data transfer, and microphone functionality.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What should I do if my phone shows 'Moisture Detected in USB Port'?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Do not force a charger into the port. This error can be triggered by dust trapping humidity or oxidized copper pins. Bring it to our shop for a safe ultrasonic clean and pin inspection.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is the warranty on new batteries?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "All replacement batteries come with a 90-day warranty. If the battery experiences abnormal drain or charging issues during this period, we replace it promptly.",
                  },
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: BatteryChargingRepairPage,
});
