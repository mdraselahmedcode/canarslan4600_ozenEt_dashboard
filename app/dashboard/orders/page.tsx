"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface OrderItem {
  name: string;
  qty: number;
  unit: string;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: "Pending" | "Confirmed" | "Preparing" | "Delivered" | "Cancelled";
}

const initialOrders: Order[] = [
  {
    id: "#OE-2026-010",
    customerName: "Bosphorus Restaurant Group",
    contactName: "James Wilson",
    email: "james@bosphorus-restaurant.com",
    phone: "+1 (212) 555-1234",
    address: "42 Hudson St, Manhattan, NY 10013",
    date: "Jun 28, 2026",
    status: "Delivered",
    total: 246.5,
    items: [
      {
        name: "Chicken Thighs",
        qty: 15,
        unit: "kg",
        price: 10.5,
        image: "https://images.unsplash.com/photo-1606728035253-49e196302c42?auto=format&fit=crop&q=80&w=300",
      },
      {
        name: "Chicken Wings",
        qty: 10,
        unit: "kg",
        price: 8.9,
        image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=300",
      },
    ],
  },
  {
    id: "#OE-2026-009",
    customerName: "The Blue Butcher Shop",
    contactName: "Emily Carter",
    email: "emily@bluebutcher.com",
    phone: "+1 (648) 555-3456",
    address: "75 9th Ave, New York, NY 10011",
    date: "Jul 7, 2026",
    status: "Confirmed",
    total: 306.5,
    items: [
      {
        name: "Diced Beef",
        qty: 5,
        unit: "kg",
        price: 29.8,
        image: "https://images.unsplash.com/photo-1588168333986-5078647aa981?auto=format&fit=crop&q=80&w=300",
      },
      {
        name: "Cured Beef (Pastirma)",
        qty: 3,
        unit: "pkg",
        price: 52.5,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300",
      },
    ],
  },
  {
    id: "#OE-2026-008",
    customerName: "Manhattan Food Distributors",
    contactName: "David Kim",
    email: "david@mfdistributors.com",
    phone: "+1 (212) 555-9012",
    address: "123 Washington St, New York, NY 10006",
    date: "Jul 13, 2025",
    status: "Pending",
    total: 2050.0,
    items: [
      {
        name: "Beef Tenderloin",
        qty: 30,
        unit: "kg",
        price: 38.5,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300",
      },
      {
        name: "Lamb Leg",
        qty: 20,
        unit: "each",
        price: 44.75,
        image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&q=80&w=300",
      },
    ],
  },
  {
    id: "#OE-2026-007",
    customerName: "Manhattan Food Distributors",
    contactName: "David Kim",
    email: "david@mfdistributors.com",
    phone: "+1 (212) 555-9012",
    address: "123 Washington St, New York, NY 10006",
    date: "Jul 10, 2025",
    status: "Preparing",
    total: 1749.0,
    items: [
      {
        name: "Frozen Beef",
        qty: 50,
        unit: "case",
        price: 14.5,
        image: "https://images.unsplash.com/photo-1588168333986-5078647aa981?auto=format&fit=crop&q=80&w=300",
      },
      {
        name: "Frozen Lamb",
        qty: 80,
        unit: "case",
        price: 12.8,
        image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&q=80&w=300",
      },
    ],
  },
  {
    id: "#OE-2026-006",
    customerName: "Brooklyn Artisan Kitchen",
    contactName: "Marco Rossi",
    email: "marco@brooklynartisan.com",
    phone: "+1 (718) 555-2345",
    address: "88 Atlantic Ave, Brooklyn, NY 11201",
    date: "Jul 5, 2026",
    status: "Delivered",
    total: 384.8,
    items: [
      {
        name: "Diced Beef",
        qty: 8,
        unit: "kg",
        price: 29.8,
        image: "https://images.unsplash.com/photo-1588168333986-5078647aa981?auto=format&fit=crop&q=80&w=300",
      },
      {
        name: "Butcher's Meatballs",
        qty: 5,
        unit: "pack",
        price: 29.28,
        image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=300",
      },
    ],
  },
  {
    id: "#OE-2026-005",
    customerName: "Brooklyn Artisan Kitchen",
    contactName: "Marco Rossi",
    email: "marco@brooklynartisan.com",
    phone: "+1 (718) 555-2345",
    address: "88 Atlantic Ave, Brooklyn, NY 11201",
    date: "Jun 20, 2026",
    status: "Cancelled",
    total: 294.0,
    items: [
      {
        name: "Whole Chicken",
        qty: 30,
        unit: "each",
        price: 9.8,
        image: "https://images.unsplash.com/photo-1587593817642-8b98df728645?auto=format&fit=crop&q=80&w=300",
      },
    ],
  },
  {
    id: "#OE-2026-004",
    customerName: "Grand Hotel New York",
    contactName: "Sarah Chen",
    email: "procurement@grandhotelny.com",
    phone: "+1 (212) 555-5678",
    address: "109 W 57th St, New York, NY 10019",
    date: "Jul 12, 2025",
    status: "Pending",
    total: 596.0,
    items: [
      {
        name: "Diced Beef",
        qty: 20,
        unit: "kg",
        price: 29.8,
        image: "https://images.unsplash.com/photo-1588168333986-5078647aa981?auto=format&fit=crop&q=80&w=300",
      },
    ],
  },
  {
    id: "#OE-2026-003",
    customerName: "Grand Hotel New York",
    contactName: "Sarah Chen",
    email: "procurement@grandhotelny.com",
    phone: "+1 (212) 555-5678",
    address: "109 W 57th St, New York, NY 10019",
    date: "Jul 9, 2026",
    status: "Confirmed",
    total: 601.5,
    items: [
      {
        name: "Ground Beef",
        qty: 15,
        unit: "kg",
        price: 24.9,
        image: "https://images.unsplash.com/photo-1529692236671-f1f6e946a88a?auto=format&fit=crop&q=80&w=300",
      },
      {
        name: "Beef Chops",
        qty: 10,
        unit: "kg",
        price: 22.8,
        image: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&q=80&w=300",
      },
    ],
  },
  {
    id: "#OE-2026-002",
    customerName: "Bosphorus Restaurant Group",
    contactName: "James Wilson",
    email: "james@bosphorus-restaurant.com",
    phone: "+1 (212) 555-1234",
    address: "42 Hudson St, Manhattan, NY 10013",
    date: "Jul 8, 2028",
    status: "Preparing",
    total: 642.0,
    items: [
      {
        name: "Ribeye Steak",
        qty: 5,
        unit: "kg",
        price: 42.0,
        image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=300",
      },
      {
        name: "Lamb Shoulder",
        qty: 8,
        unit: "kg",
        price: 54.0,
        image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=300",
      },
    ],
  },
  {
    id: "#OE-2026-001",
    customerName: "Bosphorus Restaurant Group",
    contactName: "James Wilson",
    email: "james@bosphorus-restaurant.com",
    phone: "+1 (212) 555-1234",
    address: "42 Hudson St, Manhattan, NY 10013",
    date: "Jul 1, 2026",
    status: "Delivered",
    total: 609.0,
    items: [
      {
        name: "Beef Tenderloin",
        qty: 10,
        unit: "kg",
        price: 38.5,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300",
      },
      {
        name: "Chicken Breast",
        qty: 20,
        unit: "kg",
        price: 11.2,
        image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=300",
      },
    ],
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ozenet_orders");
    if (saved) {
      setOrders(JSON.parse(saved));
    } else {
      localStorage.setItem("ozenet_orders", JSON.stringify(initialOrders));
      setOrders(initialOrders);
    }
  }, []);

  // Filtered List
  const filteredOrders = orders.filter((o) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(query) || o.customerName.toLowerCase().includes(query);
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate dynamic stats
  const countPending = orders.filter((o) => o.status === "Pending").length;
  const countConfirmed = orders.filter((o) => o.status === "Confirmed").length;
  const countPreparing = orders.filter((o) => o.status === "Preparing").length;
  const countDelivered = orders.filter((o) => o.status === "Delivered").length;
  const countCancelled = orders.filter((o) => o.status === "Cancelled").length;

  // Revenue (Delivered orders sum)
  const deliveredRevenue = orders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-nunito-bold text-slate-800">Orders</h1>
        <p className="text-sm font-nunito text-slate-500 mt-1">
          {orders.length} total orders
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 mb-8">
        {/* Pending */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center">
          <p className="text-2xl font-nunito-bold text-[#D97706] leading-tight">
            {countPending}
          </p>
          <p className="text-xs font-nunito-medium text-slate-400 mt-2">Pending</p>
        </div>

        {/* Confirmed */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center">
          <p className="text-2xl font-nunito-bold text-[#3B82F6] leading-tight">
            {countConfirmed}
          </p>
          <p className="text-xs font-nunito-medium text-slate-400 mt-2">Confirmed</p>
        </div>

        {/* Preparing */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center">
          <p className="text-2xl font-nunito-bold text-[#F97316] leading-tight">
            {countPreparing}
          </p>
          <p className="text-xs font-nunito-medium text-slate-400 mt-2">Preparing</p>
        </div>

        {/* Delivered */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center">
          <p className="text-2xl font-nunito-bold text-[#16A34A] leading-tight">
            {countDelivered}
          </p>
          <p className="text-xs font-nunito-medium text-slate-400 mt-2">Delivered</p>
        </div>

        {/* Cancelled */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center">
          <p className="text-2xl font-nunito-bold text-[#DC2626] leading-tight">
            {countCancelled}
          </p>
          <p className="text-xs font-nunito-medium text-slate-400 mt-2">Cancelled</p>
        </div>
      </div>

      {/* Filter and Count Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-600 bg-white transition-all shadow-sm cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs font-nunito">
          <span className="text-slate-400">{filteredOrders.length} orders</span>
          <span className="text-[#16A34A] font-nunito-bold text-sm">
            Revenue: ${deliveredRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider pl-4">
                  Order
                </th>
                <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider text-right pr-6">
                  Total
                </th>
                <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider text-center">
                  Date
                </th>
                <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider text-right pr-8">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((o) => (
                <tr
                  key={o.id}
                  className="hover:bg-slate-50/30 transition-all duration-150"
                >
                  {/* Order ID */}
                  <td className="px-6 py-4 pl-4 font-nunito-bold text-slate-800 text-sm">
                    {o.id}
                  </td>

                  {/* Customer Name */}
                  <td className="px-6 py-4 text-sm font-nunito-semibold text-slate-600">
                    {o.customerName}
                  </td>

                  {/* Items */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-1.5 max-w-[280px]">
                      {o.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-50 text-slate-500 border border-slate-200/50 rounded-lg text-[10px] font-nunito px-2 py-0.5"
                        >
                          {item.name.split(" ")[0]} ×{item.qty}
                          {item.unit}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4 text-right pr-6 font-nunito-bold text-[#C4202B] text-sm">
                    ${o.total.toFixed(2)}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-center text-xs font-nunito text-slate-400">
                    {o.date}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    {o.status === "Pending" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-nunito-bold bg-amber-50 text-[#D97706] border border-[#FEF3C7]">
                        Pending
                      </span>
                    )}
                    {o.status === "Confirmed" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-nunito-bold bg-blue-50 text-[#3B82F6] border border-[#DBEAFE]">
                        Confirmed
                      </span>
                    )}
                    {o.status === "Preparing" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-nunito-bold bg-orange-50 text-[#F97316] border border-[#FFEDD5]">
                        Preparing
                      </span>
                    )}
                    {o.status === "Delivered" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-nunito-bold bg-emerald-50 text-[#16A34A] border border-[#DCFCE7]">
                        Delivered
                      </span>
                    )}
                    {o.status === "Cancelled" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-nunito-bold bg-red-50 text-[#DC2626] border border-[#FEE2E2]">
                        Cancelled
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right pr-8">
                    <button
                      onClick={() => router.push(`/dashboard/orders/${o.id.replace("#", "")}`)}
                      className="px-3 py-1 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-nunito-semibold cursor-pointer shadow-sm transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
