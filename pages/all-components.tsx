import React, { useState } from "react";

// ===============================
//   Indicator Components
// ===============================
import OverallSeverityIndicator from "@/src/components/Indicators/OverallSeverityIndicator";
import DotTableRiskIndicator from "@/src/components/Indicators/DotTableRiskIndicator";
import BannerRiskIndicator from "@/src/components/Indicators/BannerRiskIndicator";

// ===============================
//   UI Controls & Form Elements
// ===============================
import Pagination from "@/src/components/Pagination/Pagination";
import PatientBanner from "@/src/components/Banner/PatientBanner";
import RadioButton from "@/src/components/RadioButtons/RadioButton";
import RadioButtonInline from "@/src/components/RadioButtons/RadioButtonInline";
import SegmentedControls from "@/src/components/SegmentedControls/SegmentedControls";

// Chips
import Chip from "@/src/components/Chips/Chips";

// Search Bar
import SearchBar from "@/src/components/Forms/SearchBar";

// Input Fields
import InputField from "@/src/components/Forms/InputFields";

// ===============================
//   Buttons
// ===============================
import PrimaryButton from "@/src/components/Buttons/PrimaryButtons";
import FormButton from "@/src/components/Buttons/FormButtons";
import ActionButton from "@/src/components/Buttons/ActionButtons";

// ===============================
//   Cards
// ===============================
import ResourcesCard from "@/src/components/Cards/ResourcesCards";
import OverallSeverityCards from "@/src/components/Cards/OverallSeverityCards";
import SummaryCards from "@/src/components/Cards/SummaryCards";
import StatisticsCard from "@/src/components/Cards/StatisticsCard";
import PatientCard from "@/src/components/Cards/PatientCard";
import ActionTriggerCard from "@/src/components/Cards/ActionTriggerCards";

// ===============================
//   Layout
// ===============================
import Layout from "@/src/components/Layout";
import TextAreaField from "@/src/components/Forms/TextArea";
import DatePickerField from "@/src/components/Forms/DatePicker";

// ==========================================================
//  Section Wrapper
// ==========================================================
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="mb-10">
    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
      <span className="inline-block h-2 w-2 rounded-sm bg-purple-400" />
      {title}
    </h2>
    <div className="rounded-xl border-2 border-dashed border-purple-400/60 p-5">
      {children}
    </div>
  </section>
);

// ==========================================================
//  ChipGroup (inline helper)
// ==========================================================
function ChipGroup() {
  const items = [
    { label: "All Patients", count: 9 },
    { label: "Critical", count: 3, color: "bg-red-600 text-white" },
    { label: "High Risk", count: 4, color: "bg-orange-500 text-black" },
    { label: "Moderate Risk", count: 2, color: "bg-amber-500 text-black" },
    { label: "Low Risk", count: 4, color: "bg-green-600 text-black" },
  ];
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-gray-200 p-1.5">
      {items.map((item, idx) => (
        <Chip
          key={item.label}
          label={item.label}
          count={item.count}
          selected={idx === selectedIndex}
          onSelectedChange={() => setSelectedIndex(idx)}
          badgeClassName={item.color} // pass full "bg-xxx text-white"
        />
      ))}
    </div>
  );
}

// ==========================================================
//  Main Showcase Component
// ==========================================================
export default function ComponentsShowcase() {
  const [page, setPage] = useState(1);
  const total = 97;
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  const [segValue, setSegValue] = useState<"grid" | "list">("grid");

  return (
    <Layout>
      <div className="mx-auto w-full max-w-5xl space-y-10 rounded-lg p-6">
        {/* Overall Severity */}
        <Section title="Overall Severity Indicator">
          <div className="space-y-4">
            <OverallSeverityIndicator variant="critical" />
            <OverallSeverityIndicator variant="high" />
            <OverallSeverityIndicator variant="moderate" />
            <OverallSeverityIndicator variant="low" />
          </div>
        </Section>

        {/* Dot Table */}
        <Section title="Dot Table Risk Indicator">
          <div className="space-y-4">
            <DotTableRiskIndicator variant="critical" />
            <DotTableRiskIndicator variant="high" />
            <DotTableRiskIndicator variant="moderate" />
            <DotTableRiskIndicator variant="low" />
          </div>
        </Section>

        {/* Banner */}
        <Section title="Banner Risk Indicator">
          <div className="flex flex-col gap-4">
            <BannerRiskIndicator variant="critical" />
            <BannerRiskIndicator variant="high" />
            <BannerRiskIndicator variant="moderate" />
            <BannerRiskIndicator variant="low" />
          </div>
        </Section>

        {/* Pagination */}
        <Section title="Pagination">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            itemsPerPage={pageSize}
            onPageChange={setPage}
          />
        </Section>

        {/* Radio Button */}
        <Section title="Radio Button">
          <RadioButton />
        </Section>

        {/* Inline Radio */}
        <Section title="Simple inline list">
          <RadioButtonInline />
        </Section>

        {/* Patient Banner */}
        <Section title="Patient Banner">
          <PatientBanner />
        </Section>

        {/* Segmented Controls */}
        <Section title="Segmented Controls">
          <div className="flex flex-wrap gap-4">
            <SegmentedControls value={segValue} onChange={setSegValue} />
          </div>
        </Section>

        {/* Chips */}
        <Section title="Chips">
          <div className="flex gap-5 items-center">
            <Chip label="Standalone Chip" count={5} />
            <ChipGroup />
          </div>
        </Section>

        {/* Search Bar */}
        <Section title="Search Bar">
          <SearchBar />
        </Section>

        {/* Input Fields */}
        <Section title="Input Fields">
          <div className="space-y-6">
            <InputField
              label="Address"
              id="address"
              name="address"
              placeholder="123 Main St"
            />
            <InputField
              label="Email"
              id="email"
              name="email"
              type="email"
              defaultValue="invalid-email"
              state="error"
              message="Not a valid email address."
            />
            <InputField
              label="Password"
              id="password"
              name="password"
              type="password"
              defaultValue="123"
              state="warning"
              message="Password is too weak."
            />
            <InputField
              label="Username"
              id="username"
              name="username"
              defaultValue="john_doe"
              state="success"
              message="Looks good!"
            />
            <InputField
              label="Phone"
              id="phone"
              name="phone"
              placeholder="(555) 123-4567"
              validate={(val) =>
                /^\d{10}$/.test(val.replace(/\D/g, ""))
                  ? null
                  : "Enter a 10-digit number"
              }
              showErrorOn="blur"
            />
            <TextAreaField placeholder="Enter Description" />
          </div>
        </Section>

        <Section title="Date Picker">
          <DatePickerField />
        </Section>

        {/* Primary Buttons */}
        <Section title="Primary Buttons">
          <div className="flex flex-col gap-3">
            <PrimaryButton
              variant="dark"
              iconType="submit"
              label="Submit Form"
            />
            <PrimaryButton variant="light" iconType="cancel" label="Cancel" />
            <PrimaryButton
              variant="dark"
              iconType="addPatient"
              label="Add Patient"
            />
            <PrimaryButton
              variant="light"
              iconType="addPatient"
              label="Add Patient"
            />
          </div>
        </Section>

        {/* Action Buttons */}
        <Section title="Action Buttons">
          <div className="flex flex-col gap-3">
            <ActionButton variant="dark" type="icon" />
            <ActionButton variant="light" type="icon" />
            <ActionButton variant="dark" type="text" label="View Patient" />
            <ActionButton variant="light" type="text" label="View Patient" />
          </div>
        </Section>

        {/* Form Buttons */}
        <Section title="Form Buttons">
          <div className="flex flex-col gap-3">
            <FormButton variant="dark" label="Submit Dark" />
            <FormButton variant="light" label="Submit Light" />
          </div>
        </Section>

        {/* Resources Cards */}
        <Section title="Resources Cards">
          <div className="flex flex-col gap-6">
            <ResourcesCard
              image="/assets/images/card-imgs/resources-card-img.png"
              category="CATEGORY"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dignissim gravida eros. Nulla aliquet elit eget."
              link="https://example.com"
              linkType="external"
            />
            <ResourcesCard
              image="/assets/images/card-imgs/resources-card-img.png"
              category="CATEGORY"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dignissim gravida eros. Nulla aliquet elit eget."
              link="/resources/1"
              linkType="internal"
            />
          </div>
        </Section>

        {/* OverallSeverityCards */}
        <Section title="OverallSeverityCards">
          <OverallSeverityCards />
        </Section>

        {/* SummaryCards */}
        <Section title="SummaryCards">
          {/* 👇 just wrap once in a grid */}
          <div className="grid grid-cols-2 gap-6">
            <SummaryCards />
          </div>
        </Section>

        {/* Statistics Card */}
        <Section title="Statistics Card">
          <div className="flex gap-6">
            <StatisticsCard />
          </div>
        </Section>

        {/* Patient Cards */}
        <Section title="Patient Cards">
          <div className="grid grid-cols-2 gap-6">
            <PatientCard
              name="William Alexander"
              age={68}
              gender="M"
              score={10}
              riskLevel="low"
              risks={[
                "Caregiver is unable to continue care",
                "Has risk for recurrent falls",
              ]}
            />
            <PatientCard
              name="Olivia Whitmore"
              age={75}
              gender="F"
              score={18}
              riskLevel="moderate"
              risks={[
                "Caregiver is unable to continue care",
                "Has risk for recurrent falls",
              ]}
            />
            <PatientCard
              name="Lakshitha Karunathilaka"
              age={81}
              gender="M"
              score={23}
              riskLevel="high"
              risks={[
                "Caregiver is unable to continue care",
                "Has risk for recurrent falls",
              ]}
            />
            <PatientCard
              name="Charlotte Wentworth"
              age={91}
              gender="O"
              score={41}
              riskLevel="critical"
              risks={[
                "Caregiver is unable to continue care",
                "Has risk for recurrent falls",
              ]}
            />
          </div>
        </Section>

        {/* Action Trigger Cards */}
        <Section title="Action Trigger Cards">
          <div className="grid grid-cols-2 gap-4">
            <ActionTriggerCard
              date="2025 DEC 23 | 14:57"
              action="Continue monitoring unless other risk indicators exist"
              risk="low"
            />
            <ActionTriggerCard
              date="2025 DEC 23 | 14:57"
              action="Align with moderate-high stratification for timely action"
              risk="moderate"
            />
            <ActionTriggerCard
              date="2025 DEC 23 | 14:57"
              action="Escalate care immediately, regardless of stratification score"
              risk="high"
            />
          </div>
        </Section>
      </div>
    </Layout>
  );
}
