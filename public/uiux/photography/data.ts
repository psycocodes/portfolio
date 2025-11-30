export type PhotoItem = {
  slug: string;
  title: string;
  image: string; // relative to /public
  caption: string;
  aspect?: "square" | "portrait" | "landscape";
};

export const photos: PhotoItem[] = [
      {
    slug: "flower",
    title: "Flower",
    image: "/uiux/photography/flower.png",
    caption: "Bloom in Silence",
    aspect: "portrait",
  },
    {
    slug: "stairs",
    title: "Stairs",
    image: "/uiux/photography/stairs.png",
    caption: "The Unknown",
    aspect: "portrait",
  },
    {
    slug: "finalcardaib",
    title: "The Final Card",
    image: "/uiux/photography/finalcardaib.png",
    caption: "The Final Card - AIB",
    aspect: "square",
  },
    {
    slug: "pillars",
    title: "Pillars",
    image: "/uiux/photography/pillars.png",
    caption: "Ancient Pillars",
    aspect: "portrait",
  },
  {
    slug: "deathnote",
    title: "Deathnote",
    image: "/uiux/photography/deathnote.png",
    caption: "DeathNote Scene",
    aspect: "portrait",
  },

  {
    slug: "house",
    title: "Broken House",
    image: "/uiux/photography/house.png",
    caption: "Doll House",
    aspect: "landscape",
  },



];
