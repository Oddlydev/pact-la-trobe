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
    country: "AU",
  });

  useEffect(() => {
    const fetchPatient = async () => {
      if (!open || !patientId) return;
      try {
        const resp = await fetch(`/api/patients/${patientId}`);
        const json = await resp.json();
        if (resp.ok && json?.ok) {
          setInitial(json.data);

          // try splitting phone into country + number
          if (json.data.phone) {
            const parts = json.data.phone.split(" ");
            if (parts.length > 1) {
              setFormData({
                country: parts[0],
                phone: parts.slice(1).join(" "),
              });
            } else {
              setFormData({ country: "AU", phone: json.data.phone });
            }
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
    setFormData((prev) => ({ ...prev, [name]: safeValue }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!patientId) return;
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
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-gray-300 sm:text-sm/6"
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
                      className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-500 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                  </div>
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
