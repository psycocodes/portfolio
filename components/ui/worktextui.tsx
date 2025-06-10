import React from "react";

const WorkTextUI = ({ text }: { text: string }) => {
  return (
    <div className="perspective-[800px] group">
      <div
        className="transform rotate-y-[-25deg] rotate-z-[-2deg] -translate-y-[10px] group-hover:transform-none transition-transform 
                scale-110 group-hover:scale-100 transition-scale
                text-black group-hover:text-transparent transition-color
                group-hover:translate-y-0
                origin-right 
                pointer-events-none
                duration-500 ease-in-out 
                font-cantry text-[10vh] max-text-[10vh] uppercase font-bold text-right
               "
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
