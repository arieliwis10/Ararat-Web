import { SITE } from '@/config/site';

/** Datos estructurados schema.org (JSON-LD) para SEO local. */

const businessId = `${SITE.url}/#negocio`;

export function localBusinessSchema() {
  const a = SITE.address;
  const sameAs = Object.values(SITE.social).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': businessId,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.contact.phoneDisplay.replace(/\s/g, ''),
    email: SITE.contact.email,
    image: `${SITE.url}/og-default.jpg`,
    logo: `${SITE.url}/favicon.svg`,
    address: {
      '@type': 'PostalAddress',
      ...(a.street && { streetAddress: a.street }),
      addressLocality: a.city,
      addressRegion: a.region,
      ...(a.postalCode && { postalCode: a.postalCode }),
      addressCountry: a.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: a.lat, longitude: a.lng },
    ...(a.mapsUrl && { hasMap: a.mapsUrl }),
    areaServed: SITE.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: SITE.hours.opens,
        closes: SITE.hours.closes,
      },
    ],
    ...(sameAs.length && { sameAs }),
  };
}

export function serviceSchema(s: { title: string; description: string; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.title,
    description: s.description,
    url: `${SITE.url}/servicios/${s.slug}/`,
    provider: { '@id': businessId },
    areaServed: SITE.areaServed,
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}
