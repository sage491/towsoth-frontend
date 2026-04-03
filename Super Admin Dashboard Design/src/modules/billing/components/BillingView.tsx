import { AlertCircle, CheckCircle2, Clock, CreditCard, DollarSign, Download, FileText, Filter, Search, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PanelHeader } from "../../../components/shared/PanelHeader";
import { TableCard } from "../../../components/shared/TableCard";
import type { BillingStats, Invoice, PlanDistributionItem, RevenueDataPoint } from "../types";

interface BillingViewProps {
  filteredInvoices: Invoice[];
  revenueData: RevenueDataPoint[];
  planDistribution: PlanDistributionItem[];
  searchTerm: string;
  statusFilter: string;
  stats: BillingStats;
  setSearchTerm: (value: string) => void;
  setStatusFilter: (value: string) => void;
}

export function BillingView({
  filteredInvoices,
  revenueData,
  planDistribution,
  searchTerm,
  statusFilter,
  stats,
  setSearchTerm,
  setStatusFilter,
}: BillingViewProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f6f8]">
      <PanelHeader
        title="Billing & Monetization"
        description="Revenue management and financial oversight"
        actions={
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export Financial Report
            </button>
            <button className="px-3 py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium">
              Generate Invoice
            </button>
          </div>
        }
      />

      <div className="p-6 border-b border-[#e8eaed] bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-4 h-4 text-[#1e40af]" />
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-[24px] text-[#1f2937] font-semibold tracking-tight">${(stats.mrr / 1000).toFixed(0)}K</div>
              <div className="text-[12px] text-[#6b7280]">Monthly Recurring Revenue</div>
            </div>

            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-4 h-4 text-[#1e40af]" />
                <span className="text-[11px] text-emerald-700 font-medium">+8.2%</span>
              </div>
              <div className="text-[24px] text-[#1f2937] font-semibold tracking-tight">${(stats.arr / 1000000).toFixed(2)}M</div>
              <div className="text-[12px] text-[#6b7280]">Annual Recurring Revenue</div>
            </div>

            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span className="text-[11px] text-amber-700 font-medium">{filteredInvoices.filter((invoice) => invoice.status === "pending").length} pending</span>
              </div>
              <div className="text-[24px] text-[#1f2937] font-semibold tracking-tight">${(stats.outstanding / 1000).toFixed(0)}K</div>
              <div className="text-[12px] text-[#6b7280]">Outstanding Payments</div>
            </div>

            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-[11px] text-red-700 font-medium">{stats.overdue} overdue</span>
              </div>
              <div className="text-[24px] text-red-700 font-semibold tracking-tight">{stats.overdue}</div>
              <div className="text-[12px] text-[#6b7280]">Overdue Invoices</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-[1600px] mx-auto space-y-5">
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 bg-white border border-[#e8eaed] rounded p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#1f2937]">Revenue Trend</h2>
                <span className="text-[12px] text-[#6b7280]">Last 6 months</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(value) => `$${value / 1000}K`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e8eaed", borderRadius: "6px", fontSize: "12px" }}
                    labelStyle={{ color: "#1f2937" }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#1e40af" fill="#1e40af" fillOpacity={0.08} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-[#e8eaed] rounded p-5">
              <h2 className="text-[#1f2937] mb-4">Plan Distribution</h2>
              <div className="space-y-3">
                {planDistribution.map((plan) => (
                  <div key={plan.plan} className="p-3 bg-[#fafbfc] rounded border border-[#e8eaed]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] text-[#1f2937] font-medium">{plan.plan}</span>
                      <span className="text-[12px] text-[#6b7280]">{plan.count} institutions</span>
                    </div>
                    <div className="text-[16px] text-[#1e40af] font-semibold">${(plan.revenue / 1000).toFixed(0)}K</div>
                    <div className="text-[11px] text-[#6b7280] mt-1">{((plan.revenue / stats.arr) * 100).toFixed(1)}% of ARR</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <TableCard title="Recent Invoices">
            <div className="px-5 pb-5">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type="text"
                    placeholder="Search by institution or invoice ID..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full bg-white border border-[#d8dce2] rounded pl-9 pr-3 py-2 text-[13px] text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                  <Filter className="w-3.5 h-3.5" />
                  Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#fafbfc] border-b border-[#e8eaed]">
                  <tr>
                    <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Invoice ID</th>
                    <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Institution</th>
                    <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Plan</th>
                    <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Amount</th>
                    <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Invoice Date</th>
                    <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Due Date</th>
                    <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Status</th>
                    <th className="px-4 py-3 text-right text-[12px] text-[#6b7280] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8eaed]">
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-[13px] text-[#6b7280]">
                        No invoices match the current filters.
                      </td>
                    </tr>
                  )}
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-[#fafbfc] transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-[13px] text-[#1f2937] font-medium">#{invoice.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13px] text-[#1f2937]">{invoice.institution}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-[#f5f6f8] rounded text-[12px] text-[#1f2937] font-medium">{invoice.plan}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13px] text-[#1f2937] font-medium">${invoice.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] text-[#6b7280]">{invoice.invoiceDate}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] text-[#6b7280]">{invoice.dueDate}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {invoice.status === "paid" ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[12px] text-emerald-700 capitalize font-medium">{invoice.status}</span>
                            </>
                          ) : invoice.status === "pending" ? (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span className="text-[12px] text-amber-700 capitalize font-medium">{invoice.status}</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                              <span className="text-[12px] text-red-700 capitalize font-medium">{invoice.status}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 hover:bg-[#f5f6f8] rounded transition-colors" title="Download Invoice">
                            <Download className="w-3.5 h-3.5 text-[#6b7280]" />
                          </button>
                          <button className="p-1.5 hover:bg-[#f5f6f8] rounded transition-colors" title="View Details">
                            <FileText className="w-3.5 h-3.5 text-[#6b7280]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableCard>
        </div>
      </div>
    </div>
  );
}
