import type { Institution, Plan } from "../../types/domain";

export type InstitutionsTabId = "overview" | "billing" | "features" | "structure" | "users" | "logs";

export interface InstitutionsFeature {
  id: string;
  name: string;
  description: string;
}

export interface InstitutionsTab {
  id: InstitutionsTabId;
  label: string;
}

export interface InstitutionsViewModel {
  plans: Plan[];
  institutions: Institution[];
  filteredInstitutions: Institution[];
  currentInstitution: Institution | null;
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
}
