import { BillingView } from "../components/BillingView";
import { useBilling } from "../hooks/useBilling";

export function BillingContainer() {
  const viewModel = useBilling();

  if (viewModel.invoices.length === 0) {
    return (
      <div className="flex-1 overflow-hidden bg-[#f5f6f8] flex items-center justify-center">
        <div className="text-[13px] text-[#6b7280]">No billing data available.</div>
      </div>
    );
  }

  return <BillingView {...viewModel} />;
}
