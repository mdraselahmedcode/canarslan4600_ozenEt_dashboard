"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DashboardIcon,
  DoubleManIcon,
  CategoriesIcon,
  TotalProductsBoxIcon,
  TotalOrdersIcon,
  BellIcon,
  SettingsIcon,
  LogoutIcon,
  MailIcon,
} from "@/components/icons";
import { useGetDashboardMetaQuery, useGetNotificationsQuery } from "@/store/api/metaApi";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <DashboardIcon size={18} color="#FFFFFF" strokeWidth={1.5} />,
    activeIcon: <DashboardIcon size={18} color="#FFFFFF" strokeWidth={2} />,
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
    icon: <DoubleManIcon size={18} color="rgba(255,255,255,0.5)" />,
    activeIcon: <DoubleManIcon size={18} color="#FFFFFF" />,
  },
  {
    label: "Categories",
    href: "/dashboard/categories",
    icon: <CategoriesIcon size={18} color="#FFFFFF" opacity={0.5} />,
    activeIcon: <CategoriesIcon size={18} color="#FFFFFF" opacity={1} />,
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: <TotalProductsBoxIcon size={18} color="rgba(255,255,255,0.5)" />,
    activeIcon: <TotalProductsBoxIcon size={18} color="#FFFFFF" />,
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: <TotalOrdersIcon size={18} color="rgba(255,255,255,0.5)" />,
    activeIcon: <TotalOrdersIcon size={18} color="#FFFFFF" />,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: (
      <BellIcon size={18} color="rgba(255,255,255,0.5)" strokeWidth={1.35} />
    ),
    activeIcon: <BellIcon size={18} color="#FFFFFF" strokeWidth={1.35} />,
  },
  {
    label: "Support",
    href: "/dashboard/support",
    icon: <MailIcon size={18} color="rgba(255,255,255,0.5)" />,
    activeIcon: <MailIcon size={18} color="#FFFFFF" />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <SettingsIcon size={18} color="#FFFFFF" opacity={0.5} />,
    activeIcon: <SettingsIcon size={18} color="#FFFFFF" opacity={1} />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Load live counts dynamically with background updates every 15 seconds
  const { data: metaResponse } = useGetDashboardMetaQuery(undefined, {
    pollingInterval: 15000,
  });

  // Live notification unread count
  const { data: notifResponse } = useGetNotificationsQuery(undefined, {
    pollingInterval: 15000,
  });

  const unverifiedCustomers = metaResponse?.data?.unVerifiedCustomer || 0;
  const pendingOrders = metaResponse?.data?.pendingOrder || 0;
  const unreadNotifications = notifResponse?.data?.meta?.unreadCount || 0;

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const getBadgeCount = (label: string) => {
    if (label === "Customers") return unverifiedCustomers;
    if (label === "Orders") return pendingOrders;
    if (label === "Notifications") return unreadNotifications;
    return 0;
  };

  const handleSignOut = () => {
    router.push("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] bg-[#111827] flex flex-col z-50">
      {/* Logo Area */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shrink-0">
          <Image
            src="/images/dashboard_login_logo.png"
            alt="Özen Et Logo"
            width={28}
            height={28}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-nunito-bold text-sm tracking-wide leading-tight">
            ÖZEN ET
          </span>
          <span className="text-white/40 font-nunito text-[10px] tracking-wider leading-tight">
            ADMIN PANEL
          </span>
        </div>
      </div>

      {/* Main Menu Label */}
      <div className="px-5 pt-5 pb-3">
        <span className="text-white/30 font-nunito-semibold text-[10px] tracking-[0.15em] uppercase">
          Main Menu
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const badgeCount = getBadgeCount(item.label);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 relative ${
                active
                  ? "bg-brand-primary text-white font-nunito-semibold shadow-md shadow-brand-primary/20"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5 font-nunito-medium"
              }`}
            >
              <span className="w-[18px] h-[18px] flex items-center justify-center shrink-0">
                {active ? item.activeIcon : item.icon}
              </span>
              <span className="flex-1 truncate">{item.label}</span>
              {badgeCount > 0 && (
                <span
                  className={`min-w-[20px] h-[20px] flex items-center justify-center rounded-full text-[10px] font-nunito-bold px-1.5 ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-brand-primary text-white"
                  }`}
                >
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="px-3 pb-6 pt-3 ">
        <button
          onClick={handleSignOut}
          className="flex items-center cursor-pointer gap-3 w-full px-3 py-2.5 bg-red-700/10 rounded-xl text-sm text-white/50 hover:text-white hover:bg-red-500/5 transition-all duration-200 font-nunito-medium"
        >
          <LogoutIcon size={16} color="#F87171D9" />
          <span className="text-[#F87171D9]">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
