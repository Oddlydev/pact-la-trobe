import Head from "next/head";
import { useState } from "react";
import Layout from "@/src/components/Layout";
import InputField from "@/src/components/InputFields/InputFields";
import VerifyPhoneModal from "@/src/components/Modal/VerifyPhoneModal";
import ChangePasswordModal from "@/src/components/Modal/ChangePasswordModal";

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M5.44771 13.2189L13.219 5.44771C13.5824 5.08421 13.7642 4.90247 13.8614 4.7064C14.0462 4.33337 14.0462 3.8954 13.8614 3.52236C13.7642 3.3263 13.5824 3.14455 13.219 2.78105C12.8554 2.41755 12.6737 2.2358 12.4776 2.13864C12.1046 1.95379 11.6666 1.95379 11.2936 2.13864C11.0975 2.2358 10.9158 2.41755 10.5523 2.78105L2.78105 10.5523C2.39567 10.9376 2.20299 11.1303 2.10149 11.3753C2 11.6203 2 11.8929 2 12.4379V13.9999H3.56209C4.1071 13.9999 4.3796 13.9999 4.62463 13.8985C4.86965 13.797 5.06234 13.6043 5.44771 13.2189Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 14H12"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.66675 3.66699L12.3334 6.33366"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProfilePage() {
  const [editingField, setEditingField] = useState<"phone" | null>(null);
  const [phone, setPhone] = useState("+61 7 3344 2211");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleSave = (field: "phone") => {
    if (field === "phone") {
      setShowVerifyModal(true);
    }
  };

  const handleVerify = (code: string) => {
    console.log("Verification code entered:", code);
    setShowVerifyModal(false);
    setEditingField(null);
  };

  const handlePasswordUpdate = (
    current: string,
    newPass: string,
    confirm: string
  ) => {
    console.log("Password change request:", { current, newPass, confirm });
    setShowPasswordModal(false);
  };

  return (
    <>
      <Head>
        <title>User Profile – Dashboard</title>
      </Head>

      <Layout>
        <div>
          <div className="border border-white rounded-xl bg-[rgba(0,0,0,0.00)] p-6 mb-6">
            <h1 className="mb-1 text-3xl font-black leading-9 tracking-tighter text-gray-800">
              Account Information
            </h1>
            <p className="mb-9 text-gray-500 text-base leading-6 tracking-normal">
              Manage your contact information and security settings
            </p>

            <div>
              {/* User ID */}
              <div className="mb-3.5 flex items-center gap-1">
                <p className="text-sm font-medium text-gray-700 leading-5">
                  User ID :
                </p>
                <p className="text-gray-500 text-sm leading-5 font-normal">
                  NU134436
                </p>
              </div>

              {/* Phone Number Row */}
              <div className="mb-4 flex items-end gap-3">
                <div className="flex-1">
                  <InputField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    readOnly={editingField !== "phone"}
                  />
                </div>
                {editingField === "phone" ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSave("phone")}
                      className="rounded-full bg-black text-sm text-white font-medium hover:bg-gray-800 w-[72px] h-9 flex items-center justify-center leading-3.5"
                    >
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M3.33325 9.33301L5.66659 11.6663L12.6666 4.33301"
                            stroke="white"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>{" "}
                        Save
                      </div>
                    </button>
                    <button
                      onClick={() => setEditingField(null)}
                      className="rounded-full border border-black p-2.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M12 4L4.00054 11.9995M11.9995 12L4 4.00057"
                          stroke="black"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingField("phone")}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black hover:bg-gray-800"
                  >
                    <EditIcon />
                  </button>
                )}
              </div>

              {/* Password Row */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    defaultValue="********"
                    readOnly
                  />
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black hover:bg-gray-800"
                >
                  <EditIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="rounded-xl border border-white background: rgba(0, 0, 0, 0.00) p-4 ">
            <div className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M9.3544 1.74767C8.40825 1.27691 7.25045 1 6 1C4.74955 1 3.59175 1.27691 2.64558 1.74767C2.18159 1.97853 1.94959 2.09396 1.7248 2.45689C1.5 2.81983 1.5 3.17124 1.5 3.87407V5.61855C1.5 8.46025 3.77118 10.0402 5.0865 10.7169C5.45335 10.9056 5.63675 11 6 11C6.36325 11 6.54665 10.9056 6.91345 10.7169C8.2288 10.0402 10.5 8.46025 10.5 5.61855V3.87407C10.5 3.17124 10.5 2.81983 10.2752 2.45689C10.0504 2.09396 9.8184 1.97853 9.3544 1.74767Z"
                  stroke="#374151"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>{" "}
              <div className="flex flex-col">
                <span className="text-gray-700 text-xs font-semibold leading-4">
                  Security Notice:
                </span>
                <span className="text-gray-500 text-xs leading-4 font-normal">
                  {" "}
                  Changes to your phone number require SMS verification.
                  Password changes will log you out of all other devices for
                  security.
                </span>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      {/* Verify Phone Modal */}
      <VerifyPhoneModal
        phone={phone}
        open={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onVerify={handleVerify}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onUpdate={handlePasswordUpdate}
      />
    </>
  );
}
