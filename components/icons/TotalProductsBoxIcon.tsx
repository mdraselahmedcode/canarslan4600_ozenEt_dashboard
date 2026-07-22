import React from "react";

interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function TotalProductsBoxIcon({
  size = 22,
  width,
  height,
  color = "#7C3AED",
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
        d="M10.0833 19.9192C10.362 20.0801 10.6782 20.1648 11 20.1648C11.3218 20.1648 11.638 20.0801 11.9167 19.9192L18.3333 16.2525C18.6118 16.0917 18.843 15.8606 19.0039 15.5823C19.1648 15.3039 19.2497 14.9882 19.25 14.6667V7.33333C19.2497 7.01183 19.1648 6.69607 19.0039 6.41772C18.843 6.13938 18.6118 5.90824 18.3333 5.74749L11.9167 2.08083C11.638 1.91992 11.3218 1.83521 11 1.83521C10.6782 1.83521 10.362 1.91992 10.0833 2.08083L3.66667 5.74749C3.38824 5.90824 3.15698 6.13938 2.99609 6.41772C2.8352 6.69607 2.75033 7.01183 2.75 7.33333V14.6667C2.75033 14.9882 2.8352 15.3039 2.99609 15.5823C3.15698 15.8606 3.38824 16.0917 3.66667 16.2525L10.0833 19.9192Z"
        stroke={color}
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 20.1667V11"
        stroke={color}
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.01587 6.41669L11 11L18.9842 6.41669"
        stroke={color}
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.875 3.91418L15.125 8.63502"
        stroke={color}
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
