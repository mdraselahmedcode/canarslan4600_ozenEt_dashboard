"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BellIcon, SettingsIcon, LogoutIcon } from "@/components/icons";

export function TopBar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-[64px] bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 z-30">
      {/* Left: System Status */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-nunito-medium text-slate-500">
          All systems operational
        </span>
      </div>

      {/* Right: Notifications & User */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button
          onClick={() => router.push("/dashboard/notifications")}
          className="relative p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          title="Notifications"
        >
          <BellIcon size={20} color="#64748B" strokeWidth={1.5} />
          <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-brand-primary text-white text-[10px] font-nunito-bold rounded-full flex items-center justify-center shadow-sm">
            2
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-100" />

        {/* User Info & Dropdown Trigger */}
        <div className="relative">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-3 py-1.5 hover:bg-slate-50 active:scale-[0.98] transition-all rounded-2xl cursor-pointer select-none border border-transparent hover:border-slate-100"
          >
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-nunito-bold text-sm shadow-sm shrink-0">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-nunito-bold text-slate-800 leading-tight">
                Admin User
              </span>
              <span className="text-[10px] font-nunito text-slate-400 leading-tight mt-0.5">
                Administrator
              </span>
            </div>
            {/* Chevron Icon */}
            <svg
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Overlay blocker to close on outside click */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute top-12 right-0 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header User info */}
                <div className="px-2 pb-3">
                  <h4 className="text-sm font-nunito-bold text-slate-800">
                    Admin User
                  </h4>
                  <p className="text-[10px] font-nunito text-slate-400 mt-1">
                    admin@ozen-et.com
                  </p>
                </div>

                <div className="border-t border-slate-100 my-2"></div>

                {/* Dropdown Options */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/dashboard/settings");
                    }}
                    className="flex items-center gap-3 w-full px-2 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all text-xs font-nunito-semibold text-left cursor-pointer"
                  >
                    <SettingsIcon size={15} color="currentColor" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/");
                    }}
                    className="flex items-center gap-3 w-full px-2 py-2 text-[#DC2626] hover:bg-red-50/50 rounded-xl transition-all text-xs font-nunito-semibold text-left cursor-pointer"
                  >
                    <LogoutIcon size={15} color="currentColor" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

