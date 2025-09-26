import React, { useEffect, useRef, useState } from "react";
import FormButton from "@/src/components/Buttons/FormButtons";

export type FilterOption = { key: string; label: string };

type FilterDropdownProps = {
  title: string;
  open: boolean;
  options: FilterOption[];
  /** Applied filters coming from the parent */
  selected: Record<string, boolean>;
  /** Called ONLY when the Filter button is clicked */
  onApply?: (selected: Record<string, boolean>) => void; // safe optional
  /** Clear the filters (parent + local) */
  onClear: () => void;
  /** Close the popup */
  onClose: () => void;
  /** Anchor for positioning */
  anchorRef: React.RefObject<Element | null>;

  /** (Legacy) ignored, kept only to avoid prop errors if still passed */
  onChange?: (key: string, checked: boolean) => void;
};

const POPUP_WIDTH = 224; // Tailwind w-56
const MARGIN = 6;

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  open,
  options,
  selected,
  onApply,
  onClear,
  onClose,
  anchorRef,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: -9999,
    left: -9999,
  });

  // Local *temporary* selection (do not apply until Filter is clicked)
  const [tempSelected, setTempSelected] = useState<Record<string, boolean>>({});

  // When popup opens, copy parent's applied selection into local temp
  useEffect(() => {
    if (open) setTempSelected(selected);
  }, [open, selected]);

  const updatePosition = () => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const width = popupRef.current?.offsetWidth ?? POPUP_WIDTH;
    const height = popupRef.current?.offsetHeight ?? 200;

    let top = rect.bottom + MARGIN;
    let left = Math.min(
      Math.max(rect.left, MARGIN),
      window.innerWidth - width - MARGIN
    );

    // open upwards if overflow
    if (top + height > window.innerHeight - MARGIN) {
      top = rect.top - height - MARGIN;
    }

    setCoords({ top, left });
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const handle = () => updatePosition();
    window.addEventListener("scroll", handle, true);
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle, true);
      window.removeEventListener("resize", handle);
    };
  }, [open]);

  // Close on outside click / Esc
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popupRef.current?.contains(t)) return;
      if (anchorRef.current?.contains(t as Node)) return;
      onClose();
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={popupRef}
      style={{ position: "fixed", top: coords.top, left: coords.left }}
      className="w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-3 z-[9999]"
    >
      {/* Header with title + close icon */}
      <div className="flex items-center justify-between mb-2">
        <p className="px-1 text-xs font-medium text-gray-500">
          Filter by {title}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Checkboxes -> update ONLY local temp state */}
      {options.map((opt) => (
        <label key={opt.key} className="flex items-center gap-2 py-1">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            checked={!!tempSelected[opt.key]}
            onChange={(e) =>
              setTempSelected((prev) => ({
                ...prev,
                [opt.key]: e.target.checked,
              }))
            }
          />
          <span className="text-sm text-gray-700 font-dmsans">{opt.label}</span>
        </label>
      ))}

      {/* Footer: Clear + Filter */}
      <div className="mt-3 flex gap-2 justify-end">
        <FormButton
          variant="light"
          label="Clear"
          onClick={() => {
            setTempSelected({});
            onClear();
          }}
          className="!px-3 !py-1.5 !text-xs"
        />
        <FormButton
          variant="dark"
          label="Filter"
          onClick={() => {
            onApply?.(tempSelected); // apply only now
            onClose();
          }}
          className="!px-3 !py-1.5 !text-xs"
        />
      </div>
    </div>
  );
};

export default FilterDropdown;
