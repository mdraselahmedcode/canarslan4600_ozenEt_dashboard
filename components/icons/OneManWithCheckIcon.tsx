import React from "react";

interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function OneManWithCheckIcon({
  size = 22,
  width,
  height,
  color = "#D97706",
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
        d="M14.6667 19.25V17.4167C14.6667 16.4442 14.2804 15.5116 13.5928 14.8239C12.9051 14.1363 11.9725 13.75 11 13.75H5.50004C4.52758 13.75 3.59495 14.1363 2.90732 14.8239C2.21968 15.5116 1.83337 16.4442 1.83337 17.4167V19.25"
        stroke={color}
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.25004 10.0833C10.2751 10.0833 11.9167 8.44171 11.9167 6.41667C11.9167 4.39162 10.2751 2.75 8.25004 2.75C6.225 2.75 4.58337 4.39162 4.58337 6.41667C4.58337 8.44171 6.225 10.0833 8.25004 10.0833Z"
        stroke={color}
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6666 10.0833L16.5 11.9167L20.1666 8.25"
        stroke={color}
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
