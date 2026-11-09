// Client for investec-card-server (https://github.com/devinpearson/investec-card-server).
// Override the address with VITE_SIMULATOR_URL in a .env.local file.
export const SIMULATOR_URL: string =
  import.meta.env.VITE_SIMULATOR_URL ?? "http://localhost:3010";

/** The transaction fields the simulator turns into an authorization. */
export type TransactionInput = {
  currencyCode: string;
  centsAmount: number;
  merchantCode: string;
  merchantName: string;
  merchantCity: string;
  merchantCountry: string;
};

export type EnvironmentVariables = Record<string, string>;

export type LogLevel = "info" | "warn" | "error";

export type ExecutionLog = {
  createdAt: string;
  level: LogLevel;
  content: string;
};

/** One step of a simulated run, as returned by the card code emulator. */
export type ExecutionItem = {
  executionId: string;
  type: "before_transaction" | "after_transaction" | "after_decline";
  authorizationApproved: boolean | null;
  logs: ExecutionLog[];
  createdAt: string;
};

export class SimulatorError extends Error {}

export async function simulate(
  code: string,
  transaction: TransactionInput,
  environmentVariables: EnvironmentVariables = {},
  baseUrl: string = SIMULATOR_URL,
): Promise<ExecutionItem[]> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transaction,
        environmentVariables,
        // The server decodes this with decodeURI.
        code: encodeURI(code),
      }),
    });
  } catch {
    throw new SimulatorError(
      `Could not reach the simulator at ${baseUrl}. Is investec-card-server running?`,
    );
  }
  if (!response.ok) {
    const detail = await response
      .json()
      .then((body: { error?: string }) => body.error)
      .catch(() => undefined);
    throw new SimulatorError(
      `Simulator returned ${response.status}${detail ? `: ${detail}` : ""}`,
    );
  }
  return (await response.json()) as ExecutionItem[];
}

export const defaultTransaction: TransactionInput = {
  currencyCode: "zar",
  centsAmount: 1000,
  merchantCode: "0000",
  merchantName: "Test Merchant",
  merchantCity: "Cape Town",
  merchantCountry: "ZA",
};

/** A message describing the first invalid field, or null if all are valid. */
export function validateTransaction(
  transaction: TransactionInput,
): string | null {
  if (
    !Number.isFinite(transaction.centsAmount) ||
    transaction.centsAmount < 0
  ) {
    return "Amount must be a whole number of cents.";
  }
  const missing = (
    [
      ["currencyCode", "Currency"],
      ["merchantCode", "Merchant code"],
      ["merchantName", "Merchant name"],
      ["merchantCity", "Merchant city"],
      ["merchantCountry", "Merchant country"],
    ] as const
  ).find(([key]) => !String(transaction[key]).trim());
  return missing ? `${missing[1]} is required.` : null;
}

/** True when investec-card-server answers at SIMULATOR_URL within 3 seconds. */
export async function checkSimulator(): Promise<boolean> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(`${SIMULATOR_URL}/`, {
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}

/** True for the error simulate() throws when the server can't be reached. */
export const isUnreachableError = (message: string) =>
  message.startsWith("Could not reach the simulator");
