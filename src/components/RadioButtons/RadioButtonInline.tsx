import { useEffect, useId, useState } from "react";

export type RadioOption = { id: string; label: string };
export type RadioButtonInlineProps = {
  name?: string;
  options?: RadioOption[];
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
  required?: boolean;
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
  onChange,
  required,
}: RadioButtonInlineProps) {
  const autoName = useId();
  const groupName = name ?? `rbi-${autoName}`;
  const [value, setValue] = useState<string>(defaultValue);

  // Sync defaultValue with internal state
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <fieldset className={["max-w-2xl", className].join(" ")}>
      <div className="space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-2 gap-2">
        {options.map((opt) => (
          <label
            key={opt.id}
            htmlFor={`rbi-${groupName}-${opt.id}`}
            className="flex items-center cursor-pointer select-none"
          >
            <input
              id={`rbi-${groupName}-${opt.id}`}
              type="radio"
              name={groupName}
              value={opt.id}
              checked={value === opt.id}
              onChange={() => {
                setValue(opt.id);
                onChange?.(opt.id);
              }}
              required={required}
              className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white 
                         before:absolute before:inset-1 before:rounded-full before:bg-white 
                         not-checked:before:hidden 
                         checked:border-accent checked:bg-accent 
                         focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent 
                         disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 
                         forced-colors:appearance-auto forced-colors:before:hidden"
            />
            <span className="ml-1 block text-base font-normal leading-6 tracking-normal text-gray-600">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
