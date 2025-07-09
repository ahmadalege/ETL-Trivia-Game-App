import React from "react";

export default function ProgressBar({ current, total }) {
  const progressPercent =
    total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;

  return (
    <div
      className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-6 shadow-inner"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <div
        className="h-full transition-all duration-400 ease-out"
        style={{
          width: `${progressPercent}%`,
          backgroundColor: "#FF6F3C",
        }}
      />
    </div>
  );
}
