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

  const itemsPerPage = 10;

  // 🔎 Filter
  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 Paginate
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
            gender: r.gender === "F" ? "F" : "M",
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

          <div className="w-full max-w-sm">
            <SearchBar
              placeholder="Search Patient by name or ID"
              value={search}
              onChange={setSearch}
            />
          </div>
        </header>

        {/* Table */}
        <PatientManagementTable
          patients={paginated}
          onEdit={(p) => setEditOpen(true)}
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
      <EditPatientDrawer open={editOpen} onClose={() => setEditOpen(false)} />
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </Layout>
  );
}
