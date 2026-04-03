import type { PlanFeature, PlanFeatureMatrix, PlanItem } from "../types";

export const PLANS: PlanItem[] = [
  { id: "starter", name: "Starter", price: "$499/mo", institutions: 234 },
  { id: "pro", name: "Pro", price: "$1,499/mo", institutions: 512 },
  { id: "enterprise", name: "Enterprise", price: "$4,999/mo", institutions: 421 },
  { id: "custom", name: "Custom", price: "Variable", institutions: 80 },
];

export const PLAN_FEATURES: PlanFeature[] = [
  { id: "ai-tutoring", name: "AI Tutoring", category: "AI Features" },
  { id: "ai-assessment", name: "AI Assessment Generation", category: "AI Features" },
  { id: "ai-analytics", name: "AI-Powered Analytics", category: "AI Features" },
  { id: "custom-models", name: "Custom AI Models", category: "AI Features" },
  { id: "basic-analytics", name: "Basic Analytics", category: "Analytics" },
  { id: "advanced-analytics", name: "Advanced Analytics", category: "Analytics" },
  { id: "predictive-analytics", name: "Predictive Analytics", category: "Analytics" },
  { id: "custom-reports", name: "Custom Reports", category: "Analytics" },
  { id: "sso", name: "Single Sign-On", category: "Security" },
  { id: "2fa", name: "Two-Factor Auth", category: "Security" },
  { id: "audit-logs", name: "Audit Logs", category: "Security" },
  { id: "data-encryption", name: "Data Encryption", category: "Security" },
  { id: "api-access", name: "API Access", category: "Integration" },
  { id: "webhooks", name: "Webhooks", category: "Integration" },
  { id: "custom-integration", name: "Custom Integration", category: "Integration" },
];

export const PLAN_FEATURE_MATRIX: PlanFeatureMatrix = {
  starter: ["ai-tutoring", "basic-analytics", "2fa", "api-access"],
  pro: ["ai-tutoring", "ai-assessment", "basic-analytics", "advanced-analytics", "sso", "2fa", "audit-logs", "api-access", "webhooks"],
  enterprise: ["ai-tutoring", "ai-assessment", "ai-analytics", "basic-analytics", "advanced-analytics", "predictive-analytics", "custom-reports", "sso", "2fa", "audit-logs", "data-encryption", "api-access", "webhooks", "custom-integration"],
  custom: ["ai-tutoring", "ai-assessment", "ai-analytics", "custom-models", "basic-analytics", "advanced-analytics", "predictive-analytics", "custom-reports", "sso", "2fa", "audit-logs", "data-encryption", "api-access", "webhooks", "custom-integration"],
};

export function getPlanFeatureCategories(features: PlanFeature[]): string[] {
  return Array.from(new Set(features.map((feature) => feature.category)));
}
