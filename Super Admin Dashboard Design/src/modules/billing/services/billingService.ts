import type { BillingStats, Invoice, PlanDistributionItem, RevenueDataPoint } from "../types";

export const INVOICES: Invoice[] = [
  { id: 10245, institution: "Stanford University", amount: 24999, status: "paid", dueDate: "2025-12-31", invoiceDate: "2025-12-01", plan: "Enterprise" },
  { id: 10244, institution: "Harvard University", amount: 24999, status: "paid", dueDate: "2025-12-28", invoiceDate: "2025-11-28", plan: "Enterprise" },
  { id: 10243, institution: "MIT", amount: 9999, status: "pending", dueDate: "2025-12-30", invoiceDate: "2025-12-01", plan: "Pro" },
  { id: 10242, institution: "UC Berkeley", amount: 24999, status: "paid", dueDate: "2025-12-25", invoiceDate: "2025-11-25", plan: "Enterprise" },
  { id: 10241, institution: "University of Chicago", amount: 2999, status: "overdue", dueDate: "2025-12-15", invoiceDate: "2025-11-15", plan: "Starter" },
  { id: 10240, institution: "Yale University", amount: 9999, status: "paid", dueDate: "2025-12-20", invoiceDate: "2025-11-20", plan: "Pro" },
];

export const REVENUE_DATA: RevenueDataPoint[] = [
  { month: "Jul", revenue: 185000 },
  { month: "Aug", revenue: 195000 },
  { month: "Sep", revenue: 210000 },
  { month: "Oct", revenue: 230000 },
  { month: "Nov", revenue: 245000 },
  { month: "Dec", revenue: 260000 },
];

export const PLAN_DISTRIBUTION: PlanDistributionItem[] = [
  { plan: "Enterprise", count: 42, revenue: 1049580 },
  { plan: "Pro", count: 128, revenue: 1279872 },
  { plan: "Starter", count: 234, revenue: 701766 },
];

export function filterInvoices(invoices: Invoice[], searchTerm: string, statusFilter: string): Invoice[] {
  const normalized = searchTerm.toLowerCase();

  return invoices.filter((invoice) => {
    const matchesSearch = invoice.institution.toLowerCase().includes(normalized) || invoice.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
}

export function calculateBillingStats(invoices: Invoice[]): BillingStats {
  return {
    mrr: 260000,
    arr: 3120000,
    outstanding: invoices.filter((invoice) => invoice.status === "pending" || invoice.status === "overdue").reduce((sum, invoice) => sum + invoice.amount, 0),
    overdue: invoices.filter((invoice) => invoice.status === "overdue").length,
  };
}
