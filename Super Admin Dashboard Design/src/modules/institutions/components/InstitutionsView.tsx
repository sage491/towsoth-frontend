import { Search, Filter, CheckCircle2, AlertCircle, Pause, Play, Trash2, Plus } from "lucide-react";
import { AddInstitutionWizard } from "../../../components/AddInstitutionWizard";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { MetricCard } from "../../../components/shared/MetricCard";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import type { Institution, Plan } from "../../../types/domain";
import type { InstitutionsFeature, InstitutionsTab, InstitutionsTabId } from "../types";

interface InstitutionsViewProps {
  plans: Plan[];
  filteredInstitutions: Institution[];
  currentInstitution: Institution;
  activeTab: InstitutionsTabId;
  searchTerm: string;
  planFilter: string;
  selectedPlanId: number | null;
  showSuspendModal: boolean;
  showResumeModal: boolean;
  showArchiveModal: boolean;
  showPlanChangeModal: boolean;
  showAddWizard: boolean;
  tabs: InstitutionsTab[];
  allFeatures: InstitutionsFeature[];
  setSelectedInstitutionId: (institutionId: number) => void;
  setActiveTab: (value: InstitutionsTabId) => void;
  setSearchTerm: (value: string) => void;
  setPlanFilter: (value: string) => void;
  setShowSuspendModal: (value: boolean) => void;
  setShowResumeModal: (value: boolean) => void;
  setShowArchiveModal: (value: boolean) => void;
  setShowPlanChangeModal: (value: boolean) => void;
  setShowAddWizard: (value: boolean) => void;
  setSelectedPlanId: (value: number | null) => void;
  handleSuspend: () => void;
  handleResume: () => void;
  handleArchive: () => void;
  handlePlanChange: () => void;
  handleFeatureToggle: (feature: string) => void;
}

export function InstitutionsView({
  plans,
  filteredInstitutions,
  currentInstitution,
  activeTab,
  searchTerm,
  planFilter,
  selectedPlanId,
  showSuspendModal,
  showResumeModal,
  showArchiveModal,
  showPlanChangeModal,
  showAddWizard,
  tabs,
  allFeatures,
  setSelectedInstitutionId,
  setActiveTab,
  setSearchTerm,
  setPlanFilter,
  setShowSuspendModal,
  setShowResumeModal,
  setShowArchiveModal,
  setShowPlanChangeModal,
  setShowAddWizard,
  setSelectedPlanId,
  handleSuspend,
  handleResume,
  handleArchive,
  handlePlanChange,
  handleFeatureToggle,
}: InstitutionsViewProps) {
  return (
    <div className="flex-1 overflow-hidden bg-[#f5f6f8] flex">
      <div className="w-80 border-r border-[#d8dce2] flex flex-col bg-white">
        <div className="p-4 border-b border-[#e8eaed]">
          <button
            onClick={() => setShowAddWizard(true)}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium mb-3"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Institution
          </button>
        </div>

        <div className="p-4 border-b border-[#e8eaed] space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search institutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#d8dce2] rounded pl-9 pr-3 py-2 text-[13px] text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-[#d8dce2] rounded px-3 py-2 text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="flex-1 bg-white border border-[#d8dce2] rounded px-3 py-2 text-[12px] text-[#1f2937]"
            >
              <option value="all">All Plans</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Pro">Pro</option>
              <option value="Starter">Starter</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredInstitutions.length === 0 && (
            <div className="p-4 text-[12px] text-[#6b7280]">No institutions match your filters.</div>
          )}
          {filteredInstitutions.map((institution) => (
            <button
              key={institution.id}
              onClick={() => setSelectedInstitutionId(institution.id)}
              className={`w-full p-4 border-b border-[#e8eaed] text-left hover:bg-[#f5f6f8] transition-colors ${
                currentInstitution.id === institution.id ? "bg-[#f5f6f8] border-l-2 border-[#1e40af]" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <h3 className="text-[13px] text-[#1f2937] font-medium leading-tight">{institution.name}</h3>
                {institution.status === "active" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                ) : institution.status === "suspended" ? (
                  <Pause className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-[#9ca3af] flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#6b7280]">
                <span className="px-2 py-0.5 bg-[#f5f6f8] rounded text-[#1f2937] font-medium">{institution.plan}</span>
                <span>{institution.activeUsers.toLocaleString()} users</span>
              </div>
              <div className="text-[11px] text-[#9ca3af] mt-1">{institution.country}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#e8eaed] bg-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-[#1f2937]">{currentInstitution.name}</h1>
                <StatusBadge
                  tone={
                    currentInstitution.status === "active"
                      ? "success"
                      : currentInstitution.status === "suspended"
                        ? "warning"
                        : "neutral"
                  }
                >
                  {currentInstitution.status}
                </StatusBadge>
              </div>
              <p className="text-[13px] text-[#6b7280]">
                Institution ID: #{currentInstitution.id.toString().padStart(4, "0")} • {currentInstitution.type}
              </p>
            </div>
            <div className="flex gap-2">
              {currentInstitution.status === "active" && (
                <button
                  onClick={() => setShowSuspendModal(true)}
                  className="px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-amber-700 hover:bg-amber-50 transition-colors flex items-center gap-1.5"
                >
                  <Pause className="w-3.5 h-3.5" />
                  Suspend
                </button>
              )}
              {currentInstitution.status === "suspended" && (
                <button
                  onClick={() => setShowResumeModal(true)}
                  className="px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  Resume
                </button>
              )}
              <button
                onClick={() => setShowArchiveModal(true)}
                className="px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Archive
              </button>
              <button
                onClick={() => setShowPlanChangeModal(true)}
                className="px-3 py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium"
              >
                Change Plan
              </button>
            </div>
          </div>

          <div className="flex gap-1 border-b border-[#e8eaed]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-[13px] transition-colors ${
                  activeTab === tab.id
                    ? "text-[#1e40af] border-b-2 border-[#1e40af] font-medium"
                    : "text-[#6b7280] hover:text-[#1f2937]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1200px]">
            {activeTab === "overview" && (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  <MetricCard label="Active Users" value={currentInstitution.activeUsers.toLocaleString()} />
                  <MetricCard label="Storage Usage" value={`${currentInstitution.storageUsage} GB`} />
                  <MetricCard label="Current Plan" value={currentInstitution.plan} valueClassName="text-[#1e40af]" />
                </div>

                <div className="bg-white border border-[#e8eaed] rounded p-5">
                  <h2 className="text-[#1f2937] mb-4">Institution Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[12px] text-[#6b7280] mb-1">Institution Type</div>
                      <div className="text-[13px] text-[#1f2937]">{currentInstitution.type}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6b7280] mb-1">Country</div>
                      <div className="text-[13px] text-[#1f2937]">{currentInstitution.country}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6b7280] mb-1">Created Date</div>
                      <div className="text-[13px] text-[#1f2937]">{currentInstitution.createdDate}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6b7280] mb-1">Last Modified</div>
                      <div className="text-[13px] text-[#1f2937]">
                        {currentInstitution.lastModified} by {currentInstitution.modifiedBy}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "features" && (
              <div className="bg-white border border-[#e8eaed] rounded p-5">
                <h2 className="text-[#1f2937] mb-4">Feature Access Control</h2>
                <div className="space-y-3">
                  {allFeatures.map((feature) => {
                    const isEnabled = currentInstitution.featuresEnabled.includes(feature.id);
                    return (
                      <div key={feature.id} className="flex items-center justify-between p-3 bg-[#fafbfc] rounded border border-[#e8eaed]">
                        <div className="flex-1">
                          <div className="text-[13px] text-[#1f2937] font-medium mb-0.5">{feature.name}</div>
                          <div className="text-[12px] text-[#6b7280]">{feature.description}</div>
                        </div>
                        <button
                          onClick={() => handleFeatureToggle(feature.id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            isEnabled ? "bg-[#1e40af]" : "bg-[#d1d5db]"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isEnabled ? "translate-x-[18px]" : "translate-x-[2px]"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-5">
                <div className="bg-white border border-[#e8eaed] rounded p-5">
                  <h2 className="text-[#1f2937] mb-4">Current Plan: {currentInstitution.plan}</h2>
                  <div className="text-[13px] text-[#6b7280] mb-4">
                    Features included: {currentInstitution.featuresEnabled.length} active features
                  </div>
                  <button
                    onClick={() => setShowPlanChangeModal(true)}
                    className="px-3 py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium"
                  >
                    Upgrade / Change Plan
                  </button>
                </div>
              </div>
            )}

            {(activeTab === "structure" || activeTab === "users" || activeTab === "logs") && (
              <div className="bg-white border border-[#e8eaed] rounded p-5">
                <div className="text-center py-8 text-[#6b7280] text-[13px]">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} view would display detailed information here
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        onConfirm={handleSuspend}
        title="Suspend Institution"
        message={`Are you sure you want to suspend ${currentInstitution.name}? All users will be logged out immediately.`}
        confirmText="Suspend"
        variant="warning"
      />

      <ConfirmModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        onConfirm={handleResume}
        title="Resume Institution"
        message={`Resume ${currentInstitution.name}? The institution will be reactivated and users can log in again.`}
        confirmText="Resume"
        variant="info"
      />

      <ConfirmModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        onConfirm={handleArchive}
        title="Archive Institution"
        message={`Archive ${currentInstitution.name}? Data will be preserved but locked. This action can be reversed.`}
        confirmText="Archive"
        variant="danger"
      />

      {showPlanChangeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]" onClick={() => setShowPlanChangeModal(false)}>
          <div className="bg-white rounded border border-[#d8dce2] w-full max-w-md m-6" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[#e8eaed]">
              <h2 className="text-[#1f2937]">Change Plan</h2>
              <p className="text-[13px] text-[#6b7280] mt-1">Select a new plan for {currentInstitution.name}</p>
            </div>
            <div className="p-5 space-y-3">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`w-full p-4 border-2 rounded text-left transition-colors ${
                    selectedPlanId === plan.id ? "border-[#1e40af] bg-blue-50" : "border-[#e8eaed] hover:border-[#d8dce2]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] text-[#1f2937] font-semibold">{plan.name}</span>
                    <span className="text-[14px] text-[#1e40af] font-semibold">${(plan.price / 100).toLocaleString()}/mo</span>
                  </div>
                  <div className="text-[12px] text-[#6b7280]">
                    {plan.userLimit.toLocaleString()} users • {plan.storageLimit} GB storage • {plan.features.length} features
                  </div>
                </button>
              ))}
            </div>
            <div className="p-5 border-t border-[#e8eaed] flex gap-2">
              <button
                onClick={() => {
                  setShowPlanChangeModal(false);
                  setSelectedPlanId(null);
                }}
                className="flex-1 px-4 py-2 bg-white border border-[#d8dce2] rounded text-[13px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handlePlanChange();
                  setShowPlanChangeModal(false);
                }}
                disabled={!selectedPlanId}
                className="flex-1 px-4 py-2 bg-[#1e40af] rounded text-[13px] text-white hover:bg-[#1e3a8a] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Change Plan
              </button>
            </div>
          </div>
        </div>
      )}

      <AddInstitutionWizard isOpen={showAddWizard} onClose={() => setShowAddWizard(false)} />
    </div>
  );
}
