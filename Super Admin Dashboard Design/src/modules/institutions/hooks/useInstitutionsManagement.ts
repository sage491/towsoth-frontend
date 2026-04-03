import { useEffect, useMemo, useState } from "react";
import { useApp } from "../../../contexts/AppContext";
import { INSTITUTION_FEATURES, filterInstitutions } from "../services/institutionsService";
import type { InstitutionsTab, InstitutionsTabId } from "../types";

const TABS: InstitutionsTab[] = [
  { id: "overview", label: "Overview" },
  { id: "billing", label: "Plan & Billing" },
  { id: "features", label: "Feature Access" },
  { id: "structure", label: "Structure" },
  { id: "users", label: "Users" },
  { id: "logs", label: "Activity Logs" },
];

export function useInstitutionsManagement() {
  const {
    institutions,
    plans,
    suspendInstitution,
    resumeInstitution,
    archiveInstitution,
    changeInstitutionPlan,
    toggleInstitutionFeature,
  } = useApp();

  const [selectedInstitutionId, setSelectedInstitutionId] = useState<number | null>(institutions[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState<InstitutionsTabId>("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showPlanChangeModal, setShowPlanChangeModal] = useState(false);
  const [showAddWizard, setShowAddWizard] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  useEffect(() => {
    if (institutions.length === 0) {
      setSelectedInstitutionId(null);
      return;
    }

    const selectedExists = selectedInstitutionId !== null && institutions.some((institution) => institution.id === selectedInstitutionId);
    if (!selectedExists) {
      setSelectedInstitutionId(institutions[0].id);
    }
  }, [institutions, selectedInstitutionId]);

  const filteredInstitutions = useMemo(() => {
    return filterInstitutions(institutions, searchTerm, planFilter);
  }, [institutions, planFilter, searchTerm]);

  const currentInstitution = useMemo(() => {
    if (selectedInstitutionId === null) {
      return null;
    }

    return institutions.find((institution) => institution.id === selectedInstitutionId) ?? institutions[0] ?? null;
  }, [institutions, selectedInstitutionId]);

  const handleSuspend = () => {
    if (!currentInstitution) return;
    suspendInstitution(currentInstitution.id, "Suspended by Super Admin");
  };

  const handleResume = () => {
    if (!currentInstitution) return;
    resumeInstitution(currentInstitution.id);
  };

  const handleArchive = () => {
    if (!currentInstitution) return;
    archiveInstitution(currentInstitution.id);
  };

  const handlePlanChange = () => {
    if (!currentInstitution || !selectedPlanId) return;

    changeInstitutionPlan(currentInstitution.id, selectedPlanId);
    setSelectedPlanId(null);
  };

  const handleFeatureToggle = (feature: string) => {
    if (!currentInstitution) return;
    toggleInstitutionFeature(currentInstitution.id, feature);
  };

  return {
    plans,
    institutions,
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
    tabs: TABS,
    allFeatures: INSTITUTION_FEATURES,
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
  };
}
