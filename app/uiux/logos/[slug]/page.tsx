import { notFound } from "next/navigation";
import { logos, redesigns } from "../../../../public/uiux/logos/data";

const highlightText = (text: string) => {
  if (!text) return "";
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <span key={index} className="text-white font-medium">{part.slice(2, -2)}</span>;
    }
    return part;
  });
};

function getItem(slug: string) {
  const logo = logos.find((l) => l.slug === slug);
  if (logo) return { ...logo, kind: "logo" as const };
  const r = redesigns.find((l) => l.slug === slug);
  if (r) return { ...r, kind: "redesign" as const };
  return null;
}

export default function LogoDetail({ params }: { params: { slug: string } }) {
  const item = getItem(params.slug);
  if (!item) return notFound();

  return (
    <main className="font-sans bg-neutral-950 text-neutral-100 min-h-screen">
      <article className="mx-auto max-w-4xl px-4 md:px-6 py-10">
        <header>
          <p className="text-sm text-neutral-400">{item.kind === "logo" ? "Logo" : "ReDesign"}</p>
          <h1 className="mt-1 text-3xl md:text-4xl font-semibold text-white">{item.title}</h1>
          {"summary" in item ? (
            <p className="mt-2 text-sm text-neutral-300">{(item as any).summary}</p>
          ) : null}
        </header>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white">Primary Mark</h2>
          <div className="mt-3 w-full h-80 rounded-md bg-neutral-900 flex items-center justify-center p-10 border border-neutral-800 relative overflow-hidden">
             {/* Grid background effect */}
             <div className="absolute inset-0 opacity-10" 
                  style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
             </div>
             {item.logo && <img src={item.logo} alt="Main Logo" className="h-full w-auto object-contain relative z-10 drop-shadow-2xl" />}
          </div>
        </section>

        {item.sections?.map((section, index) => {
          const hasVisuals = section.image || (section.references && section.references.length > 0);
          return (
          <section key={index} className="mt-10">
            <div className={`grid grid-cols-1 ${hasVisuals ? 'md:grid-cols-2' : ''} gap-8 items-start`}>
              <div>
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                <p className="mt-2 text-neutral-300 whitespace-pre-line leading-relaxed max-w-2xl">{highlightText(section.content)}</p>
                
                {index === 0 && item.colors && (
                  <div className="mt-6 flex gap-3">
                    {item.colors.map((color, cIndex) => (
                      <div key={cIndex} className="group relative">
                        <div 
                          className="w-12 h-12 rounded-full border border-neutral-800 shadow-sm" 
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                          {color}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {section.items && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.items.map((item, i) => (
                      <div key={i} className="p-5 rounded-md bg-neutral-900/50 border border-neutral-800 flex flex-col gap-3">
                        {item.images && item.images.length > 0 ? (
                           <div className="grid grid-cols-3 gap-2 mb-1">
                             {item.images.map((img, imgIdx) => (
                               <div key={imgIdx} className="aspect-square bg-neutral-900 rounded border border-neutral-800/50 flex items-center justify-center p-2">
                                 <img src={img} alt={`${item.title} ${imgIdx + 1}`} className="w-full h-full object-contain opacity-90" />
                               </div>
                             ))}
                           </div>
                        ) : item.image ? (
                          <div className="w-full aspect-video bg-neutral-900 rounded border border-neutral-800/50 flex items-center justify-center p-4 mb-1">
                            <img src={item.image} alt={item.title || "Variation"} className="w-full h-full object-contain opacity-90" />
                          </div>
                        ) : null}
                        <div>
                          {item.title && <h4 className="font-medium text-white mb-1 text-sm">{item.title}</h4>}
                          <p className="text-xs text-neutral-400 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {hasVisuals && (
                <div className="flex flex-col gap-4">
                  {section.image && (
                    <div className="rounded-md bg-neutral-900 border border-neutral-800 p-8 flex flex-col items-center justify-center">
                        <img src={section.image} alt={section.title} className="max-h-64 w-auto object-contain opacity-90" />
                        {section.imageCaption && <p className="mt-4 text-xs text-neutral-500 font-mono uppercase tracking-wider">{section.imageCaption}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )})}

      </article>
    </main>
  );
}
