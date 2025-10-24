export const Palettes = {
  default: [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-lime-500",
    "bg-emerald-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-fuchsia-500",
    "bg-pink-500",
  ],
  synthwave: [
    "bg-pink-500", // oklch(71% 0.202 349.761) - pink/rose
    "bg-red-900", // oklch(28% 0.109 3.907) - dark red
    "bg-blue-300", // oklch(82% 0.111 230.318) - light blue
    "bg-blue-900", // oklch(29% 0.066 243.157) - dark blue
    "bg-yellow-400", // oklch(75% 0.183 55.934) - yellow
    "bg-orange-900", // oklch(26% 0.079 36.259) - dark orange
    "bg-purple-600", // oklch(45% 0.24 277.023) - purple
    "bg-blue-400", // oklch(74% 0.16 232.661) - light blue
    "bg-cyan-400", // oklch(77% 0.152 181.912) - cyan
    "bg-lime-300", // oklch(90% 0.182 98.111) - lime
    "bg-orange-400", // oklch(73.7% 0.121 32.639) - orange
  ],
  acid: [
    "bg-pink-500", // oklch(71.9% 0.357 330.759) - pink/magenta
    "bg-pink-950", // oklch(14.38% 0.071 330.759) - dark pink
    "bg-amber-400", // oklch(73.37% 0.224 48.25) - amber/yellow
    "bg-amber-950", // oklch(14.674% 0.044 48.25) - dark amber
    "bg-green-200", // oklch(92.78% 0.264 122.962) - light green
    "bg-green-950", // oklch(18.556% 0.052 122.962) - dark green
    "bg-purple-900", // oklch(21.31% 0.128 278.68) - dark purple
    "bg-purple-500", // oklch(60.72% 0.227 252.05) - purple
    "bg-cyan-300", // oklch(85.72% 0.266 158.53) - light cyan
    "bg-lime-200", // oklch(91.01% 0.212 100.5) - light lime
    "bg-orange-500", // oklch(64.84% 0.293 29.349) - orange
  ],
  cyberpunk: [
    "bg-red-400", // oklch(74.22% 0.209 6.35) - red/pink
    "bg-red-950", // oklch(14.844% 0.041 6.35) - dark red
    "bg-blue-300", // oklch(83.33% 0.184 204.72) - light blue
    "bg-blue-950", // oklch(16.666% 0.036 204.72) - dark blue
    "bg-fuchsia-500", // oklch(71.86% 0.217 310.43) - fuchsia/magenta
    "bg-purple-900", // oklch(23.04% 0.065 269.31) - dark purple
    "bg-lime-200", // oklch(94.51% 0.179 104.32) - light lime
    "bg-blue-400", // oklch(72.06% 0.191 231.6) - blue
    "bg-cyan-500", // oklch(64.8% 0.15 160) - cyan
    "bg-lime-300", // oklch(84.71% 0.199 83.87) - lime
    "bg-orange-400", // oklch(71.76% 0.221 22.18) - orange
  ],
};

export type PaletteName = keyof typeof Palettes;
