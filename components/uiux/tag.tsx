import React from "react";

type TagProps = {
  label: string;
};

export function Tag({ label }: TagProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-800 px-2 py-0.5 text-xs text-neutral-200 bg-neutral-900">
      {label}
    </span>
  );
}
