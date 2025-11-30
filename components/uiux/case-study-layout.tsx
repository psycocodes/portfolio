import React from "react";
import { SectionHeader } from "./section-header";
import { Tag } from "./tag";

export type CaseStudyMeta = {
  title: string;
  role: string;
  timeframe: string;
  tools: ReadonlyArray<string>;
  summary: string;
  tags?: ReadonlyArray<string>;
};

type CaseStudyLayoutProps = {
  meta: CaseStudyMeta;
  children: React.ReactNode;
};

export function CaseStudyLayout({ meta, children }: CaseStudyLayoutProps) {
  return (
    <article className="mx-auto max-w-4xl px-4 md:px-6 py-10">
      <header className="mb-8">
        <h1 className="font-sans text-3xl md:text-4xl font-semibold text-neutral-900">
          {meta.title}
        </h1>
        <p className="mt-3 text-neutral-700 max-w-prose">{meta.summary}</p>
        <dl className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <dt className="text-neutral-500">Role</dt>
            <dd className="text-neutral-900">{meta.role}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Timeframe</dt>
            <dd className="text-neutral-900">{meta.timeframe}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Tools</dt>
            <dd className="text-neutral-900">{meta.tools.join(", ")}</dd>
          </div>
          {meta.tags && (
            <div>
              <dt className="text-neutral-500">Tags</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {meta.tags.map((t) => (
                  <Tag key={t} label={t} />
                ))}
              </dd>
            </div>
          )}
        </dl>
      </header>

      <div className="space-y-12">
        {children}
      </div>

      <footer className="mt-14">
        <SectionHeader
          title="Outcomes / Impact"
          subtitle="Summarize measurable results and learnings from the project."
        />
        <ul className="mt-4 list-disc pl-5 text-neutral-800">
          <li>Increased conversion by X% through streamlined onboarding.</li>
          <li>Reduced support tickets by Y% after information architecture updates.</li>
        </ul>
      </footer>
    </article>
  );
}
