import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { readStorage, writeStorage } from "../lib/storage";

export type ResizableOptions = {
  /** localStorage key for the remembered size. */
  storageKey: string;
  /** Default size in px. */
  initial: number;
  /** Smallest allowed size in px. */
  min: number;
  /** Largest allowed size in px; re-read on every change. */
  max: () => number;
  /** Pointer axis that drives the size. */
  axis: "x" | "y";
  /**
   * -1 when dragging towards the origin grows the size (e.g. a panel on the
   * right whose handle is on its left edge).
   */
  direction?: 1 | -1;
};

export type Resizable = {
  size: number;
  dragging: boolean;
  axis: "x" | "y";
  handleProps: {
    onPointerDown: (event: PointerEvent<HTMLElement>) => void;
    onPointerMove: (event: PointerEvent<HTMLElement>) => void;
    onPointerUp: (event: PointerEvent<HTMLElement>) => void;
    onPointerCancel: (event: PointerEvent<HTMLElement>) => void;
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
    onDoubleClick: () => void;
  };
};

/**
 * A size in px that changes by dragging a handle or with the arrow keys
 * (Shift for bigger steps), remembered in this browser.
 */
export function useResizable({
  storageKey,
  initial,
  min,
  max,
  axis,
  direction = 1,
}: ResizableOptions): Resizable {
  // Read max through a ref so callers can pass an inline function.
  const maxRef = useRef(max);
  useEffect(() => {
    maxRef.current = max;
  });

  const clamp = useCallback(
    (value: number) =>
      Math.round(
        Math.min(Math.max(value, min), Math.max(min, maxRef.current())),
      ),
    [min],
  );

  const [size, setSize] = useState(() => {
    const stored = Number(readStorage(storageKey));
    const value = Number.isFinite(stored) && stored > 0 ? stored : initial;
    return Math.round(Math.min(Math.max(value, min), Math.max(min, max())));
  });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ position: number; size: number } | null>(null);

  useEffect(() => {
    writeStorage(storageKey, String(size));
  }, [storageKey, size]);

  // Keep within bounds when the window shrinks.
  useEffect(() => {
    const onResize = () => setSize((current) => clamp(current));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clamp]);

  const positionOf = (event: PointerEvent) =>
    axis === "x" ? event.clientX : event.clientY;

  const endDrag = (event: PointerEvent<HTMLElement>) => {
    if (!dragStart.current) return;
    dragStart.current = null;
    setDragging(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  return {
    size,
    dragging,
    axis,
    handleProps: {
      onPointerDown(event) {
        event.preventDefault();
        event.currentTarget.setPointerCapture?.(event.pointerId);
        dragStart.current = { position: positionOf(event), size };
        setDragging(true);
      },
      onPointerMove(event) {
        const start = dragStart.current;
        if (!start) return;
        setSize(
          clamp(start.size + (positionOf(event) - start.position) * direction),
        );
      },
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onKeyDown(event) {
        const step = event.shiftKey ? 50 : 10;
        const keys: Record<string, number> =
          axis === "x"
            ? { ArrowLeft: -step, ArrowRight: step }
            : { ArrowUp: -step, ArrowDown: step };
        const delta = keys[event.key];
        if (delta === undefined) return;
        event.preventDefault();
        setSize((current) => clamp(current + delta * direction));
      },
      onDoubleClick() {
        setSize(clamp(initial));
      },
    },
  };
}
