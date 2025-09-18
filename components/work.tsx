"use client";
import React from "react";
import Link from "next/link";
import WorkTextUI from "./ui/worktextui";

const WorkComponent = () => {
  const workData = [
    "Web Development",
    "App Development",
    "Machine Learning",
    "Game Development",
    "Graphic Design",
    "3D Modelling",
    "UI Design",
  ];

  return (
    <>
      <div
        id="work"
        className="relative -z-20 flex items-center justify-center"
      >
        <div className="absolute top-0 right-0 pt-20 pr-20 bg-white h-auto w-full">
          {workData.map((work, idx) => {
            // Make Game Development clickable and link to gamedev page
            if (work === "Game Development") {
              return (
                <Link
                  key={idx}
                  href="/gamedev"
                  className="block cursor-pointer"
                >
                  <WorkTextUI text={work} isClickable={true} />
                </Link>
              );
            }
            return <WorkTextUI key={idx} text={work} isClickable={false} />;
          })}
        </div>
      </div>
    </>
  );
};

export default WorkComponent;
