import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  iconBgClass: string;
  value: string | number;
  label: string;
  subtitle?: string;
  attention?: boolean;
}

export function StatCard({
  icon,
  iconBgClass,
  value,
  label,
  subtitle,
  attention = false,
}: StatCardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl border p-5 relative shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer
        ${attention ? "border-[#FECACA]" : "border-[#E2E8F0]"}
      `}
    >
      {/* Attention Badge */}
      {attention && (
        <span className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-[10px] font-nunito-bold px-2.5 py-0.5 rounded-full">
          Attention
        </span>
      )}

      {/* Icon */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBgClass}`}
      >
        {icon}
      </div>

      {/* Value */}
      <p className="text-2xl font-nunito-bold text-slate-800 leading-tight">
        {value}
      </p>

      {/* Label */}
      <p className="text-xs font-nunito-medium text-slate-500 mt-1">{label}</p>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-[10px] font-nunito text-slate-400 mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  );
}
