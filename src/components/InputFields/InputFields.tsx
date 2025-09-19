import React, {
  InputHTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";

type ValidationState = "default" | "success" | "warning" | "error";

export type InputFieldProps = {
  label?: string;
  id?: string;
  name?: string;
  className?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  validate?: (value: string) => string | null | undefined;
  showErrorOn?: "blur" | "change";
  state?: ValidationState;
  message?: string;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "id" | "name" | "value" | "defaultValue"
>;

const ErrorIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
    className={`h-5 w-5 text-red-500 ${className}`}
  >
    <path
      d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      clipRule="evenodd"
      fillRule="evenodd"
    />
  </svg>
);

const WarningIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    className={`h-5 w-5 text-yellow-500 ${className}`}
  >
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.591c.75 1.336-.213 2.985-1.743 2.985H3.482c-1.53 0-2.493-1.649-1.743-2.985L8.257 3.1zM11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-2a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 1.5 0v3A.75.75 0 0 1 10 11z"
      clipRule="evenodd"
    />
  </svg>
);

const SuccessIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    className={`h-5 w-5 text-green-500 ${className}`}
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.707a1 1 0 0 0-1.414-1.414L9 10.172 7.707 8.879a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

export default function InputField({
  label = "Label",
  id,
  name = "input",
  type = "text",
  placeholder = "Enter text",
  className = "",
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  validate,
  showErrorOn = "blur",
  state,
  message,
  ...rest
}: InputFieldProps) {
  const inputId = id ?? name ?? "field";

  const [focused, setFocused] = useState(false);
  const [internal, setInternal] = useState(defaultValue ?? "");
  const [validationState, setValidationState] =
    useState<ValidationState>("default");
  const [validationMessage, setValidationMessage] = useState<
    string | undefined
  >(undefined);

  const val = value !== undefined ? value : internal;

  useEffect(() => {
    if (defaultValue !== undefined) setInternal(defaultValue);
  }, [defaultValue]);

  const currentState = state ?? validationState;
  const errMsg =
    message ?? (currentState === "error" ? validationMessage : undefined);

  const base = useMemo(() => {
    let colorClasses = "";
    if (currentState === "error") {
      colorClasses = focused
        ? "text-red-900 outline-red-600 focus:outline-red-600"
        : "text-red-900 outline-red-300 focus:outline-red-600";
    } else if (currentState === "success") {
      colorClasses = focused
        ? "text-green-900 outline-green-600 focus:outline-green-600"
        : "text-green-900 outline-green-300 focus:outline-green-600";
    } else if (currentState === "warning") {
      colorClasses = focused
        ? "text-yellow-900 outline-yellow-600 focus:outline-yellow-600"
        : "text-yellow-900 outline-yellow-300 focus:outline-yellow-600";
    } else {
      colorClasses = focused
        ? "outline-blue-500 focus:outline-blue-500"
        : "outline-gray-300 focus:outline-blue-500";
    }

    return [
      "block w-full rounded-md bg-white px-3 py-2",
      "text-base placeholder:text-gray-400",
      "outline-1 -outline-offset-1",
      "font-dmsans text-gray-900",
      colorClasses,
      "sm:text-sm sm:leading-6",
    ].join(" ");
  }, [focused, currentState]);

  const runValidation = (value: string) => {
    if (validate) {
      const msg = validate(value);
      if (msg) {
        setValidationState("error");
        setValidationMessage(msg);
      } else {
        setValidationState("success");
        setValidationMessage(undefined);
      }
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (value === undefined) setInternal(e.target.value);
    onChange?.(e);
    if (showErrorOn === "change") {
      runValidation(e.target.value);
    }
  };

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
      <div className="mt-1 relative">
        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          aria-invalid={currentState === "error"}
          aria-describedby={errMsg ? `${inputId}-message` : undefined}
          value={val}
          onChange={handleChange}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
            if (showErrorOn === "blur") {
              runValidation(e.target.value);
            }
          }}
          className={[
            base,
            errMsg || currentState !== "default" ? "pr-10" : "",
          ].join(" ")}
          {...rest}
        />

        {/* Icons */}
        {currentState === "error" && (
          <ErrorIcon className="absolute right-3 top-1/2 -translate-y-1/2" />
        )}
        {currentState === "warning" && (
          <WarningIcon className="absolute right-3 top-1/2 -translate-y-1/2" />
        )}
        {currentState === "success" && (
          <SuccessIcon className="absolute right-3 top-1/2 -translate-y-1/2" />
        )}
      </div>
      {errMsg && (
        <p
          id={`${inputId}-message`}
          className={`mt-2 text-sm font-dmsans ${
            currentState === "error"
              ? "text-red-600"
              : currentState === "warning"
                ? "text-yellow-600"
                : "text-green-600"
          }`}
        >
          {errMsg}
        </p>
      )}
    </div>
  );
}
