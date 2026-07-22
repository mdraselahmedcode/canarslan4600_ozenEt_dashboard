import React from "react";

interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function DollarIcon({
  size = 22,
  width,
  height,
  color = "#0891B2",
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
        d="M11 1.83331V20.1666"
        stroke={color}
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5833 4.58331H8.70833C7.85743 4.58331 7.04138 4.92133 6.4397 5.52301C5.83802 6.12469 5.5 6.94074 5.5 7.79165C5.5 8.64255 5.83802 9.4586 6.4397 10.0603C7.04138 10.662 7.85743 11 8.70833 11H13.2917C14.1426 11 14.9586 11.338 15.5603 11.9397C16.162 12.5414 16.5 13.3574 16.5 14.2083C16.5 15.0592 16.162 15.8753 15.5603 16.4769C14.9586 17.0786 14.1426 17.4166 13.2917 17.4166H5.5"
        stroke={color}
        strokeWidth="1.83333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
