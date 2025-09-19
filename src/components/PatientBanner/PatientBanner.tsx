import React from "react";

type Risk = "LOW RISK" | "MODERATE" | "HIGH" | "CRITICAL";

export type PatientBannerProps = {
  patientId?: string;
  name?: string;
  age?: string;
  dob?: string;
  gender?: string;
  location?: string;
  risk?: Risk;
  latestReportAt?: string; // already formatted string
  latestReportBy?: string;
  className?: string;
};

const RiskPill: React.FC<{ label: Risk }> = ({ label }) => {
  const styles: Record<Risk, string> = {
    "LOW RISK": "bg-green-600 text-gray-900 ring-1 ring-green-900/40",
    MODERATE: "bg-amber-400 text-gray-900 ring-1 ring-amber-900/30",
    HIGH: "bg-orange-400 text-gray-900 ring-1 ring-orange-900/30",
    CRITICAL: "bg-red-600 text-white ring-1 ring-red-900/40",
  };
  return (
    <span
      className={[
        "px-3 py-1 rounded-md text-xs font-semibold uppercase",
        styles[label],
      ].join(" ")}
    >
      {label}
    </span>
  );
};

export default function PatientBanner({
  patientId = "PT000000",
  name = "Reginald Christensen",
  age = "00",
  dob = "1999 MAR 22",
  gender = "Woman",
  location = "Lorem ipsum dolor",
  risk = "LOW RISK",
  latestReportAt = "2025 NOV 17 | 00:00",
  latestReportBy = "Lorem ipsum",
  className = "",
}: PatientBannerProps) {
  return (
    <div className={["w-full", className].join(" ")}>
      <div className="rounded-xl bg-black p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M5.66667 12C6.87567 10.6975 9.11133 10.6362 10.3333 12M9.29373 8C9.29373 8.7364 8.71253 9.33333 7.9956 9.33333C7.27867 9.33333 6.69747 8.7364 6.69747 8C6.69747 7.2636 7.27867 6.66667 7.9956 6.66667C8.71253 6.66667 9.29373 7.2636 9.29373 8Z"
                stroke="white"
                strokeLinecap="round"
              />
              <path
                d="M6.33333 2.66797C4.57041 2.67454 3.62734 2.73618 3.01675 3.31463C2.33333 3.96208 2.33333 5.00413 2.33333 7.08827V10.2461C2.33333 12.3303 2.33333 13.3723 3.01675 14.0197C3.70017 14.6672 4.80011 14.6672 7 14.6672H9C11.1999 14.6672 12.2998 14.6672 12.9833 14.0197C13.6667 13.3723 13.6667 12.3303 13.6667 10.2461V7.08827C13.6667 5.00413 13.6667 3.96208 12.9833 3.31463C12.3727 2.73618 11.4296 2.67454 9.66667 2.66797"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.51477 2.42109C6.57873 2.14455 6.61072 2.00628 6.67213 1.89336C6.81527 1.63031 7.0792 1.43699 7.39427 1.36447C7.52953 1.33333 7.6864 1.33333 8 1.33333C8.3136 1.33333 8.47047 1.33333 8.60573 1.36447C8.9208 1.43699 9.18473 1.6303 9.32787 1.89336C9.38927 2.00628 9.42127 2.14455 9.4852 2.42109L9.54073 2.66117C9.6542 3.15163 9.71093 3.39685 9.62533 3.58549C9.56993 3.70767 9.47547 3.81228 9.354 3.88607C9.1664 4 8.88827 4 8.33207 4H7.66793C7.11173 4 6.8336 4 6.64601 3.88607C6.52451 3.81228 6.43007 3.70767 6.37465 3.58549C6.28907 3.39685 6.34579 3.15163 6.45924 2.66117L6.51477 2.42109Z"
                stroke="white"
              />
            </svg>
            <span className="text-base text-white font-normal leading-6 tracking-normal">
              {patientId}
            </span>
          </div>
          <RiskPill label={risk} />
        </div>

        <div className="text-white mt-2 text-2xl font-semibold leading-6 tracking-normal">
          {name}
        </div>

        <div className="mt-7 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="relative inline-flex h-14 w-14 flex-col items-center justify-center rounded-full border border-gray-600 ">
                <span className="text-lg font-semibold text-white tracking-tight">
                  {age}
                </span>
                <span className="text-sm leading-5 tracking-normal font-normal text-zinc-400">
                  Age
                </span>
              </span>
              <div></div>
            </div>

            <div className="h-8 w-px bg-gray-300 rounded-full" />

            <div>
              <div className="text-base text-zinc-200 font-semibold leading-6 tracking-normal">
                {dob}
              </div>
              <div className="text-sm font-normal leading-5 tracking-normal text-zinc-400">
                Date of Birth
              </div>
            </div>

            <div className="h-8 w-px bg-gray-300 rounded-full" />

            <div>
              <div className="text-zinc-200 font-semibold leading-6 tracking-normal">
                {gender}
              </div>
              <div className="text-sm font-normal leading-5 tracking-normal text-zinc-400">
                Gender
              </div>
            </div>

            <div className="h-8 w-px bg-gray-300 rounded-full" />

            <div>
              <div className="text-zinc-200 font-semibold leading-6 tracking-normal">
                {location}
              </div>
              <div className="text-sm font-normal leading-5 tracking-normal text-zinc-400">
                Last Known Location
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-zinc-400 font-normal leading-6 tracking-normal">
              Latest Report
            </div>
            <div className="text-base text-zinc-200 font-semibold tracking-normal leading-6">
              {latestReportAt}
            </div>
            <div className="text-sm text-zinc-400 font-normal leading-6 tracking-normal">
              By {latestReportBy}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
