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
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FEE2E2] p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 text-[#DC2626]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  d="M12 9V11M12 15H12.01M5.07 19H18.93C20.47 19 21.43 17.33 20.66 16L13.73 4C12.96 2.67 11.04 2.67 10.27 4L3.34 16C2.57 17.33 3.53 19 5.07 19Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Confirm Deletion
              </h2>
              <p className="mt-2 text-sm leading-5 text-gray-500">
                This action will remove the patient from active records. A
                secure archived copy will remain available for review.
              </p>

              {/* Input */}
              <div className="py-4">
                <label className="block text-sm font-medium text-gray-700 leading-5">
                  Reason for deletion
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <FormButton
              variant="light"
              label="Keep Patient"
              onClick={onClose}
            />
            <FormButton
              variant="dark"
              label="Delete & Archive"
              onClick={() => {
                if (onConfirm) onConfirm(reason);
                onClose();
              }}
              className="!bg-red-600 hover:!bg-red-700 border-transparent text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
