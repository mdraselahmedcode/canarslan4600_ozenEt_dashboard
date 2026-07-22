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
    name: "City Catering Service",
    type: "Catering Company",
    date: "Jul 8, 2026",
  },
  {
    name: "Harbor View Restauran",
    type: "Restaurant",
    date: "Jul 10, 2026",
  },
  {
    name: "Uptown Steakhouse LL",
    type: "Restaurant",
    date: "Jul 11, 2026",
  },
  {
    name: "Jersey Fresh Marke",
    type: "Supermarket / Grocery",
    date: "Jul 12, 2026",
  },
  {
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
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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
          value={12}
          label="Total Customers"
          subtitle="3 pending"
        />
        <StatCard
          icon={<OneManWithCheckIcon size={22} color="#D97706" />}
          iconBgClass="bg-amber-50"
          value={5}
          label="Pending Approval"
          attention
        />
        <StatCard
          icon={<TotalProductsBoxIcon size={22} color="#059669" />}
          iconBgClass="bg-emerald-50"
          value={18}
          label="Total Products"
          subtitle="5 categories"
        />
        <StatCard
          icon={<OutOfStockDangerIcon size={22} color="#DC2626" />}
          iconBgClass="bg-red-50"
          value={1}
          label="Out of Stock"
          attention
        />
      </div>

      {/* Stat Cards - Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={<TotalOrdersIcon size={22} color="#059669" />}
          iconBgClass="bg-emerald-50"
          value={10}
          label="Total Orders"
        />
        <StatCard
          icon={<ClockIcon size={22} color="#EA580C" />}
          iconBgClass="bg-orange-50"
          value={2}
          label="Pending Orders"
          attention
        />
        <StatCard
          icon={<DoubleCheckIcon size={22} color="#16A34A" />}
          iconBgClass="bg-emerald-50"
          value={3}
          label="Delivered"
          subtitle="all time"
        />
        <StatCard
          icon={<DollarIcon size={22} color="#0891B2" />}
          iconBgClass="bg-cyan-50"
          value="$1,240.3"
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
                {recentOrders.map((order) => (
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
                      <Link
                        href={`/dashboard/orders`}
                        className="text-sm font-nunito-semibold px-[10px] py-[4px] bg-slate-200 rounded-[10px] text-slate-700 hover:bg-slate-300 hover:text-slate-600 transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
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
            {pendingApprovals.map((customer, index) => (
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
                <button className="text-xs font-nunito-bold text-slate-600 hover:text-slate-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
