// src/components/Patients/PatientGrid.tsx
import React from "react";
import PatientCard, { RiskLevel } from "../Cards/PatientCard";

export type Patient = {
  name: string;
  age: number;
  gender: "M" | "F";
  risks: string[];
  score: number;
  riskLevel: RiskLevel;
};

type Props = {
  patients: Patient[];
};

export default function PatientGrid({ patients }: Props) {
  return (
    <div className="pb-4">
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {patients.map((p, i) => (
          <PatientCard id={""} key={i} {...p} />
        ))}
      </div>
    </div>
  );
}
