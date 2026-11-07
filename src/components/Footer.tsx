const REPO = "https://github.com/devinpearson/investec-blockly";

/** States that this is a community project, not an Investec product. */
export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-2 text-center text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
      A community project — not made, endorsed or supported by Investec.{" "}
      <a
        href={REPO}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-gray-700 underline underline-offset-2 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      >
        Source on GitHub
      </a>
    </footer>
  );
}
