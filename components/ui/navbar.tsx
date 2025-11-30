"use client";
import Link from "next/link";
import React from "react";


const Navbar = () => {
  const links = [
    { name: "ABOUT", href: "/#about", searchHref: "#about" },
    { name: "WORK", href: "/#work", searchHref: "#work" },
    { name: "CONNECT", href: "/#connect", searchHref: "#connect" },
    { name: "RESUME", href: "https://bit.ly/mohikshitghorai-resume-uiux", searchHref: "#resume" },
  ];



  return (
    <div className="fixed left-0 top-0 w-full flex mix-blend-difference bg-transparent text-l font-extralight py-2 px-5">
        <Link href="/" className="w-[40vw] text-white font-regular">
        <div className="expanding-initials">
            <span>M</span><span>OHIKSHIT</span>
            <span>G</span><span>HORAI</span>
        </div>
        </Link>
      <nav className="flex items-center w-full justify-between">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-white link-hover"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Navbar;
