export type PosterItem = {
	slug: string;
	title: string;
	tool: string;
	image: string;
};

export const posters: PosterItem[] = [
	{
		slug: "diwali-gdg-hitk",
		title: "Diwali GDG HITK",
		tool: "Photoshop",
		image: "/uiux/visuals/posters/diwali-gdg-hitk.png",
	},
	{
		slug: "infinite-storm",
		title: "Infinite Storm",
		tool: "Photoshop",
		image: "/uiux/visuals/posters/infinite-storm.png",
	},
		{
		slug: "photography-workshop",
		title: "Workshop Poster - IITM",
		tool: "Photoshop",
		image: "/uiux/visuals/posters/poster-iris.png",
	},
    {
		slug: "arcade-meetup-iitm",
		title: "Arcade Meetup IITM",
		tool: "Illustrator",
		image: "/uiux/visuals/posters/arcade-meetup-iitm.png",
	},
    	{
		slug: "workshop-iitm",
		title: "Technical Poster - Workshop IITM",
		tool: "Illustrator",
		image: "/uiux/visuals/posters/workshop-iitm.png",
	},


];

export type BannerItem = {
	slug: string;
	title: string;
	image: string;
};

export const banners: BannerItem[] = [
	{
		slug: "acadz-banner",
		title: "AcadZ Banner",
		image: "/uiux/visuals/banners/acadz.png",
	},
	{
		slug: "acady-banner",
		title: "Acady Banner",
		image: "/uiux/visuals/banners/acady.png",
	},
	{
		slug: "hacktivate-banner",
		title: "Hacktivate Banner",
		image: "/uiux/visuals/banners/hacktivate.png",
	},
];
