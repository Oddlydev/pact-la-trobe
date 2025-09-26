import { useState } from "react";
import FormButton from "@/src/components/Buttons/FormButtons";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (current: string, newPass: string, confirm: string) => void;
}

export default function ChangePasswordModal({
  open,
  onClose,
  onUpdate,
}: ChangePasswordModalProps) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,24,39,0.75)]">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-blue-100 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18.7088 3.49534C16.8165 2.55382 14.5009 2 12 2C9.4991 2 7.1835 2.55382 5.29116 3.49534C4.36318 3.95706 3.89919 4.18792 3.4496 4.91378C3 5.63965 3 6.34248 3 7.74814V11.2371C3 16.9205 7.54236 20.0804 10.173 21.4338C10.9067 21.8113 11.2735 22 12 22C12.7265 22 13.0933 21.8113 13.8269 21.4338C16.4576 20.0804 21 16.9205 21 11.2371V7.74814C21 6.34249 21 5.63966 20.5504 4.91378C20.1008 4.18791 19.6368 3.95706 18.7088 3.49534Z"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-dmsans text-lg font-medium text-gray-900 leading-6">
              Change Password
            </h2>
            <p className="mt-2 font-dmsans text-sm text-gray-500 font-normal leading-5">
              Please enter your current password and choose a new secure
              password.
            </p>

            {/* Current Password */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm leading-5 outline-none shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-900 hover:text-gray-700"
                >
                  {showCurrent ? (
                    // Eye-off icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                    >
                      <path
                        d="M2.99172 2.05812L6.12996 5.17146L14.9718 13.9431L18.1117 17.0581M5.62428 6.43812C4.23072 7.47146 3.18492 8.75562 2.60196 9.56729C2.33568 9.99979 2.33568 9.99979 2.33568 9.99979C2.33568 9.99979 2.33568 9.99979 2.33568 9.99979C2.60196 10.4323 3.15636 11.204 5.43864 13.4206C6.74232 14.4306 8.32656 15.2081 10.1057 15.2081C11.3447 15.2081 12.4879 14.8315 13.5102 14.2606M8.42484 9.21562C8.21568 9.75479 8.21568 10.059 8.21568 10.059C8.21568 11.0615 9.03552 11.8748 10.046 11.8748C10.3535 11.8748 10.6424 11.7998 10.8961 11.6681M7.74276 3.92062C8.48028 3.68312 9.27072 3.54146 10.1057 3.54146C12.2653 3.54146 14.1158 4.48396 15.5489 5.59396C16.9828 6.70479 18.0428 8.01646 18.6359 8.84062L18.6804 8.90312C18.8929 9.19646 19.1357 9.53146 19.1357 9.99979C19.1357 10.4681 18.8929 10.8031 18.6804 11.0965L18.6359 11.159C18.2293 11.724 17.6069 12.5131 16.7988 13.309"
                        stroke="#111827"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                    >
                      <path
                        d="M10.3156 3.54199C12.4753 3.54199 14.3258 4.48449 15.7588 5.59449C17.1927 6.70533 18.2528 8.01699 18.8458 8.84116L18.8904 8.90366C19.1029 9.19699 19.3456 9.53199 19.3456 10.0003C19.3456 10.4687 19.1029 10.8037 18.8904 11.097C18.2528 11.9837 17.1927 13.2953 15.7588 14.4062C14.3258 15.5162 12.4753 16.4587 10.3156 16.4587C8.15684 16.4587 6.30548 15.5162 4.87328 14.4062C3.43856 13.2953 2.37932 11.9837 1.78628 11.1595L1.74092 11.097C1.5284 10.8037 1.28564 10.4687 1.28564 10.0003C1.28564 9.53199 1.5284 9.19699 1.74092 8.90366L1.78628 8.84116C2.37932 8.01699 3.43856 6.70533 4.87328 5.59449C6.30548 4.48449 8.15684 3.54199 10.3156 3.54199Z"
                        stroke="#111827"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="10.3156"
                        cy="10.0003"
                        r="3.125"
                        stroke="#111827"
                        strokeWidth="1.5"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm leading-5 outline-none shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-900 hover:text-gray-700"
                >
                  {showNew ? (
                    // Eye-off icon (full)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                    >
                      <path
                        d="M2.99172 2.05812L6.12996 5.17146L14.9718 13.9431L18.1117 17.0581M5.62428 6.43812C4.23072 7.47146 3.18492 8.75562 2.60196 9.56729C2.33568 9.99979 2.33568 9.99979 2.33568 9.99979C2.33568 9.99979 2.33568 9.99979 2.33568 9.99979C2.60196 10.4323 3.15636 11.204 5.43864 13.4206C6.74232 14.4306 8.32656 15.2081 10.1057 15.2081C11.3447 15.2081 12.4879 14.8315 13.5102 14.2606M8.42484 9.21562C8.21568 9.75479 8.21568 10.059 8.21568 10.059C8.21568 11.0615 9.03552 11.8748 10.046 11.8748C10.3535 11.8748 10.6424 11.7998 10.8961 11.6681M7.74276 3.92062C8.48028 3.68312 9.27072 3.54146 10.1057 3.54146C12.2653 3.54146 14.1158 4.48396 15.5489 5.59396C16.9828 6.70479 18.0428 8.01646 18.6359 8.84062L18.6804 8.90312C18.8929 9.19646 19.1357 9.53146 19.1357 9.99979C19.1357 10.4681 18.8929 10.8031 18.6804 11.0965L18.6359 11.159C18.2293 11.724 17.6069 12.5131 16.7988 13.309"
                        stroke="#111827"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    // Eye icon (full)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                    >
                      <path
                        d="M10.3156 3.54199C12.4753 3.54199 14.3258 4.48449 15.7588 5.59449C17.1927 6.70533 18.2528 8.01699 18.8458 8.84116L18.8904 8.90366C19.1029 9.19699 19.3456 9.53199 19.3456 10.0003C19.3456 10.4687 19.1029 10.8037 18.8904 11.097C18.2528 11.9837 17.1927 13.2953 15.7588 14.4062C14.3258 15.5162 12.4753 16.4587 10.3156 16.4587C8.15684 16.4587 6.30548 15.5162 4.87328 14.4062C3.43856 13.2953 2.37932 11.9837 1.78628 11.1595L1.74092 11.097C1.5284 10.8037 1.28564 10.4687 1.28564 10.0003C1.28564 9.53199 1.5284 9.19699 1.74092 8.90366L1.78628 8.84116C2.37932 8.01699 3.43856 6.70533 4.87328 5.59449C6.30548 4.48449 8.15684 3.54199 10.3156 3.54199Z"
                        stroke="#111827"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="10.3156"
                        cy="10.0003"
                        r="3.125"
                        stroke="#111827"
                        strokeWidth="1.5"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm leading-5 outline-none shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-900 hover:text-gray-700"
                >
                  {showConfirm ? (
                    // Eye-off icon (full)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                    >
                      <path
                        d="M2.99172 2.05812L6.12996 5.17146L14.9718 13.9431L18.1117 17.0581M5.62428 6.43812C4.23072 7.47146 3.18492 8.75562 2.60196 9.56729C2.33568 9.99979 2.33568 9.99979 2.33568 9.99979C2.33568 9.99979 2.33568 9.99979 2.33568 9.99979C2.60196 10.4323 3.15636 11.204 5.43864 13.4206C6.74232 14.4306 8.32656 15.2081 10.1057 15.2081C11.3447 15.2081 12.4879 14.8315 13.5102 14.2606M8.42484 9.21562C8.21568 9.75479 8.21568 10.059 8.21568 10.059C8.21568 11.0615 9.03552 11.8748 10.046 11.8748C10.3535 11.8748 10.6424 11.7998 10.8961 11.6681M7.74276 3.92062C8.48028 3.68312 9.27072 3.54146 10.1057 3.54146C12.2653 3.54146 14.1158 4.48396 15.5489 5.59396C16.9828 6.70479 18.0428 8.01646 18.6359 8.84062L18.6804 8.90312C18.8929 9.19646 19.1357 9.53146 19.1357 9.99979C19.1357 10.4681 18.8929 10.8031 18.6804 11.0965L18.6359 11.159C18.2293 11.724 17.6069 12.5131 16.7988 13.309"
                        stroke="#111827"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    // Eye icon (full)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                    >
                      <path
                        d="M10.3156 3.54199C12.4753 3.54199 14.3258 4.48449 15.7588 5.59449C17.1927 6.70533 18.2528 8.01699 18.8458 8.84116L18.8904 8.90366C19.1029 9.19699 19.3456 9.53199 19.3456 10.0003C19.3456 10.4687 19.1029 10.8037 18.8904 11.097C18.2528 11.9837 17.1927 13.2953 15.7588 14.4062C14.3258 15.5162 12.4753 16.4587 10.3156 16.4587C8.15684 16.4587 6.30548 15.5162 4.87328 14.4062C3.43856 13.2953 2.37932 11.9837 1.78628 11.1595L1.74092 11.097C1.5284 10.8037 1.28564 10.4687 1.28564 10.0003C1.28564 9.53199 1.5284 9.19699 1.74092 8.90366L1.78628 8.84116C2.37932 8.01699 3.43856 6.70533 4.87328 5.59449C6.30548 4.48449 8.15684 3.54199 10.3156 3.54199Z"
                        stroke="#111827"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="10.3156"
                        cy="10.0003"
                        r="3.125"
                        stroke="#111827"
                        strokeWidth="1.5"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-4">
          <FormButton variant="light" label="Cancel" onClick={onClose} />
          <FormButton
            variant="dark"
            label="Update Password"
            onClick={() => onUpdate(current, newPass, confirm)}
          />
        </div>
      </div>
    </div>
  );
}
