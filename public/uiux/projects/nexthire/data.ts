export const nexthire = {
  title: "Nexthire — Resume Builder",
  role: "UI/UX · FullStack",
  timeframe: "2025",
  tools: ["Figma", "MERN"],
  banner: "/uiux/projects/nexthire/banner.png",
  summary: "Pipeline clarity and candidate flow improvements.",
  description: "Nexthire is a clean, modern resume-builder app created by me and my teammate, Arko Roy, as part of the Softius Resume Builder Challenge. It is designed to help students and early-career applicants generate polished CVs with zero friction. The platform uses a technical, grid-based dark theme with neon accents to create a “developer-friendly” hiring identity.",
  tags: ["UI/UX", "Product Design"],


  typography: {
    fontFamily: "CalebMono / Inter",
    samples: [
      { label: "CalebMono Bold", size: "32px", weight: 700, example: "Get Hired Today", fontFamily: "CSCalebMono" },
      { label: "Inter SemiBold", size: "18px", weight: 600, example: "Personal Details", fontFamily: "var(--font-inter)" },
      { label: "Inter Regular", size: "14px", weight: 400, example: "Build your professional resume in minutes.", fontFamily: "var(--font-inter)" },
      { label: "Inter Medium", size: "12px", weight: 500, example: "SKILLS • EXPERIENCE", fontFamily: "var(--font-inter)" },
    ]
  },
  colors: [
    { name: "Jet Black", color: "#0C0C0C" },
    { name: "Neon Green", color: "#9FFF3E" },
    { name: "Cool Gray", color: "#8A94A6" },
    { name: "Soft Blue", color: "#E1E8FF" },
  ],
  workflow: {
    title: "UI/UX & Implementation",
    summary: "A friction-free flow designed to take users from entry to download with minimal cognitive load.",
    steps: [
      {
        title: "Landing Page",
        description: "Hero line: 'Get hired today with Nexthire.' Neon-highlighted icons guide the user visually. Grid background reinforces the tech feel.",
        image: "/uiux/projects/nexthire/ui-1.png"
      },
      {
        title: "User Details Form",
        description: "Single-card UI to reduce cognitive load. Bright green CTA button for immediate clarity. Input groups arranged vertically for fast scanning.",
        image: "/uiux/projects/nexthire/ui-2.png"
      },
      {
        title: "Resume Preview + Builder",
        description: "Side-by-side preview and editor layout. Left side: Form fields. Right side: Live generated resume. Feels like a developer IDE.",
        image: "/uiux/projects/nexthire/ui-3.png"
      },
      {
        title: "Final Profile / Dashboard",
        description: "Displays stored resumes and saved user data. Card-based layout for experiences, languages, skills. High-contrast layout ensures readability.",
        image: "/uiux/projects/nexthire/ui-4.png"
      }
    ],
    reasoning: {
      title: "Developer-Centric UX",
      content: "The split-screen builder mimics an IDE, making it intuitive for developers. The dark mode reduces eye strain during long editing sessions, while the neon accents provide clear calls to action."
    }
  },

};
