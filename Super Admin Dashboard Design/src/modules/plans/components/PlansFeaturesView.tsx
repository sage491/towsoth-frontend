import { Check, Lock, X } from "lucide-react";
import { PanelHeader } from "../../../components/shared/PanelHeader";
import type { PlanFeatureMatrix, PlanItem } from "../types";
import type { PlanFeature } from "../types";

interface PlansFeaturesViewProps {
  plans: PlanItem[];
  features: PlanFeature[];
  featureMatrix: PlanFeatureMatrix;
  categories: string[];
  selectedPlanId: PlanItem["id"];
  editMode: boolean;
  onSelectPlan: (planId: PlanItem["id"]) => void;
  onToggleEditMode: () => void;
}

export function PlansFeaturesView({
  plans,
  features,
  featureMatrix,
  categories,
  selectedPlanId,
  editMode,
  onSelectPlan,
  onToggleEditMode,
}: PlansFeaturesViewProps) {
  return (
    <div className="flex-1 overflow-hidden bg-[#f5f6f8] flex">
      <div className="w-72 border-r border-[#d8dce2] flex flex-col bg-white">
        <div className="p-4 border-b border-[#e8eaed]">
          <h2 className="text-[#1f2937] mb-1">Plans</h2>
          <p className="text-[12px] text-[#6b7280]">Manage subscription tiers</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => onSelectPlan(plan.id)}
              className={`w-full p-4 border-b border-[#e8eaed] text-left hover:bg-[#f5f6f8] transition-colors ${
                selectedPlanId === plan.id ? "bg-[#f5f6f8] border-l-2 border-[#1e40af]" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[13px] text-[#1f2937] font-medium">{plan.name}</h3>
                <span className="text-[12px] text-[#6b7280]">{plan.price}</span>
              </div>
              <div className="text-[12px] text-[#6b7280]">{plan.institutions} institutions</div>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-[#e8eaed]">
          <button className="w-full py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium">
            Create New Plan
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <PanelHeader
          title="Feature Matrix"
          description="Configure feature availability across plans"
          actions={
            <button
              onClick={onToggleEditMode}
              className={`px-3 py-2 rounded text-[12px] transition-colors font-medium ${
                editMode
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-white border border-[#d8dce2] text-[#1f2937] hover:bg-[#f5f6f8]"
              }`}
            >
              {editMode ? "Save Changes" : "Edit Matrix"}
            </button>
          }
        />

        <div className="flex-1 overflow-auto bg-[#f5f6f8]">
          <div className="p-6">
            <div className="bg-white border border-[#e8eaed] rounded overflow-hidden">
              <div className="grid grid-cols-5 bg-[#fafbfc] border-b border-[#e8eaed]">
                <div className="p-3 text-[13px] text-[#1f2937] font-medium">Feature</div>
                {plans.map((plan) => (
                  <div key={plan.id} className="p-3 text-[13px] text-[#1f2937] font-medium text-center border-l border-[#e8eaed]">
                    {plan.name}
                  </div>
                ))}
              </div>

              {categories.map((category) => (
                <div key={category}>
                  <div className="bg-[#f5f6f8] px-3 py-2 border-b border-[#e8eaed]">
                    <span className="text-[11px] text-[#6b7280] uppercase tracking-wide font-medium">{category}</span>
                  </div>
                  {features
                    .filter((feature) => feature.category === category)
                    .map((feature) => (
                      <div key={feature.id} className="grid grid-cols-5 border-b border-[#e8eaed] hover:bg-[#fafbfc]">
                        <div className="p-3 text-[13px] text-[#1f2937]">{feature.name}</div>
                        {plans.map((plan) => {
                          const hasFeature = featureMatrix[plan.id].includes(feature.id);
                          const isLocked = !editMode && plan.id === "starter";

                          return (
                            <div key={plan.id} className="p-3 flex items-center justify-center border-l border-[#e8eaed]">
                              {editMode ? (
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" defaultChecked={hasFeature} className="sr-only peer" />
                                  <div className="w-9 h-5 bg-[#d1d5db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1e40af]" />
                                </label>
                              ) : (
                                <>
                                  {isLocked ? (
                                    <Lock className="w-3.5 h-3.5 text-[#d1d5db]" />
                                  ) : hasFeature ? (
                                    <Check className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <X className="w-4 h-4 text-[#d1d5db]" />
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
