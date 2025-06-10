"use client";
import React from "react";
import WorkTextUI from "./ui/worktextui";

const WorkComponent = () => {
  const workData = ["Web Development", "Game Development", "Graphic Design","3D Modelling", "UI Design"];
  return (
    <>
      <div className="relative -z-20 flex items-center justify-center bg-white text-white h-screen w-screen overflow-hidden">
        <div className="absolute top-0 right-0 mt-20 mr-20 text-right">
          {workData.map((work, idx) =>(
            <WorkTextUI key={idx} text={work} />
          ))}
        </div>
      </div>
    </>
  );
};

export default WorkComponent;
