import { PlansFeaturesView } from "../components/PlansFeaturesView";
import { usePlansFeatures } from "../hooks/usePlansFeatures";

export function PlansFeaturesContainer() {
  const { plans, features, featureMatrix, categories, selectedPlan, editMode, setSelectedPlanId, setEditMode } = usePlansFeatures();

  return (
    <PlansFeaturesView
      plans={plans}
      features={features}
      featureMatrix={featureMatrix}
      categories={categories}
      selectedPlanId={selectedPlan.id}
      editMode={editMode}
      onSelectPlan={setSelectedPlanId}
      onToggleEditMode={() => setEditMode((prev) => !prev)}
    />
  );
}
