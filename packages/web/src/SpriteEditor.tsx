import {
  PaperAirplaneIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState, useEffect } from "react";

type Cell = {
  color: string;
};

type Tool = "pencil" | "eraser";

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
  const [selectedTool, setSelectedTool] = useState<Tool>("pencil");
  const [selectedColor, setSelectedColor] = useState("bg-sky-500");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

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

    if (selectedTool === "eraser") {
      rowData[col] = { color: "bg-base-300" };
    } else {
      rowData[col] = { color: selectedColor };
    }
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

  const colors = [
    "bg-slate-500",
    "bg-gray-500",
    "bg-zinc-500",
    "bg-neutral-500",
    "bg-stone-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
  ];

  return (
    <div className="flex flex-col gap-4" onMouseUp={handleMouseUp}>
      {/* Toolbar */}
      <div className="flex gap-4 items-center p-4 bg-base-200 rounded-lg">
        {/* Tool Selection */}
        <div className="join">
          <button
            type="button"
            className={clsx("btn join-item", {
              "btn-active": selectedTool === "pencil",
            })}
            onClick={() => setSelectedTool("pencil")}
            title="Pencil"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={clsx("btn join-item", {
              "btn-active": selectedTool === "eraser",
            })}
            onClick={() => setSelectedTool("eraser")}
            title="Eraser"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={clsx("btn join-item gap-2", {
              "btn-primary": sendStatus === "idle",
              "btn-success": sendStatus === "success",
              "btn-error": sendStatus === "error",
            })}
            onClick={sendToDisplay}
            disabled={isSending}
            title="Send to Display"
          >
            {isSending ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Sending...
              </>
            ) : sendStatus === "success" ? (
              <>✓ Sent!</>
            ) : sendStatus === "error" ? (
              <>✗ Failed</>
            ) : (
              <>
                <PaperAirplaneIcon className="h-5 w-5" />
                Send
              </>
            )}
          </button>
        </div>

        {/* Color Palette */}
        <div className="divider divider-horizontal" />
        <div className="flex gap-1 flex-wrap max-w-md">
          {colors.map((color) => (
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
