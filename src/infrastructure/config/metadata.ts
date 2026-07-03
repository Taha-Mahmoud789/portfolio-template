import { getAppConfig } from "./env";

export const METADATA = {
  title: "Frontend Multiverse",
  description:
    "An immersive interactive web experience where every world represents a different frontend design philosophy",
  author: "Frontend Multiverse",
  theme: {
    light: "#ffffff",
    dark: "#000000",
  },
} as const;

export function getDocumentTitle(suffix?: string): string {
  const { title } = METADATA;
  if (!suffix) return title;
  return `${suffix} | ${title}`;
}

export function applyDocumentMetadata(): void {
  const config = getAppConfig();
  document.title = config.title;

  const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (meta) meta.content = METADATA.description;

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeColor) themeColor.content = METADATA.theme.dark;
}
