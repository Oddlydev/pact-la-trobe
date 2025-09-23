import React, { useState } from "react";
import PrimaryButton from "../Buttons/PrimaryButtons";
import AddPatientDrawer from "@/src/components/Drawer/AddPatientDrawer";

export default function Topbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="w-full bg-[rgba(171,190,194,0.10)] shadow-[inset_0_0_50px_0_rgba(171,190,194,0.10)]">
      {/* Topbar content */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left greeting */}
        <div className="text-2xl font-light">
          Hi, <span className="text-2xl font-bold">Thompson Robert</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <PrimaryButton
            variant="dark"
            label="Add Patient"
            iconType="addPatient"
            onClick={() => setAddOpen(true)}
          />

          {/* Divider */}
          <div className="h-8 w-px bg-gray-300"></div>

          {/* Date + Time */}
          <div>
            <div className="text-zinc-900 font-semibold text-sm">
              2025 DEC 23
            </div>
            <div className="text-zinc-500 font-normal text-xs">02:57 PM</div>
          </div>

          {/* User Icon */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white font-bold"
            >
              T
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className=" absolute right-0 z-50 mt-2 w-56 flex flex-col items-start gap-3.5 py-3.5 pl-3.5 pr-6 rounded-lg bg-zinc-100 shadow-[0_4px_4px_0_rgba(0,0,0,0.25),_0_0_8px_0_rgba(171,190,194,0.10)_inset] text-black text-sm font-medium">
                <a
                  href="#"
                  className="flex items-center gap-1.5 w-full hover:bg-gray-100 rounded"
                >
                  {/* Site Management Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M11.6666 17.5H13.3333M11.6666 17.5C10.9763 17.5 10.4166 16.9403 10.4166 16.25V14.1667H9.99996M11.6666 17.5H8.33329M9.99996 14.1667H9.58329V16.25C9.58329 16.9403 9.02363 17.5 8.33329 17.5M9.99996 14.1667V17.5M8.33329 17.5H6.66663"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.3333 2.50002H6.66663C4.3096 2.50002 3.13109 2.50002 2.39886 3.23225C1.66663 3.96448 1.66663 5.14299 1.66663 7.50002V9.16668C1.66663 11.5237 1.66663 12.7022 2.39886 13.4344C3.13109 14.1667 4.3096 14.1667 6.66663 14.1667H13.3333C15.6903 14.1667 16.8688 14.1667 17.601 13.4344C18.3333 12.7022 18.3333 11.5237 18.3333 9.16668V7.50002C18.3333 5.14299 18.3333 3.96448 17.601 3.23225C16.8688 2.50002 15.6903 2.50002 13.3333 2.50002Z"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.99988 10V11.25M9.99988 10C10.614 10 11.1506 9.66776 11.4397 9.17326M9.99988 10C9.38571 10 8.84913 9.66776 8.56004 9.17326M11.4397 9.17326L12.4999 9.79167M11.4397 9.17326C11.584 8.92659 11.6665 8.63967 11.6665 8.33334C11.6665 8.02704 11.584 7.74005 11.4397 7.49341M8.56004 9.17326L7.49988 9.79167M8.56004 9.17326C8.41579 8.92667 8.33321 8.63967 8.33321 8.33334C8.33321 8.02704 8.41588 7.74004 8.56004 7.49341M9.99988 6.66667V5.41667M9.99988 6.66667C10.614 6.66667 11.1506 6.99889 11.4397 7.49341M9.99988 6.66667C9.38571 6.66667 8.84913 6.99888 8.56004 7.49341M11.4397 7.49341L12.4999 6.87501M8.56004 7.49341L7.49988 6.87501"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Site Management
                </a>

                <a
                  href="#"
                  className="flex items-center gap-1.5 w-full hover:bg-gray-100 rounded  "
                >
                  {/* User Management Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M11.6666 6.25001C11.6666 3.94883 9.80109 2.08334 7.49992 2.08334C5.19874 2.08334 3.33325 3.94883 3.33325 6.25001C3.33325 8.55118 5.19874 10.4167 7.49992 10.4167C9.80109 10.4167 11.6666 8.55118 11.6666 6.25001Z"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.3333 16.25C13.3333 13.0283 10.7216 10.4167 7.49996 10.4167C4.2783 10.4167 1.66663 13.0283 1.66663 16.25"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.8333 10.8333V12.0833M15.8333 10.8333C16.4474 10.8333 16.984 10.5011 17.2731 10.0066M15.8333 10.8333C15.2191 10.8333 14.6825 10.5011 14.3934 10.0066M17.2731 10.0066L18.3333 10.625M17.2731 10.0066C17.4173 9.75993 17.4999 9.47302 17.4999 9.16668C17.4999 8.86035 17.4173 8.57335 17.2731 8.32676M14.3934 10.0066L13.3333 10.625M14.3934 10.0066C14.2492 9.76002 14.1666 9.47302 14.1666 9.16668C14.1666 8.86035 14.2493 8.57335 14.3934 8.32676M15.8333 7.50002V6.25002M15.8333 7.50002C16.4474 7.50002 16.984 7.83223 17.2731 8.32676M15.8333 7.50002C15.2191 7.50002 14.6825 7.83222 14.3934 8.32676M17.2731 8.32676L18.3333 7.70835M14.3934 8.32676L13.3333 7.70835"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  User Management
                </a>

                <a
                  href="/user-profile/"
                  className="flex items-center gap-1.5 w-full hover:bg-gray-100 rounded  "
                >
                  {/* Profile Management Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M17.7646 5.95116L17.3533 5.23732C17.0422 4.69746 16.8867 4.42754 16.622 4.3199C16.3574 4.21226 16.058 4.2972 15.4595 4.46706L14.4426 4.75348C14.0605 4.84161 13.6595 4.79161 13.3105 4.61232L13.0298 4.45035C12.7305 4.25869 12.5004 3.97611 12.373 3.64395L12.0947 2.8128C11.9117 2.26278 11.8202 1.98777 11.6024 1.83047C11.3846 1.67317 11.0953 1.67317 10.5166 1.67317H9.58762C9.00904 1.67317 8.71971 1.67317 8.50187 1.83047C8.28408 1.98777 8.19259 2.26278 8.00961 2.8128L7.73131 3.64395C7.60391 3.97611 7.37375 4.25869 7.07451 4.45035L6.79378 4.61232C6.44482 4.79161 6.04386 4.84161 5.66169 4.75348L4.64483 4.46706C4.04621 4.2972 3.74691 4.21226 3.48226 4.3199C3.21761 4.42754 3.06208 4.69746 2.751 5.23732L2.33968 5.95116C2.04809 6.4572 1.90229 6.71022 1.93059 6.97957C1.95888 7.24892 2.15406 7.46598 2.54442 7.9001L3.40362 8.86066C3.61362 9.1265 3.76271 9.58983 3.76271 10.0064C3.76271 10.4232 3.61367 10.8863 3.40365 11.1522L2.54442 12.1128C2.15406 12.547 1.95889 12.764 1.93059 13.0334C1.90229 13.3027 2.04809 13.5557 2.33968 14.0617L2.75099 14.7756C3.06206 15.3154 3.21761 15.5854 3.48226 15.693C3.74691 15.8007 4.04622 15.7157 4.64485 15.5458L5.66166 15.2594C6.0439 15.1712 6.44493 15.2213 6.79393 15.4007L7.07462 15.5627C7.3738 15.7543 7.60391 16.0368 7.73129 16.369L8.00961 17.2002C8.19259 17.7502 8.28408 18.0252 8.50187 18.1826C8.71971 18.3398 9.00904 18.3398 9.58762 18.3398H10.5166C11.0953 18.3398 11.3846 18.3398 11.6024 18.1826C11.8202 18.0252 11.9117 17.7502 12.0947 17.2002L12.373 16.369C12.5004 16.0368 12.7305 15.7543 13.0297 15.5627L13.3104 15.4007C13.6594 15.2213 14.0604 15.1712 14.4426 15.2594L15.4595 15.5458C16.058 15.7157 16.3574 15.8007 16.622 15.693C16.8867 15.5854 17.0422 15.3154 17.3533 14.7756L17.7646 14.0617C18.0562 13.5557 18.202 13.3027 18.1737 13.0334C18.1454 12.764 17.9502 12.547 17.5599 12.1128L16.7006 11.1522C16.4906 10.8863 16.3415 10.4232 16.3415 10.0064C16.3415 9.58983 16.4907 9.1265 16.7006 8.86066L17.5599 7.9001C17.9502 7.46598 18.1454 7.24892 18.1737 6.97957C18.202 6.71022 18.0562 6.4572 17.7646 5.95116Z"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7.08325 13.3333C7.66544 12.3269 8.75361 11.6497 9.99994 11.6497C11.2462 11.6497 12.3344 12.3269 12.9166 13.3333M11.6666 7.91668C11.6666 8.83717 10.9204 9.58333 9.99994 9.58333C9.07944 9.58333 8.33328 8.83717 8.33328 7.91668C8.33328 6.99621 9.07944 6.25002 9.99994 6.25002C10.9204 6.25002 11.6666 6.99621 11.6666 7.91668Z"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Profile Management
                </a>

                <a
                  href="#"
                  className="flex items-center gap-1.5 w-full hover:bg-gray-100 rounded  "
                >
                  {/* Logout Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M15.4166 3.667C13.96 2.41991 12.0679 1.66666 9.99996 1.66666C5.39758 1.66666 1.66663 5.39761 1.66663 9.99999C1.66663 14.6023 5.39758 18.3333 9.99996 18.3333C12.0679 18.3333 13.96 17.5801 15.4166 16.333"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 6.66666C15 6.66666 18.3333 9.12166 18.3333 9.99999C18.3333 10.8784 15 13.3333 15 13.3333M17.9167 9.99999H7.5"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*   Indented horizontal line */}
      {/* Drawer */}
      <AddPatientDrawer open={addOpen} onClose={() => setAddOpen(false)} />

      <hr className="border-t border-gray-300 mx-4" />
    </div>
  );
}
