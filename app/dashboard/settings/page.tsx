"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BuildingIcon,
  ClockIcon,
  PageIcon,
  LogoutIcon,
  SaveIcon,
} from "@/components/icons";

interface CompanySettings {
  companyName: string;
  contactPhone: string;
  contactEmail: string;
  registeredAddress: string;
  officialWebsite: string;
  businessType: string;
  freeCancellationHour: number;
  platformFeePercentage: number;
  jurisdiction: string;
}

const defaultSettings: CompanySettings = {
  companyName: "ÖZEN ET",
  contactPhone: "+1234567890",
  contactEmail: "support@ozenet.com",
  registeredAddress: "Your registered business address",
  officialWebsite: "https://ozenet.com",
  businessType: "Meat Supplier",
  freeCancellationHour: 24,
  platformFeePercentage: 20,
  jurisdiction: "United States",
};

const defaultPrivacyPolicy = `<h1>Privacy Policy</h1>
<p>Last updated: July 14, 2026</p>
<p>Özen Et is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and share your personal information when you use our B2B ordering application or dashboard.</p>
<h2>1. Information We Collect</h2>
<p>We collect information you provide directly to us, including your business name, contact information, email address, phone number, and billing/shipping address.</p>
<h2>2. How We Use Your Information</h2>
<p>We use the information we collect to process orders, manage accounts, provide customer support, and send updates regarding our products and promotions.</p>`;

const defaultTermsConditions = `<h1>Terms & Conditions</h1>
<p>Last updated: July 14, 2026</p>
<p>Welcome to Özen Et. These Terms & Conditions govern your access to and use of our B2B wholesale platform. By using our platform, you agree to comply with these terms.</p>
<h2>1. Order Placement and Acceptance</h2>
<p>All orders placed through our platform are subject to availability and acceptance by Özen Et. We reserve the right to refuse or cancel any order at our discretion.</p>
<h2>2. Pricing and Payment</h2>
<p>Prices for products are default rates unless custom pricing overrides have been configured for your customer account. Payment terms are net-30 days unless otherwise agreed upon in writing.</p>`;

import {
  useGetLegalInfoQuery,
  useGetPrivacyPolicyQuery,
  useAddPrivacyPolicyMutation,
  useGetTermsConditionsQuery,
  useAddTermsConditionsMutation,
  useGetFaqsQuery,
  useAddFaqMutation,
  useEditFaqMutation,
  useDeleteFaqMutation,
  FaqData,
} from "@/store/api/metaApi";

export default function SettingsPage() {
  const router = useRouter();

  const { data: legalInfoResponse, isLoading: isLegalLoading } = useGetLegalInfoQuery();
  const { data: privacyResponse, isLoading: isPrivacyLoading } = useGetPrivacyPolicyQuery();
  const { data: termsResponse, isLoading: isTermsLoading } = useGetTermsConditionsQuery();

  const [addPrivacyPolicy] = useAddPrivacyPolicyMutation();
  const [addTermsConditions] = useAddTermsConditionsMutation();

  // FAQ hooks
  const { data: faqsResponse, isLoading: isFaqsLoading } = useGetFaqsQuery();
  const [addFaq] = useAddFaqMutation();
  const [editFaq] = useEditFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  // Settings states
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [privacyPolicy, setPrivacyPolicy] = useState(defaultPrivacyPolicy);
  const [termsConditions, setTermsConditions] = useState(
    defaultTermsConditions,
  );

  const [privacyUpdatedDate, setPrivacyUpdatedDate] = useState("July 14, 2026");
  const [termsUpdatedDate, setTermsUpdatedDate] = useState("July 14, 2026");

  // Legal Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorTarget, setEditorTarget] = useState<"privacy" | "terms">(
    "privacy",
  );
  const [editorHtml, setEditorHtml] = useState("");
  const [editorTab, setEditorTab] = useState<"edit" | "preview">("edit");

  // FAQ Modal states
  const [isFaqFormOpen, setIsFaqFormOpen] = useState(false);
  const [faqFormMode, setFaqFormMode] = useState<"add" | "edit">("add");
  const [selectedFaqId, setSelectedFaqId] = useState("");
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");

  // Load from localStorage and backend
  useEffect(() => {
    const savedSettings = localStorage.getItem("ozenet_settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else if (legalInfoResponse?.data) {
      setSettings(legalInfoResponse.data);
    }
  }, [legalInfoResponse]);

  useEffect(() => {
    if (privacyResponse?.data?.description) {
      setPrivacyPolicy(privacyResponse.data.description);
      setPrivacyUpdatedDate(
        new Date(privacyResponse.data.updatedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      );
    }
  }, [privacyResponse]);

  useEffect(() => {
    if (termsResponse?.data?.description) {
      setTermsConditions(termsResponse.data.description);
      setTermsUpdatedDate(
        new Date(termsResponse.data.updatedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      );
    }
  }, [termsResponse]);

  const handleInputChange = (
    field: keyof CompanySettings,
    value: string | number,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = () => {
    localStorage.setItem("ozenet_settings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  const handleEditLegal = (target: "privacy" | "terms") => {
    setEditorTarget(target);
    setEditorHtml(target === "privacy" ? privacyPolicy : termsConditions);
    setEditorTab("edit");
    setIsEditorOpen(true);
  };

  const handleSaveLegal = async () => {
    try {
      if (editorTarget === "privacy") {
        await addPrivacyPolicy({ description: editorHtml }).unwrap();
        setPrivacyPolicy(editorHtml);
        setPrivacyUpdatedDate(
          new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        );
      } else {
        await addTermsConditions({ description: editorHtml }).unwrap();
        setTermsConditions(editorHtml);
        setTermsUpdatedDate(
          new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        );
      }
      setIsEditorOpen(false);
      alert("Legal document updated successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || err?.message || "Failed to update legal document");
    }
  };

  const handleOpenAddFaq = () => {
    setFaqFormMode("add");
    setSelectedFaqId("");
    setFaqQuestion("");
    setFaqAnswer("");
    setIsFaqFormOpen(true);
  };

  const handleOpenEditFaq = (faq: FaqData) => {
    setFaqFormMode("edit");
    setSelectedFaqId(faq._id);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setIsFaqFormOpen(true);
  };

  const handleSaveFaq = async () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      alert("Please fill in both question and answer fields");
      return;
    }
    try {
      if (faqFormMode === "add") {
        await addFaq({ question: faqQuestion, answer: faqAnswer }).unwrap();
        alert("FAQ added successfully!");
      } else {
        await editFaq({ id: selectedFaqId, question: faqQuestion, answer: faqAnswer }).unwrap();
        alert("FAQ updated successfully!");
      }
      setIsFaqFormOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || err?.message || "Failed to save FAQ");
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await deleteFaq(id).unwrap();
      alert("FAQ deleted successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || err?.message || "Failed to delete FAQ");
    }
  };

  const handleSignOut = () => {
    router.push("/");
  };

  // Helper to insert HTML tags in text editor
  const insertTag = (openTag: string, closeTag: string) => {
    const textarea = document.getElementById(
      "legal-textarea",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = openTag + selectedText + closeTag;

    const newHtml =
      text.substring(0, start) + replacement + text.substring(end);
    setEditorHtml(newHtml);

    // Reset selection focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + openTag.length,
        start + openTag.length + selectedText.length,
      );
    }, 50);
  };

  if (isLegalLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-brand-primary"></div>
        <p className="text-slate-400 text-xs font-nunito mt-4">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-nunito-bold text-slate-800">Settings</h1>
          <p className="text-sm font-nunito text-slate-500 mt-1">
            Manage your company information
          </p>
        </div>
        <button
          onClick={handleSaveChanges}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm shadow-brand-primary/10 active:scale-[0.98]"
        >
          <SaveIcon size={14} color="currentColor" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column (Company Info & Hours) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100/50">
                <BuildingIcon size={18} color="currentColor" />
              </div>
              <h2 className="text-base font-nunito-bold text-slate-800">
                Company Information
              </h2>
            </div>

            <div className="space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-xs font-nunito-bold text-slate-400 uppercase tracking-wider mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
                />
              </div>

              {/* Phone & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-nunito-bold text-slate-400 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={settings.contactPhone}
                    onChange={(e) =>
                      handleInputChange("contactPhone", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-nunito-bold text-slate-400 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) =>
                      handleInputChange("contactEmail", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-nunito-bold text-slate-400 uppercase tracking-wider mb-2">
                  Business Address
                </label>
                <input
                  type="text"
                  value={settings.registeredAddress}
                  onChange={(e) =>
                    handleInputChange("registeredAddress", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-xs font-nunito-bold text-slate-400 uppercase tracking-wider mb-2">
                  Website
                </label>
                <input
                  type="text"
                  value={settings.officialWebsite}
                  onChange={(e) =>
                    handleInputChange("officialWebsite", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
                />
              </div>

              {/* Business Type & Jurisdiction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-nunito-bold text-slate-400 uppercase tracking-wider mb-2">
                    Business Type
                  </label>
                  <input
                    type="text"
                    value={settings.businessType}
                    onChange={(e) =>
                      handleInputChange("businessType", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-nunito-bold text-slate-400 uppercase tracking-wider mb-2">
                    Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={settings.jurisdiction}
                    onChange={(e) =>
                      handleInputChange("jurisdiction", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Management Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100/50">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-base font-nunito-bold text-slate-800">
                  FAQ Management
                </h2>
              </div>
              <button
                onClick={handleOpenAddFaq}
                className="text-xs font-nunito-bold px-3 py-1.5 bg-brand-primary text-white hover:bg-brand-primary/90 rounded-lg cursor-pointer transition-all duration-200"
              >
                + Add FAQ
              </button>
            </div>

            <div className="space-y-4">
              {isFaqsLoading ? (
                <p className="text-center text-xs font-nunito text-slate-400 py-6">
                  Loading FAQs...
                </p>
              ) : !faqsResponse?.data || faqsResponse.data.length === 0 ? (
                <p className="text-center text-xs font-nunito text-slate-400 py-6">
                  No FAQs found. Click "+ Add FAQ" to create one.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto pr-1">
                  {faqsResponse.data.map((faq) => (
                    <div key={faq._id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-nunito-bold text-slate-700">
                          {faq.question}
                        </h4>
                        <p className="text-xs font-nunito text-slate-500 mt-1 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleOpenEditFaq(faq)}
                          className="text-xs font-nunito-bold text-blue-600 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <span className="text-slate-200">|</span>
                        <button
                          onClick={() => handleDeleteFaq(faq._id)}
                          className="text-xs font-nunito-bold text-red-600 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column (Legals & Sign Out) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Legal Documents Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/50">
                <PageIcon size={18} color="currentColor" />
              </div>
              <h2 className="text-base font-nunito-bold text-slate-800">
                Legal Documents
              </h2>
            </div>

            <div className="space-y-5">
              {/* Privacy Policy */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-nunito-bold text-slate-700">
                    Privacy Policy
                  </h3>
                  <p className="text-[10px] font-nunito text-slate-400 mt-1">
                    Last updated: {privacyUpdatedDate}
                  </p>
                </div>
                <button
                  onClick={() => handleEditLegal("privacy")}
                  className="text-xs font-nunito-bold text-brand-primary hover:underline cursor-pointer"
                >
                  Edit &gt;
                </button>
              </div>

              <div className="border-t border-slate-50 my-1"></div>

              {/* Terms & Conditions */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-nunito-bold text-slate-700">
                    Terms &amp; Conditions
                  </h3>
                  <p className="text-[10px] font-nunito text-slate-400 mt-1">
                    Last updated: {termsUpdatedDate}
                  </p>
                </div>
                <button
                  onClick={() => handleEditLegal("terms")}
                  className="text-xs font-nunito-bold text-brand-primary hover:underline cursor-pointer"
                >
                  Edit &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Sign Out Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-base font-nunito-bold text-slate-800 mb-2">
              Sign Out
            </h2>
            <p className="text-xs font-nunito text-slate-400 mb-5 leading-normal">
              Sign out from the admin dashboard. All unsaved changes will be
              lost.
            </p>
            <button
              onClick={handleSignOut}
              className="w-full py-3 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-xl font-nunito-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              <LogoutIcon size={16} color="currentColor" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rich Text / HTML Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-2xl h-[85vh] shadow-2xl overflow-hidden border border-slate-100 relative mx-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setIsEditorOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer border border-slate-100 bg-white z-10"
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
            <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-lg font-nunito-bold text-slate-800">
                {editorTarget === "privacy"
                  ? "Edit Privacy Policy"
                  : "Edit Terms & Conditions"}
              </h2>
              {/* Tab Selector */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-nunito-semibold mr-10 shadow-inner">
                <button
                  type="button"
                  onClick={() => setEditorTab("edit")}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    editorTab === "edit"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("preview")}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    editorTab === "preview"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            {/* Modal Body / Editor content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col min-h-0">
              {editorTab === "edit" ? (
                <div className="flex-1 flex flex-col gap-3 min-h-0">
                  {/* Custom Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                    <button
                      type="button"
                      onClick={() => insertTag("<h1>", "</h1>")}
                      className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-xs font-nunito-bold text-slate-700 cursor-pointer shadow-sm"
                      title="Header 1"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag("<h2>", "</h2>")}
                      className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-xs font-nunito-bold text-slate-700 cursor-pointer shadow-sm"
                      title="Header 2"
                    >
                      H2
                    </button>
                    <div className="w-px h-5 bg-slate-200 mx-1"></div>
                    <button
                      type="button"
                      onClick={() => insertTag("<b>", "</b>")}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-xs font-nunito-bold text-slate-700 cursor-pointer shadow-sm"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag("<i>", "</i>")}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-xs italic font-nunito-semibold text-slate-700 cursor-pointer shadow-sm"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag("<u>", "</u>")}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-xs underline font-nunito-semibold text-slate-700 cursor-pointer shadow-sm"
                      title="Underline"
                    >
                      U
                    </button>
                    <div className="w-px h-5 bg-slate-200 mx-1"></div>
                    <button
                      type="button"
                      onClick={() => insertTag("<p>", "</p>")}
                      className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-xs font-nunito-semibold text-slate-700 cursor-pointer shadow-sm"
                      title="Paragraph"
                    >
                      Paragraph
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag("<ul>\n  <li>", "</li>\n</ul>")}
                      className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-xs font-nunito-semibold text-slate-700 cursor-pointer shadow-sm"
                      title="Unordered List"
                    >
                      List Item
                    </button>
                  </div>

                  {/* Textarea */}
                  <textarea
                    id="legal-textarea"
                    value={editorHtml}
                    onChange={(e) => setEditorHtml(e.target.value)}
                    className="flex-1 w-full p-4 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-2xl text-sm font-mono text-slate-700 bg-white transition-all resize-none shadow-inner"
                    placeholder="Enter document HTML here..."
                  />
                </div>
              ) : (
                /* Live HTML Preview Pane */
                <div className="flex-1 w-full p-6 border border-slate-100 rounded-2xl bg-[#FBFBFC] overflow-y-auto shadow-inner">
                  <div
                    className="prose prose-sm max-w-none font-nunito text-slate-700 leading-relaxed
                      prose-headings:font-nunito-bold prose-headings:text-slate-800
                      prose-h1:text-xl prose-h1:mb-4 prose-h1:mt-2
                      prose-h2:text-base prose-h2:mb-3 prose-h2:mt-4
                      prose-p:mb-3 prose-p:text-sm
                      prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-3"
                    dangerouslySetInnerHTML={{
                      __html:
                        editorHtml ||
                        "<p className='text-slate-400 italic'>No content to preview.</p>",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-4 border-t border-slate-50 bg-slate-50/30 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLegal}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm shadow-brand-primary/10 active:scale-[0.98]"
              >
                Save Document
              </button>
            </div>
          </div>
        </div>
      )}
      {/* FAQ Form Modal */}
      {isFaqFormOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-[60] transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-100 relative mx-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <h3 className="text-lg font-nunito-bold text-slate-800 mb-4">
              {faqFormMode === "add" ? "Add New FAQ" : "Edit FAQ"}
            </h3>

            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-nunito-bold text-slate-400 uppercase tracking-wider mb-2">
                  Question
                </label>
                <input
                  type="text"
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="Enter the question..."
                  className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-nunito-bold text-slate-400 uppercase tracking-wider mb-2">
                  Answer
                </label>
                <textarea
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="Enter the answer..."
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-50">
              <button
                onClick={() => setIsFaqFormOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-nunito-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFaq}
                className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl text-sm font-nunito-semibold cursor-pointer transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
