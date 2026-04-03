export interface PlanItem {
  id: "starter" | "pro" | "enterprise" | "custom";
  name: string;
  price: string;
  institutions: number;
}

export interface PlanFeature {
  id: string;
  name: string;
  category: string;
}

export type PlanFeatureMatrix = Record<PlanItem["id"], string[]>;
