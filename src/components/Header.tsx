import { useRef, type ReactNode } from "react";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  BookmarkIcon,
  CreditCardIcon,
  PlayIcon,
  Squares2X2Icon,
  TrashIcon,
} from "@heroicons/react/20/solid";

export type WorkspaceSource = `example:${string}` | `saved:${string}`;

type Props = {
  examples: string[];
  saved: string[];
  source: WorkspaceSource | "";
  running: boolean;
  toolboxVisible: boolean;
  onToggleToolbox: () => void;
  onOpen: (source: WorkspaceSource) => void;
  onSaveAs: () => void;
  onImport: (file: File) => void;
  onExport: () => void;
  onClear: () => void;
  onRun: () => void;
};

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iP(hone|ad)/.test(navigator.platform);

function ToolButton({
  label,
  icon,
  onClick,
  pressed,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  /** Set for toggle buttons. */
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      aria-pressed={pressed}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 ${
        pressed
          ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:hover:bg-indigo-500/25"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
      }`}
    >
      {icon}
      <span className="sr-only xl:not-sr-only">{label}</span>
    </button>
  );
}

const iconClass = "size-4 shrink-0";

export function Header({
  examples,
  saved,
  source,
  running,
  toolboxVisible,
  onToggleToolbox,
  onOpen,
  onSaveAs,
  onImport,
  onExport,
  onClear,
  onRun,
}: Props) {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gray-200 bg-white px-4 py-2.5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-white">
          <CreditCardIcon className="size-5" aria-hidden />
        </span>
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          <span className="hidden sm:inline">Programmable </span>Card Simulator
        </h1>
      </div>

      {/* Below md the tools take their own row under the title and Run. */}
      <div className="order-last flex w-full flex-nowrap items-center gap-1 md:order-none md:w-auto md:flex-1">
        <ToolButton
          label="Blocks"
          icon={<Squares2X2Icon className={iconClass} aria-hidden />}
          onClick={onToggleToolbox}
          pressed={toolboxVisible}
        />
        <label htmlFor="workspace-source" className="sr-only">
          Open workspace
        </label>
        <select
          id="workspace-source"
          value={source}
          onChange={(event) => onOpen(event.target.value as WorkspaceSource)}
          className="mr-1 min-w-0 flex-1 rounded-md border-0 sm:flex-none bg-white py-1.5 pl-3 pr-9 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700"
        >
          <option value="" disabled>
            Open…
          </option>
          <optgroup label="Examples">
            {examples.map((name) => (
              <option key={name} value={`example:${name}`}>
                {name}
              </option>
            ))}
          </optgroup>
          {saved.length > 0 && (
            <optgroup label="Saved in this browser">
              {saved.map((name) => (
                <option key={name} value={`saved:${name}`}>
                  {name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <ToolButton
          label="Save as…"
          icon={<BookmarkIcon className={iconClass} aria-hidden />}
          onClick={onSaveAs}
        />
        <ToolButton
          label="Import"
          icon={<ArrowUpTrayIcon className={iconClass} aria-hidden />}
          onClick={() => fileInput.current?.click()}
        />
        <ToolButton
          label="Export"
          icon={<ArrowDownTrayIcon className={iconClass} aria-hidden />}
          onClick={onExport}
        />
        <ToolButton
          label="Clear"
          icon={<TrashIcon className={iconClass} aria-hidden />}
          onClick={onClear}
        />
        <input
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onImport(file);
            event.target.value = "";
          }}
        />
      </div>

      <button
        type="button"
        onClick={onRun}
        disabled={running}
        className="ml-auto inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3.5 py-2 md:ml-0 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-wait disabled:opacity-60"
      >
        <PlayIcon className={iconClass} aria-hidden />
        {running ? "Running…" : "Run"}
        <kbd className="hidden rounded bg-indigo-500/60 px-1.5 font-sans text-xs sm:inline">
          {isMac ? "⌘" : "Ctrl"} ↵
        </kbd>
      </button>
    </header>
  );
}
