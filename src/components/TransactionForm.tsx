import type { FormEvent } from "react";
import type { TransactionInput } from "../lib/simulator";
import { EnvironmentEditor, type EnvironmentRow } from "./EnvironmentEditor";
import { inputClass, labelClass } from "./styles";

type Props = {
  transaction: TransactionInput;
  onTransactionChange: (transaction: TransactionInput) => void;
  environment: EnvironmentRow[];
  onEnvironmentChange: (rows: EnvironmentRow[]) => void;
  running: boolean;
  onRun: () => void;
};

type Field = {
  name: keyof TransactionInput;
  label: string;
  placeholder: string;
  type?: "number";
  wide?: boolean;
};

const fields: Field[] = [
  {
    name: "centsAmount",
    label: "Amount (cents)",
    placeholder: "1000",
    type: "number",
  },
  { name: "currencyCode", label: "Currency", placeholder: "zar" },
  { name: "merchantCode", label: "Merchant code (MCC)", placeholder: "5542" },
  { name: "merchantCountry", label: "Country", placeholder: "ZA" },
  {
    name: "merchantName",
    label: "Merchant name",
    placeholder: "Shell",
    wide: true,
  },
  {
    name: "merchantCity",
    label: "Merchant city",
    placeholder: "Cape Town",
    wide: true,
  },
];

const formatRands = (cents: number) =>
  Number.isFinite(cents)
    ? new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
      }).format(cents / 100)
    : "—";

export function TransactionForm({
  transaction,
  onTransactionChange,
  environment,
  onEnvironmentChange,
  running,
  onRun,
}: Props) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    onRun();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Runs the workspace code against this card transaction on the
          simulator.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
          {fields.map((field) => (
            <div key={field.name} className={field.wide ? "col-span-2" : ""}>
              <label htmlFor={field.name} className={labelClass}>
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type ?? "text"}
                {...(field.type === "number" ? { min: 0, step: 1 } : {})}
                placeholder={field.placeholder}
                // An emptied number input reports NaN; show it as blank.
                value={
                  Number.isNaN(transaction[field.name])
                    ? ""
                    : transaction[field.name]
                }
                onChange={(event) =>
                  onTransactionChange({
                    ...transaction,
                    [field.name]:
                      field.type === "number"
                        ? event.target.valueAsNumber
                        : event.target.value,
                  })
                }
                required
                className={inputClass}
              />
              {field.type === "number" && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formatRands(transaction.centsAmount)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <EnvironmentEditor rows={environment} onChange={onEnvironmentChange} />

      <button
        type="submit"
        disabled={running}
        className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-wait disabled:opacity-60"
      >
        {running ? "Running…" : "Run transaction"}
      </button>
    </form>
  );
}
