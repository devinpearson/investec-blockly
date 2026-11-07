export type EnvironmentRow = { name: string; value: string };

type Props = {
  rows: EnvironmentRow[];
  onChange: (rows: EnvironmentRow[]) => void;
};

const inputClass =
  "block w-full min-w-0 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

/**
 * Key/value rows sent to the simulator as environmentVariables, which the
 * card code reads from process.env. Kept in memory only, so secrets such as
 * webhook URLs and tokens are not written to browser storage.
 */
export function EnvironmentEditor({ rows, onChange }: Props) {
  const update = (index: number, patch: Partial<EnvironmentRow>) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  return (
    <fieldset className="mt-6">
      <legend className="text-sm font-semibold leading-6 text-gray-900">
        Environment Variables
      </legend>
      <p className="text-xs leading-5 text-gray-600">
        Read in blocks with <code>env</code>. Not saved — re-enter after a
        reload.
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
            className={`${inputClass} basis-2/5 font-mono`}
          />
          <input
            value={row.value}
            onChange={(event) => update(index, { value: event.target.value })}
            aria-label={`Variable ${index + 1} value`}
            placeholder="value"
            spellCheck={false}
            autoComplete="off"
            className={`${inputClass} basis-3/5`}
          />
          <button
            type="button"
            aria-label={`Remove variable ${row.name || index + 1}`}
            className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            onClick={() => onChange(rows.filter((_, i) => i !== index))}
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
        onClick={() => onChange([...rows, { name: "", value: "" }])}
      >
        + Add variable
      </button>
    </fieldset>
  );
}
