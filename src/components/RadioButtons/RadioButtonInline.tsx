import { useId, useState } from "react";

export type RadioOption = { id: string; label: string };
export type RadioButtonInlineProps = {
  name?: string;
  options?: RadioOption[];
  defaultValue?: string;
  className?: string;
};

export default function RadioButtonInline({
  name,
  options = [
    { id: "yes", label: "Yes" },
    { id: "no", label: "No" },
    { id: "unclear", label: "Unclear" },
  ],
  defaultValue = "no",
  className = "",
}: RadioButtonInlineProps) {
  const autoName = useId();
  const groupName = name ?? `rbi-${autoName}`;
  const [value, setValue] = useState<string>(defaultValue);

  return (
    <fieldset className={["max-w-2xl", className].join(" ")}>
      <div className="space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-2 gap-2">
        {options.map((opt) => (
          <div key={opt.id} className="flex items-center">
            <input
              id={`rbi-${opt.id}`}
              type="radio"
              name={groupName}
              checked={value === opt.id}
              onChange={() => setValue(opt.id)}
              className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white 
                         before:absolute before:inset-1 before:rounded-full before:bg-white 
                         not-checked:before:hidden 
                         checked:border-accent checked:bg-accent 
                         focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent 
                         disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 
                         forced-colors:appearance-auto forced-colors:before:hidden"
            />
            <label
              htmlFor={`rbi-${opt.id}`}
              className="ml-1 block text-base font-normal leading-6 tracking-normal text-gray-600"
            >
              {opt.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
