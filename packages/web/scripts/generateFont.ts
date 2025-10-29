#!/usr/bin/env bun
/**
 * Script to generate bitmap font data from Bytesized font PNG glyphs
 * https://github.com/balt-dev/bytesized-gf
 */

import { PNG } from "pngjs";

const GITHUB_BASE = "https://raw.githubusercontent.com/balt-dev/bytesized-gf/main/scripts/glyphs";

// ASCII character mappings (char code 32-126)
const ASCII_CHARS: Record<string, string> = {
  " ": "space",
  "!": "exclam",
  '"': "quotedbl",
  "#": "numbersign",
  "$": "dollar",
  "%": "percent",
  "&": "ampersand",
  "'": "quotesingle",
  "(": "parenleft",
  ")": "parenright",
  "*": "asterisk",
  "+": "plus",
  ",": "comma",
  "-": "hyphen",
  ".": "period",
  "/": "slash",
  "0": "zero",
  "1": "one",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five",
  "6": "six",
  "7": "seven",
  "8": "eight",
  "9": "nine",
  ":": "colon",
  ";": "semicolon",
  "<": "less",
  "=": "equal",
  ">": "greater",
  "?": "question",
  "@": "at",
  "A": "A",
  "B": "B",
  "C": "C",
  "D": "D",
  "E": "E",
  "F": "F",
  "G": "G",
  "H": "H",
  "I": "I",
  "J": "J",
  "K": "K",
  "L": "L",
  "M": "M",
  "N": "N",
  "O": "O",
  "P": "P",
  "Q": "Q",
  "R": "R",
  "S": "S",
  "T": "T",
  "U": "U",
  "V": "V",
  "W": "W",
  "X": "X",
  "Y": "Y",
  "Z": "Z",
  "[": "bracketleft",
  "\\": "backslash",
  "]": "bracketright",
  "^": "asciicircum",
  "_": "underscore",
  "`": "grave",
  "a": "a",
  "b": "b",
  "c": "c",
  "d": "d",
  "e": "e",
  "f": "f",
  "g": "g",
  "h": "h",
  "i": "i",
  "j": "j",
  "k": "k",
  "l": "l",
  "m": "m",
  "n": "n",
  "o": "o",
  "p": "p",
  "q": "q",
  "r": "r",
  "s": "s",
  "t": "t",
  "u": "u",
  "v": "v",
  "w": "w",
  "x": "x",
  "y": "y",
  "z": "z",
  "{": "braceleft",
  "|": "bar",
  "}": "braceright",
  "~": "asciitilde",
};

/**
 * Decode PNG and extract pixel data
 * Returns a 2D array of boolean values (true = filled pixel)
 */
function decodePNG(pngBuffer: Buffer): boolean[][] {
  const png = PNG.sync.read(pngBuffer);

  // Convert to 2D boolean array
  const pixels: boolean[][] = [];
  for (let y = 0; y < png.height; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      const r = png.data[idx] || 0;
      const g = png.data[idx + 1] || 0;
      const b = png.data[idx + 2] || 0;
      const a = png.data[idx + 3] || 0;

      // In these PNGs, the font pixels are white/light and background is black/dark
      // So a filled pixel is one that is transparent OR light-colored when opaque
      const isTransparent = a < 128;
      const isLight = r > 127 || g > 127 || b > 127;

      // Filled pixel = transparent OR light-colored
      row.push(isTransparent || isLight);
    }
    pixels.push(row);
  }

  return pixels;
}

/**
 * Extract the main 3x4 character area from the 3x10 glyph image
 * (skipping the top 4 rows for diacritics and bottom 2 rows)
 */
function extractMainChar(pixels: boolean[][]): boolean[][] {
  const height = pixels.length;

  if (height === 10) {
    // Standard 3x10 format - extract rows 4-7 (0-indexed)
    return pixels.slice(4, 8);
  }

  // If not 10 pixels tall, just return as-is (might be a special character)
  return pixels;
}

/**
 * Convert boolean pixel array to bitmap format
 * Each row becomes a 3-bit number
 */
function pixelsToBitmap(pixels: boolean[][]): number[] {
  return pixels.map((row) => {
    let value = 0;
    for (let x = 0; x < Math.min(3, row.length); x++) {
      if (row[x]) {
        value |= 1 << (2 - x); // Set bit from left to right
      }
    }
    return value;
  });
}

/**
 * Format bitmap as TypeScript code
 */
function formatBitmap(bitmap: number[]): string {
  return `[${bitmap.map(n => `0b${n.toString(2).padStart(3, '0')}`).join(', ')}]`;
}

async function main() {
  console.log("🔤 Generating bitmap font from Bytesized PNG glyphs...\n");

  const charMap: Record<string, number[]> = {};

  // Download and process each character
  for (const [char, filename] of Object.entries(ASCII_CHARS)) {
    const url = `${GITHUB_BASE}/${filename}.png`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`⚠️  Failed to fetch ${char} (${filename}): ${response.status}`);
        continue;
      }

      const pngData = Buffer.from(await response.arrayBuffer());
      const pixels = decodePNG(pngData);
      const mainChar = extractMainChar(pixels);
      const bitmap = pixelsToBitmap(mainChar);

      charMap[char] = bitmap;

      process.stdout.write(".");
    } catch (error) {
      console.warn(`\n⚠️  Error processing ${char} (${filename}):`, error);
    }
  }

  console.log("\n\n✅ Successfully processed characters\n");

  // Generate TypeScript file
  const lines = [
    '/**',
    ' * Bytesized 3x4 bitmap font character definitions',
    ' * https://github.com/balt-dev/bytesized-gf',
    ' *',
    ' * Auto-generated from PNG glyphs',
    ' * Each character is represented as an array where each element is a 3-bit number',
    ' * representing which pixels are filled (1) or empty (0)',
    ' *',
    ' * Each row is a number from 0-7 (3 bits): 0b111 = all pixels filled',
    ' */',
    '',
    'type CharBitmap = number[];',
    '',
    '// Bitmap character definitions (3 pixels wide, 4 pixels tall)',
    'const CHAR_MAP: Record<string, CharBitmap> = {',
  ];

  for (const [char, bitmap] of Object.entries(charMap)) {
    const key = char === '"' ? '\\"' : char === "'" ? "\\'" : char === "\\" ? "\\\\" : char;
    const quoted = char.match(/[a-zA-Z0-9]/) ? char : `"${key}"`;
    lines.push(`  ${quoted}: ${formatBitmap(bitmap)},`);
  }

  lines.push('};\n');

  const output = lines.join('\n') + `
// Default character for unknowns (a small box)
const DEFAULT_CHAR: CharBitmap = [0b111, 0b101, 0b101, 0b111];

/**
 * Get the bitmap for a character
 */
export function getCharBitmap(char: string): CharBitmap {
  return CHAR_MAP[char] || DEFAULT_CHAR;
}

/**
 * Get character dimensions
 */
export function getCharDimensions() {
  return { width: 3, height: 4 };
}

/**
 * Convert a character bitmap to a grid of cells
 */
export function bitmapToCells(
  bitmap: CharBitmap,
  textColor: string,
  backgroundColor: string
): Array<Array<{ color: string }>> {
  const cells: Array<Array<{ color: string }>> = [];

  for (let row = 0; row < bitmap.length; row++) {
    const rowCells: Array<{ color: string }> = [];
    const rowBits = bitmap[row] || 0;

    // Read bits from left to right (MSB to LSB for 3 bits)
    for (let col = 0; col < 3; col++) {
      const bitPosition = 2 - col; // Read from bit 2 to bit 0
      const isSet = (rowBits & (1 << bitPosition)) !== 0;
      rowCells.push({
        color: isSet ? textColor : backgroundColor
      });
    }

    cells.push(rowCells);
  }

  return cells;
}

/**
 * Render text string to a grid
 */
export function renderTextToBitmap(
  text: string,
  textColor: string = "bg-sky-500",
  backgroundColor: string = "bg-base-300",
  gridWidth: number = 16,
  gridHeight: number = 16
): Array<Array<{ color: string }>> {
  const charWidth = 3;
  const charHeight = 4;
  const charGap = 1; // 1 pixel gap between characters

  // Calculate text dimensions (including gaps between characters)
  const textWidth = text.length * charWidth + Math.max(0, text.length - 1) * charGap;
  const textHeight = charHeight;

  // Create empty grid
  const grid: Array<Array<{ color: string }>> = Array.from(
    { length: gridHeight },
    () => Array.from({ length: gridWidth }, () => ({ color: backgroundColor }))
  );

  // Calculate position to center the text
  const startX = Math.max(0, Math.floor((gridWidth - textWidth) / 2));
  const startY = Math.max(0, Math.floor((gridHeight - textHeight) / 2));

  // Render each character
  for (let charIndex = 0; charIndex < text.length; charIndex++) {
    const char = text[charIndex] || ' ';
    const bitmap = getCharBitmap(char);
    const charCells = bitmapToCells(bitmap, textColor, backgroundColor);

    // Calculate character position (accounting for gap between characters)
    const charX = startX + charIndex * (charWidth + charGap);

    // Copy character cells to grid
    for (let y = 0; y < charCells.length && startY + y < gridHeight; y++) {
      const row = charCells[y];
      if (!row) continue;

      for (let x = 0; x < row.length && charX + x < gridWidth; x++) {
        const cell = row[x];
        if (cell && grid[startY + y]) {
          grid[startY + y]![charX + x] = cell;
        }
      }
    }
  }

  return grid;
}
`;

  // Write to file
  const outputPath = "./src/bitmapFont.ts";
  await Bun.write(outputPath, output);

  console.log(`✨ Generated ${outputPath}\n`);
  console.log(`📊 Processed ${Object.keys(charMap).length} characters`);
}

main().catch(console.error);
