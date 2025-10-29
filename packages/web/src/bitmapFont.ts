/**
 * Bytesized 3x4 bitmap font character definitions
 * https://github.com/balt-dev/bytesized-gf
 *
 * Auto-generated from PNG glyphs
 * Each character is represented as an array where each element is a 3-bit number
 * representing which pixels are filled (1) or empty (0)
 *
 * Each row is a number from 0-7 (3 bits): 0b111 = all pixels filled
 */

type CharBitmap = number[];

// Bitmap character definitions (3 pixels wide, 4 pixels tall)
const CHAR_MAP: Record<string, CharBitmap> = {
  0: [0b111, 0b101, 0b101, 0b111],
  1: [0b110, 0b010, 0b010, 0b111],
  2: [0b110, 0b011, 0b100, 0b111],
  3: [0b111, 0b010, 0b001, 0b110],
  4: [0b101, 0b101, 0b111, 0b001],
  5: [0b111, 0b110, 0b001, 0b110],
  6: [0b100, 0b111, 0b101, 0b111],
  7: [0b111, 0b001, 0b010, 0b010],
  8: [0b011, 0b111, 0b101, 0b111],
  9: [0b111, 0b101, 0b111, 0b001],
  " ": [0b000, 0b000, 0b000, 0b000],
  "!": [0b010, 0b010, 0b000, 0b010],
  "\"": [0b101, 0b101, 0b000, 0b000],
  "#": [0b101, 0b111, 0b010, 0b101],
  "$": [0b011, 0b110, 0b011, 0b110],
  "%": [0b101, 0b001, 0b010, 0b101],
  "&": [0b011, 0b110, 0b101, 0b111],
  "\'": [0b010, 0b010, 0b000, 0b000],
  "(": [0b010, 0b100, 0b100, 0b010],
  ")": [0b100, 0b010, 0b010, 0b100],
  "*": [0b111, 0b010, 0b101, 0b000],
  "+": [0b010, 0b111, 0b010, 0b000],
  ",": [0b000, 0b000, 0b010, 0b100],
  "-": [0b000, 0b111, 0b000, 0b000],
  ".": [0b000, 0b000, 0b000, 0b010],
  "/": [0b001, 0b010, 0b010, 0b100],
  ":": [0b010, 0b000, 0b010, 0b000],
  ";": [0b010, 0b000, 0b010, 0b010],
  "<": [0b011, 0b100, 0b011, 0b000],
  "=": [0b111, 0b000, 0b111, 0b000],
  ">": [0b110, 0b001, 0b110, 0b000],
  "?": [0b111, 0b011, 0b000, 0b010],
  "@": [0b010, 0b101, 0b100, 0b011],
  A: [0b111, 0b101, 0b111, 0b101],
  B: [0b110, 0b111, 0b101, 0b111],
  C: [0b011, 0b100, 0b100, 0b011],
  D: [0b110, 0b101, 0b101, 0b110],
  E: [0b111, 0b110, 0b100, 0b111],
  F: [0b111, 0b100, 0b110, 0b100],
  G: [0b011, 0b100, 0b101, 0b011],
  H: [0b101, 0b111, 0b101, 0b101],
  I: [0b111, 0b010, 0b010, 0b111],
  J: [0b111, 0b001, 0b001, 0b110],
  K: [0b101, 0b110, 0b101, 0b101],
  L: [0b100, 0b100, 0b100, 0b111],
  M: [0b110, 0b111, 0b101, 0b101],
  N: [0b110, 0b101, 0b101, 0b101],
  O: [0b010, 0b101, 0b101, 0b010],
  P: [0b111, 0b101, 0b111, 0b100],
  Q: [0b111, 0b101, 0b110, 0b001],
  R: [0b111, 0b101, 0b110, 0b101],
  S: [0b011, 0b110, 0b001, 0b110],
  T: [0b111, 0b010, 0b010, 0b010],
  U: [0b101, 0b101, 0b101, 0b011],
  V: [0b101, 0b101, 0b101, 0b010],
  W: [0b101, 0b101, 0b111, 0b011],
  X: [0b101, 0b010, 0b101, 0b101],
  Y: [0b101, 0b101, 0b010, 0b010],
  Z: [0b111, 0b010, 0b100, 0b111],
  "[": [0b110, 0b100, 0b100, 0b110],
  "\\": [0b100, 0b010, 0b010, 0b001],
  "]": [0b110, 0b010, 0b010, 0b110],
  "^": [0b010, 0b101, 0b000, 0b000],
  "_": [0b000, 0b000, 0b000, 0b111],
  "`": [0b100, 0b010, 0b000, 0b000],
  a: [0b000, 0b011, 0b101, 0b111],
  b: [0b100, 0b110, 0b101, 0b111],
  c: [0b000, 0b111, 0b100, 0b111],
  d: [0b001, 0b111, 0b101, 0b111],
  e: [0b000, 0b011, 0b110, 0b111],
  f: [0b011, 0b100, 0b110, 0b100],
  g: [0b000, 0b011, 0b011, 0b111],
  h: [0b100, 0b110, 0b101, 0b101],
  i: [0b010, 0b000, 0b110, 0b011],
  j: [0b001, 0b000, 0b001, 0b111],
  k: [0b100, 0b101, 0b110, 0b101],
  l: [0b110, 0b010, 0b010, 0b001],
  m: [0b000, 0b110, 0b111, 0b101],
  n: [0b000, 0b110, 0b101, 0b101],
  o: [0b000, 0b010, 0b101, 0b010],
  p: [0b000, 0b111, 0b111, 0b100],
  q: [0b000, 0b111, 0b111, 0b001],
  r: [0b000, 0b111, 0b100, 0b100],
  s: [0b000, 0b011, 0b010, 0b110],
  t: [0b100, 0b110, 0b100, 0b011],
  u: [0b000, 0b101, 0b101, 0b011],
  v: [0b000, 0b101, 0b101, 0b010],
  w: [0b000, 0b101, 0b111, 0b011],
  x: [0b000, 0b101, 0b010, 0b101],
  y: [0b000, 0b101, 0b011, 0b110],
  z: [0b000, 0b110, 0b010, 0b011],
  "{": [0b001, 0b110, 0b010, 0b001],
  "|": [0b010, 0b010, 0b010, 0b010],
  "}": [0b100, 0b011, 0b010, 0b100],
  "~": [0b011, 0b110, 0b000, 0b000],
};

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
