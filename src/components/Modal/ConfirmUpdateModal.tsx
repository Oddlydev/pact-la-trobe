import React, { useState } from "react";
import FormButton from "@/src/components/Buttons/FormButtons";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm?: (reason: string) => void;
};

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
}: Props) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-[rgba(17,24,39,0.75)]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-96 rounded-xl bg-white shadow-xl">
        <div className="p-6">
          <div className="text-center">
            <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5 13L9 17L19 7"
                  stroke="#16A34A"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div className="mt-5 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 leading-6">
                Patient Updated
              </h2>
              <p className="mt-2 text-sm leading-5 text-gray-500">
                All changes to patient details have been applied successfully.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-center">
              <FormButton
                variant="dark"
                label="Go back to dashboard"
                className="!bg-gray-800 shadow-sm text-sm py-2.5 px-4  leading-5 border-transparent text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
