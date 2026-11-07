import { ref, watch } from "vue";

function readStored(key, fallback) {
  try {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) && value > 0 ? value : fallback;
  } catch {
    return fallback;
  }
}

/**
 * A size (in px) that can be changed by dragging a handle, remembered per
 * browser.
 *
 * @param {object} opts
 * @param {string} opts.storageKey localStorage key for the remembered size
 * @param {number} opts.initial    default size
 * @param {number} opts.min        smallest allowed size
 * @param {() => number} opts.max  largest allowed size (re-read on each drag)
 * @param {"x" | "y"} opts.axis    pointer axis that drives the size
 * @param {1 | -1} [opts.direction] -1 when dragging towards the origin grows it
 *   (e.g. a panel on the right whose handle is on its left edge)
 */
export function useResizable({
  storageKey,
  initial,
  min,
  max,
  axis,
  direction = 1,
}) {
  const clamp = (value) => Math.round(Math.min(Math.max(value, min), max()));
  const size = ref(clamp(readStored(storageKey, initial)));
  const dragging = ref(false);

  watch(size, (value) => {
    try {
      localStorage.setItem(storageKey, String(value));
    } catch {
      // Storage unavailable; the size just won't be remembered.
    }
  });

  function startDrag(event) {
    event.preventDefault();
    const handle = event.currentTarget;
    const start = axis === "x" ? event.clientX : event.clientY;
    const startSize = size.value;
    dragging.value = true;
    handle.setPointerCapture(event.pointerId);

    const onMove = (e) => {
      const position = axis === "x" ? e.clientX : e.clientY;
      size.value = clamp(startSize + (position - start) * direction);
    };
    const onUp = () => {
      dragging.value = false;
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  }

  // Keyboard support for the separator: arrow keys nudge, Shift for bigger steps.
  function onKeydown(event) {
    const step = event.shiftKey ? 50 : 10;
    const keys =
      axis === "x"
        ? { ArrowLeft: -step, ArrowRight: step }
        : { ArrowUp: -step, ArrowDown: step };
    if (!(event.key in keys)) return;
    event.preventDefault();
    size.value = clamp(size.value + keys[event.key] * direction);
  }

  function reset() {
    size.value = clamp(initial);
  }

  return { size, dragging, startDrag, onKeydown, reset, clamp };
}
