import { createFileRoute } from "@tanstack/react-router";
import { MotherboardRepairPage } from "@/pages/services/MotherboardRepair";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";

const PHONE = "+918002903643";
const PAGE_URL = `${SITE_URL}/services/motherboard-chip-level-repair-giridih`;
const TITLE = "Motherboard & IC Chip-Level Mobile Repair in Giridih | Super Telecom";
const DESCRIPTION =
  "Expert chip-level motherboard repair in Giridih. BGA micro-soldering, CPU reballing, power IC replacement, water damage & dead phone revival. High success rate.";

export const Route = createFileRoute("/services/motherboard-chip-level-repair-giridih")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "motherboard repair giridih, chip level repair giridih, dead mobile repair giridih, bga reballing giridih, power ic short circuit repair giridih",
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
              serviceType: "Motherboard Chip-Level Micro-Soldering",
              name: "Motherboard & IC Chip-Level Mobile Repair in Giridih",
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
                lowPrice: "799",
                highPrice: "4499",
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
                  name: "Can a dead phone declared 'unrepairable' by other shops be fixed?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, in over 85% of cases. Most service centers only swap entire expensive motherboards. We isolate microscopic faulty resistors, blown capacitors, or corrupted power ICs using thermal cameras and micro-soldering.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What should I do immediately after dropping my phone in water?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Power off the phone immediately! Do NOT plug in a charger, and do not put it in rice. Bring it to our shop right away for chemical PCB bath and ultrasonic oxidation clearing.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Will my data be preserved during motherboard IC repair?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "In most hardware shorts (PMIC, charging IC, audio codec), user data remains completely intact on the UFS/eMMC chip. We prioritize data preservation above all else.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How much does motherboard repair cost compared to full board replacement?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Motherboard chip-level micro-soldering typically costs between ₹799 and ₹2,499, which is 60-80% cheaper than buying a brand-new motherboard from an authorized center.",
                  },
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: MotherboardRepairPage,
});
