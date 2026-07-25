"use client";

import React, { useState, useEffect } from "react";
import {
  BellIcon,
  MicIcon,
  DeleteIcon,
} from "@/components/icons";
import {
  useGetBulkNotificationsQuery,
  useCreateBulkNotificationMutation,
  useGetDashboardMetaQuery,
  useGetNotificationsQuery,
  useSeeNotificationsMutation,
  useDeleteNotificationMutation,
} from "@/store/api/metaApi";

type TabType = "system" | "bulk";

const TYPE_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  ORDER_RECEIVED: { label: "New Order", bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  ORDER_STATUS_UPDATED: { label: "Order Updated", bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  SUPPORT_CREATED: { label: "Support", bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  CUSTOMER_REGISTERED: { label: "New Customer", bg: "#F5F3FF", text: "#6D28D9", border: "#DDD6FE" },
  DEFAULT: { label: "Notification", bg: "#F8FAFC", text: "#475569", border: "#E2E8F0" },
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("system");

  // ─── Bulk notifications ───────────────────────────────────────────────────
  const {
    data: bulkResponse,
    isLoading: isBulkLoading,
    isError: isBulkError,
    refetch: refetchBulk,
  } = useGetBulkNotificationsQuery();
  const [createBulkNotification, { isLoading: isSending }] = useCreateBulkNotificationMutation();
  const { data: metaResponse } = useGetDashboardMetaQuery();

  // ─── System notifications ─────────────────────────────────────────────────
  const {
    data: sysResponse,
    isLoading: isSysLoading,
    refetch: refetchSys,
  } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000,
  });
  const [seeNotifications] = useSeeNotificationsMutation();
  const [deleteNotification, { isLoading: isDeleting }] = useDeleteNotificationMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Auto-mark all as seen when user opens the System tab
  useEffect(() => {
    if (activeTab === "system") {
      seeNotifications();
    }
  }, [activeTab]);

  // ─── Modal state ──────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [targetAudience, setTargetAudience] = useState("approved_customers");

  const bulkNotifications = bulkResponse?.data?.result || [];
  const sysNotifications = sysResponse?.data?.result || [];
  const sysUnread = sysResponse?.data?.meta?.unreadCount || 0;
  const activeCustomersCount = metaResponse?.data?.totalCustomer || 0;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this notification?")) return;
    setDeletingId(id);
    try {
      await deleteNotification(id).unwrap();
      refetchSys();
    } catch (err: any) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateClick = () => {
    setTitleInput("");
    setMessageInput("");
    setTargetAudience("approved_customers");
    setIsModalOpen(true);
  };

  const handleSend = async () => {
    if (!titleInput.trim() || !messageInput.trim()) {
      alert("Notification Title and Message are required.");
      return;
    }
    try {
      await createBulkNotification({ title: titleInput, message: messageInput, targetAudience }).unwrap();
      alert("Bulk notification sent successfully!");
      setIsModalOpen(false);
      refetchBulk();
    } catch (err: any) {
      alert(err?.data?.message || err?.message || "Failed to send bulk notification");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeConfig = (type: string) => TYPE_CONFIG[type] || TYPE_CONFIG.DEFAULT;

  return (
    <div className="p-8">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-nunito-bold text-slate-800">Notifications</h1>
          <p className="text-sm font-nunito text-slate-500 mt-1">
            {activeTab === "system"
              ? `${sysNotifications.length} system notification${sysNotifications.length !== 1 ? "s" : ""}${sysUnread > 0 ? ` · ${sysUnread} unread` : ""}`
              : `${bulkNotifications.length} bulk notification${bulkNotifications.length !== 1 ? "s" : ""} sent`}
          </p>
        </div>
        {activeTab === "bulk" && (
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm shadow-brand-primary/10 active:scale-[0.98]"
          >
            + Create Notification
          </button>
        )}
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-brand-primary flex items-center justify-center shrink-0">
            <BellIcon size={20} color="currentColor" />
          </div>
          <div>
            <p className="text-2xl font-nunito-bold text-slate-800 leading-tight">{sysUnread}</p>
            <p className="text-xs font-nunito-medium text-slate-400 mt-1">Unread System Alerts</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <MicIcon size={20} color="currentColor" />
          </div>
          <div>
            <p className="text-2xl font-nunito-bold text-slate-800 leading-tight">{bulkNotifications.length}</p>
            <p className="text-xs font-nunito-medium text-slate-400 mt-1">Bulk Notifications Sent</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-nunito-bold text-slate-800 leading-tight">{activeCustomersCount}</p>
            <p className="text-xs font-nunito-medium text-slate-400 mt-1">Active Customer Accounts</p>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-slate-100/70 rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab("system")}
          className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-nunito-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "system"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <BellIcon size={15} color="currentColor" />
          System Notifications
          {sysUnread > 0 && (
            <span className="min-w-[18px] h-[18px] bg-brand-primary text-white text-[10px] font-nunito-bold rounded-full flex items-center justify-center px-1">
              {sysUnread}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("bulk")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-nunito-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "bulk"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <MicIcon size={15} color="currentColor" />
          Bulk Notifications
        </button>
      </div>

      {/* ── System Notifications Tab ── */}
      {activeTab === "system" && (
        <div className="space-y-3">
          {isSysLoading ? (
            // Skeleton
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-slate-100 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))
          ) : sysNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <BellIcon size={24} color="#CBD5E1" />
              </div>
              <p className="text-sm font-nunito-bold text-slate-500">No system notifications</p>
              <p className="text-xs font-nunito text-slate-400 mt-1">
                System alerts for orders, support requests, and more will appear here.
              </p>
            </div>
          ) : (
            sysNotifications.map((n: any) => {
              const cfg = getTypeConfig(n.type);
              const isThisDeleting = deletingId === n._id;

              return (
                <div
                  key={n._id}
                  className={`group bg-white rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
                    !n.isRead ? "border-l-[3px] border-l-brand-primary border-slate-100" : "border-slate-100"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border text-sm font-bold"
                      style={{ backgroundColor: cfg.bg, color: cfg.text, borderColor: cfg.border }}
                    >
                      {n.type === "ORDER_RECEIVED" || n.type === "ORDER_STATUS_UPDATED" ? "📦" : n.type === "SUPPORT_CREATED" ? "💬" : "🔔"}
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-sm font-nunito-bold text-slate-700 leading-tight">
                          {n.title}
                        </h3>
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-nunito-bold border"
                          style={{ backgroundColor: cfg.bg, color: cfg.text, borderColor: cfg.border }}
                        >
                          {cfg.label}
                        </span>
                        {!n.isRead && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-nunito-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                            Unread
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-nunito text-slate-500 leading-relaxed mb-2">
                        {n.message}
                      </p>

                      {/* Meta details */}
                      {n.data?.meta && (
                        <div className="flex flex-wrap gap-3">
                          {n.data.meta.orderNumber && (
                            <span className="text-[10px] font-nunito-semibold text-slate-400">
                              Order: <span className="text-slate-600">{n.data.meta.orderNumber}</span>
                            </span>
                          )}
                          {n.data.meta.totalPrice !== undefined && (
                            <span className="text-[10px] font-nunito-semibold text-slate-400">
                              Amount: <span className="text-slate-600">${n.data.meta.totalPrice}</span>
                            </span>
                          )}
                          {n.data.meta.contactReason && (
                            <span className="text-[10px] font-nunito-semibold text-slate-400">
                              Reason: <span className="text-slate-600">{n.data.meta.contactReason}</span>
                            </span>
                          )}
                          {n.data.meta.status && (
                            <span className="text-[10px] font-nunito-semibold text-slate-400">
                              Status: <span className="text-slate-600 capitalize">{n.data.meta.status}</span>
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-[10px] font-nunito text-slate-400 mt-2">
                        {formatDate(n.createdAt)}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(n._id)}
                      disabled={isThisDeleting}
                      title="Delete notification"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 w-8 h-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {isThisDeleting ? (
                        <svg className="w-4 h-4 animate-spin text-red-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      ) : (
                        <DeleteIcon size={15} color="currentColor" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Bulk Notifications Tab ── */}
      {activeTab === "bulk" && (
        <div className="space-y-4">
          {isBulkLoading ? (
            <p className="text-center text-sm font-nunito text-slate-400 py-10">Loading...</p>
          ) : isBulkError ? (
            <p className="text-center text-sm font-nunito text-red-500 py-10">
              Failed to load bulk notifications.
            </p>
          ) : bulkNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
                <MicIcon size={24} color="#7C3AED" />
              </div>
              <p className="text-sm font-nunito-bold text-slate-500">No bulk notifications sent yet</p>
              <p className="text-xs font-nunito text-slate-400 mt-1">
                Click &quot;+ Create Notification&quot; to send your first bulk message.
              </p>
            </div>
          ) : (
            bulkNotifications.map((n: any) => (
              <div
                key={n._id}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:scale-[1.002] transition-transform duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE] flex items-center justify-center shrink-0">
                    <MicIcon size={18} color="currentColor" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-nunito-bold text-slate-700 leading-tight">{n.title}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-nunito-bold bg-emerald-50 text-[#16A34A] border border-[#DCFCE7]">
                        Sent to {n.totalSent} customer{n.totalSent === 1 ? "" : "s"}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-nunito-bold bg-purple-50 text-[#7C3AED] border border-[#EDE9FE]">
                        {n.targetAudience === "approved_customers" ? "Approved Customers" : "All Customers"}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-nunito-bold uppercase tracking-wider ${
                        n.status === "sent" ? "bg-emerald-50 text-[#16A34A] border border-[#DCFCE7]" : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {n.status}
                      </span>
                    </div>
                    <p className="text-[10px] font-nunito text-slate-400 mt-1">{formatDate(n.createdAt)}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs font-nunito-medium text-slate-500 leading-relaxed pl-14">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Create Bulk Notification Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 relative mx-4 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer border border-slate-100 bg-white"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 pb-4 border-b border-slate-50">
              <h2 className="text-lg font-nunito-bold text-slate-800">Create Notification</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
                <BellIcon size={16} color="#3B82F6" />
                <p className="text-xs font-nunito-semibold text-blue-700">
                  This notification will be sent to your selected audience of customer accounts.
                </p>
              </div>

              <div>
                <label className="block text-xs font-nunito-bold text-slate-500 uppercase tracking-wider mb-2">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
                >
                  <option value="approved_customers">Approved Customers Only</option>
                  <option value="all_customers">All Customers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-nunito-bold text-slate-500 uppercase tracking-wider mb-2">
                  Notification Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Product Launch, Promotion"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-nunito-bold text-slate-500 uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Enter the notification message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm resize-none"
                />
              </div>
            </div>

            <div className="p-6 pt-4 border-t border-slate-50 bg-slate-50/30 flex justify-end gap-3">
              <button
                disabled={isSending}
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] bg-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isSending}
                onClick={handleSend}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm shadow-brand-primary/10 active:scale-[0.98] disabled:opacity-50"
              >
                {isSending ? "Sending..." : "Send Bulk Notification"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
