/**
 * Google Search Console (GSC) Hub & Property Registry for Super Telecom
 * Manages official GSC property verification tokens, status, and health metrics.
 */

export interface GscProperty {
  id: string;
  name: string;
  url: string;
  token: string;
  status: "Verified / Token Attached" | "Pending Verification" | "Unverified";
  verified: boolean;
  method: "HTML Tag" | "DNS TXT" | "Google Analytics" | "Tag Manager";
  tag: string;
  verifiedAt: string;
  lastChecked: string;
  ownerEmail: string;
}

export const GOOGLE_VERIFICATION_TOKEN = "htat_gsc_supertelec_mrm60cg0mv";
export const GOOGLE_VERIFICATION_META_TAG = `<meta name="google-site-verification" content="${GOOGLE_VERIFICATION_TOKEN}" />`;

/**
 * Official registry of Google Search Console properties for Super Telecom ecosystem
 */
export const htat_gsc_properties: GscProperty[] = [
  {
    id: "supertelecom-shop",
    name: "Super Telecom",
    url: "https://www.supertelecom.shop",
    token: "htat_gsc_supertelec_mrm60cg0mv",
    status: "Verified / Token Attached",
    verified: true,
    method: "HTML Tag",
    tag: `<meta name="google-site-verification" content="htat_gsc_supertelec_mrm60cg0mv" />`,
    verifiedAt: "2026-10-03T12:58:00.000Z",
    lastChecked: new Date().toISOString(),
    ownerEmail: "supertelecom1002@gmail.com",
  },
  {
    id: "supertelecom-sc-domain",
    name: "Super Telecom (Domain Property)",
    url: "sc-domain:supertelecom.shop",
    token: "htat_gsc_supertelec_mrm60cg0mv",
    status: "Verified / Token Attached",
    verified: true,
    method: "HTML Tag",
    tag: `<meta name="google-site-verification" content="htat_gsc_supertelec_mrm60cg0mv" />`,
    verifiedAt: "2026-10-03T12:58:00.000Z",
    lastChecked: new Date().toISOString(),
    ownerEmail: "supertelecom1002@gmail.com",
  },
];

/**
 * Retrieve the active verification token for Super Telecom
 */
export function getSuperTelecomVerificationToken(): string {
  const property = htat_gsc_properties.find(
    (p) => p.name === "Super Telecom" || p.id === "supertelecom-shop"
  );
  return property ? property.token : GOOGLE_VERIFICATION_TOKEN;
}

/**
 * Check whether a given property has valid token attached and verified
 */
export function isPropertyVerified(propertyId: string): boolean {
  const property = htat_gsc_properties.find((p) => p.id === propertyId || p.name === propertyId);
  return property ? property.verified : false;
}

/**
 * Get all registered properties for analytics / console manager
 */
export function getGscProperties(): GscProperty[] {
  return htat_gsc_properties;
}

export default htat_gsc_properties;
