import type { ExecutionItem } from "../lib/simulator";

type Props = { items: ExecutionItem[] | null };

export function SimulationOutput({ items }: Props) {
  return (
    <>
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Simulation Response:
      </h2>
      {items?.length ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={item.executionId ?? i}>
              <h3 className="text-sm font-medium text-gray-900">{item.type}</h3>
              <ul className="list-disc pl-4 text-sm text-gray-700">
                {item.logs.map((log, j) => (
                  <li key={j}>
                    {log.level}: {log.content}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">
          ...run simulation to see results
        </p>
      )}
    </>
  );
}
