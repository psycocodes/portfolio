// Utility functions for data fetching with fallback mechanisms

export interface ImageData {
  imagePath: string;
  localPath: string;
  fallbackPath: string;
}

export interface GameDevData {
  type: "storytext" | "project" | "levelgap";
  title?: string;
  text?: string;
  width: number;
  height?: number;
  data?: {
    imageData?: ImageData;
    links?: {
      download?: string;
      github?: string;
      itch?: string;
      linkedin?: string;
    };
  };
}

export interface LoadedImageData {
  src: string;
  loaded: boolean;
}

// Primary data source (GitHub repo)
const GITHUB_DATA_URL =
  "https://raw.githubusercontent.com/psycocodes/portfolio-data/main/gamedev/data.json";

// Local fallback data source
const LOCAL_DATA_URL = "/data/gamedev/data.json";

/**
 * Fetches gamedev data with fallback mechanism
 * 1. Try to fetch from GitHub repo
 * 2. If that fails, fetch from local data.json
 */
export async function fetchGameDevData(): Promise<GameDevData[]> {
  try {
    // Try fetching from GitHub first
    console.log("Attempting to fetch data from GitHub...");
    const response = await fetch(GITHUB_DATA_URL);

    if (response.ok) {
      const data = await response.json();
      console.log("Successfully fetched data from GitHub");
      return data;
    } else {
      throw new Error(`GitHub fetch failed with status: ${response.status}`);
    }
  } catch (error) {
    console.warn(
      "Failed to fetch from GitHub, trying local fallback...",
      error
    );

    try {
      // Fallback to local data
      const response = await fetch(LOCAL_DATA_URL);

      if (response.ok) {
        const data = await response.json();
        console.log("Successfully fetched data from local fallback");
        return data;
      } else {
        throw new Error(`Local fetch failed with status: ${response.status}`);
      }
    } catch (localError) {
      console.error(
        "Failed to fetch data from both GitHub and local sources:",
        localError
      );
      throw new Error("Unable to load gamedev data");
    }
  }
}

/**
 * Loads an image with fallback mechanism
 * 1. Try imagePath (GitHub)
 * 2. If that fails, try localPath
 * 3. If that fails, use fallbackPath
 */
export function loadImageWithFallback(imageData: ImageData): Promise<string> {
  return new Promise((resolve) => {
    const { imagePath, localPath, fallbackPath } = imageData;

    // Try primary image path first (GitHub)
    const primaryImg = new Image();
    primaryImg.onload = () => {
      console.log("Successfully loaded image from GitHub:", imagePath);
      resolve(imagePath);
    };

    primaryImg.onerror = () => {
      console.warn(
        "Failed to load from GitHub, trying local path...",
        imagePath
      );

      // Try local path
      const localImg = new Image();
      localImg.onload = () => {
        console.log("Successfully loaded image from local path:", localPath);
        resolve(`/${localPath}`);
      };

      localImg.onerror = () => {
        console.warn(
          "Failed to load from local path, using fallback...",
          localPath
        );
        // Use fallback path
        console.log("Using fallback image:", fallbackPath);
        resolve(`/${fallbackPath}`);
      };

      localImg.src = `/${localPath}`;
    };

    primaryImg.src = imagePath;
  });
}

/**
 * Preloads all images for project items with fallback mechanism
 */
export async function preloadAllImages(
  data: GameDevData[]
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();
  const projectItems = data.filter(
    (item) => item.type === "project" && item.data?.imageData
  );

  console.log(`Preloading ${projectItems.length} images...`);

  const imagePromises = projectItems.map(async (item) => {
    if (item.data?.imageData) {
      try {
        const loadedSrc = await loadImageWithFallback(item.data.imageData);
        imageMap.set(item.title!, loadedSrc);
        return loadedSrc;
      } catch (error) {
        console.error(`Failed to load image for ${item.title}:`, error);
        // Even if individual image fails, use fallback
        const fallbackSrc = `/${item.data.imageData.fallbackPath}`;
        imageMap.set(item.title!, fallbackSrc);
        return fallbackSrc;
      }
    }
  });

  await Promise.all(imagePromises);
  console.log("All images preloaded successfully");

  return imageMap;
}

/**
 * Main function to load all gamedev data and images
 * Returns both data and preloaded image sources
 */
export async function loadGameDevContent(): Promise<{
  data: GameDevData[];
  imageSources: Map<string, string>;
}> {
  try {
    // First fetch the data
    const data = await fetchGameDevData();

    // Then preload all images
    const imageSources = await preloadAllImages(data);

    console.log("All gamedev content loaded successfully");
    return { data, imageSources };
  } catch (error) {
    console.error("Failed to load gamedev content:", error);
    throw error;
  }
}
