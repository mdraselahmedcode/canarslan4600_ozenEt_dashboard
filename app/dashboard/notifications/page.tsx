"use client";

import React, { useState, useEffect } from "react";
import {
  BellIcon,
  MicIcon,
  DeleteIcon,
} from "@/components/icons";

interface NotificationItem {
  id: string;
  title: string;
  date: string;
  message: string;
  sentToCount: number;
  recipientType: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Summer Bulk Order Promotion",
    date: "Jun 30, 2026",
    message: "Get 5% off on bulk orders above $500 throughout July. This offer applies to all product categories.",
    sentToCount: 5,
    recipientType: "All Customers",
  },
  {
    id: "2",
    title: "New Product: Cured Beef",
    date: "Jul 1, 2026",
    message: "We've added our traditional Kayseri-style Cured Beef (Pastirma) to our catalog. Place your order today!",
    sentToCount: 5,
    recipientType: "All Customers",
  },
  {
    id: "3",
    title: "Q3 2026 Price List Update",
    date: "Jun 20, 2026",
    message: "Please note that product prices have been updated for Q3 2026. Review the latest price list in the ordering app.",
    sentToCount: 5,
    recipientType: "All Customers",
  },
  {
    id: "4",
    title: "New USDA Quality Certifications",
    date: "Jun 15, 2026",
    message: "We are pleased to announce that all our beef products have received updated USDA certification for 2026.",
    sentToCount: 5,
    recipientType: "All Customers",
  },
  {
    id: "5",
    title: "Holiday Schedule – July 4th",
    date: "Jun 25, 2026",
    message: "Our offices will be closed on July 4th. Orders placed on July 4th will be processed on July 7th.",
    sentToCount: 5,
    recipientType: "All Customers",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [messageInput, setMessageInput] = useState("");

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingNotificationId, setDeletingNotificationId] = useState<string | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("ozenet_notifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      localStorage.setItem("ozenet_notifications", JSON.stringify(initialNotifications));
      setNotifications(initialNotifications);
    }
  }, []);

  const saveToLocalStorage = (list: NotificationItem[]) => {
    localStorage.setItem("ozenet_notifications", JSON.stringify(list));
    setNotifications(list);
  };

  const handleCreateClick = () => {
    setTitleInput("");
    setMessageInput("");
    setIsModalOpen(true);
  };

  const handleSend = () => {
    if (!titleInput.trim() || !messageInput.trim()) {
      alert("Notification Title and Message are required.");
      return;
    }

    const newNotification: NotificationItem = {
      id: String(Date.now()),
      title: titleInput,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      message: messageInput,
      sentToCount: 5,
      recipientType: "All Customers",
    };

    const updated = [newNotification, ...notifications];
    saveToLocalStorage(updated);
    setIsModalOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingNotificationId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingNotificationId) {
      const updated = notifications.filter((n) => n.id !== deletingNotificationId);
      saveToLocalStorage(updated);
    }
    setIsDeleteModalOpen(false);
    setDeletingNotificationId(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingNotificationId(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-nunito-bold text-slate-800">Notifications</h1>
          <p className="text-sm font-nunito text-slate-500 mt-1">
            {notifications.length} notifications sent
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm shadow-brand-primary/10 active:scale-[0.98]"
        >
          + Create Notification
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {/* Card 1: Total Notifications */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50/50 text-[#7C3AED] flex items-center justify-center shrink-0">
            <BellIcon size={20} color="currentColor" />
          </div>
          <div>
            <p className="text-2xl font-nunito-bold text-slate-800 leading-tight">
              {notifications.length}
            </p>
            <p className="text-xs font-nunito-medium text-slate-400 mt-1">
              Total Notifications Sent
            </p>
          </div>
        </div>

        {/* Card 2: Active Customer Accounts */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50/50 text-[#3B82F6] flex items-center justify-center shrink-0">
            <MicIcon size={20} color="currentColor" />
          </div>
          <div>
            <p className="text-2xl font-nunito-bold text-slate-800 leading-tight">
              5
            </p>
            <p className="text-xs font-nunito-medium text-slate-400 mt-1">
              Active Customer Accounts
            </p>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:scale-[1.005] transition-transform duration-200"
          >
            {/* Header row */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE] flex items-center justify-center shrink-0">
                <MicIcon size={18} color="currentColor" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-nunito-bold text-slate-700 leading-tight">
                    {n.title}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-nunito-bold bg-emerald-50 text-[#16A34A] border border-[#DCFCE7]">
                    Sent to {n.sentToCount} customers
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-nunito-bold bg-purple-50 text-[#7C3AED] border border-[#EDE9FE]">
                    {n.recipientType}
                  </span>
                </div>
                <p className="text-[10px] font-nunito text-slate-400 mt-1">
                  {n.date}
                </p>
              </div>
              <button
                onClick={() => handleDeleteClick(n.id)}
                className="w-8 h-8 rounded-lg border border-red-100 hover:bg-[#FEE2E2]/60 text-[#DC2626] flex items-center justify-center transition-colors cursor-pointer bg-[#FEF2F2]/50 shadow-sm"
                title="Delete Notification"
              >
                <DeleteIcon size={12} color="currentColor" />
              </button>
            </div>
            {/* Body Message */}
            <p className="mt-3 text-xs font-nunito-medium text-slate-500 leading-relaxed pl-14">
              {n.message}
            </p>
          </div>
        ))}
      </div>

      {/* Create Notification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 relative mx-4 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer border border-slate-100 bg-white"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-slate-50">
              <h2 className="text-lg font-nunito-bold text-slate-800">
                Create Notification
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Info banner */}
              <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
                <span className="text-blue-500 shrink-0">
                  <BellIcon size={16} color="currentColor" />
                </span>
                <p className="text-xs font-nunito-semibold text-blue-700">
                  This notification will be sent to{" "}
                  <span className="font-nunito-bold">5</span> approved customer
                  accounts.
                </p>
              </div>

              {/* Title input */}
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

              {/* Message input */}
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

              {/* Live Preview Card */}
              <div>
                <label className="block text-xs font-nunito-bold text-slate-400 uppercase tracking-wider mb-2">
                  Preview:
                </label>
                <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4 min-h-[90px] flex flex-col justify-start">
                  <h4 className="text-sm font-nunito-bold text-slate-700 leading-tight">
                    {titleInput || "Notification title"}
                  </h4>
                  <p className="text-xs font-nunito text-slate-400 mt-2 leading-relaxed break-words">
                    {messageInput || "Notification message will appear here..."}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-4 border-t border-slate-50 bg-slate-50/30 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm shadow-brand-primary/10 active:scale-[0.98]"
              >
                Send to All Customers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 relative mx-4 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            {/* Close Button */}
            <button
              onClick={cancelDelete}
              className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer border border-slate-100 bg-white"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-slate-50">
              <h2 className="text-lg font-nunito-bold text-slate-800">
                Delete Notification
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-sm font-nunito text-slate-600">
                Are you sure you want to delete the notification{" "}
                <span className="font-nunito-bold text-slate-800">
                  {notifications.find((n) => n.id === deletingNotificationId)?.title}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-4 border-t border-slate-50 bg-slate-50/30 flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] bg-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                Delete Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
