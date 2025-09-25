import React, { useState } from "react";
import InputField from "@/src/components/Forms/InputFields";
import TextAreaField from "@/src/components/Forms/TextArea";
import DatePickerField from "@/src/components/Forms/DatePicker";
import RadioButtonInline from "@/src/components/RadioButtons/RadioButtonInline";
import FormButton from "@/src/components/Buttons/FormButtons";
import ConfirmUpdateModal from "@/src/components/Modal/ConfirmUpdateModal";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function EditPatientDrawer({ open, onClose }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  if (!open && !confirmOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Drawer (hidden when confirm modal is open) */}
      {open && !confirmOpen && (
        <>
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-[rgba(17,24,39,0.75)]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            className={`
              absolute right-0 top-2.5 bottom-2.5
              w-full max-w-md
              transform transition-transform duration-500 ease-in-out
              ${open ? "translate-x-0" : "translate-x-full"}
              bg-white shadow-xl
              rounded-lg mr-2.5
            `}
          >
            <form className="flex h-full flex-col divide-y divide-gray-300 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gray-900 p-6 flex items-start justify-between rounded-t-lg">
                <div>
                  <h2 className="text-base font-semibold text-white leading-7 mb-1">
                    Edit Patient
                  </h2>
                  <p className="text-gray-300 text-sm font-normal leading-5">
                    Update patient information for La Trobe Age Care Center
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-200 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                <div className="gap-1">
                  <p className="text-sm text-gray-900 font-dmsans font-medium leading-5">
                    Patient ID :{" "}
                    <span className="text-sm text-gray-500 font-dmsans font-medium leading-5">
                      PT134436
                    </span>
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="First name"
                    name="firstName"
                    placeholder="Enter first name"
                  />
                  <InputField
                    label="Last name"
                    name="lastName"
                    placeholder="Enter last name"
                  />
                </div>

                <TextAreaField
                  label="Address"
                  name="address"
                  rows={2}
                  placeholder="Enter address"
                />

                <InputField
                  label="Phone"
                  name="phone"
                  type="tel"
                  placeholder="+61 3 9876 5432"
                  validate={(val) =>
                    val && !/^\+?\d[\d\s-]+$/.test(val)
                      ? "Invalid phone number"
                      : undefined
                  }
                  showErrorOn="blur"
                />

                <DatePickerField label="Date of Birth" name="dob" />

                <div>
                  <label className="block text-sm font-medium text-slate-700 font-dmsans mb-2">
                    Gender
                  </label>
                  <RadioButtonInline
                    name="gender"
                    options={[
                      { id: "male", label: "Man" },
                      { id: "female", label: "Woman" },
                      { id: "na", label: "Prefer not to answer" },
                    ]}
                    defaultValue="male"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 rounded-b-lg bg-gray-50">
                <FormButton variant="light" label="Cancel" onClick={onClose} />
                <FormButton
                  variant="dark"
                  label="Update"
                  onClick={() => {
                    setConfirmOpen(true);
                    onClose();
                  }}
                />
              </div>
            </form>
          </div>
        </>
      )}

      {/* Confirm Update Modal */}
      <ConfirmUpdateModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          onClose();
        }}
        onConfirm={(reason) => {
          console.log("Update confirmed with note:", reason);
          setConfirmOpen(false);
          onClose();
        }}
      />
    </div>
  );
}
