import { useEffect } from "react";
import { useEntity } from "../hooks/useEntity";
import { userAcquisitionEntityConfig, marketingMetricEntityConfig } from "../entities";

type UserAcquisition = {
  id: number;
  userId: string;
  signupDate: string;
  source: string;
  campaign: string;
  referrerId: string;
  landingPage: string;
  tier: string;
  converted: string;
  conversionDate: string;
  lifetimeValue: number;
  created_at: string;
  updated_at: string;
};

type MarketingMetric = {
  id: number;
  date: string;
  metricType: string;
  source: string;
  value: number;
  metadata: string;
  userId: string;
  campaignId: string;
  created_at: string;
  updated_at: string;
};

export function useAcquisitionTracking() {
  const { create: createAcquisition } = useEntity<UserAcquisition>(userAcquisitionEntityConfig);
  const { create: createMetric } = useEntity<MarketingMetric>(marketingMetricEntityConfig);

  const trackSignup = async (userId: string, source: string, referrerId?: string) => {
    const today = new Date().toISOString().split("T")[0];
    
    await createAcquisition({
      userId,
      signupDate: today,
      source: source as "organic" | "social_twitter" | "social_linkedin" | "referral" | "direct" | "email" | "paid_search" | "paid_social",
      campaign: "",
      referrerId: referrerId || "",
      landingPage: window.location.pathname,
      tier: "free",
      converted: "false",
      conversionDate: "",
      lifetimeValue: 0,
    });

    await createMetric({
      date: today,
      metricType: "signup",
      source,
      value: 1,
      metadata: JSON.stringify({ referrerId, landingPage: window.location.pathname }),
      userId,
      campaignId: "",
    });
  };

  const trackConversion = async (userId: string, tier: string, amount: number) => {
    const today = new Date().toISOString().split("T")[0];
    
    await createMetric({
      date: today,
      metricType: "conversion",
      source: "direct",
      value: amount,
      metadata: JSON.stringify({ tier }),
      userId,
      campaignId: "",
    });
  };

  return { trackSignup, trackConversion };
}
