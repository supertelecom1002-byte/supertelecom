import { createFileRoute } from "@tanstack/react-router";
import { DisplayReplacementPage } from "@/pages/services/DisplayReplacement";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";

const PHONE = "+918002903643";
const PAGE_URL = `${SITE_URL}/services/display-replacement-giridih`;
const TITLE = "Mobile Screen & Display Replacement in Giridih | Super Telecom";
const DESCRIPTION =
  "Instant mobile screen & display replacement in Giridih. Original OLED, AMOLED & LCD screens for iPhone, Samsung, Vivo, Realme with 90-day warranty. Done in 30 mins.";

export const Route = createFileRoute("/services/display-replacement-giridih")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "mobile screen replacement giridih, display repair giridih, iphone screen repair giridih, amoled display giridih, broken phone screen repair barganda road",
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
              serviceType: "Mobile Screen & Display Replacement",
              name: "Mobile Screen & Display Replacement in Giridih",
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
                lowPrice: "1199",
                highPrice: "7999",
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
                  name: "How long does mobile screen replacement take at Super Telecom?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Most screen replacements for iPhone, Samsung, Realme, and Vivo take just 30 to 45 minutes while you wait in our Barganda Road shop.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Will my fingerprint scanner and Face ID work after screen change?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. We take special care to calibrate optical in-display fingerprint sensors and protect the Face ID ear-speaker flex sensors during disassembly.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is the warranty period on replacement screens?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We provide up to a 90-day warranty on touchscreen functionality and display quality. If any unexpected touch freeze occurs, we resolve it without hassle.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is my data safe during display repair?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, 100%. Screen replacement is a hardware-only service and never wipes your photos, messages, or apps.",
                  },
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: DisplayReplacementPage,
});
