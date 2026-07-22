import React from "react";

interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function DoubleCheckIcon({
  size = 22,
  width,
  height,
  color = "#16A34A",
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
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16.5 5.5L6.41671 15.5833L1.83337 11"
        stroke={color}
        strokeWidth={1.83333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.1666 9.16669L13.2916 16.0417L11.9166 14.6667"
        stroke={color}
        strokeWidth={1.83333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
