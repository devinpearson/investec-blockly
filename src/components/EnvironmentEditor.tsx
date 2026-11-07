import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { inputClass } from "./styles";

export type EnvironmentRow = { name: string; value: string };

type Props = {
  rows: EnvironmentRow[];
  onChange: (rows: EnvironmentRow[]) => void;
};

/**
 * Key/value rows sent to the simulator as environmentVariables, which the
 * card code reads from process.env. Kept in memory only, so secrets such as
 * webhook URLs and tokens are not written to browser storage.
 */
export function EnvironmentEditor({ rows, onChange }: Props) {
  const update = (index: number, patch: Partial<EnvironmentRow>) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-gray-900 dark:text-white">
        Environment variables
      </legend>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Read in blocks with <code className="font-mono">env</code>. Kept in
        memory only — re-enter after a reload.
      </p>
      {rows.map((row, index) => (
        <div key={index} className="mt-2 flex items-center gap-2">
          <input
            value={row.name}
            onChange={(event) =>
              update(index, { name: event.target.value.trim() })
            }
            aria-label={`Variable ${index + 1} name`}
            placeholder="NAME"
            spellCheck={false}
            autoComplete="off"
            className={`${inputClass} !mt-0 basis-2/5 font-mono`}
          />
          <input
            value={row.value}
            onChange={(event) => update(index, { value: event.target.value })}
            aria-label={`Variable ${index + 1} value`}
            placeholder="value"
            spellCheck={false}
            autoComplete="off"
            className={`${inputClass} !mt-0 basis-3/5`}
          />
          <button
            type="button"
            aria-label={`Remove variable ${row.name || index + 1}`}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            onClick={() => onChange(rows.filter((_, i) => i !== index))}
          >
            <XMarkIcon className="size-4" aria-hidden />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        onClick={() => onChange([...rows, { name: "", value: "" }])}
      >
        <PlusIcon className="size-4" aria-hidden />
        Add variable
      </button>
    </fieldset>
  );
}
