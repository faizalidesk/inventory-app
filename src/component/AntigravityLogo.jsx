import { useId } from "react";

export default function AntigravityLogo({ className = "", ...props }) {
  const gradientId = useId();
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1="10%" y1="90%" x2="90%" y2="10%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="30%" stopColor="#10b981" />
          <stop offset="58%" stopColor="#f59e0b" />
          <stop offset="82%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path
        d="M 12 83 C 25 72 34 16 50 16 C 66 16 75 72 88 83 C 91 87 82 91 77 82 C 69 66 59 52 50 52 C 41 52 31 66 23 82 C 18 91 9 87 12 83 Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}
