import React from "react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <header className={className}>
      <h2 className="font-sans text-2xl md:text-3xl font-semibold text-white tracking-tight">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 text-sm md:text-base text-neutral-300 max-w-prose">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
