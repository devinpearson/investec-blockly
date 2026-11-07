import { useMemo, useState } from "react";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/20/solid";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";

hljs.registerLanguage("javascript", javascript);

type Props = {
  code: string;
  onCopied: () => void;
};

export function CodeView({ code, onCopied }: Props) {
  const [copied, setCopied] = useState(false);
  // hljs escapes the source, so its output is safe to inject.
  const html = useMemo(
    () => hljs.highlight(code, { language: "javascript" }).value,
    [code],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopied();
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked; the code can still be selected by hand.
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The JavaScript your blocks generate.
        </p>
        <button
          type="button"
          onClick={copy}
          disabled={!code}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-800"
        >
          {copied ? (
            <CheckIcon className="size-4 text-emerald-600" aria-hidden />
          ) : (
            <ClipboardIcon className="size-4" aria-hidden />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {code ? (
        <pre
          className="hljs min-h-0 flex-1 overflow-auto rounded-lg bg-gray-50 p-3 font-mono text-[13px] leading-relaxed ring-1 ring-inset ring-gray-200 dark:bg-gray-950 dark:ring-gray-800"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Add blocks to the workspace to generate code.
        </div>
      )}
    </div>
  );
}
