"use client";
import { SectionHeader } from "@/components/uiux/section-header";
import Link from "next/link";
import { projects } from "../../public/uiux/projects/data";
import { logos } from "../../public/uiux/logos/data";
import { posters, banners } from "../../public/uiux/visuals/data";
import { blender } from "../../public/uiux/3d/data";
import { photos } from "../../public/uiux/photography/data";

import { HorizontalScroller, Card } from "@/components/uiux/horizontalscroller";

export default function UIUX() {
	return (
		<main className="font-sans text-neutral-100 bg-neutral-950 relative">
            <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center pointer-events-none">
                 <Link href="/" className="pointer-events-auto text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2 bg-neutral-950/50 backdrop-blur-sm px-4 py-2 rounded-full border border-neutral-800/50">
                    <span>←</span> Back to Home
                 </Link>
            </nav>

            {/* Hero Section */}
			<section className="mx-auto max-w-[95vw] px-4 md:px-6 pt-32 pb-20 md:pt-40 md:pb-40" data-reveal>
				<h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-[1.1] mb-8">
					Designing <span className="text-neutral-600">clarity</span> <br />
                    into <span className="text-neutral-600">complexity.</span>
				</h1>
				<div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
					<p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-2xl">
						I'm Mohikshit Ghorai. I am here to enrich your technical products with user friendly and aesthetic experiences.
					</p>
					<div className="flex gap-4 flex-wrap">
						<a 
							href="mailto:gmohikshit@gmail.com" 
							className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-neutral-950 bg-white rounded-full hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95"
						>
							Get in Touch
						</a>
                        <a 
							href="https://bit.ly/mohikshitghorai-resume-uiux" 
							className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-white border border-neutral-800 rounded-full hover:bg-neutral-900 transition-all hover:border-neutral-600"
						>
							View Resume
						</a>
					</div>
				</div>
			</section>

			{/* UI/UX Case Studies */}
			<section className="mx-auto max-w-6xl px-4 md:px-6 py-10" data-reveal id="work">
				<SectionHeader
					title="UI/UX Case Studies"
					subtitle="Concise previews. Clear structure. Meaningful outcomes."
				/>
				<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
					{Object.entries(projects).map(([slug, meta]) => (
						<Link
							key={slug}
							href={`/uiux/projects/${slug}`}
							className="group rounded-md border border-neutral-800 bg-neutral-900 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
						>
                            
							<div className="h-44 md:h-48 rounded-sm bg-neutral-800 overflow-hidden -mx-4 -mt-4 md:m-0">
								{(meta.banner || (meta.images && meta.images[0])) && (
									<img
										src={meta.banner || meta.images?.[0]}
										alt={meta.title}
										className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition duration-500 group-hover:scale-105"
									/>
								)}
							</div>
							<h3 className="mt-3 text-lg font-medium text-white group-hover:text-neutral-100 transition">
								{meta.title}
							</h3>
							<p className="mt-2 text-sm text-neutral-300">{meta.summary}</p>
							<div className="mt-4 flex items-center text-sm text-neutral-200 font-medium">
                                <span className="underline-anim">View Case Study</span>
                                <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                            </div>
						</Link>
					))}
				</div>
			</section>

			{/* Logo Design */}
			<section
				className="mx-auto max-w-6xl px-4 md:px-6 py-10 border-t border-neutral-800"
				data-reveal
			>
				<SectionHeader
					title="Logo Design"
					subtitle="Identity marks and systems. Hover to reveal stucture"
				/>

				<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
					{logos.map((l) => (
						<Link
							key={l.slug}
							href={`/uiux/logos/${l.slug}`}
							className="group rounded-md border border-neutral-800 bg-neutral-900 p-6 hover:border-neutral-700 transition flex items-center gap-6 relative overflow-hidden"
						>
							<div className="h-20 w-20 rounded-full bg-neutral-800 overflow-hidden flex-shrink-0 p-2 border border-neutral-800 group-hover:border-neutral-600 transition relative">
								{l.logo && (
                                    <>
									<img
										src={l.logo}
										alt={l.title}
										className="h-full w-full object-contain absolute inset-0 p-2 transition-opacity duration-500 group-hover:opacity-0"
									/>
                                    <img
                                        src={`/uiux/logos/${l.slug}/dotted.png`}
                                        alt={`${l.title} Structure`}
                                        className="h-full w-full object-contain absolute inset-0 p-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    />
                                    </>
								)}
							</div>
							<div>
								<h3 className="text-lg font-medium text-white group-hover:text-neutral-200 transition">{l.title}</h3>
								<p className="mt-1 text-sm text-neutral-400 leading-relaxed">{l.summary}</p>

							</div>
						</Link>
					))}
				</div>
			</section>
			<section
				className="mx-auto max-w-6xl px-4 md:px-6 py-10 border-t border-neutral-800"
				data-reveal
			>
				<SectionHeader
					title="Blender Projects"
					subtitle="Loops and scenes with a calm aesthetic."
				/>

				<HorizontalScroller>
					{blender.map((item) => (
						<Card key={item.slug} image={item.image} title={item.title} type="blender"/>
					))}
				</HorizontalScroller>
			</section>
			<section
				className="mx-auto max-w-6xl px-4 md:px-6 py-10 border-t border-neutral-800"
				data-reveal
			>
				<SectionHeader
					title="Posters & Visual Elements"
					subtitle="Masonry-inspired rhythm in a horizontal scroll."
				/>

				<HorizontalScroller>
					{posters.map((p) => (
						<Card
							key={p.slug}
							image={p.image}
							title={p.title}
							subtitle={p.tool}
                            type="poster"
						/>
					))}
				</HorizontalScroller>
			</section>

			<section
				className="mx-auto max-w-6xl px-4 md:px-6 py-10 border-t border-neutral-800"
				data-reveal
			>
				<SectionHeader
					title="Banners"
					subtitle="Wide format visuals and promotional graphics."
				/>

				<HorizontalScroller>
					{banners.map((b) => (
						<Card
							key={b.slug}
							image={b.image}
							title={b.title}
							type="banner"
						/>
					))}
				</HorizontalScroller>
			</section>

			<section
				className="mx-auto max-w-6xl px-4 md:px-6 py-10 border-t border-neutral-800"
				data-reveal
			>
				<SectionHeader
					title="Photography"
					subtitle="Calm gallery with thin frames and minimal captions."
				/>

				<HorizontalScroller>
					{photos.map((p) => (
						<Card key={p.slug} image={p.image} title={p.caption} type="photos" />
					))}
				</HorizontalScroller>
			</section>
		</main>
	);
}
