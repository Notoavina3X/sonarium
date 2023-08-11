import { tv } from "@nextui-org/react";
import React from "react";

type LoaderProps = {
  size: "sm" | "md" | "lg";
  color: "primary" | "default";
};

const loader = tv({
  base: "aspect-square ps-[2px]",
  variants: {
    color: {
      primary: "text-primary",
      default: "text-foreground-300",
    },
    size: {
      sm: "h-3.5",
      md: "h-5",
      lg: "h-7",
    },
  },
});

const Loader: React.FC<LoaderProps> = ({ size = "md", color = "default" }) => {
  return (
    <div className="flex">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 20 20"
        xmlSpace="preserve"
        className={loader({ size, color })}
      >
        <rect x="0" y="0" width="4" height="20" className="fill-current">
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="1; .2; 1"
            begin="0s"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="7" y="0" width="4" height="20" className="fill-current">
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="1; .2; 1"
            begin="0.3s"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="14" y="0" width="4" height="20" className="fill-current">
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="1; .2; 1"
            begin="0.6s"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  );
};

export default Loader;
