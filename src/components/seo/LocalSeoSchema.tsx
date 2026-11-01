import React from "react";
import { SITE_URL } from "@/data/site";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";

export const GIRIDIH_LOCALITIES = [
  "Barganda Road",
  "Near Shivam Clinic",
  "Tower Chowk",
  "Bada Chowk",
  "Makatpur",
  "Pachamba",
  "Station Road",
  "Beniadih",
  "Sirsia",
  "Dumri",
  "Jamua",
] as const;

export const LOCAL_SERVICES_OFFERINGS = [
  {
    name: "120Hz AMOLED & LCD Display Replacement Giridih",
    description: "Shattered or blank screen repair, green line laser recovery, and OCA glass lamination for iPhone, Samsung, OnePlus & Xiaomi in 30–60 minutes.",
    minPrice: "899",
    maxPrice: "14999",
    url: `${SITE_URL}/services/display-replacement-giridih`,
  },
  {
    name: "Motherboard IC Micro-Soldering & CPU Reballing Giridih",
    description: "Chip-level BGA rework, Poco/OnePlus CPU reballing, PMIC short-circuit resolution, and dead phone recovery on 45x stereo optical bench.",
    minPrice: "799",
    maxPrice: "4500",
    url: `${SITE_URL}/services/motherboard-chip-level-repair-giridih`,
  },
  {
    name: "Original Phone Battery Replacement Giridih",
    description: "High-backup Li-ion/Li-Po battery installation with 6-month warranty. Solves rapid battery drain, sudden 40% drops, and swelling.",
    minPrice: "499",
    maxPrice: "2499",
    url: `${SITE_URL}/services/battery-charging-port-repair-giridih`,
  },
  {
    name: "Type-C & Lightning Charging Port Repair Giridih",
    description: "Loose charging port swap, slow charging fix, moisture warning bypass, and MEMS microphone repair in 30 minutes.",
    minPrice: "299",
    maxPrice: "1499",
    url: `${SITE_URL}/services/battery-charging-port-repair-giridih`,
  },
  {
    name: "iPhone Repair Specialist Lab Giridih",
    description: "Apple iPhone cracked screen, FaceID calibration, battery health notification sync, and audio IC repairs on Barganda Road.",
    minPrice: "999",
    maxPrice: "12999",
    url: `${SITE_URL}/services/iphone-repair-specialist-giridih`,
  },
  {
    name: "Water Damage Ultrasonic Chemical Decontamination",
    description: "Emergency ultrasonic PCB washing, liquid corrosion removal, and trace revival for phones dropped in water.",
    minPrice: "499",
    maxPrice: "2500",
    url: `${SITE_URL}/services/water-damage-mobile-repair-giridih`,
  },
];

export const LOCAL_SEO_FAQS = [
  {
    question: "Which is the #1 mobile repair shop in Giridih for same-day display replacement?",
    answer: "Super Telecom on Barganda Road (Near Shivam Clinic, Giridih) is the highest-rated mobile repair laboratory in Giridih with a 4.9/5 star Google rating from 1,200+ verified customers. We provide same-day 30-to-60 minute display replacement with up to 90 days warranty.",
  },
  {
    question: "Do you repair dead phones and motherboard IC issues in Giridih?",
    answer: "Yes, Super Telecom has an advanced in-house chip-level micro-soldering bench equipped with trinocular 45x microscopes, infrared BGA rework stations, and thermal cameras. We specialize in double-decker CPU reballing, power IC (PMIC) replacement, and short-circuit isolation.",
  },
  {
    question: "Is customer data safe during mobile repair at Super Telecom Giridih?",
    answer: "Yes, 100%. Super Telecom strictly complies with the Digital Personal Data Protection (DPDP) Act 2027 and maintains a Zero-Snooping Workshop Pledge. Passcodes are never required for hardware repairs (screens, batteries, charging ports), and customer photo galleries, chats, or files are never accessed.",
  },
  {
    question: "Where is Super Telecom located in Giridih?",
    answer: "Super Telecom is located at Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301. We are easily accessible from Tower Chowk, Bada Chowk, Makatpur, Pachamba, and Station Road. Call +91 80029 03643 or WhatsApp for instant assistance.",
  },
];

export function getCombinedLocalSeoSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["MobilePhoneStore", "RepairShop", "LocalBusiness"],
        "@id": `${SITE_URL}/#business`,
        name: "Super Telecom",
        alternateName: [
          "Super Telecom Giridih",
          "Super Telecom Mobile Repairing Centre",
          "Super Telecom Chip-Level Hardware Lab",
        ],
        url: `${SITE_URL}/`,
        telephone: "+918002903643",
        email: "supertelecom1002@gmail.com",
        image: `${SITE_URL}/favicon.png`,
        logo: `${SITE_URL}/favicon.png`,
        priceRange: "₹₹ (₹299 - ₹14,999)",
        currenciesAccepted: "INR",
        paymentAccepted: "Cash, UPI (PhonePe/GPay/Paytm), Debit Card, Credit Card, Net Banking",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Barganda Road, Near Shivam Clinic",
          addressLocality: "Giridih",
          addressRegion: "Jharkhand",
          postalCode: "815301",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 24.1802958,
          longitude: 86.2974917,
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
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "1240",
          bestRating: "5",
          worstRating: "1",
        },
        areaServed: GIRIDIH_LOCALITIES.map((locality) => ({
          "@type": "AdministrativeArea",
          name: `${locality}, Giridih`,
        })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Super Telecom Smartphone Repair Services Catalog",
          itemListElement: LOCAL_SERVICES_OFFERINGS.map((offer) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: offer.name,
              description: offer.description,
              url: offer.url,
            },
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "INR",
              minPrice: offer.minPrice,
              maxPrice: offer.maxPrice,
            },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#local-faqs`,
        mainEntity: LOCAL_SEO_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}

export const LocalSeoSchema: React.FC = () => {
  const schemaData = getCombinedLocalSeoSchema();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default LocalSeoSchema;
