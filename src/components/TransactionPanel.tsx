import { useState, type CSSProperties, type FormEvent } from "react";
import type {
  EnvironmentVariables,
  ExecutionItem,
  TransactionInput,
} from "../lib/simulator";
import { EnvironmentEditor, type EnvironmentRow } from "./EnvironmentEditor";
import { SimulationOutput } from "./SimulationOutput";

type Props = {
  running: boolean;
  error: string;
  output: ExecutionItem[] | null;
  onSimulate: (
    transaction: TransactionInput,
    environmentVariables: EnvironmentVariables,
  ) => void;
  className?: string;
  style?: CSSProperties;
};

type Field = {
  name: keyof TransactionInput;
  label: string;
  placeholder: string;
  type?: "number";
};

const fields: Field[] = [
  { name: "currencyCode", label: "Currency", placeholder: "zar" },
  {
    name: "centsAmount",
    label: "Amount (cents)",
    placeholder: "1000",
    type: "number",
  },
  { name: "merchantCode", label: "Merchant Code", placeholder: "5542" },
  { name: "merchantName", label: "Merchant Name", placeholder: "Shell" },
  { name: "merchantCity", label: "Merchant City", placeholder: "Cape Town" },
  { name: "merchantCountry", label: "Merchant Country", placeholder: "ZA" },
];

const inputClass =
  "mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

export function TransactionPanel({
  running,
  error,
  output,
  onSimulate,
  className,
  style,
}: Props) {
  const [transaction, setTransaction] = useState<TransactionInput>({
    currencyCode: "zar",
    centsAmount: 1000,
    merchantCode: "0000",
    merchantName: "Test Merchant",
    merchantCity: "Cape Town",
    merchantCountry: "ZA",
  });
  const [environment, setEnvironment] = useState<EnvironmentRow[]>([]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const environmentVariables = Object.fromEntries(
      environment.filter((row) => row.name).map((row) => [row.name, row.value]),
    );
    onSimulate(
      {
        ...transaction,
        merchantName: transaction.merchantName.trim(),
        merchantCity: transaction.merchantCity.trim(),
      },
      environmentVariables,
    );
  };

  return (
    <div
      className={`overflow-hidden rounded-lg bg-white shadow ${className ?? ""}`}
      style={style}
    >
      <div className="px-4 py-5 sm:p-6">
        <form onSubmit={onSubmit}>
          <div className="border-b border-gray-900/10 pb-6">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Simulate Transaction
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Runs the workspace code against this transaction on the card
              simulator.
            </p>
            {fields.map((field) => (
              <div key={field.name} className="mt-3">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
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
                    setTransaction((current) => ({
                      ...current,
                      [field.name]:
                        field.type === "number"
                          ? event.target.valueAsNumber
                          : event.target.value,
                    }))
                  }
                  required
                  className={inputClass}
                />
              </div>
            ))}
            <EnvironmentEditor rows={environment} onChange={setEnvironment} />
            <button
              type="submit"
              disabled={running}
              className="mt-4 rounded bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-wait disabled:opacity-50"
            >
              {running ? "Running…" : "Run Transaction"}
            </button>
          </div>
        </form>
        <div className="mt-4">
          {error && (
            <p role="alert" className="mb-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <SimulationOutput items={output} />
        </div>
      </div>
    </div>
  );
}
