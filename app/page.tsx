"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckInCircleIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "@/components/icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email address is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setIsLoading(true);

    // Mock login delay
    setTimeout(() => {
      setIsLoading(false);
      if (email === "admin@ozen-et.com" && password === "admin123") {
        setIsSuccess(true);
      } else {
        setError("Invalid email address or password.");
      }
    }, 1500);
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
      {/* LEFT SECTION - Red Banner (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 lg:w-[48%] bg-brand-primary flex-col items-center justify-center p-8 lg:p-12 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-white/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-white/5 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md flex flex-col items-center z-10">
          {/* Logo Container */}
          <div className="bg-white rounded-[28px] p-5 shadow-2xl flex items-center justify-center w-36 h-36 mb-6 transition-transform duration-300 hover:scale-105">
            <Image
              src="/images/dashboard_login_logo.png"
              alt="Özen Et B2B Logo"
              width={100}
              height={100}
              priority
              className="object-contain"
            />
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-3xl font-nunito-bold text-white tracking-wide mt-2 text-center">
            Admin Dashboard
          </h1>
          <p className="text-sm font-nunito text-white/70 tracking-wide text-center mt-1.5 mb-10 max-w-xs">
            B2B Wholesale Management System
          </p>

          {/* Features List */}
          <div className="w-full max-w-sm bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <CheckInCircleIcon color="#ffffff" size={18} />
              <span className="text-sm text-white/90 font-nunito-medium">
                Manage customers & approvals
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckInCircleIcon color="#ffffff" size={18} />
              <span className="text-sm text-white/90 font-nunito-medium">
                Track all B2B orders
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckInCircleIcon color="#ffffff" size={18} />
              <span className="text-sm text-white/90 font-nunito-medium">
                Control product catalog
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckInCircleIcon color="#ffffff" size={18} />
              <span className="text-sm text-white/90 font-nunito-medium">
                Custom pricing per customer
              </span>
            </div>
          </div>
        </div>

        {/* Footer Brand Info */}
        <div className="absolute bottom-6 text-xs text-white/40 font-nunito">
          © {new Date().getFullYear()} Özen Et. All rights reserved.
        </div>
      </div>

      {/* RIGHT SECTION - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-12 lg:px-24">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="flex md:hidden flex-col items-center mb-8">
          <div className="bg-white rounded-2xl p-3 shadow-md flex items-center justify-center w-20 h-20 mb-3 border border-slate-100">
            <Image
              src="/images/dashboard_login_logo.png"
              alt="Özen Et B2B Logo"
              width={56}
              height={56}
              priority
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-nunito-bold text-slate-800">
            Özen Et Admin
          </h2>
          <p className="text-xs text-slate-400 font-nunito mt-0.5">
            B2B Wholesale Management
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[420px]">
          {isSuccess ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 text-center animate-fade-in">
              <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckInCircleIcon color="var(--color-success)" size={32} />
              </div>
              <h2 className="text-2xl font-nunito-bold text-slate-800 mb-2">
                Welcome Admin!
              </h2>
              <p className="text-sm font-nunito text-slate-500 mb-6">
                You have successfully authenticated. Redirecting to your dashboard...
              </p>
              <div className="flex justify-center">
                <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
              <h2 className="text-2xl md:text-3xl font-nunito-bold text-slate-800 mb-1.5">
                Welcome back
              </h2>
              <p className="text-sm font-nunito text-slate-500 mb-8">
                Sign in to your admin account
              </p>

              {error && (
                <div className="bg-status-error/10 border border-status-error/20 text-status-error text-xs rounded-lg p-3.5 mb-6 font-nunito flex items-center gap-2">
                  <span className="font-nunito-bold">Error:</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-nunito-semibold text-slate-700 mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <MailIcon size={18} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@ozen-et.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400 bg-white"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-nunito-semibold text-slate-700 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <LockIcon size={18} />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400 bg-white"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                  </div>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-nunito-bold text-link hover:underline block text-right mt-2.5 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-nunito-bold rounded-xl transition-all shadow-md shadow-brand-primary/10 hover:shadow-brand-primary/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
