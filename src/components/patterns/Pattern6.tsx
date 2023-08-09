import React from "react";

const Pattern6: React.FC<{ fill: string }> = ({ fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={`${fill}`}
    >
      <defs>
        <clipPath id="clipPath-6">
          <path d="M 32 0 L 42.1823 21.8177 L 64 32 L 42.1823 42.1823 L 32 64 L 21.8177 42.1823 L 0 32 L 21.8177 21.8177 L 32 0" />
        </clipPath>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        clipPath="url(#clipPath-6)"
      />
    </svg>
  );
};

export default Pattern6;
