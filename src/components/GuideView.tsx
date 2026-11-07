import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import type { ReactNode } from "react";
import type { Guide, Scenario } from "../examples";
import type { EnvironmentRow } from "./EnvironmentEditor";

type Props = {
  name: string;
  guide: Guide;
  /** Variables the example reads. */
  envNames: string[];
  environment: EnvironmentRow[];
  running: boolean;
  onRunScenario: (scenario: Scenario) => void;
  onShowEnvironment: () => void;
};

// The same for every example: what Run does behind the scenes.
const behindTheScenes = [
  "Your blocks are turned into JavaScript — beforeTransaction, " +
    "afterTransaction and afterDecline functions. The Code tab shows it.",
  "Run sends that code, the transaction from the Transaction tab and your " +
    "environment variables to investec-card-server.",
  "The server builds a card authorization like the real card does: it " +
    "looks up the merchant category and country from their codes and stamps " +
    "it with the current time.",
  "beforeTransaction runs in an isolated sandbox. Returning false declines " +
    "the purchase; anything else — including returning nothing — approves " +
    "it. An error also declines it in the simulator.",
  "Then afterTransaction (approved) or afterDecline (declined) runs, in a " +
    "fresh sandbox: nothing carries over between the two or between " +
    "purchases. Each step has 5 seconds.",
  "Everything the code logs comes back to the Results tab, by step.",
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </section>
  );
}

const listClass = "list-decimal space-y-1.5 pl-5 marker:text-gray-400";

export function GuideView({
  name,
  guide,
  envNames,
  environment,
  running,
  onRunScenario,
  onShowEnvironment,
}: Props) {
  const valueOf = (variable: string) =>
    environment.find((row) => row.name === variable)?.value ?? "";
  const missing = envNames.filter((variable) => !valueOf(variable));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Example
        </p>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {name}
        </h2>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          {guide.summary}
        </p>
      </div>

      <Section title="How it works">
        <ol className={listClass}>
          {guide.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Section>

      {(guide.setup?.length || envNames.length > 0) && (
        <Section title="Set it up">
          {guide.setup?.length ? (
            <ol className={listClass}>
              {guide.setup.map((step) => (
                <li key={step.text}>
                  {step.text}
                  {step.link && (
                    <>
                      {" "}
                      <a
                        href={step.link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-0.5 font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        {step.link.label}
                        <ArrowTopRightOnSquareIcon
                          className="size-3.5"
                          aria-hidden
                        />
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ol>
          ) : null}
          {envNames.length > 0 && (
            <div className="mt-3 rounded-lg bg-gray-50 p-3 ring-1 ring-inset ring-gray-200 dark:bg-gray-800/50 dark:ring-gray-700">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Environment variables
              </p>
              <ul className="mt-1.5 space-y-1">
                {envNames.map((variable) => {
                  const set = Boolean(valueOf(variable));
                  return (
                    <li key={variable} className="flex items-center gap-2">
                      {set ? (
                        <CheckCircleIcon
                          className="size-4 text-emerald-500"
                          aria-hidden
                        />
                      ) : (
                        <ExclamationCircleIcon
                          className="size-4 text-amber-500"
                          aria-hidden
                        />
                      )}
                      <code className="font-mono text-[13px]">{variable}</code>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {set ? "set" : "not set"}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {missing.length > 0 && (
                <button
                  type="button"
                  onClick={onShowEnvironment}
                  className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Set them on the Transaction tab →
                </button>
              )}
            </div>
          )}
        </Section>
      )}

      {!guide.setup?.length && envNames.length === 0 && (
        <Section title="Set it up">
          <p>Nothing to set up — this example only needs the simulator.</p>
        </Section>
      )}

      <Section title="Try it">
        <ul className="space-y-2">
          {guide.scenarios.map((scenario) => (
            <li
              key={scenario.label}
              className="flex items-center gap-3 rounded-lg p-2.5 ring-1 ring-inset ring-gray-200 dark:ring-gray-700"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {scenario.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Expect: {scenario.expect}
                  {scenario.env &&
                    ` · sets ${Object.entries(scenario.env)
                      .map(([key, value]) => `${key}=${value}`)
                      .join(", ")}`}
                </p>
              </div>
              <button
                type="button"
                disabled={running}
                onClick={() => onRunScenario(scenario)}
                className="inline-flex shrink-0 items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60"
              >
                <PlayIcon className="size-3.5" aria-hidden />
                Run
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Run fills in the Transaction tab and shows the outcome in Results.
        </p>
      </Section>

      {guide.notes?.length ? (
        <Section title="Good to know">
          <ul className="list-disc space-y-1.5 pl-5 marker:text-gray-400">
            {guide.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      <details className="group rounded-lg bg-gray-50 p-3 ring-1 ring-inset ring-gray-200 dark:bg-gray-800/50 dark:ring-gray-700">
        <summary className="cursor-pointer text-sm font-semibold text-gray-900 marker:text-gray-400 dark:text-white">
          What happens when you press Run
        </summary>
        <ol
          className={`${listClass} mt-2 text-sm text-gray-700 dark:text-gray-300`}
        >
          {behindTheScenes.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">On a real card:</span> copy the code
          from the Code tab into your card's code in Investec Online, and add
          the same environment variables there.
        </p>
      </details>
    </div>
  );
}
