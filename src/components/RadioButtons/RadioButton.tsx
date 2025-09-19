import { useId, useState } from "react";

export type RadioOption = { id: string; label: string };
export type RadioButtonProps = {
  name?: string;
  options?: RadioOption[];
  defaultValue?: string;
  className?: string;
};

export default function RadioButton({
  name,
  options = [
    { id: "opt-1", label: "Lorem" },
    { id: "opt-2", label: "Lorem" },
  ],
  defaultValue,
  className = "",
}: RadioButtonProps) {
  const autoName = useId();
  const groupName = name ?? `rb-${autoName}`;
  const [value, setValue] = useState<string>(
    defaultValue ?? options[0]?.id ?? ""
  );

  return (
    <fieldset className={["max-w-md", className].join(" ")}>
      <div className="space-y-2.5">
        {options.map((opt) => (
          <div key={opt.id} className="flex items-center">
            <input
              id={opt.id}
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
              htmlFor={opt.id}
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
