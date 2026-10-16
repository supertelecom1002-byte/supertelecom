import { BUSINESS_MASTER } from "./superTelecomConfig";

/**
 * Super Telecom Legal & Workshop Policies Configuration
 * Controls legal clauses, liability guidelines, and unclaimed device policies.
 */
export interface LegalPolicyConfig {
  unclaimedDevicePolicy: {
    /**
     * Flag indicating if owner/legal sign-off has confirmed storage fee and disposal policies.
     * When false, the site displays a neutral, customer-centric job-sheet policy.
     */
    isOwnerAndLegallyConfirmed: boolean;
    pickupWindowDays: number;
    dailyStorageFeeInr: number;
    disposalWindowDays: number;
    neutralStatement: string;
    confirmedStatement: string;
  };
  warrantySummary: {
    defaultDays: number;
    termsUrl: string;
    warrantyUrl: string;
  };
}

export const LEGAL_POLICY_CONFIG: LegalPolicyConfig = {
  unclaimedDevicePolicy: {
    isOwnerAndLegallyConfirmed: false,
    pickupWindowDays: 45,
    dailyStorageFeeInr: 20,
    disposalWindowDays: 90,
    neutralStatement:
      "Customers are kindly requested to collect their repaired devices within 45 days of service completion notification. In accordance with standard workshop practice, repair jobs not collected within 45 days will be safely held in our secure inventory; please contact our lab desk with your Job Sheet ID if an extension or courier dispatch is required.",
    confirmedStatement:
      "Devices remaining unclaimed after 45 days may incur a nominal storage fee of ₹20/day. Devices left unclaimed beyond 90 days without prior written arrangement may be recycled or safely disposed of to defray bench part expenses in accordance with local commercial trade regulations.",
  },
  warrantySummary: {
    defaultDays: 90,
    termsUrl: "/terms",
    warrantyUrl: "/warranty",
  },
};
