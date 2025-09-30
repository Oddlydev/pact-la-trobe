"use client";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import client from "@/lib/apolloClient";
import InputField from "@/src/components/Forms/InputFields";
import TextAreaField from "@/src/components/Forms/TextArea";
import DatePickerField from "@/src/components/Forms/DatePicker";
import RadioButtonInline from "@/src/components/RadioButtons/RadioButtonInline";
import FormButton from "@/src/components/Buttons/FormButtons";

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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    countryCode: "+61", // default dialing code
    dob: "",
    gender: "male",
  });

  const [phoneError, setPhoneError] = useState<string | null>(null);

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

    if (name === "phone") {
      const digits = String(safeValue ?? "")
        .replace(/\D/g, "")
        .slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digits }));
      if (!digits.length) {
        setPhoneError(null);
      } else if (digits.length < 10) {
        setPhoneError("Phone number must be 10 digits.");
      } else {
        setPhoneError(null);
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: safeValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      setPhoneError("Phone number must be 10 digits.");
      return;
    }
    try {
      await createPatient({
        variables: {
          input: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            phone: `${formData.countryCode} ${formData.phone}`, // combine code + number
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

            {/* Phone field with dialing code selector */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 leading-5"
              >
                Phone Number
              </label>
              <div className="mt-1 flex rounded-md bg-white border border-gray-300">
                <select
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={(e) => handleChange("countryCode", e)}
                  className="w-16 rounded-l-md border-0 bg-transparent py-1.5 pl-3 text-base text-gray-400 placeholder:font-normal font-normal focus:outline-none focus:ring-0 sm:text-sm"
                >
                  <option value="+61">+61</option> {/* Australia */}
                  <option value="+1">+1</option> {/* US/Canada */}
                  <option value="+44">+44</option> {/* UK */}
                  <option value="+91">+91</option> {/* India */}
                  <option value="+81">+81</option> {/* Japan */}
                </select>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e)}
                  placeholder="123-456-7890"
                  inputMode="numeric"
                  aria-invalid={Boolean(phoneError)}
                  aria-describedby={phoneError ? "phone-helper" : undefined}
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-2 pr-3 text-base text-gray-900 placeholder:text-gray-400 placeholder:font-normal font-normal focus:outline-none focus:ring-0 sm:text-sm"
                />
              </div>
              {phoneError && (
                <p id="phone-helper" className="mt-1 text-sm text-red-600">
                  {phoneError}
                </p>
              )}
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
