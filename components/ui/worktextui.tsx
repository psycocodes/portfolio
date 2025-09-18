import React from "react";

const WorkTextUI = ({
  text,
  isClickable = false,
}: {
  text: string;
  isClickable?: boolean;
}) => {
  return (
    <div className="perspective-[800px] group">
      <div
        className={`transform rotate-y-[-25deg] rotate-z-[-2deg] -translate-y-[10px] group-hover:transform-none transition-transform 
                scale-110 group-hover:scale-100 transition-scale
                text-black group-hover:text-transparent transition-color
                group-hover:translate-y-0
                origin-right 
                ${
                  isClickable
                    ? "pointer-events-auto cursor-pointer"
                    : "pointer-events-none"
                }
                duration-500 ease-in-out 
                font-cantry text-[10vh] max-text-[10vh] uppercase font-bold text-right
               `}
        style={{
          WebkitTextStroke: "2px rgba(0, 0, 0, 0.5)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default WorkTextUI;
