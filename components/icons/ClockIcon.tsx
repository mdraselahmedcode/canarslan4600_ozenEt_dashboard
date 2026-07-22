import React from "react";

interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function ClockIcon({
  size = 22,
  width,
  height,
  color = "#EA580C",
  className = "",
}: IconProps) {
  const iconWidth = width || size;
  const iconHeight = height || size;

  return (
    <svg
      width={iconWidth}
      height={iconHeight}
      viewBox="0 0 22 22"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 20.1666C16.0627 20.1666 20.1667 16.0626 20.1667 11C20.1667 5.93737 16.0627 1.83331 11 1.83331C5.93743 1.83331 1.83337 5.93737 1.83337 11C1.83337 16.0626 5.93743 20.1666 11 20.1666Z"
        stroke={color}
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 5.5V11L14.6667 12.8333"
        stroke={color}
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
