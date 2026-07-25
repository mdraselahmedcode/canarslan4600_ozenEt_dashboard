"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BuildingIcon, DeleteIcon, EyeIcon, CheckInCircleIcon } from "@/components/icons";
import {
  useGetAllCustomersQuery,
  useVerifyCustomerMutation,
  useDeleteCustomerMutation,
} from "@/store/api/customerApi";

type VerifyStatus = "All" | "Approved" | "Pending" | "Rejected";

interface ConfirmModal {
  type: "approve" | "reject" | "delete";
  customerId: string;
  customerName: string;
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<VerifyStatus>("All");
  const [confirmModal, setConfirmModal] = useState<ConfirmModal | null>(null);
  const [rejectReason, setRejectReason] = useState("Business information could not be verified");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const { data: dbCustomers, isLoading } = useGetAllCustomersQuery({
    searchTerm: debouncedSearch || undefined,
    limit: 100,
  });

  const [verifyCustomer] = useVerifyCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const showToast = (msg: string, type: "success" | "error") => setToast({ msg, type });

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    const { type, customerId } = confirmModal;
    setProcessingId(customerId);
    setConfirmModal(null);

    try {
      if (type === "approve") {
        await verifyCustomer({ id: customerId, status: "approved" }).unwrap();
        showToast("Customer approved successfully!", "success");
      } else if (type === "reject") {
        await verifyCustomer({ id: customerId, status: "rejected", reason: rejectReason }).unwrap();
        showToast("Customer rejected.", "success");
      } else if (type === "delete") {
        await deleteCustomer(customerId).unwrap();
        showToast("Customer deleted.", "success");
      }
    } catch (err: any) {
      showToast(err?.data?.message || err?.message || "Operation failed.", "error");
    } finally {
      setProcessingId(null);
      setRejectReason("Business information could not be verified");
    }
  };

  const mapStatus = (isAdminVerified: boolean | undefined, userIsActive?: boolean): VerifyStatus => {
    if (isAdminVerified === true) return "Approved";
    if (isAdminVerified === false && userIsActive === false) return "Rejected";
    return "Pending";
  };

  const customers = dbCustomers?.data?.result?.map((cust) => ({
    id: cust._id,
    name: cust.businessName || cust.name || "Unnamed Business",
    code: cust.taxId || "",
    contactName: cust.name || "—",
    contactEmail: cust.email || "—",
    phone: cust.phone || "—",
    businessType: cust.businessType || "—",
    profileImage: cust.profile_image,
    registeredDate: cust.createdAt
      ? new Date(cust.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—",
    status: mapStatus(cust.isAdminVerified, (cust.user as any)?.isActive),
    isAdminVerified: cust.isAdminVerified,
  })) || [];

  const countApproved = customers.filter((c) => c.status === "Approved").length;
  const countPending = customers.filter((c) => c.status === "Pending").length;
  const countRejected = customers.filter((c) => c.status === "Rejected").length;

  const filteredCustomers = customers.filter(
    (c) => selectedFilter === "All" || c.status === selectedFilter
  );

  return (
    <div className="p-8">
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-nunito-semibold transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-nunito-bold text-slate-800">Customers</h1>
        <p className="text-sm font-nunito text-slate-500 mt-1">
          {customers.length} total registered businesses
        </p>
      </div>

      {/* ── KPI Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Approved", count: countApproved, filter: "Approved" as VerifyStatus, bg: "bg-[#F0FDF4]/65", border: "border-[#DCFCE7]", activeBorder: "border-[#22C55E] ring-1 ring-[#22C55E]", text: "text-[#16A34A]" },
          { label: "Pending Approval", count: countPending, filter: "Pending" as VerifyStatus, bg: "bg-[#FFFBEB]/65", border: "border-[#FEF3C7]", activeBorder: "border-[#D97706] ring-1 ring-[#D97706]", text: "text-[#D97706]" },
          { label: "Rejected", count: countRejected, filter: "Rejected" as VerifyStatus, bg: "bg-[#FEF2F2]/65", border: "border-[#FEE2E2]", activeBorder: "border-[#DC2626] ring-1 ring-[#DC2626]", text: "text-[#DC2626]" },
        ].map(({ label, count, filter, bg, border, activeBorder, text }) => (
          <div
            key={filter}
            onClick={() => setSelectedFilter(selectedFilter === filter ? "All" : filter)}
            className={`p-6 rounded-2xl border ${bg} cursor-pointer hover:shadow-md transition-all duration-200 ${selectedFilter === filter ? activeBorder : border}`}
          >
            <div className="flex flex-col">
              <span className={`text-3xl font-nunito-bold ${text} leading-none mb-2`}>{count}</span>
              <span className={`text-xs font-nunito-bold ${text} uppercase tracking-wider`}>{label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search & Filter ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by company or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400 bg-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as VerifyStatus)}
                className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer font-nunito"
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <span className="text-xs font-nunito-semibold text-slate-400 shrink-0">
              {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-brand-primary" />
            <p className="text-slate-400 text-xs font-nunito mt-4">Loading customers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50">
                  {["Company", "Contact", "Phone", "Business Type", "Registered", "Status", "Actions"].map((h, i) => (
                    <th
                      key={h}
                      className={`py-4 text-[11px] font-nunito-semibold text-slate-400 uppercase tracking-wider ${i === 0 ? "text-left px-6" : i === 6 ? "text-right px-6" : "text-left px-4"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-sm font-nunito text-slate-400">
                      No customers found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => {
                    const isProcessing = processingId === customer.id;

                    return (
                      <tr
                        key={customer.id}
                        className={`border-b border-slate-50 last:border-b-0 hover:bg-slate-50/60 transition-colors ${isProcessing ? "opacity-60 pointer-events-none" : ""}`}
                      >
                        {/* Company */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {customer.profileImage ? (
                              <img
                                src={customer.profileImage}
                                alt={customer.name}
                                className="w-8 h-8 rounded-lg object-cover border border-slate-100"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                                <BuildingIcon size={14} color="currentColor" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-nunito-bold text-slate-700 leading-tight">{customer.name}</p>
                              {customer.code && (
                                <p className="text-[11px] font-nunito text-slate-400 mt-0.5">{customer.code}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-4">
                          <p className="text-sm font-nunito-semibold text-slate-700 leading-tight">{customer.contactName}</p>
                          <p className="text-[11px] font-nunito text-slate-400 mt-0.5">{customer.contactEmail}</p>
                        </td>

                        {/* Phone */}
                        <td className="px-4 py-4">
                          <span className="text-sm font-nunito text-slate-500">{customer.phone}</span>
                        </td>

                        {/* Business Type */}
                        <td className="px-4 py-4">
                          <span className="text-sm font-nunito text-slate-500 capitalize">{customer.businessType}</span>
                        </td>

                        {/* Registered */}
                        <td className="px-4 py-4">
                          <span className="text-sm font-nunito text-slate-500">{customer.registeredDate}</span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          {isProcessing ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-3.5 h-3.5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                              <span className="text-[10px] font-nunito text-slate-400">Processing...</span>
                            </div>
                          ) : customer.status === "Approved" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-nunito-bold bg-emerald-50 text-[#16A34A] border border-[#DCFCE7]">
                              ✓ Approved
                            </span>
                          ) : customer.status === "Pending" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-nunito-bold bg-amber-50 text-[#D97706] border border-[#FEF3C7]">
                              • Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-nunito-bold bg-red-50 text-[#DC2626] border border-[#FEE2E2]">
                              ✕ Rejected
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/customers/${customer.id}`}
                              title="View Customer"
                              className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg border border-slate-200 transition-all cursor-pointer flex items-center justify-center"
                            >
                              <EyeIcon size={14} color="currentColor" />
                            </Link>

                            {customer.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => setConfirmModal({ type: "approve", customerId: customer.id, customerName: customer.name })}
                                  title="Approve Customer"
                                  className="flex items-center gap-1 text-[11px] font-nunito-bold px-2.5 py-1.5 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] rounded-lg transition-all cursor-pointer"
                                >
                                  <CheckInCircleIcon size={13} color="currentColor" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setRejectReason("Business information could not be verified");
                                    setConfirmModal({ type: "reject", customerId: customer.id, customerName: customer.name });
                                  }}
                                  title="Reject Customer"
                                  className="text-[11px] font-nunito-bold px-2.5 py-1.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-lg transition-all cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {customer.status === "Approved" && (
                              <button
                                onClick={() => setConfirmModal({ type: "reject", customerId: customer.id, customerName: customer.name })}
                                title="Revoke Approval"
                                className="text-[11px] font-nunito-bold px-2.5 py-1.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-lg transition-all cursor-pointer"
                              >
                                Revoke
                              </button>
                            )}

                            <button
                              onClick={() => setConfirmModal({ type: "delete", customerId: customer.id, customerName: customer.name })}
                              title="Delete Customer"
                              className="p-1.5 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg border border-red-100 hover:border-red-200 transition-all cursor-pointer"
                            >
                              <DeleteIcon size={14} color="currentColor" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Confirmation Modal ── */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 mx-4 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className={`p-6 pb-4 border-b border-slate-50 ${confirmModal.type === "approve" ? "bg-emerald-50/40" : "bg-red-50/40"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                  confirmModal.type === "approve" ? "bg-emerald-100" : "bg-red-100"
                }`}>
                  {confirmModal.type === "approve" ? "✓" : confirmModal.type === "reject" ? "✕" : "🗑"}
                </div>
                <div>
                  <h2 className="text-base font-nunito-bold text-slate-800">
                    {confirmModal.type === "approve"
                      ? "Approve Customer"
                      : confirmModal.type === "reject"
                      ? "Reject Customer"
                      : "Delete Customer"}
                  </h2>
                  <p className="text-xs font-nunito text-slate-500 mt-0.5">{confirmModal.customerName}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {confirmModal.type === "approve" && (
                <p className="text-sm font-nunito text-slate-600 leading-relaxed">
                  This will grant <span className="font-nunito-bold text-slate-800">{confirmModal.customerName}</span> access to the platform. They will be able to place orders immediately.
                </p>
              )}
              {confirmModal.type === "reject" && (
                <>
                  <p className="text-sm font-nunito text-slate-600 leading-relaxed">
                    Please provide a reason for rejecting <span className="font-nunito-bold text-slate-800">{confirmModal.customerName}</span>.
                  </p>
                  <div>
                    <label className="block text-xs font-nunito-bold text-slate-500 uppercase tracking-wider mb-2">
                      Rejection Reason
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all resize-none"
                      placeholder="Enter reason..."
                    />
                  </div>
                </>
              )}
              {confirmModal.type === "delete" && (
                <p className="text-sm font-nunito text-slate-600 leading-relaxed">
                  Are you sure you want to permanently delete <span className="font-nunito-bold text-slate-800">{confirmModal.customerName}</span>? This action cannot be undone.
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-2 flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-5 py-2.5 rounded-xl text-sm font-nunito-semibold text-white transition-all cursor-pointer active:scale-[0.98] shadow-sm ${
                  confirmModal.type === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                    : "bg-red-600 hover:bg-red-700 shadow-red-200"
                }`}
              >
                {confirmModal.type === "approve" ? "Approve" : confirmModal.type === "reject" ? "Reject" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
