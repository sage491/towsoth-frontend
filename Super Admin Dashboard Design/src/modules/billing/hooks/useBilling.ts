import { useMemo, useState } from "react";
import { INVOICES, PLAN_DISTRIBUTION, REVENUE_DATA, calculateBillingStats, filterInvoices } from "../services/billingService";

export function useBilling() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvoices = useMemo(() => {
    return filterInvoices(INVOICES, searchTerm, statusFilter);
  }, [searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return calculateBillingStats(INVOICES);
  }, []);

  return {
    invoices: INVOICES,
    filteredInvoices,
    revenueData: REVENUE_DATA,
    planDistribution: PLAN_DISTRIBUTION,
    searchTerm,
    statusFilter,
    stats,
    setSearchTerm,
    setStatusFilter,
  };
}
