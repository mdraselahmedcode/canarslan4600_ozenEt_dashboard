"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BuildingIcon, DeleteIcon, EyeIcon } from "@/components/icons";

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
}

const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "Bosphorus Restaurant Group",
    code: "US-1734567890",
    contactName: "James Wilson",
    contactEmail: "james@bosphorus-restaurant.com",
    phone: "+1 (212) 555-1234",
    businessType: "Restaurant",
    registeredDate: "Jan 15, 2026",
    ordersCount: 24,
    totalSpent: 48550,
    status: "Approved",
  },
  {
    id: "2",
    name: "Grand Hotel New York",
    code: "US-9876543210",
    contactName: "Sarah Chen",
    contactEmail: "procurement@grandhotelny.com",
    phone: "+1 (212) 555-5678",
    businessType: "Hotel",
    registeredDate: "Feb 3, 2028",
    ordersCount: 18,
    totalSpent: 32400,
    status: "Approved",
  },
  {
    id: "3",
    name: "Brooklyn Artisan Kitchen",
    code: "US-1122334455",
    contactName: "Marco Rossi",
    contactEmail: "marco@brooklynartisan.com",
    phone: "+1 (718) 555-2345",
    businessType: "Restaurant",
    registeredDate: "Feb 20, 2026",
    ordersCount: 12,
    totalSpent: 21600,
    status: "Approved",
  },
  {
    id: "4",
    name: "Manhattan Food Distributors",
    code: "US-5544332211",
    contactName: "David Kim",
    contactEmail: "david@mfdistributors.com",
    phone: "+1 (212) 555-9012",
    businessType: "Distributor / Wholesaler",
    registeredDate: "Jan 8, 2026",
    ordersCount: 35,
    totalSpent: 87500,
    status: "Approved",
  },
  {
    id: "5",
    name: "The Blue Butcher Shop",
    code: "US-6677889900",
    contactName: "Emily Carter",
    contactEmail: "emily@bluebutcher.com",
    phone: "+1 (648) 555-3456",
    businessType: "Butcher Shop",
    registeredDate: "Mar 10, 2026",
    ordersCount: 9,
    totalSpent: 18200,
    status: "Approved",
  },
  {
    id: "6",
    name: "City Catering Services",
    code: "US-2233445566",
    contactName: "Robert Davis",
    contactEmail: "robert@citycatering.com",
    phone: "+1 (212) 555-7890",
    businessType: "Catering Company",
    registeredDate: "Jul 8, 2026",
    ordersCount: 0,
    totalSpent: 0,
    status: "Pending",
  },
  {
    id: "7",
    name: "Harbor View Restaurant",
    code: "US-3344556677",
    contactName: "Lisa Park",
    contactEmail: "lisa@harborview.com",
    phone: "+1 (917) 555-1122",
    businessType: "Restaurant",
    registeredDate: "Jul 10, 2028",
    ordersCount: 0,
    totalSpent: 0,
    status: "Pending",
  },
  {
    id: "8",
    name: "Uptown Steakhouse LLC",
    code: "US-4455667788",
    contactName: "Michael Brown",
    contactEmail: "mbrown@uptownsteak.com",
    phone: "+1 (212) 555-3344",
    businessType: "Restaurant",
    registeredDate: "Jul 11, 2026",
    ordersCount: 0,
    totalSpent: 0,
    status: "Pending",
  },
  {
    id: "9",
    name: "Jersey Fresh Market",
    code: "US-7788990011",
    contactName: "Anna Thompson",
    contactEmail: "anna@jerseyfresh.com",
    phone: "+1 (201) 555-5566",
    businessType: "Supermarket / Grocery",
    registeredDate: "Jul 12, 2028",
    ordersCount: 0,
    totalSpent: 0,
    status: "Pending",
  },
  {
    id: "10",
    name: "Queens Food Hub",
    code: "US-8899001122",
    contactName: "Carlos Martinez",
    contactEmail: "carlos@queensfoodhub.com",
    phone: "+1 (718) 555-8677",
    businessType: "Distributor / Wholesaler",
    registeredDate: "Jul 13, 2026",
    ordersCount: 0,
    totalSpent: 0,
    status: "Pending",
  },
  {
    id: "11",
    name: "Riverside Café & Bistro",
    code: "US-9900112233",
    contactName: "Jennifer Lee",
    contactEmail: "jen@riversidecafe.com",
    phone: "+1 (212) 555-8899",
    businessType: "Café",
    registeredDate: "Jun 1, 2028",
    ordersCount: 0,
    totalSpent: 0,
    status: "Rejected",
  },
  {
    id: "12",
    name: "Old Town Diner",
    code: "US-1100223344",
    contactName: "Frank Miller",
    contactEmail: "frank@oldtowndiner.com",
    phone: "+1 (718) 555-0011",
    businessType: "Restaurant",
    registeredDate: "Jun 10, 2026",
    ordersCount: 0,
    totalSpent: 0,
    status: "Rejected",
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "All" | "Approved" | "Pending" | "Rejected"
  >("All");

  // Handle Approve action
  const handleApprove = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Approved" } : c)),
    );
  };

  // Handle Reject action
  const handleReject = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Rejected" } : c)),
    );
  };

  // Handle Delete action
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Count items for Stats Grid
  const countApproved = customers.filter((c) => c.status === "Approved").length;
  const countPending = customers.filter((c) => c.status === "Pending").length;
  const countRejected = customers.filter((c) => c.status === "Rejected").length;

  // Filtered List
  const filteredCustomers = customers.filter((c) => {
    // Status Filter
    const matchesStatus =
      selectedFilter === "All" || c.status === selectedFilter;

    // Search Term Filter
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.code.toLowerCase().includes(query) ||
      c.contactName.toLowerCase().includes(query) ||
      c.contactEmail.toLowerCase().includes(query) ||
      c.businessType.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-nunito-bold text-slate-800">Customers</h1>
        <p className="text-sm font-nunito text-slate-500 mt-1">
          {`${customers.length} total businesses`}
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Approved Card */}
        <div
          onClick={() =>
            setSelectedFilter(
              selectedFilter === "Approved" ? "All" : "Approved",
            )
          }
          className={`p-6 rounded-2xl border bg-[#F0FDF4]/65 cursor-pointer hover:shadow-md transition-all duration-200 ${
            selectedFilter === "Approved"
              ? "border-[#22C55E] ring-1 ring-[#22C55E]"
              : "border-[#DCFCE7]"
          }`}
        >
          <div className="flex flex-col">
            <span className="text-3xl font-nunito-bold text-[#16A34A] leading-none mb-2">
              {countApproved}
            </span>
            <span className="text-xs font-nunito-bold text-[#16A34A] uppercase tracking-wider">
              Approved
            </span>
          </div>
        </div>

        {/* Pending Approval Card */}
        <div
          onClick={() =>
            setSelectedFilter(selectedFilter === "Pending" ? "All" : "Pending")
          }
          className={`p-6 rounded-2xl border bg-[#FFFBEB]/65 cursor-pointer hover:shadow-md transition-all duration-200 ${
            selectedFilter === "Pending"
              ? "border-[#D97706] ring-1 ring-[#D97706]"
              : "border-[#FEF3C7]"
          }`}
        >
          <div className="flex flex-col">
            <span className="text-3xl font-nunito-bold text-[#D97706] leading-none mb-2">
              {countPending}
            </span>
            <span className="text-xs font-nunito-bold text-[#D97706] uppercase tracking-wider">
              Pending Approval
            </span>
          </div>
        </div>

        {/* Rejected Card */}
        <div
          onClick={() =>
            setSelectedFilter(
              selectedFilter === "Rejected" ? "All" : "Rejected",
            )
          }
          className={`p-6 rounded-2xl border bg-[#FEF2F2]/65 cursor-pointer hover:shadow-md transition-all duration-200 ${
            selectedFilter === "Rejected"
              ? "border-[#DC2626] ring-1 ring-[#DC2626]"
              : "border-[#FEE2E2]"
          }`}
        >
          <div className="flex flex-col">
            <span className="text-3xl font-nunito-bold text-[#DC2626] leading-none mb-2">
              {countRejected}
            </span>
            <span className="text-xs font-nunito-bold text-[#DC2626] uppercase tracking-wider">
              Rejected
            </span>
          </div>
        </div>
      </div>

      {/* Filter Options & Search bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by company, contact, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400 bg-white"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) =>
                  setSelectedFilter(e.target.value as typeof selectedFilter)
                }
                className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer font-nunito"
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <span className="text-xs font-nunito-semibold text-slate-400 shrink-0">
              {`${filteredCustomers.length} customer${filteredCustomers.length !== 1 ? "s" : ""}`}
            </span>
          </div>
        </div>
      </div>

      {/* Customers Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="text-left px-6 py-4 text-[11px] font-nunito-semibold text-slate-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="text-left px-4 py-4 text-[11px] font-nunito-semibold text-slate-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-4 py-4 text-[11px] font-nunito-semibold text-slate-400 uppercase tracking-wider">
                  Phone
                </th>
                <th className="text-left px-4 py-4 text-[11px] font-nunito-semibold text-slate-400 uppercase tracking-wider">
                  Business Type
                </th>
                <th className="text-left px-4 py-4 text-[11px] font-nunito-semibold text-slate-400 uppercase tracking-wider">
                  Registered
                </th>
                <th className="text-left px-4 py-4 text-[11px] font-nunito-semibold text-slate-400 uppercase tracking-wider">
                  Orders
                </th>
                <th className="text-left px-4 py-4 text-[11px] font-nunito-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-[11px] font-nunito-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-10 text-sm font-nunito text-slate-400"
                  >
                    No customers found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-colors"
                  >
                    {/* Company Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                          <BuildingIcon size={14} color="currentColor" />
                        </div>
                        <div>
                          <p className="text-sm font-nunito-bold text-slate-700 leading-tight">
                            {customer.name}
                          </p>
                          <p className="text-[11px] font-nunito text-slate-400 mt-0.5">
                            {customer.code}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Column */}
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-nunito-semibold text-slate-700 leading-tight">
                          {customer.contactName}
                        </p>
                        <p className="text-[11px] font-nunito text-slate-400 mt-0.5">
                          {customer.contactEmail}
                        </p>
                      </div>
                    </td>

                    {/* Phone Column */}
                    <td className="px-4 py-4">
                      <span className="text-sm font-nunito text-slate-500">
                        {customer.phone}
                      </span>
                    </td>

                    {/* Business Type Column */}
                    <td className="px-4 py-4">
                      <span className="text-sm font-nunito text-slate-500">
                        {customer.businessType}
                      </span>
                    </td>

                    {/* Registered Date Column */}
                    <td className="px-4 py-4">
                      <span className="text-sm font-nunito text-slate-500">
                        {customer.registeredDate}
                      </span>
                    </td>

                    {/* Orders/Total Revenue Column */}
                    <td className="px-4 py-4">
                      {customer.status === "Approved" ? (
                        <div>
                          <p className="text-sm font-nunito-bold text-slate-700 leading-tight">
                            {customer.ordersCount}
                          </p>
                          <p className="text-[11px] font-nunito text-slate-400 mt-0.5">
                            {`$${customer.totalSpent.toLocaleString()}`}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm font-nunito text-slate-400">
                          —
                        </span>
                      )}
                    </td>

                    {/* Status Column */}
                    <td className="px-4 py-4">
                      {customer.status === "Approved" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-nunito-bold bg-emerald-50 text-[#16A34A] border border-[#DCFCE7]">
                          Approved
                        </span>
                      )}
                      {customer.status === "Pending" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-nunito-bold bg-amber-50 text-[#D97706] border border-[#FEF3C7]">
                          Pending
                        </span>
                      )}
                      {customer.status === "Rejected" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-nunito-bold bg-red-50 text-[#DC2626] border border-[#FEE2E2]">
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 text-right">
                      {customer.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/customers/${customer.id}`}
                            title="View Customer"
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg border border-slate-200 transition-all duration-200 cursor-pointer flex items-center justify-center"
                          >
                            <EyeIcon size={14} color="currentColor" />
                          </Link>
                          <button
                            onClick={() => handleApprove(customer.id)}
                            className="text-[11px] font-nunito-bold px-2.5 py-1.5 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] rounded-lg transition-all duration-200 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(customer.id)}
                            className="text-[11px] font-nunito-bold px-2.5 py-1.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-lg transition-all duration-200 cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/customers/${customer.id}`}
                            title="View Customer"
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg border border-slate-200 transition-all duration-200 cursor-pointer flex items-center justify-center"
                          >
                            <EyeIcon size={14} color="currentColor" />
                          </Link>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            title="Delete Customer"
                            className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg border border-red-200 transition-all duration-200 cursor-pointer"
                          >
                            <DeleteIcon size={14} color="currentColor" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
