import React, { useId } from "react";
import type { TextareaHTMLAttributes } from "react";

export type TextAreaFieldProps = {
  label?: string;
  id?: string;
  name?: string;
  className?: string;
  rows?: number;
  placeholder?: string;
} & Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className" | "id" | "name"
>;

export default function TextAreaField({
  label = "Textarea",
  id,
  name = "textarea",
  placeholder = "Enter text",
  className = "",
  rows = 4,
  ...rest
}: TextAreaFieldProps) {
  const autoId = useId();
  const inputId = id ?? `${name || "field"}-${autoId}`;

  return (
    <div className={["w-full", className].join(" ")}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 font-dmsans"
        >
          {label}
        </label>
      )}
      <div className="mt-2">
        <textarea
          id={inputId}
          name={name}
          placeholder={placeholder}
          rows={rows}
          className={[
            "block w-full rounded-md bg-white px-3 py-1.5",
            "text-base placeholder:text-gray-400 font-dmsans text-gray-900",
            "outline-1 outline-gray-300 focus:outline-2 focus:outline-blue-500",
            "sm:text-sm/6 resize-y",
          ].join(" ")}
          {...rest}
        />
      </div>
    </div>
  );
}
