import React from "react";

interface MicIconProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export function MicIcon({
  size = 20,
  color = "#7C3AED",
  className = "",
  strokeWidth = 1.66667,
}: MicIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2.5 9.16667L17.5 5V15L2.5 11.6667V9.16667Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.66664 14.0001C9.5791 14.3174 9.4299 14.6145 9.22756 14.8742C9.02523 15.1339 8.77373 15.3512 8.48741 15.5137C8.2011 15.6762 7.88558 15.7807 7.55888 15.8212C7.23217 15.8618 6.90067 15.8376 6.58331 15.7501C6.26595 15.6625 5.96894 15.5133 5.70924 15.311C5.44954 15.1087 5.23223 14.8572 5.06973 14.5709C4.90723 14.2845 4.80271 13.969 4.76215 13.6423C4.72158 13.3156 4.74576 12.9841 4.83331 12.6667"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
