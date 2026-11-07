import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  ClipboardIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { SIMULATOR_URL, checkSimulator } from "../lib/simulator";

type Props = {
  open: boolean;
  onClose: () => void;
};

const SERVER_REPO = "https://github.com/devinpearson/investec-card-server";

type Status = "checking" | "connected" | "unreachable";

function Command({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked; the command can be selected by hand.
    }
  }
  return (
    <div className="mt-1.5 flex items-start gap-2 rounded-md bg-gray-900 px-3 py-2 text-gray-100 dark:bg-black/40">
      <code className="min-w-0 flex-1 whitespace-pre-wrap break-all font-mono text-[13px]">
        {children}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy command"}
        className="shrink-0 rounded p-0.5 text-gray-400 hover:text-white"
      >
        {copied ? (
          <CheckIcon className="size-4 text-emerald-400" aria-hidden />
        ) : (
          <ClipboardIcon className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}

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

const link =
  "inline-flex items-center gap-0.5 font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400";

/** What the simulator is, how a run works, and how to start the server. */
export function AboutDialog({ open, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("checking");

  const check = useCallback(async () => {
    setStatus("checking");
    setStatus((await checkSimulator()) ? "connected" : "unreachable");
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      element.showModal();
      void check();
    } else if (!open && element.open) {
      element.close();
    }
  }, [open, check]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="about-title"
      // Esc, or a click on the backdrop, closes it.
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto w-[min(40rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-hidden rounded-xl bg-white p-0 text-gray-900 shadow-2xl ring-1 ring-black/5 backdrop:bg-gray-950/60 dark:bg-gray-900 dark:text-gray-100 dark:ring-white/10"
    >
      <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
        <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-indigo-600 text-white">
            <CreditCardIcon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="about-title" className="text-base font-semibold">
              Programmable Card Simulator
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Build and test Investec card code with blocks
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <XMarkIcon className="size-5" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <Section title="What this is">
            <p>
              Investec's programmable card runs your own JavaScript every time
              the card is used. <strong>Before</strong> a purchase you get the
              live details — amount, merchant, category, country, time — and
              decide to approve or decline it. <strong>After</strong> it, you
              can record it or send a notification.
            </p>
            <p className="mt-2">
              This simulator lets you build that code from blocks and try it
              against made-up purchases before it goes near a real card. It
              never touches a real account or card.
            </p>
          </Section>

          <Section title="How a run works">
            <ol className="list-decimal space-y-1.5 pl-5 marker:text-gray-400">
              <li>Your blocks become JavaScript — the Code tab shows it.</li>
              <li>
                Run sends the code, the purchase from the Transaction tab and
                your environment variables to{" "}
                <strong>investec-card-server</strong> on your computer.
              </li>
              <li>
                The server runs the code in a sandbox with the same functions
                and globals as the card (console, fetch, moment and
                process.env), and sends what it logged back to the Results tab.
              </li>
            </ol>
          </Section>

          <Section title="Start the server">
            <div
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                status === "connected"
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300"
                  : status === "unreachable"
                    ? "bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200"
                    : "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
              role="status"
            >
              <span
                className={`size-2 shrink-0 rounded-full ${
                  status === "connected"
                    ? "bg-emerald-500"
                    : status === "unreachable"
                      ? "bg-amber-500"
                      : "animate-pulse bg-gray-400"
                }`}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                {status === "connected" &&
                  `Connected to ${SIMULATOR_URL} — you're ready to run.`}
                {status === "unreachable" &&
                  `Can't reach ${SIMULATOR_URL} — start the server below.`}
                {status === "checking" && `Checking ${SIMULATOR_URL}…`}
              </span>
              <button
                type="button"
                onClick={() => void check()}
                disabled={status === "checking"}
                className="inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/10"
              >
                <ArrowPathIcon className="size-3.5" aria-hidden />
                Check again
              </button>
            </div>

            <ol className="mt-4 list-decimal space-y-3 pl-5 marker:text-gray-400">
              <li>
                Install{" "}
                <a
                  href="https://nodejs.org"
                  target="_blank"
                  rel="noreferrer"
                  className={link}
                >
                  Node.js
                  <ArrowTopRightOnSquareIcon className="size-3.5" aria-hidden />
                </a>{" "}
                22 or newer.
              </li>
              <li>
                Get{" "}
                <a
                  href={SERVER_REPO}
                  target="_blank"
                  rel="noreferrer"
                  className={link}
                >
                  investec-card-server
                  <ArrowTopRightOnSquareIcon className="size-3.5" aria-hidden />
                </a>
                :
                <Command>{`git clone ${SERVER_REPO}.git\ncd investec-card-server`}</Command>
              </li>
              <li>
                Install, build and start it:
                <Command>{"npm install\nnpm run build && npm start"}</Command>
              </li>
              <li>
                Leave it running. It listens on{" "}
                <code className="font-mono">http://localhost:3010</code> — then
                press Run here.
              </li>
            </ol>

            <p className="mt-4">
              <strong>Or with Docker</strong>, from the server's folder:
            </p>
            <Command>
              {
                "docker build -t card-server .\ndocker run -it -p 3010:3010 card-server"
              }
            </Command>

            <p className="mt-4">
              <strong>Different address?</strong> Set{" "}
              <code className="font-mono">PORT</code> in the server's{" "}
              <code className="font-mono">.env</code>, and{" "}
              <code className="font-mono">VITE_SIMULATOR_URL</code> in this
              project's <code className="font-mono">.env.local</code>, then
              restart this app. It currently uses{" "}
              <code className="font-mono">{SIMULATOR_URL}</code>.
            </p>

            <div className="mt-4 flex gap-2 rounded-lg bg-amber-50 p-3 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
              <ExclamationTriangleIcon
                className="mt-0.5 size-4 shrink-0"
                aria-hidden
              />
              <p>
                <strong>For your own computer only.</strong> Card code's fetch
                can reach your machine and local network, and the server accepts
                requests from any website — don't deploy it or expose it to the
                internet.
              </p>
            </div>
          </Section>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-5 py-3 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Reopen this any time with About in the header.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get started
          </button>
        </div>
      </div>
    </dialog>
  );
}
