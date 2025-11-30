import { notFound } from "next/navigation";
import { projects } from "../../../../public/uiux/projects/data";

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const meta = projects[params.slug];
  if (!meta) return notFound();
  return (
    <main className="font-sans bg-neutral-950 text-neutral-100 min-h-screen">
      <article className="mx-auto max-w-4xl px-4 md:px-6 py-10">
        <header>
          <p className="text-sm text-neutral-400">Case Study</p>
          <h1 className="mt-1 text-3xl md:text-4xl font-semibold text-white">{meta.title}</h1>
          <p className="mt-2 text-sm text-neutral-300">Role: {meta.role} · Tools: {meta.tools.join(", ")}</p>
        </header>

        {meta.banner && (
          <div className="mt-6 w-full h-48 md:h-64 rounded-md overflow-hidden">
            <img src={meta.banner} alt={meta.title} className="w-full h-full object-cover" />
          </div>
        )}

        <section className="mt-6">
          <p className="mt-2 text-neutral-300 whitespace-pre-line leading-relaxed">{meta.description || meta.summary}</p>
        </section>

        {meta.typography && (
          <section className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/30 p-5 md:p-6">

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Typography Column */}
              <div>
                <h3 className="text-sm uppercase tracking-wider text-neutral-500 font-medium mb-4">Typography</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Font Family</p>
                    <p className="text-lg text-white font-medium">{meta.typography.fontFamily}</p>
                  </div>

                  <div className="space-y-3 border-l-2 border-neutral-800 pl-4">
                    {meta.typography.samples.map((s, idx) => (
                      <div key={idx} className="group">
                        <div
                          style={{ 
                            fontFamily: s.fontFamily || meta.typography!.fontFamily, 
                            fontWeight: s.weight,
                            ...(s.className ? {} : { fontSize: s.size })
                          }}
                          className={`${s.className ?? ""} text-white transition-opacity group-hover:opacity-80`}
                        >
                          {s.label}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-xs text-neutral-500 font-mono">{s.size}</span>
                           <span className="text-xs text-neutral-600">•</span>
                           <span className="text-xs text-neutral-500">{s.example}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colors Column */}
              <div>
                <h3 className="text-sm uppercase tracking-wider text-neutral-500 font-medium mb-4">Color Palette</h3>
                <div className="flex flex-wrap gap-3">
                  {meta.colors && meta.colors.length > 0 ? (
                    meta.colors.map((c, i) => {
                      const color = typeof c === "string" ? c : c.color;
                      const name = typeof c === "string" ? c : c.name || c.color;
                      
                      return (
                        <div key={i} className="group relative flex flex-col items-center">
                          <div 
                            style={{ backgroundColor: color }} 
                            className="h-10 w-10 rounded-full border border-neutral-800 shadow-sm transition-transform group-hover:scale-110 cursor-help"
                          />
                          <div className="mt-2 text-center opacity-60 group-hover:opacity-100 transition-opacity">
                            <p className="text-[10px] font-medium text-neutral-300 max-w-[60px] truncate">{name}</p>
                            <p className="text-[9px] font-mono text-neutral-500 uppercase">{color}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-neutral-500 text-sm">No colors provided.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {meta.workflow && (
          <section className="mt-10">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">{meta.workflow.title}</h2>
              <p className="text-neutral-400 mt-1">{meta.workflow.summary}</p>
            </div>

            {/* Horizontal Scroll Container for Workflow Steps */}
            <div className="relative px-4 md:-mx-0 md:px-0 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
              <div className="flex gap-4 min-w-max">
                {meta.workflow.steps.map((step, idx) => (
                  <div key={idx} className="snap-center w-[202px] md:w-[200px] flex-shrink-0 flex flex-col gap-3">
                    <div className=" w-full rounded-lg border border-neutral-800 bg-neutral-900 overflow-hidden shadow-lg">
                      <img 
                        src={step.image} 
                        alt={step.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{step.title}</h4>
                      <p className="text-neutral-400 text-xs mt-1 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {meta.workflow.reasoning && (
              <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
                <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {meta.workflow.reasoning.title}
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {meta.workflow.reasoning.content}
                </p>
              </div>
            )}
          </section>
        )}

        {meta.branding && (
          <section className="mt-10">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">{meta.branding.title}</h2>
              <p className="text-neutral-400 mt-1">{meta.branding.summary}</p>
            </div>

            {/* Images Row */}
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              {/* Mascot (Square) */}
              {meta.branding.mascot && (
                <div className="w-full md:w-1/3 flex flex-col rounded-md border border-neutral-800 bg-neutral-900 shadow-sm overflow-hidden shrink-0">
                  <div className="aspect-square bg-neutral-950 relative flex items-center justify-center">
                     <img src={meta.branding.mascot.image} alt={meta.branding.mascot.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="px-3 py-2 border-t border-neutral-800 bg-neutral-900">
                    <p className="text-sm text-neutral-300 font-medium">{meta.branding.mascot.name}</p>
                  </div>
                </div>
              )}

              {/* Animation (Banner) */}
              {meta.branding.animation && (
                <div className="w-full md:w-2/3 flex flex-col rounded-md border border-neutral-800 bg-neutral-900 shadow-sm overflow-hidden">
                  <div className="flex-1 bg-neutral-950 relative min-h-[240px] md:min-h-0">
                     <img src={meta.branding.animation.image} alt={meta.branding.animation.title} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="px-3 py-2 border-t border-neutral-800 bg-neutral-900">
                    <p className="text-sm text-neutral-300 font-medium">{meta.branding.animation.title}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description & Why */}
            {(meta.branding.description || meta.branding.why) && (
                <div className="mt-8 flex flex-col gap-6">
                    <div>
                        <h3 className="text-lg font-medium text-white mb-2">Concept</h3>
                        <p className="text-neutral-300 leading-relaxed">{meta.branding.description}</p>
                    </div>
                    {meta.branding.why && (
                      <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
                        <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Why it works
                        </h4>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                          {meta.branding.why}
                        </p>
                      </div>
                    )}
                </div>
            )}

            {/* Landing Page Design Section */}
            {meta.branding.landingPage && (
                <div className="mt-10 pt-8 border-t border-neutral-800">
                    <h3 className="text-xl font-semibold text-white mb-3">{meta.branding.landingPage.title}</h3>
                    <p className="text-neutral-300 leading-relaxed max-w-2xl mb-6">{meta.branding.landingPage.content}</p>
                    {meta.branding.landingPage.image && (
                      <div className="rounded-md border border-neutral-800 bg-neutral-900 overflow-hidden">
                        <img 
                          src={meta.branding.landingPage.image} 
                          alt={meta.branding.landingPage.title} 
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                </div>
            )}
          </section>
        )}

        {meta.sections?.map((section, index) => (
          <section key={index} className="mt-6">
            <h3 className="text-lg font-semibold text-white">{section.title}</h3>
            <p className="mt-2 text-neutral-300 whitespace-pre-line">{section.content}</p>
            {section.items && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item, i) => (
                  <div key={i} className="p-4 rounded-md bg-neutral-900 border border-neutral-800">
                    {item.title && <h4 className="font-medium text-white mb-1">{item.title}</h4>}
                    <p className="text-sm text-neutral-400">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        <section className="mt-6">
          <div className="mt-3 grid grid-cols-4 md:grid-cols-4 gap-4">
            {meta.images && meta.images.length > 0 ? (
              meta.images.map((img, i) => (
                <div key={i} className="rounded-md bg-neutral-800 overflow-hidden border border-neutral-800">
                  <img src={img} alt={`${meta.title} screenshot ${i + 1}`} className="w-full h-auto object-cover" />
                </div>
              ))
            ) : ( <></>
            )}
          </div>
        </section>

      </article>
    </main>
  );
}
