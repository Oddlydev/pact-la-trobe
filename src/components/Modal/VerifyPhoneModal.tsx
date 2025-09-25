import { useState } from "react";
import InputField from "@/src/components/Forms/InputFields";
import FormButton from "@/src/components/Buttons/FormButtons";

interface VerifyPhoneModalProps {
  phone: string;
  open: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
}

export default function VerifyPhoneModal({
  phone,
  open,
  onClose,
  onVerify,
}: VerifyPhoneModalProps) {
  const [code, setCode] = useState("");

  if (!open) return null;

  // Only allow digits
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // digits only
    setCode(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,24,39,0.75)]">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-blue-100 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M13 7.5L15.5 10L21 4"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.15825 5.71223L8.7556 4.80625C8.49232 4.21388 8.36068 3.91768 8.1638 3.69101C7.91707 3.40694 7.59547 3.19794 7.23567 3.08785C6.94858 3 6.62446 3 5.97621 3C5.02791 3 4.55375 3 4.15573 3.18229C3.68687 3.39702 3.26343 3.86328 3.09473 4.3506C2.95151 4.76429 2.99253 5.18943 3.07458 6.0397C3.94791 15.0902 8.90981 20.0521 17.9603 20.9254C18.8106 21.0075 19.2357 21.0485 19.6494 20.9053C20.1367 20.7366 20.603 20.3131 20.8177 19.8443C21 19.4462 21 18.9721 21 18.0238C21 17.3755 21 17.0514 20.9122 16.7643C20.8021 16.4045 20.5931 16.0829 20.309 15.8362C20.0823 15.6393 19.7861 15.5077 19.1937 15.2444L18.2878 14.8417C17.6462 14.5566 17.3255 14.4141 16.9995 14.3831C16.6876 14.3534 16.3731 14.3972 16.0811 14.5109C15.776 14.6297 15.5063 14.8544 14.967 15.3038C14.4301 15.7512 14.1617 15.9749 13.8337 16.0947C13.543 16.2009 13.1586 16.2403 12.8523 16.1951C12.5069 16.1442 12.2423 16.0029 11.7133 15.7201C10.0672 14.8405 9.15953 13.9328 8.27986 12.2867C7.99714 11.7577 7.85578 11.4931 7.80487 11.1477C7.75974 10.8414 7.79908 10.457 7.9053 10.1663C8.02512 9.83828 8.24881 9.56986 8.69619 9.033C9.14562 8.49368 9.37034 8.22402 9.48915 7.91891C9.60285 7.62694 9.64661 7.3124 9.61694 7.00048C9.58594 6.67452 9.44338 6.35376 9.15825 5.71223Z"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="font-dmsans text-lg font-medium text-gray-900">
              Verify Phone Number
            </h2>
            <p className="mt-2 font-dmsans text-sm text-gray-500">
              We’ve sent a 6-digit verification code to {phone}. Please enter it
              below to confirm your new phone number.
            </p>

            {/* InputField */}
            <div className="mt-4">
              <InputField
                label="Verification Code"
                name="verificationCode"
                type="tel"
                inputMode="numeric"
                placeholder="000 000"
                value={code}
                onChange={handleChange}
                maxLength={6}
                className="text-sm text-gray-700 font-medium leading-5 text-center placeholder:text-center"
              />
              <p className="mt-2 text-center text-xs text-gray-500 leading-4">
                Resend code in 60s
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-4">
          <FormButton variant="light" label="Cancel" onClick={onClose} />
          <FormButton
            variant="dark"
            label="Verify"
            onClick={() => onVerify(code)}
            disabled={code.length !== 6}
          />
        </div>
      </div>
    </div>
  );
}
