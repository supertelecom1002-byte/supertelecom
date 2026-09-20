import { createFileRoute } from "@tanstack/react-router";
import { WaterDamageRepairPage } from "@/pages/services/WaterDamageRepair";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";

const PHONE = "+918002903643";
const PAGE_URL = `${SITE_URL}/services/water-damage-mobile-repair-giridih`;
const TITLE = "Water Damage Mobile Repair in Giridih | Super Telecom";
const DESCRIPTION =
  "Emergency water damage mobile repair in Giridih. Ultrasonic chemical PCB bath, short circuit removal, chip-level micro-soldering & data recovery. Call +91 80029 03643.";

export const Route = createFileRoute("/services/water-damage-mobile-repair-giridih")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "water damage repair giridih, wet mobile repair giridih, dropped phone in water giridih, dead phone water damage recovery barganda road, ultrasonic pcb cleaning giridih",
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
              serviceType: "Water Damage Mobile Repair & Data Recovery",
              name: "Water Damage Mobile Repair in Giridih",
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
                lowPrice: "499",
                highPrice: "3499",
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
                  name: "Can a completely dead water-damaged phone be saved?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, in over 85% of cases! As long as the phone was not repeatedly powered on or charged while soaked, our ultrasonic cleaning and chip-level short removal frequently revive the logic board.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Why is putting a wet phone in rice bad?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Rice only absorbs surface moisture while trapping internal humidity. Even worse, rice powder forms a sticky corrosive paste on internal copper traces, causing permanent damage.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How much does water damage repair cost in Giridih?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Inspection and ultrasonic de-oxidation starts at ₹499. If specific ICs or power components require micro-soldering, we provide a transparent quote before proceeding.",
                  },
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: WaterDamageRepairPage,
});
