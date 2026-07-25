"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BackIcon,
  DeleteIcon,
  BuildingIcon,
  PageIcon,
  OneManIcon,
  PhoneIcon,
  LocationIcon,
  MailIcon,
  StoreIcon,
  SaveIcon,
} from "@/components/icons";
import {
  useGetSingleCustomerQuery,
  useVerifyCustomerMutation,
  useDeleteCustomerMutation,
} from "@/store/api/customerApi";
import {
  useGetCustomerOrderMetaQuery,
  useGetAllOrdersQuery,
} from "@/store/api/orderApi";

const formatLastOrderDate = (dateString?: string | null) => {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return "—";
  }
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-nunito-bold bg-emerald-50 text-[#16A34A] border border-[#DCFCE7]">
          delivered
        </span>
      );
    case "received":
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-nunito-bold bg-amber-50 text-[#D97706] border border-[#FEF3C7]">
          received
        </span>
      );
    case "confirmed":
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-nunito-bold bg-blue-50 text-blue-600 border border-blue-100">
          confirmed
        </span>
      );
    case "preparing":
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-nunito-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
          preparing
        </span>
      );
    case "cancelled":
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-nunito-bold bg-red-50 text-[#DC2626] border border-[#FEE2E2]">
          cancelled
        </span>
      );
    case "rejected":
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-nunito-bold bg-red-50 text-[#DC2626] border border-[#FEE2E2]">
          rejected
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-nunito-bold bg-slate-50 text-slate-600 border border-slate-200">
          {status}
        </span>
      );
  }
};

interface Customer {
  id: string;
  name: string;
  code: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  businessType: string;
  registeredDate: string;
  ordersCount: number;
  totalSpent: number;
  status: "Approved" | "Pending" | "Rejected";
  address: string;
}

interface Product {
  id: string;
  name: string;
  category: "Beef" | "Chicken" | "Lamb" | "Frozen" | "Processed";
  code: string;
  defaultPrice: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data: dbCustomer, isLoading: isCustomerLoading } =
    useGetSingleCustomerQuery(id);
  const { data: metaResponse, isLoading: isMetaLoading } =
    useGetCustomerOrderMetaQuery(id);
  const { data: ordersResponse, isLoading: isOrdersLoading } =
    useGetAllOrdersQuery({ customer: id });

  const [verifyCustomer] = useVerifyCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const isLoading = isCustomerLoading || isMetaLoading;

  const [activeTab, setActiveTab] = useState<"info" | "pricing">("info");

  const mapBackendStatus = (isAdminVerified: boolean): Customer["status"] => {
    return isAdminVerified ? "Approved" : "Pending";
  };

  const customer: Customer | null = dbCustomer?.data
    ? {
        id: dbCustomer.data._id,
        name:
          dbCustomer.data.businessName ||
          dbCustomer.data.name ||
          "Unnamed Business",
        code: dbCustomer.data.taxId || dbCustomer.data.user?._id || "",
        contactName: dbCustomer.data.name || "No Contact Name",
        contactEmail: dbCustomer.data.email || "",
        phone: dbCustomer.data.phone || "",
        businessType: dbCustomer.data.businessType || "Retail",
        registeredDate: dbCustomer.data.createdAt
          ? new Date(dbCustomer.data.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "",
        ordersCount: 0,
        totalSpent: 0,
        status: mapBackendStatus(dbCustomer.data.isAdminVerified),
        address: dbCustomer.data.address || "",
      }
    : null;

  const handleApprove = async () => {
    if (!customer) return;
    try {
      await verifyCustomer({ id: customer.id, status: "approved" }).unwrap();
      alert("Customer approved successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || err?.message || "Failed to approve customer");
    }
  };

  const handleReject = async () => {
    if (!customer) return;
    const reason = prompt(
      "Enter reason for rejection:",
      "Business information could not be verified",
    );
    if (reason === null) return;
    try {
      await verifyCustomer({
        id: customer.id,
        status: "rejected",
        reason,
      }).unwrap();
      alert("Customer rejected successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || err?.message || "Failed to reject customer");
    }
  };

  const handleDelete = async () => {
    if (!customer) return;
    if (
      confirm(`Are you sure you want to delete customer: ${customer.name}?`)
    ) {
      try {
        await deleteCustomer(customer.id).unwrap();
        alert("Customer deleted successfully!");
        router.push("/dashboard/customers");
      } catch (err: any) {
        console.error(err);
        alert(
          err?.data?.message || err?.message || "Failed to delete customer",
        );
      }
    }
  };

  // Real orders retrieved from API

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-brand-primary"></div>
        <p className="text-slate-400 text-xs font-nunito mt-4">
          Loading customer details...
        </p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-8 text-center font-nunito">
        <p className="text-slate-500">Customer not found.</p>
        <Link
          href="/dashboard/customers"
          className="text-[#C4202B] mt-4 inline-block hover:underline"
        >
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/customers"
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm"
          >
            <BackIcon width={16} height={16} color="currentColor" />
            <span>Back</span>
          </Link>
          <div>
            <h1 className="text-xl font-nunito-bold text-slate-800 leading-tight">
              {customer.name}
            </h1>
            <p className="text-xs font-nunito text-slate-400 mt-1">
              {`${customer.businessType} • Registered ${customer.registeredDate}`}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {customer.status === "Approved" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-nunito-bold bg-emerald-50 text-[#16A34A] border border-[#DCFCE7]">
              Approved
            </span>
          )}
          {customer.status === "Pending" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-nunito-bold bg-amber-50 text-[#D97706] border border-[#FEF3C7]">
              Pending
            </span>
          )}
          {customer.status === "Rejected" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-nunito-bold bg-red-50 text-[#DC2626] border border-[#FEE2E2]">
              Rejected
            </span>
          )}
        </div>
      </div>

      {/* KPI Stats Cards (Total Orders, Completed, Total Spend, Last Order) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#D97706] mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <p className="text-xl font-nunito-bold text-slate-800 leading-tight">
            {metaResponse?.data?.totalOrders ?? 0}
          </p>
          <p className="text-xs font-nunito-medium text-slate-500 mt-1">
            Total Orders
          </p>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#16A34A] mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-xl font-nunito-bold text-slate-800 leading-tight">
            {metaResponse?.data?.completed ?? 0}
          </p>
          <p className="text-xs font-nunito-medium text-slate-500 mt-1">
            Completed
          </p>
        </div>

        {/* Total Spend */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-[#D97706] mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <p className="text-xl font-nunito-bold text-slate-800 leading-tight">
            {`$${(metaResponse?.data?.totalSpend ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </p>
          <p className="text-xs font-nunito-medium text-slate-500 mt-1">
            Total Spend
          </p>
        </div>

        {/* Last Order */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p className="text-xl font-nunito-bold text-slate-800 leading-tight">
            {formatLastOrderDate(metaResponse?.data?.lastOrder)}
          </p>
          <p className="text-xs font-nunito-medium text-slate-500 mt-1">
            Last Order
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 mb-8 gap-6">
        <button
          onClick={() => setActiveTab("info")}
          className={`py-3 text-sm font-nunito-semibold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "info"
              ? "border-brand-primary text-brand-primary font-nunito-bold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Business Information
        </button>
        {/* <button
          onClick={() => setActiveTab("pricing")}
          className={`py-3 text-sm font-nunito-semibold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "pricing"
              ? "border-brand-primary text-brand-primary font-nunito-bold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Customer Pricing
        </button> */}
      </div>

      {/* Main Tab Panels */}
      {activeTab === "info" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Business Information Details */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-nunito-bold text-slate-800 mb-6">
              Business Information
            </h2>
            <div className="space-y-6">
              {/* COMPANY NAME */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <BuildingIcon size={18} color="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                    Company Name
                  </p>
                  <p className="text-sm font-nunito-semibold text-slate-700 mt-0.5">
                    {customer.name}
                  </p>
                </div>
              </div>

              {/* BUSINESS TYPE */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <StoreIcon size={18} color="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                    Business Type
                  </p>
                  <p className="text-sm font-nunito-semibold text-slate-700 mt-0.5">
                    {customer.businessType}
                  </p>
                </div>
              </div>

              {/* CONTACT PERSON */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <OneManIcon
                    size={18}
                    useGradient={false}
                    color="currentColor"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                    Contact Person
                  </p>
                  <p className="text-sm font-nunito-semibold text-slate-700 mt-0.5">
                    {customer.contactName}
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <MailIcon size={18} color="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-sm font-nunito-semibold text-slate-700 mt-0.5">
                    {customer.contactEmail}
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <PhoneIcon size={18} color="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                    Phone
                  </p>
                  <p className="text-sm font-nunito-semibold text-slate-700 mt-0.5">
                    {customer.phone}
                  </p>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <LocationIcon size={18} color="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                    Address
                  </p>
                  <p className="text-sm font-nunito-semibold text-slate-700 mt-0.5">
                    {customer.address}
                  </p>
                </div>
              </div>

              {/* VAT / TAX ID */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <PageIcon size={18} color="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                    VAT / TAX ID
                  </p>
                  <p className="text-sm font-nunito-semibold text-slate-700 mt-0.5">
                    {customer.code}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Order History */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-base font-nunito-bold text-slate-800 mb-4">
                Actions
              </h2>
              {customer.status === "Pending" ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleApprove}
                    className="w-full py-3 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] rounded-xl font-nunito-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] select-none"
                  >
                    <span>Approve Account</span>
                  </button>
                  <button
                    onClick={handleReject}
                    className="w-full py-3 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-xl font-nunito-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] select-none"
                  >
                    <span>Reject Account</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleDelete}
                  className="w-full py-3 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-xl font-nunito-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <DeleteIcon size={14} color="currentColor" />
                  <span>Delete Customer</span>
                </button>
              )}
            </div>

            {/* Order History Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-base font-nunito-bold text-slate-800 mb-4">
                Order History
              </h2>
              {isOrdersLoading ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-primary"></div>
                </div>
              ) : !ordersResponse?.data?.result ||
                ordersResponse.data.result.length === 0 ? (
                <p className="text-sm font-nunito text-slate-400 py-4 text-center">
                  No order history records found.
                </p>
              ) : (
                <div className="space-y-4">
                  {ordersResponse.data.result.map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between pb-3.5 border-b border-slate-50 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-nunito-bold text-slate-700">
                          {order.orderNumber || `#${order._id.substring(0, 8)}`}
                        </p>
                        <p className="text-[10px] font-nunito text-slate-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-nunito-bold text-slate-700">
                          {`$${(order.totalPrice || 0).toFixed(2)}`}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
