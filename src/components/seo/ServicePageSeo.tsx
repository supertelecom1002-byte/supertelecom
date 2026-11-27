import React from "react";
import { SITE_URL } from "@/data/site";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";
import type { DedicatedServiceData } from "@/data/repairServicesSiloData";

interface ServicePageSeoProps {
  service: DedicatedServiceData;
}

export function getServiceSchemaGraph(service: DedicatedServiceData) {
  const canonicalUrl = `${SITE_URL}/services/${service.slug}`;
  const rawImage = service.authenticVisual?.image || "/logo.webp";
  const ogImage = rawImage.startsWith("http") ? rawImage : `${SITE_URL}${rawImage}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RepairShop",
        "@id": `${SITE_URL}/#store`,
        name: "Super Telecom",
        legalName: "Super Telecom Mobile Sales & Repair Laboratory",
        description:
          "Best & most affordable mobile repair in Giridih — budget to flagship iPhone & Android repair lab on Barganda Road with lowest honest rates, genuine parts, 45X optical stereo soldering workstations & same-day service.",
        url: SITE_URL,
        telephone: BUSINESS_MASTER.phoneRaw,
        image: `${SITE_URL}/logo.webp`,
        priceRange: "Affordable & Best Market Value",
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
            description: "Lowest honest price in Giridih with genuine quality parts and free inspection",
            availability: "https://schema.org/InStock",
            url: canonicalUrl,
            position: idx + 1,
            itemOffered: {
              "@type": "Service",
              name: `${item.category} — ${service.title}`,
              description: `Models: ${item.modelsExample}. Estimated time: ${item.turnaroundTime}. ${item.warranty}. Lowest honest market rate after free inspection.`,
            },
          })),
        },
        offers: {
          "@type": "Offer",
          description: "Lowest honest price in Giridih with genuine quality parts and free inspection",
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
}

export const ServicePageSeo: React.FC<ServicePageSeoProps> = ({ service }) => {
  const schemaGraph = getServiceSchemaGraph(service);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
    />
  );
};

export default ServicePageSeo;
