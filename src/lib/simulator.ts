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
): Promise<ExecutionItem[]> {
  let response: Response;
  try {
    response = await fetch(`${SIMULATOR_URL}/simulate`, {
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
      `Could not reach the simulator at ${SIMULATOR_URL}. Is investec-card-server running?`,
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
