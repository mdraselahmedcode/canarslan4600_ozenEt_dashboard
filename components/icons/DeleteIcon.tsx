import React from "react";

interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export function DeleteIcon({
  size = 13,
  width,
  height,
  color = "#DC2626",
  className = "",
  strokeWidth = 1.08333,
}: IconProps) {
  const iconWidth = width || size;
  const iconHeight = height || size;

  return (
    <svg
      width={iconWidth}
      height={iconHeight}
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1.625 3.25H11.375"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.2917 3.25V10.8333C10.2917 11.375 9.75004 11.9167 9.20837 11.9167H3.79171C3.25004 11.9167 2.70837 11.375 2.70837 10.8333V3.25"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.33337 3.24998V2.16665C4.33337 1.62498 4.87504 1.08331 5.41671 1.08331H7.58337C8.12504 1.08331 8.66671 1.62498 8.66671 2.16665V3.24998"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.41663 5.95831V9.20831"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.58337 5.95831V9.20831"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
