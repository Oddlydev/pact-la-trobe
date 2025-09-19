import React, { useRef, useState, useMemo } from "react";
import type { InputHTMLAttributes } from "react";

type DatePickerFieldProps = {
  label?: string;
  id?: string;
  name?: string;
  className?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "id" | "name" | "value" | "defaultValue" | "type"
>;

export default function DatePickerField({
  label = "Date",
  id,
  name = "date",
  className = "",
  value,
  defaultValue,
  placeholder,
  ...rest
}: DatePickerFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const handleIconClick = () => {
    inputRef.current?.showPicker?.(); // chromium
    inputRef.current?.focus(); // fallback
  };

  const base = useMemo(() => {
    return [
      "block w-full rounded-md bg-white px-3 py-2",
      "text-base placeholder:text-gray-500 placeholder:text-sm placeholder:font-normal",
      "outline-1 -outline-offset-1",
      "font-dmsans text-gray-900",
      focused
        ? "outline-blue-500 focus:outline-blue-500"
        : "outline-gray-300 focus:outline-blue-500",
      "sm:text-sm sm:leading-6",
    ].join(" ");
  }, [focused]);

  return (
    <div className={["w-full", className].join(" ")}>
      {label && (
        <label
          htmlFor={id ?? name}
          className="block text-sm font-medium text-gray-700 font-dmsans"
        >
          {label}
        </label>
      )}

      <div className="mt-1 relative">
        <input
          ref={inputRef}
          id={id ?? name}
          name={name}
          type="date"
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${base} pr-10`}
          {...rest}
        />

        {/* Custom calendar icon */}
        <span
          onClick={handleIconClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 2C5.44772 2 5 2.44772 5 3V4H4C2.89543 4 2 4.89543 2 6V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V6C18 4.89543 17.1046 4 16 4H15V3C15 2.44772 14.5523 2 14 2C13.4477 2 13 2.44772 13 3V4H7V3C7 2.44772 6.55228 2 6 2ZM6 7C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H14C14.5523 9 15 8.55228 15 8C15 7.44772 14.5523 7 14 7H6Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
