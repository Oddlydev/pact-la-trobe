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

  useEffect(() => {
    const fetchPatient = async () => {
      if (!open || !patientId) return;
      try {
        const resp = await fetch(`/api/patients/${patientId}`);
        const json = await resp.json();
        if (resp.ok && json?.ok) setInitial(json.data);
      } catch {}
    };
    fetchPatient();
  }, [open, patientId]);

  if (!open && !confirmOpen) return null;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!patientId) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      firstName: String(fd.get("firstName") || "").trim(),
      lastName: String(fd.get("lastName") || "").trim(),
      address: String(fd.get("address") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
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
      if (!resp.ok || !data?.ok) throw new Error(data?.error || "Failed to update");
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
          <div className="absolute inset-0 bg-[rgba(17,24,39,0.75)]" onClick={onClose} aria-hidden="true" />
          <div className="absolute right-0 top-0 h-full w-full max-w-md transform transition-transform duration-500 ease-in-out bg-white shadow-xl">
            <form className="flex h-full flex-col divide-y divide-gray-300" onSubmit={handleSubmit}>
              <div className="bg-gray-900 p-6 flex items-start justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">Edit Patient</h2>
                  <p className="text-gray-300 text-sm font-normal leading-5">Update patient information for La Trobe Age Care Center</p>
                </div>
                <button type="button" onClick={onClose} className="text-indigo-200 hover:text-white">×</button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                <div className="gap-1">
                  <p className="text-sm text-gray-900 font-dmsans font-medium leading-5">
                    Patient ID : <span className="text-sm text-gray-500 font-dmsans font-medium leading-5">{patientId || "—"}</span>
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="First name" name="firstName" placeholder="Enter first name" defaultValue={initial?.firstName} required />
                  <InputField label="Last name" name="lastName" placeholder="Enter last name" defaultValue={initial?.lastName} required />
                </div>

                <TextAreaField label="Address" name="address" rows={2} placeholder="Enter address" defaultValue={initial?.address} />

                <InputField
                  label="Phone"
                  name="phone"
                  type="tel"
                  placeholder="+61 3 9876 5432"
                  validate={(val) => (val && !/^\+?\d[\d\s-]+$/.test(val) ? "Invalid phone number" : undefined)}
                  showErrorOn="blur"
                  defaultValue={initial?.phone}
                />

                <DatePickerField label="Date of Birth" name="dob" defaultValue={initial?.dob || undefined} required />

                <div>
                  <label className="block text-sm font-medium text-slate-700 font-dmsans mb-2">Gender</label>
                  <RadioButtonInline
                    name="gender"
                    options={[
                      { id: "male", label: "Man" },
                      { id: "female", label: "Woman" },
                      { id: "na", label: "Prefer not to answer" },
                    ]}
                    defaultValue={
                      initial?.gender?.toLowerCase?.() === "f" || initial?.gender?.toLowerCase?.() === "female"
                        ? "female"
                        : initial?.gender?.toLowerCase?.() === "male" || initial?.gender?.toLowerCase?.() === "m"
                          ? "male"
                          : "na"
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4">
                <FormButton variant="light" label="Cancel" onClick={onClose} />
                <FormButton variant="dark" label="Update" type="submit" />
              </div>
            </form>
          </div>
        </>
      )}

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
