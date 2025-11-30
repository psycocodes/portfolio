export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-xs text-neutral-300">
      {children}
    </span>
  );
}
