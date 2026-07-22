import React from "react";

interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export function PageIcon({
  size = 17,
  width,
  height,
  color = "#000",
  className = "",
  strokeWidth = 1.41667,
}: IconProps) {
  const iconWidth = width || size;
  const iconHeight = height || size;

  return (
    <svg
      width={iconWidth}
      height={iconHeight}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10.625 1.41663H4.25004C3.87432 1.41663 3.51398 1.56588 3.24831 1.83156C2.98263 2.09723 2.83337 2.45757 2.83337 2.83329V14.1666C2.83337 14.5423 2.98263 14.9027 3.24831 15.1684C3.51398 15.434 3.87432 15.5833 4.25004 15.5833H12.75C13.1258 15.5833 13.4861 15.434 13.7518 15.1684C14.0175 14.9027 14.1667 14.5423 14.1667 14.1666V4.95829L10.625 1.41663Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.91663 1.41663V4.24996C9.91663 4.62568 10.0659 4.98602 10.3316 5.25169C10.5972 5.51737 10.9576 5.66663 11.3333 5.66663H14.1666"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.08329 6.375H5.66663"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3333 9.20837H5.66663"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3333 12.0416H5.66663"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
