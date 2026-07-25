"use client";

import React, { useState } from "react";
import { useGetSupportTicketsQuery } from "@/store/api/metaApi";

export default function SupportPage() {
  const [page, setPage] = useState(1);
  const { data: supportResponse, isLoading, isError } = useGetSupportTicketsQuery({
    page,
    limit: 20,
  });

  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  const tickets = supportResponse?.data?.result || [];
  const meta = supportResponse?.data?.meta;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-nunito-bold text-slate-800">Support Tickets</h1>
        <p className="text-sm font-nunito text-slate-500 mt-1">
          {meta?.total ? `${meta.total} support tickets received` : "Manage messages from users"}
        </p>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#FCFDFE]">
                <th className="px-6 py-4 text-xs font-nunito-bold text-slate-400 uppercase tracking-wider">
                  Customer / User
                </th>
                <th className="px-6 py-4 text-xs font-nunito-bold text-slate-400 uppercase tracking-wider">
                  Contact Reason
                </th>
                <th className="px-6 py-4 text-xs font-nunito-bold text-slate-400 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-4 text-xs font-nunito-bold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-nunito-bold text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-nunito-bold text-slate-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-sm font-nunito text-slate-400">
                    Loading support tickets...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-sm font-nunito text-red-500">
                    Failed to load support tickets. Please try again later.
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-sm font-nunito text-slate-400">
                    No support tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => {
                  const userName =
                    typeof ticket.user === "object"
                      ? ticket.user?.name || "MD Rasel Ahmed"
                      : "MD Rasel Ahmed";
                  const userEmail =
                    typeof ticket.user === "object"
                      ? ticket.user?.email || "customer@yopmail.com"
                      : "customer@yopmail.com";

                  return (
                    <tr key={ticket._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-nunito-semibold text-slate-700">
                            {userName}
                          </span>
                          <span className="text-xs font-nunito text-slate-400 mt-0.5">
                            {userEmail}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-nunito-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {ticket.contactReason}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-[280px]">
                        <p className="text-sm font-nunito text-slate-600 truncate">
                          {ticket.message}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-nunito-bold uppercase tracking-wider ${
                          ticket.status === "TODO"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-nunito text-slate-400">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-nunito-semibold transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {meta && meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-[#FCFDFE] flex items-center justify-between">
            <span className="text-xs font-nunito text-slate-500">
              Showing page {page} of {meta.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-nunito-medium disabled:opacity-50 transition-colors cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-nunito-medium disabled:opacity-50 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-[60] transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-100 relative mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-4 pb-3 border-b border-slate-50">
              <div>
                <h3 className="text-lg font-nunito-bold text-slate-800">
                  Support Ticket Details
                </h3>
                <p className="text-xs font-nunito text-slate-400 mt-0.5">
                  Created on {formatDate(selectedTicket.createdAt)}
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-nunito-bold bg-amber-50 text-amber-700 border border-amber-100">
                {selectedTicket.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="block text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                  From
                </span>
                <span className="text-sm font-nunito-semibold text-slate-700 block mt-0.5">
                  {typeof selectedTicket.user === "object"
                    ? selectedTicket.user?.name || "MD Rasel Ahmed"
                    : "MD Rasel Ahmed"}
                </span>
                <span className="text-xs font-nunito text-slate-500 block">
                  {typeof selectedTicket.user === "object"
                    ? selectedTicket.user?.email || "customer@yopmail.com"
                    : "customer@yopmail.com"}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                  Contact Reason
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-nunito-semibold bg-blue-50 text-blue-700 border border-blue-100 mt-1">
                  {selectedTicket.contactReason}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                  Message
                </span>
                <div className="mt-1 bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-nunito text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {selectedTicket.message}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-slate-50">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-nunito-semibold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
