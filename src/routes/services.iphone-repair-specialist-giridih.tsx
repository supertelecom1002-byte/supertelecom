import { createFileRoute } from "@tanstack/react-router";
import { IphoneRepairPage } from "@/pages/services/IphoneRepair";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";

const PHONE = "+918002903643";
const PAGE_URL = `${SITE_URL}/services/iphone-repair-specialist-giridih`;
const TITLE = "iPhone Repair Specialist in Giridih | Screen, Battery, Back Glass | Super Telecom";
const DESCRIPTION =
  "Certified iPhone repair in Giridih. True Tone display calibration, battery health restoration, laser back glass separation & Face ID repair. Call +91 80029 03643.";

export const Route = createFileRoute("/services/iphone-repair-specialist-giridih")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "iphone repair giridih, apple repair centre giridih, iphone screen replacement giridih, iphone battery replacement giridih, iphone back glass laser repair barganda road",
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
              serviceType: "iPhone Repair & Restoration",
              name: "iPhone Repair Specialist in Giridih",
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
                lowPrice: "1499",
                highPrice: "14999",
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
                  name: "Will True Tone and Face ID work after iPhone screen replacement?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. We use JCID V1SE programmers to read and write original display EEPROM calibration data, preserving True Tone and automatic ambient brightness adjustment.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How is iPhone broken back glass repaired without damaging internal coils?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We use an automated blue laser back-glass separation machine that cleanly burns off adhesive without heating internal MagSafe coils, logic board, or cameras.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Will I get an 'Unknown Part' warning after battery replacement?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We can transfer your original battery BMS protection board using micro spot welding so iOS continues to report 100% battery health without warning flags.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Which iPhone models do you repair at your Giridih shop?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We repair all models from iPhone 11 up to iPhone 16 Pro Max, as well as older models like iPhone X, XR, and SE.",
                  },
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: IphoneRepairPage,
});
