import React from "react";

const Pattern5: React.FC<{ fill: string }> = ({ fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 360 360"
      className={`${fill}`}
    >
      <defs>
        <clipPath id="clipPath-5">
          <path d="M 332.62 174.72 c 17.62 19.23 27.38 44.24 27.38 70.4 c 0 57.47 -46.77 104.25 -104.23 104.25 c -28.54 0 -56.15 -11.93 -75.77 -32.7 c -19.62 20.77 -47.23 32.7 -75.77 32.7 C 46.77 349.37 0 302.59 0 245.12 c 0 -26.16 9.69 -51.16 27.38 -70.4 C 9.69 155.49 0 130.48 0 104.32 C 0 46.85 46.77 0.07 104.23 0.07 c 28.54 0 56.15 11.93 75.77 32.7 c 19.62 -20.77 47.23 -32.7 75.77 -32.7 C 313.23 0.07 360 46.85 360 104.32 C 360 130.48 350.31 155.49 332.62 174.72 Z" />
        </clipPath>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        clipPath="url(#clipPath-5)"
      />
    </svg>
  );
};

export default Pattern5;
