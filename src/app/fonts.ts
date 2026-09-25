import { Archivo, Plus_Jakarta_Sans, JetBrains_Mono, Noto_Sans_Devanagari } from "next/font/google";

// Shared by both root layouts (public site and admin).
export const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const label = JetBrains_Mono({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Nepali pages switch every font variable to this (see globals.css). Only
// referenced on `html[lang="ne"]`, so English pages never download it.
export const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

export const fontClasses = `${display.variable} ${body.variable} ${label.variable} ${devanagari.variable} antialiased`;
