// One logged value in Results. The emulator sends each log as JSON text, so
// a logged object (e.g. the whole authorization) arrives as one long line;
// objects and arrays are shown as indented, expandable JSON instead.

const codeClass =
  "font-mono text-[13px] text-gray-800 dark:text-gray-200 break-words";

function parseStructured(content: string): object | null {
  const trimmed = content.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null;
  try {
    const value: unknown = JSON.parse(trimmed);
    return typeof value === "object" && value !== null ? value : null;
  } catch {
    // Several values logged together, or not JSON at all.
    return null;
  }
}

function describe(value: object): string {
  if (Array.isArray(value)) {
    return `[…] ${value.length} item${value.length === 1 ? "" : "s"}`;
  }
  const keys = Object.keys(value);
  const preview = keys.slice(0, 4).join(", ");
  return `{…} ${keys.length} field${keys.length === 1 ? "" : "s"}${
    keys.length ? `: ${preview}${keys.length > 4 ? ", …" : ""}` : ""
  }`;
}

export function LogContent({ content }: { content: string }) {
  const value = parseStructured(content);
  if (!value) {
    return (
      <code className={`min-w-0 whitespace-pre-wrap ${codeClass}`}>
        {content}
      </code>
    );
  }
  return (
    <details className="group min-w-0 flex-1">
      <summary className="cursor-pointer select-none font-mono text-[13px] text-gray-600 marker:text-gray-400 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
        {describe(value)}
      </summary>
      <pre
        className={`mt-1.5 max-h-96 overflow-auto rounded-md bg-gray-50 p-2.5 ring-1 ring-inset ring-gray-200 dark:bg-gray-950 dark:ring-gray-800 ${codeClass}`}
      >
        {JSON.stringify(value, null, 2)}
      </pre>
    </details>
  );
}
