export const GITHUB_URL = "https://github.com/Emreceyhnn/Documind";

export const SECTION_IDS = {
  howItWorks: "how-it-works",
  features: "features",
  faq: "faq",
} as const;

export const MAIN_CONTENT_ID = "main-content";

/** Shared page container. Plain object so it can be used from server components. */
export const containerSx = {
  width: "100%",
  maxWidth: 1160,
  mx: "auto",
  px: { xs: 2.5, sm: 4 },
} as const;

/** Vertical rhythm between landing sections. */
export const sectionSx = {
  py: { xs: 9, md: 13 },
  scrollMarginTop: "72px",
} as const;

/** Primary-tinted surface used for icon tiles and highlights. */
export const primaryTint = (alpha: number) =>
  `rgba(var(--mui-palette-primary-mainChannel) / ${alpha})`;
