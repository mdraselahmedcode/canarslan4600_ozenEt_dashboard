import React from "react";

interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function TotalOrdersIcon({
  size = 22,
  width,
  height,
  color = "#059669",
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
        d="M5.5 1.83331L2.75 5.49998V18.3333C2.75 18.8195 2.94315 19.2859 3.28697 19.6297C3.63079 19.9735 4.0971 20.1666 4.58333 20.1666H17.4167C17.9029 20.1666 18.3692 19.9735 18.713 19.6297C19.0568 19.2859 19.25 18.8195 19.25 18.3333V5.49998L16.5 1.83331H5.5Z"
        stroke={color}
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.75 5.5H19.25"
        stroke={color}
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6666 9.16669C14.6666 10.1391 14.2803 11.0718 13.5926 11.7594C12.905 12.447 11.9724 12.8334 10.9999 12.8334C10.0275 12.8334 9.09483 12.447 8.40719 11.7594C7.71956 11.0718 7.33325 10.1391 7.33325 9.16669"
        stroke={color}
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
