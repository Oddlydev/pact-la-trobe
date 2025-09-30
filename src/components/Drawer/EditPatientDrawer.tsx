import React, { useEffect, useState } from "react";
import InputField from "@/src/components/Forms/InputFields";
import TextAreaField from "@/src/components/Forms/TextArea";
import DatePickerField from "@/src/components/Forms/DatePicker";
import RadioButtonInline from "@/src/components/RadioButtons/RadioButtonInline";
import FormButton from "@/src/components/Buttons/FormButtons";
import ConfirmUpdateModal from "@/src/components/Modal/ConfirmUpdateModal";

type Props = {
  open: boolean;
  onClose: () => void;
  patientId?: string | null;
};

export default function EditPatientDrawer({ open, onClose, patientId }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [initial, setInitial] = useState<any>(null);

  const [formData, setFormData] = useState({
    phone: "",
    country: "+61", // default to AU dialing code
  });

  const [phoneError, setPhoneError] = useState<string | null>(null);

  const sanitizePhone = (value: string) =>
    value.replace(/\D/g, "").slice(0, 10);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!open || !patientId) return;
      try {
        const resp = await fetch(`/api/patients/${patientId}`);
        const json = await resp.json();
        if (resp.ok && json?.ok) {
          setInitial(json.data);

          // try splitting phone into country code + number
          if (json.data.phone) {
            const rawPhone = String(json.data.phone);
            const parts = rawPhone.trim().split(" ");
            const potentialCode = parts[0] || "";
            const country = potentialCode.startsWith("+")
              ? potentialCode
              : "+61";
            const numberPortion = potentialCode.startsWith("+")
              ? parts.slice(1).join(" ")
              : rawPhone;
            const digits = sanitizePhone(numberPortion);
            setFormData({
              country,
              phone: digits,
            });
            if (!digits.length) {
              setPhoneError(null);
            } else if (digits.length < 10) {
              setPhoneError("Phone number must be 10 digits.");
            } else {
              setPhoneError(null);
            }
          } else {
            setFormData({ country: "+61", phone: "" });
            setPhoneError(null);
          }
        }
      } catch {}
    };
    fetchPatient();
  }, [open, patientId]);

  if (!open && !confirmOpen) return null;

  const handleChange = (name: string, value: any) => {
    let safeValue = value;
    if (value && typeof value === "object" && "target" in value) {
      safeValue = (value as any).target.value;
    }
    if (typeof safeValue === "object" && safeValue !== null) {
      safeValue = String(safeValue);
    }

    if (name === "phone") {
      const digits = sanitizePhone(String(safeValue ?? ""));
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

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!patientId) return;
    if (formData.phone.length !== 10) {
      setPhoneError("Phone number must be 10 digits.");
      return;
    }
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      firstName: String(fd.get("firstName") || "").trim(),
      lastName: String(fd.get("lastName") || "").trim(),
      address: String(fd.get("address") || "").trim(),
      phone: `${formData.country} ${formData.phone}`.trim(),
      dob: String(fd.get("dob") || "") || null,
      gender: String(fd.get("gender") || "") || null,
    };

    try {
      const resp = await fetch(`/api/patients/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok || !data?.ok)
        throw new Error(data?.error || "Failed to update");
      window.dispatchEvent(new Event("patients:reload"));
      setConfirmOpen(true);
    } catch (err) {
      console.error("Update patient failed", err);
      alert("Failed to update patient. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50">
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
            <form
              className="flex h-full flex-col divide-y divide-gray-300 rounded-lg overflow-hidden"
              onSubmit={handleSubmit}
            >
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
                      {patientId || "—"}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="First name"
                    name="firstName"
                    placeholder="Enter first name"
                    defaultValue={initial?.firstName}
                    required
                  />
                  <InputField
                    label="Last name"
                    name="lastName"
                    placeholder="Enter last name"
                    defaultValue={initial?.lastName}
                    required
                  />
                </div>

                <TextAreaField
                  label="Address"
                  name="address"
                  rows={2}
                  placeholder="Enter address"
                  defaultValue={initial?.address}
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
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={(e) => handleChange("country", e)}
                      className="w-16 rounded-l-md border-0 bg-transparent py-1.5 pl-3 text-base text-gray-400 placeholder:font-normal font-normal focus:outline-none focus:ring-0 sm:text-sm"
                    >
                      <option value="+61">+61</option> {/* AU */}
                      <option value="+1">+1</option> {/* US/CA */}
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
                      aria-describedby={
                        phoneError ? "edit-phone-helper" : undefined
                      }
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-2 pr-3 text-base text-gray-900 placeholder:text-gray-400 placeholder:font-normal font-normal focus:outline-none focus:ring-0 sm:text-sm"
                    />
                  </div>
                  {phoneError && (
                    <p
                      id="edit-phone-helper"
                      className="mt-1 text-sm text-red-600"
                    >
                      {phoneError}
                    </p>
                  )}
                </div>

                <DatePickerField
                  label="Date of Birth"
                  name="dob"
                  defaultValue={initial?.dob || undefined}
                  required
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
                    defaultValue={
                      initial?.gender?.toLowerCase?.() === "f" ||
                      initial?.gender?.toLowerCase?.() === "female"
                        ? "female"
                        : initial?.gender?.toLowerCase?.() === "male" ||
                            initial?.gender?.toLowerCase?.() === "m"
                          ? "male"
                          : "na"
                    }
                    required
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 rounded-b-lg bg-gray-50">
                <FormButton variant="light" label="Cancel" onClick={onClose} />
                <FormButton variant="dark" label="Update" type="submit" />
              </div>
            </form>
          </div>
        </>
      )}

      {/* Confirmation modal */}
      <ConfirmUpdateModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          onClose();
        }}
      />
    </div>
  );
}
