"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BackIcon,
  DeleteIcon,
  BuildingIcon,
  PageIcon,
  OneManIcon,
  PhoneIcon,
  LocationIcon,
  MailIcon,
  StoreIcon,
  SaveIcon,
} from "@/components/icons";
import {
  useGetSingleCustomerQuery,
  useVerifyCustomerMutation,
  useDeleteCustomerMutation,
} from "@/store/api/customerApi";

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
  address: string;
}

const mockCustomers: Customer[] = [
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
    address: "350 Fifth Ave, New York, NY 10118",
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
    address: "109 W 57th St, New York, NY 10019",
  },
  {
    id: "3",
    name: "Brooklyn Artisan Kitchen",
    code: "US-1122334455",
    contactName: "Marco Rossi",
    contactEmail: "marco@brooklynartisan.com",
    phone: "+1 (718) 555-2345",
    businessType: "Restaurant",
    registeredDate: "Feb 20, 2028",
    ordersCount: 2,
    totalSpent: 384.8,
    status: "Approved",
    address: "88 Atlantic Ave, Brooklyn, NY 11201",
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
    address: "123 Washington St, New York, NY 10006",
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
    address: "75 9th Ave, New York, NY 10011",
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
    address: "420 Lexington Ave, New York, NY 10170",
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
    address: "17 Battery Pl, New York, NY 10004",
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
    address: "10 Columbus Cir, New York, NY 10019",
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
    address: "201 Marin Blvd, Jersey City, NJ 07302",
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
    address: "47-30 35th St, Long Island City, NY 11101",
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
    address: "2500 Broadway, New York, NY 10024",
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
    address: "161-11 Jamaica Ave, Jamaica, NY 11432",
  },
];

interface Product {
  id: string;
  name: string;
  category: "Beef" | "Chicken" | "Lamb" | "Frozen" | "Processed";
  code: string;
  defaultPrice: number;
}

const productsList: Product[] = [
  {
    id: "1",
    name: "Beef Tenderloin",
    category: "Beef",
    code: "BT",
    defaultPrice: 38.5,
  },
  {
    id: "2",
    name: "Diced Beef",
    category: "Beef",
    code: "DB",
    defaultPrice: 29.8,
  },
  {
    id: "3",
    name: "Ground Beef",
    category: "Beef",
    code: "GB",
    defaultPrice: 24.8,
  },
  {
    id: "4",
    name: "Ribeye Steak",
    category: "Beef",
    code: "RS",
    defaultPrice: 42.0,
  },
  {
    id: "5",
    name: "Beef Chops",
    category: "Beef",
    code: "RC",
    defaultPrice: 35.6,
  },
  {
    id: "6",
    name: "Chicken Breast",
    category: "Chicken",
    code: "CB",
    defaultPrice: 11.2,
  },
  {
    id: "7",
    name: "Whole Chicken",
    category: "Chicken",
    code: "WC",
    defaultPrice: 8.8,
  },
  {
    id: "8",
    name: "Chicken Thighs",
    category: "Chicken",
    code: "CT",
    defaultPrice: 10.5,
  },
  {
    id: "9",
    name: "Chicken Wings",
    category: "Chicken",
    code: "CW",
    defaultPrice: 8.8,
  },
  {
    id: "10",
    name: "Lamb Leg",
    category: "Lamb",
    code: "LL",
    defaultPrice: 54.0,
  },
  {
    id: "11",
    name: "Lamb Shoulder",
    category: "Lamb",
    code: "LS",
    defaultPrice: 48.5,
  },
  {
    id: "12",
    name: "Lamb Ribs",
    category: "Lamb",
    code: "LR",
    defaultPrice: 46.0,
  },
  {
    id: "13",
    name: "Frozen Beef",
    category: "Frozen",
    code: "FB",
    defaultPrice: 22.5,
  },
  {
    id: "14",
    name: "Frozen Chicken Breast",
    category: "Frozen",
    code: "FC",
    defaultPrice: 7.8,
  },
  {
    id: "15",
    name: "Frozen Lamb",
    category: "Frozen",
    code: "FL",
    defaultPrice: 41.0,
  },
  {
    id: "16",
    name: "Beef Sausage",
    category: "Processed",
    code: "BS",
    defaultPrice: 22.8,
  },
  {
    id: "17",
    name: "Butcher's Meatballs",
    category: "Processed",
    code: "BM",
    defaultPrice: 20.0,
  },
  {
    id: "18",
    name: "Cured Beef (Pastirma)",
    category: "Processed",
    code: "CB",
    defaultPrice: 38.0,
  },
];

const initialCustomPrices: Record<string, Record<string, string>> = {
  "3": {
    "1": "38.50",
    "2": "29.80",
    "3": "24.90",
    "4": "42.00",
    "5": "35.60",
    "6": "11.20",
    "7": "9.80",
    "8": "10.50",
    "9": "8.90",
    "10": "54.00",
    "11": "49.50",
    "12": "46.00",
    "13": "22.50",
    "14": "7.80",
    "15": "41.00",
    "16": "22.80",
    "17": "20.00",
    "18": "38.00",
  },
};

const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case "Beef":
      return "bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]";
    case "Chicken":
      return "bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]";
    case "Lamb":
      return "bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE]";
    case "Frozen":
      return "bg-[#ECFEFF] text-[#0891B2] border border-[#CFFAFE]";
    case "Processed":
      return "bg-[#FEFCE8] text-[#CA8A04] border border-[#FEF9C3]";
    default:
      return "bg-slate-50 text-slate-600 border border-slate-100";
  }
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data: dbCustomer, isLoading } = useGetSingleCustomerQuery(id);
  const [verifyCustomer] = useVerifyCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const [activeTab, setActiveTab] = useState<"info" | "pricing">("info");

  const mapBackendStatus = (isAdminVerified: boolean): Customer["status"] => {
    return isAdminVerified ? "Approved" : "Pending";
  };

  const customer: Customer | null = dbCustomer?.data
    ? {
        id: dbCustomer.data._id,
        name:
          dbCustomer.data.businessName ||
          dbCustomer.data.name ||
          "Unnamed Business",
        code: dbCustomer.data.taxId || dbCustomer.data.user?._id || "",
        contactName: dbCustomer.data.name || "No Contact Name",
        contactEmail: dbCustomer.data.email || "",
        phone: dbCustomer.data.phone || "",
        businessType: dbCustomer.data.businessType || "Retail",
        registeredDate: dbCustomer.data.createdAt
          ? new Date(dbCustomer.data.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "",
        ordersCount: 0,
        totalSpent: 0,
        status: mapBackendStatus(dbCustomer.data.isAdminVerified),
        address: dbCustomer.data.address || "",
      }
    : null;

  const [customPrices, setCustomPrices] = useState<Record<string, string>>({});

  const handleInputChange = (productId: string, value: string) => {
    setCustomPrices((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleSavePrices = () => {
    alert("Pricing overrides saved successfully!");
  };

  const handleApprove = async () => {
    if (!customer) return;
    try {
      await verifyCustomer({ id: customer.id, status: "approved" }).unwrap();
      alert("Customer approved successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || err?.message || "Failed to approve customer");
    }
  };

  const handleReject = async () => {
    if (!customer) return;
    const reason = prompt(
      "Enter reason for rejection:",
      "Business information could not be verified",
    );
    if (reason === null) return;
    try {
      await verifyCustomer({
        id: customer.id,
        status: "rejected",
        reason,
      }).unwrap();
      alert("Customer rejected successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || err?.message || "Failed to reject customer");
    }
  };

  const handleDelete = async () => {
    if (!customer) return;
    if (
      confirm(`Are you sure you want to delete customer: ${customer.name}?`)
    ) {
      try {
        await deleteCustomer(customer.id).unwrap();
        alert("Customer deleted successfully!");
        router.push("/dashboard/customers");
      } catch (err: any) {
        console.error(err);
        alert(
          err?.data?.message || err?.message || "Failed to delete customer",
        );
      }
    }
  };

  // Mock Order History based on customer
  const mockOrders = [
    {
      id: "#OE-2026-005",
      date: "Jun 20, 2026",
      total: 284.0,
      status: "Cancelled",
    },
    {
      id: "#OE-2026-006",
      date: "Jul 5, 2026",
      total: 384.8,
      status: "Completed",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-brand-primary"></div>
        <p className="text-slate-400 text-xs font-nunito mt-4">
          Loading customer details...
        </p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-8 text-center font-nunito">
        <p className="text-slate-500">Customer not found.</p>
        <Link
          href="/dashboard/customers"
          className="text-[#C4202B] mt-4 inline-block hover:underline"
        >
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/customers"
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm"
          >
            <BackIcon width={16} height={16} color="currentColor" />
            <span>Back</span>
          </Link>
          <div>
            <h1 className="text-xl font-nunito-bold text-slate-800 leading-tight">
              {customer.name}
            </h1>
            <p className="text-xs font-nunito text-slate-400 mt-1">
              {`${customer.businessType} • Registered ${customer.registeredDate}`}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {customer.status === "Approved" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-nunito-bold bg-emerald-50 text-[#16A34A] border border-[#DCFCE7]">
              Approved
            </span>
          )}
          {customer.status === "Pending" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-nunito-bold bg-amber-50 text-[#D97706] border border-[#FEF3C7]">
              Pending
            </span>
          )}
          {customer.status === "Rejected" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-nunito-bold bg-red-50 text-[#DC2626] border border-[#FEE2E2]">
              Rejected
            </span>
          )}
        </div>
      </div>

      {/* KPI Stats Cards (Total Orders, Completed, Total Spend, Last Order) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#D97706] mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <p className="text-xl font-nunito-bold text-slate-800 leading-tight">
            {customer.id === "3" ? 2 : customer.ordersCount || 0}
          </p>
          <p className="text-xs font-nunito-medium text-slate-500 mt-1">
            Total Orders
          </p>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#16A34A] mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-xl font-nunito-bold text-slate-800 leading-tight">
            {customer.id === "3"
              ? 1
              : customer.ordersCount > 0
                ? Math.max(1, customer.ordersCount - 2)
                : 0}
          </p>
          <p className="text-xs font-nunito-medium text-slate-500 mt-1">
            Completed
          </p>
        </div>

        {/* Total Spend */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-[#D97706] mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <p className="text-xl font-nunito-bold text-slate-800 leading-tight">
            {`$${(customer.id === "3" ? 384.8 : customer.totalSpent).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </p>
          <p className="text-xs font-nunito-medium text-slate-500 mt-1">
            Total Spend
          </p>
        </div>

        {/* Last Order */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p className="text-xl font-nunito-bold text-slate-800 leading-tight">
            {customer.id === "3"
              ? "Jul 9, 2026"
              : customer.ordersCount > 0
                ? "Jun 28, 2026"
                : "—"}
          </p>
          <p className="text-xs font-nunito-medium text-slate-500 mt-1">
            Last Order
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 mb-8 gap-6">
        <button
          onClick={() => setActiveTab("info")}
          className={`py-3 text-sm font-nunito-semibold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "info"
              ? "border-brand-primary text-brand-primary font-nunito-bold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Business Information
        </button>
        <button
          onClick={() => setActiveTab("pricing")}
          className={`py-3 text-sm font-nunito-semibold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "pricing"
              ? "border-brand-primary text-brand-primary font-nunito-bold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Customer Pricing
        </button>
      </div>

      {/* Main Tab Panels */}
      {activeTab === "info" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Business Information Details */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-nunito-bold text-slate-800 mb-6">
              Business Information
            </h2>
            <div className="space-y-6">
              {/* COMPANY NAME */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <BuildingIcon size={18} color="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                    Company Name
                  </p>
                  <p className="text-sm font-nunito-semibold text-slate-700 mt-0.5">
                    {customer.name}
                  </p>
                </div>
              </div>

              {/* BUSINESS TYPE */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <StoreIcon size={18} color="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                    Business Type
                  </p>
                  <p className="text-sm font-nunito-semibold text-slate-700 mt-0.5">
                    {customer.businessType}
                  </p>
                </div>
              </div>

              {/* CONTACT PERSON */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <OneManIcon
                    size={18}
                    useGradient={false}
                    color="currentColor"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                    Contact Person
                  </p>
                  <p className="text-sm font-nunito-semibold text-slate-700 mt-0.5">
                    {customer.contactName}
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <MailIcon size={18} color="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-sm font-nunito-semibold text-slate-700 mt-0.5">
                    {customer.contactEmail}
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <PhoneIcon size={18} color="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                    Phone
                  </p>
                  <p className="text-sm font-nunito-semibold text-slate-700 mt-0.5">
                    {customer.phone}
                  </p>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <LocationIcon size={18} color="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                    Address
                  </p>
                  <p className="text-sm font-nunito-semibold text-slate-700 mt-0.5">
                    {customer.address}
                  </p>
                </div>
              </div>

              {/* VAT / TAX ID */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <PageIcon size={18} color="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                    VAT / TAX ID
                  </p>
                  <p className="text-sm font-nunito-semibold text-slate-700 mt-0.5">
                    {customer.code}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Order History */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-base font-nunito-bold text-slate-800 mb-4">
                Actions
              </h2>
              {customer.status === "Pending" ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleApprove}
                    className="w-full py-3 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] rounded-xl font-nunito-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] select-none"
                  >
                    <span>Approve Account</span>
                  </button>
                  <button
                    onClick={handleReject}
                    className="w-full py-3 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-xl font-nunito-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] select-none"
                  >
                    <span>Reject Account</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleDelete}
                  className="w-full py-3 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-xl font-nunito-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <DeleteIcon size={14} color="currentColor" />
                  <span>Delete Customer</span>
                </button>
              )}
            </div>

            {/* Order History Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-base font-nunito-bold text-slate-800 mb-4">
                Order History
              </h2>
              {customer.status !== "Approved" || customer.id !== "3" ? (
                <p className="text-sm font-nunito text-slate-400 py-4 text-center">
                  No order history records found.
                </p>
              ) : (
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between pb-3.5 border-b border-slate-50 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-nunito-bold text-slate-700">
                          {order.id}
                        </p>
                        <p className="text-[10px] font-nunito text-slate-400 mt-0.5">
                          {order.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-nunito-bold text-slate-700">
                          {`$${order.total.toFixed(2)}`}
                        </span>
                        {order.status === "Completed" ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-nunito-bold bg-emerald-50 text-[#16A34A] border border-[#DCFCE7]">
                            completed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-nunito-bold bg-red-50 text-[#DC2626] border border-[#FEE2E2]">
                            cancelled
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Customer Pricing Tab Placeholder */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-nunito-bold text-slate-800">
                Custom Product Pricing
              </h2>
              <p className="text-xs font-nunito text-slate-400 mt-1">
                Set individual prices for this customer. Leave empty to use the
                default price.
              </p>
            </div>
            <button
              onClick={handleSavePrices}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] shrink-0"
            >
              <SaveIcon size={14} color="currentColor" />
              <span>Save Prices</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider pl-1">
                    Product
                  </th>
                  <th className="pb-3 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="pb-3 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider text-right">
                    Default Price
                  </th>
                  <th className="pb-3 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider text-right pr-6">
                    Customer Price
                  </th>
                  <th className="pb-3 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider text-right pr-1">
                    Custom Input
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {productsList.map((product) => {
                  const customPrice = customPrices[product.id] || "";
                  const finalPrice =
                    customPrice !== ""
                      ? parseFloat(customPrice)
                      : product.defaultPrice;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50 transition-all duration-150"
                    >
                      {/* Product Name */}
                      <td className="py-3.5 pl-1">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-nunito-bold text-xs uppercase shrink-0 ${getCategoryBadgeClass(product.category)}`}
                          >
                            {product.code}
                          </div>
                          <span className="text-sm font-nunito-bold text-slate-700">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5">
                        <span className="text-sm font-nunito-medium text-slate-500">
                          {product.category}
                        </span>
                      </td>

                      {/* Default Price */}
                      <td className="py-3.5 text-right">
                        <span className="text-sm font-nunito text-slate-400">
                          ${product.defaultPrice.toFixed(2)}
                        </span>
                      </td>

                      {/* Customer Price */}
                      <td className="py-3.5 text-right pr-6">
                        <span className="text-sm font-nunito-semibold text-slate-700">
                          $
                          {isNaN(finalPrice)
                            ? product.defaultPrice.toFixed(2)
                            : finalPrice.toFixed(2)}
                        </span>
                      </td>

                      {/* Custom Input */}
                      <td className="py-3.5 text-right pr-1">
                        <input
                          type="text"
                          value={customPrice}
                          onChange={(e) =>
                            handleInputChange(product.id, e.target.value)
                          }
                          placeholder={product.defaultPrice.toFixed(2)}
                          className="w-24 px-3 py-1.5 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-right text-slate-700 bg-white transition-all shadow-sm"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
