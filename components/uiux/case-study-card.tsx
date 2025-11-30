import Link from "next/link";
import { Tag } from "./tag";

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
};

export function CaseStudyCard({ slug, title, summary, tags }: CaseStudy) {
  return (
    <Link
      href={`/uiux/${slug}`}
      className="group block rounded-lg border border-neutral-800 bg-neutral-900 p-4 hover:bg-neutral-850 transition-colors duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="link-hover font-sans text-lg md:text-xl font-medium text-neutral-100">
          {title}
        </h3>
      </div>
      <p className="mt-2 text-sm text-neutral-300 max-w-prose">
        {summary}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t) => (
          <Tag key={t} label={t} />
        ))}
      </div>
    </Link>
  );
}
