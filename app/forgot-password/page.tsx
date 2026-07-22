"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MailIcon,
  BackIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/components/icons";

type ResetStep =
  | "REQUEST_EMAIL"
  | "VERIFY_CODE"
  | "NEW_PASSWORD"
  | "SUCCESS_STATUS";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<ResetStep>("REQUEST_EMAIL");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);

  const canResend = timer === 0;

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Simple email verification regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  // Timer hook for Step 2: Verification Code
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "VERIFY_CODE" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Request code submit handler
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    // Mock network delay
    setTimeout(() => {
      setIsLoading(false);
      if (email.toLowerCase() === "admin@ozen-et.com") {
        setStep("VERIFY_CODE");
        setTimer(60);
      } else {
        setError("This email address is not registered in our admin system.");
      }
    }, 1200);
  };

  // Verify Code input focus handling
  const handleOtpChange = (value: string, index: number) => {
    const newCode = [...code];
    // Keep only the last character entered
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    // Automatically focus the next input if value entered is not empty
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    // Focus the previous input on backspace if current is empty
    if (e.key === "Backspace" && !code[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const splitCode = pastedData.split("");
      setCode(splitCode);
      // Focus the last input
      otpInputRefs.current[5]?.focus();
    }
  };

  // Verify code submit handler
  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const enteredCode = code.join("");

    setTimeout(() => {
      setIsLoading(false);
      // Let's use 123456 as the validation OTP code
      if (enteredCode === "123456") {
        setStep("NEW_PASSWORD");
      } else {
        setError("Invalid verification code. Please enter 123456 to test.");
      }
    }, 1200);
  };

  const handleResendCode = () => {
    if (!canResend) return;
    setError("");
    setTimer(60);
    setCode(Array(6).fill(""));
    otpInputRefs.current[0]?.focus();
    // In a real app we'd trigger api to resend email
  };

  // Save new password submit handler
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep("SUCCESS_STATUS");
    }, 1200);
  };

  // Format countdown text helper
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] px-6 py-12">
      {/* Back button (Only visible in Step 1 and 2) */}
      {(step === "REQUEST_EMAIL" || step === "VERIFY_CODE") && (
        <div className="w-full max-w-[420px] mb-6 flex justify-start">
          <button
            onClick={() => {
              if (step === "VERIFY_CODE") {
                setStep("REQUEST_EMAIL");
                setError("");
              } else {
                window.location.href = "/";
              }
            }}
            className="flex items-center gap-2 text-sm font-nunito-semibold text-slate-500 hover:text-slate-800 transition-colors focus:outline-none"
          >
            <BackIcon width={18} height={20} />
            {step === "VERIFY_CODE" ? "Back" : "Back to Sign In"}
          </button>
        </div>
      )}

      {/* Card Wrapper */}
      <div className="w-full max-w-[420px]">
        {/* STEP 1: REQUEST EMAIL */}
        {step === "REQUEST_EMAIL" && (
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center">
            <div className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6">
              <MailIcon size={24} color="var(--color-brand-primary)" />
            </div>

            <h2 className="text-2xl font-nunito-bold text-slate-800 mb-2 text-center">
              Reset Password
            </h2>
            <p className="text-sm font-nunito text-slate-500 mb-8 text-center max-w-[300px] leading-relaxed">
              {"Enter your admin email and we'll send you a verification code."}
            </p>

            {error && (
              <div className="w-full bg-status-error/10 border border-status-error/20 text-status-error text-xs rounded-lg p-3.5 mb-6 font-nunito flex items-center gap-2">
                <span className="font-nunito-bold">Error: </span> {error}
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="w-full space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-nunito-semibold text-slate-700 mb-2"
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

              {isLoading ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 bg-brand-primary/70 text-white font-nunito-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed text-sm"
                >
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending Code...</span>
                </button>
              ) : isEmailValid ? (
                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-nunito-bold rounded-xl transition-all shadow-md shadow-brand-primary/10 hover:shadow-brand-primary/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-sm"
                >
                  Send Verification Code
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 bg-slate-100 text-slate-400 font-nunito-bold rounded-xl cursor-not-allowed text-sm text-center"
                >
                  Send Verification Code
                </button>
              )}
            </form>
          </div>
        )}

        {/* STEP 2: VERIFY CODE */}
        {step === "VERIFY_CODE" && (
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center">
            <h2 className="text-2xl font-nunito-bold text-slate-800 mb-2 text-center">
              Enter Verification Code
            </h2>
            <p className="text-sm font-nunito text-slate-500 mb-8 text-center max-w-[320px] leading-relaxed">
              Enter the 6-digit code sent to your email address.
            </p>

            {error && (
              <div className="w-full bg-status-error/10 border border-status-error/20 text-status-error text-xs rounded-lg p-3.5 mb-6 font-nunito flex items-center gap-2">
                <span className="font-nunito-bold">Error:</span> {error}
              </div>
            )}

            <form
              onSubmit={handleVerifySubmit}
              className="w-full flex flex-col items-center space-y-6"
            >
              {/* 6 Digit Inputs Box container */}
              <div
                className="flex gap-2 justify-center w-full"
                onPaste={handleOtpPaste}
              >
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-nunito-bold border border-slate-200 rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all bg-white text-slate-800"
                    disabled={isLoading}
                  />
                ))}
              </div>

              {/* Countdown or Resend */}
              <div className="text-sm font-nunito text-slate-500">
                {timer > 0 ? (
                  <span>
                    Resend code in{" "}
                    <strong className="text-brand-primary font-nunito-bold">
                      {formatTimer(timer)}
                    </strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-brand-primary font-nunito-bold hover:underline focus:outline-none transition-colors"
                  >
                    Resend code
                  </button>
                )}
              </div>

              {/* Submit Button */}
              {isLoading ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 bg-brand-primary/70 text-white font-nunito-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed text-sm"
                >
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </button>
              ) : code.every((char) => char.length === 1) ? (
                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-nunito-bold rounded-xl transition-all shadow-md shadow-brand-primary/10 hover:shadow-brand-primary/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-sm"
                >
                  Verify Code
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 bg-slate-100 text-slate-400 font-nunito-bold rounded-xl cursor-not-allowed text-sm text-center"
                >
                  Verify Code
                </button>
              )}
            </form>
          </div>
        )}

        {/* STEP 3: CREATE NEW PASSWORD */}
        {step === "NEW_PASSWORD" && (
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
            <h2 className="text-2xl font-nunito-bold text-slate-800 mb-2">
              Create New Password
            </h2>
            <p className="text-sm font-nunito text-slate-500 mb-8 leading-relaxed">
              Choose a strong password for your admin account.
            </p>

            {error && (
              <div className="w-full bg-status-error/10 border border-status-error/20 text-status-error text-xs rounded-lg p-3.5 mb-6 font-nunito flex items-center gap-2">
                <span className="font-nunito-bold">Error:</span> {error}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-nunito-semibold text-slate-700 mb-1.5"
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <LockIcon size={18} />
                  </div>
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400 bg-white"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    disabled={isLoading}
                  >
                    {showNewPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-nunito-semibold text-slate-700 mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <LockIcon size={18} />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400 bg-white"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              {isLoading ? (
                <button
                  type="button"
                  disabled
                  className="w-full mt-6 py-3.5 bg-brand-primary/70 text-white font-nunito-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed text-sm"
                >
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Password...</span>
                </button>
              ) : newPassword.length >= 6 &&
                confirmPassword.length >= 6 &&
                newPassword === confirmPassword ? (
                <button
                  type="submit"
                  className="w-full mt-6 py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-nunito-bold rounded-xl transition-all shadow-md shadow-brand-primary/10 hover:shadow-brand-primary/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-sm"
                >
                  Save New Password
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full mt-6 py-3.5 bg-slate-100 text-slate-400 font-nunito-bold rounded-xl cursor-not-allowed text-sm text-center"
                >
                  Save New Password
                </button>
              )}
            </form>
          </div>
        )}

        {/* STEP 4: SUCCESS STATUS */}
        {step === "SUCCESS_STATUS" && (
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 text-center animate-fade-in flex flex-col items-center">
            {/* Custom Green Double Ring Success Tick Icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-4 border-emerald-500/20 flex items-center justify-center mb-6 relative animate-bounce-short">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transform scale-110"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-nunito-bold text-slate-800 mb-2">
              Password Updated!
            </h2>
            <p className="text-sm font-nunito text-slate-500 mb-8 leading-relaxed max-w-[300px]">
              Your admin password has been successfully updated.
            </p>

            <Link
              href="/"
              className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-nunito-bold rounded-xl transition-all shadow-md shadow-brand-primary/10 hover:shadow-brand-primary/20 text-sm block hover:scale-[1.01] active:scale-[0.99] text-center"
            >
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
