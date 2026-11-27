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
    description: "Lowest honest price in Giridih with genuine quality parts and free inspection for shattered screens, green line laser recovery, and OCA glass lamination (iPhone, Samsung, OnePlus, Xiaomi, Vivo, Realme) in 30–60 minutes.",
    url: `${SITE_URL}/services/screen-display-replacement`,
  },
  {
    name: "Motherboard IC Micro-Soldering & CPU Reballing Giridih",
    description: "Lowest honest price in Giridih with genuine quality parts and free inspection for chip-level BGA rework, Poco/OnePlus CPU reballing, PMIC short-circuit resolution, and dead phone recovery.",
    url: `${SITE_URL}/services/motherboard-ic-repair`,
  },
  {
    name: "Original Phone Battery Replacement Giridih",
    description: "Lowest honest price in Giridih with genuine quality zero-cycle batteries and free inspection (up to 90 days warranty) for fast drain and swelling.",
    url: `${SITE_URL}/services/battery-replacement`,
  },
  {
    name: "Type-C & Lightning Charging Port Repair Giridih",
    description: "Lowest honest price in Giridih with genuine quality parts and free inspection for loose charging ports, slow charging fixes, and MEMS microphones in 25–45 minutes.",
    url: `${SITE_URL}/services/charging-port-repair`,
  },
  {
    name: "AMOLED Green Line & Pink Line Screen Fix Giridih",
    description: "Lowest honest price in Giridih with genuine quality laser flex bonding & rework — save up to 70% vs whole screen swap, with free inspection.",
    url: `${SITE_URL}/services/green-line-display-fix`,
  },
  {
    name: "iPhone & Flagship Back Glass Laser Repair Giridih",
    description: "Lowest honest price in Giridih with genuine quality computerized laser separation and free inspection for iPhone & flagship back glass.",
    url: `${SITE_URL}/services/iphone-back-glass-repair`,
  },
  {
    name: "Dead Phone & Water Damage Ultrasonic Revival Giridih",
    description: "Lowest honest price in Giridih with genuine ultrasonic PCB decontamination, liquid corrosion removal, and free inspection.",
    url: `${SITE_URL}/services/water-damage-revival`,
  },
];

export const LOCAL_SEO_FAQS = [
  {
    question: "Which is the recommended mobile repair shop in Giridih for same-day display replacement?",
    answer: "Super Telecom on Barganda Road (Near Shivam Clinic, Giridih) is a trusted, dedicated smartphone and chip-level repair lab in Giridih. We provide fast display replacement with warranty, expert motherboard diagnosis, and transparent component-level servicing.",
  },
  {
    question: "Do you repair dead phones and motherboard IC issues in Giridih?",
    answer: "Yes, Super Telecom has an advanced in-house chip-level micro-soldering bench equipped with trinocular 45x microscopes, infrared BGA rework stations, and thermal cameras. We specialize in double-decker CPU reballing, power IC (PMIC) replacement, and short-circuit isolation.",
  },
  {
    question: "Is customer data safe during mobile repair at Super Telecom Giridih?",
    answer: "Yes. Super Telecom adheres to the Digital Personal Data Protection (DPDP) Act 2027 standards with a strict Zero-Snooping workshop policy. Customer device passcodes are not required for hardware repairs (screens, batteries, charging ports), and personal files and photos remain completely private.",
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
        priceRange: "Affordable & Best Market Value",
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
          latitude: BUSINESS_MASTER.coordinates.latitude,
          longitude: BUSINESS_MASTER.coordinates.longitude,
        },
        hasMap: "https://maps.app.goo.gl/mu5XXCehEpocaZWY9",
        sameAs: [
          "https://maps.app.goo.gl/mu5XXCehEpocaZWY9",
          "https://en.wikipedia.org/wiki/Giridih",
          "https://www.wikidata.org/wiki/Q1190627",
          "https://wa.me/918002903643"
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "482",
          bestRating: "5",
          worstRating: "1",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".service-answer-block", "#local-faqs"]
        },
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
        areaServed: GIRIDIH_LOCALITIES.map((locality) => ({
          "@type": "AdministrativeArea",
          name: `${locality}, Giridih`,
        })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Super Telecom Smartphone Repair Services Catalog",
          itemListElement: LOCAL_SERVICES_OFFERINGS.map((offer) => ({
            "@type": "Offer",
            description: "Lowest honest price in Giridih with genuine quality parts and free inspection",
            availability: "https://schema.org/InStock",
            url: offer.url,
            itemOffered: {
              "@type": "Service",
              name: offer.name,
              description: offer.description,
              url: offer.url,
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
