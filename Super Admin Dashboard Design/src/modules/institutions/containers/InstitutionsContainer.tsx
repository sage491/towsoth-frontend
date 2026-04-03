import { InstitutionsView } from "../components/InstitutionsView";
import { useInstitutionsManagement } from "../hooks/useInstitutionsManagement";

export function InstitutionsContainer() {
  const viewModel = useInstitutionsManagement();
  const currentInstitution = viewModel.currentInstitution;

  if (viewModel.institutions.length === 0) {
    return (
      <div className="flex-1 overflow-hidden bg-[#f5f6f8] flex items-center justify-center">
        <div className="text-[13px] text-[#6b7280]">No institutions are available.</div>
      </div>
    );
  }

  if (!currentInstitution) {
    return (
      <div className="flex-1 overflow-hidden bg-[#f5f6f8] flex items-center justify-center">
        <div className="text-[13px] text-[#6b7280]">Loading institution data...</div>
      </div>
    );
  }

  return <InstitutionsView {...viewModel} currentInstitution={currentInstitution} />;
}
