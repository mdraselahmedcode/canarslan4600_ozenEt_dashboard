"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { BackIcon, LocationIcon } from "@/components/icons";
import { Order } from "../page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);

  // Load order details from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ozenet_orders");
    if (saved) {
      const list: Order[] = JSON.parse(saved);
      const found = list.find((o) => o.id === "#" + id);
      if (found) {
        setOrder(found);
      }
    }
  }, [id]);

  if (!order) {
    return (
      <div className="p-8 text-center font-nunito">
        <p className="text-slate-500">Order not found.</p>
        <Link
          href="/dashboard/orders"
          className="text-brand-primary mt-4 inline-block hover:underline"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  // Helper to determine status order on timeline
  const getTimelineStepStatus = (
    step: "Pending" | "Confirmed" | "Preparing" | "Delivered",
  ) => {
    const statusPriority = {
      Pending: 1,
      Confirmed: 2,
      Preparing: 3,
      Delivered: 4,
    };

    if (order.status === "Cancelled") {
      return "cancelled";
    }

    const currentPriority = statusPriority[order.status];
    const stepPriority = statusPriority[step];

    if (currentPriority >= stepPriority) {
      return "completed";
    }
    return "pending";
  };

  return (
    <div className="p-8">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm bg-white"
          >
            <BackIcon width={16} height={16} color="currentColor" />
            <span>Back</span>
          </Link>
          <div>
            <h1 className="text-xl font-nunito-bold text-slate-800 leading-tight">
              {order.id}
            </h1>
            <p className="text-xs font-nunito text-slate-400 mt-1">
              {`${order.date} • ${order.customerName}`}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {order.status === "Pending" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-nunito-bold bg-amber-50 text-[#D97706] border border-[#FEF3C7]">
              Pending
            </span>
          )}
          {order.status === "Confirmed" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-nunito-bold bg-blue-50 text-[#3B82F6] border border-[#DBEAFE]">
              Confirmed
            </span>
          )}
          {order.status === "Preparing" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-nunito-bold bg-orange-50 text-[#F97316] border border-[#FFEDD5]">
              Preparing
            </span>
          )}
          {order.status === "Delivered" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-nunito-bold bg-emerald-50 text-[#16A34A] border border-[#DCFCE7]">
              Delivered
            </span>
          )}
          {order.status === "Cancelled" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-nunito-bold bg-red-50 text-[#DC2626] border border-[#FEE2E2]">
              Cancelled
            </span>
          )}
        </div>
      </div>

      {/* Two Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Customer Information Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-base font-nunito-bold text-slate-800 mb-4">
              Customer Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-nunito-bold text-slate-800 leading-tight">
                  {order.customerName}
                </p>
                <p className="text-xs font-nunito text-slate-400 mt-1">
                  {order.contactName}
                </p>
              </div>

              <div className="text-xs font-nunito text-slate-400 space-y-0.5">
                <p>{order.email}</p>
                <p>{order.phone}</p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-start gap-2.5">
                <span className="text-slate-400 mt-0.5">
                  <LocationIcon size={14} color="currentColor" />
                </span>
                <p className="text-xs font-nunito text-slate-500 leading-relaxed">
                  {order.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-base font-nunito-bold text-slate-800 mb-6">
              Order Items ({order.items.length})
            </h2>
            <div className="divide-y divide-slate-50">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 relative shrink-0 shadow-inner">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-nunito-bold text-slate-700">
                        {item.name}
                      </p>
                      <p className="text-xs font-nunito-semibold text-slate-400 mt-1">
                        {item.qty} {item.unit} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-nunito-bold text-slate-700">
                    ${(item.qty * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="border-t border-slate-100 pt-5 mt-6 flex items-center justify-between">
              <span className="text-base font-nunito-bold text-slate-800">
                Total
              </span>
              <span className="text-xl font-nunito-bold text-[#C4202B]">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-base font-nunito-bold text-slate-800 mb-6">
              Order Timeline
            </h2>

            {order.status === "Cancelled" ? (
              <div className="flex flex-col items-center justify-center p-6 bg-red-50/20 border border-red-100/50 rounded-2xl">
                <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-nunito-bold mb-2">
                  ✕
                </span>
                <p className="text-sm font-nunito-bold text-slate-700">
                  Order Cancelled
                </p>
                <p className="text-xs font-nunito text-slate-400 mt-1">
                  This order was cancelled on {order.date}
                </p>
              </div>
            ) : (
              <div className="relative pl-8 border-l-2 border-slate-100 space-y-8 ml-3 py-1">
                {/* Step 1: Order Received */}
                <div className="relative">
                  {/* Indicator Dot */}
                  <span className="absolute -left-[45px] -top-0.5 w-6 h-6 rounded-full bg-emerald-500 border border-white text-white flex items-center justify-center text-xs font-nunito-bold shadow-sm">
                    ✓
                  </span>
                  <div>
                    <h3 className="text-sm font-nunito-bold text-slate-700">
                      Order Received
                    </h3>
                    <p className="text-xs font-nunito text-slate-400 mt-0.5">
                      Order was successfully placed by customer.
                    </p>
                  </div>
                </div>

                {/* Step 2: Confirmed */}
                <div className="relative">
                  {/* Indicator Dot */}
                  {getTimelineStepStatus("Confirmed") === "completed" ? (
                    <span className="absolute -left-[45px] -top-0.5 w-6 h-6 rounded-full bg-emerald-500 border border-white text-white flex items-center justify-center text-xs font-nunito-bold shadow-sm">
                      ✓
                    </span>
                  ) : (
                    <span className="absolute -left-[45px] -top-0.5 w-6 h-6 rounded-full bg-slate-100 border border-white text-slate-400 flex items-center justify-center text-[10px] shadow-sm">
                      ●
                    </span>
                  )}
                  <div>
                    <h3
                      className={`text-sm font-nunito-bold ${
                        getTimelineStepStatus("Confirmed") === "completed"
                          ? "text-slate-700"
                          : "text-slate-400"
                      }`}
                    >
                      Confirmed
                    </h3>
                    {order.status === "Confirmed" && (
                      <p className="text-[10px] text-blue-500 font-nunito-semibold mt-0.5">
                        Current status
                      </p>
                    )}
                  </div>
                </div>

                {/* Step 3: Preparing */}
                <div className="relative">
                  {/* Indicator Dot */}
                  {getTimelineStepStatus("Preparing") === "completed" ? (
                    <span className="absolute -left-[45px] -top-0.5 w-6 h-6 rounded-full bg-emerald-500 border border-white text-white flex items-center justify-center text-xs font-nunito-bold shadow-sm">
                      ✓
                    </span>
                  ) : (
                    <span className="absolute -left-[45px] -top-0.5 w-6 h-6 rounded-full bg-slate-100 border border-white text-slate-400 flex items-center justify-center text-[10px] shadow-sm">
                      ●
                    </span>
                  )}
                  <div>
                    <h3
                      className={`text-sm font-nunito-bold ${
                        getTimelineStepStatus("Preparing") === "completed"
                          ? "text-slate-700"
                          : "text-slate-400"
                      }`}
                    >
                      Preparing
                    </h3>
                    {order.status === "Preparing" && (
                      <p className="text-[10px] text-orange-500 font-nunito-semibold mt-0.5">
                        Current status
                      </p>
                    )}
                  </div>
                </div>

                {/* Step 4: Delivered */}
                <div className="relative">
                  {/* Indicator Dot */}
                  {getTimelineStepStatus("Delivered") === "completed" ? (
                    <span className="absolute -left-[45px] -top-0.5 w-6 h-6 rounded-full bg-emerald-500 border border-white text-white flex items-center justify-center text-xs font-nunito-bold shadow-sm">
                      ✓
                    </span>
                  ) : (
                    <span className="absolute -left-[45px] -top-0.5 w-6 h-6 rounded-full bg-slate-100 border border-white text-slate-400 flex items-center justify-center text-[10px] shadow-sm">
                      ●
                    </span>
                  )}
                  <div>
                    <h3
                      className={`text-sm font-nunito-bold ${
                        getTimelineStepStatus("Delivered") === "completed"
                          ? "text-slate-700"
                          : "text-slate-400"
                      }`}
                    >
                      Delivered
                    </h3>
                    {order.status === "Delivered" && (
                      <p className="text-[10px] text-emerald-500 font-nunito-semibold mt-0.5">
                        Current status
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
