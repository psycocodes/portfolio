{/* Horizontal Section Wrapper */}
const HorizontalScroller = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-6 overflow-x-auto snap-x snap-mandatory custom-scrollbar pb-4">
    <div className="flex gap-4 w-max px-1">{children}</div>
  </div>
);

const Card = ({
  image,
  title,
  subtitle,
  type,
}: {
  image: string;
  title: string;
  subtitle?: string;
  type?: string;
}) => (
  <div
    className={`
      relative shrink-0 overflow-hidden rounded-md border border-neutral-800 bg-neutral-900 
      shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)]
      ${
        type === "banner"
          ? "w-[80vw] md:w-[30rem]" 
          : "w-[88vw] md:w-[22rem]" 
      }
    `}
  >
 
    <div
      className={`
        overflow-hidden bg-neutral-800
        ${type === "banner" ? "aspect-[16/9]" : "aspect-square md:aspect-square"} 
      `}
    >
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition duration-500 hover:scale-105"
      />
    </div>


    <div className="p-3">
      <p className="w-full truncate text-sm text-neutral-300">
        <span className="font-semibold text-white">{title}</span>
        {subtitle && <span className="text-neutral-500"> — {subtitle}</span>}
      </p>
    </div>
  </div>
);

export { HorizontalScroller, Card };