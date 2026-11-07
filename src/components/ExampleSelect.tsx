type Props = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export function ExampleSelect({ value, options, onChange }: Props) {
  return (
    <>
      <label htmlFor="workspaceName" className="sr-only">
        Workspace
      </label>
      <select
        id="workspaceName"
        name="workspaceName"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </>
  );
}
