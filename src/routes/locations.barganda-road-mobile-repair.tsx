import { createFileRoute } from "@tanstack/react-router";
import { BargandaRoadPage } from "@/pages/locations/BargandaRoad";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";

const PHONE = "+918002903643";
const PAGE_URL = `${SITE_URL}/locations/barganda-road-mobile-repair`;
const TITLE = "Top Mobile Repair Shop in Barganda Road Giridih | Super Telecom";
const DESCRIPTION =
  "Visit Super Telecom on Barganda Road, Near Shivam Clinic, Giridih. Fast screen repair, iPhone service, motherboard micro-soldering & battery replacement. Call +91 80029 03643.";

export const Route = createFileRoute("/locations/barganda-road-mobile-repair")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "mobile repair barganda road giridih, mobile shop near shivam clinic giridih, phone repair giridih jharkhand, super telecom giridih, iphone repair barganda road",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "business.business" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:site_name", content: "Super Telecom" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "geo.region", content: "IN-JH" },
      { name: "geo.placename", content: "Giridih" },
      { name: "geo.position", content: "24.1856;86.3075" },
      { name: "ICBM", content: "24.1856, 86.3075" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": ["MobilePhoneRepairShop", "LocalBusiness"],
              "@id": `${PAGE_URL}#localbusiness`,
              name: "Super Telecom - Barganda Road Giridih",
              url: PAGE_URL,
              telephone: PHONE,
              email: "supertelecom1002@gmail.com",
              priceRange: "₹₹",
              image: `${SITE_URL}/favicon.png`,
              address: {
                "@type": "PostalAddress",
                streetAddress: STORE_STREET_ADDRESS,
                addressLocality: "Giridih",
                addressRegion: "Jharkhand",
                postalCode: "815301",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 24.1856,
                longitude: 86.3075,
              },
              hasMap: "https://maps.app.goo.gl/mu5XXCehEpocaZWY9",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ],
                  opens: "10:00",
                  closes: "21:30",
                },
              ],
              areaServed: [
                { "@type": "AdministrativeArea", name: "Barganda, Giridih" },
                { "@type": "AdministrativeArea", name: "Makatpur, Giridih" },
                { "@type": "AdministrativeArea", name: "Pachamba, Giridih" },
                { "@type": "AdministrativeArea", name: "Bada Chowk, Giridih" },
                { "@type": "AdministrativeArea", name: "Court Road, Giridih" },
                { "@type": "AdministrativeArea", name: "Giridih District, Jharkhand" },
              ],
            },
            {
              "@type": "FAQPage",
              "@id": `${PAGE_URL}#faq`,
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Where exactly is Super Telecom on Barganda Road?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We are situated on main Barganda Road, right near Shivam Clinic in Giridih (PIN: 815301). Our shop features prominent signage and is located approximately 1 km from Makatpur Chowk.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do I need an appointment before visiting?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No appointment is necessary! We welcome walk-in customers every day from 10:00 AM to 9:30 PM. Screen replacements, batteries, and port repairs are handled on the spot while you wait.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is parking available near the store?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, there is convenient dedicated two-wheeler parking directly outside our shop front as well as easy pull-over space on Barganda Road for car drop-offs.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Which mobile phone brands do you service?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We repair all brands including Apple iPhone, Samsung Galaxy, OnePlus, Xiaomi Redmi, Realme, Vivo, Oppo, Motorola, Poco, and Google Pixel.",
                  },
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: BargandaRoadPage,
});
