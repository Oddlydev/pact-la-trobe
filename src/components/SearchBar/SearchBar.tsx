import React, { useCallback, useMemo, useState } from "react";
type SearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  id?: string;
  name?: string;
};
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search  Patient by name or ID",
  onSubmit,
  disabled,
  className = "",
  inputClassName = "",
  id,
  name,
}: SearchBarProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState("");
  const val = isControlled ? (value as string) : internal;
  const inputId = useMemo(() => id || name || "search-input", [id, name]);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      if (isControlled) {
        onChange?.(next);
      } else {
        setInternal(next);
      }
    },
    [isControlled, onChange]
  );
  const handleClear = useCallback(() => {
    if (isControlled) {
      onChange?.("");
    } else {
      setInternal("");
    }
  }, [isControlled, onChange]);
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit?.(val);
    },
    [onSubmit, val]
  );
  // NEW: Clear value when input is focused
  const handleFocus = useCallback(() => {
    if (val) {
      handleClear();
    }
  }, [val, handleClear]);
  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full ${className}`}
      role="search"
    >
      <label htmlFor={inputId} className="sr-only">
        Search
      </label>
      <div className="flex items-center gap-2 rounded-full bg-brand-2 px-4 py-3 ring-1 ring-zinc-200 focus-within:ring-2 focus-within:ring-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="text-gray-500"
        >
          <path
            d="M11.3333 11.3333L14 14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.6667 7.33333C12.6667 10.0948 10.4272 12.3333 7.66667 12.3333C4.9052 12.3333 2.66667 10.0948 2.66667 7.33333C2.66667 4.57187 4.9052 2.33333 7.66667 2.33333C10.4272 2.33333 12.6667 4.57187 12.6667 7.33333Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          suppressHydrationWarning
          id={inputId}
          name={name}
          type="search"
          value={val}
          onChange={handleChange}
          onFocus={handleFocus} // :point_left: Clears when clicked/focused
          placeholder={placeholder}
          disabled={disabled}
          className={`caret-black block min-w-0 grow  text-sm text-zinc-600 placeholder:text-zinc-400 placeholder:font-dmsans focus:outline-none focus:placeholder-transparent ${inputClassName}`}
        />
        {val && !disabled ? (
          <svg
            onClick={handleClear}
            role="button"
            aria-label="Clear search"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="search-close-icon cursor-pointer rounded text-gray-500 hover:bg-gray-100"
          >
            <path
              d="M10 1.66666C5.40835 1.66666 1.66669 5.40833 1.66669 10C1.66669 14.5917 5.40835 18.3333 10 18.3333C14.5917 18.3333 18.3334 14.5917 18.3334 10C18.3334 5.40833 14.5917 1.66666 10 1.66666ZM12.8 11.9167C13.0417 12.1583 13.0417 12.5583 12.8 12.8C12.675 12.925 12.5167 12.9833 12.3584 12.9833C12.2 12.9833 12.0417 12.925 11.9167 12.8L10 10.8833L8.08335 12.8C7.95835 12.925 7.80002 12.9833 7.64169 12.9833C7.48335 12.9833 7.32502 12.925 7.20002 12.8C6.95835 12.5583 6.95835 12.1583 7.20002 11.9167L9.11669 10L7.20002 8.08333C6.95835 7.84166 6.95835 7.44166 7.20002 7.2C7.44169 6.95833 7.84169 6.95833 8.08335 7.2L10 9.11666L11.9167 7.2C12.1584 6.95833 12.5584 6.95833 12.8 7.2C13.0417 7.44166 13.0417 7.84166 12.8 8.08333L10.8834 10L12.8 11.9167Z"
              fill="#9CA3AF"
            />
          </svg>
        ) : null}
      </div>
    </form>
  );
}
