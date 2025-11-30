import { calcione } from "./calcione/data";
import { zeedchainBranding, zeedchainLogo } from "./zeedchain/data";

export type BrandingItem = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  logo?: string;
  images?: string[];
  colors?: string[];
  sections?: {
    title: string;
    content: string;
    items?: { title?: string; description: string; image?: string; images?: string[] }[];
    image?: string;
    imageCaption?: string;
    references?: string[];
  }[];
};

export const branding: BrandingItem[] = [
  zeedchainBranding,
];

export const logos: BrandingItem[] = [
  calcione,
  zeedchainLogo,
];

export const redesigns: BrandingItem[] = [
  { slug: "id-reiterations", title: "ID Reiterations", summary: "Iterative refinements on identity assets.", tags: ["ReDesign"] },
];
