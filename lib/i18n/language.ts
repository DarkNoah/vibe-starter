export const languages = ["en", "zh"] as const;
export type Language = (typeof languages)[number];
