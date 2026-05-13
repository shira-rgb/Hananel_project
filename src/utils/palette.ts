export type Business = "aesthetic" | "dental";

export interface Palette {
  primary: string;
  accent: string;
  soft: string;
  border: string;
  chip: string;
  deep: string;
  label: string;
  icon: string;
}

export const PALETTE: Record<Business, Palette> = {
  aesthetic: {
    primary: "#7c2d92",
    accent: "#e0b3d8",
    soft: "#fbf6fa",
    border: "#e8d6e3",
    chip: "#ad4e9c",
    deep: "#3d1738",
    label: "קליניקה אסתטית",
    icon: "✨",
  },
  dental: {
    primary: "#0d6e6e",
    accent: "#9ed4d4",
    soft: "#f4faf9",
    border: "#cfe6e3",
    chip: "#127a7a",
    deep: "#0a3838",
    label: "מרפאת שיניים",
    icon: "🦷",
  },
};

export const NEUTRAL_PALETTE: Palette = {
  primary: "#5b4b6e",
  accent: "#cdc2dc",
  soft: "#f6f3fb",
  border: "#e2dcec",
  chip: "#7a6788",
  deep: "#2a2236",
  label: "מערכת ניהול",
  icon: "🏠",
};
