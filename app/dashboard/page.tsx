"use client";

import React from "react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  DoubleManIcon,
  OneManWithCheckIcon,
  TotalProductsBoxIcon,
  OutOfStockDangerIcon,
  TotalOrdersIcon,
  ClockIcon,
  DoubleCheckIcon,
  DollarIcon,
} from "@/components/icons";
import { useRouter } from "next/navigation";
import { useGetAllCustomersQuery } from "@/store/api/customerApi";
import { useGetAllProductsQuery } from "@/store/api/productApi";
import { useGetAllCategoriesQuery } from "@/store/api/categoryApi";
import { useGetAllOrdersQuery } from "@/store/api/orderApi";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const recentOrders = [
  {
    id: "#OE-2026-010",
    customer: "Bosphorus Restaurant Group",
    items: 4,
    total: 246.5,
    date: "Jun 28, 2026",
    status: "Delivered",
  },
  {
    id: "#OE-2026-009",
    customer: "The Blue Butcher Shop",
    items: 2,
    total: 306.5,
    date: "Ju 7, 2026",
    status: "Confirmed",
  },
  {
    id: "#OE-2026-008",
    customer: "Manhattan Food Distributors",
    items: 2,
    total: 2050.0,
    date: "Ju 12, 2026",
    status: "Pending",
  },
  {
    id: "#OE-2026-007",
    customer: "Manhattan Food Distributors",
    items: 3,
    total: 1749.0,
    date: "Ju 10, 2026",
    status: "Preparing",
  },
  {
    id: "#OE-2026-006",
    customer: "Brooklyn Artisan Kitchen",
    items: 2,
    total: 384.8,
    date: "Ju 5, 2026",
    status: "Delivered",
  },
  {
    id: "#OE-2026-005",
    customer: "Brooklyn Artisan Kitchen",
    items: 1,
    total: 294.0,
    date: "Jun 20, 2026",
    status: "Cancelled",
  },
  {
    id: "#OE-2026-004",
    customer: "Grand Hotel New York",
    items: 3,
    total: 596.0,
    date: "Ju 12, 2026",
    status: "Pending",
  },
];

const pendingApprovals = [
  {
    id: "6",
    name: "City Catering Service",
    type: "Catering Company",
    date: "Jul 8, 2026",
  },
  {
    id: "7",
    name: "Harbor View Restauran",
    type: "Restaurant",
    date: "Jul 10, 2026",
  },
  {
    id: "8",
    name: "Uptown Steakhouse LL",
    type: "Restaurant",
    date: "Jul 11, 2026",
  },
  {
    id: "9",
    name: "Jersey Fresh Marke",
    type: "Supermarket / Grocery",
    date: "Jul 12, 2026",
  },
  {
    id: "10",
    name: "Queens Food Hub",
    type: "Distributor / Wholesaler",
    date: "Jul 13, 2026",
  },
];

/* ------------------------------------------------------------------ */
/*  Status Badge                                                       */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
    Confirmed: "bg-blue-50 text-blue-600 border-blue-200",
    Pending: "bg-amber-50 text-amber-600 border-amber-200",
    Preparing: "bg-purple-50 text-purple-600 border-purple-200",
    Cancelled: "bg-red-50 text-red-500 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-nunito-semibold border ${
        styles[status] || "bg-slate-50 text-slate-500 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard Page                                                     */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const router = useRouter();
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const { data: dbCustomers, isLoading: isCustomersLoading } =
    useGetAllCustomersQuery({ limit: 100 });
  const { data: dbProducts, isLoading: isProductsLoading } =
    useGetAllProductsQuery({ limit: 100 });
  const { data: dbCategories, isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery({ limit: 100 });
  const { data: dbOrders, isLoading: isOrdersLoading } = useGetAllOrdersQuery({
    limit: 100,
  });

  const isLoading =
    isCustomersLoading ||
    isProductsLoading ||
    isCategoriesLoading ||
    isOrdersLoading;

  // Customers calculations
  const totalCustomers = dbCustomers?.data?.result?.length || 0;
  const pendingCustomers =
    dbCustomers?.data?.result?.filter((c) => !c.isAdminVerified) || [];
  const pendingCustomersCount = pendingCustomers.length;

  // Products calculations
  const totalProducts = dbProducts?.data?.result?.length || 0;
  const outOfStockProductsCount =
    dbProducts?.data?.result?.filter((p) => p.availability === "out_of_stock")
      .length || 0;
  const totalCategories = dbCategories?.data?.result?.length || 0;

  // Orders calculations
  const allOrders = dbOrders?.data?.result || [];
  const totalOrdersCount = allOrders.length;
  const pendingOrdersCount = allOrders.filter(
    (o) => o.status === "received",
  ).length;
  const deliveredOrdersCount = allOrders.filter(
    (o) => o.status === "delivered",
  ).length;
  const totalRevenue = allOrders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  // Recent orders: pick top 7 latest orders
  const recentOrders = allOrders.slice(0, 7).map((ord) => ({
    dbId: ord._id,
    id: ord.orderNumber,
    customer: ord.customer?.name || "Unknown Customer",
    items: ord.items?.length || 0,
    total: ord.totalPrice,
    date: new Date(ord.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    status:
      ord.status === "received"
        ? "Pending"
        : ord.status === "confirmed"
          ? "Confirmed"
          : ord.status === "preparing"
            ? "Preparing"
            : ord.status === "delivered"
              ? "Delivered"
              : "Cancelled",
  }));

  // Pending approvals: map customers where isAdminVerified is false
  const pendingApprovals = pendingCustomers.slice(0, 5).map((cust) => ({
    id: cust._id,
    name: cust.businessName || cust.name || "Unnamed Business",
    type: cust.businessType || "Retail",
    date: new Date(cust.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-brand-primary"></div>
        <p className="text-slate-400 text-xs font-nunito mt-4">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-nunito-bold text-slate-800">
            Dashboard
          </h1>
          <p className="text-sm font-nunito text-slate-500 mt-1">
            {"Welcome back, Admin. Here's what's happening today."}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-full px-4 py-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-nunito-semibold text-slate-600">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Stat Cards - Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        <StatCard
          icon={<DoubleManIcon size={22} color="#1D4ED8" />}
          iconBgClass="bg-blue-50"
          value={totalCustomers}
          label="Total Customers"
          subtitle={`${pendingCustomersCount} pending`}
        />
        <StatCard
          icon={<OneManWithCheckIcon size={22} color="#D97706" />}
          iconBgClass="bg-amber-50"
          value={pendingCustomersCount}
          label="Pending Approval"
          attention={pendingCustomersCount > 0}
        />
        <StatCard
          icon={<TotalProductsBoxIcon size={22} color="#059669" />}
          iconBgClass="bg-emerald-50"
          value={totalProducts}
          label="Total Products"
          subtitle={`${totalCategories} categories`}
        />
        <StatCard
          icon={<OutOfStockDangerIcon size={22} color="#DC2626" />}
          iconBgClass="bg-red-50"
          value={outOfStockProductsCount}
          label="Out of Stock"
          attention={outOfStockProductsCount > 0}
        />
      </div>

      {/* Stat Cards - Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={<TotalOrdersIcon size={22} color="#059669" />}
          iconBgClass="bg-emerald-50"
          value={totalOrdersCount}
          label="Total Orders"
        />
        <StatCard
          icon={<ClockIcon size={22} color="#EA580C" />}
          iconBgClass="bg-orange-50"
          value={pendingOrdersCount}
          label="Pending Orders"
          attention={pendingOrdersCount > 0}
        />
        <StatCard
          icon={<DoubleCheckIcon size={22} color="#16A34A" />}
          iconBgClass="bg-emerald-50"
          value={deliveredOrdersCount}
          label="Delivered"
          subtitle="all time"
        />
        <StatCard
          icon={<DollarIcon size={22} color="#0891B2" />}
          iconBgClass="bg-cyan-50"
          value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          label="Total Revenue"
          subtitle="from completed orders"
        />
      </div>

      {/* Recent Orders & Pending Approvals */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <h2 className="text-base font-nunito-bold text-slate-800">
              Recent Orders
            </h2>
            <Link
              href="/dashboard/orders"
              className="text-xs font-nunito-bold text-red-700 hover:text-red-800 transition-colors flex items-center gap-1"
            >
              View All
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="text-left px-6 py-3 text-[11px] font-nunito-semibold text-slate-400 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-nunito-semibold text-slate-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-nunito-semibold text-slate-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-nunito-semibold text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-nunito-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-nunito-semibold text-slate-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-sm text-slate-400 font-nunito"
                    >
                      No recent orders found.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50  transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <span className="text-sm font-nunito-semibold text-slate-700">
                          {order.id}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-sm font-nunito-medium text-slate-700 leading-tight">
                            {order.customer}
                          </p>
                          <p className="text-[11px] font-nunito text-slate-400">
                            {order.items} item{order.items !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-nunito-bold text-[#B91C1C]">
                          ${order.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-nunito text-slate-500">
                          {order.date}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/orders/${order.dbId}`)
                          }
                          className="text-sm font-nunito-semibold px-[10px] py-[4px] bg-slate-200 rounded-[10px] text-slate-700 hover:bg-slate-300 hover:text-slate-600 transition-colors cursor-pointer select-none"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Approvals Panel */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <h2 className="text-base font-nunito-bold text-slate-800">
              Pending Approvals
            </h2>
            <Link
              href="/dashboard/customers"
              className="text-xs font-nunito-bold text-red-700 hover:text-red-800 transition-colors"
            >
              All Customers
            </Link>
          </div>

          {/* Approval Cards */}
          <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto">
            {pendingApprovals.length === 0 ? (
              <p className="text-center text-sm text-slate-400 font-nunito py-8">
                No pending approvals.
              </p>
            ) : (
              pendingApprovals.map((customer, index) => (
                <div
                  key={index}
                  className="bg-slate-50/70 rounded-xl p-4 border border-amber-200 hover:border-amber-300 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-nunito-bold text-slate-700 truncate">
                        {customer.name}
                      </p>
                      <p className="text-[11px] font-nunito text-slate-400">
                        {customer.type}
                      </p>
                    </div>
                    <span className="bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-nunito-bold px-2.5 py-0.5 rounded-full shrink-0 ml-2">
                      Pending
                    </span>
                  </div>
                  <p className="text-[11px] font-nunito text-slate-400 mb-2.5">
                    {customer.date}
                  </p>
                  <button
                    onClick={() =>
                      router.push(`/dashboard/customers/${customer.id}`)
                    }
                    className="text-xs font-nunito-bold text-slate-600 hover:text-slate-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
