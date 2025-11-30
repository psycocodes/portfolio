export const zeedchain = {
  title: "Zeedchain - Equity Funding Platform",
  role: "Interaction Design · UI/UX · Frontend Development",
  timeframe: "2025",
  tools: ["Figma", "Next.js"],
  summary: "Trust through clarity; fewer surprises in key flows.",
  description: "ZeedChain is a platform built to enable transparent, student-driven equity funding. The brand identity focuses on three pillars: clarity, trust, and futuristic minimalism. The entire system is designed to feel stable, modern, and opportunity-focused, reflecting the value ZeedChain brings to young founders.",
  tags: ["UI/UX", "Interaction Design"],
  banner: "/uiux/projects/zeedchain/banner.png",
 
  typography: {
    fontFamily: "Inter",
    samples: [
      { label: "Inter Bold", size: "32px", weight: 700, example: "Future of Equity", fontFamily: "var(--font-inter)" },
      { label: "Inter Medium", size: "18px", weight: 500, example: "Student Founders", fontFamily: "var(--font-inter)" },
      { label: "Inter Regular", size: "14px", weight: 400, example: "Transparent funding for the next generation.", fontFamily: "var(--font-inter)" },
      { label: "Inter Light", size: "12px", weight: 300, example: "Legal • Terms", fontFamily: "var(--font-inter)" },
    ]
  },
  colors: [
    { name: "Primary Green", color: "#00D664" },
    { name: "Deep Charcoal", color: "#111111" },
    { name: "Neon Purple", color: "#B026FF" },
    { name: "Dark Surface", color: "#0A0A0A" },
  ],
  branding: {
    title: "Brand Identity",
    summary: "A visual system built on clarity, trust, and futuristic minimalism.",
    mascot: {
      name: "Seed Symbol",
      description: "A geometric fusion of a coin and a leaf. The outer circle represents financial stability — a coin — while the inner shapes form a sprouting leaf, symbolizing the organic growth of early-stage startups.",
      image: "/uiux/projects/zeedchain/logo.png"
    },
    animation: {
      title: "Loading State",
      description: "A seed-like icon animates on a deep black background. Symbolizes the earliest stage of a startup — the 'seed' of an idea.",
      image: "/uiux/projects/zeedchain/zeedchain-loading.gif"
    },
    description: "The brand identity focuses on three pillars: clarity, trust, and futuristic minimalism. The entire system is designed to feel stable, modern, and opportunity-focused, reflecting the value ZeedChain brings to young founders.",
    why: "ZeedChain deals with finance and young founders — the brand needs to appear calm, neutral, and grounded, rather than flashy."
  },
  workflow: {
    title: "UI/UX & Implementation",
    summary: "Key screens designed to guide users from discovery to understanding. The visual language is anchored by a stylized black hole in the hero section — representing the massive gravitational pull of opportunity, with an accretion ring visualizing decentralized value.",
    steps: [
      {
        title: "Executive Summary",
        description: "A clean, document-like layout. Dark background = technical, authoritative tone.",
        image: "/uiux/projects/zeedchain/ui-1.png"
      },
      {
        title: "Hero Section",
        description: "A stylized black hole visual representing massive potential and depth.",
        image: "/uiux/projects/zeedchain/ui-2.png"
      },
      {
        title: "Key Features",
        description: "Card grid layout reduces cognitive load. Icons make scanning fast.",
        image: "/uiux/projects/zeedchain/ui-3.png"
      },
      {
        title: "How It Works",
        description: "Step-by-step card breakdown helps users understand the full process in one glance.",
        image: "/uiux/projects/zeedchain/ui-4.png"
      }
    ],
    reasoning: {
      title: "Trust Through Clarity",
      content: "In financial and educational tools, clarity beats personality. The interface uses Inter for precision without visual noise, ensuring that the complex topic of equity funding remains accessible."
    }
  }
};
