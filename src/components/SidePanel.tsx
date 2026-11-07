import {
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type PanelTab = "transaction" | "results" | "code";

type Props = {
  tab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  /** Small marker next to the Results tab, e.g. after a new run. */
  resultsBadge?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const tabs: { id: PanelTab; label: string }[] = [
  { id: "transaction", label: "Transaction" },
  { id: "results", label: "Results" },
  { id: "code", label: "Code" },
];

export function SidePanel({
  tab,
  onTabChange,
  resultsBadge,
  children,
  className = "",
  style,
}: Props) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  function onKeyDown(event: KeyboardEvent) {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const index = tabs.findIndex((t) => t.id === tab);
    const next = tabs[(index + step + tabs.length) % tabs.length]!;
    onTabChange(next.id);
    buttons.current[tabs.indexOf(next)]?.focus();
  }

  return (
    <aside
      className={`flex min-h-0 flex-col border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}
      style={style}
    >
      <div
        role="tablist"
        aria-label="Simulation"
        className="flex shrink-0 gap-1 border-b border-gray-200 px-3 dark:border-gray-800"
        onKeyDown={onKeyDown}
      >
        {tabs.map(({ id, label }, i) => {
          const selected = id === tab;
          return (
            <button
              key={id}
              ref={(el) => {
                buttons.current[i] = el;
              }}
              id={`tab-${id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`panel-${id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onTabChange(id)}
              className={`-mb-px inline-flex items-center gap-1.5 border-b-2 px-2.5 py-2.5 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 ${
                selected
                  ? "border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300"
                  : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {label}
              {id === "results" && resultsBadge}
            </button>
          );
        })}
      </div>
      <div
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="min-h-0 flex-1 overflow-y-auto p-4"
      >
        {children}
      </div>
    </aside>
  );
}
