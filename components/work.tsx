"use client";
import React from "react";
import WorkTextUI from "./ui/worktextui";

const WorkComponent = () => {
  const workData = ["Web Development", "App Development", "Machine Learning", "Game Development", "Graphic Design","3D Modelling", "UI Design"];
  return (
    <>
      <div className="relative -z-20 flex items-center justify-center">
        <div className="absolute top-0 right-0 pt-20 pr-20 bg-white h-auto w-screen">
          {workData.map((work, idx) =>(
            <WorkTextUI key={idx} text={work} />
          ))}
        </div>
        <div className="absolute left-20 bottom-20 text-indigo-600 text-5xl font-mono font-light"> work.exe</div>
      </div>
    </>
  );
};

export default WorkComponent;
