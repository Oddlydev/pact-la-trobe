"use client";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import client from "@/lib/apolloClient";
import InputField from "@/src/components/Forms/InputFields";
import TextAreaField from "@/src/components/Forms/TextArea";
import DatePickerField from "@/src/components/Forms/DatePicker";
import RadioButtonInline from "@/src/components/RadioButtons/RadioButtonInline";
import FormButton from "@/src/components/Buttons/FormButtons";

// GraphQL mutation for wp_patients
const CREATE_PATIENT = gql`
  mutation CreatePatient($input: CreatePatientInput!) {
    createPatient(input: $input) {
      patient {
        id
        firstName
        lastName
        address
        phone
        dob
        gender
      }
    }
  }
`;

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddPatientDrawer({ open, onClose }: Props) {
  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    dob: "",
    gender: "male",
  });

  // GraphQL mutation hook
  const [createPatient, { loading, error }] = useMutation(CREATE_PATIENT, {
    client,
  });

  if (!open) return null;

  // Normalize and update state
  const handleChange = (name: string, value: any) => {
    let safeValue = value;

    // If it's an event, get its target.value
    if (value && typeof value === "object" && "target" in value) {
      safeValue = (value as any).target.value;
    }

    // If it's still an object, stringify it
    if (typeof safeValue === "object" && safeValue !== null) {
      safeValue = String(safeValue);
    }

    setFormData((prev) => ({ ...prev, [name]: safeValue }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting formData:", formData);

      await createPatient({
        variables: {
          input: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            phone: formData.phone,
            dob: formData.dob,
            gender: formData.gender,
          },
        },
      });

      onClose();
    } catch (err) {
      console.error("Error creating patient", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[rgba(17,24,39,0.75)]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <form
          className="flex h-full flex-col divide-y divide-gray-300"
          onSubmit={handleSubmit}
        >
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
                onChange={(e: any) => handleChange("firstName", e)}
              />
              <InputField
                label="Last name"
                name="lastName"
                placeholder="Enter last name"
                onChange={(e: any) => handleChange("lastName", e)}
              />
            </div>

            <TextAreaField
              label="Address"
              name="address"
              rows={2}
              placeholder="Enter address"
              onChange={(e: any) => handleChange("address", e)}
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
              onChange={(e: any) => handleChange("phone", e)}
            />

            <DatePickerField
              label="Date of Birth"
              name="dob"
              onChange={(val: any) => handleChange("dob", val)}
            />

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
                onChange={(val: string) => handleChange("gender", val)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4">
            <FormButton variant="light" label="Cancel" onClick={onClose} />
            <FormButton
              variant="dark"
              type="submit"
              label={loading ? "Saving..." : "Save"}
            />
          </div>

          {error && (
            <p className="text-red-500 px-6 py-2">Error: {error.message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
