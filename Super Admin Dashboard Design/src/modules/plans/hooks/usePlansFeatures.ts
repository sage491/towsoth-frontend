import { useMemo, useState } from "react";
import { PLAN_FEATURE_MATRIX, PLAN_FEATURES, PLANS, getPlanFeatureCategories } from "../services/plansService";

export function usePlansFeatures() {
  const [selectedPlanId, setSelectedPlanId] = useState(PLANS[0].id);
  const [editMode, setEditMode] = useState(false);

  const selectedPlan = useMemo(() => {
    return PLANS.find((plan) => plan.id === selectedPlanId) ?? PLANS[0];
  }, [selectedPlanId]);

  const categories = useMemo(() => {
    return getPlanFeatureCategories(PLAN_FEATURES);
  }, []);

  return {
    plans: PLANS,
    features: PLAN_FEATURES,
    featureMatrix: PLAN_FEATURE_MATRIX,
    categories,
    selectedPlan,
    editMode,
    setSelectedPlanId,
    setEditMode,
  };
}
