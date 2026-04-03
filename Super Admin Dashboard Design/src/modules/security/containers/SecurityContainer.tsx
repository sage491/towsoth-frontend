import { SecurityView } from "../components/SecurityView";
import { useSecurity } from "../hooks/useSecurity";

export function SecurityContainer() {
  const viewModel = useSecurity();

  return <SecurityView {...viewModel} />;
}
