import {
  BackspaceIcon,
  ChartBarIcon,
  CheckIcon,
  ChevronDownIcon,
  CommandLineIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState, useEffect } from "react";

import { Palettes, type PaletteName } from "./palettes";
import { renderTextToBitmap } from "./bitmapFont";

type Cell = {
  color: string;
};

interface SpriteEditorProps {
  width: number;
  height: number;
  cellSize?: string;
  gap?: string;
}

export function SpriteEditor({
  width,
  height,
  cellSize = "4",
  gap = "1",
}: SpriteEditorProps) {
  const [selectedPalette, setSelectedPalette] =
    useState<PaletteName>("default");
  const [selectedColor, setSelectedColor] = useState("bg-sky-500");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [textInput, setTextInput] = useState("");

  const currentPalette = Palettes[selectedPalette];

  // Initialize grid with empty cells
  const [grid, setGrid] = useState<Cell[][]>(() =>
    Array.from({ length: height }, () =>
      Array.from({ length: width }, () => ({ color: "bg-base-300" })),
    ),
  );

  const handleCellClick = (row: number, col: number) => {
    const newGrid = [...grid];
    const rowData = newGrid[row];
    if (!rowData) return;

    rowData[col] = { color: selectedColor };
    setGrid(newGrid);
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsDrawing(true);
    handleCellClick(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDrawing) {
      handleCellClick(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Add global mouseup listener to handle mouse releases outside the grid
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDrawing(false);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  // Reset status after 3 seconds
  useEffect(() => {
    if (sendStatus !== "idle") {
      const timer = setTimeout(() => setSendStatus("idle"), 3000);
      return () => clearTimeout(timer);
    }
  }, [sendStatus]);

  const clearSprite = () => {
    const newGrid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => ({ color: "bg-base-300" })),
    );
    setGrid(newGrid);
  };

  const fillWithGradient = () => {
    const newGrid = Array.from({ length: height }, (_, rowIndex) => {
      const color = currentPalette[rowIndex % currentPalette.length];
      return Array.from({ length: width }, () => ({
        color: color || "bg-base-300",
      }));
    });
    setGrid(newGrid);
  };

  const renderText = () => {
    if (!textInput.trim()) return;

    try {
      const textGrid = renderTextToBitmap(
        textInput,
        selectedColor,
        "bg-base-300",
        width,
        height,
      );
      setGrid(textGrid);
    } catch (error) {
      console.error("Error rendering text:", error);
    }
  };

  const sendToDisplay = async () => {
    setIsSending(true);
    setSendStatus("idle");

    try {
      const response = await fetch("/api/sprite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ width, height, grid }),
      });

      const result = await response.json();

      if (result.success) {
        setSendStatus("success");
      } else {
        console.error("Failed to send sprite:", result.error);
        setSendStatus("error");
      }
    } catch (error) {
      console.error("Error sending sprite:", error);
      setSendStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4" onMouseUp={handleMouseUp}>
      {/* Toolbar */}
      <div className="flex gap-4 items-center p-2 bg-base-200 rounded-lg flex-wrap">
        {/* Text Input */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Type text..."
            className="input input-sm input-bordered w-32"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                renderText();
              }
            }}
          />
          <button
            type="button"
            className="btn btn-square btn-sm"
            onClick={renderText}
            disabled={!textInput.trim()}
            title="Render Text (3x4 font)"
          >
            <CommandLineIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="divider divider-horizontal" />

        {/* Actions */}
        <div className="join">
          <button
            type="button"
            className="btn btn-square join-item"
            onClick={clearSprite}
            title="Clear"
          >
            <BackspaceIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="btn btn-square join-item"
            onClick={fillWithGradient}
            title="Gradient"
          >
            <ChartBarIcon className="h-5 w-5 rotate-90" />
          </button>
          <button
            type="button"
            className={clsx("btn btn-square join-item gap-2", {
              "btn-primary": sendStatus === "idle",
              "btn-success": sendStatus === "success",
              "btn-error": sendStatus === "error",
            })}
            onClick={sendToDisplay}
            disabled={isSending}
            title="Send to Display"
          >
            {isSending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : sendStatus === "success" ? (
              <CheckIcon className="h-5 w-5" />
            ) : sendStatus === "error" ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Color Palette */}
        <div className="divider divider-horizontal" />
        <div className="flex gap-1 items-center">
          <div className="flex gap-1 flex-wrap max-w-md">
            {/* Empty/Erase color */}
            <button
              type="button"
              className={clsx(
                "w-8 h-8 rounded cursor-pointer border-2 hover:scale-110 transition-transform bg-base-300",
                "relative",
                selectedColor === "bg-base-300"
                  ? "border-base-content"
                  : "border-base-300",
              )}
              onClick={() => setSelectedColor("bg-base-300")}
              title="Empty (Erase)"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-0.5 bg-base-content/30 rotate-45" />
              </div>
            </button>

            {/* Color palette */}
            {currentPalette.map((color) => (
              <button
                type="button"
                key={color}
                className={clsx(
                  "w-8 h-8 rounded cursor-pointer border-2 hover:scale-110 transition-transform",
                  color,
                  selectedColor === color
                    ? "border-base-content"
                    : "border-base-300",
                )}
                onClick={() => setSelectedColor(color)}
                title={color}
              />
            ))}
          </div>

          {/* Palette Selector Dropdown */}
          <div className="dropdown dropdown-end">
            <button
              type="button"
              tabIndex={0}
              className="btn btn-square btn-sm"
              title="Select Palette"
            >
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            <ul
              // biome-ignore lint/a11y/noNoninteractiveTabindex: DaisyUI standard
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              {(Object.keys(Palettes) as PaletteName[]).map((paletteName) => (
                <li key={paletteName}>
                  <button
                    type="button"
                    className={clsx({
                      active: selectedPalette === paletteName,
                    })}
                    onClick={() => {
                      setSelectedPalette(paletteName);
                      // Close dropdown by removing focus
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                    }}
                  >
                    {paletteName}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-auto p-4 bg-base-200 rounded-lg">
        <div className={clsx(`flex flex-col select-none gap-${gap} w-fit`)}>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className={clsx(`flex gap-${gap}`)}>
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={clsx(
                    `h-${cellSize} w-${cellSize} border border-base-content/10 cursor-crosshair rounded-sm`,
                    cell.color,
                  )}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden">
        <div className="h-1px w-1px gap-[1px]" />
        <div className="h-2px w-2px gap-[2px]" />
        <div className="h-1 w-1 gap-1" />
        <div className="h-2 w-2 gap-2" />
        <div className="h-3 w-3 gap-3" />
        <div className="h-4 w-4 gap-4" />
        <div className="h-5 w-5 gap-5" />
      </div>
    </div>
  );
}
