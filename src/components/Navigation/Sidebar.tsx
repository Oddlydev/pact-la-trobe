import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const menuItems = [
    {
      label: "Home",
      path: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
        >
          <path
            d="M12.8924 3.25426L21.4876 10.0399C21.8112 10.2954 22 10.6849 22 11.0972C22 11.8413 21.3969 12.4444 20.6528 12.4444H20V15.9444C20 18.7728 20 20.187 19.1213 21.0657C18.2426 21.9444 16.8284 21.9444 14 21.9444H10C7.17157 21.9444 5.75736 21.9444 4.87868 21.0657C4 20.187 4 18.7728 4 15.9444V12.4444H3.34716C2.60315 12.4444 2 11.8413 2 11.0972C2 10.6849 2.1888 10.2954 2.5124 10.0399L11.1076 3.25426C11.3617 3.05359 11.6761 2.94444 12 2.94444C12.3239 2.94444 12.6383 3.05359 12.8924 3.25426Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 21.9444V17.4444C14.5 16.5098 14.5 16.0425 14.299 15.6944C14.1674 15.4664 13.978 15.277 13.75 15.1454C13.4019 14.9444 12.9346 14.9444 12 14.9444C11.0654 14.9444 10.5981 14.9444 10.25 15.1454C10.022 15.277 9.83261 15.4664 9.70096 15.6944C9.5 16.0425 9.5 16.5098 9.5 17.4444V21.9444"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "Patients Management",
      path: "/patient-management",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
        >
          <path
            d="M20 22.4444V19.4444C20 16.616 20 15.2017 19.1213 14.3231C18.2426 13.4444 16.8284 13.4444 14 13.4444H10C7.17157 13.4444 5.75736 13.4444 4.87868 14.3231C4 15.2017 4 16.616 4 19.4444C4 20.3763 4 20.8422 4.15224 21.2097C4.35523 21.6998 4.74458 22.0891 5.23463 22.2921C5.60218 22.4444 6.06812 22.4444 7 22.4444"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 13.4444L12.5 22.4444M7 13.9444V22.4444"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 19.4444H14.5C15.3284 19.4444 16 20.116 16 20.9444C16 21.7728 15.3284 22.4444 14.5 22.4444H12.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.5 6.94441V5.94441C15.5 4.01141 13.933 2.44441 12 2.44441C10.067 2.44441 8.5 4.01141 8.5 5.94441V6.94441C8.5 8.87741 10.067 10.4444 12 10.4444C13.933 10.4444 15.5 8.87741 15.5 6.94441Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "Resources",
      path: "/resources",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
        >
          <path
            d="M19 9.44444V8.26262C19 6.56938 19 5.72276 18.7478 5.04658C18.3424 3.95954 17.4849 3.10209 16.3979 2.69664C15.7217 2.44444 14.8751 2.44444 13.1818 2.44444C10.2186 2.44444 8.73706 2.44444 7.55375 2.88579C5.65142 3.59532 4.15088 5.09586 3.44135 6.99819C3 8.1815 3 9.66309 3 12.6262V15.1717C3 18.241 3 19.7757 3.79783 20.8415C4.02643 21.1469 4.29752 21.418 4.60289 21.6466C5.66867 22.4444 7.20336 22.4444 10.2727 22.4444H11C12.1698 22.4444 14.5 22.4444 14.5 22.4444"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 14.7777H11.8403C12.5019 14.7777 12.8326 14.7777 13.0985 14.952C13.3643 15.1262 13.5122 15.44 13.8081 16.0676L15.4 19.4444L17.6 12.4444L19.1919 15.8212C19.4878 16.4488 19.6357 16.7626 19.9015 16.9368C20.1674 17.1111 20.4981 17.1111 21.1597 17.1111H22"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 12.4444C3 10.6035 4.49238 9.11111 6.33333 9.11111H7.44444C7.9611 9.11111 8.21942 9.11111 8.43137 9.05432C9.00652 8.90021 9.45576 8.45096 9.60988 7.87581C9.66667 7.66386 9.66667 7.40554 9.66667 6.88888V5.77777C9.66667 3.93682 11.1591 2.44444 13 2.44444"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`flex flex-col bg-black text-white h-screen transition-all duration-200 ease-in-out pt-6 px-2.5 ${
        expanded ? "w-60" : "w-16"
      }`}
    >
      {/* Logo / Header */}
      <div className="flex items-center justify-center">
        {!expanded ? (
          <img src="../../../assets/images/sidebar-logo.svg" alt="Logo" />
        ) : (
          <div className="flex flex-col text-left gap-1.5">
            <span className="text-sm font-semibold">La Trobe</span>
            <span className="text-sm font-semibold text-[#E02D2D]">
              Age Care Center
            </span>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col flex-1 gap-1.5 mt-10">
        {menuItems.map((item) => (
          <Link key={item.label} href={item.path}>
            <div
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 cursor-pointer transition-all ${
                expanded ? "justify-start" : "justify-center"
              } ${
                router.pathname === item.path
                  ? "bg-gray-800"
                  : "bg-gray-900 hover:bg-gray-900 hover:ring-2 hover:ring-blue-950"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {expanded && <span className="text-sm">{item.label}</span>}
            </div>
          </Link>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="mt-auto flex flex-col gap-6 px-2.5 py-[10px]">
        {expanded && (
          <div className="flex flex-col items-start self-stretch">
            {/* Name + SVG row */}
            <div className="flex justify-between items-start self-stretch">
              <div className="text-2xl font-medium font-dmsans text-white">
                Thomson Robert
              </div>
              <a href="/user-profile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M14.6666 8C14.6666 11.6819 11.6819 14.6666 8 14.6666C4.3181 14.6666 1.33331 11.6819 1.33331 8C1.33331 4.3181 4.3181 1.33331 8 1.33331C11.6819 1.33331 14.6666 4.3181 14.6666 8Z"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 9.33333V8C10 7.0572 10 6.58579 9.70713 6.29289C9.4142 6 8.9428 6 8 6H6.66667M9.33333 6.66667L6 10"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            {/* Date + Time row */}
            <div className="flex justify-between items-start self-stretch mt-1">
              <div className="text-white text-sm leading-5 font-normal font-dmsans">
                2025 DEC 23
              </div>
              <div
                className="text-white text-sm leading-5 font-normal font-dmsans"
                style={{ fontFeatureSettings: "'dlig' on" }}
              >
                14:57
              </div>
            </div>
          </div>
        )}

        {/* Logout button */}
        <div
          className={`${expanded ? "w-full" : "flex justify-center w-full"}`}
        >
          <button
            onClick={() => alert("Logging out...")} // <-- replace with real logout
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-all duration-200 ${
              expanded ? "justify-start w-full" : "justify-center"
            } bg-gray-900 hover:bg-gray-900 hover:ring-2 hover:ring-blue-950`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
            >
              <path
                d="M18.5 4.4C16.752 2.904 14.482 2 12 2 6.477 2 2 6.477 2 12s4.477 10 10 10c2.482 0 4.752-.904 6.5-2.4"
                stroke="white"
                strokeWidth="1.5"
              />
              <path
                d="M18 8s4 2.946 4 4-4 4-4 4M21.5 12H9"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            {expanded && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
