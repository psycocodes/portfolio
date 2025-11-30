import { acadz } from "./acadz/data";
import { nexthire } from "./nexthire/data";
import { zeedchain } from "./zeedchain/data";
import { innofund } from "./innofund/data";

export type CaseStudyMeta = {
  title: string;
  role: string;
  timeframe: string;
  tools: string[];
  summary: string;
  description?: string;
  tags: string[];
  banner?: string;
  logo?: string;
  images?: string[];
  typography?: {
    fontFamily: string;
    samples: { label: string; size: string; weight: number; className?: string; example: string; fontFamily?: string }[];
  };
  colors?: (string | { name: string; color: string })[];
  workflow?: {
    title: string;
    summary: string;
    steps: {
      title: string;
      description: string;
      image: string;
    }[];
    reasoning?: {
      title: string;
      content: string;
    };
  };
  branding?: {
    title: string;
    summary: string;
    mascot?: {
      name: string;
      description: string;
      image: string;
    };
    animation?: {
      title: string;
      description: string;
      image: string; // Using image for GIF/Static
    };
    description?: string;
    why?: string;
    landingPage?: {
      title: string;
      content: string;
      image?: string;
    };
  };
  sections?: {
    title: string;
    content: string;
    items?: { title?: string; description: string }[];
  }[];
};

export const projects: Record<string, CaseStudyMeta> = {
  acadz,
  nexthire,
  zeedchain,
  innofund,
};
