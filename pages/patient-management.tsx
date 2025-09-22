import React, { useState } from "react";
import Layout from "@/src/components/Layout";
import EditPatientDrawer from "@/src/components/Drawer/EditPatientDrawer";
import ConfirmDeleteModal from "@/src/components/Modal/ConfirmDeleteModal";
import SearchBar from "@/src/components/Forms/SearchBar";
import Pagination from "@/src/components/Pagination/Pagination";
import PatientManagementTable from "@/src/components/Tables/PatientManagementTable";

type Patient = {
  id: string;
  name: string;
  address: string;
  phone: string;
  gender: "M" | "F";
};

const allPatients: Patient[] = [];

export default function PatientManagementPage() {
  const [patients, setPatients] = useState<Patient[]>(allPatients);
  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [genderMenuOpen, setGenderMenuOpen] = useState(false);
  const [genderFilters, setGenderFilters] = useState<{ M: boolean; F: boolean; NA: boolean }>({ M: false, F: false, NA: false });

  const itemsPerPage = 10;

  // Filter
  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    const textMatch = p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const anyGender = genderFilters.M || genderFilters.F || genderFilters.NA;
    const genderMatch = !anyGender
      ? true
      : (p.gender as any) === "M"
        ? genderFilters.M
        : (p.gender as any) === "F"
          ? genderFilters.F
          : genderFilters.NA;
    return textMatch && genderMatch;
  });

  // Paginate
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  React.useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch("/api/patients");
        const json = await resp.json();
        if (resp.ok && json?.ok) {
          const mapped: Patient[] = (json.data as any[]).map((r) => ({
            id: r.id,
            name: r.name,
            address: r.address || "",
            phone: r.phone || "",
            gender:
              r.gender === "F" ? "F" : r.gender === "M" ? "M" : ("NA" as any),
          }));
          setPatients(mapped);
        }
      } catch (e) {
        // keep fallback data silently
      }
    };
    load();
    const handler = () => load();
    window.addEventListener("patients:reload", handler);
    return () => window.removeEventListener("patients:reload", handler);
  }, []);

  return (
    <Layout>
      <main className="mx-auto px-4 pb-4 pt-5 w-full rounded-xl border border-white bg-[rgba(0,0,0,0.00)] p-4">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black leading-9 tracking-tighter text-black font-dmsans">
              Patient Management
            </h1>
            <p className="text-base leading-6 font-normal text-gray-500">
              Stay in control of every patient’s journey
            </p>
          </div>

          <div className="w-full max-w-sm flex items-center gap-2 relative">
            <SearchBar
              placeholder="Search Patient by name or ID"
              value={search}
              onChange={setSearch}
            />
            <div className="relative">
              <button
                type="button"
                onClick={() => setGenderMenuOpen((v) => !v)}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
              >
                Gender
                <svg className="ml-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M6 8L10 12L14 8" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {genderMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-3 z-10">
                  {[
                    { key: "M", label: "Men" },
                    { key: "F", label: "Women" },
                    { key: "NA", label: "Not Prefer" },
                  ].map((opt) => (
                    <label key={opt.key} className="flex items-center gap-2 py-1 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={(genderFilters as any)[opt.key]}
                        onChange={(e) =>
                          setGenderFilters((prev) => ({ ...prev, [opt.key]: e.target.checked } as any))
                        }
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      className="text-xs text-gray-600 underline"
                      onClick={() => setGenderFilters({ M: false, F: false, NA: false })}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      className="ml-auto text-xs text-gray-600 underline"
                      onClick={() => setGenderMenuOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Table */}
        <PatientManagementTable
          patients={paginated}
          onEdit={(p) => {
            setPatientToEdit(p);
            setEditOpen(true);
          }}
          onDelete={(p) => {
            setPatientToDelete(p);
            setDeleteOpen(true);
          }}
        />

        {/* Pagination */}
        <div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      {/* Drawer & Modal */}
      <EditPatientDrawer
        open={editOpen}
        patientId={patientToEdit?.id}
        onClose={() => setEditOpen(false)}
      />
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async (reason) => {
          if (!patientToDelete) return;
          try {
            const resp = await fetch(`/api/patients/${patientToDelete.id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reason }),
            });
            const json = await resp.json();
            if (!resp.ok || !json?.ok)
              throw new Error(json?.error || "Delete failed");
            window.dispatchEvent(new Event("patients:reload"));
            setPatients((prev) =>
              prev.filter((x) => x.id !== patientToDelete.id)
            );
          } catch (e) {
            alert("Failed to delete patient.");
          }
        }}
      />
    </Layout>
  );
}
