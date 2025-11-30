"use client";
import { useEffect } from "react";

export function Lightbox({ src, caption, onClose }: { src: string; caption?: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
      <div className="relative max-w-4xl mx-auto" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={caption || "image"} className="rounded-md shadow-lg" />
        {caption && <p className="mt-3 text-center text-sm text-neutral-300">{caption}</p>}
      </div>
    </div>
  );
}
