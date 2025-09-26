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
    country: "AU", // default country
    dob: "",
    gender: "male",
  });

  // GraphQL mutation hook
  const [createPatient, { loading, error }] = useMutation(CREATE_PATIENT, {
    client,
  });

  if (!open) return null;

  const handleChange = (name: string, value: any) => {
    let safeValue = value;

    if (value && typeof value === "object" && "target" in value) {
      safeValue = (value as any).target.value;
    }
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
            phone: `${formData.country} ${formData.phone}`, // combine country + phone
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

            {/* Phone field with country selector */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 leading-5"
              >
                Phone Number
              </label>
              <div className="mt-1 flex rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-1 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-gray-300">
                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e)}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-500 focus:outline-1 focus:-outline-offset-2 focus:outline-gray-300 sm:text-sm/6"
                  >
                    <option value="AU">AU</option>
                    <option value="US">US</option>
                    <option value="CA">CA</option>
                    <option value="EU">EU</option>
                  </select>
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    />
                  </svg>
                </div>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e)}
                  placeholder="123-456-7890"
                  className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-normal text-gray-500 placeholder:text-gray-500 placeholder:font-normal focus:outline-none sm:text-sm/6"
                />
              </div>
            </div>

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
