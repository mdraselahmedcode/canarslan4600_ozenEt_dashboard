import React from "react";

interface LocationIconProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export function LocationIcon({
  size = 17,
  color = "#000",
  className = "",
  strokeWidth = 1.41667,
}: LocationIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.92575 15.4409C10.2432 14.3033 14.1667 10.62 14.1667 7.08329C14.1667 5.5804 13.5697 4.13906 12.507 3.07635C11.4443 2.01365 10.0029 1.41663 8.50004 1.41663C6.99715 1.41663 5.55581 2.01365 4.4931 3.07635C3.4304 4.13906 2.83337 5.5804 2.83337 7.08329C2.83337 10.62 6.75683 14.3033 8.07433 15.4409C8.19707 15.5332 8.34648 15.5831 8.50004 15.5831C8.65361 15.5831 8.80301 15.5332 8.92575 15.4409Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 9.20837C9.6736 9.20837 10.625 8.25698 10.625 7.08337C10.625 5.90977 9.6736 4.95837 8.5 4.95837C7.32639 4.95837 6.375 5.90977 6.375 7.08337C6.375 8.25698 7.32639 9.20837 8.5 9.20837Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
