import type { Resizable } from "../hooks/useResizable";

type Props = {
  resizable: Resizable;
  label: string;
  className?: string;
};

/** A draggable, keyboard-accessible separator for a useResizable size. */
export function ResizeHandle({ resizable, label, className = "" }: Props) {
  const horizontal = resizable.axis === "y";
  const gripColour = resizable.dragging
    ? "bg-indigo-500"
    : "bg-gray-300 group-hover:bg-indigo-400 group-focus-visible:bg-indigo-500";

  return (
    <div
      role="separator"
      aria-orientation={horizontal ? "horizontal" : "vertical"}
      aria-label={label}
      aria-valuenow={resizable.size}
      tabIndex={0}
      title={`${label} (double-click to reset)`}
      className={[
        "group touch-none focus:outline-none",
        horizontal
          ? "flex h-4 cursor-row-resize items-center justify-center"
          : "w-4 shrink-0 cursor-col-resize justify-center self-stretch",
        className,
      ].join(" ")}
      {...resizable.handleProps}
    >
      <div
        className={[
          "rounded-full",
          horizontal ? "h-1 w-16" : "sticky top-1/2 my-auto h-16 w-1",
          gripColour,
        ].join(" ")}
      />
    </div>
  );
}
