export const acadz = {
  title: "AcadZ — Learning Platform",
  role: "Product Design · UI/UX · React Native Development",
  timeframe: "2025",
  tools: ["Figma", "React Native", "Photoshop"],
  summary: "Landing revamp and focused course discovery.",
  description: "AcadZ is a simple student-productivity tool designed to help learners organize class material, revise faster, and access study tools in one place. It focuses on clarity, easy actions, and practical workflows rather than heavy features.",
  tags: ["UI/UX", "Product Design"],
  banner: "/uiux/projects/acadz/acadz-banner.png",
  typography: {
    fontFamily: "Inter",
    samples: [
      { label: "Inter Regular", size: "2.25rem", weight: 700, className: "text-3xl md:text-4xl", example: "Leading product experiences" },
      { label: "Inter SemiBold", size: "1.875rem", weight: 600, className: "text-2xl md:text-3xl", example: "Design decisions & outcomes" },
      { label: "Inter Regular", size: "1rem", weight: 400, className: "text-base", example: "The quick brown fox jumps over the lazy dog." },
      { label: "Inter Regular", size: "0.875rem", weight: 400, className: "text-sm", example: "Helper text / captions" },
    ],
  },
  colors: [
    { name: "Primary Violet", color: "#7C3AED" },
    { name: "Soft Purple", color: "#A78BFA" },
    { name: "Dark Surface", color: "#1F2937" },
    { name: "Light Text", color: "#F3F4F6" },
  ],
  workflow: {
    title: "Sample UI/UX Workflow",
    summary: "Transcribing a Class — 4-Screen Flow",
    steps: [
      { 
        title: "Screen 1: Active Transcription", 
        description: "The blob moves with the recording activity. A label above the blob shows the current word being recorded. Below the blob a transcript note appears and updates in real time.", 
        image: "/uiux/projects/acadz/ux-1.png" 
      },
      { 
        title: "Screen 2: Inactive Transcription", 
        description: "Same layout as the active screen but the blob is grey because nothing is being recorded. No voice profile is selected and there is no live transcript.", 
        image: "/uiux/projects/acadz/ux-2.png" 
      },
      { 
        title: "Screen 3: Changing Voice Profiles", 
        description: "Shows a list of voice profiles. Tap a profile to switch the voice used for transcription.", 
        image: "/uiux/projects/acadz/ux-3.png" 
      },
      { 
        title: "Screen 4: Modifying Voice Profiles", 
        description: "Edit or delete existing voice profiles. Changes take effect immediately and can be saved or discarded.", 
        image: "/uiux/projects/acadz/ux-4.png" 
      }
    ],
    reasoning: {
      title: "Why This Workflow",
      content: "The flow covers the common tasks users perform with recordings: start and monitor a live transcription, see when recording is idle, switch the voice used for transcription, and manage voice profiles. Each screen gives clear feedback and simple controls so users understand what is happening and can act quickly."
    }
  },
  images: [
    "/uiux/projects/acadz/ui-1.png",
    "/uiux/projects/acadz/ui-2.png",
    "/uiux/projects/acadz/ui-3.png",
    "/uiux/projects/acadz/ui-4.png",

  ],
  sections: [
    {
      title: "Implemented UI Screens",
      content: "Some core screens have been designed and coded in React Native. The focus was on keeping the UI look minimal yet functional for a prototype."
    }
  ]
};
