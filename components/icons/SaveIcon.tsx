import React from "react";

interface SaveIconProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export function SaveIcon({
  size = 15,
  color = "#94A3B8",
  className = "",
  strokeWidth = 1.25,
}: SaveIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M9.5 1.875C9.82971 1.8797 10.1442 2.01448 10.375 2.25L12.75 4.625C12.9855 4.85579 13.1203 5.17029 13.125 5.5V11.875C13.125 12.2065 12.9933 12.5245 12.7589 12.7589C12.5245 12.9933 12.2065 13.125 11.875 13.125H3.125C2.79348 13.125 2.47554 12.9933 2.24112 12.7589C2.0067 12.5245 1.875 12.2065 1.875 11.875V3.125C1.875 2.79348 2.0067 2.47554 2.24112 2.24112C2.47554 2.0067 2.79348 1.875 3.125 1.875H9.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.625 13.125V8.75C10.625 8.58424 10.5592 8.42527 10.4419 8.30806C10.3247 8.19085 10.1658 8.125 10 8.125H5C4.83424 8.125 4.67527 8.19085 4.55806 8.30806C4.44085 8.42527 4.375 8.58424 4.375 8.75V13.125"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.375 1.875V4.375C4.375 4.54076 4.44085 4.69973 4.55806 4.81694C4.67527 4.93415 4.83424 5 5 5H9.375"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
