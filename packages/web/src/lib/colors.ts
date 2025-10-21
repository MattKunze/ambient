/**
 * Tailwind color class to RGB conversion
 * Uses Tailwind's actual color values instead of hardcoding
 */

import colors from "tailwindcss/colors";

type RGB = [number, number, number];

/**
 * Parse hex color to RGB tuple
 */
function hexToRGB(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return [
    Number.parseInt(result[1] || "0", 16),
    Number.parseInt(result[2] || "0", 16),
    Number.parseInt(result[3] || "0", 16),
  ];
}

/**
 * Parse OKLCH color to RGB tuple
 * OKLCH format: oklch(L% C H) where L is lightness, C is chroma, H is hue
 */
function oklchToRGB(oklch: string): RGB {
  const match = oklch.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) {
    throw new Error(`Invalid OKLCH color: ${oklch}`);
  }

  const L = Number.parseFloat(match[1] || "0") / 100; // Lightness 0-1
  const C = Number.parseFloat(match[2] || "0"); // Chroma
  const H = Number.parseFloat(match[3] || "0"); // Hue in degrees

  // Convert OKLCH to OKLab
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // Convert OKLab to linear RGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_ = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  // Convert linear RGB to sRGB with gamma correction
  const toSRGB = (c: number): number => {
    c = Math.max(0, Math.min(1, c)); // Clamp to [0, 1]
    return c <= 0.0031308
      ? 12.92 * c
      : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };

  return [
    Math.round(toSRGB(r) * 255),
    Math.round(toSRGB(g) * 255),
    Math.round(toSRGB(b_) * 255),
  ];
}

/**
 * Parse color string (hex or OKLCH) to RGB
 */
function parseColor(color: string): RGB {
  if (color.startsWith("#")) {
    return hexToRGB(color);
  }
  if (color.startsWith("oklch")) {
    return oklchToRGB(color);
  }
  throw new Error(`Unsupported color format: ${color}`);
}

/**
 * Convert a Tailwind color class to RGB tuple
 * Returns null for bg-base-300 (transparent/empty cells)
 */
export function tailwindToRGB(colorClass: string): RGB | null {
  // Treat bg-base-300 as transparent/empty
  if (colorClass === "bg-base-300") {
    return null;
  }

  // Parse color class: "bg-{color}-{shade}"
  const match = colorClass.match(/^bg-(\w+)-(\d+)$/);
  if (!match) {
    throw new Error(`Invalid color class format: ${colorClass}`);
  }

  const [, colorName, shade] = match;
  if (!colorName || !shade) {
    throw new Error(`Could not parse color class: ${colorClass}`);
  }

  // Get color from Tailwind's color palette
  const colorPalette = colors[colorName as keyof typeof colors];
  if (!colorPalette || typeof colorPalette !== "object") {
    throw new Error(`Unknown color: ${colorName}`);
  }

  const colorValue = colorPalette[shade as keyof typeof colorPalette];
  if (!colorValue || typeof colorValue !== "string") {
    throw new Error(`Unknown shade ${shade} for color ${colorName}`);
  }

  return parseColor(colorValue);
}
