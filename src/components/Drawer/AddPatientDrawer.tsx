"use client";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import client from "@/lib/apolloClient";
import InputField from "@/src/components/Forms/InputFields";
import TextAreaField from "@/src/components/Forms/TextArea";
import DatePickerField from "@/src/components/Forms/DatePicker";
import RadioButtonInline from "@/src/components/RadioButtons/RadioButtonInline";
import FormButton from "@/src/components/Buttons/FormButtons";

// Comprehensive list of international country calling codes (E.164 primary allocations)
// Displayed as codes only to match current UI; names provided in title for accessibility.
const COUNTRY_CALLING_CODES: { code: string; name: string }[] = [
  { code: "+1", name: "USA/Canada and NANP" },
  { code: "+7", name: "Russia/Kazakhstan" },
  { code: "+20", name: "Egypt" },
  { code: "+27", name: "South Africa" },
  { code: "+30", name: "Greece" },
  { code: "+31", name: "Netherlands" },
  { code: "+32", name: "Belgium" },
  { code: "+33", name: "France" },
  { code: "+34", name: "Spain" },
  { code: "+36", name: "Hungary" },
  { code: "+39", name: "Italy" },
  { code: "+40", name: "Romania" },
  { code: "+41", name: "Switzerland" },
  { code: "+43", name: "Austria" },
  { code: "+44", name: "United Kingdom" },
  { code: "+45", name: "Denmark" },
  { code: "+46", name: "Sweden" },
  { code: "+47", name: "Norway" },
  { code: "+48", name: "Poland" },
  { code: "+49", name: "Germany" },
  { code: "+51", name: "Peru" },
  { code: "+52", name: "Mexico" },
  { code: "+53", name: "Cuba" },
  { code: "+54", name: "Argentina" },
  { code: "+55", name: "Brazil" },
  { code: "+56", name: "Chile" },
  { code: "+57", name: "Colombia" },
  { code: "+58", name: "Venezuela" },
  { code: "+60", name: "Malaysia" },
  { code: "+61", name: "Australia" },
  { code: "+62", name: "Indonesia" },
  { code: "+63", name: "Philippines" },
  { code: "+64", name: "New Zealand" },
  { code: "+65", name: "Singapore" },
  { code: "+66", name: "Thailand" },
  { code: "+81", name: "Japan" },
  { code: "+82", name: "South Korea" },
  { code: "+84", name: "Vietnam" },
  { code: "+86", name: "China" },
  { code: "+90", name: "Turkey" },
  { code: "+91", name: "India" },
  { code: "+92", name: "Pakistan" },
  { code: "+93", name: "Afghanistan" },
  { code: "+94", name: "Sri Lanka" },
  { code: "+95", name: "Myanmar" },
  { code: "+98", name: "Iran" },
  { code: "+211", name: "South Sudan" },
  { code: "+212", name: "Morocco/Western Sahara" },
  { code: "+213", name: "Algeria" },
  { code: "+216", name: "Tunisia" },
  { code: "+218", name: "Libya" },
  { code: "+220", name: "Gambia" },
  { code: "+221", name: "Senegal" },
  { code: "+222", name: "Mauritania" },
  { code: "+223", name: "Mali" },
  { code: "+224", name: "Guinea" },
  { code: "+225", name: "Côte d’Ivoire" },
  { code: "+226", name: "Burkina Faso" },
  { code: "+227", name: "Niger" },
  { code: "+228", name: "Togo" },
  { code: "+229", name: "Benin" },
  { code: "+230", name: "Mauritius" },
  { code: "+231", name: "Liberia" },
  { code: "+232", name: "Sierra Leone" },
  { code: "+233", name: "Ghana" },
  { code: "+234", name: "Nigeria" },
  { code: "+235", name: "Chad" },
  { code: "+236", name: "Central African Republic" },
  { code: "+237", name: "Cameroon" },
  { code: "+238", name: "Cape Verde" },
  { code: "+239", name: "São Tomé and Príncipe" },
  { code: "+240", name: "Equatorial Guinea" },
  { code: "+241", name: "Gabon" },
  { code: "+242", name: "Congo" },
  { code: "+243", name: "DR Congo" },
  { code: "+244", name: "Angola" },
  { code: "+245", name: "Guinea-Bissau" },
  { code: "+246", name: "British Indian Ocean Territory" },
  { code: "+247", name: "Ascension Island" },
  { code: "+248", name: "Seychelles" },
  { code: "+249", name: "Sudan" },
  { code: "+250", name: "Rwanda" },
  { code: "+251", name: "Ethiopia" },
  { code: "+252", name: "Somalia" },
  { code: "+253", name: "Djibouti" },
  { code: "+254", name: "Kenya" },
  { code: "+255", name: "Tanzania" },
  { code: "+256", name: "Uganda" },
  { code: "+257", name: "Burundi" },
  { code: "+258", name: "Mozambique" },
  { code: "+260", name: "Zambia" },
  { code: "+261", name: "Madagascar" },
  { code: "+262", name: "Réunion/Mayotte" },
  { code: "+263", name: "Zimbabwe" },
  { code: "+264", name: "Namibia" },
  { code: "+265", name: "Malawi" },
  { code: "+266", name: "Lesotho" },
  { code: "+267", name: "Botswana" },
  { code: "+268", name: "Eswatini" },
  { code: "+269", name: "Comoros" },
  { code: "+290", name: "Saint Helena/Tristan da Cunha" },
  { code: "+291", name: "Eritrea" },
  { code: "+297", name: "Aruba" },
  { code: "+298", name: "Faroe Islands" },
  { code: "+299", name: "Greenland" },
  { code: "+350", name: "Gibraltar" },
  { code: "+351", name: "Portugal" },
  { code: "+352", name: "Luxembourg" },
  { code: "+353", name: "Ireland" },
  { code: "+354", name: "Iceland" },
  { code: "+355", name: "Albania" },
  { code: "+356", name: "Malta" },
  { code: "+357", name: "Cyprus" },
  { code: "+358", name: "Finland/Åland" },
  { code: "+359", name: "Bulgaria" },
  { code: "+370", name: "Lithuania" },
  { code: "+371", name: "Latvia" },
  { code: "+372", name: "Estonia" },
  { code: "+373", name: "Moldova" },
  { code: "+374", name: "Armenia" },
  { code: "+375", name: "Belarus" },
  { code: "+376", name: "Andorra" },
  { code: "+377", name: "Monaco" },
  { code: "+378", name: "San Marino" },
  { code: "+380", name: "Ukraine" },
  { code: "+381", name: "Serbia" },
  { code: "+382", name: "Montenegro" },
  { code: "+383", name: "Kosovo" },
  { code: "+385", name: "Croatia" },
  { code: "+386", name: "Slovenia" },
  { code: "+387", name: "Bosnia and Herzegovina" },
  { code: "+389", name: "North Macedonia" },
  { code: "+420", name: "Czech Republic" },
  { code: "+421", name: "Slovakia" },
  { code: "+423", name: "Liechtenstein" },
  { code: "+500", name: "Falkland Islands" },
  { code: "+501", name: "Belize" },
  { code: "+502", name: "Guatemala" },
  { code: "+503", name: "El Salvador" },
  { code: "+504", name: "Honduras" },
  { code: "+505", name: "Nicaragua" },
  { code: "+506", name: "Costa Rica" },
  { code: "+507", name: "Panama" },
  { code: "+508", name: "Saint Pierre and Miquelon" },
  { code: "+509", name: "Haiti" },
  { code: "+590", name: "Guadeloupe/St. Martin/St. Barth" },
  { code: "+591", name: "Bolivia" },
  { code: "+592", name: "Guyana" },
  { code: "+593", name: "Ecuador" },
  { code: "+594", name: "French Guiana" },
  { code: "+595", name: "Paraguay" },
  { code: "+596", name: "Martinique" },
  { code: "+597", name: "Suriname" },
  { code: "+598", name: "Uruguay" },
  { code: "+599", name: "Curaçao/Caribbean Netherlands" },
  { code: "+670", name: "Timor-Leste" },
  { code: "+672", name: "Australian External Territories" },
  { code: "+673", name: "Brunei" },
  { code: "+674", name: "Nauru" },
  { code: "+675", name: "Papua New Guinea" },
  { code: "+676", name: "Tonga" },
  { code: "+677", name: "Solomon Islands" },
  { code: "+678", name: "Vanuatu" },
  { code: "+679", name: "Fiji" },
  { code: "+680", name: "Palau" },
  { code: "+681", name: "Wallis and Futuna" },
  { code: "+682", name: "Cook Islands" },
  { code: "+683", name: "Niue" },
  { code: "+685", name: "Samoa" },
  { code: "+686", name: "Kiribati" },
  { code: "+687", name: "New Caledonia" },
  { code: "+688", name: "Tuvalu" },
  { code: "+689", name: "French Polynesia" },
  { code: "+690", name: "Tokelau" },
  { code: "+691", name: "Micronesia" },
  { code: "+692", name: "Marshall Islands" },
  { code: "+800", name: "International Freephone Service" },
  { code: "+808", name: "Shared Cost Service" },
  { code: "+850", name: "North Korea" },
  { code: "+852", name: "Hong Kong" },
  { code: "+853", name: "Macau" },
  { code: "+855", name: "Cambodia" },
  { code: "+856", name: "Laos" },
  { code: "+870", name: "Inmarsat SNAC" },
  { code: "+880", name: "Bangladesh" },
  { code: "+886", name: "Taiwan" },
  { code: "+888", name: "Humanitarian (OCHA)" },
  { code: "+960", name: "Maldives" },
  { code: "+961", name: "Lebanon" },
  { code: "+962", name: "Jordan" },
  { code: "+963", name: "Syria" },
  { code: "+964", name: "Iraq" },
  { code: "+965", name: "Kuwait" },
  { code: "+966", name: "Saudi Arabia" },
  { code: "+967", name: "Yemen" },
  { code: "+968", name: "Oman" },
  { code: "+970", name: "Palestine" },
  { code: "+971", name: "United Arab Emirates" },
  { code: "+972", name: "Israel" },
  { code: "+973", name: "Bahrain" },
  { code: "+974", name: "Qatar" },
  { code: "+975", name: "Bhutan" },
  { code: "+976", name: "Mongolia" },
  { code: "+977", name: "Nepal" },
  { code: "+992", name: "Tajikistan" },
  { code: "+993", name: "Turkmenistan" },
  { code: "+994", name: "Azerbaijan" },
  { code: "+995", name: "Georgia" },
  { code: "+996", name: "Kyrgyzstan" },
  { code: "+998", name: "Uzbekistan" },
];

// National significant number length rules for common dialing codes.
// Fallback applied when not listed.
const PHONE_LENGTH_RULES: Record<string, { min: number; max: number }> = {
  "+1": { min: 10, max: 10 }, // NANP
  "+44": { min: 10, max: 10 },
  "+61": { min: 9, max: 9 },
  "+81": { min: 9, max: 10 },
  "+82": { min: 9, max: 10 },
  "+86": { min: 11, max: 11 },
  "+90": { min: 10, max: 11 },
  "+91": { min: 10, max: 10 },
  "+92": { min: 10, max: 10 },
  "+94": { min: 9, max: 9 }, // Sri Lanka
  "+971": { min: 9, max: 9 },
  "+972": { min: 8, max: 9 },
  "+973": { min: 8, max: 8 },
  "+974": { min: 8, max: 8 },
  "+975": { min: 7, max: 8 },
  "+976": { min: 8, max: 8 },
  "+977": { min: 8, max: 10 },
};
const DEFAULT_PHONE_RULE = { min: 6, max: 12 };

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
      const rule = PHONE_LENGTH_RULES[formData.countryCode] || DEFAULT_PHONE_RULE;
      const digits = String(safeValue ?? "")
        .replace(/\D/g, "")
        .slice(0, rule.max);
      setFormData((prev) => ({ ...prev, phone: digits }));
      if (!digits.length) {
        setPhoneError(null);
      } else if (digits.length < rule.min || digits.length > rule.max) {
        setPhoneError(
          rule.min === rule.max
            ? `Phone number must be ${rule.min} digits for the selected country.`
            : `Phone number must be between ${rule.min}-${rule.max} digits for the selected country.`
        );
      } else {
        setPhoneError(null);
      }
      return;
    }

    if (name === "countryCode") {
      const newCode = String(safeValue);
      const rule = PHONE_LENGTH_RULES[newCode] || DEFAULT_PHONE_RULE;
      setFormData((prev) => {
        const trimmed = (prev.phone || "").slice(0, rule.max);
        return { ...prev, countryCode: newCode, phone: trimmed };
      });
      const currentLen = (formData.phone || "").slice(0, rule.max).length;
      if (currentLen === 0) {
        setPhoneError(null);
      } else if (currentLen < rule.min || currentLen > rule.max) {
        setPhoneError(
          rule.min === rule.max
            ? `Phone number must be ${rule.min} digits for the selected country.`
            : `Phone number must be between ${rule.min}-${rule.max} digits for the selected country.`
        );
      } else {
        setPhoneError(null);
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: safeValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rule = PHONE_LENGTH_RULES[formData.countryCode] || DEFAULT_PHONE_RULE;
    if (
      formData.phone.length < rule.min ||
      formData.phone.length > rule.max
    ) {
      setPhoneError(
        rule.min === rule.max
          ? `Phone number must be ${rule.min} digits for the selected country.`
          : `Phone number must be between ${rule.min}-${rule.max} digits for the selected country.`
      );
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
                  className="w-20 rounded-l-md border-0 bg-transparent py-1.5 pl-3 text-base text-gray-400 placeholder:font-normal font-normal focus:outline-none focus:ring-0 sm:text-sm"
                >
                  {COUNTRY_CALLING_CODES.map(({ code, name }) => (
                    <option key={code} value={code} title={name}>
                      {code}
                    </option>
                  ))}
                </select>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e)}
                  placeholder="Enter phone number"
                  inputMode="numeric"
                  pattern="[0-9]*"
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
