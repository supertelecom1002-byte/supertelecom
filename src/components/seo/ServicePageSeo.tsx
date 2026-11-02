import React from "react";
import { SITE_URL } from "@/data/site";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";
import type { DedicatedServiceData } from "@/data/repairServicesSiloData";

interface ServicePageSeoProps {
  service: DedicatedServiceData;
}

export const ServicePageSeo: React.FC<ServicePageSeoProps> = ({ service }) => {
  const canonicalUrl = `${SITE_URL}/services/${service.slug}`;
  const ogImage = service.authenticVisual?.image || `${SITE_URL}/super-telecom-logo.png`;

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RepairShop",
        "@id": `${SITE_URL}/#store`,
        name: "Super Telecom",
        legalName: "Super Telecom Mobile Sales & Repair Laboratory",
        description:
          "Giridih's premier smartphone and iPhone repair laboratory with 10+ years experience, 45X optical stereo soldering workstations, zero-snooping DPDP 2027 compliance, and same-day service.",
        url: SITE_URL,
        telephone: BUSINESS_MASTER.phoneRaw,
        image: `${SITE_URL}/super-telecom-logo.png`,
        priceRange: "₹₹",
        hasMap: BUSINESS_MASTER.mapsUrl,
        address: {
          "@type": "PostalAddress",
          streetAddress: BUSINESS_MASTER.streetAddress,
          addressLocality: BUSINESS_MASTER.city,
          addressRegion: BUSINESS_MASTER.state,
          postalCode: BUSINESS_MASTER.postalCode,
          addressCountry: BUSINESS_MASTER.countryCode,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: BUSINESS_MASTER.coordinates.latitude,
          longitude: BUSINESS_MASTER.coordinates.longitude,
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
      },
      {
        "@type": "Service",
        "@id": `${canonicalUrl}#service`,
        serviceType: service.title,
        name: `${service.title} in Giridih`,
        alternateName: service.hindiTitle,
        description: service.heroSummary,
        provider: {
          "@id": `${SITE_URL}/#store`,
        },
        areaServed: service.localAreasServed.map((area) => ({
          "@type": "Place",
          name: `${area}, Giridih`,
        })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${service.title} Brand Packages`,
          itemListElement: service.brandPricingTable.map((item, idx) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: `${item.category} — ${service.title}`,
              description: `Models: ${item.modelsExample}. Estimated time: ${item.turnaroundTime}. ${item.warranty}.`,
            },
            price: item.startingPrice,
            priceCurrency: "INR",
            priceRange: item.priceRange,
            availability: "https://schema.org/InStock",
            url: canonicalUrl,
            position: idx + 1,
          })),
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: service.startingPrice,
          priceRange: service.priceRangeInr,
          availability: "https://schema.org/InStock",
          url: canonicalUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Repair Services",
            item: `${SITE_URL}/services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: service.faqs.map((faq) => ({
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
    />
  );
};

export default ServicePageSeo;
