import { create } from "zustand";
import {
  Stroke,
  strokeColorsEnum,
  Mode,
  ModeEnum,
  doesIntersect,
  eraseTextStrokes,
} from "@/lib/utils";
import { useCanvas } from "@/hooks/useCanvas";
import { BoundingBox } from "@/hooks/selectionBox";
interface StrokesState {
  mode: Mode;
  strokes: Stroke[];
  undoneStrokes: Stroke[];
  cursorStyle: string;
  strokeColor: strokeColorsEnum;
  strokeWidth: number;
  strokeTaper: number;
  scale: number;
  panOffset: { x: number; y: number };
  canvasRef: React.RefObject<HTMLCanvasElement>;

  updateCursorStyle: (cursorStyle: string) => void;
  updateMode: (mode: Mode) => void;
  addStroke: (newStroke: Stroke) => void;
  undoStroke: () => void;
  redoStroke: () => void;
  eraseStroke: (erasePoints: number[][]) => void;
  updateStrokeColor: (strokeColor: strokeColorsEnum) => void;
  updateStrokeWidth: (strokeWidth: number) => void;
  handleZoom: (zoomIn: boolean) => void;
  updatePanOffset: (newOffset: { x: number; y: number }) => void;
  updateScale: (newScale: number) => void;
  clearCanvas: () => void;
  updateStrokeTaper: (strokeTaper: number) => void;
  updateStroke: (updatedStroke: Stroke) => void;
  boundingBox: (BoundingBox | null);
  setBoundingBox: (box: BoundingBox | null) => void;
}

export const useStrokesStore = create<StrokesState>((set, get) => ({
  mode: ModeEnum.CURSOR,
  strokes: [],
  undoneStrokes: [],
  cursorStyle: "pointer",
  strokeColor: strokeColorsEnum.BLACK,
  strokeWidth: 10,
  strokeTaper: 0,
  scale: 1,
  panOffset: { x: 0, y: 0 },
  canvasRef: { current: null },
  boundingBox: null, // Store current bounding box here

  setBoundingBox: (box) => set(() => ({ boundingBox: box })),

  updateCursorStyle: (cursorStyle: string) => set({ cursorStyle }),
  updateMode: (mode: Mode) => set({ mode }),
  addStroke: (newStroke: Stroke) => set((state) => ({
    strokes: [...state.strokes, newStroke],
    undoneStrokes: []
  })),
  undoStroke: () => set((state) => {
    const lastStroke = state.strokes[state.strokes.length - 1];
    if (!lastStroke) return state;
    return {
      strokes: state.strokes.slice(0, -1),
      undoneStrokes: [...state.undoneStrokes, lastStroke],
    };
  }),
  redoStroke: () => set((state) => {
    const lastUndone = state.undoneStrokes[state.undoneStrokes.length - 1];
    if (!lastUndone) return state;
    return {
      strokes: [...state.strokes, lastUndone],
      undoneStrokes: state.undoneStrokes.slice(0, -1),
    };
  }),
  eraseStroke: (erasePoints: number[][]) => set((state) => ({
    strokes: state.strokes.filter((stroke) => {
      if (stroke.path) return !doesIntersect(stroke.path, erasePoints);
      return eraseTextStrokes(stroke, erasePoints);
    })
  })),
  updateStrokeColor: (strokeColor: strokeColorsEnum) => set({ strokeColor }),
  updateStrokeWidth: (strokeWidth: number) => set({ strokeWidth }),
  updateStrokeTaper: (strokeTaper: number) => set({ strokeTaper }),
  updatePanOffset: (newOffset: { x: number; y: number }) => set({ panOffset: newOffset }),
  updateScale: (newScale: number) => set({ scale: newScale }),
  handleZoom: (zoomIn: boolean) => {
    const { scale, panOffset, canvasRef } = get();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const zoomFactor = 0.05;
    const minScale = 0.5;
    const maxScale = 2.0;
    const newScale = Math.min(Math.max(scale + (zoomIn ? zoomFactor : -zoomFactor), minScale), maxScale);

    if (newScale === scale) return;

    const scaleFactor = newScale / scale;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newPanOffset = {
      x: centerX - (centerX - panOffset.x) * scaleFactor,
      y: centerY - (centerY - panOffset.y) * scaleFactor,
    };

    set({ panOffset: newPanOffset, scale: newScale });
  },
  clearCanvas: () => set({ strokes: [], undoneStrokes: [] }),

  updateStroke: (updatedStroke: Stroke) => set((state) => ({
    strokes: state.strokes.map((stroke) =>
      stroke === updatedStroke ? updatedStroke : stroke
    )
  })),
}));

// Synchronize strokes with localStorage
useStrokesStore.subscribe((state) => {
  localStorage.setItem("strokes", JSON.stringify(state.strokes));
});