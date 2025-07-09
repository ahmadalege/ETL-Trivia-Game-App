import React from "react";

export default function HintButton({ hintsLeft, onUseHint, disabled }) {
  return (
    <button
      onClick={onUseHint}
      disabled={disabled || hintsLeft <= 0}
      className={`px-5 py-3 rounded-full font-semibold transition ${
        disabled || hintsLeft <= 0
          ? "bg-gray-300 cursor-not-allowed text-gray-600"
          : "bg-[#FF6F3C] hover:bg-[#e65920] text-white"
      }`}
    >
      💡 Hint ({hintsLeft} left)
    </button>
  );
}
