export interface Invoice {
  id: number;
  institution: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  invoiceDate: string;
  plan: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface PlanDistributionItem {
  plan: string;
  count: number;
  revenue: number;
}

export interface BillingStats {
  mrr: number;
  arr: number;
  outstanding: number;
  overdue: number;
}
