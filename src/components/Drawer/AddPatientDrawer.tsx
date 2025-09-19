import React from "react";
import InputField from "@/src/components/Forms/InputFields";
import TextAreaField from "@/src/components/Forms/TextArea";
import DatePickerField from "@/src/components/Forms/DatePicker";
import RadioButtonInline from "@/src/components/RadioButtons/RadioButtonInline";
import FormButton from "@/src/components/Buttons/FormButtons";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddPatientDrawer({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[rgba(17,24,39,0.75)]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md transform transition-transform duration-500 ease-in-out bg-white shadow-xl">
        <form className="flex h-full flex-col divide-y divide-gray-300">
          {/* Header */}
          <div className="bg-gray-900 p-6 flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Add New Patient
              </h2>
              <p className="text-gray-300 text-sm font-normal leading-5">
                Register a patient into La Trobe Age Care Center
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-indigo-200 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
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
          <div className="flex justify-end gap-3 px-6 py-4">
            <FormButton variant="light" label="Cancel" onClick={onClose} />
            <FormButton
              variant="dark"
              label="Save"
              onClick={() => {
                // you can handle form submit here
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
