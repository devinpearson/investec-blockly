import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import type { Toast } from "../hooks/useToasts";

const icons = {
  success: <CheckCircleIcon className="size-5 text-emerald-500" aria-hidden />,
  error: <ExclamationCircleIcon className="size-5 text-red-500" aria-hidden />,
  info: (
    <InformationCircleIcon className="size-5 text-indigo-500" aria-hidden />
  ),
};

type Props = { toasts: Toast[]; onDismiss: (id: number) => void };

export function Toasts({ toasts, onDismiss }: Props) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.tone === "error" ? "alert" : "status"}
          className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg bg-white p-3 text-sm text-gray-900 shadow-lg ring-1 ring-black/5 dark:bg-gray-800 dark:text-gray-100 dark:ring-white/10"
        >
          {icons[toast.tone]}
          <p className="min-w-0 flex-1">{toast.message}</p>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => onDismiss(toast.id)}
            className="rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <XMarkIcon className="size-5" aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}
