import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { LogContent } from "./LogContent";
import type {
  ExecutionItem,
  LogLevel,
  TransactionInput,
} from "../lib/simulator";

type Props = {
  items: ExecutionItem[] | null;
  /** The transaction the results are for. */
  transaction: TransactionInput | null;
  error: string;
};

const stepLabels: Record<ExecutionItem["type"], string> = {
  before_transaction: "Before transaction",
  after_transaction: "After transaction",
  after_decline: "After decline",
};

const levelStyles: Record<LogLevel, string> = {
  info: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  warn: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  error: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
};

const formatAmount = (transaction: TransactionInput) =>
  `${(transaction.centsAmount / 100).toFixed(2)} ${transaction.currencyCode.toUpperCase()}`;

export function ResultsView({ items, transaction, error }: Props) {
  if (error) {
    return (
      <div
        role="alert"
        className="flex gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-500/10 dark:text-red-300"
      >
        <ExclamationTriangleIcon
          className="mt-0.5 size-4 shrink-0"
          aria-hidden
        />
        <p>{error}</p>
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        Run a transaction to see what your card code does.
      </div>
    );
  }

  const before = items.find((item) => item.type === "before_transaction");
  const approved = before?.authorizationApproved === true;
  const errorCount = items.reduce(
    (count, item) =>
      count + item.logs.filter((log) => log.level === "error").length,
    0,
  );

  return (
    <div className="space-y-4">
      <div
        className={`flex items-center gap-3 rounded-lg p-3 ${
          approved
            ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200"
            : "bg-red-50 text-red-900 dark:bg-red-500/10 dark:text-red-200"
        }`}
      >
        {approved ? (
          <CheckCircleIcon
            className="size-6 shrink-0 text-emerald-600 dark:text-emerald-400"
            aria-hidden
          />
        ) : (
          <XCircleIcon
            className="size-6 shrink-0 text-red-600 dark:text-red-400"
            aria-hidden
          />
        )}
        <div className="min-w-0">
          <p className="font-semibold">{approved ? "Approved" : "Declined"}</p>
          {transaction && (
            <p className="truncate text-sm opacity-80">
              {formatAmount(transaction)} at {transaction.merchantName}
            </p>
          )}
        </div>
        {errorCount > 0 && (
          <span className="ml-auto shrink-0 rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white">
            {errorCount} error{errorCount === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <ol className="relative space-y-4 border-l border-gray-200 pl-5 dark:border-gray-700">
        {items.map((item, i) => (
          <li key={item.executionId ?? i}>
            <span
              className="absolute -left-[5px] mt-1.5 size-2.5 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-gray-900"
              aria-hidden
            />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {stepLabels[item.type] ?? item.type}
              {item.type === "before_transaction" && (
                <span
                  className={`ml-2 rounded px-1.5 py-0.5 text-xs font-medium ${
                    approved
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300"
                  }`}
                >
                  {approved ? "returned approve" : "returned decline"}
                </span>
              )}
            </h3>
            {item.logs.length ? (
              <ul className="mt-2 space-y-1.5">
                {item.logs.map((log, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span
                      className={`mt-px shrink-0 rounded px-1.5 py-px font-mono text-[11px] font-medium uppercase ${levelStyles[log.level] ?? levelStyles.info}`}
                    >
                      {log.level}
                    </span>
                    <LogContent content={log.content} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No logs.
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
