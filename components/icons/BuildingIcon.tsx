import React from "react";

interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export function BuildingIcon({
  size = 15,
  width,
  height,
  color = "#94A3B8",
  className = "",
  strokeWidth = 1.25,
}: IconProps) {
  const iconWidth = width || size;
  const iconHeight = height || size;

  return (
    <svg
      width={iconWidth}
      height={iconHeight}
      viewBox="0 0 15 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_239_3740)">
        <path
          d="M3.75 15.75V4.5C3.75 4.16848 3.8817 3.85054 4.11612 3.61612C4.35054 3.3817 4.66848 3.25 5 3.25H10C10.3315 3.25 10.6495 3.3817 10.8839 3.61612C11.1183 3.85054 11.25 4.16848 11.25 4.5V15.75H3.75Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.75 9.5H2.5C2.16848 9.5 1.85054 9.6317 1.61612 9.86612C1.3817 10.1005 1.25 10.4185 1.25 10.75V14.5C1.25 14.8315 1.3817 15.1495 1.61612 15.3839C1.85054 15.6183 2.16848 15.75 2.5 15.75H3.75"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.25 7.625H12.5C12.8315 7.625 13.1495 7.7567 13.3839 7.99112C13.6183 8.22554 13.75 8.54348 13.75 8.875V14.5C13.75 14.8315 13.6183 15.1495 13.3839 15.3839C13.1495 15.6183 12.8315 15.75 12.5 15.75H11.25"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.25 5.75H8.75"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.25 8.25H8.75"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.25 10.75H8.75"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.25 13.25H8.75"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_239_3740">
          <rect
            width="15"
            height="15"
            fill="white"
            transform="translate(0 2)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
